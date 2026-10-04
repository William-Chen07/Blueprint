"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import MentorChat from "@/components/MentorChat";
import type { Project } from "@/lib/github";

type WorkspaceTab = "tasks" | "brief" | "plan" | "guide";

const tabs: Array<{ id: WorkspaceTab; label: string }> = [
  { id: "tasks", label: "Task board" },
  { id: "brief", label: "Brief & setup" },
  { id: "plan", label: "Plan & milestones" },
  { id: "guide", label: "Build guide" },
];
const storedListSnapshots = new Map<string, { raw: string | null; value: string[] }>();
const EMPTY: string[] = [];

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

export default function ProjectWorkspace({ project }: { project: Project }) {
  const [tab, setTab] = useState<WorkspaceTab>("tasks");
  const [dragOver, setDragOver] = useState<string | null>(null);
  const completedKey = `buildfolio-completed-tasks:${project.slug}`;
  const doingKey = `buildfolio-doing-tasks:${project.slug}`;
  const completed = useSyncExternalStore(subscribe, () => getStoredList(completedKey), () => EMPTY);
  const doing = useSyncExternalStore(subscribe, () => getStoredList(doingKey), () => EMPTY);
  const completedCount = completed.length;
  const columns = useMemo(() => [
    { key: "todo", label: "TO DO", tasks: project.tasks.filter((task) => !completed.includes(task.title) && !doing.includes(task.title)) },
    { key: "doing", label: "IN PROGRESS", tasks: project.tasks.filter((task) => doing.includes(task.title) && !completed.includes(task.title)) },
    { key: "done", label: "DONE", tasks: project.tasks.filter((task) => completed.includes(task.title)) },
  ] as const, [completed, doing, project.tasks]);

  function setTaskStatus(title: string, next: "doing" | "done" | null) {
    const nextCompleted = completed.filter((item) => item !== title);
    const nextDoing = doing.filter((item) => item !== title);
    if (next === "done") nextCompleted.push(title);
    if (next === "doing") nextDoing.push(title);
    window.localStorage.setItem(completedKey, JSON.stringify(nextCompleted));
    window.localStorage.setItem(doingKey, JSON.stringify(nextDoing));

    const finished = getStoredList("buildfolio-finished-projects");
    const isFinished = nextCompleted.length === project.tasks.length;
    const updatedFinished = isFinished
      ? [...new Set([...finished, project.slug])]
      : finished.filter((slug) => slug !== project.slug);
    window.localStorage.setItem("buildfolio-finished-projects", JSON.stringify(updatedFinished));
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <main className="min-h-screen px-4 pb-12 pt-8 text-[#2b2014] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#c5b890]">
          MY WORKSPACE / {project.category} / {project.title}
        </p>
        <h1 className="mt-8 font-serif text-5xl leading-none text-[#eadcb9] sm:text-6xl">
          Your next step, made simple.
        </h1>
        <p className="mt-6 text-sm text-[#b9a77e]">
          {project.title} · {project.time} · 4 hours/week · Change pace anytime
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-3">
          <SummaryCard label="PROGRESS" value={`${completedCount} of ${project.tasks.length} tasks complete`} />
          <SummaryCard label="NEXT MILESTONE" value={project.milestones.find((milestone) => !completed.includes(milestone.title))?.title ?? "Project complete"} highlight />
          <SummaryCard label="YOUR TOOLKIT" value={project.techStack.slice(0, 3).join(" · ")} />
        </div>

        <nav className="mt-7 flex flex-wrap gap-1" aria-label="Project workspace sections">
          {tabs.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-t-lg px-7 py-3 text-xs font-semibold ${
                tab === item.id ? "bg-[#f1e6cb] text-[#76301e]" : "bg-[#ccb87a] text-[#2b2014] hover:bg-[#dfcb96]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <section className="min-h-[355px] rounded-b-xl rounded-tr-xl bg-[#f1e6cb] p-6 shadow-[4px_8px_18px_rgba(0,0,0,.35)] sm:p-10">
          {tab === "tasks" && (
            <div className="grid gap-8 lg:grid-cols-[1fr_1fr_1fr_245px]">
              {columns.map((column) => (
                <div
                  key={column.key}
                  aria-label={column.label}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragOver(column.key);
                  }}
                  onDragLeave={() => setDragOver((current) => (current === column.key ? null : current))}
                  onDrop={(event) => {
                    event.preventDefault();
                    setDragOver(null);
                    const title = event.dataTransfer.getData("text/plain");
                    if (project.tasks.some((task) => task.title === title)) {
                      setTaskStatus(title, column.key === "todo" ? null : column.key);
                    }
                  }}
                  className={`rounded-lg transition-colors ${dragOver === column.key ? "bg-[#ccb87a]/40" : ""}`}
                >
                  <p className="mb-4 font-mono text-[9px] uppercase tracking-[.15em]">{column.label} · {column.tasks.length}</p>
                  <div className="space-y-3">
                    {column.tasks.map((task) => {
                      const done = column.key === "done";
                      return (
                        <div
                          key={task.title}
                          draggable
                          onDragStart={(event) => event.dataTransfer.setData("text/plain", task.title)}
                          className={`w-full cursor-grab border border-[#b8a47e] p-4 text-left shadow-[3px_5px_8px_rgba(76,54,29,.2)] active:cursor-grabbing ${
                            column.key === "doing" ? "bg-[#e8d28a]" : done ? "bg-[#ccb87a]" : "bg-[#ebdebd]"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={done}
                              onChange={() => setTaskStatus(task.title, done ? null : "done")}
                              aria-label={`Mark "${task.title}" ${done ? "not done" : "done"}`}
                              className="mt-1 size-4 shrink-0 cursor-pointer accent-[#6f2416]"
                            />
                            <div className="min-w-0">
                              <strong className={`block text-sm ${done ? "line-through opacity-70" : ""}`}>{task.title}</strong>
                              <span className="mt-2 block text-xs text-[#625747]">Learn {task.skill.toLowerCase()}</span>
                            </div>
                          </div>
                          <div className="mt-4 flex items-end justify-between">
                            <span className="font-mono text-[10px] text-[#625747]">{done ? "Completed" : "45 min"}</span>
                            <span className="flex gap-3 font-mono text-[10px] uppercase text-[#76301e]">
                              {column.key === "todo" && (
                                <button type="button" onClick={() => setTaskStatus(task.title, "doing")} className="font-bold hover:underline">Start</button>
                              )}
                              {column.key === "doing" && (
                                <>
                                  <button type="button" onClick={() => setTaskStatus(task.title, null)} className="hover:underline">Back</button>
                                  <button type="button" onClick={() => setTaskStatus(task.title, "done")} className="font-bold hover:underline">Mark done</button>
                                </>
                              )}
                              {done && (
                                <button type="button" onClick={() => setTaskStatus(task.title, "doing")} className="hover:underline">Reopen</button>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    {column.tasks.length === 0 && (
                      <div className="rounded-md border border-dashed border-[#a99b7d] px-4 py-5 text-sm text-[#6b604b]">Drag a card here.</div>
                    )}
                  </div>
                </div>
              ))}
              <MentorCard project={project} />
            </div>
          )}

          {tab === "brief" && (
            <div className="grid gap-10 lg:grid-cols-2">
              <WorkspacePaper title="Your project brief">
                <p>{project.brief}</p>
                <p className="mt-5">Suggested pace: {project.time}. Adjust the scope whenever you need.</p>
              </WorkspacePaper>
              <WorkspacePaper title="Toolkit & first-time setup">
                <p>{project.techStack.join(" · ")}</p>
                <ol className="mt-5 space-y-1">
                  {project.setup.slice(0, 4).map((item, index) => <li key={item}>0{index + 1} &nbsp;{item}</li>)}
                </ol>
                <p className="mt-5">Hosting target: local prototype first.</p>
                <div className="mt-6 border-t border-[#b8a47e] pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-[.15em]">Original source</p>
                  <p className="mt-2">
                    Based on{" "}
                    <a
                      href={project.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#76301e] underline underline-offset-2 hover:text-[#8a2f1e]"
                    >
                      {project.source.repo} ↗
                    </a>{" "}
                    by {project.source.author}. License: {project.source.license}.
                  </p>
                  <p className="mt-2 text-xs text-[#625747]">
                    Stuck? Open the original repo to see how they did it, and credit them in your README.
                  </p>
                </div>
              </WorkspacePaper>
            </div>
          )}

          {tab === "plan" && (
            <div className="grid gap-10 lg:grid-cols-2">
              <WorkspacePaper title="How the pieces connect">
                <p>{project.architecture.map((layer) => layer.label).join(" → ")}</p>
                <div className="mt-5 space-y-3">
                  {project.architecture.map((layer) => <p key={layer.label}><strong>{layer.label}:</strong> {layer.description}</p>)}
                </div>
              </WorkspacePaper>
              <WorkspacePaper title="Your next milestones">
                <div className="space-y-4">
                  {project.milestones.map((milestone, index) => (
                    <div key={milestone.title}>
                      <p>{index === 0 ? "✓" : index === 1 ? "→" : "○"} &nbsp;{milestone.title} · {milestone.deadline}</p>
                      <p className="text-sm text-[#625747]">{milestone.outcome}</p>
                    </div>
                  ))}
                </div>
              </WorkspacePaper>
            </div>
          )}

          {tab === "guide" && (
            <div className="grid gap-10 lg:grid-cols-2">
              <WorkspacePaper title={`Today: ${project.guide[0]?.title ?? "start the project"}`}>
                <p>{project.guide[0]?.description}</p>
                <ol className="mt-5 list-decimal space-y-2 pl-5">
                  {project.guide[0]?.items.map((item) => <li key={item}>{item}</li>)}
                </ol>
              </WorkspacePaper>
              <WorkspacePaper title="Keep the guide manageable">
                <p>Open one task at a time.</p>
                <p className="mt-5">NEXT UP<br />{project.tasks[0]?.title}</p>
                <p className="mt-4">THEN<br />{project.tasks[1]?.title}</p>
                <p className="mt-5 text-sm">Need an explanation? Return to the task board and ask your mentor.</p>
              </WorkspacePaper>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

// Cached so useSyncExternalStore gets a stable array until the stored value changes.
function getStoredList(key: string): string[] {
  const stored = window.localStorage.getItem(key);
  const cached = storedListSnapshots.get(key);
  if (cached?.raw === stored) return cached.value;
  let value: string[] = [];
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.every((item): item is string => typeof item === "string")) value = parsed;
    } catch {
      value = [];
    }
  }
  storedListSnapshots.set(key, { raw: stored, value });
  return value;
}

function SummaryCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`min-h-[66px] p-5 shadow-[3px_5px_8px_rgba(76,54,29,.25)] ${highlight ? "bg-[#ecd58d]" : "bg-[#d9cda8]"}`}>
      <p className="font-mono text-[9px]">{label}</p>
      <p className="mt-3 text-base font-semibold">{value}</p>
    </div>
  );
}

function WorkspacePaper({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article>
      <h2 className="font-serif text-2xl">{title}</h2>
      <div className="mt-4 text-sm leading-relaxed text-[#3f352a]">{children}</div>
    </article>
  );
}

function MentorCard({ project }: { project: Project }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const prompts = [
    `What should I do first on ${project.title}?`,
    `Explain the tech stack for ${project.title}`,
  ];
  const context = {
    projectName: project.title,
    brief: project.brief,
    techStack: project.techStack,
    setup: project.setup,
    milestones: project.milestones,
    tasks: project.tasks,
  };

  return (
    <aside className="flex flex-col self-start bg-[#d5c499] shadow-[3px_5px_8px_rgba(76,54,29,.25)]">
      {chatOpen ? (
        <>
          <div className="flex items-center justify-between px-5 pb-2 pt-4">
            <p className="font-mono text-[9px] uppercase">YOUR AI MENTOR</p>
            <button type="button" onClick={() => setChatOpen(false)} className="font-mono text-[10px] uppercase text-[#76301e] hover:underline">
              Close chat
            </button>
          </div>
          <div className="h-[22rem] px-3 pb-3">
            <MentorChat key={chatKey} plan={context} suggestions={prompts} className="border border-[#a99b7d] bg-[#fffdf5]" />
          </div>
        </>
      ) : (
        <div className="p-5">
          <p className="font-mono text-[9px] uppercase">YOUR AI MENTOR</p>
          <h2 className="mt-4 text-xl font-semibold">Your project chats</h2>
          <p className="mt-3 text-sm">Pick up your idea-builder conversation. Every chat stays with this project.</p>
          <button type="button" onClick={() => setChatOpen(true)} className="mt-5 w-full bg-[#76301e] px-3 py-3 text-left text-xs font-semibold text-[#f1e6cb] hover:bg-[#8a2f1e]">
            Continue project chat →
          </button>
          <p className="mt-5 font-mono text-[9px] uppercase">Suggested questions</p>
          <div className="mt-3 space-y-2 text-xs">
            <button type="button" onClick={() => setChatOpen(true)} className="w-full rounded-lg bg-[#f1e6cb] p-3 text-left hover:bg-[#f7efd9]">
              {prompts[0]}
            </button>
            <button
              type="button"
              onClick={() => {
                setChatKey((key) => key + 1);
                setChatOpen(true);
              }}
              className="w-full rounded-lg bg-[#f1e6cb] p-3 text-left hover:bg-[#f7efd9]"
            >
              + New project conversation
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
