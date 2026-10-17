export type UserPlaylist = {
  id: string;
  name: string;
  description: string;
  color: string;
  songIds: string[];
  createdAt: number;
};

export type PersistedState = {
  liked: string[];
  recent: string[];
  userPlaylists: UserPlaylist[];
  ready: boolean;
};

const KEY = "sonora.state";
const SERVER_SNAPSHOT: PersistedState = {
  liked: [],
  recent: [],
  userPlaylists: [],
  ready: false,
};

let state: PersistedState = SERVER_SNAPSHOT;
let loaded = false;
const listeners = new Set<() => void>();

const PALETTE = ["#812ee8", "#087fc2", "#c13e9c", "#2563eb", "#db2777", "#0e7490", "#b7791f", "#7c3aed"];

function load(): void {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  const next: PersistedState = { liked: [], recent: [], userPlaylists: [], ready: true };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (Array.isArray(parsed.liked)) next.liked = parsed.liked;
      if (Array.isArray(parsed.recent)) next.recent = parsed.recent;
      if (Array.isArray(parsed.userPlaylists)) next.userPlaylists = parsed.userPlaylists;
    }
  } catch {
    // ignore malformed storage
  }
  state = next;
}

function commit(patch: Partial<PersistedState>): void {
  state = { ...state, ...patch, ready: true };
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ liked: state.liked, recent: state.recent, userPlaylists: state.userPlaylists }),
    );
  } catch {
    // storage unavailable
  }
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): PersistedState {
  load();
  return state;
}

export function getServerSnapshot(): PersistedState {
  return SERVER_SNAPSHOT;
}

export const persisted = {
  toggleLike(id: string) {
    const { liked } = state;
    commit({ liked: liked.includes(id) ? liked.filter((x) => x !== id) : [...liked, id] });
  },
  remember(id: string) {
    const { recent } = state;
    commit({ recent: [id, ...recent.filter((x) => x !== id)].slice(0, 12) });
  },
  createPlaylist(name: string, description = "", songId?: string): string {
    const id = `pl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const color = PALETTE[state.userPlaylists.length % PALETTE.length];
    commit({
      userPlaylists: [
        { id, name, description, color, songIds: songId ? [songId] : [], createdAt: Date.now() },
        ...state.userPlaylists,
      ],
    });
    return id;
  },
  deletePlaylist(id: string) {
    commit({ userPlaylists: state.userPlaylists.filter((p) => p.id !== id) });
  },
  renamePlaylist(id: string, name: string) {
    commit({ userPlaylists: state.userPlaylists.map((p) => (p.id === id ? { ...p, name } : p)) });
  },
  addToPlaylist(playlistId: string, songId: string) {
    commit({
      userPlaylists: state.userPlaylists.map((p) =>
        p.id === playlistId && !p.songIds.includes(songId)
          ? { ...p, songIds: [...p.songIds, songId] }
          : p,
      ),
    });
  },
  removeFromPlaylist(playlistId: string, songId: string) {
    commit({
      userPlaylists: state.userPlaylists.map((p) =>
        p.id === playlistId ? { ...p, songIds: p.songIds.filter((s) => s !== songId) } : p,
      ),
    });
  },
};
