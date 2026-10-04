"use client";

import { useMemo, useSyncExternalStore } from "react";
import ProjectCard from "@/components/project-card";
import type { Project } from "@/lib/github";

const interests = ["Web development", "Data science", "Design", "AI", "Cybersecurity", "Game development"];
const projectInterestMap: Record<string, string[]> = {
  "Web development": ["software engineering"],
  "Data science": ["data science"],
  Design: ["product design"],
  AI: ["data science"],
  Cybersecurity: ["cybersecurity"],
  "Game development": ["software engineering"],
};

function subscribeToProfileInterests(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getProfileInterests() {
  return window.localStorage.getItem("buildfolio-interests") ?? "[]";
}

export default function ProjectFinder({ projects }: { projects: Project[] }) {
  const savedInterests = useSyncExternalStore(
    subscribeToProfileInterests,
    getProfileInterests,
    () => "[]",
  );
  const selected = useMemo(() => {
    try {
      const interestsFromProfile = JSON.parse(savedInterests);
      return Array.isArray(interestsFromProfile)
        ? interests.filter((interest) => interestsFromProfile.includes(interest))
        : [];
    } catch {
      return [];
    }
  }, [savedInterests]);

  const visibleProjects = useMemo(() => {
    if (selected.length === 0) return projects;
    const projectInterests = selected.flatMap((interest) => projectInterestMap[interest] ?? []);
    return projects.filter((project) =>
      project.interests.some((interest) => projectInterests.includes(interest)),
    );
  }, [projects, selected]);

  function toggleInterest(interest: string) {
    const next = selected.includes(interest)
      ? selected.filter((item) => item !== interest)
      : [...selected, interest];
    window.localStorage.setItem("buildfolio-interests", JSON.stringify(next));
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <>
      <div className="mb-8 bg-[#eadcb9] px-6 py-5 shadow-[5px_6px_0_rgba(0,0,0,.35)]">
        <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#55493c]">FILTER BY YOUR PROFILE</p>
        <h2 className="mt-2 font-serif text-2xl italic">Your interests</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {interests.map((interest) => {
            const active = selected.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                aria-pressed={active}
                className={`border px-3 py-2 font-mono text-[10px] capitalize transition-colors ${
                  active ? "border-[#76301e] bg-[#76301e] text-[#fff4d6]" : "border-[#a99b7d] bg-[#f3ead1] hover:border-[#76301e]"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[.18em] text-[#eadcb9]">
        {selected.length === 0 ? "Showing all five project ideas" : `Showing projects for ${selected.join(" + ")}`}
      </p>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {visibleProjects.map((project) => (
          <ProjectCard
            key={project.slug}
            {...project}
            title={project.title.replace(" ", "\n")}
            href={`/projects/${project.slug}`}
          />
        ))}
      </div>
      {visibleProjects.length === 0 && (
        <p className="bg-[#eadcb9] px-5 py-4 text-sm">No exact match yet. Try another interest.</p>
      )}
    </>
  );
}
