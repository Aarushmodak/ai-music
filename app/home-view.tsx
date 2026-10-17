"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Flame, Disc3, Headphones } from "lucide-react";
import {
  imageUrl,
  formatCount,
  type Artist,
  type Genre,
  type Playlist,
  type Song,
} from "@/lib/data";
import SongCard from "@/components/song-card";
import SectionHeader from "@/components/section-header";

const img = imageUrl;

const heroSlides = [
  {
    tag: "THE NEXT GENERATION OF SOUND",
    line1: "The next wave",
    line2Pre: "of music is ",
    accent: "AI.",
    desc: "Discover original songs, virtual artists and unforgettable soundscapes — all created with AI.",
    image: "photo-1519608487953-e999c86e7455",
    glow: "bg-blue-500/40",
  },
  {
    tag: "MADE BY MACHINES, FELT BY YOU",
    line1: "Soundscapes",
    line2Pre: "beyond ",
    accent: "imagination.",
    desc: "Step into a new dimension of sound where every track is generated, mixed and mastered by AI.",
    image: "photo-1519681393784-d120267933ba",
    glow: "bg-violet-500/40",
  },
  {
    tag: "INFINITE PLAYLISTS",
    line1: "Every mood.",
    line2Pre: "Every ",
    accent: "moment.",
    desc: "From focus to workout to midnight drives — endless AI playlists tailored to how you feel.",
    image: "photo-1470252649378-9c29740c9fa8",
    glow: "bg-cyan-500/40",
  },
];

export default function HomeView({
  songs,
  genres,
  artists,
  playlists,
}: {
  songs: Song[];
  genres: Genre[];
  artists: Artist[];
  playlists: Playlist[];
}) {
  const [genre, setGenre] = useState("All");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSlide((p) => (p + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, [slide]);

  const filtered = songs.filter((s) => genre === "All" || s.genre === genre);
  const chipGenres = ["All", ...Array.from(new Set(songs.map((s) => s.genre)))].slice(0, 7);
  const topGenres = [...genres].sort((a, b) => b.count - a.count);

  return (
    <>
      {/* HERO CAROUSEL */}
      <section className="glass relative overflow-hidden rounded-[2rem]">
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {heroSlides.map((s, i) => (
            <div key={s.tag} className="relative flex min-h-[440px] w-full shrink-0 items-center overflow-hidden lg:min-h-[480px]">
              <img src={img(s.image)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#060912] via-[#0d1026]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060912]/85 via-transparent to-transparent" />
              <div className={`pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full blur-[120px] ${s.glow}`} />
              <div className="relative z-10 max-w-[580px] px-6 py-12 sm:px-10 lg:px-12">
                <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[10px] font-bold tracking-[0.18em] text-violet-100 transition hover:scale-105">
                  <Sparkles size={13} /> {s.tag}
                </span>
                <h2 className="mt-6 text-4xl font-black leading-[1.04] tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {s.line1}
                  <br />
                  {s.line2Pre}
                  <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">{s.accent}</span>
                </h2>
                <p className="mt-5 max-w-md text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">{s.desc}</p>
                <Link href="/explore" className="btn-clay mt-7 inline-flex items-center rounded-2xl px-7 py-3.5 text-sm font-bold">
                  Explore music <ChevronRight className="ml-2 inline" size={17} />
                </Link>
              </div>
              <div
                className={`pointer-events-none absolute -right-10 bottom-0 h-52 w-52 rounded-full blur-3xl transition-all duration-1000 ${s.glow} ${slide === i ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => setSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
          aria-label="Previous slide"
          className="btn-glass absolute left-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white"
        >
          <ChevronRight size={18} className="rotate-180" />
        </button>
        <button
          onClick={() => setSlide((p) => (p + 1) % heroSlides.length)}
          aria-label="Next slide"
          className="btn-glass absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-3 text-white"
        >
          <ChevronRight size={18} />
        </button>
      </section>

      {/* TRENDING */}
      <section>
        <SectionHeader
          icon={Flame}
          title="Trending now"
          subtitle="The most-played AI originals this week"
        />
        <div className="mb-6 flex flex-wrap gap-2.5">
          {chipGenres.map((g) => (
            <FilterChip key={g} active={genre === g} label={g} onClick={() => setGenre(g)} />
          ))}
        </div>
        {filtered.length === 0 ? (
          <EmptyNote />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.slice(0, 8).map((song) => (
              <SongCard key={song.id} song={song} queue={filtered} />
            ))}
          </div>
        )}
      </section>

      {/* NEW RELEASES */}
      <section>
        <SectionHeader
          icon={Sparkles}
          title="New releases"
          subtitle="Fresh AI originals, straight from the studio"
          action={
            <Link href="/releases" className="hover-underline text-xs font-semibold text-blue-400 transition hover:text-violet-300">
              View all <ChevronRight className="ml-1 inline" size={14} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...songs].sort((a, b) => b.year - a.year || b.plays - a.plays).slice(0, 4).map((song) => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
        </div>
      </section>

      {/* GENRES */}
      <section>
        <SectionHeader
          icon={Disc3}
          title="Popular genres"
          subtitle="Find the sound that matches your mood"
          action={
            <Link href="/genres" className="hover-underline text-xs font-semibold text-blue-400 transition hover:text-violet-300">
              All genres <ChevronRight className="ml-1 inline" size={14} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {topGenres.slice(0, 6).map((g) => (
            <Link
              key={g.slug}
              href={`/genres/${g.slug}`}
              className="clay group hover-lift hover-glow relative h-32 overflow-hidden rounded-[1.7rem] text-left transition duration-300"
            >
              <img src={img(g.image)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-110 group-hover:opacity-75" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, ${g.color}c0, transparent)` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-3.5 left-4">
                <h3 className="text-base font-bold text-white">{g.name}</h3>
                <p className="mt-1 text-[10px] text-white/70">{formatCount(g.count)} tracks</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ARTISTS */}
      <section>
        <SectionHeader
          icon={Headphones}
          title="Featured AI artists"
          subtitle="Meet the virtual voices shaping the future"
          action={
            <Link href="/artists" className="btn-glass rounded-full px-4 py-2 text-xs font-semibold text-blue-300">
              Discover <ChevronRight className="ml-1 inline" size={14} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {artists.slice(0, 6).map((artist) => (
            <Link key={artist.slug} href={`/artists/${artist.slug}`} className="group flex flex-col items-center rounded-[1.6rem] px-2 py-4 transition hover:-translate-y-1 hover:bg-white/[0.06]">
              <div className="clay mb-3 rounded-full p-1.5 transition group-hover:scale-105">
                <img src={img(artist.image)} alt={artist.name} loading="lazy" className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24" style={{ boxShadow: `0 0 0 3px ${artist.color}55` }} />
              </div>
              <h3 className="text-center text-xs font-bold sm:text-sm">{artist.name}</h3>
              <p className="mt-1 text-[10px] text-slate-500">{Math.round(artist.followers / 1000)}K followers</p>
            </Link>
          ))}
        </div>
      </section>

      {/* PLAYLISTS PROMO */}
      <section className="relative">
        <SectionHeader icon={Flame} title="Curated playlists" subtitle="Handcrafted AI collections for every mood" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {playlists.slice(0, 3).map((p) => (
            <Link key={p.slug} href={`/playlists/${p.slug}`} className="clay group hover-lift hover-glow relative h-44 overflow-hidden rounded-[1.7rem]">
              <img src={img(p.image)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-base font-bold text-white">{p.name}</h3>
                <p className="mt-1 line-clamp-2 text-xs text-white/70">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-xs font-bold transition ${
        active ? "clay-accent text-white" : "btn-glass text-slate-300"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyNote() {
  return (
    <div className="glass rounded-[2rem] px-6 py-12 text-center text-sm text-slate-400">
      No songs here yet. Add some from the{" "}
      <Link href="/admin" className="font-semibold text-violet-300 hover-underline">
        admin dashboard
      </Link>
      .
    </div>
  );
}
