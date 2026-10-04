import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import coach from "@/lib/project-coach.json";

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };
type Level = "Beginner" | "Intermediate" | "Advanced";

type Project = {
  title: string;
  tagline: string;
  description: string;
  tech_stack: string[];
  experience_level: Level;
  estimated_time: string;
  overview: string;
  dashboard_url: string | null;
  dashboard_status: "pending" | "ready";
  dashboard_link_label: string;
  dashboard_description: string;
  revision_invitation: string;
};

type CoachResponse = {
  response_type: "question" | "project_card" | "mentoring";
  message: string;
  question: string | null;
  suggested_answers: string[];
  project: Project | null;
};

const isStr = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

function toProject(raw: unknown): Project | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;

  const required = [
    "title",
    "tagline",
    "description",
    "estimated_time",
    "overview",
    "dashboard_link_label",
    "dashboard_description",
    "revision_invitation",
  ];
  for (const key of required) if (!isStr(p[key])) return null;

  const stack = p.tech_stack;
  if (!Array.isArray(stack) || !stack.every(isStr)) return null;

  const level = p.experience_level;
  if (level !== "Beginner" && level !== "Intermediate" && level !== "Advanced") {
    return null;
  }

  return {
    title: p.title as string,
    tagline: p.tagline as string,
    description: p.description as string,
    tech_stack: stack,
    experience_level: level,
    estimated_time: p.estimated_time as string,
    overview: p.overview as string,
    // The application owns dashboards. Until we have a verified URL for this
    // project, never trust anything the model returns here.
    dashboard_url: null,
    dashboard_status: "pending",
    dashboard_link_label: p.dashboard_link_label as string,
    dashboard_description: p.dashboard_description as string,
    revision_invitation: p.revision_invitation as string,
  };
}

function toCoachResponse(raw: unknown): CoachResponse | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const type = r.response_type;
  if (type !== "question" && type !== "project_card" && type !== "mentoring") {
    return null;
  }
  if (!isStr(r.message)) return null;

  const answers = Array.isArray(r.suggested_answers)
    ? r.suggested_answers.filter(isStr).slice(0, 3)
    : [];
  const question = isStr(r.question) ? r.question : null;

  if (type === "project_card") {
    const project = toProject(r.project);
    if (!project) return null;
    return {
      response_type: type,
      message: r.message,
      question: null,
      suggested_answers: [],
      project,
    };
  }

  if (type === "question" && !question) return null;

  return {
    response_type: type,
    message: r.message,
    question,
    suggested_answers: answers,
    project: null,
  };
}

// Plain-text version of the response for the current chat UI (no markdown).
function formatReply(d: CoachResponse): string {
  const parts = [d.message];
  if (d.project) {
    const p = d.project;
    parts.push(
      `${p.title}\n${p.tagline}`,
      p.description,
      `Tech stack: ${p.tech_stack.join(", ")}\nExperience level: ${p.experience_level}\nEstimated time: ${p.estimated_time}`,
      `Project overview:\n${p.overview}`,
      p.revision_invitation
    );
  }
  if (d.question) parts.push(d.question);
  if (d.suggested_answers.length) {
    parts.push(`Quick answers: ${d.suggested_answers.join(" / ")}`);
  }
  return parts.join("\n\n");
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Mentor is not configured" }, { status: 500 });
  }

  let body: { messages?: ChatMessage[]; plan?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const messages = (body.messages ?? [])
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-MAX_MESSAGES);

  // Gemini expects the conversation to start with a user turn
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (messages.length === 0) {
    return NextResponse.json({ error: "No message to answer" }, { status: 400 });
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content.slice(0, MAX_CHARS) }],
  }));

  const planText = body.plan
    ? JSON.stringify(body.plan).slice(0, 6000)
    : "No plan has been generated yet.";

  const examples = JSON.stringify(
    [
      coach.expected_output_example,
      coach.expected_question_output,
      coach.expected_mentoring_output,
    ],
    null,
    2
  );

  const systemInstruction = `${coach.system_instruction}

EXAMPLE CONTEXT (for the project card example): ${coach.expected_output_context}

EXAMPLES (structure and tone only):
${examples}

APPLICATION CONTEXT:
- Dashboard URL supplied by the application: none. Return dashboard_url as null and dashboard_status as pending.
- Current plan (JSON): ${planText}`;

  const ai = new GoogleGenAI({ apiKey });

  // Try twice in case the model returns malformed JSON
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseJsonSchema: coach.response_schema,
        },
      });

      const text = (response.text ?? "").replace(/```json|```/g, "").trim();
      const data = toCoachResponse(JSON.parse(text));
      if (data) {
        return NextResponse.json({ reply: formatReply(data), data });
      }
      console.warn(`[chat] attempt ${attempt + 1}: response failed validation`);
    } catch (err) {
      console.error(`[chat] attempt ${attempt + 1} error:`, err);
    }
  }

  return NextResponse.json({ error: "Mentor unavailable" }, { status: 502 });
}