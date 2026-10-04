import { Paperclip } from "lucide-react";

export function Pin({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute z-10 block ${className}`}>
      <span className="block size-4 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f0665c,#b32a24_70%)] shadow-[3px_6px_5px_rgba(0,0,0,.45)]" />
    </span>
  );
}

export function Clip({ className = "" }: { className?: string }) {
  return (
    <Paperclip
      aria-hidden="true"
      strokeWidth={1.5}
      className={`pointer-events-none absolute z-10 size-10 text-[#aab4c0] drop-shadow-[2px_3px_2px_rgba(0,0,0,.45)] ${className}`}
    />
  );
}
