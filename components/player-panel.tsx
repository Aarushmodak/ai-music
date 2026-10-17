"use client";

import Link from "next/link";
import {
  AudioLines,
  Heart,
  MoreHorizontal,
  Pause,
  Play,
  Repeat2,
  Shuffle,
  SkipBack,
  SkipForward,
  Sparkles,
  ChevronRight,
  Volume2,
  VolumeX,
} from "lucide-react";
import { usePlayer } from "@/components/app-shell";
import { imageUrl } from "@/lib/data";
import { formatTime } from "@/lib/format";

export default function PlayerPanel() {
  const {
    queue,
    current,
    currentId,
    playing,
    volume,
    time,
    duration,
    shuffle,
    repeat,
    playSong,
    togglePlay,
    next,
    prev,
    seekRatio,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    isLiked,
  } = usePlayer();

  const seekFromEvent = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seekRatio((e.clientX - rect.left) / rect.width);
  };

  return (
    <aside className="glass glass-refract fixed bottom-3 right-3 top-3 z-30 hidden w-[300px] flex-col rounded-[1.9rem] xl:flex">
      <div className="flex h-[68px] shrink-0 items-center justify-between px-5">
        <div className="flex items-center gap-2.5">
          <span className="clay-accent flex h-9 w-9 items-center justify-center rounded-xl">
            <AudioLines size={18} />
          </span>
          <h2 className="text-sm font-bold">Now playing</h2>
        </div>
        <button className="rounded-full p-1.5 text-slate-500 transition hover:bg-white/[0.06] hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <div className="clay mb-5 rounded-[1.75rem] p-2.5">
          <div className="relative aspect-square overflow-hidden rounded-[1.35rem]">
            <img
              src={imageUrl(current.image)}
              alt={current.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="glass absolute bottom-3 left-3 rounded-xl px-3 py-1.5 text-[10px] font-bold tracking-widest text-white">
              AI ORIGINAL
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold">{current.title}</h3>
            <Link
              href={`/artists/${current.artist.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              className="mt-1 block truncate text-sm text-slate-400 transition hover:text-violet-300"
            >
              {current.artist}
            </Link>
          </div>
          <button
            onClick={() => toggleLike(currentId)}
            aria-label="Like song"
            className="shrink-0 rounded-full p-2 text-slate-400 transition hover:bg-white/[0.06] hover:text-pink-400"
          >
            <Heart size={21} fill={isLiked(currentId) ? "#f472b6" : "none"} className={isLiked(currentId) ? "text-pink-400" : ""} />
          </button>
        </div>

        <div className="mt-6">
          <div
            onClick={seekFromEvent}
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(time)}
            className="clay-inset flex h-3.5 cursor-pointer items-center rounded-full px-[3px]"
          >
            <div
              className="h-2 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 shadow-[0_0_14px_rgba(139,92,246,0.8)]"
              style={{ width: `${duration ? (time / duration) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-slate-500">
            <span>{formatTime(time)}</span>
            <span>{duration ? formatTime(duration) : current.duration}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between px-1">
          <button
            onClick={toggleShuffle}
            aria-label="Shuffle"
            className={`rounded-full p-1.5 transition ${shuffle ? "text-violet-300" : "text-slate-500 hover:bg-white/[0.06] hover:text-white"}`}
          >
            <Shuffle size={18} />
          </button>
          <button onClick={prev} aria-label="Previous" className="rounded-full p-1.5 text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
            <SkipBack size={23} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            aria-label={playing ? "Pause" : "Play"}
            className="btn-clay flex h-14 w-14 items-center justify-center rounded-full transition hover:scale-105"
          >
            {playing ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" className="ml-1" />}
          </button>
          <button onClick={next} aria-label="Next" className="rounded-full p-1.5 text-slate-300 transition hover:bg-white/[0.06] hover:text-white">
            <SkipForward size={23} fill="currentColor" />
          </button>
          <button
            onClick={toggleRepeat}
            aria-label="Repeat"
            className={`rounded-full p-1.5 transition ${repeat ? "text-violet-400" : "text-slate-500 hover:bg-white/[0.06] hover:text-white"}`}
          >
            <Repeat2 size={18} />
          </button>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="clay-inset flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400">
            {volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </span>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
            className="range w-full"
          />
        </div>

        <div className="mb-3 mt-6 flex items-center justify-between">
          <h3 className="text-xs font-bold tracking-wide text-slate-300">UP NEXT</h3>
          <span className="text-[10px] text-slate-500">{queue.length} tracks</span>
        </div>
        <div className="space-y-1">
          {queue.map((song, i) => (
            <button
              key={song.id + i}
              onClick={() => playSong(song.id, queue)}
              className={`flex w-full items-center gap-3 rounded-2xl p-2 text-left transition ${
                currentId === song.id
                  ? "clay-accent text-white"
                  : "text-slate-300 hover:translate-x-1 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <span className="w-4 shrink-0 text-center text-[10px] text-slate-300">
                {currentId === song.id && playing ? <AudioLines size={14} /> : i + 1}
              </span>
              <img src={imageUrl(song.image, 120)} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold">{song.title}</p>
                <p className={`mt-0.5 truncate text-[10px] ${currentId === song.id ? "text-white/70" : "text-slate-500"}`}>
                  {song.artist}
                </p>
              </div>
              <span className={`text-[10px] ${currentId === song.id ? "text-white/80" : "text-slate-500"}`}>
                {song.duration}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="shrink-0 p-4">
        <Link
          href="/playlists"
          className="clay relative flex items-center gap-3 overflow-hidden rounded-[1.4rem] p-3 transition hover:-translate-y-0.5"
        >
          <div className="pointer-events-none absolute -right-6 -top-8 h-20 w-20 rounded-full bg-violet-500/30 blur-2xl" />
          <div className="clay-accent relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
            <Sparkles size={19} />
          </div>
          <div className="relative min-w-0 flex-1">
            <p className="text-xs font-bold">AI music studio</p>
            <p className="mt-1 text-[10px] text-slate-400">Create your next sound.</p>
          </div>
          <ChevronRight size={17} className="relative text-slate-400" />
        </Link>
      </div>
    </aside>
  );
}
