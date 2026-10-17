"use client";

import { Heart, Pause, Play, SkipForward } from "lucide-react";
import { usePlayer } from "@/components/app-shell";
import { imageUrl } from "@/lib/data";

export default function MobilePlayer() {
  const { current, currentId, playing, duration, time, togglePlay, next, seekRatio, toggleLike, isLiked } =
    usePlayer();

  const seekFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seekRatio((e.clientX - rect.left) / rect.width);
  };

  return (
    <div className="glass glass-refract fixed inset-x-2 bottom-2 z-40 flex flex-col gap-2.5 rounded-[1.4rem] p-2.5 sm:inset-x-3 sm:bottom-3 sm:gap-3 sm:p-3 xl:hidden">
      <div
        onClick={seekFromEvent}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration) || 0}
        aria-valuenow={Math.round(time) || 0}
        className="h-1.5 w-full cursor-pointer rounded-full bg-white/15"
      >
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
          style={{ width: duration ? `${(time / duration) * 100}%` : "0%" }}
        >
          <span className="absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white shadow-md" />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <img src={imageUrl(current.image, 120)} alt="" className="h-11 w-11 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-bold">{current.title}</p>
          <p className="truncate text-[10px] text-slate-400">{current.artist}</p>
        </div>
        <button
          onClick={() => toggleLike(currentId)}
          aria-label="Like song"
          className="rounded-full p-2 text-slate-400 transition hover:text-pink-400"
        >
          <Heart size={17} fill={isLiked(currentId) ? "#f472b6" : "none"} className={isLiked(currentId) ? "text-pink-400" : ""} />
        </button>
        <button onClick={togglePlay} aria-label={playing ? "Pause" : "Play"} className="btn-clay rounded-full p-2.5">
          {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>
        <button onClick={next} aria-label="Next" className="rounded-full p-2 text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
}
