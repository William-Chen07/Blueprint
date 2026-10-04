import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
        <div className="mt-8">
          <p className="font-mono text-[9px] uppercase tracking-[.25em] text-[#c5b890]">THE PROJECT SHELF</p>
          <h1 className="mt-8 font-serif text-5xl leading-none text-[#eadcb9] sm:text-6xl">Find your next “I made that.”</h1>
          <p className="mt-5 text-sm text-[#b9a77e]">
            Projects matched to your interests and skills. Pick a starting point and make it yours.
          </p>
        </div>
        <div className="mt-7 mb-10 grid gap-5 md:grid-cols-2">
          <div className="flex min-h-[164px] flex-col bg-[#eadcb9] p-6 shadow-[5px_7px_0_rgba(0,0,0,.38)]">
            <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#55493c]">01 / START A PROJECT</p>
            <h2 className="mt-4 text-xl font-bold">Explore a project</h2>
            <p className="mt-3 text-sm text-[#6b604b]">Follow a recommended build with a clear scope and skills to learn.</p>
            <Link href="#recommended-projects" className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-[#76301e]">
              Browse projects <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="flex min-h-[164px] flex-col bg-[#eadcb9] p-6 shadow-[5px_7px_0_rgba(0,0,0,.38)]">
            <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#55493c]">02 / MAKE IT YOURS</p>
            <h2 className="mt-4 text-xl font-bold">Bring your own idea</h2>
            <p className="mt-3 text-sm text-[#6b604b]">Describe it. Get a suggested stack, milestones, and a task plan.</p>
            <Link href="/dashboard" className="mt-auto inline-flex w-fit items-center gap-1 bg-[#923d29] px-5 py-3 text-sm font-semibold text-[#f1e6cb]">
              Plan my idea <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
        <div id="recommended-projects">
          <h2 className="mb-5 font-serif text-3xl text-[#eadcb9]">Recommended projects</h2>
          <ProjectFinder projects={projects} />
        </div>
      </div>
    </main>
  );
}
