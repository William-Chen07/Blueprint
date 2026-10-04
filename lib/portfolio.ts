import { taskId, type DashboardPlan, type TaskStatus } from "@/lib/dashboard-plan";

// Projects the learner generated themselves and finished, shown on the portfolio.
export interface FinishedCustomProject {
  id: string;
  name: string;
  tagline: string;
  summary: string;
  stack: string[];
  skills: string[];
  finishedAt: number;
}

const KEY = "buildfolio-finished-custom-projects";

export function readFinishedCustomRaw(): string {
  try {
    return window.localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseFinishedCustom(raw: string): FinishedCustomProject[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is FinishedCustomProject =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        Array.isArray(item.stack),
    );
  } catch {
    return [];
  }
}

// Adds the project once every task is done, and removes it again if a task is reopened.
export function syncFinishedCustomProject(
  id: string,
  plan: DashboardPlan,
  status: Record<string, TaskStatus>,
) {
  const total = plan.milestones.reduce((sum, milestone) => sum + milestone.tasks.length, 0);
  const done = plan.milestones.reduce(
    (sum, milestone, mi) => sum + milestone.tasks.filter((_, ti) => status[taskId(mi, ti)] === "done").length,
    0,
  );
  const list = parseFinishedCustom(readFinishedCustomRaw());
  const existing = list.find((item) => item.id === id);
  let next = list;
  if (total > 0 && done === total) {
    if (existing) return;
    const skills = [...new Set(plan.milestones.flatMap((milestone) => milestone.tasks.map((task) => task.skill)))];
    next = [
      ...list,
      {
        id,
        name: plan.projectName,
        tagline: plan.tagline,
        summary: plan.brief.summary,
        stack: plan.stack,
        skills: skills.slice(0, 6),
        finishedAt: Date.now(),
      },
    ];
  } else if (existing) {
    next = list.filter((item) => item.id !== id);
  } else {
    return;
  }
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable; the dashboard still works for this session.
  }
  window.dispatchEvent(new Event("storage"));
}
