"use client";

import { useMemo, useState } from "react";
import ProjectCard from "@/components/project-card";
import type { Project } from "@/lib/github";

const interests = ["software engineering", "data science", "cybersecurity", "product design"];

export default function ProjectFinder({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const visibleProjects = useMemo(() => {
    if (selected.length === 0) return projects;
    return projects.filter((project) =>
      project.interests.some((interest) => selected.includes(interest)),
    );
  }, [projects, selected]);

  function toggleInterest(interest: string) {
    setSelected((current) =>
      current.includes(interest)
        ? current.filter((item) => item !== interest)
        : [...current, interest],
    );
  }

  return (
    <>
      <div className="mb-8 max-w-2xl rotate-1 bg-[#fffdf5] px-6 py-5 shadow-[5px_6px_0_rgba(77,53,31,.12)]">
        <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#6d6a60]">START WITH WHAT YOU LIKE</p>
        <h2 className="mt-2 font-serif text-2xl italic">Choose your interests</h2>
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
                  active ? "border-[#214dce] bg-[#214dce] text-white" : "border-[#d8d4c7] bg-[#fffdf5] hover:border-[#214dce]"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mb-5 font-mono text-[10px] uppercase tracking-[.18em] text-[#fffdf5]">
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
        <p className="bg-[#fffdf5] px-5 py-4 text-sm">No exact match yet. Try another interest.</p>
      )}
    </>
  );
}
