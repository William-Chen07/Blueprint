"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, LoaderCircle, Sparkles } from "lucide-react";
import type { IdeaPlan } from "@/lib/idea-plan";

const experienceOptions = [
  { value: "starting", label: "Just starting" },
  { value: "building", label: "Built a few things" },
  { value: "experienced", label: "Experienced" },
] as const;

export default function IdeaPlanner() {
  const [idea, setIdea] = useState("");
  const [experience, setExperience] = useState<(typeof experienceOptions)[number]["value"]>("starting");
  const [hoursPerWeek, setHoursPerWeek] = useState(4);
  const [plan, setPlan] = useState<IdeaPlan | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function createPlan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPlan(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, experience, hoursPerWeek }),
      });
      const result = (await response.json()) as IdeaPlan | { error?: string };

      if (!response.ok) {
        setError("error" in result ? result.error ?? "Could not create a plan." : "Could not create a plan.");
        return;
      }

      if (!("title" in result)) {
        setError("Gemini returned an unexpected response. Please try again.");
        return;
      }

      setPlan(result);
    } catch {
      setError("Could not connect to the planner. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-start">
        <form
          onSubmit={createPlan}
          className="bg-[#eadfbd] p-5 shadow-[7px_9px_0_rgba(0,0,0,.38)] sm:p-7"
        >
          <label htmlFor="project-idea" className="font-sans text-xl font-bold">
            What do you want to build?
          </label>
          <p className="mt-2 text-sm text-[#6b604b]">
            A rough idea is plenty. What should it do, and who might use it?
          </p>
          <textarea
            id="project-idea"
            required
            minLength={10}
            maxLength={2000}
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            placeholder="A website that helps my neighborhood share extra garden produce..."
            className="mt-4 min-h-36 w-full resize-y border border-[#b9aa84] bg-[#fffdf5] p-4 text-sm leading-relaxed outline-none placeholder:text-[#8b8068] focus:border-[#76301e] focus:ring-1 focus:ring-[#76301e]"
          />
          <div className="mt-1 flex justify-end font-mono text-[10px] text-[#756a54]">
            {idea.length}/2,000
          </div>

          <fieldset className="mt-6">
            <legend className="font-sans text-base font-bold">Where are you starting?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {experienceOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={experience === option.value}
                  onClick={() => setExperience(option.value)}
                  className={`px-3 py-2 font-mono text-[10px] transition-colors ${
                    experience === option.value
                      ? "bg-[#76301e] text-[#fff4d6]"
                      : "bg-[#d5c8a3] hover:bg-[#c6b78d]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label htmlFor="hours-per-week" className="mt-6 block font-sans text-base font-bold">
            Time you can set aside
          </label>
          <div className="mt-3 flex items-center gap-4">
            <input
              id="hours-per-week"
              type="range"
              min="1"
              max="20"
              value={hoursPerWeek}
              onChange={(event) => setHoursPerWeek(Number(event.target.value))}
              className="w-full accent-[#76301e]"
            />
            <output htmlFor="hours-per-week" className="w-28 shrink-0 font-mono text-xs">
              {hoursPerWeek} {hoursPerWeek === 1 ? "hour" : "hours"} / week
            </output>
          </div>

          <button
            type="submit"
            disabled={isLoading || idea.trim().length < 10}
            className="mt-7 inline-flex items-center gap-2 bg-[#76301e] px-5 py-3 text-sm text-[#fff4d6] shadow-[3px_4px_0_rgba(0,0,0,.2)] transition-colors hover:bg-[#5e2417] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <LoaderCircle className="size-4 animate-spin" /> Making your plan...
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Make my project plan <ArrowRight className="size-4" />
              </>
            )}
          </button>
          <p aria-live="polite" role={error ? "alert" : undefined} className="mt-4 text-sm text-[#743324]">
            {error}
          </p>
        </form>

        <aside className="rotate-1 bg-[#e0c77e] p-6 shadow-[7px_9px_0_rgba(0,0,0,.38)] sm:p-7">
          <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#554b32]">
            A PLAN THAT FITS YOU
          </p>
          <h2 className="mt-7 font-serif text-4xl leading-[.98] sm:text-5xl">
            Small steps. Real progress.
          </h2>
          <p className="mt-6 text-sm leading-relaxed text-[#665a3e]">
            Your mentor will suggest tools that fit your experience, explain
            what to learn first, and break the build into milestones you can
            tackle at your own pace.
          </p>
          <p className="mt-5 border-t border-[#a68d4e] pt-4 font-mono text-[10px] text-[#554b32]">
            You don&apos;t need to know it all to get started.
          </p>
        </aside>
      </div>

      {plan && (
        <section aria-live="polite" className="mt-10 space-y-6">
          <header className="bg-[#fffdf5] p-6 shadow-[5px_6px_0_rgba(0,0,0,.3)] sm:p-8">
            <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#214dce]">
              YOUR PROJECT BLUEPRINT
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-tight">{plan.title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#5b594f]">{plan.summary}</p>
            <div className="mt-5 border-l-4 border-[#e0c77e] bg-[#f3eee2] px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#6d6a60]">
                Your first step
              </p>
              <p className="mt-1 text-sm leading-relaxed">{plan.firstStep}</p>
            </div>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="bg-[#eadfbd] p-6 shadow-[5px_6px_0_rgba(0,0,0,.3)]">
              <h3 className="font-serif text-2xl italic">The toolkit</h3>
              <p className="mt-1 text-xs text-[#6b604b]">A focused stack to bring this idea to life.</p>
              <ul className="mt-5 space-y-3">
                {plan.techStack.map((tool) => (
                  <li key={tool.name} className="border-l-2 border-[#76301e] bg-[#fffdf5] px-4 py-3">
                    <p className="font-semibold">{tool.name}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#5b594f]">{tool.purpose}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-[#d5a75c] p-6 shadow-[5px_6px_0_rgba(0,0,0,.3)]">
              <h3 className="font-serif text-2xl italic">What to learn</h3>
              <p className="mt-1 text-xs text-[#55493c]">In a useful order, as you need it.</p>
              <ol className="mt-5 space-y-3">
                {plan.languagesToLearn.map((language) => (
                  <li key={language.order} className="flex gap-3 bg-[#f7f0df] px-4 py-3">
                    <span className="font-mono text-sm text-[#76301e]">{String(language.order).padStart(2, "0")}</span>
                    <span>
                      <span className="block font-semibold">{language.name}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-[#5b594f]">{language.why}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className="bg-[#f3eee2] p-6 shadow-[5px_6px_0_rgba(0,0,0,.3)] sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#214dce]">
                  FROM IDEA TO FIRST VERSION
                </p>
                <h3 className="mt-2 font-serif text-3xl italic">Your build path</h3>
              </div>
              <p className="font-mono text-[10px] text-[#6d6a60]">Adjust the pace to fit your week.</p>
            </div>
            <ol className="mt-6 grid gap-4 md:grid-cols-2">
              {plan.milestones.map((milestone, index) => (
                <li key={milestone.title} className="bg-[#fffdf5] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[.15em] text-[#214dce]">
                        MILESTONE {String(index + 1).padStart(2, "0")}
                      </p>
                      <h4 className="mt-2 font-serif text-xl">{milestone.title}</h4>
                    </div>
                    <span className="shrink-0 font-mono text-[10px] text-[#6d6a60]">
                      ~{milestone.estimatedHours}h
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-[#5b594f]">{milestone.description}</p>
                  <ul className="mt-4 space-y-2">
                    {milestone.tasks.map((task) => (
                      <li key={task} className="flex gap-2 text-xs leading-relaxed text-[#5b594f]">
                        <span className="text-[#76301e]">—</span> {task}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        </section>
      )}
    </>
  );
}
