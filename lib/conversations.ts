import type { CoachData, ProjectCard } from "@/components/coach-reply";
import type { DashboardPlan, TaskStatus } from "@/lib/dashboard-plan";

export type SavedMessage = { role: "user" | "assistant"; content: string; data?: CoachData };

export interface SavedConversation {
  id: string;
  title: string;
  messages: SavedMessage[];
  card: ProjectCard | null;
  updatedAt: number;
  // Set once a plan has been generated from this conversation (the project log).
  project?: {
    name: string;
    plan: DashboardPlan;
    hoursPerWeek: number;
    status: Record<string, TaskStatus>;
    createdAt: number;
  };
}

const KEY = "blueprint-conversations";
const EVENT = "blueprint-conversations-change";
const MAX = 30;

export function subscribeConversations(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function readConversationsRaw(): string {
  try {
    return localStorage.getItem(KEY) ?? "";
  } catch {
    return "";
  }
}

export function parseConversations(raw: string): SavedConversation[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is SavedConversation =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        Array.isArray(item.messages),
    );
  } catch {
    return [];
  }
}

function writeAll(list: SavedConversation[]) {
  try {
    const sorted = [...list].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(sorted));
  } catch {
    // Storage can be unavailable (private mode); the chat still works for this session.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function newConversationId() {
  return `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function saveConversation(conversation: SavedConversation) {
  const list = parseConversations(readConversationsRaw());
  const existing = list.find((item) => item.id === conversation.id);
  const merged = { ...conversation, project: conversation.project ?? existing?.project };
  writeAll([merged, ...list.filter((item) => item.id !== conversation.id)]);
}

export function deleteConversation(id: string) {
  writeAll(parseConversations(readConversationsRaw()).filter((item) => item.id !== id));
}

// Keeps the project log's progress in step with the dashboard task board.
export function syncProjectStatus(id: string | undefined, status: Record<string, TaskStatus>) {
  if (!id) return;
  const list = parseConversations(readConversationsRaw());
  const target = list.find((item) => item.id === id);
  if (!target?.project) return;
  target.project = { ...target.project, status };
  writeAll(list);
}
