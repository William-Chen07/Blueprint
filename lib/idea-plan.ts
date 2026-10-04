export interface IdeaPlan {
  title: string;
  summary: string;
  techStack: Array<{ name: string; purpose: string }>;
  languagesToLearn: Array<{ name: string; why: string; order: number }>;
  milestones: Array<{
    title: string;
    description: string;
    tasks: string[];
    estimatedHours: number;
  }>;
  firstStep: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isIdeaPlan(value: unknown): value is IdeaPlan {
  return (
    isRecord(value) &&
    isText(value.title) &&
    isText(value.summary) &&
    isText(value.firstStep) &&
    Array.isArray(value.techStack) &&
    value.techStack.length > 0 &&
    value.techStack.every(
      (item) => isRecord(item) && isText(item.name) && isText(item.purpose),
    ) &&
    Array.isArray(value.languagesToLearn) &&
    value.languagesToLearn.length > 0 &&
    value.languagesToLearn.every(
      (item) =>
        isRecord(item) &&
        isText(item.name) &&
        isText(item.why) &&
        typeof item.order === "number" &&
        Number.isInteger(item.order) &&
        item.order > 0,
    ) &&
    Array.isArray(value.milestones) &&
    value.milestones.length >= 3 &&
    value.milestones.length <= 6 &&
    value.milestones.every(
      (item) =>
        isRecord(item) &&
        isText(item.title) &&
        isText(item.description) &&
        Array.isArray(item.tasks) &&
        item.tasks.length > 0 &&
        item.tasks.every(isText) &&
        typeof item.estimatedHours === "number" &&
        Number.isInteger(item.estimatedHours) &&
        item.estimatedHours > 0,
    )
  );
}
