"use client";

import Link from "next/link";
import { Heart, Pause, Play } from "lucide-react";
import { usePlayer } from "@/components/app-shell";
import AddToPlaylist from "@/components/add-to-playlist";
import { formatPlays, genreSlug, imageUrl, type Song } from "@/lib/data";

export default function SongCard({ song, queue }: { song: Song; queue?: Song[] }) {
  const { currentId, playing, playSong, toggleLike, isLiked } = usePlayer();
  const active = currentId === song.id;
  const liked = isLiked(song.id);

  return (
    <article className="clay group hover-lift hover-glow min-w-0 rounded-[1.7rem] p-3 transition duration-300 hover:border-violet-300/30">
      <div
        className={`relative aspect-square overflow-hidden rounded-[1.35rem] transition ${active ? "ring-2 ring-violet-400/70" : ""}`}
        style={{ background: song.color }}
      >
        <img
          src={imageUrl(song.image)}
          alt={song.title + " cover"}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        {active && playing && (
          <span className="absolute left-3 top-3 flex items-end gap-[3px] rounded-full bg-black/45 px-2.5 py-1.5 backdrop-blur">
            <i className="h-3 w-[3px] animate-pulse rounded-full bg-violet-300" />
            <i className="h-2 w-[3px] animate-pulse rounded-full bg-cyan-300 [animation-delay:150ms]" />
            <i className="h-4 w-[3px] animate-pulse rounded-full bg-violet-300 [animation-delay:300ms]" />
          </span>
        )}
        <button
          onClick={() => playSong(song.id, queue)}
          aria-label={"Play " + song.title}
          className="btn-clay absolute bottom-3 right-3 flex h-12 w-12 items-center justify-center rounded-full transition hover:scale-110"
        >
          {playing && currentId === song.id ? (
            <Pause size={19} fill="white" />
          ) : (
            <Play size={19} fill="white" className="ml-0.5" />
          )}
        </button>
      </div>
      <div className="flex items-start justify-between gap-1 px-1 pt-3.5">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold">{song.title}</h3>
          <Link
            href={`/artists/${song.artist.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            className="mt-1 block truncate text-xs text-slate-400 transition hover:text-violet-300"
          >
            {song.artist}
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <AddToPlaylist songId={song.id} />
          <button
            onClick={() => toggleLike(song.id)}
            aria-label={liked ? "Unlike song" : "Like song"}
            className={`shrink-0 rounded-full p-1.5 transition hover:bg-white/[0.1] ${liked ? "text-pink-400" : "text-slate-500 hover:text-pink-400"}`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 px-1 pb-1">
        <Link
          href={`/genres/${genreSlug(song.genre)}`}
          className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
        >
          {song.genre}
        </Link>
        <span className="text-[10px] text-slate-500">
          {formatPlays(song.plays)} plays · {song.duration}
        </span>
      </div>
    </article>
  );
}
