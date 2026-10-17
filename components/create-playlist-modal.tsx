"use client";

import { useEffect, useState } from "react";
import { ListMusic, X } from "lucide-react";
import { usePlayer, useUI } from "@/components/app-shell";

function PlaylistForm({
  songId,
  onClose,
}: {
  songId?: string;
  onClose: () => void;
}) {
  const { createPlaylist } = usePlayer();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) {
          setError("Give your playlist a name");
          return;
        }
        createPlaylist(name.trim(), description.trim(), songId);
        onClose();
      }}
      className="mt-5 space-y-4"
    >
      <div>
        <label htmlFor="pl-name" className="mb-1.5 block text-xs font-semibold text-slate-300">
          Name
        </label>
        <input
          id="pl-name"
          autoFocus
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError("");
          }}
          placeholder="My awesome mix"
          maxLength={60}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-violet-300/50 focus:bg-white/[0.09]"
        />
        {error && <p className="mt-1.5 text-xs text-pink-400">{error}</p>}
      </div>

      <div>
        <label htmlFor="pl-desc" className="mb-1.5 block text-xs font-semibold text-slate-300">
          Description <span className="font-normal text-slate-500">(optional)</span>
        </label>
        <input
          id="pl-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What's this playlist about?"
          maxLength={120}
          className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm outline-none transition placeholder:text-slate-500 focus:border-violet-300/50 focus:bg-white/[0.09]"
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" className="btn-clay flex-1 rounded-2xl px-5 py-3 text-sm font-bold">
          Create playlist
        </button>
        <button type="button" onClick={onClose} className="btn-glass rounded-2xl px-5 py-3 text-sm font-semibold">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CreatePlaylistModal() {
  const { createPlaylistFor, createPlaylistKey, closeCreatePlaylist } = useUI();
  const open = createPlaylistFor !== null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCreatePlaylist();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeCreatePlaylist]);

  if (!open) return null;

  const songId = createPlaylistFor || undefined;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        onClick={closeCreatePlaylist}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      />
      <div className="glass glass-refract relative z-10 w-full max-w-md rounded-[2rem] p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 className="flex items-center gap-2.5 text-lg font-black">
            <span className="clay-accent flex h-9 w-9 items-center justify-center rounded-xl">
              <ListMusic size={18} />
            </span>
            New playlist
          </h2>
          <button
            onClick={closeCreatePlaylist}
            aria-label="Close"
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <PlaylistForm key={createPlaylistKey} songId={songId} onClose={closeCreatePlaylist} />
      </div>
    </div>
  );
}
