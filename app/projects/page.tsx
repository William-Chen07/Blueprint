import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ProjectFinder from "@/components/project-finder";
import { getProjects } from "@/lib/github";

export default function ProjectsPage() {
  const projects = getProjects();

  return (
    <main className="min-h-screen px-4 py-8 text-[#252525] sm:px-8 lg:px-12">
      <div className="board-frame mx-auto max-w-6xl rounded-lg border-4 border-[#34261c] bg-[rgba(16,12,10,.72)] p-4 shadow-[0_0_0_1px_rgba(221,189,128,.2),inset_0_0_28px_rgba(0,0,0,.7)] sm:p-6">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs text-[#eadcb9]">
          <ArrowLeft className="size-4" /> Back home
        </Link>
        <div className="mt-8 mb-10 max-w-2xl -rotate-1 bg-[#e9dfc2] px-7 py-6 shadow-[6px_8px_0_rgba(0,0,0,.4)]">
          <p className="font-mono text-[9px] uppercase tracking-[.25em] text-[#55493c]">PROJECT BOARD / FIELD NOTE NO. 002</p>
          <h1 className="mt-3 font-serif text-5xl leading-none">Find your next build.</h1>
          <p className="mt-4 text-sm leading-relaxed text-[#55493c]">
            Pick an interest and we&apos;ll narrow the board down to projects that fit.
          </p>
        </div>
        <ProjectFinder projects={projects} />
      </div>
    </main>
  );
}
