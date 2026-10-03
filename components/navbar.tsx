import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <nav className="grid grid-cols-3 items-center px-6 py-4 border-b">
      <Link href="/" className="text-xl font-bold">
        Blueprint
      </Link>

      <div className="flex justify-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/my-workspace">My Workspace</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/community">Community</Link>
      </div>

      <Link href="/profile" className="justify-self-end">
        <Avatar className="size-10">
          <AvatarImage src="/avatar.png" alt="Your profile" />
        </Avatar>
      </Link>
    </nav>
  );
}