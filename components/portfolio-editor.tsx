"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { Project } from "@/lib/github";

interface PortfolioDetails {
  name: string;
  roles: string;
  headline: string;
  bio: string;
  skills: string;
  github: string;
  resume: string;
  linkedin: string;
}

const defaultDetails: PortfolioDetails = {
  name: "Your name",
  roles: "TECH · BUILDING · LEARNING",
  headline: "Curious mind. Learning by making.",
  bio: "Add a short introduction about what you are exploring and the kind of work you want to share.",
  skills: "Python · Web development · Figma",
  github: "",
  resume: "",
  linkedin: "",
};

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function getSavedDetails() {
  return window.localStorage.getItem("buildfolio-portfolio-details") ?? "";
}

function getFinishedProjects() {
  return window.localStorage.getItem("buildfolio-finished-projects") ?? "[]";
}

export default function PortfolioEditor({ projects }: { projects: Project[] }) {
  const savedDetails = useSyncExternalStore(subscribe, getSavedDetails, () => "");
  const savedFinished = useSyncExternalStore(subscribe, getFinishedProjects, () => "[]");
  const savedProfile = useMemo(() => {
    if (!savedDetails) return defaultDetails;
    try {
      const parsed = JSON.parse(savedDetails) as Partial<PortfolioDetails>;
      return { ...defaultDetails, ...parsed };
    } catch {
      return defaultDetails;
    }
  }, [savedDetails]);
  const [draft, setDraft] = useState<PortfolioDetails>(defaultDetails);
  const [editing, setEditing] = useState(false);

  const finishedProjects = useMemo(() => {
    try {
      const slugs = JSON.parse(savedFinished);
      return Array.isArray(slugs) ? projects.filter((project) => slugs.includes(project.slug)) : [];
    } catch {
      return [];
    }
  }, [projects, savedFinished]);

  function saveDetails() {
    window.localStorage.setItem("buildfolio-portfolio-details", JSON.stringify(draft));
    window.dispatchEvent(new Event("storage"));
    setEditing(false);
  }

  return (
    <main className="min-h-screen px-4 pb-12 pt-10 text-[#2b2014] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#c5b890]">PERSONAL DOSSIER / BUILDER 001</p>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-6xl leading-none text-[#eadcb9] sm:text-7xl">{savedProfile.name}</h1>
            <p className="mt-4 font-mono text-[10px] text-[#b9a77e]">{savedProfile.roles}</p>
          </div>
          <button type="button" onClick={() => { setDraft(savedProfile); setEditing((current) => !current); }} className="cursor-pointer bg-[#923d29] px-4 py-3 font-mono text-xs text-[#f1e6cb] transition-colors hover:bg-[#8a3a26]">
            {editing ? "Close editor" : "Edit my portfolio"}
          </button>
        </div>

        {editing && (
          <form onSubmit={(event) => { event.preventDefault(); saveDetails(); }} className="mt-6 grid gap-4 bg-[#eadcb9] p-6 shadow-[5px_7px_0_rgba(0,0,0,.35)] sm:grid-cols-2">
            <PortfolioInput label="Name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
            <PortfolioInput label="Roles / interests" value={draft.roles} onChange={(value) => setDraft({ ...draft, roles: value })} />
            <PortfolioInput label="Headline" value={draft.headline} onChange={(value) => setDraft({ ...draft, headline: value })} />
            <PortfolioInput label="Skills" value={draft.skills} onChange={(value) => setDraft({ ...draft, skills: value })} />
            <label className="text-xs font-semibold sm:col-span-2">About me<textarea value={draft.bio} onChange={(event) => setDraft({ ...draft, bio: event.target.value })} className="mt-2 min-h-20 w-full border border-[#b8a47e] bg-[#f5ebd1] p-3 text-sm outline-none focus:border-[#76301e]" /></label>
            <PortfolioInput label="GitHub URL" value={draft.github} onChange={(value) => setDraft({ ...draft, github: value })} />
            <PortfolioInput label="Resume URL" value={draft.resume} onChange={(value) => setDraft({ ...draft, resume: value })} />
            <PortfolioInput label="LinkedIn URL" value={draft.linkedin} onChange={(value) => setDraft({ ...draft, linkedin: value })} />
            <button type="submit" className="w-fit cursor-pointer bg-[#76301e] px-5 py-3 text-sm font-semibold text-[#f1e6cb] transition-colors hover:bg-[#8a3a26]">Save details</button>
          </form>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="min-h-[300px] bg-[#eadcb9] p-7 shadow-[6px_8px_0_rgba(0,0,0,.38)]">
            <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#76301e]">PROFILE / 001</p>
            <h2 className="mt-6 font-serif text-3xl">{savedProfile.headline}</h2>
            <p className="mt-6 text-sm leading-relaxed">{savedProfile.bio}</p>
            <p className="mt-6 font-mono text-[9px] uppercase tracking-[.2em] text-[#76301e]">SKILLS / MY TOOLKIT</p>
            <p className="mt-4 font-serif text-lg italic">{savedProfile.skills}</p>
            <div className="mt-8 flex flex-wrap gap-4 font-mono text-xs">
              {[
                ["GitHub", savedProfile.github],
                ["Resume", savedProfile.resume],
                ["LinkedIn", savedProfile.linkedin],
              ].map(([label, href]) => href ? <a key={label} href={href} target="_blank" rel="noreferrer" className="text-[#76301e] underline">{label} ↗</a> : null)}
            </div>
          </article>
          <article className="min-h-[300px] bg-[#eadcb9] p-7 shadow-[6px_8px_0_rgba(0,0,0,.38)]">
            <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#76301e]">FIELD NOTES / IN PROGRESS</p>
            <h2 className="mt-6 font-serif text-3xl">Small steps. Real progress.</h2>
            <ol className="mt-6 space-y-4 text-sm">
              <li>01 / Finished projects: {finishedProjects.length}</li>
              <li>02 / Skills in my toolkit: {savedProfile.skills.split("·").filter(Boolean).length}</li>
              <li>03 / Keep learning by making.</li>
            </ol>
          </article>
        </section>

        <section className="mt-10">
          <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#c5b890]">SELECTED WORK / OPEN A CASE FILE</p>
          <h2 className="mt-4 font-serif text-2xl italic text-[#eadcb9]">A few things I&apos;ve made, and what I learned along the way.</h2>
          {finishedProjects.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {finishedProjects.map((project) => <FinishedProjectCard key={project.slug} project={project} />)}
            </div>
          ) : (
            <div className="mt-6 bg-[#d9cda8] p-6 text-sm shadow-[4px_6px_0_rgba(0,0,0,.3)]">
              Finish every task in a project workspace and it will appear here.
              <Link href="/projects" className="ml-2 font-semibold text-[#76301e] underline">Explore projects →</Link>
            </div>
          )}
        </section>
        <p className="mt-8 font-serif text-lg italic text-[#e0c77e]">Your story, collected. Always a work in progress.</p>
      </div>
    </main>
  );
}

function PortfolioInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="text-xs font-semibold">{label}<input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full border border-[#b8a47e] bg-[#f5ebd1] p-3 text-sm outline-none focus:border-[#76301e]" /></label>;
}

function FinishedProjectCard({ project }: { project: Project }) {
  return (
    <article className="bg-[#eadcb9] p-5 shadow-[5px_7px_0_rgba(0,0,0,.35)]">
      <p className="font-mono text-[9px] uppercase text-[#76301e]">CASE FILE / FINISHED</p>
      <div className="mt-4 flex h-20 items-center bg-[#c6b991] px-4 font-mono text-sm">{project.title}</div>
      <h3 className="mt-5 font-serif text-2xl">{project.title}</h3>
      <p className="mt-3 text-sm leading-relaxed">{project.description}</p>
      <p className="mt-4 font-mono text-[9px] text-[#76301e]">{project.techStack.slice(0, 3).join(" · ")}</p>
      <Link href={`/projects/${project.slug}`} className="mt-5 inline-block font-serif text-sm italic text-[#76301e]">Open case file →</Link>
    </article>
  );
}
