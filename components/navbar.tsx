"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/my-workspace", label: "My Workspace" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 bg-[#17120f] px-4 pt-3 text-[#211b15] sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[.05em]">
        <Link href="/" className="bg-[#eadcb9] px-3 py-2 font-serif text-lg font-bold normal-case tracking-normal">
          buildfolio.
        </Link>

        <div className="hidden items-center gap-px md:flex">
          {links.slice(1).map((l, index) => (
            <Link
              key={l.href}
              href={l.href}
              className={`bg-[#eadcb9] px-5 py-2 transition-colors hover:bg-[#f6e8c5] ${index === 0 ? "border-l border-[#17120f]" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/profile" className="bg-[#76301e] px-5 py-2 text-[#eadcb9]">
            Your profile ↗
          </Link>
          <Link href="/profile" className="hidden md:block">
            <Avatar className="size-8 border-[#eadcb9]">
              <AvatarImage src="/avatar.png" alt="Your profile" />
              <AvatarFallback>W</AvatarFallback>
            </Avatar>
          </Link>
          <button
            className="text-[#eadcb9] md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-2 py-4 text-[#eadcb9] md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}