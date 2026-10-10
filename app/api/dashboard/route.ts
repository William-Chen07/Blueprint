import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { isDashboardPlan, type Experience } from "@/lib/dashboard-plan";
import { ratelimit, getClientKey } from "@/lib/ratelimit";

const EXPERIENCE_LABELS: Record<Experience, string> = {
  starting: "just starting out",
  building: "has built a few small things",
  experienced: "experienced",
};

const SCHEMA_DESCRIPTION = `Return ONLY a JSON object with exactly this shape (no markdown):
{
  "projectName": string,
  "tagline": string (one sentence),
  "duration": string (total time to a first version, e.g. "2 weeks"),
  "brief": { "summary": string, "audience": string, "firstVersion": string },
  "stack": string[] (2-5 short tool names, e.g. "Python", "Streamlit", "GitHub"),
  "setupSteps": string[] (3-6 first-time setup steps),
  "pieces": [{ "name": string, "role": string }] (2-5 parts of the project and how they connect),
  "milestones": [{
    "title": string, "goal": string, "timeframe": string (e.g. "Week 1"),
    "tasks": [{ "title": string, "skill": string (what the learner picks up, e.g. "Git & version control"), "time": string (e.g. "45 min" or "1 hour") }] (2-4 tasks)
  }] (3-4 milestones, in build order),
  "buildGuide": {
    "todayTitle": string, "todayTime": string (e.g. "About 1 hour"),
    "todaySteps": string[] (3-6), "tips": string[] (3-5 tips for keeping scope manageable)
  },
  "chatPrompts": string[] (3-4 short questions the learner might ask a mentor about this plan)
}
Every string must be under 500 characters.`;

export async function POST(req: Request) {
  const { success, remaining, resetAt } = ratelimit(getClientKey(req));
  if (!success) {
    return NextResponse.json(
      { error: "Rate limited. Try again in a minute." },
      { status: 429, headers: { "X-RateLimit-Remaining": "0", "X-RateLimit-Reset": String(resetAt) } }
    );
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Plan generation is not configured" }, { status: 500 });
  }

  let body: { idea?: unknown; experience?: unknown; hoursPerWeek?: unknown; attachment?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const idea = typeof body.idea === "string" ? body.idea.trim().slice(0, 1000) : "";
  const experience: Experience =
    body.experience === "building" || body.experience === "experienced" ? body.experience : "starting";
  const hours =
    typeof body.hoursPerWeek === "number" && body.hoursPerWeek >= 1 && body.hoursPerWeek <= 40
      ? Math.round(body.hoursPerWeek)
      : 4;

  const attachment = body.attachment as { mimeType?: unknown; data?: unknown } | undefined;
  const image =
    attachment &&
    typeof attachment.mimeType === "string" &&
    ["image/png", "image/jpeg", "image/webp"].includes(attachment.mimeType) &&
    typeof attachment.data === "string" &&
    attachment.data.length <= 7_000_000
      ? { inlineData: { mimeType: attachment.mimeType, data: attachment.data } }
      : null;

  const request = idea
    ? `The learner's idea: ${idea}`
    : "The learner has no idea yet. Invent one fresh, specific, motivating project idea that a student would be proud to show others.";

  const systemInstruction = `You design beginner-friendly software project plans for students.
The learner is ${EXPERIENCE_LABELS[experience]} and has about ${hours} hours per week.
Keep the scope small enough for a first version to be finished in 2-4 weeks at that pace.
Prefer free, popular tools. Be concrete and encouraging, not generic.

${SCHEMA_DESCRIPTION}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
      contents: [{ role: "user", parts: image ? [{ text: request }, image] : [{ text: request }] }],
      config: { systemInstruction, responseMimeType: "application/json" },
    });

    const raw = response.text?.trim();
    if (!raw) throw new Error("Empty response from Gemini");
    const plan: unknown = JSON.parse(raw);
    if (!isDashboardPlan(plan)) throw new Error("Gemini returned an incomplete plan");

    return NextResponse.json({ plan });
  } catch (err) {
    console.error("[dashboard] Gemini error:", err);
    return NextResponse.json({ error: "Couldn't generate a plan. Please try again." }, { status: 502 });
  }
}
