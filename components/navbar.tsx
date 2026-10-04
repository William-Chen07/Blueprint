"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/my-workspace", label: "Dashboard" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-50 bg-[#17120f] px-4 pt-3 text-[#211b15] sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[.05em]">
        <Link href="/" aria-label="Buildfolio home" className="flex items-center">
          <Image
            src="/favicon.ico"
            alt="Buildfolio"
            width={40}
            height={40}
            className="size-10"
          />
        </Link>

        <div className="hidden items-center gap-px md:flex">
          {links.slice(1).map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="border-l border-[#17120f] bg-[#eadcb9] px-5 py-2 transition-colors hover:bg-[#f6e8c5]"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/profile" aria-label="Open your profile">
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