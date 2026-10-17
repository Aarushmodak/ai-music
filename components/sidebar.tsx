"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AudioLines,
  Home,
  Compass,
  Disc3,
  Flame,
  Heart,
  Clock3,
  ListMusic,
  Settings,
  CircleHelp,
  Sparkles,
  ChevronRight,
  Radio,
  Headphones,
  Library,
  Shield,
  X,
} from "lucide-react";
import { useUI } from "@/components/app-shell";

const discover = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/genres", label: "Genres", icon: Disc3 },
  { href: "/releases", label: "New Releases", icon: Radio },
  { href: "/charts", label: "Top Charts", icon: Flame },
  { href: "/artists", label: "AI Artists", icon: Headphones },
  { href: "/playlists", label: "Playlists", icon: ListMusic },
];

const library = [
  { href: "/library/liked", label: "Liked Songs", icon: Heart },
  { href: "/library/recent", label: "Recently Played", icon: Clock3 },
  { href: "/library/playlists", label: "Your Playlists", icon: Library },
];

const studio = [{ href: "/admin", label: "Admin", icon: Shield }];

export default function Sidebar() {
  const pathname = usePathname();
  const { mobileMenu, setMobileMenu } = useUI();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const linkClass = (href: string) =>
    `flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[13px] font-medium transition ${
      isActive(href)
        ? "clay-accent text-white"
        : "text-slate-400 hover:translate-x-1 hover:bg-white/[0.06] hover:text-white"
    }`;

  return (
    <>
      {mobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}
      <aside
        className={`glass glass-refract fixed bottom-3 left-3 top-3 z-50 w-[240px] overflow-y-auto overscroll-contain rounded-[1.9rem] p-4 transition-transform duration-300 lg:translate-x-0 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex min-h-full flex-col">
          <div className="mb-7 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenu(false)}>
              <div className="clay-accent flex h-12 w-12 items-center justify-center rounded-2xl">
                <AudioLines size={26} strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight">SONORA</h1>
                <p className="text-[9px] font-semibold tracking-[0.14em] text-slate-400">
                  AI MUSIC STUDIO
                </p>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenu(false)}
              aria-label="Close menu"
              className="btn-glass rounded-xl p-2 lg:hidden"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.22em] text-slate-500">DISCOVER</p>
          <nav className="space-y-1.5">
            {discover.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className={linkClass(item.href)}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold tracking-[0.22em] text-slate-500">
            YOUR LIBRARY
          </p>
          <div className="space-y-1.5">
            {library.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className={linkClass(item.href)}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <p className="mb-3 mt-8 px-3 text-[10px] font-bold tracking-[0.22em] text-slate-500">
            STUDIO
          </p>
          <div className="space-y-1.5">
            {studio.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenu(false)}
                  className={linkClass(item.href)}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto shrink-0 pt-8">
            <div className="clay relative overflow-hidden rounded-[1.6rem] p-4">
              <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-violet-500/30 blur-3xl" />
              <div className="clay-accent relative mb-4 flex h-11 w-11 items-center justify-center rounded-2xl">
                <Sparkles size={22} />
              </div>
              <h3 className="relative text-base font-bold">Discover. Listen.</h3>
              <h3 className="relative text-base font-bold">Feel the future.</h3>
              <p className="relative mt-3 text-xs leading-5 text-slate-400">
                Explore a new universe of songs and virtual artists created with AI.
              </p>
              <Link
                href="/explore"
                onClick={() => setMobileMenu(false)}
                className="btn-clay relative mt-4 flex w-full items-center justify-center rounded-2xl py-3 text-xs font-bold"
              >
                Explore Music <ChevronRight className="ml-1 inline" size={15} />
              </Link>
            </div>
          </div>

          <div className="mt-5 flex shrink-0 gap-4 px-1 text-xs text-slate-500">
            <Link
              href="/settings"
              onClick={() => setMobileMenu(false)}
              className={`rounded-lg px-2 py-1 transition hover:-translate-y-0.5 hover:bg-white/[0.06] hover:text-white ${
                isActive("/settings") ? "text-white" : ""
              }`}
            >
              <Settings size={15} className="mr-2 inline" />
              Settings
            </Link>
            <Link
              href="/help"
              onClick={() => setMobileMenu(false)}
              className={`rounded-lg px-2 py-1 transition hover:-translate-y-0.5 hover:bg-white/[0.06] hover:text-white ${
                isActive("/help") ? "text-white" : ""
              }`}
            >
              <CircleHelp size={15} className="mr-2 inline" />
              Help
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
