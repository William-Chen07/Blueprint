"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Compass,
  Hammer,
  Layers3,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import WorkspaceHeader from "@/components/WorkspaceHeader";
import { isProjectDashboard, type ProjectDashboard } from "@/lib/project-dashboard";

type DashboardTab = "overview" | "brief" | "milestones" | "build";
const loadingSnapshot = "__blueprint_dashboard_loading__";

function subscribeToDashboard(id: string, onChange: () => void) {
  const key = `blueprint-project-dashboard:${id}`;
  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

const tabs: Array<{ id: DashboardTab; label: string; icon: typeof Compass }> = [
  { id: "overview", label: "Overview", icon: Compass },
  { id: "brief", label: "The brief", icon: BookOpen },
  { id: "milestones", label: "Milestones", icon: Layers3 },
  { id: "build", label: "Build guide", icon: Hammer },
];

function DashboardContent({
  dashboard,
  tab,
  onOpenMilestones,
}: {
  dashboard: ProjectDashboard;
  tab: DashboardTab;
  onOpenMilestones: () => void;
}) {
  if (tab === "brief") {
    return (
      <div className="project-dashboard-grid">
        <article className="project-paper project-paper-feature">
          <p className="project-overline">THE PROJECT BRIEF</p>
          <h2>{dashboard.projectName}</h2>
          <p className="project-lead">{dashboard.brief.summary}</p>
          <div className="project-brief-facts">
            <section>
              <h3>Who it is for</h3>
              <p>{dashboard.brief.audience}</p>
            </section>
            <section>
              <h3>First version</h3>
              <p>{dashboard.brief.firstVersion}</p>
            </section>
          </div>
          <div className="project-first-win">
            <Sparkles aria-hidden="true" />
            <div><span>YOUR FIRST WIN</span><p>{dashboard.firstWin}</p></div>
          </div>
        </article>
        <article className="project-paper">
          <p className="project-overline">YOUR TOOLKIT</p>
          <h2>Tools to get started</h2>
          <div className="project-tool-list">
            {dashboard.toolkit.map((tool) => (
              <section className="project-tool" key={tool.name}>
                <span className="project-tool-icon"><Hammer aria-hidden="true" /></span>
                <div><h3>{tool.name}</h3><p>{tool.purpose}</p><small>FIRST USE · {tool.firstUse}</small></div>
              </section>
            ))}
          </div>
        </article>
        <article className="project-paper project-wide">
          <p className="project-overline">LEARN AS YOU BUILD</p>
          <h2>Your learning path</h2>
          <ol className="project-learning-list">
            {dashboard.learningPath.slice().sort((a, b) => a.order - b.order).map((step) => (
              <li key={`${step.order}-${step.topic}`}>
                <span>{String(step.order).padStart(2, "0")}</span>
                <div><h3>{step.topic}</h3><p>{step.reason}</p></div>
              </li>
            ))}
          </ol>
        </article>
      </div>
    );
  }

  if (tab === "milestones") {
    return (
      <div className="project-milestones">
        <div className="project-section-heading">
          <div><p className="project-overline">THE ROAD AHEAD</p><h2>Small steps. Real progress.</h2></div>
          <span>{dashboard.milestones.length} MILESTONES</span>
        </div>
        <ol className="project-milestone-list">
          {dashboard.milestones.map((milestone, index) => (
            <li className="project-milestone" key={`${milestone.title}-${index}`}>
              <div className="project-milestone-marker">{String(index + 1).padStart(2, "0")}</div>
              <article className="project-paper">
                <div className="project-milestone-heading">
                  <div><p className="project-overline">MILESTONE {String(index + 1).padStart(2, "0")}</p><h3>{milestone.title}</h3></div>
                  <span>{milestone.effort}</span>
                </div>
                <p className="project-lead">{milestone.goal}</p>
                <ul className="project-task-list">
                  {milestone.tasks.map((task) => <li key={task}><Check aria-hidden="true" />{task}</li>)}
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (tab === "build") {
    return (
      <div className="project-dashboard-grid">
        <article className="project-paper project-build-today">
          <p className="project-overline">START HERE · TODAY</p>
          <h2>{dashboard.buildGuide.todayTitle}</h2>
          <p className="project-lead">{dashboard.buildGuide.todayDescription}</p>
          <ul className="project-task-list project-today-tasks">
            {dashboard.buildGuide.todayTasks.map((task) => <li key={task}><Check aria-hidden="true" />{task}</li>)}
          </ul>
          <Link className="project-action" href="/dashboard">Back to your notebook <ArrowRight aria-hidden="true" /></Link>
        </article>
        <article className="project-paper project-guidance">
          <span className="project-guidance-icon"><Lightbulb aria-hidden="true" /></span>
          <p className="project-overline">A NOTE FROM YOUR MENTOR</p>
          <h2>{dashboard.buildGuide.keepItManageableTitle}</h2>
          <ul>
            {dashboard.buildGuide.guidance.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </article>
      </div>
    );
  }

  return (
    <div className="project-dashboard-grid">
      <article className="project-paper project-overview-hero">
        <div className="project-overview-title">
          <div><p className="project-overline">A BLUEPRINT FOR YOUR NEXT BIG THING</p><h2>{dashboard.projectName}</h2></div>
          <span className="project-type-tag">{dashboard.projectType}</span>
        </div>
        <p className="project-lead">{dashboard.brief.summary}</p>
        <div className="project-first-win">
          <Sparkles aria-hidden="true" />
          <div><span>YOUR FIRST WIN</span><p>{dashboard.firstWin}</p></div>
        </div>
      </article>
      <article className="project-paper">
        <p className="project-overline">YOUR TOOLKIT</p>
        <h2>The right tools for the job</h2>
        <div className="project-tool-list">
          {dashboard.toolkit.slice(0, 4).map((tool) => (
            <section className="project-tool" key={tool.name}>
              <span className="project-tool-icon"><Hammer aria-hidden="true" /></span>
              <div><h3>{tool.name}</h3><p>{tool.purpose}</p></div>
            </section>
          ))}
        </div>
      </article>
      <article className="project-paper project-learning-card">
        <p className="project-overline">GROW AS YOU GO</p>
        <h2>What to learn</h2>
        <ol className="project-learning-list">
          {dashboard.learningPath.slice().sort((a, b) => a.order - b.order).slice(0, 4).map((step) => (
            <li key={`${step.order}-${step.topic}`}>
              <span>{String(step.order).padStart(2, "0")}</span>
              <div><h3>{step.topic}</h3><p>{step.reason}</p></div>
            </li>
          ))}
        </ol>
      </article>
      <article className="project-paper project-next-card">
        <span className="project-next-icon"><Compass aria-hidden="true" /></span>
        <p className="project-overline">YOUR NEXT MOVE</p>
        <h2>{dashboard.milestones[0]?.title}</h2>
        <p>{dashboard.milestones[0]?.goal}</p>
        <button type="button" className="project-text-link" onClick={onOpenMilestones}>
          See your milestones <ArrowRight aria-hidden="true" />
        </button>
      </article>
    </div>
  );
}

export default function ProjectDashboardPage() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState<DashboardTab>("overview");
  const subscribe = useCallback(
    (onChange: () => void) => subscribeToDashboard(params.id, onChange),
    [params.id],
  );
  const getSnapshot = useCallback(() => {
    try {
      return localStorage.getItem(`blueprint-project-dashboard:${params.id}`) ?? "";
    } catch {
      return "__blueprint_dashboard_unavailable__";
    }
  }, [params.id]);
  const stored = useSyncExternalStore(subscribe, getSnapshot, () => loadingSnapshot);
  const loaded = stored !== loadingSnapshot;
  const dashboard = useMemo(() => {
    if (!stored || stored === "__blueprint_dashboard_unavailable__") return null;
    try {
      const parsed: unknown = JSON.parse(stored);
      return isProjectDashboard(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }, [stored]);

  return (
    <main className="notebook-page project-dashboard-page min-h-screen px-3 pb-8 pt-4 text-[#35291f] sm:px-10">
      <div className="notebook-wrap mx-auto max-w-[1180px]">
        <WorkspaceHeader />
        {!loaded ? (
          <div className="project-load-state" role="status">Opening your project notebook…</div>
        ) : dashboard ? (
          <section className="project-dashboard-shell">
            <div className="project-dashboard-topline">
              <Link href="/dashboard" className="project-back-link"><ArrowLeft aria-hidden="true" /> Your notebook</Link>
              <span>PROJECT CASE FILE · {params.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="project-dashboard-heading">
              <div><p className="project-overline">YOUR PROJECT WORKSPACE</p><h1>{dashboard.projectName}</h1></div>
              <span className="project-status"><span /> IN PROGRESS</span>
            </div>
            <nav className="project-dashboard-tabs" aria-label="Project sections">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  className={tab === id ? "active" : ""}
                  aria-current={tab === id ? "page" : undefined}
                  onClick={() => setTab(id)}
                >
                  <Icon aria-hidden="true" />{label}
                </button>
              ))}
            </nav>
            <DashboardContent
              dashboard={dashboard}
              tab={tab}
              onOpenMilestones={() => setTab("milestones")}
            />
          </section>
        ) : (
          <section className="project-missing-state">
            <span className="project-missing-icon"><Lightbulb aria-hidden="true" /></span>
            <p className="project-overline">CASE FILE NOT FOUND</p>
            <h1>This project notebook isn’t available here.</h1>
            <p>Project dashboards are saved in the browser where you created them. Start a new project to generate another one.</p>
            <Link href="/dashboard" className="project-action">Back to your notebook <ArrowRight aria-hidden="true" /></Link>
          </section>
        )}
      </div>
    </main>
  );
}
