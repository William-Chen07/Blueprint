export type Experience = "starting" | "building" | "experienced";

export interface PlanTask {
  title: string;
  skill: string;
  time: string;
}

export interface PlanMilestone {
  title: string;
  goal: string;
  timeframe: string;
  tasks: PlanTask[];
}

export interface DashboardPlan {
  projectName: string;
  tagline: string;
  duration: string;
  brief: {
    summary: string;
    audience: string;
    firstVersion: string;
  };
  stack: string[];
  setupSteps: string[];
  pieces: Array<{ name: string; role: string }>;
  milestones: PlanMilestone[];
  buildGuide: {
    todayTitle: string;
    todayTime: string;
    todaySteps: string[];
    tips: string[];
  };
  chatPrompts: string[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const text = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= 600;

const list = <T>(value: unknown, min: number, max: number, check: (item: unknown) => item is T): value is T[] =>
  Array.isArray(value) && value.length >= min && value.length <= max && value.every(check);

const isTask = (value: unknown): value is PlanTask =>
  isRecord(value) && text(value.title) && text(value.skill) && text(value.time);

const isMilestone = (value: unknown): value is PlanMilestone =>
  isRecord(value) &&
  text(value.title) &&
  text(value.goal) &&
  text(value.timeframe) &&
  list(value.tasks, 2, 4, isTask);

const isPiece = (value: unknown): value is DashboardPlan["pieces"][number] =>
  isRecord(value) && text(value.name) && text(value.role);

export function isDashboardPlan(value: unknown): value is DashboardPlan {
  if (!isRecord(value)) return false;
  const { brief, buildGuide } = value;
  return (
    text(value.projectName) &&
    text(value.tagline) &&
    text(value.duration) &&
    isRecord(brief) &&
    text(brief.summary) &&
    text(brief.audience) &&
    text(brief.firstVersion) &&
    list(value.stack, 2, 5, text) &&
    list(value.setupSteps, 3, 6, text) &&
    list(value.pieces, 2, 5, isPiece) &&
    list(value.milestones, 3, 4, isMilestone) &&
    isRecord(buildGuide) &&
    text(buildGuide.todayTitle) &&
    text(buildGuide.todayTime) &&
    list(buildGuide.todaySteps, 3, 6, text) &&
    list(buildGuide.tips, 3, 5, text) &&
    list(value.chatPrompts, 3, 4, text)
  );
}

export type TaskStatus = "doing" | "done";

export function taskId(milestoneIndex: number, taskIndex: number) {
  return `m${milestoneIndex}-t${taskIndex}`;
}

export interface SavedProject {
  plan: DashboardPlan;
  hoursPerWeek: number;
  status: Record<string, TaskStatus>;
}

export const STORAGE_KEY = "blueprint-dashboard-project";
export const CHANGE_EVENT = "blueprint-dashboard-change";

// Client-only: persists the project in this browser and notifies open dashboards.
export function writeStored(project: SavedProject | null) {
  try {
    if (project) localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); callers still work for this session.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
