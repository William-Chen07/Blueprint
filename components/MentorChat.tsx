"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function MentorChat({
  plan,
  suggestions = [],
  className = "rounded-lg border bg-background",
}: {
  plan?: unknown;
  suggestions?: string[];
  className?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your mentor. Ask me anything about your plan or the step you're on.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function playAudio(text: string) {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (!res.ok) {
        const errData = await res.json();
        console.error("TTS API error:", errData);
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = url;
        await audioRef.current.play();
      }
    } catch (e) {
      console.error("Audio playback failed:", e);
    }
  }

  async function send(override?: string) {
    const text = (override ?? input).trim();
    if (!text || loading) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, plan }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      
      const replyContent = data.reply;
      setMessages([...next, { role: "assistant", content: replyContent }]);

      // Audio is now manual-only via the 🔊 Listen button
    } catch {
      setError("The mentor couldn't answer right now. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`flex h-full flex-col ${className}`}>
      <div className="border-b px-4 py-3 font-semibold">Mentor</div>

      {/* Hidden audio element bound to a direct user action / ref */}
      <audio ref={audioRef} className="hidden" />

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
          >
            <div
              className={
                "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm " +
                (m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted")
              }
            >
              {m.content}
              {m.role === "assistant" && (
                <button
                  onClick={() => playAudio(m.content)}
                  className="ml-2 inline-flex items-center text-xs opacity-70 hover:opacity-100"
                  title="Listen to response"
                >
                  🔊 Listen
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-sm text-muted-foreground">Mentor is thinking...</div>
        )}
        {error && <div className="text-sm text-red-500">{error}</div>}
        {messages.length === 1 &&
          suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => send(suggestion)}
              disabled={loading}
              className="block w-full border border-[#a99b7d] bg-[#fffdf5] px-3 py-2 text-left text-xs text-[#35291f] hover:bg-[#f6e8c5] disabled:opacity-60"
            >
              {suggestion}
            </button>
          ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t p-3">
        <input
          className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
          placeholder="Ask your mentor..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          disabled={loading}
        />
        <Button onClick={() => send()} disabled={loading || !input.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}