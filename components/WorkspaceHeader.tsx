import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function WorkspaceHeader() {
  return (
    <header className="notebook-header">
      <Link href="/" className="notebook-brand" aria-label="Blueprint home">
        <span className="notebook-brand-mark">B</span>
        <span>blueprint.</span>
      </Link>
      <nav aria-label="Main navigation" className="notebook-nav case-tabs">
        <Link href="/projects" className="case-tab">
          <span className="case-tab-label">CASE / 02</span>
          <span className="case-tab-body">Projects</span>
        </Link>
        <Link href="/my-workspace" aria-current="page" className="case-tab active">
          <span className="case-tab-label">CASE / 03</span>
          <span className="case-tab-body">Dashboard</span>
        </Link>
        <Link href="/portfolio" className="case-tab">
          <span className="case-tab-label">CASE / 04</span>
          <span className="case-tab-body">Portfolio</span>
        </Link>
        <Link href="/community" className="case-tab">
          <span className="case-tab-label">CASE / 05</span>
          <span className="case-tab-body">Community</span>
        </Link>
      </nav>
      <Link href="/profile" className="notebook-profile">
        Your profile <ArrowRight className="size-3" />
      </Link>
    </header>
  );
}
