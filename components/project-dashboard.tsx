"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { RotateCcw } from "lucide-react";
import MentorChat from "@/components/MentorChat";
import { syncProjectStatus } from "@/lib/conversations";
import {
  CHANGE_EVENT,
  STORAGE_KEY,
  isDashboardPlan,
  taskId,
  writeStored,
  type SavedProject,
  type DashboardPlan,
  type TaskStatus,
} from "@/lib/dashboard-plan";

type Tab = "tasks" | "brief" | "plan" | "guide";

const tabs: Array<{ id: Tab; label: string }> = [
  { id: "tasks", label: "Task board" },
  { id: "brief", label: "Brief & setup" },
  { id: "plan", label: "Plan & milestones" },
  { id: "guide", label: "Build guide" },
];

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readStored(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

const LOADING = "__loading__";

function parseProject(raw: string): SavedProject | null {
  if (!raw || raw === LOADING) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    const { plan, status, hoursPerWeek, conversationId } = parsed as Record<string, unknown>;
    if (!isDashboardPlan(plan) || typeof status !== "object" || status === null) return null;
    const cleaned: Record<string, TaskStatus> = {};
    for (const [id, value] of Object.entries(status)) {
      if (value === "doing" || value === "done") cleaned[id] = value;
    }
    return {
      plan,
      status: cleaned,
      hoursPerWeek: typeof hoursPerWeek === "number" ? hoursPerWeek : 4,
      conversationId: typeof conversationId === "string" ? conversationId : undefined,
    };
  } catch {
    return null;
  }
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`px-6 pb-4 pt-6 shadow-[0_6px_12px_rgba(0,0,0,.4)] ${
        highlight ? "bg-[#e4cf88]" : "bg-[#b9ab88]"
      }`}
    >
      <p className="font-mono text-[11px] uppercase text-[#3d3326]">{label}</p>
      <p className="mt-5 text-xl font-semibold text-[#2b2014]">{value}</p>
    </div>
  );
}

const columns: Array<{ key: "todo" | TaskStatus; label: string; card: string }> = [
  { key: "todo", label: "TO DO", card: "bg-[#e9dfc3]" },
  { key: "doing", label: "IN PROGRESS", card: "bg-[#e8d28a]" },
  { key: "done", label: "DONE", card: "bg-[#d3c49c]" },
];

function learnLabel(skill: string) {
  return /^learn\b/i.test(skill) ? skill : `Learn ${skill}`;
}

function TaskBoard({
  plan,
  status,
  onSetStatus,
}: {
  plan: DashboardPlan;
  status: Record<string, TaskStatus>;
  onSetStatus: (id: string, next: TaskStatus | null) => void;
}) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const tasks = plan.milestones.flatMap((milestone, mi) =>
    milestone.tasks.map((task, ti) => ({ task, mi, id: taskId(mi, ti) })),
  );

  const [dragOver, setDragOver] = useState<string | null>(null);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        {columns.map((column) => {
          const items = tasks.filter((entry) => (status[entry.id] ?? "todo") === column.key);
          return (
            <section
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
                const id = event.dataTransfer.getData("text/plain");
                if (tasks.some((entry) => entry.id === id)) {
                  onSetStatus(id, column.key === "todo" ? null : column.key);
                }
              }}
              className={`rounded-lg p-3 transition-colors ${dragOver === column.key ? "bg-[#cfbf94]/60" : ""}`}
            >
              <p className="font-mono text-[11px] uppercase text-[#3d3326]">
                {column.label} · {items.length}
              </p>
              <ul className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((entry) => {
                  const done = column.key === "done";
                  return (
                    <li
                      key={entry.id}
                      draggable
                      onDragStart={(event) => event.dataTransfer.setData("text/plain", entry.id)}
                      className={`flex min-h-[112px] cursor-grab flex-col px-5 py-4 shadow-[0_5px_10px_rgba(0,0,0,.3)] active:cursor-grabbing ${column.card}`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={done}
                          onChange={() => onSetStatus(entry.id, done ? null : "done")}
                          aria-label={`Mark "${entry.task.title}" ${done ? "not done" : "done"}`}
                          className="mt-1 size-4 shrink-0 cursor-pointer accent-[#6f2416]"
                        />
                        <div className="min-w-0">
                          <p className={`font-semibold text-[#2b2014] ${done ? "line-through opacity-70" : ""}`}>
                            {entry.task.title}
                          </p>
                          <p className="mt-1 text-sm text-[#4a3f30]">{learnLabel(entry.task.skill)}</p>
                        </div>
                      </div>
                      <div className="mt-auto flex items-end justify-between pt-3">
                        <span className="font-mono text-[11px] text-[#4a3f30]">
                          {done ? "Completed" : entry.task.time} · M{entry.mi + 1}
                        </span>
                        <span className="flex gap-3 font-mono text-[10px] uppercase text-[#76301e]">
                          {column.key === "todo" && (
                            <button type="button" onClick={() => onSetStatus(entry.id, "doing")} className="font-bold hover:underline">
                              Start
                            </button>
                          )}
                          {column.key === "doing" && (
                            <>
                              <button type="button" onClick={() => onSetStatus(entry.id, null)} className="hover:underline">
                                Back
                              </button>
                              <button type="button" onClick={() => onSetStatus(entry.id, "done")} className="font-bold hover:underline">
                                Mark done
                              </button>
                            </>
                          )}
                          {done && (
                            <button type="button" onClick={() => onSetStatus(entry.id, "doing")} className="hover:underline">
                              Reopen
                            </button>
                          )}
                        </span>
                      </div>
                    </li>
                  );
                })}
                {items.length === 0 && (
                  <li className="col-span-full rounded-md border border-dashed border-[#a99b7d] px-4 py-5 text-sm text-[#6b604b]">
                    Drag a card here.
                  </li>
                )}
              </ul>
            </section>
          );
        })}
      </div>

      <aside
        aria-label="Your project chats"
        className="flex min-h-[26rem] flex-col self-start bg-[#d8c9a2] shadow-[0_8px_16px_rgba(0,0,0,.35)] lg:min-h-[390px]"
      >
        {chatOpen ? (
          <>
            <div className="flex items-center justify-between px-5 pb-2 pt-4">
              <p className="font-mono text-[11px] uppercase text-[#3d3326]">YOUR AI MENTOR</p>
              <button
                type="button"
                onClick={() => setChatOpen(false)}
                className="font-mono text-[10px] uppercase text-[#76301e] hover:underline"
              >
                Close chat
              </button>
            </div>
            <div className="h-[22rem] px-3 pb-3">
              <MentorChat
                key={chatKey}
                plan={plan}
                suggestions={plan.chatPrompts}
                className="border border-[#a99b7d] bg-[#fffdf5]"
              />
            </div>
          </>
        ) : (
          <div className="px-6 py-5">
            <p className="font-mono text-[11px] uppercase text-[#3d3326]">YOUR AI MENTOR</p>
            <h3 className="mt-5 font-serif text-[26px] font-bold leading-tight text-[#2b2014]">Your project chats</h3>
            <p className="mt-4 text-[15px] leading-snug text-[#3d3326]">
              Pick up your idea-builder conversation. Every chat stays with this project.
            </p>
            <button
              type="button"
              onClick={() => setChatOpen(true)}
              className="mt-5 w-full bg-[#6f2416] px-3.5 py-3 text-left text-sm font-bold text-[#f5e9cc] hover:bg-[#8a2f1e]"
            >
              Continue project chat →
            </button>
            <p className="mt-5 font-mono text-[10px] uppercase text-[#3d3326]">SUGGESTED QUESTIONS</p>
            <ul className="mt-2 space-y-2">
              {plan.chatPrompts.slice(0, 1).map((prompt) => (
                <li key={prompt}>
                  <button
                    type="button"
                    onClick={() => setChatOpen(true)}
                    className="w-full rounded-md bg-[#f1e8d0] px-3.5 py-3 text-left text-sm font-semibold text-[#2b2014] hover:bg-[#f7efd9]"
                  >
                    {prompt}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setChatKey((key) => key + 1);
                    setChatOpen(true);
                  }}
                  className="w-full rounded-md bg-[#f1e8d0] px-3.5 py-3 text-left text-sm font-semibold text-[#2b2014] hover:bg-[#f7efd9]"
                >
                  + New project conversation
                </button>
              </li>
            </ul>
          </div>
        )}
      </aside>
    </div>
  );
}

function TwoColumn({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-x-16 gap-y-10 px-1 py-2 md:grid-cols-2 md:[&>*+*]:border-l md:[&>*+*]:border-[#cbbd97]/60 md:[&>*+*]:pl-16">
      {children}
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return <h3 className="font-serif text-[30px] font-bold leading-tight text-[#2b2014]">{children}</h3>;
}

function Lines({ items, numbered = false }: { items: string[]; numbered?: boolean }) {
  return (
    <ul className="mt-4 space-y-1 text-[15px] leading-snug text-[#2b2014]">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3">
          {numbered && <span className="shrink-0">{String(index + 1).padStart(2, "0")}</span>}
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TabPanel({
  tab,
  plan,
  hoursPerWeek,
  status,
  onSetStatus,
  onToggleMilestone,
}: {
  tab: Exclude<Tab, "tasks">;
  plan: DashboardPlan;
  hoursPerWeek: number;
  status: Record<string, TaskStatus>;
  onSetStatus: (id: string, next: TaskStatus | null) => void;
  onToggleMilestone: (milestoneIndex: number, done: boolean) => void;
}) {
  const body = "mt-4 text-[15px] leading-snug text-[#2b2014]";

  if (tab === "brief") {
    return (
      <TwoColumn>
        <div>
          <Heading>Your project brief</Heading>
          <p className={body}>{plan.brief.summary}</p>
          <p className={body}>
            <span className="font-semibold">Who it&apos;s for:</span> {plan.brief.audience}
          </p>
          <p className={body}>
            <span className="font-semibold">First version:</span> {plan.brief.firstVersion}
          </p>
          <p className={body}>
            Suggested pace: {plan.duration} at {hoursPerWeek} hours/week.
            <br />
            Adjust the scope whenever you need.
          </p>
        </div>
        <div>
          <Heading>Toolkit &amp; first-time setup</Heading>
          <p className={body}>{plan.stack.join(" · ")}</p>
          <Lines items={plan.setupSteps} numbered />
        </div>
      </TwoColumn>
    );
  }

  if (tab === "plan") {
    return (
      <TwoColumn>
        <div>
          <Heading>How the pieces connect</Heading>
          <ul className="mt-4 space-y-3 text-[15px] leading-snug text-[#2b2014]">
            {plan.pieces.map((piece) => (
              <li key={piece.name}>
                <span className="font-semibold">{piece.name}</span> — {piece.role}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Heading>Your next milestones</Heading>
          <ol className="mt-4 space-y-5">
            {plan.milestones.map((milestone, mi) => {
              const done = milestone.tasks.filter((_, ti) => status[taskId(mi, ti)] === "done").length;
              const complete = done === milestone.tasks.length;
              return (
                <li key={milestone.title} className="text-[15px] leading-snug text-[#2b2014]">
                  <label className="flex cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={complete}
                      onChange={() => onToggleMilestone(mi, !complete)}
                      className="mt-1 size-4 shrink-0 cursor-pointer accent-[#6f2416]"
                    />
                    <span>
                      <span className={`block font-semibold ${complete ? "line-through opacity-70" : ""}`}>
                        {milestone.title}{" "}
                        <span className="font-mono text-[11px] font-normal text-[#76301e]">· {milestone.timeframe}</span>
                      </span>
                      <span className="block">{milestone.goal}</span>
                      <span className="block font-mono text-[11px] text-[#4a3f30]">
                        {done} of {milestone.tasks.length} tasks done
                      </span>
                    </span>
                  </label>
                  <ul className="ml-7 mt-2 space-y-1">
                    {milestone.tasks.map((task, ti) => {
                      const id = taskId(mi, ti);
                      const taskDone = status[id] === "done";
                      return (
                        <li key={id}>
                          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#3d3326]">
                            <input
                              type="checkbox"
                              checked={taskDone}
                              onChange={() => onSetStatus(id, taskDone ? null : "done")}
                              className="size-3.5 cursor-pointer accent-[#6f2416]"
                            />
                            <span className={taskDone ? "line-through opacity-70" : ""}>{task.title}</span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ol>
        </div>
      </TwoColumn>
    );
  }

  return (
    <TwoColumn>
      <div>
        <Heading>Today: {plan.buildGuide.todayTitle}</Heading>
        <p className="mt-2 font-mono text-[11px] uppercase text-[#76301e]">{plan.buildGuide.todayTime}</p>
        <Lines items={plan.buildGuide.todaySteps} numbered />
      </div>
      <div>
        <Heading>Keep the guide manageable</Heading>
        <Lines items={plan.buildGuide.tips} />
      </div>
    </TwoColumn>
  );
}

export default function ProjectDashboard() {
  const [tab, setTab] = useState<Tab>("tasks");
  const stored = useSyncExternalStore(subscribe, readStored, () => LOADING);
  const project = useMemo(() => parseProject(stored), [stored]);
  const router = useRouter();

  // No saved project: the idea conversation lives on /mentor.
  useEffect(() => {
    if (stored !== LOADING && !project) router.replace("/mentor");
  }, [stored, project, router]);

  const setStatus = useCallback(
    (id: string, next: TaskStatus | null) => {
      if (!project) return;
      const status = { ...project.status };
      if (next) status[id] = next;
      else delete status[id];
      writeStored({ ...project, status });
      syncProjectStatus(project.conversationId, status);
    },
    [project],
  );

  const toggleMilestone = useCallback(
    (milestoneIndex: number, done: boolean) => {
      if (!project) return;
      const status = { ...project.status };
      project.plan.milestones[milestoneIndex].tasks.forEach((_, ti) => {
        const id = taskId(milestoneIndex, ti);
        if (done) status[id] = "done";
        else delete status[id];
      });
      writeStored({ ...project, status });
      syncProjectStatus(project.conversationId, status);
    },
    [project],
  );

  function startOver() {
    if (window.confirm("Start a new project? Your current plan and progress will be cleared.")) {
      writeStored(null);
      setTab("tasks");
      router.push("/mentor");
    }
  }

  const plan = project?.plan;
  const status = project?.status ?? {};
  const totalTasks = plan?.milestones.reduce((sum, milestone) => sum + milestone.tasks.length, 0) ?? 0;
  const doneCount = Object.values(status).filter((value) => value === "done").length;
  const nextMilestone = plan?.milestones.find((milestone, mi) =>
    milestone.tasks.some((_, ti) => status[taskId(mi, ti)] !== "done"),
  );

  return (
    <main className="min-h-screen px-4 pb-12 pt-6 text-[#2b2014] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-[1344px]">
        <p className="font-mono text-[11px] uppercase text-[#a99d80]">
          MY WORKSPACE{plan ? ` / ${plan.projectName}` : ""}
        </p>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-serif text-4xl font-bold text-[#c9bd9b] sm:text-5xl">Your next step, made simple.</h1>
          {plan && (
            <button
              type="button"
              onClick={startOver}
              className="inline-flex items-center gap-1.5 border border-[#eadcb9]/50 px-3 py-2 font-mono text-[10px] uppercase text-[#eadcb9] hover:bg-[#76301e]"
            >
              <RotateCcw className="size-3" /> New project
            </button>
          )}
        </div>
        <p className="mt-6 text-lg text-[#b9ad8c]">
          {plan
            ? `${plan.projectName} · ${plan.duration} · ${project?.hoursPerWeek} hours/week · Change pace anytime`
            : "Bring an idea, or let us suggest one, and get a plan you can start today."}
        </p>

        {stored === LOADING ? (
          <p role="status" className="mt-10 font-mono text-xs text-[#c5b890]">
            Opening your workspace…
          </p>
        ) : !plan ? (
          <p role="status" className="mt-10 font-mono text-xs text-[#c5b890]">
            Taking you to a fresh blueprint…
          </p>
        ) : (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <StatCard label="PROGRESS" value={`${doneCount} of ${totalTasks} tasks complete`} />
              <StatCard
                highlight
                label="NEXT MILESTONE"
                value={nextMilestone ? `Next: ${nextMilestone.title}` : "All milestones done 🎉"}
              />
              <StatCard label="YOUR TOOLKIT" value={plan.stack.join(" · ")} />
            </div>

            <div className="mt-8 flex items-end gap-2 overflow-x-auto" role="tablist" aria-label="Project sections">
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`w-[220px] shrink-0 rounded-t-2xl text-center text-sm font-semibold ${
                    tab === id
                      ? "h-[42px] bg-[#efe4c6] text-[#6f2416]"
                      : "h-9 bg-[#b9a77e] text-[#2b2014] hover:bg-[#c7b68d]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              className={`min-h-[488px] rounded-b-[22px] rounded-tr-[22px] bg-[radial-gradient(ellipse_at_50%_55%,#f1e7c9,#e7dbb8_70%,#cfc09a)] p-6 shadow-[0_12px_24px_rgba(0,0,0,.45)] sm:p-6 ${
                tab === "tasks" ? "rounded-tl-none" : "rounded-tl-[22px]"
              } ${tab === "tasks" ? "" : "sm:px-14 sm:py-12"}`}
            >
              {tab === "tasks" ? (
                <TaskBoard plan={plan} status={status} onSetStatus={setStatus} />
              ) : (
                <TabPanel
                  tab={tab}
                  plan={plan}
                  hoursPerWeek={project?.hoursPerWeek ?? 4}
                  status={status}
                  onSetStatus={setStatus}
                  onToggleMilestone={toggleMilestone}
                />
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
