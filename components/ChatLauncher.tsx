"use client";

import { useState } from "react";
import MentorChat from "@/components/MentorChat";

export default function ChatLauncher({ plan }: { plan?: unknown }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 z-50 h-[28rem] w-[calc(100vw-2rem)] max-w-sm shadow-xl">
          <MentorChat plan={plan} />
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close mentor chat" : "Open mentor chat"}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg"
      >
        {open ? "Close" : "Ask mentor"}
      </button>
    </>
  );
}