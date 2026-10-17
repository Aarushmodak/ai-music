"use client";

import Link from "next/link";
import { Clock, History } from "lucide-react";
import PageHeader from "@/components/page-header";
import SongRow from "@/components/song-row";
import { usePlayer } from "@/components/app-shell";

export default function RecentPage() {
  const { recent, allSongs } = usePlayer();
  const songs = recent
    .map((id) => allSongs.find((s) => s.id === id))
    .filter((s): s is (typeof allSongs)[number] => Boolean(s));

  return (
    <>
      <PageHeader
        eyebrow="YOUR LIBRARY"
        title="Recently Played"
        subtitle="Pick up right where you left off."
        icon={Clock}
      />

      {songs.length === 0 ? (
        <section className="glass glass-refract flex flex-col items-center justify-center rounded-[2rem] px-6 py-16 text-center">
          <span className="clay-accent mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
            <History size={28} />
          </span>
          <h2 className="text-xl font-black">Nothing played yet</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Your listening history will appear here once you start playing.
          </p>
          <Link href="/" className="btn-clay mt-6 rounded-2xl px-6 py-3 text-sm font-bold">
            Back home
          </Link>
        </section>
      ) : (
        <section className="clay rounded-[1.75rem] p-2 sm:p-3">
          <div className="space-y-1">
            {songs.map((song, i) => (
              <SongRow key={song.id} song={song} rank={i + 1} queue={songs} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
