import Link from "next/link";
import { ArrowRight, Paperclip, Pin } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import ProjectFinder from "@/components/project-finder";
import FlashlightBoard from "@/components/flashlight-board";
import { getProjects } from "@/lib/github";

export default async function Home() {
  const projects = getProjects();

  return (
    <main className="wood-texture min-h-screen overflow-hidden px-4 py-5 text-[#252525] sm:px-8 lg:px-12">
      <FlashlightBoard>
      <div className="mx-auto max-w-6xl rounded-lg border-4 border-[#34261c] bg-[rgba(16,12,10,.72)] p-4 shadow-[0_0_0_1px_rgba(221,189,128,.2),inset_0_0_28px_rgba(0,0,0,.7)] sm:p-6">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="relative -rotate-1 bg-[#e9dfc2] px-7 py-10 shadow-[8px_10px_0_rgba(0,0,0,.45)] sm:px-12 sm:py-14">
            <div className="absolute -top-3 left-8 text-[#3d4644]">
              <Paperclip className="size-12 -rotate-12 stroke-[1.2]" />
            </div>
            <div className="absolute -top-2 right-1/2 text-[#c83d35]">
              <Pin className="size-5 fill-current" />
            </div>
            <p className="mb-5 font-mono text-[9px] uppercase tracking-[.25em] text-[#55493c]">
              BUILD CLUB / FIELD NOTE NO. 061
            </p>
            <h1 className="max-w-xl font-serif text-5xl leading-[.98] tracking-tight sm:text-7xl">
              Ideas belong
              <br />
              out in the world.
            </h1>
            <p className="mt-6 -rotate-1 font-mono text-sm italic text-[#743324]">
              Find a project. Make a plan. Learn by making.
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-[#55493c]">
              Start with something that sparks your curiosity. We&apos;ll help
              you figure out the next step — even if it&apos;s your very first
              build.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/my-workspace"
                className={buttonVariants({
                className: "bg-[#76301e] px-5 text-xs text-[#f5e9cc] hover:bg-[#5e2417]",
                })}
              >
                Bring my idea <ArrowRight />
              </Link>
              <Link
                href="/projects"
                className={buttonVariants({
                  variant: "outline",
                className: "border-[#a99b7d] bg-transparent px-5 text-xs",
                })}
              >
                Find a project <ArrowRight />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[290px] w-full max-w-[480px] sm:h-[350px]">
            <div className="absolute inset-x-8 top-8 h-52 rotate-[-8deg] rounded-[14px] border border-[#a67d42] bg-[#d5a75c] shadow-[7px_9px_0_rgba(77,53,31,.18)]">
              <div className="absolute inset-5 rotate-2 border-2 border-dashed border-[#987340] bg-[#e8ddbd]" />
              <div className="absolute left-12 top-12 h-36 w-56 rotate-[-4deg] border border-[#b8ae9d] bg-[#f7f0df] shadow-md" />
              <div className="absolute right-8 top-5 h-16 w-12 rotate-[-12deg] bg-[#f9dc68] shadow-md" />
              <div className="absolute bottom-8 left-7 h-14 w-24 rotate-[-15deg] bg-[#2166c9] shadow-md" />
              <Paperclip className="absolute bottom-3 right-8 size-8 rotate-[-30deg] text-[#6e6e68]" />
            </div>
            <div className="absolute bottom-3 right-2 rotate-[5deg] bg-[#214dce] px-5 py-3 font-mono text-sm italic text-white shadow-md">
              from &quot;what if&quot;
              <br />
              to &quot;I made this.&quot;
            </div>
            <div className="absolute bottom-[-4px] left-8 rotate-[-3deg] bg-[#f6db70] px-5 py-3 font-serif text-lg italic shadow-md">
              Can&apos;t decide?
              <br />
              Surprise me
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-8 max-w-xl rotate-1 bg-[#eadcb9] px-6 py-3 font-serif text-xl italic shadow-[5px_6px_0_rgba(0,0,0,.4)]">
            Pick a project off the board
          </div>
          <ProjectFinder projects={projects} />
        </section>

        <section className="mt-12 grid gap-8 pb-8 sm:grid-cols-[.8fr_1.2fr] sm:items-center">
          <div className="rotate-[-3deg] bg-[#c19a55] px-6 py-5 shadow-[5px_7px_0_rgba(0,0,0,.4)]">
            <h2 className="font-serif text-xl italic">A little stuck? That&apos;s normal.</h2>
            <p className="mt-4 text-xs leading-relaxed">
              Your AI mentor can explain the next step. Read it, or listen when
              that works better for you.
            </p>
          </div>
          <div className="relative rotate-1 bg-[#eadcb9] px-7 py-6 shadow-[6px_8px_0_rgba(0,0,0,.4)] sm:px-10">
            <Paperclip className="absolute -right-2 -top-7 size-12 rotate-12 text-[#3d4644]" />
            <p className="font-mono text-[8px] uppercase tracking-[.18em] text-[#55493c]">
              Make this board yours
            </p>
            <p className="mt-3 font-mono text-lg italic text-[#743324]">
              Your interests. Your skills. Your pace.
            </p>
            <Link href="/profile" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
              Set up your learning profile <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </div>
      </FlashlightBoard>
    </main>
  );
}
