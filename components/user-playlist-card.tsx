"use client";

import Link from "next/link";
import { ListMusic, Trash2 } from "lucide-react";
import { usePlayer, type UserPlaylist } from "@/components/app-shell";
import { imageUrl } from "@/lib/data";

export default function UserPlaylistCard({ playlist }: { playlist: UserPlaylist }) {
  const { allSongs, deletePlaylist } = usePlayer();
  const first = playlist.songIds.length
    ? allSongs.find((s) => s.id === playlist.songIds[0])
    : undefined;

  return (
    <div className="clay group hover-lift hover-glow relative rounded-[1.7rem] p-3 transition duration-300 hover:border-violet-300/30">
      <Link href={`/playlists/mine/${playlist.id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-[1.35rem]" style={{ background: playlist.color }}>
          {first ? (
            <img
              src={imageUrl(first.image)}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <ListMusic size={44} className="text-white/70" />
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
            <ListMusic size={12} /> {playlist.songIds.length} tracks
          </span>
        </div>
        <h3 className="mt-3.5 truncate px-1 text-sm font-bold">{playlist.name}</h3>
        <p className="mt-1 line-clamp-2 px-1 text-xs text-slate-400">
          {playlist.description || "Your personal mix"}
        </p>
      </Link>
      <button
        onClick={() => deletePlaylist(playlist.id)}
        aria-label={`Delete ${playlist.name}`}
        className="absolute right-5 top-5 rounded-full bg-black/40 p-2 text-white/80 opacity-0 backdrop-blur transition hover:bg-pink-500/80 hover:text-white group-hover:opacity-100"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
