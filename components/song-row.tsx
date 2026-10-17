"use client";

import Link from "next/link";
import { AudioLines, Heart, Play, Pause } from "lucide-react";
import { usePlayer } from "@/components/app-shell";
import AddToPlaylist from "@/components/add-to-playlist";
import { formatPlays, genreSlug, imageUrl, type Song } from "@/lib/data";

export default function SongRow({
  song,
  queue,
  rank,
}: {
  song: Song;
  queue: Song[];
  rank?: number;
}) {
  const { currentId, playing, playSong, toggleLike, isLiked } = usePlayer();
  const active = currentId === song.id;

  return (
    <div
      className={`group flex items-center gap-3 rounded-2xl p-2.5 transition sm:gap-4 ${
        active ? "clay-accent" : "hover:translate-x-1 hover:bg-white/[0.06]"
      }`}
    >
      {typeof rank === "number" && (
        <span className={`w-6 shrink-0 text-center text-sm font-black ${active ? "text-white" : "text-slate-500"}`}>
          {rank}
        </span>
      )}
      <button
        onClick={() => playSong(song.id, queue)}
        aria-label={`Play ${song.title}`}
        className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl"
        style={{ background: song.color }}
      >
        <img src={imageUrl(song.image, 120)} alt="" loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
          {active && playing ? <Pause size={16} fill="white" className="text-white" /> : <Play size={16} fill="white" className="text-white" />}
        </span>
      </button>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm font-semibold">
          <span className="truncate">{song.title}</span>
          {active && playing && <AudioLines size={13} className="shrink-0" />}
        </p>
        <Link
          href={`/artists/${song.artist.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
          className={`mt-0.5 block truncate text-xs transition hover:text-violet-300 ${
            active ? "text-white/70" : "text-slate-400"
          }`}
        >
          {song.artist}
        </Link>
      </div>
      <Link
        href={`/genres/${genreSlug(song.genre)}`}
        className={`hidden rounded-full px-2.5 py-1 text-[10px] font-semibold transition sm:block ${
          active ? "bg-white/15 text-white" : "bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20"
        }`}
      >
        {song.genre}
      </Link>
      <span className={`hidden w-16 text-right text-xs sm:block ${active ? "text-white/70" : "text-slate-500"}`}>
        {formatPlays(song.plays)}
      </span>
      <AddToPlaylist songId={song.id} />
      <button
        onClick={() => toggleLike(song.id)}
        aria-label="Like song"
        className={`shrink-0 rounded-full p-1.5 transition hover:bg-white/10 hover:text-pink-400 ${active ? "text-white/80" : "text-slate-500"}`}
      >
        <Heart size={16} fill={isLiked(song.id) ? "#f472b6" : "none"} className={isLiked(song.id) ? "text-pink-400" : ""} />
      </button>
      <span className={`w-10 shrink-0 text-right text-xs ${active ? "text-white/70" : "text-slate-500"}`}>
        {song.duration}
      </span>
    </div>
  );
}
