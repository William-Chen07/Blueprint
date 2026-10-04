import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const MAX_MESSAGES = 20;
const MAX_CHARS = 2000;

type ChatMessage = { role: "user" | "assistant"; content: string };

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

  const systemInstruction = `You are a patient, encouraging mentor for a beginner working on a coding project.
Help them understand the next step in their plan. Keep answers short (a few sentences),
use plain language, and give a hint or small example instead of dumping a full solution.
If they ask something unrelated to their project or learning to code, gently steer back.

The learner's current plan (JSON):
${planText}`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? "gemini-3.8-flash",
      contents,
      config: { systemInstruction },
    });

    const reply = response.text?.trim();
    if (!reply) throw new Error("Empty response from Gemini");

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("[chat] Gemini error:", err);
    return NextResponse.json({ error: "Mentor unavailable" }, { status: 502 });
  }
}
