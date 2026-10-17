"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Song } from "@/lib/data";
import {
  getServerSnapshot,
  getSnapshot,
  persisted,
  subscribe,
  type UserPlaylist,
} from "@/lib/persist";

export type { UserPlaylist };
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import PlayerPanel from "@/components/player-panel";
import MobilePlayer from "@/components/mobile-player";
import CreatePlaylistModal from "@/components/create-playlist-modal";

type PlayerState = {
  allSongs: Song[];
  queue: Song[];
  current: Song;
  currentId: string;
  playing: boolean;
  volume: number;
  time: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  liked: string[];
  recent: string[];
  userPlaylists: UserPlaylist[];
  hydrated: boolean;
  playSong: (id: string, queue?: Song[]) => void;
  playQueue: (queue: Song[], index?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seekRatio: (ratio: number) => void;
  setVolume: (volume: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleLike: (id: string) => void;
  isLiked: (id: string) => boolean;
  createPlaylist: (name: string, description?: string, songId?: string) => string;
  deletePlaylist: (id: string) => void;
  renamePlaylist: (id: string, name: string) => void;
  addToPlaylist: (playlistId: string, songId: string) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  userPlaylistById: (id: string) => UserPlaylist | undefined;
};

type UIState = {
  mobileMenu: boolean;
  setMobileMenu: (open: boolean) => void;
  toggleMobileMenu: () => void;
  createPlaylistFor: string | null;
  createPlaylistKey: number;
  openCreatePlaylist: (songId?: string) => void;
  closeCreatePlaylist: () => void;
};

const PlayerCtx = createContext<PlayerState | null>(null);
const UICtx = createContext<UIState | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerCtx);
  if (!ctx) throw new Error("usePlayer must be used within AppShell");
  return ctx;
}

export function useUI() {
  const ctx = useContext(UICtx);
  if (!ctx) throw new Error("useUI must be used within AppShell");
  return ctx;
}

const EMPTY_SONG: Song = {
  id: "",
  title: "Nothing playing",
  artist: "—",
  genre: "",
  color: "#4338ca",
  image: "",
  duration: "0:00",
  audio: "",
  plays: 0,
  year: 0,
};

export default function AppShell({ children, songs }: { children: ReactNode; songs: Song[] }) {
  const [queue, setQueue] = useState<Song[]>(songs);
  const [currentId, setCurrentId] = useState<string>(songs[0]?.id ?? "");
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(72);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [createPlaylistFor, setCreatePlaylistFor] = useState<string | null>(null);
  const [createPlaylistKey, setCreatePlaylistKey] = useState(0);

  const persistedState = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { liked, recent, userPlaylists, ready } = persistedState;

  const audioRef = useRef<HTMLAudioElement>(null);
  const current = queue.find((s) => s.id === currentId) ?? queue[0] ?? songs[0] ?? EMPTY_SONG;

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setTime(0);
    setDuration(0);
    if (playing) audio.play().catch(() => setPlaying(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  function remember(id: string) {
    persisted.remember(id);
  }

  function playSong(id: string, nextQueue?: Song[]) {
    if (nextQueue && nextQueue.length) setQueue(nextQueue);
    if (id === currentId) {
      togglePlay();
      return;
    }
    setCurrentId(id);
    setPlaying(true);
    remember(id);
  }

  function playQueue(nextQueue: Song[], index = 0) {
    if (!nextQueue.length) return;
    const song = nextQueue[index] ?? nextQueue[0];
    setQueue(nextQueue);
    if (song.id === currentId) {
      setPlaying(true);
      audioRef.current?.play().catch(() => {});
    } else {
      setCurrentId(song.id);
      setPlaying(true);
    }
    remember(song.id);
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setPlaying(false));
    else audio.pause();
  }

  function next() {
    const index = queue.findIndex((s) => s.id === currentId);
    let nextIndex = (index + 1) % queue.length;
    if (shuffle && queue.length > 1) {
      while (nextIndex === index) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }
    }
    const song = queue[nextIndex];
    setCurrentId(song.id);
    setPlaying(true);
    remember(song.id);
  }

  function prev() {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const index = queue.findIndex((s) => s.id === currentId);
    const prevIndex = (index - 1 + queue.length) % queue.length;
    const song = queue[prevIndex];
    setCurrentId(song.id);
    setPlaying(true);
    remember(song.id);
  }

  function seekRatio(ratio: number) {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const clamped = Math.min(1, Math.max(0, ratio));
    audio.currentTime = clamped * duration;
  }

  function createPlaylist(name: string, description = "", songId?: string): string {
    return persisted.createPlaylist(name, description, songId);
  }

  function deletePlaylist(id: string) {
    persisted.deletePlaylist(id);
  }

  function renamePlaylist(id: string, name: string) {
    persisted.renamePlaylist(id, name);
  }

  function addToPlaylist(playlistId: string, songId: string) {
    persisted.addToPlaylist(playlistId, songId);
  }

  function removeFromPlaylist(playlistId: string, songId: string) {
    persisted.removeFromPlaylist(playlistId, songId);
  }

  const playerValue: PlayerState = {
    allSongs: songs,
    queue,
    current,
    currentId,
    playing,
    volume,
    time,
    duration,
    shuffle,
    repeat,
    liked,
    recent,
    userPlaylists,
    hydrated: ready,
    playSong,
    playQueue,
    togglePlay,
    next,
    prev,
    seekRatio,
    setVolume: setVolumeState,
    toggleShuffle: () => setShuffle((v) => !v),
    toggleRepeat: () => setRepeat((v) => !v),
    toggleLike: (id) => persisted.toggleLike(id),
    isLiked: (id) => liked.includes(id),
    createPlaylist,
    deletePlaylist,
    renamePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    userPlaylistById: (id) => userPlaylists.find((p) => p.id === id),
  };

  const uiValue: UIState = {
    mobileMenu,
    setMobileMenu,
    toggleMobileMenu: () => setMobileMenu((v) => !v),
    createPlaylistFor,
    createPlaylistKey,
    openCreatePlaylist: (songId = "") => {
      setCreatePlaylistFor(songId);
      setCreatePlaylistKey((k) => k + 1);
    },
    closeCreatePlaylist: () => setCreatePlaylistFor(null),
  };

  return (
    <PlayerCtx.Provider value={playerValue}>
      <UICtx.Provider value={uiValue}>
        <main className="app-root relative min-h-screen overflow-x-hidden selection:bg-violet-500/40">
          <audio
            ref={audioRef}
            src={current.audio}
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              if (repeat) {
                audioRef.current?.play();
              } else {
                next();
              }
            }}
            onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
            onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          />

          <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <div className="absolute -left-44 -top-48 h-[42rem] w-[42rem] rounded-full bg-violet-600/25 blur-[140px]" />
            <div className="absolute right-[-12rem] top-1/4 h-[34rem] w-[34rem] rounded-full bg-cyan-500/20 blur-[150px]" />
            <div className="absolute bottom-[-14rem] left-1/3 h-[36rem] w-[36rem] rounded-full bg-fuchsia-600/20 blur-[160px]" />
            <div className="absolute left-1/2 top-1/2 h-[26rem] w-[26rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-[150px]" />
          </div>

          <Sidebar />

          <div className="relative z-10 min-h-screen lg:ml-[264px] xl:mr-[324px]">
            <Header />
            <div className="space-y-14 px-5 pb-40 pt-8 sm:px-8">{children}</div>
          </div>

          <PlayerPanel />
          <MobilePlayer />
          <CreatePlaylistModal />
        </main>
      </UICtx.Provider>
    </PlayerCtx.Provider>
  );
}
