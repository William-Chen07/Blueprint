import { config } from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { fileURLToPath } from "node:url";

config({ path: fileURLToPath(new URL(".env.local", import.meta.url)) });

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing. Add it to the project root .env.local file.");
    process.exitCode = 1;
    return;
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      contents: "Say exactly: Gemini API is working!",
    });

    console.log("Gemini response:");
    console.log(response.text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const safeMessage = message
      .replaceAll(apiKey, "[REDACTED]")
      .replace(/([?&](?:key|api_key)=)[^&\s"'\\]+/gi, "$1[REDACTED]")
      .replace(/AIza[0-9A-Za-z_-]{20,}/g, "[REDACTED]")
      .slice(0, 1000);
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? ` (HTTP ${String(error.status)})`
        : "";
    console.error(`Gemini API request failed${status}: ${safeMessage}`);
    process.exitCode = 1;
  }
}

main();