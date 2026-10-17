"use client";

import { ListMusic, Plus } from "lucide-react";
import UserPlaylistCard from "@/components/user-playlist-card";
import { usePlayer, useUI } from "@/components/app-shell";

export default function YourPlaylists() {
  const { userPlaylists, hydrated } = usePlayer();
  const { openCreatePlaylist } = useUI();

  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2.5 text-lg font-black">
        <span className="clay-accent flex h-9 w-9 items-center justify-center rounded-xl">
          <ListMusic size={18} />
        </span>
        Your playlists
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <button
          onClick={() => openCreatePlaylist()}
          className="glass glass-refract hover-lift flex min-h-[16rem] flex-col items-center justify-center gap-3 rounded-[1.7rem] p-6 text-center transition hover:border-violet-300/30"
        >
          <span className="clay-accent flex h-14 w-14 items-center justify-center rounded-2xl">
            <Plus size={26} />
          </span>
          <span className="text-sm font-bold">Create playlist</span>
          <span className="text-xs text-slate-400">Build your own mix from the catalog</span>
        </button>
        {userPlaylists.map((playlist) => (
          <UserPlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
      {hydrated && userPlaylists.length === 0 && (
        <p className="mt-4 text-xs text-slate-500">
          You haven&apos;t created any playlists yet. Click the{" "}
          <ListMusic size={12} className="inline" /> icon on any song to add it to a new playlist.
        </p>
      )}
    </section>
  );
}
