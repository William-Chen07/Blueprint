"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LightingControls } from "@/components/flashlight-board";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 bg-[#17120f] px-4 pt-3 text-[#211b15] sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center gap-4 font-mono text-[10px] uppercase tracking-[.05em]">
        <Link href="/" aria-label="Buildfolio home" className="flex items-center">
          <Image
            src="/favicon.ico"
            alt="Buildfolio"
            width={40}
            height={40}
            className="size-10"
          />
          <span className="ml-2 hidden font-serif text-lg font-bold lowercase tracking-tight text-[#eadcb9] sm:inline">
            blueprint.
          </span>
        </Link>

        <div className="ml-2 hidden items-end gap-0 md:flex">
          {links.slice(1).map((l, index) => (
            <div key={l.href} className="navbar-tab-group flex flex-col items-start gap-0.5">
              <span className="navbar-case-label h-3 bg-[#bbaa83] px-1 font-mono text-[5px] leading-3 text-[#2b2014]">
                CASE / {String(index + 2).padStart(2, "0")}
              </span>
              <Link
                href={l.href}
                className="border-l border-[#17120f] bg-[#eadcb9] px-3.5 py-1.5 text-[9px] transition-colors hover:bg-[#f6e8c5]"
              >
                {l.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="navbar-actions ml-auto mr-8 flex items-center gap-4">
          <LightingControls />
          <Link href="/profile" aria-label="Open your profile" className="shrink-0">
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
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-2 py-4 text-[#211b15] md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-l border-[#17120f] bg-[#eadcb9] px-4 py-2"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}