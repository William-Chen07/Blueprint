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
    <header className="border-b">
      <nav className="flex items-center justify-between px-6 py-4 md:grid md:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="text-xl font-bold">
          Blueprint
        </Link>

        {/* desktop links: hidden on small screens */}
        <div className="hidden md:flex justify-center gap-6 whitespace-nowrap">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>{l.label}</Link>
          ))}
        </div>

        <div className="flex items-center gap-3 md:justify-self-end">
          <Link href="/profile">
            <Avatar className="size-10">
              <AvatarImage src="/avatar.png" alt="Your profile" />
              <AvatarFallback>W</AvatarFallback>
            </Avatar>
          </Link>
          {/* hamburger: only on small screens */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* mobile dropdown */}
      {open && (
        <div className="flex flex-col gap-4 px-6 pb-4 md:hidden">
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