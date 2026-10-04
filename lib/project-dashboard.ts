export interface ProjectDashboard {
  projectName: string;
  projectType: string;
  firstWin: string;
  brief: {
    summary: string;
    audience: string;
    firstVersion: string;
  };
  toolkit: Array<{
    name: string;
    purpose: string;
    firstUse: string;
  }>;
  learningPath: Array<{
    topic: string;
    reason: string;
    order: number;
  }>;
  milestones: Array<{
    title: string;
    goal: string;
    effort: string;
    tasks: string[];
  }>;
  buildGuide: {
    todayTitle: string;
    todayDescription: string;
    todayTasks: string[];
    keepItManageableTitle: string;
    guidance: string[];
  };
}

const stringValue = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0 && value.length <= 1200;

const stringList = (value: unknown, min: number, max: number): value is string[] =>
  Array.isArray(value) &&
  value.length >= min &&
  value.length <= max &&
  value.every(stringValue);

export function isProjectDashboard(value: unknown): value is ProjectDashboard {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const dashboard = value as Record<string, unknown>;
  const brief = dashboard.brief;
  const buildGuide = dashboard.buildGuide;

  return (
    stringValue(dashboard.projectName) &&
    stringValue(dashboard.projectType) &&
    stringValue(dashboard.firstWin) &&
    typeof brief === "object" &&
    brief !== null &&
    !Array.isArray(brief) &&
    stringValue((brief as Record<string, unknown>).summary) &&
    stringValue((brief as Record<string, unknown>).audience) &&
    stringValue((brief as Record<string, unknown>).firstVersion) &&
    Array.isArray(dashboard.toolkit) &&
    dashboard.toolkit.length >= 2 &&
    dashboard.toolkit.length <= 6 &&
    dashboard.toolkit.every(
      (tool) =>
        typeof tool === "object" &&
        tool !== null &&
        !Array.isArray(tool) &&
        stringValue((tool as Record<string, unknown>).name) &&
        stringValue((tool as Record<string, unknown>).purpose) &&
        stringValue((tool as Record<string, unknown>).firstUse),
    ) &&
    Array.isArray(dashboard.learningPath) &&
    dashboard.learningPath.length >= 2 &&
    dashboard.learningPath.length <= 6 &&
    dashboard.learningPath.every(
      (step) =>
        typeof step === "object" &&
        step !== null &&
        !Array.isArray(step) &&
        stringValue((step as Record<string, unknown>).topic) &&
        stringValue((step as Record<string, unknown>).reason) &&
        Number.isInteger((step as Record<string, unknown>).order) &&
        Number((step as Record<string, unknown>).order) > 0,
    ) &&
    Array.isArray(dashboard.milestones) &&
    dashboard.milestones.length >= 3 &&
    dashboard.milestones.length <= 5 &&
    dashboard.milestones.every(
      (milestone) =>
        typeof milestone === "object" &&
        milestone !== null &&
        !Array.isArray(milestone) &&
        stringValue((milestone as Record<string, unknown>).title) &&
        stringValue((milestone as Record<string, unknown>).goal) &&
        stringValue((milestone as Record<string, unknown>).effort) &&
        stringList((milestone as Record<string, unknown>).tasks, 2, 5),
    ) &&
    typeof buildGuide === "object" &&
    buildGuide !== null &&
    !Array.isArray(buildGuide) &&
    stringValue((buildGuide as Record<string, unknown>).todayTitle) &&
    stringValue((buildGuide as Record<string, unknown>).todayDescription) &&
    stringList((buildGuide as Record<string, unknown>).todayTasks, 3, 6) &&
    stringValue((buildGuide as Record<string, unknown>).keepItManageableTitle) &&
    stringList((buildGuide as Record<string, unknown>).guidance, 3, 6)
  );
}
