import Link from "next/link";
import { Pin, Star } from "lucide-react";
import type { GitHubSource } from "@/lib/github";

export interface ProjectCardProps {
  category: string;
  title: string;
  description: string;
  level: string;
  time: string;
  color: string;
  tilt: string;
  href?: string;
  source?: GitHubSource;
}

export default function ProjectCard({
  category,
  title,
  description,
  level,
  time,
  color,
  tilt,
  href = "/projects",
  source,
}: ProjectCardProps) {
  return (
    <Link
      href={href}
      aria-label={`Open guide for ${title.replace(/\n/g, " ")}`}
      className={`relative block ${color} p-6 shadow-[5px_8px_0_rgba(77,53,31,.16)] transition-transform hover:-translate-y-1 ${tilt}`}
    >
      <Pin className="absolute -top-3 left-1/2 size-5 -translate-x-1/2 fill-[#c83d35] text-[#a52e2b]" />
      <p className="font-mono text-[8px] tracking-[.12em] text-[#6d6a60]">
        {category}
      </p>
      <h2 className="mt-5 whitespace-pre-line font-serif text-3xl leading-[.95]">
        {title}
      </h2>
      <p className="mt-5 text-xs leading-relaxed text-[#5b594f]">
        {description}
      </p>
      {source && (
        <p className="mt-5 flex items-center gap-1.5 font-mono text-[9px] text-[#6d6a60]">
          <span className="truncate">github.com/{source.repo}</span>
          <span aria-hidden="true">·</span>
          <Star className="size-3 shrink-0" aria-label="stars" />
          {source.stars.toLocaleString()}
        </p>
      )}
      <p className={`${source ? "mt-2" : "mt-5"} font-mono text-[9px] text-[#214dce]`}>
        {level} · {time} · Open brief →
      </p>
    </Link>
  );
}
