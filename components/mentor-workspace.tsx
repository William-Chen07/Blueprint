"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMemo, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from "react";
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
import CoachReply, { type CoachData, type ProjectCard } from "@/components/coach-reply";
import {
  deleteConversation,
  newConversationId,
  parseConversations,
  readConversationsRaw,
  saveConversation,
  subscribeConversations,
  type SavedConversation,
} from "@/lib/conversations";
import { CHANGE_EVENT, STORAGE_KEY, isDashboardPlan, writeStored, type Experience } from "@/lib/dashboard-plan";

type ChatMessage = { role: "user" | "assistant"; content: string; data?: CoachData };
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

// Names the case file after the idea's topic instead of echoing its first words.
function topicTitle(idea: string) {
  const text = idea
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.!?]+$/, "")
    .replace(/^(hi|hello|hey)\b[,!. ]*/i, "")
    .replace(/^(what if|i('m| am) (thinking|trying|looking|planning)( of| to)?|i (want|would like|need|plan|wish|hope) to|i'd like to|(can|could) you help me|help me|let's|i have an idea (for|about))\s+/i, "")
    .replace(/^(make|build|create|design|develop|start|do|find)\s+/i, "")
    .replace(/^(an?|the|some|my)\s+/i, "");
  const words = text.split(" ").filter((word) => word && !/^(could|can|would|should|might)$/i.test(word));
  if (!words.length) return "";
  const stop = /^(that|which|who|where|so|because|but|and|helps?|lets?|to|for|with)$/i;
  const end = words.findIndex((word, index) => index >= 1 && stop.test(word));
  const topic = words.slice(0, Math.min(end === -1 ? 5 : end, 5)).join(" ").replace(/[,;:]+$/, "");
  return topic.replace(/(^|\s)(\p{L})/gu, (_, space: string, letter: string) => space + letter.toUpperCase());
}

function subscribeToSaved(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function hasSavedProject() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

const eyebrow = "font-mono text-[9px] uppercase tracking-[.1em] text-[#55493c]";

export default function MentorWorkspace() {
  const router = useRouter();
  const hasSaved = useSyncExternalStore(subscribeToSaved, hasSavedProject, () => false);
  const [idea, setIdea] = useState("");
  const [experience, setExperience] = useState<Experience>("starting");
  const [hoursPerWeek, setHoursPerWeek] = useState(4);
  const [attachment, setAttachment] = useState<ImageAttachment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [card, setCard] = useState<ProjectCard | null>(null);
  const [thinking, setThinking] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const rawConversations = useSyncExternalStore(subscribeConversations, readConversationsRaw, () => "");
  const conversations = useMemo(() => parseConversations(rawConversations), [rawConversations]);
  const projectLog = conversations.filter((item) => item.project);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstIdea = messages.find((message) => message.role === "user")?.content ?? idea;
  const hasReply = messages.some((message) => message.role === "assistant");
  const lastAssistant = messages.length ? messages[messages.length - 1] : undefined;

  function submitIdea(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void send(idea.trim());
  }

  async function send(text: string) {
    if (thinking || loading || !text || (messages.length === 0 && text.length < 10)) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setIdea("");
    setError("");
    setThinking(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const result = (await response.json()) as { reply?: unknown; data?: CoachData; error?: unknown };
      if (!response.ok || typeof result.reply !== "string") {
        throw new Error(
          response.status === 429 && typeof result.error === "string"
            ? result.error
            : "The mentor couldn't answer right now. Try again.",
        );
      }
      const withReply: ChatMessage[] = [...next, { role: "assistant", content: result.reply, data: result.data }];
      const nextCard = result.data?.project ?? card;
      const id = conversationId ?? newConversationId();
      setConversationId(id);
      setMessages(withReply);
      setCard(nextCard);
      saveConversation({
        id,
        title: topicTitle(next[0].content) || "Untitled blueprint",
        messages: withReply,
        card: nextCard,
        updatedAt: Date.now(),
      });
      setTimeout(() => transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (requestError) {
      setMessages(messages);
      setIdea(text);
      setError(requestError instanceof Error ? requestError.message : "The mentor couldn't answer right now.");
    } finally {
      setThinking(false);
    }
  }

  async function generate() {
    if (loading || thinking || !hasReply) return;
    const summary = card
      ? `${card.title} - ${card.tagline}. ${card.description} Tech stack: ${card.tech_stack.join(", ")}.`
      : messages.filter((message) => message.role === "user").map((message) => message.content).join(" ");
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: summary.slice(0, 1000),
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
      const id = conversationId ?? newConversationId();
      saveConversation({
        id,
        title: topicTitle(firstIdea) || result.plan.projectName,
        messages,
        card,
        updatedAt: Date.now(),
        project: { name: result.plan.projectName, plan: result.plan, hoursPerWeek, status: {}, createdAt: Date.now() },
      });
      writeStored({ plan: result.plan, hoursPerWeek, status: {}, conversationId: id });
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

  function openConversation(saved: SavedConversation) {
    if (thinking || loading) return;
    setConversationId(saved.id);
    setMessages(saved.messages);
    setCard(saved.card);
    setIdea("");
    setAttachment(null);
    setError("");
  }

  function openProject(saved: SavedConversation) {
    if (!saved.project) return;
    writeStored({
      plan: saved.project.plan,
      hoursPerWeek: saved.project.hoursPerWeek,
      status: saved.project.status,
      conversationId: saved.id,
    });
    router.push("/dashboard");
  }

  function removeConversation(id: string) {
    if (!window.confirm("Delete this conversation from your history?")) return;
    deleteConversation(id);
    if (id === conversationId) reset();
  }

  function reset() {
    setConversationId(null);
    setIdea("");
    setMessages([]);
    setCard(null);
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
              {topicTitle(firstIdea) || "Untitled blueprint"}
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
            <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
              {!conversationId && (
                <li className="rounded-xl bg-[#f1e8d0] px-4 py-3 shadow-[0_3px_6px_rgba(0,0,0,.18)]">
                  <p className="text-sm font-bold">{messages.length ? "Untitled blueprint" : "Your first spark"}</p>
                  <p className="mt-1 font-mono text-[10px]">Current conversation</p>
                </li>
              )}
              {conversations.map((saved) => (
                <li
                  key={saved.id}
                  className={`flex items-start gap-1 rounded-xl px-4 py-3 shadow-[0_3px_6px_rgba(0,0,0,.18)] ${
                    saved.id === conversationId ? "bg-[#f1e8d0]" : "bg-[#e2d5b0] hover:bg-[#ebdfbf]"
                  }`}
                >
                  <button type="button" onClick={() => openConversation(saved)} className="min-w-0 flex-1 text-left">
                    <p className="truncate text-sm font-bold">{saved.title}</p>
                    <p className="mt-1 font-mono text-[10px]">
                      {saved.id === conversationId ? "Current conversation" : new Date(saved.updatedAt).toLocaleDateString()}
                      {saved.project ? " · Plan made" : ""}
                    </p>
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete conversation "${saved.title}"`}
                    onClick={() => removeConversation(saved.id)}
                    className="shrink-0 text-[#6f2416] hover:text-[#8a2f1e]"
                  >
                    <X className="size-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            {hasSaved && (
              <Link href="/dashboard" className="mt-4 block font-mono text-[11px] font-bold text-[#6f2416] hover:underline">
                Open my current project →
              </Link>
            )}
          </div>

          {projectLog.length > 0 && (
            <div>
              <p className={eyebrow}>MY PROJECTS</p>
              <ul className="mt-3 space-y-2">
                {projectLog.map((saved) => {
                  const project = saved.project!;
                  const total = project.plan.milestones.reduce((sum, milestone) => sum + milestone.tasks.length, 0);
                  const done = Object.values(project.status).filter((value) => value === "done").length;
                  return (
                    <li key={saved.id} className="rounded-xl bg-[#e2d5b0] px-4 py-3 shadow-[0_3px_6px_rgba(0,0,0,.18)]">
                      <button type="button" onClick={() => openProject(saved)} className="w-full text-left">
                        <p className="truncate text-sm font-bold">{project.name}</p>
                        <p className="mt-1 font-mono text-[10px]">
                          {done} of {total} tasks · {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="rounded-xl bg-[#efe5c8]/80 px-4 pb-5 pt-0 shadow-[0_3px_6px_rgba(0,0,0,.15)]">
            <div className="-mx-4 h-1.5 bg-[#8a7240]" aria-hidden="true">
              <span className="block h-full bg-[#6f2416]" style={{ width: hasReply ? "60%" : "18%" }} />
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
            {messages.length > 0 ? (
              <div className="mx-auto flex max-h-[420px] w-full max-w-3xl flex-col gap-3 overflow-y-auto px-1" aria-live="polite">
                {messages.map((message, index) => (
                  <div key={index} className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    {message.role === "user" || !message.data ? (
                      <p
                        className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-snug shadow-[0_3px_6px_rgba(0,0,0,.15)] ${
                          message.role === "user" ? "bg-[#6f2416] text-[#f5e9cc]" : "bg-[#f4ecd3] text-[#2b2014]"
                        }`}
                      >
                        {message.content}
                      </p>
                    ) : (
                      <CoachReply
                        data={message.data}
                        isLast={message === lastAssistant}
                        disabled={thinking || loading}
                        onAnswer={(answer) => void send(answer)}
                      />
                    )}
                  </div>
                ))}
                {thinking && <p className="font-mono text-[11px] text-[#55493c]">Your mentor is thinking...</p>}
                <div ref={transcriptEndRef} />
              </div>
            ) : (
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
            )}
          </div>

          <form onSubmit={submitIdea} className="mx-auto mt-6 w-full max-w-[640px]">
            <div className="rounded-2xl border border-[#8c806a] bg-[#f3ead0] px-5 py-4">
              <textarea
                ref={composerRef}
                                maxLength={1000}
                rows={2}
                value={idea}
                onChange={(event) => setIdea(event.target.value)}
                placeholder={messages.length ? "Reply to your mentor, or ask for changes..." : "I want to build a campus spending tracker that helps students see where their money goes and set a weekly budget."}
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
                <p>Answer the mentor, then generate when you like the idea · Shift + Enter for a new line</p>
                <p className="mt-2">Suggested plans are drafts. Review the scope and pace before starting.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="submit"
                  disabled={thinking || loading || !idea.trim() || (messages.length === 0 && idea.trim().length < 10)}
                  className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold disabled:opacity-60 ${
                    hasReply
                      ? "border border-[#6f2416] text-[#6f2416] hover:bg-[#f6e8c5]"
                      : "bg-[#6f2416] text-[#f5e9cc] hover:bg-[#8a2f1e]"
                  }`}
                >
                  {thinking ? (
                    <>
                      Thinking... <Loader2 className="size-3.5 animate-spin" />
                    </>
                  ) : (
                    <>
                      {hasReply ? "Send" : "Share my idea"} <ArrowRight className="size-3.5" />
                    </>
                  )}
                </button>
                {hasReply && (
                  <button
                    type="button"
                    onClick={generate}
                    disabled={loading || thinking}
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
                )}
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1.5 font-mono text-[10px] text-[#55493c]">
              <CircleHelp className="size-3" /> Your messages are sent to Gemini. The plan is only built when you choose Generate.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
