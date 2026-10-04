import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Clip, Pin } from "@/components/board-decor";
import { getProjects } from "@/lib/github";

const paper = "bg-[linear-gradient(135deg,#efe4c6,#e0d2ad)] shadow-[0_10px_18px_rgba(0,0,0,.45)]";
const cardTabs = ["bg-[#c9d8c0]", "bg-[#d3e0f0]", "bg-[#f0d6cf]"];
const cardTilts = ["-rotate-[2deg]", "-rotate-[.5deg]", "rotate-[1.5deg]"];
const cardOffsets = ["", "lg:-translate-y-3", "lg:translate-y-2"];

export default function Home() {
  const projects = getProjects().slice(0, 3);

  return (
    <main className="min-h-screen px-4 pb-10 pt-4 text-[#2b2014] sm:px-8">
      <div className="mx-auto max-w-[1376px] rounded-2xl border-[10px] border-[#2e2218] bg-[rgba(14,10,8,.55)] p-6 shadow-[inset_0_0_60px_rgba(0,0,0,.8)] sm:p-10">
        <section className="grid gap-10 lg:grid-cols-[1.4fr_.8fr]">
          <div className={`relative -rotate-[.6deg] self-start px-8 py-12 sm:px-9 ${paper}`}>
            <Clip className="-left-4 -top-3 -rotate-6" />
            <Pin className="left-[56%] -top-4" />
            <p className="font-mono text-[10px] uppercase tracking-[.1em] text-[#55493c]">
              FIELD NOTE NO. 001 / A NEW CHAPTER
            </p>
            <h1 className="mt-6 font-serif text-5xl font-extrabold leading-[1.25] sm:text-6xl">
              Every idea
              <br />
              has a story.
            </h1>
            <p className="mt-5 font-hand text-2xl text-[#76301e]">Let&apos;s find out what yours can become.</p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[#3d3326]">
              Pick a project or bring a spark of your own. Follow the clues, learn the skills, and build something
              worth sharing.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/mentor"
                className="inline-flex items-center gap-1.5 bg-[#8a2f1e] px-6 py-3 text-sm font-semibold text-[#f5e9cc] shadow-[0_3px_5px_rgba(0,0,0,.35)] hover:bg-[#6f2416]"
              >
                Bring my idea <ArrowRight className="size-3.5" />
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 border border-[#8c806a] px-6 py-3 text-sm font-semibold hover:bg-[#f6e8c5]/60"
              >
                Find a project <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md rotate-[3deg] rounded-xl bg-[#8a6c3a] p-5 pb-8 shadow-[0_12px_22px_rgba(0,0,0,.5)] lg:-mt-2">
            <span className="absolute -top-4 left-[12%] h-6 w-1/4 rounded-t-lg bg-[#8a6c3a]" aria-hidden="true" />
            <Pin className="right-[22%] -top-5" />
            <Clip className="-right-3 top-4 rotate-12" />
            <div className="relative min-h-[470px] bg-[repeating-linear-gradient(180deg,#eadfbd_0,#eadfbd_33px,#cdbf99_34px)] px-6 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[.1em] text-[#55493c]">YOUR NEXT CASE</p>
              <p className="mt-4 font-hand text-4xl font-bold italic text-[#76301e]">What if I built...</p>
              <p className="mt-3 font-hand text-xl leading-[1.45] text-[#2b2014]">
                A place for my work?
                <br />
                A tool to understand my spending?
                <br />
                Something nobody has tried yet?
              </p>
              <div className="relative mt-5 -rotate-2 bg-[#d8b84f] px-5 py-5 shadow-[3px_5px_6px_rgba(0,0,0,.35)]">
                <p className="font-hand text-3xl font-bold uppercase text-[#2b2014]">New mission!</p>
                <p className="font-hand text-3xl font-bold text-[#2b2014]">Your journey begins.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid items-start gap-6 lg:grid-cols-[1fr_280px]">
          <div className={`relative -rotate-[.5deg] px-8 py-6 ${paper}`}>
            <span className="absolute -top-3 left-[34%] h-5 w-24 rotate-3 bg-[#cbbf9f]/70" aria-hidden="true" />
            <h2 className="font-hand text-4xl font-bold italic text-[#76301e]">Pick a project off the board</h2>
          </div>
          <Link
            href="/dashboard"
            className="relative -rotate-[2deg] bg-[#8d6f3d] px-6 py-6 shadow-[0_8px_14px_rgba(0,0,0,.45)] hover:bg-[#9a7b45]"
          >
            <Pin className="right-6 -top-3" />
            <p className="font-hand text-3xl font-semibold text-[#4b3319]">Can&apos;t decide?</p>
            <p className="font-hand text-3xl font-semibold text-[#4b3319]">Surprise me</p>
          </Link>
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              aria-label={`Open brief for ${project.title}`}
              className={`relative block min-h-[280px] px-9 pb-8 pt-12 transition-transform hover:-translate-y-1 ${paper} ${cardTilts[index]} ${cardOffsets[index]}`}
            >
              <span className={`absolute -top-3 left-8 h-6 w-1/3 ${cardTabs[index]}`} aria-hidden="true" />
              <Pin className="left-[55%] -top-3" />
              <p className="font-mono text-[10px] uppercase tracking-[.06em] text-[#55493c]">{project.category}</p>
              <h2 className="mt-5 max-w-[10ch] font-serif text-3xl font-bold leading-[1.15]">{project.title}</h2>
              <p className="mt-4 text-sm leading-relaxed text-[#3d3326]">{project.description}</p>
              <p className="mt-5 flex gap-4 font-mono text-[10px] text-[#55493c]">
                <span>
                  {project.level} · {project.time}
                </span>
                <span>Open brief ↗</span>
              </p>
            </Link>
          ))}
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <div className="relative -rotate-[2deg] bg-[linear-gradient(135deg,#dcc268,#d1b152)] px-8 py-8 shadow-[0_10px_18px_rgba(0,0,0,.45)]">
            <Pin className="left-[38%] -top-3" />
            <p className="font-hand text-3xl font-semibold text-[#76301e]">A little stuck? That&apos;s normal.</p>
            <p className="mt-3 text-sm leading-relaxed text-[#3d3326]">
              Your AI mentor can explain the next step. Read it, or listen when that works better for you.
            </p>
          </div>
          <div className={`relative rotate-[1deg] px-8 py-7 ${paper}`}>
            <Clip className="-right-3 -top-6 rotate-6" />
            <p className="font-mono text-[10px] uppercase tracking-[.1em] text-[#55493c]">MAKE THIS BOARD YOURS</p>
            <p className="mt-3 font-hand text-3xl font-semibold text-[#76301e]">Your interests. Your skills. Your pace.</p>
            <Link href="/profile" className="mt-3 inline-flex items-center gap-1 text-sm font-bold">
              Set up your learning profile <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
