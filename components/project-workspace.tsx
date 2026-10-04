"use client";

import { useMemo, useState } from "react";
import type { Project } from "@/lib/github";

type WorkspaceTab = "tasks" | "brief" | "plan" | "guide";

const tabs: Array<{ id: WorkspaceTab; label: string }> = [
  { id: "tasks", label: "Task board" },
  { id: "brief", label: "Brief & setup" },
  { id: "plan", label: "Plan & milestones" },
  { id: "guide", label: "Build guide" },
];

export default function ProjectWorkspace({ project }: { project: Project }) {
  const [tab, setTab] = useState<WorkspaceTab>("tasks");
  const [completed, setCompleted] = useState<string[]>([]);
  const completedCount = completed.length;
  const columns = useMemo(() => [
    { label: "TO DO", tasks: project.tasks.filter((task) => !completed.includes(task.title)).slice(0, 2) },
    { label: "IN PROGRESS", tasks: project.tasks.filter((task) => !completed.includes(task.title)).slice(2, 4) },
    { label: "DONE", tasks: project.tasks.filter((task) => completed.includes(task.title)) },
  ], [completed, project.tasks]);

  function toggleTask(title: string) {
    setCompleted((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    );
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
                <div key={column.label}>
                  <p className="mb-4 font-mono text-[9px] uppercase tracking-[.15em]">{column.label} · {column.tasks.length}</p>
                  <div className="space-y-3">
                    {column.tasks.map((task) => (
                      <button
                        key={task.title}
                        type="button"
                        onClick={() => toggleTask(task.title)}
                        className={`w-full border border-[#b8a47e] p-4 text-left shadow-[3px_5px_8px_rgba(76,54,29,.2)] ${
                          completed.includes(task.title) ? "bg-[#ccb87a]" : "bg-[#ebdebd]"
                        }`}
                      >
                        <strong className="block text-sm">{task.title}</strong>
                        <span className="mt-3 block text-xs text-[#625747]">Learn {task.skill.toLowerCase()}</span>
                        <span className="mt-4 block font-mono text-[10px] text-[#625747]">
                          {completed.includes(task.title) ? "Completed" : "45 min"}
                        </span>
                      </button>
                    ))}
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
  return (
    <aside className="bg-[#d5c499] p-5 shadow-[3px_5px_8px_rgba(76,54,29,.25)]">
      <p className="font-mono text-[9px] uppercase">YOUR AI MENTOR</p>
      <h2 className="mt-4 text-xl font-semibold">Your project chats</h2>
      <p className="mt-3 text-sm">Pick up your idea-builder conversation. Every chat stays with this project.</p>
      <button type="button" className="mt-5 w-full bg-[#76301e] px-3 py-3 text-xs font-semibold text-[#f1e6cb]">
        Continue project chat →
      </button>
      <p className="mt-5 font-mono text-[9px] uppercase">Recent conversations</p>
      <div className="mt-3 space-y-2 text-xs">
        <div className="rounded-lg bg-[#f1e6cb] p-3">Planning {project.title} ↗</div>
        <div className="rounded-lg bg-[#f1e6cb] p-3">+ New project conversation</div>
      </div>
    </aside>
  );
}
