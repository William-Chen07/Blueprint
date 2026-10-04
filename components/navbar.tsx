"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LightingControls } from "@/components/flashlight-board";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/mentor", label: "Dashboard", also: "/dashboard" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/community", label: "Community" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string, also?: string) =>
    [href, also].some((base) => base && (pathname === base || pathname.startsWith(`${base}/`)));

  return (
    <header className="relative z-50 bg-[#17120f] px-4 pt-3 text-[#211b15] sm:px-8 lg:px-12">
      <nav className="mx-auto flex max-w-[1376px] items-center gap-4 font-mono text-[10px] uppercase tracking-[.05em]">
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
          {links.slice(1).map((l, index) => {
            const active = isActive(l.href, l.also);
            return (
            <div key={l.href} className="navbar-tab-group flex flex-col items-start gap-0.5">
              <span
                className={`navbar-case-label h-3 px-1 font-mono text-[5px] leading-3 ${
                  active ? "bg-[#76301e] text-[#f5e9cc]" : "bg-[#8a7d5f] text-[#2b2014]"
                }`}
              >
                CASE / {String(index + 2).padStart(2, "0")}
              </span>
              <Link
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`border-l border-[#17120f] px-3.5 py-1.5 text-[9px] transition-colors ${
                  active ? "bg-[#b9ab88]" : "bg-[#9c8f73] hover:bg-[#aa9d80]"
                }`}
              >
                {l.label}
              </Link>
            </div>
            );
          })}
        </div>

        <div className="navbar-actions ml-auto flex items-center gap-4">
          <LightingControls />
          <Link
            href="/profile"
            className="hidden shrink-0 items-center gap-1 bg-[#76301e] px-6 py-2.5 font-sans text-xs font-semibold normal-case tracking-normal text-[#f5e9cc] hover:bg-[#8a3a26] sm:inline-flex"
          >
            Your profile <ArrowUpRight className="size-3" />
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
              aria-current={isActive(l.href, l.also) ? "page" : undefined}
              className={`border-l border-[#17120f] px-4 py-2 ${
                isActive(l.href, l.also) ? "bg-[#b9ab88] text-[#76301e]" : "bg-[#9c8f73]"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}