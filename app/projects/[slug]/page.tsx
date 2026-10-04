import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { getProject, getProjects } from "@/lib/github";
import ProjectTaskBoard from "@/components/project-task-board";

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }));
}

export default async function ProjectGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[#c6a47a] px-4 py-10 text-[#252525] sm:px-8 lg:px-12">
      <article className="mx-auto max-w-4xl bg-[#fffdf5] px-7 py-10 shadow-[8px_10px_0_rgba(77,53,31,.15)] sm:px-12">
        <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs text-[#214dce]">
          <ArrowLeft className="size-4" /> Back to projects
        </Link>
        <p className="mt-10 font-mono text-[9px] uppercase tracking-[.25em] text-[#6d6a60]">{project.category}</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-7xl">{project.title}</h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#5b594f]">{project.description}</p>
        <div className="mt-6 flex gap-3 font-mono text-xs text-[#214dce]">
          <span className="bg-[#f6db70] px-3 py-2">{project.level}</span>
          <span className="bg-[#f6db70] px-3 py-2">{project.time}</span>
        </div>
        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="bg-[#f6db70] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[.2em]">Recommended deadline</p>
            <p className="mt-3 font-serif text-2xl">{project.deadline}</p>
          </div>
          <div className="bg-[#f3f6ef] p-5">
            <p className="font-mono text-[9px] uppercase tracking-[.2em]">Project brief</p>
            <p className="mt-3 text-sm leading-relaxed text-[#5b594f]">{project.brief}</p>
          </div>
        </section>
        <div className="mt-8">
          <ProjectTaskBoard tasks={project.tasks} />
        </div>
        <section className="mt-10 grid gap-8 border-t border-[#d8d4c7] pt-8 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl italic">Tech stack & setup</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tool) => (
                <span key={tool} className="bg-[#214dce] px-3 py-2 font-mono text-xs text-white">{tool}</span>
              ))}
            </div>
            <ul className="mt-5 space-y-3 text-sm">
              {project.setup.map((item) => <li key={item} className="flex gap-3"><span className="text-[#c83d35]">●</span>{item}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-3xl italic">GitHub setup</h2>
            <ul className="mt-5 space-y-3 text-sm">
              {project.githubSetup.map((item) => <li key={item} className="flex gap-3"><span className="text-[#c83d35]">●</span>{item}</li>)}
            </ul>
          </div>
        </section>
        <section className="mt-10 border-t border-[#d8d4c7] pt-8">
          <h2 className="font-serif text-3xl italic">Project architecture</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {project.architecture.map((layer) => (
              <div key={layer.label} className="border border-[#d8d4c7] p-4">
                <h3 className="font-mono text-xs uppercase text-[#214dce]">{layer.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#5b594f]">{layer.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="mt-10 grid gap-8 border-t border-[#d8d4c7] pt-8 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl italic">Timeline</h2>
            <ol className="mt-5 space-y-3 text-sm">
              {project.timeline.map((item, index) => <li key={item} className="flex gap-3"><span className="font-mono text-[#214dce]">0{index + 1}</span>{item}</li>)}
            </ol>
          </div>
          <div>
            <h2 className="font-serif text-3xl italic">Milestones</h2>
            <div className="mt-5 space-y-3">
              {project.milestones.map((milestone) => (
                <div key={milestone.title} className="bg-[#fffaf0] p-4">
                  <div className="flex justify-between gap-3 font-mono text-xs"><span>{milestone.title}</span><span className="text-[#214dce]">{milestone.deadline}</span></div>
                  <p className="mt-2 text-sm text-[#5b594f]">{milestone.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="mt-10 border-t border-[#d8d4c7] pt-8">
          <h2 className="font-serif text-3xl italic">Build guide</h2>
          <div className="mt-8 space-y-8">
            {project.guide.map((section, index) => (
              <section key={section.title} className="border-l-4 border-[#214dce] bg-[#f3eee2] p-5">
                <p className="font-mono text-[9px] text-[#214dce]">STEP {index + 1}</p>
                <h3 className="mt-2 font-serif text-2xl">{section.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5b594f]">{section.description}</p>
                <ul className="mt-4 space-y-3 text-sm">
                  {section.items.map((item) => <li key={item} className="flex gap-3"><span className="mt-1 text-[#c83d35]">●</span><span>{item}</span></li>)}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
