import { isIdeaPlan, type IdeaPlan } from "@/lib/idea-plan";

const MAX_REQUEST_BYTES = 12 * 1024;

const responseSchema = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    summary: { type: "STRING" },
    techStack: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          purpose: { type: "STRING" },
        },
        required: ["name", "purpose"],
      },
    },
    languagesToLearn: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          name: { type: "STRING" },
          why: { type: "STRING" },
          order: { type: "INTEGER" },
        },
        required: ["name", "why", "order"],
      },
    },
    milestones: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          title: { type: "STRING" },
          description: { type: "STRING" },
          tasks: { type: "ARRAY", items: { type: "STRING" } },
          estimatedHours: { type: "INTEGER" },
        },
        required: ["title", "description", "tasks", "estimatedHours"],
      },
    },
    firstStep: { type: "STRING" },
  },
  required: ["title", "summary", "techStack", "languagesToLearn", "milestones", "firstStep"],
};

function jsonError(message: string, status: number) {
  return Response.json(
    { error: message },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return jsonError("Requests must come from this application.", 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonError("Send the request as JSON.", 415);
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_REQUEST_BYTES) {
    return jsonError("The request is too large.", 413);
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonError("Gemini is not configured yet. Add GEMINI_API_KEY to .env.local and restart the app.", 503);
  }

  let body: unknown;
  const reader = request.body?.getReader();
  if (!reader) {
    return jsonError("Send a valid JSON request.", 400);
  }

  const decoder = new TextDecoder();
  let rawBody = "";
  let bytesRead = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytesRead += value.byteLength;
      if (bytesRead > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return jsonError("The request is too large.", 413);
      }
      rawBody += decoder.decode(value, { stream: true });
    }
    rawBody += decoder.decode();
    body = JSON.parse(rawBody);
  } catch {
    return jsonError("Send a valid JSON request.", 400);
  } finally {
    reader.releaseLock();
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonError("Send a valid project idea.", 400);
  }

  const { idea, experience, hoursPerWeek } = body as Record<string, unknown>;
  if (typeof idea !== "string" || idea.trim().length < 10 || idea.trim().length > 2000) {
    return jsonError("Describe your idea in 10 to 2,000 characters.", 400);
  }
  if (!["starting", "building", "experienced"].includes(String(experience))) {
    return jsonError("Choose a valid experience level.", 400);
  }
  if (
    typeof hoursPerWeek !== "number" ||
    !Number.isInteger(hoursPerWeek) ||
    hoursPerWeek < 1 ||
    hoursPerWeek > 40
  ) {
    return jsonError("Choose between 1 and 40 hours per week.", 400);
  }

  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";
  const prompt = `You are a thoughtful, practical technical mentor helping someone turn an idea into a real project.

Create a realistic, beginner-friendly project plan for this idea:
${idea.trim()}

The builder's experience level is ${experience}, and they can spend ${hoursPerWeek} hours per week.
Recommend a small, coherent technology stack. Explain what each technology does. List languages in the order they should be learned and explain why each matters to this project. Break the work into 3 to 6 achievable milestones with specific tasks and realistic total estimated hours for each milestone. Make the first step something they can do today. Keep the initial version achievable; avoid unnecessary services and advanced tools. Use clear, encouraging language, define jargon, and don't claim that the user already knows a language or tool.`;

  let response: Response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema,
            maxOutputTokens: 3072,
          },
        }),
        signal: AbortSignal.timeout(45_000),
        cache: "no-store",
      },
    );
  } catch {
    console.error("Gemini request failed.");
    return jsonError("Could not reach Gemini. Check your connection and try again.", 502);
  }

  if (!response.ok) {
    console.error(`Gemini returned HTTP ${response.status} ${response.statusText}`);
    if (response.status === 401 || response.status === 403) {
      return jsonError("Gemini rejected the API key. Check GEMINI_API_KEY in .env.local.", 502);
    }
    if (response.status === 429) {
      return jsonError("Gemini is busy or the API quota has been reached. Try again shortly.", 429);
    }
    return jsonError("Gemini could not create a plan right now. Please try again.", 502);
  }

  let result: unknown;
  try {
    result = await response.json();
  } catch {
    console.error("Gemini returned a non-JSON response.");
    return jsonError("Gemini returned an unreadable response. Please try again.", 502);
  }

  if (typeof result !== "object" || result === null) {
    console.error("Gemini response was not a JSON object.");
    return jsonError("Gemini returned an unreadable response. Please try again.", 502);
  }

  const candidate = (
    result as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    }
  ).candidates?.[0];
  const text = candidate?.content?.parts?.find((part) => typeof part.text === "string")?.text;
  if (!text) {
    console.error("Gemini response did not include generated text.");
    return jsonError("Gemini did not return a project plan. Try rephrasing your idea.", 502);
  }

  let plan: unknown;
  try {
    plan = JSON.parse(text);
  } catch {
    console.error("Gemini returned invalid project plan JSON.");
    return jsonError("Gemini returned an invalid plan. Please try again.", 502);
  }

  if (!isIdeaPlan(plan)) {
    console.error("Gemini project plan did not match the expected format.");
    return jsonError("Gemini returned an incomplete plan. Please try again.", 502);
  }

  return Response.json(plan satisfies IdeaPlan, {
    headers: { "Cache-Control": "no-store" },
  });
}
