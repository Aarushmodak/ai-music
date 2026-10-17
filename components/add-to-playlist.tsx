"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ListPlus, Plus } from "lucide-react";
import { usePlayer, useUI } from "@/components/app-shell";

export default function AddToPlaylist({
  songId,
  align = "right",
}: {
  songId: string;
  align?: "left" | "right";
}) {
  const { userPlaylists, addToPlaylist, removeFromPlaylist } = usePlayer();
  const { openCreatePlaylist } = useUI();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        aria-label="Add to playlist"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`shrink-0 rounded-full p-1.5 text-slate-500 transition hover:bg-white/10 hover:text-violet-300 ${
          open ? "bg-white/10 text-violet-300" : ""
        }`}
      >
        <ListPlus size={16} />
      </button>

      {open && (
        <div
          role="menu"
          className={`absolute top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#0e1322]/95 p-1.5 shadow-2xl backdrop-blur-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <p className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-500">ADD TO PLAYLIST</p>
          <div className="max-h-56 overflow-y-auto">
            {userPlaylists.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-400">No playlists yet.</p>
            )}
            {userPlaylists.map((p) => {
              const inList = p.songIds.includes(songId);
              return (
                <button
                  key={p.id}
                  role="menuitemcheckbox"
                  aria-checked={inList}
                  onClick={() => (inList ? removeFromPlaylist(p.id, songId) : addToPlaylist(p.id, songId))}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition hover:bg-white/[0.08]"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: p.color }}
                  >
                    {inList ? <Check size={14} /> : <ListPlus size={13} className="text-white/80" />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{p.name}</span>
                  <span className="shrink-0 text-[10px] text-slate-500">{p.songIds.length}</span>
                </button>
              );
            })}
          </div>
          <div className="my-1 h-px bg-white/[0.08]" />
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              openCreatePlaylist(songId);
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-semibold text-violet-300 transition hover:bg-white/[0.08]"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.08]">
              <Plus size={14} />
            </span>
            New playlist
          </button>
        </div>
      )}
    </div>
  );
}
