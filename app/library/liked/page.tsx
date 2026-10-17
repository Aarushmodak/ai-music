"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import PageHeader from "@/components/page-header";
import SongCard from "@/components/song-card";
import { usePlayer } from "@/components/app-shell";

export default function LikedPage() {
  const { liked, allSongs } = usePlayer();
  const songs = liked
    .map((id) => allSongs.find((s) => s.id === id))
    .filter((s): s is (typeof allSongs)[number] => Boolean(s));

  return (
    <>
      <PageHeader
        eyebrow="YOUR LIBRARY"
        title="Liked Songs"
        subtitle={songs.length ? `${songs.length} track${songs.length === 1 ? "" : "s"} you've saved.` : "Every song you love, in one place."}
        icon={Heart}
      />

      {songs.length === 0 ? (
        <section className="glass glass-refract flex flex-col items-center justify-center rounded-[2rem] px-6 py-16 text-center">
          <span className="clay-accent mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
            <Heart size={28} />
          </span>
          <h2 className="text-xl font-black">No liked songs yet</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Tap the heart on any track and it will show up here instantly.
          </p>
          <Link href="/explore" className="btn-clay mt-6 rounded-2xl px-6 py-3 text-sm font-bold">
            Explore music
          </Link>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
        </section>
      )}
    </>
  );
}
