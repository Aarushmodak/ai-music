"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Menu, Shield } from "lucide-react";
import { useUI } from "@/components/app-shell";
import ThemeToggle from "@/components/theme-toggle";

export default function Header() {
  const router = useRouter();
  const { toggleMobileMenu } = useUI();
  const [query, setQuery] = useState("");

  return (
    <header className="glass glass-refract sticky top-3 z-30 mx-3 flex h-16 items-center gap-3 rounded-[1.4rem] px-3 sm:mx-5 sm:px-4">
      <button
        onClick={toggleMobileMenu}
        aria-label="Open menu"
        className="btn-glass rounded-xl p-2.5 lg:hidden"
      >
        <Menu size={19} />
      </button>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }}
        className="clay-inset flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl px-3.5 py-2.5 sm:max-w-[540px]"
      >
        <Search size={18} className="shrink-0 text-violet-300" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, genres..."
          aria-label="Search"
          className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-500"
        />
      </form>
      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <Link
          href="/admin"
          className="btn-glass hidden items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white sm:flex"
        >
          <Shield size={16} /> Admin
        </Link>
        <button className="btn-glass hidden rounded-xl px-4 py-2.5 text-xs font-semibold sm:block">
          Log in
        </button>
        <button className="btn-clay rounded-2xl px-4 py-2.5 text-xs font-bold">Sign up</button>
      </div>
    </header>
  );
}
