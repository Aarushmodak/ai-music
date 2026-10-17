"use client";

import { Play, Shuffle } from "lucide-react";
import { usePlayer } from "@/components/app-shell";
import type { Song } from "@/lib/data";

export default function PlayAllButton({
  songs,
  label = "Play all",
}: {
  songs: Song[];
  label?: string;
}) {
  const { playQueue, shuffle: shuffleOn, toggleShuffle } = usePlayer();
  if (!songs.length) return null;

  return (
    <div className="flex items-center gap-2.5">
      <button
        onClick={() => playQueue(songs)}
        className="btn-clay inline-flex items-center rounded-2xl px-6 py-3 text-sm font-bold"
      >
        <Play size={16} fill="white" className="mr-2" /> {label}
      </button>
      <button
        onClick={() => {
          if (!shuffleOn) toggleShuffle();
          const start = Math.floor(Math.random() * songs.length);
          playQueue(songs, start);
        }}
        aria-label="Shuffle play"
        className="btn-glass inline-flex items-center rounded-2xl px-5 py-3 text-sm font-semibold"
      >
        <Shuffle size={16} className="mr-2" /> Shuffle
      </button>
    </div>
  );
}
