"use server";

import { cookies } from "next/headers";
import { refresh, updateTag } from "next/cache";
import { ADMIN_COOKIE, isAdmin } from "@/lib/admin-auth";
import {
  adminToken,
  hashPassword,
  readCatalog,
  writeCatalog,
  type Catalog,
} from "@/lib/catalog";
import {
  slugify,
  type Artist,
  type Genre,
  type Playlist,
  type Song,
} from "@/lib/data";

export type ActionResult = { ok: boolean; error?: string };

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

function str(formData: FormData, key: string, fallback = "") {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : fallback;
}

function num(formData: FormData, key: string, fallback = 0) {
  const value = Number(str(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

async function persist(catalog: Catalog): Promise<void> {
  await writeCatalog(catalog);
  updateTag("catalog");
  refresh();
}

async function guard(): Promise<Catalog | null> {
  if (!(await isAdmin())) return null;
  return readCatalog();
}

function uniqueSlug(existing: string[], desired: string): string {
  const base = slugify(desired) || "item";
  let candidate = base;
  let i = 2;
  while (existing.includes(candidate)) {
    candidate = `${base}-${i}`;
    i += 1;
  }
  return candidate;
}

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const password = str(formData, "password");
  const expected = adminToken();
  if (hashPassword(password) !== expected) {
    return { ok: false, error: "Incorrect password. Try again." };
  }
  (await cookies()).set(ADMIN_COOKIE, expected, COOKIE_OPTIONS);
  refresh();
  return { ok: true };
}

export async function logoutAction(): Promise<void> {
  (await cookies()).delete(ADMIN_COOKIE);
  refresh();
}

export async function addSongAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };

  const title = str(formData, "title");
  if (!title) return { ok: false, error: "A song title is required." };

  const audio = str(formData, "audio", "/music/song1.mp3") || "/music/song1.mp3";
  const image = str(formData, "image");

  const id = uniqueSlug(
    catalog.songs.map((s) => s.id),
    str(formData, "id") || title,
  );
  const song: Song = {
    id,
    title,
    artist: str(formData, "artist", "Unknown Artist") || "Unknown Artist",
    genre: str(formData, "genre", "Pop") || "Pop",
    color: str(formData, "color", "#6d28d9") || "#6d28d9",
    image,
    duration: str(formData, "duration", "3:30") || "3:30",
    audio,
    plays: num(formData, "plays"),
    year: num(formData, "year", new Date().getFullYear()),
  };

  await persist({ ...catalog, songs: [song, ...catalog.songs] });
  return { ok: true };
}

export async function updateSongAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };

  const id = str(formData, "id");
  const existing = catalog.songs.find((s) => s.id === id);
  if (!existing) return { ok: false, error: "Song not found." };

  const audio = str(formData, "audio", existing.audio) || existing.audio;
  const image = str(formData, "image", existing.image);

  const title = str(formData, "title", existing.title) || existing.title;
  const updated: Song = {
    ...existing,
    title,
    artist: str(formData, "artist", existing.artist) || existing.artist,
    genre: str(formData, "genre", existing.genre) || existing.genre,
    color: str(formData, "color", existing.color) || existing.color,
    image,
    duration: str(formData, "duration", existing.duration) || existing.duration,
    audio,
    plays: formData.get("plays") === null ? existing.plays : num(formData, "plays"),
    year: formData.get("year") === null ? existing.year : num(formData, "year", existing.year),
  };

  await persist({
    ...catalog,
    songs: catalog.songs.map((s) => (s.id === id ? updated : s)),
  });
  return { ok: true };
}

export async function removeSongAction(id: string): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };
  await persist({
    ...catalog,
    songs: catalog.songs.filter((s) => s.id !== id),
    playlists: catalog.playlists.map((p) => ({
      ...p,
      songIds: p.songIds.filter((songId) => songId !== id),
    })),
  });
  return { ok: true };
}

export async function clearSongsAction(): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };
  await persist({
    ...catalog,
    songs: [],
    playlists: catalog.playlists.map((p) => ({ ...p, songIds: [] })),
  });
  return { ok: true };
}

export async function importDemoSongsAction(): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };
  const { seedSongs } = await import("@/lib/data");
  const existing = new Set(catalog.songs.map((s) => s.id));
  const merged = [...catalog.songs, ...seedSongs.filter((s) => !existing.has(s.id))];
  await persist({ ...catalog, songs: merged });
  return { ok: true };
}

export async function resetCatalogAction(): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Not authorized." };
  const catalog = await readCatalog();
  const { seedArtists, seedGenres, seedPlaylists, seedSongs } = await import("@/lib/data");
  await persist({
    ...catalog,
    songs: seedSongs,
    genres: seedGenres,
    artists: seedArtists,
    playlists: seedPlaylists,
  });
  return { ok: true };
}

export async function addPlaylistAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };

  const name = str(formData, "name");
  if (!name) return { ok: false, error: "A playlist name is required." };

  const slug = uniqueSlug(
    catalog.playlists.map((p) => p.slug),
    str(formData, "slug") || name,
  );
  const playlist: Playlist = {
    slug,
    name,
    description: str(formData, "description"),
    color: str(formData, "color", "#6d28d9") || "#6d28d9",
    image: str(formData, "image"),
    songIds: formData.getAll("songIds").filter((v): v is string => typeof v === "string"),
  };

  await persist({ ...catalog, playlists: [playlist, ...catalog.playlists] });
  return { ok: true };
}

export async function updatePlaylistAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };

  const slug = str(formData, "slug");
  const existing = catalog.playlists.find((p) => p.slug === slug);
  if (!existing) return { ok: false, error: "Playlist not found." };

  const updated: Playlist = {
    ...existing,
    name: str(formData, "name", existing.name) || existing.name,
    description: str(formData, "description", existing.description),
    color: str(formData, "color", existing.color) || existing.color,
    image: str(formData, "image", existing.image),
    songIds: formData.getAll("songIds").filter((v): v is string => typeof v === "string"),
  };

  await persist({
    ...catalog,
    playlists: catalog.playlists.map((p) => (p.slug === slug ? updated : p)),
  });
  return { ok: true };
}

export async function removePlaylistAction(slug: string): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };
  await persist({ ...catalog, playlists: catalog.playlists.filter((p) => p.slug !== slug) });
  return { ok: true };
}

export async function addArtistAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };

  const name = str(formData, "name");
  if (!name) return { ok: false, error: "An artist name is required." };

  const slug = uniqueSlug(
    catalog.artists.map((a) => a.slug),
    str(formData, "slug") || name,
  );
  const artist: Artist = {
    slug,
    name,
    genre: str(formData, "genre", "Pop") || "Pop",
    followers: num(formData, "followers"),
    color: str(formData, "color", "#6d28d9") || "#6d28d9",
    image: str(formData, "image"),
    bio: str(formData, "bio"),
  };

  await persist({ ...catalog, artists: [artist, ...catalog.artists] });
  return { ok: true };
}

export async function updateArtistAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };

  const slug = str(formData, "slug");
  const existing = catalog.artists.find((a) => a.slug === slug);
  if (!existing) return { ok: false, error: "Artist not found." };

  const updated: Artist = {
    ...existing,
    name: str(formData, "name", existing.name) || existing.name,
    genre: str(formData, "genre", existing.genre) || existing.genre,
    followers: formData.get("followers") === null ? existing.followers : num(formData, "followers"),
    color: str(formData, "color", existing.color) || existing.color,
    image: str(formData, "image", existing.image),
    bio: str(formData, "bio", existing.bio),
  };

  await persist({
    ...catalog,
    artists: catalog.artists.map((a) => (a.slug === slug ? updated : a)),
  });
  return { ok: true };
}

export async function removeArtistAction(slug: string): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };
  await persist({ ...catalog, artists: catalog.artists.filter((a) => a.slug !== slug) });
  return { ok: true };
}

export async function addGenreAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };

  const name = str(formData, "name");
  if (!name) return { ok: false, error: "A genre name is required." };

  const slug = uniqueSlug(
    catalog.genres.map((g) => g.slug),
    str(formData, "slug") || name,
  );
  const genre: Genre = {
    slug,
    name,
    count: num(formData, "count"),
    color: str(formData, "color", "#6d28d9") || "#6d28d9",
    image: str(formData, "image"),
    blurb: str(formData, "blurb"),
  };

  await persist({ ...catalog, genres: [genre, ...catalog.genres] });
  return { ok: true };
}

export async function updateGenreAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };

  const slug = str(formData, "slug");
  const existing = catalog.genres.find((g) => g.slug === slug);
  if (!existing) return { ok: false, error: "Genre not found." };

  const updated: Genre = {
    ...existing,
    name: str(formData, "name", existing.name) || existing.name,
    count: formData.get("count") === null ? existing.count : num(formData, "count"),
    color: str(formData, "color", existing.color) || existing.color,
    image: str(formData, "image", existing.image),
    blurb: str(formData, "blurb", existing.blurb),
  };

  await persist({
    ...catalog,
    genres: catalog.genres.map((g) => (g.slug === slug ? updated : g)),
  });
  return { ok: true };
}

export async function removeGenreAction(slug: string): Promise<ActionResult> {
  const catalog = await guard();
  if (!catalog) return { ok: false, error: "Not authorized." };
  await persist({ ...catalog, genres: catalog.genres.filter((g) => g.slug !== slug) });
  return { ok: true };
}
