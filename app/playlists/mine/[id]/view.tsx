"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ListMusic, Trash2 } from "lucide-react";
import PlayAllButton from "@/components/play-all";
import SongRow from "@/components/song-row";
import { usePlayer } from "@/components/app-shell";
import { formatPlays, imageUrl } from "@/lib/data";

export default function UserPlaylistView({ id }: { id: string }) {
  const router = useRouter();
  const { allSongs, userPlaylistById, deletePlaylist, hydrated } = usePlayer();

  const playlist = userPlaylistById(id);
  const songs = playlist
    ? playlist.songIds
        .map((songId) => allSongs.find((s) => s.id === songId))
        .filter((s): s is (typeof allSongs)[number] => Boolean(s))
    : [];
  const totalPlays = songs.reduce((a, s) => a + s.plays, 0);

  if (!hydrated) {
    return (
      <div className="glass flex items-center justify-center rounded-[2rem] px-6 py-20 text-sm text-slate-400">
        Loading…
      </div>
    );
  }

  if (!playlist) {
    return (
      <section className="glass glass-refract flex flex-col items-center justify-center rounded-[2rem] px-6 py-16 text-center">
        <h1 className="text-xl font-black">Playlist not found</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          This playlist may have been deleted, or it lives on another device.
        </p>
        <Link href="/library/playlists" className="btn-clay mt-6 rounded-2xl px-6 py-3 text-sm font-bold">
          Back to playlists
        </Link>
      </section>
    );
  }

  return (
    <>
      <section className="glass glass-refract relative overflow-hidden rounded-[2rem] p-6 sm:p-9">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl"
          style={{ background: `${playlist.color}40` }}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="clay overflow-hidden rounded-[1.6rem] p-1.5">
              {songs[0] ? (
                <img
                  src={imageUrl(songs[0].image, 400)}
                  alt={playlist.name}
                  className="h-32 w-32 rounded-[1.25rem] object-cover sm:h-36 sm:w-36"
                />
              ) : (
                <span
                  className="flex h-32 w-32 items-center justify-center rounded-[1.25rem] sm:h-36 sm:w-36"
                  style={{ background: playlist.color }}
                >
                  <ListMusic size={40} className="text-white/80" />
                </span>
              )}
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-violet-300">
                <ListMusic size={13} /> YOUR PLAYLIST
              </span>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{playlist.name}</h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                {playlist.description || "Your personal mix"}
              </p>
              <p className="mt-2 text-xs text-slate-400">
                {songs.length} tracks · {formatPlays(totalPlays)} plays
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <PlayAllButton songs={songs} />
            <button
              onClick={() => {
                deletePlaylist(playlist.id);
                router.push("/library/playlists");
              }}
              aria-label="Delete playlist"
              className="btn-glass inline-flex items-center rounded-2xl px-4 py-3 text-sm font-semibold text-pink-300"
            >
              <Trash2 size={16} className="mr-2" /> Delete
            </button>
          </div>
        </div>
      </section>

      {songs.length === 0 ? (
        <section className="glass flex flex-col items-center justify-center rounded-[2rem] px-6 py-14 text-center">
          <p className="text-sm text-slate-400">
            This playlist is empty. Add songs with the <ListMusic size={13} className="inline" /> icon on any track.
          </p>
          <Link href="/explore" className="btn-clay mt-5 rounded-2xl px-6 py-3 text-sm font-bold">
            Find music
          </Link>
        </section>
      ) : (
        <section>
          <div className="clay rounded-[1.75rem] p-2 sm:p-3">
            <div className="space-y-1">
              {songs.map((song, i) => (
                <SongRow key={song.id} song={song} rank={i + 1} queue={songs} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
