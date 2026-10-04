"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ArrowRight,
  ChevronDown,
  CircleHelp,
  FileImage,
  Globe,
  Lightbulb,
  Loader2,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { isDashboardPlan, writeStored, type Experience } from "@/lib/dashboard-plan";

type ImageAttachment = { name: string; mimeType: string; data: string };

const starters = [
  {
    title: "What do you want to make?",
    description: "A useful tool, a game, a better everyday experience?",
    idea: "I want to make a campus spending tracker that helps students see where their money goes and set a weekly budget.",
    className: "md:-rotate-[5deg] md:translate-y-3",
  },
  {
    title: "Start with a what if...",
    description: "You don't need a finished idea. A curious question is enough.",
    idea: "What if neighbors could easily share extra food, tools, and things they no longer need?",
    className: "md:z-10 md:-translate-y-3 md:scale-105",
  },
  {
    title: "Let's find your first move.",
    description: "We'll figure out the scope, tools, and skills together.",
    idea: "I want to build a simple website, but I need help choosing a useful idea and figuring out where to start.",
    className: "md:rotate-[5deg] md:translate-y-3",
  },
];

const experienceOptions: Array<{ value: Experience; label: string }> = [
  { value: "starting", label: "Just starting" },
  { value: "building", label: "Built a few things" },
  { value: "experienced", label: "Experienced" },
];

const notes = ["Project brief", "Suggested tech stack", "Milestones & task recommendations", "Skills you'll learn"];

function readImage(file: File): Promise<ImageAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === "string" ? reader.result.split(",")[1] : "";
      if (data) resolve({ name: file.name, mimeType: file.type, data });
      else reject(new Error("Couldn't read that image. Try another file."));
    };
    reader.onerror = () => reject(new Error("Couldn't read that image. Try another file."));
    reader.readAsDataURL(file);
  });
}

const eyebrow = "font-mono text-[9px] uppercase tracking-[.1em] text-[#55493c]";

export default function MentorWorkspace() {
  const router = useRouter();
  const [idea, setIdea] = useState("");
  const [experience, setExperience] = useState<Experience>("starting");
  const [hoursPerWeek, setHoursPerWeek] = useState(4);
  const [attachment, setAttachment] = useState<ImageAttachment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || idea.trim().length < 10) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          experience,
          hoursPerWeek,
          attachment: attachment ? { mimeType: attachment.mimeType, data: attachment.data } : undefined,
        }),
      });
      const result = (await response.json()) as { plan?: unknown; error?: unknown };
      if (!response.ok || !isDashboardPlan(result.plan)) {
        throw new Error(
          typeof result.error === "string" ? result.error : "Couldn't generate a plan. Please try again.",
        );
      }
      writeStored({ plan: result.plan, hoursPerWeek, status: {} });
      router.push("/dashboard");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Couldn't generate a plan.");
      setLoading(false);
    }
  }

  async function attachImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError("Choose a PNG, JPG, or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Images must be smaller than 5 MB.");
      return;
    }
    try {
      setAttachment(await readImage(file));
      setError("");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Couldn't read that image.");
    }
  }

  function reset() {
    setIdea("");
    setAttachment(null);
    setError("");
    setExperience("starting");
    setHoursPerWeek(4);
  }

  return (
    <main className="min-h-screen px-4 pb-10 pt-4 text-[#2b2014] sm:px-8">
      <div className="mx-auto grid max-w-[1376px] gap-5 rounded-lg bg-[linear-gradient(135deg,#e9ddbb,#d8c9a2)] p-4 shadow-[0_14px_30px_rgba(0,0,0,.55)] lg:grid-cols-[280px_1fr] lg:p-5">
        <aside className="flex flex-col gap-5 p-3 lg:p-4">
          <div>
            <p className={eyebrow}>YOUR CASE FILE</p>
            <h1 className="mt-6 font-serif text-2xl font-bold leading-tight">
              {idea.trim() ? idea.trim().replace(/\s+/g, " ").slice(0, 36) : "Untitled blueprint"}
            </h1>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="mt-6 flex w-full items-center gap-2 rounded-lg bg-[#6f2416] px-4 py-3 font-mono text-[11px] text-[#f5e9cc] hover:bg-[#8a2f1e] disabled:opacity-60"
            >
              <Plus className="size-3" /> New conversation
            </button>
          </div>

          <div>
            <p className={eyebrow}>CONVERSATIONS</p>
            <div className="mt-3 rounded-xl bg-[#f1e8d0] px-4 py-3 shadow-[0_3px_6px_rgba(0,0,0,.18)]">
              <p className="text-sm font-bold">Your first spark</p>
              <p className="mt-1 font-mono text-[10px]">Current conversation</p>
            </div>
            <p className="mt-4 text-sm leading-snug text-[#3d3326]">More chats can live inside this project&apos;s case file.</p>
          </div>

          <div className="rounded-xl bg-[#efe5c8]/80 px-4 pb-5 pt-0 shadow-[0_3px_6px_rgba(0,0,0,.15)]">
            <div className="-mx-4 h-1.5 bg-[#8a7240]" aria-hidden="true">
              <span className="block h-full bg-[#6f2416]" style={{ width: idea.trim().length >= 10 ? "60%" : "18%" }} />
            </div>
            <p className={`${eyebrow} mt-4`}>BLUEPRINT NOTES</p>
            <h2 className="mt-5 font-serif text-xl font-bold leading-tight">Your plan takes shape here.</h2>
            <ul className="mt-4 space-y-2 text-[13px]">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </aside>

        <section className="flex min-h-[640px] flex-col rounded-md bg-[linear-gradient(180deg,#efe4c6,#e6d9b6)] px-5 pb-6 pt-8 sm:px-10">
          <header>
            <h2 className="font-serif text-3xl font-bold">Let&apos;s make the blueprint for your project.</h2>
            <p className="mt-3 text-[15px] text-[#3d3326]">
              Start with a spark. Your project assistant will help turn it into a plan you can build.
            </p>
          </header>

          <div className="mt-6 flex flex-1 items-center border-t border-[#d1c39b] bg-[repeating-linear-gradient(180deg,transparent_0,transparent_27px,rgba(160,140,95,.22)_28px)] py-10">
            <div className="mx-auto grid w-full max-w-3xl gap-6 md:grid-cols-3" aria-label="Idea prompts">
              {starters.map((starter, index) => (
                <button
                  key={starter.title}
                  type="button"
                  onClick={() => {
                    setIdea(starter.idea);
                    composerRef.current?.focus();
                  }}
                  className={`relative flex min-h-[150px] flex-col rounded-xl bg-[linear-gradient(160deg,#f4ecd3,#e3d5ae)] p-5 text-left shadow-[0_10px_18px_rgba(0,0,0,.3)] transition-transform hover:-translate-y-1 ${starter.className}`}
                >
                  <span className="font-serif text-xl font-bold leading-tight">{starter.title}</span>
                  <span className="mt-2 text-xs leading-snug text-[#3d3326]">{starter.description}</span>
                  <span className="mt-auto flex gap-3 pt-4 text-[#55493c]" aria-hidden="true">
                    {index === 0 ? <Globe className="size-3" /> : <Lightbulb className="size-3" />}
                    <Sparkles className="size-3" />
                    <ArrowRight className="size-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={generate} className="mx-auto mt-6 w-full max-w-[640px]">
            <div className="rounded-2xl border border-[#8c806a] bg-[#f3ead0] px-5 py-4">
              <textarea
                ref={composerRef}
                required
                minLength={10}
                maxLength={1000}
                rows={2}
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder="I want to build a campus spending tracker that helps students see where their money goes and set a weekly budget."
                aria-label="Describe your project idea"
                className="w-full resize-none bg-transparent text-sm leading-snug outline-none placeholder:text-[#8c806a]"
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-label="Attach an image"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex size-7 items-center justify-center rounded-full bg-[#d8c9a2] hover:bg-[#cdbd92]"
                >
                  <Plus className="size-4" />
                </button>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={attachImage} />
                {attachment && (
                  <span className="flex items-center gap-1.5 rounded-md bg-[#e1d4ae] px-2.5 py-1 text-[11px]">
                    <FileImage className="size-3" />
                    {attachment.name}
                    <button type="button" aria-label="Remove image" onClick={() => setAttachment(null)}>
                      <X className="size-3" />
                    </button>
                  </span>
                )}
                <details className="relative ml-auto">
                  <summary className="flex cursor-pointer list-none items-center gap-1 font-mono text-[10px] text-[#55493c]">
                    {experienceOptions.find((option) => option.value === experience)?.label} · {hoursPerWeek} h/week
                    <ChevronDown className="size-3" />
                  </summary>
                  <div className="absolute bottom-7 right-0 z-20 w-64 space-y-2 rounded-lg border border-[#a99b7d] bg-[#fffdf5] p-3 text-xs shadow-lg">
                    <label htmlFor="mentor-experience" className="block font-mono text-[10px] uppercase">Your experience</label>
                    <select
                      id="mentor-experience"
                      value={experience}
                      onChange={(event) => setExperience(event.target.value as Experience)}
                      className="w-full border border-[#a99b7d] bg-white p-1.5"
                    >
                      {experienceOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <label htmlFor="mentor-hours" className="block font-mono text-[10px] uppercase">Time: {hoursPerWeek} h / week</label>
                    <input
                      id="mentor-hours"
                      type="range"
                      min={1}
                      max={20}
                      value={hoursPerWeek}
                      onChange={(event) => setHoursPerWeek(Number(event.target.value))}
                      className="w-full accent-[#6f2416]"
                    />
                  </div>
                </details>
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-3 text-sm text-[#923d29]">
                {error}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div className="font-mono text-[10px] leading-relaxed text-[#55493c]">
                <p>Attach images with + · Shift + Enter for a new line</p>
                <p className="mt-2">Suggested plans are drafts. Review the scope and pace before starting.</p>
              </div>
              <button
                type="submit"
                disabled={loading || idea.trim().length < 10}
                className="inline-flex items-center gap-2 rounded-lg bg-[#6f2416] px-6 py-3 text-sm font-semibold text-[#f5e9cc] hover:bg-[#8a2f1e] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    Making your blueprint... <Loader2 className="size-3.5 animate-spin" />
                  </>
                ) : (
                  <>
                    Generate my project plan <ArrowRight className="size-3.5" />
                  </>
                )}
              </button>
            </div>
            <p className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-[#55493c]">
              <CircleHelp className="size-3" /> Your project notes are sent to Gemini to create your personalized blueprint.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
