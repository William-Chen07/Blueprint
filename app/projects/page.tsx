import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectFinder from "@/components/project-finder";
import { getProjects } from "@/lib/github";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main className="min-h-screen bg-[#c6a47a] px-4 py-10 text-[#252525] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs text-[#fffdf5]">
          <ArrowLeft className="size-4" /> Back home
        </Link>
        <div className="mt-8 mb-10 max-w-2xl bg-[#fffdf5] px-7 py-6 shadow-[6px_8px_0_rgba(77,53,31,.15)]">
          <p className="font-mono text-[9px] uppercase tracking-[.25em] text-[#6d6a60]">PROJECT BOARD</p>
          <h1 className="mt-3 font-serif text-5xl leading-none">Find your next build.</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#5b594f]">
            Pick an interest and we&apos;ll narrow the board down to projects that fit.
          </p>
        </div>
        <ProjectFinder projects={projects} />
      </div>
    </main>
  );
}
