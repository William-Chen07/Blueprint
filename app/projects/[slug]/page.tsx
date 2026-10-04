import { notFound } from "next/navigation";
import ProjectWorkspace from "@/components/project-workspace";
import { getProject, getProjects } from "@/lib/github";

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }));
}

export default async function ProjectGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectWorkspace project={project} />;
}
