import { createHash } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { cacheLife, cacheTag } from "next/cache";
import {
  seedArtists,
  seedGenres,
  seedPlaylists,
  seedSongs,
  type Artist,
  type Genre,
  type Playlist,
  type Song,
} from "./data";

export type Catalog = {
  songs: Song[];
  genres: Genre[];
  artists: Artist[];
  playlists: Playlist[];
  passwordHash: string;
};

export const DEFAULT_ADMIN_PASSWORD = "admin2302";

export const hashPassword = (value: string) =>
  createHash("sha256").update(value).digest("hex");

/**
 * Password used to unlock the admin dashboard. Set the `ADMIN_PASSWORD`
 * environment variable on Netlify; locally it falls back to `admin2302`.
 */
export function resolveAdminPassword(): string {
  const fromEnv = process.env.ADMIN_PASSWORD?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_PASSWORD;
}

/** Token stored in the `sonora_admin` cookie and compared on every action. */
export function adminToken(): string {
  return hashPassword(resolveAdminPassword());
}

const BLOB_STORE = process.env.SONORA_BLOB_STORE || "sonora";
const BLOB_KEY = "catalog.json";
const FILE = path.join(process.cwd(), "data", "catalog.json");

type BlobStore = {
  get: (key: string, options: { type: "json" }) => Promise<unknown>;
  setJSON: (key: string, data: unknown) => Promise<unknown>;
};

/**
 * Returns a Netlify Blobs store when running on Netlify (where the runtime
 * injects blob credentials), or `null` locally so we fall back to the
 * filesystem for `next dev`.
 */
async function getBlobStore(): Promise<BlobStore | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore({ name: BLOB_STORE, consistency: "strong" }) as unknown as BlobStore;
  } catch {
    return null;
  }
}

function seedCatalog(): Catalog {
  return {
    songs: seedSongs,
    genres: seedGenres,
    artists: seedArtists,
    playlists: seedPlaylists,
    passwordHash: hashPassword(resolveAdminPassword()),
  };
}

function normalize(raw: Partial<Catalog>): Catalog {
  const base = seedCatalog();
  return {
    songs: Array.isArray(raw.songs) ? (raw.songs as Song[]) : base.songs,
    genres: Array.isArray(raw.genres) ? (raw.genres as Genre[]) : base.genres,
    artists: Array.isArray(raw.artists) ? (raw.artists as Artist[]) : base.artists,
    playlists: Array.isArray(raw.playlists) ? (raw.playlists as Playlist[]) : base.playlists,
    passwordHash:
      typeof raw.passwordHash === "string" && raw.passwordHash
        ? raw.passwordHash
        : base.passwordHash,
  };
}

export async function readCatalog(): Promise<Catalog> {
  const store = await getBlobStore();
  if (store) {
    const raw = await store.get(BLOB_KEY, { type: "json" }).catch(() => null);
    if (raw) return normalize(raw as Partial<Catalog>);
    const seeded = seedCatalog();
    await store.setJSON(BLOB_KEY, seeded).catch(() => {});
    return seeded;
  }

  try {
    const raw = await fs.readFile(FILE, "utf8");
    return normalize(JSON.parse(raw) as Partial<Catalog>);
  } catch {
    const seeded = seedCatalog();
    await writeCatalog(seeded).catch(() => {});
    return seeded;
  }
}

export async function writeCatalog(catalog: Catalog): Promise<void> {
  const store = await getBlobStore();
  if (store) {
    await store.setJSON(BLOB_KEY, catalog);
    return;
  }

  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(catalog, null, 2) + "\n", "utf8");
}

export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag("catalog");
  cacheLife("max");
  return readCatalog();
}
