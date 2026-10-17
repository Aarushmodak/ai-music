"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  Disc3,
  Headphones,
  Image as ImageIcon,
  ListMusic,
  Lock,
  LogOut,
  Music2,
  Plus,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { Artist, Genre, Playlist, Song } from "@/lib/data";
import { imageUrl } from "@/lib/data";
import {
  addArtistAction,
  addGenreAction,
  addPlaylistAction,
  addSongAction,
  clearSongsAction,
  importDemoSongsAction,
  loginAction,
  logoutAction,
  removeArtistAction,
  removeGenreAction,
  removePlaylistAction,
  removeSongAction,
  resetCatalogAction,
  updateArtistAction,
  updateGenreAction,
  updatePlaylistAction,
  updateSongAction,
} from "@/app/admin/actions";
import { ActionForm, DangerButton, Field, SubmitButton, inputClass } from "./form-controls";
import MediaUpload from "./media-upload";

type SafeCatalog = {
  songs: Song[];
  genres: Genre[];
  artists: Artist[];
  playlists: Playlist[];
};

export default function AdminDashboard({ catalog, isAdmin }: { catalog: SafeCatalog; isAdmin: boolean }) {
  if (!isAdmin) return <LoginGate />;
  return <Dashboard catalog={catalog} />;
}

function LoginGate() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center">
      <section className="glass glass-refract relative overflow-hidden rounded-[2rem] p-7 sm:p-9">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="relative">
          <span className="clay-accent mb-5 flex h-14 w-14 items-center justify-center rounded-2xl">
            <Lock size={24} />
          </span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-violet-300">RESTRICTED AREA</span>
          <h1 className="mt-2 text-2xl font-black">Admin dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">Enter the admin password to manage the SONORA catalog.</p>

          <ActionForm action={loginAction} className="mt-6" resetOnSuccess={false}>
            <Field label="Password">
              <input
                type="password"
                name="password"
                autoFocus
                autoComplete="current-password"
                placeholder="••••••••"
                className={inputClass}
              />
            </Field>
            <div className="mt-5">
              <SubmitButton className="btn-clay w-full" pendingLabel="Unlocking…">
                Unlock dashboard
              </SubmitButton>
            </div>
          </ActionForm>
        </div>
      </section>
    </div>
  );
}

const TABS = [
  { id: "songs", label: "Songs", icon: Music2 },
  { id: "playlists", label: "Playlists", icon: ListMusic },
  { id: "artists", label: "Artists", icon: Headphones },
  { id: "genres", label: "Genres", icon: Disc3 },
  { id: "security", label: "Security", icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

function Dashboard({ catalog }: { catalog: SafeCatalog }) {
  const [tab, setTab] = useState<TabId>("songs");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <section className="glass glass-refract relative overflow-hidden rounded-[2rem] p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-violet-300">CONTROL ROOM</span>
            <h1 className="mt-1 text-2xl font-black sm:text-3xl">Admin dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">
              {catalog.songs.length} songs · {catalog.playlists.length} playlists · {catalog.artists.length} artists ·{" "}
              {catalog.genres.length} genres
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-glass inline-flex items-center rounded-xl px-4 py-2.5 text-xs font-semibold">
              Back to app
            </Link>
            <button
              type="button"
              disabled={pending}
              onClick={() => startTransition(async () => void (await logoutAction()))}
              className="btn-glass inline-flex items-center rounded-xl px-4 py-2.5 text-xs font-bold text-pink-300 disabled:opacity-60"
            >
              <LogOut size={15} className="mr-2" /> {pending ? "Signing out…" : "Log out"}
            </button>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap gap-2">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                  active ? "clay-accent text-white" : "btn-glass text-slate-300"
                }`}
              >
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>
      </section>

      {tab === "songs" && <SongsPanel catalog={catalog} />}
      {tab === "playlists" && <PlaylistsPanel catalog={catalog} />}
      {tab === "artists" && <ArtistsPanel catalog={catalog} />}
      {tab === "genres" && <GenresPanel catalog={catalog} />}
      {tab === "security" && (
        <SecurityPanel onLogout={() => startTransition(async () => void (await logoutAction()))} />
      )}
    </div>
  );
}

function PanelCard({ icon: Icon, title, subtitle, children }: { icon: typeof Music2; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="clay rounded-[1.75rem] p-5 sm:p-7">
      <h2 className="mb-1 flex items-center gap-2.5 text-lg font-black">
        <span className="clay-accent flex h-9 w-9 items-center justify-center rounded-xl">
          <Icon size={18} />
        </span>
        {title}
      </h2>
      {subtitle && <p className="mb-4 ml-[46px] text-xs text-slate-400">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function genreOptions(genres: Genre[]) {
  return genres.map((g) => g.name);
}

function SongFields({ song, genres }: { song?: Song; genres: Genre[] }) {
  const options = genreOptions(genres);
  const value = song?.genre ?? options[0] ?? "Pop";
  return (
    <div className="space-y-3">
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {song && <input type="hidden" name="id" value={song.id} />}
      <Field label="Title">
        <input name="title" defaultValue={song?.title ?? ""} required placeholder="Song title" className={inputClass} />
      </Field>
      <Field label="Artist">
        <input name="artist" defaultValue={song?.artist ?? ""} placeholder="Artist name" className={inputClass} />
      </Field>
      <Field label="Genre">
        {options.length ? (
          <select name="genre" defaultValue={value} className={inputClass}>
            {options.map((g) => (
              <option key={g} value={g} className="bg-[#141930]">
                {g}
              </option>
            ))}
          </select>
        ) : (
          <input name="genre" defaultValue={value} className={inputClass} />
        )}
      </Field>
      <Field label="Color">
        <input type="color" name="color" defaultValue={song?.color ?? "#6d28d9"} className="h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-1" />
      </Field>
      <Field label="Duration">
        <input name="duration" defaultValue={song?.duration ?? "3:30"} placeholder="3:30" className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Plays">
          <input type="number" name="plays" defaultValue={song?.plays ?? 0} min={0} className={inputClass} />
        </Field>
        <Field label="Year">
          <input type="number" name="year" defaultValue={song?.year ?? new Date().getFullYear()} className={inputClass} />
        </Field>
      </div>
    </div>

    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      <MediaUpload
        name="audio"
        label="Audio track"
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.opus,.webm"
        defaultValue={song?.audio ?? ""}
        hint="Paste a URL, or upload a track directly to Cloudinary (any size)."
      />
      <MediaUpload
        name="image"
        label="Cover image"
        accept="image/*"
        defaultValue={song?.image ?? ""}
        hint="Paste a URL or Unsplash id, or upload a cover image."
      />
    </div>
    </div>
  );
}

function SongsPanel({ catalog }: { catalog: SafeCatalog }) {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const filtered = term
    ? catalog.songs.filter((s) => [s.title, s.artist, s.genre].some((v) => v.toLowerCase().includes(term)))
    : catalog.songs;

  return (
    <div className="space-y-6">
      <PanelCard
        icon={Plus}
        title="Add a song"
        subtitle="Upload or link a track. Provide an Unsplash photo id (e.g. photo-151960…) or any image URL."
      >
        <ActionForm action={addSongAction}>
          <SongFields genres={catalog.genres} />
          <div className="mt-5">
            <SubmitButton>Add song</SubmitButton>
          </div>
        </ActionForm>
      </PanelCard>

      <PanelCard icon={Music2} title={`Manage songs (${catalog.songs.length})`} subtitle="Edit any field inline and save, or remove a track.">
        <div className="clay-inset mb-4 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5">
          <Search size={16} className="text-violet-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by title, artist or genre…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear" className="text-slate-400 hover:text-white">
              <X size={15} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          {filtered.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No songs match.</p>}
          {filtered.map((song) => (
            <div key={song.id} className="clay-inset rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl" style={{ background: song.color }}>
                  {song.image ? (
                    <img src={imageUrl(song.image, 120)} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-slate-300">
                      <ImageIcon size={16} />
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{song.title}</p>
                  <p className="truncate text-xs text-slate-400">
                    {song.artist} · {song.genre} · <span className="font-mono">{song.id}</span>
                  </p>
                </div>
                <DangerButton action={() => removeSongAction(song.id)} confirm={`Remove "${song.title}"?`}>
                  <Trash2 size={14} /> Remove
                </DangerButton>
              </div>
              <ActionForm action={updateSongAction} resetOnSuccess={false}>
                <SongFields song={song} genres={catalog.genres} />
                <div className="mt-4 flex items-center gap-3">
                  <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
                  <Link href={`/playlists`} className="text-xs text-slate-500">
                    id: <span className="font-mono">{song.id}</span>
                  </Link>
                </div>
              </ActionForm>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}

function PlaylistFields({ playlist, songs }: { playlist?: Playlist; songs: Song[] }) {
  const selected = new Set(playlist?.songIds ?? []);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {playlist && <input type="hidden" name="slug" value={playlist.slug} />}
        <Field label="Name">
          <input name="name" defaultValue={playlist?.name ?? ""} required placeholder="Playlist name" className={inputClass} />
        </Field>
        <Field label="Description">
          <input name="description" defaultValue={playlist?.description ?? ""} placeholder="Short description" className={inputClass} />
        </Field>
        <Field label="Image URL or ID">
          <input name="image" defaultValue={playlist?.image ?? ""} placeholder="https://… or unsplash id" className={inputClass} />
        </Field>
        <Field label="Color">
          <input type="color" name="color" defaultValue={playlist?.color ?? "#6d28d9"} className="h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-1" />
        </Field>
      </div>
      <div>
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Tracks ({selected.size} selected)
        </span>
        <div className="clay-inset grid max-h-56 grid-cols-1 gap-1 overflow-y-auto rounded-xl p-3 sm:grid-cols-2">
          {songs.length === 0 && <p className="text-xs text-slate-500">No songs available.</p>}
          {songs.map((s) => (
            <label key={s.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-xs hover:bg-white/[0.06]">
              <input type="checkbox" name="songIds" value={s.id} defaultChecked={selected.has(s.id)} className="accent-violet-500" />
              <span className="truncate">{s.title}</span>
              <span className="ml-auto shrink-0 text-slate-500">{s.artist}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlaylistsPanel({ catalog }: { catalog: SafeCatalog }) {
  return (
    <div className="space-y-6">
      <PanelCard icon={Plus} title="Create a playlist" subtitle="Select the tracks that belong in this collection.">
        <ActionForm action={addPlaylistAction}>
          <PlaylistFields songs={catalog.songs} />
          <div className="mt-5">
            <SubmitButton>Create playlist</SubmitButton>
          </div>
        </ActionForm>
      </PanelCard>

      <PanelCard icon={ListMusic} title={`Manage playlists (${catalog.playlists.length})`}>
        <div className="space-y-4">
          {catalog.playlists.map((playlist) => (
            <div key={playlist.slug} className="clay-inset rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{playlist.name}</p>
                  <p className="truncate text-xs text-slate-400">{playlist.songIds.length} tracks · {playlist.slug}</p>
                </div>
                <DangerButton action={() => removePlaylistAction(playlist.slug)} confirm={`Delete "${playlist.name}"?`}>
                  <Trash2 size={14} /> Delete
                </DangerButton>
              </div>
              <ActionForm action={updatePlaylistAction} resetOnSuccess={false}>
                <PlaylistFields playlist={playlist} songs={catalog.songs} />
                <div className="mt-4">
                  <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
                </div>
              </ActionForm>
            </div>
          ))}
          {catalog.playlists.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No playlists yet.</p>}
        </div>
      </PanelCard>
    </div>
  );
}

function ArtistFields({ artist, genres }: { artist?: Artist; genres: Genre[] }) {
  const options = genreOptions(genres);
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {artist && <input type="hidden" name="slug" value={artist.slug} />}
      <Field label="Name">
        <input name="name" defaultValue={artist?.name ?? ""} required placeholder="Artist name" className={inputClass} />
      </Field>
      <Field label="Genre">
        {options.length ? (
          <select name="genre" defaultValue={artist?.genre ?? options[0]} className={inputClass}>
            {options.map((g) => (
              <option key={g} value={g} className="bg-[#141930]">
                {g}
              </option>
            ))}
          </select>
        ) : (
          <input name="genre" defaultValue={artist?.genre ?? ""} className={inputClass} />
        )}
      </Field>
      <Field label="Followers">
        <input type="number" name="followers" defaultValue={artist?.followers ?? 0} min={0} className={inputClass} />
      </Field>
      <Field label="Image URL or ID">
        <input name="image" defaultValue={artist?.image ?? ""} placeholder="https://… or unsplash id" className={inputClass} />
      </Field>
      <Field label="Color">
        <input type="color" name="color" defaultValue={artist?.color ?? "#6d28d9"} className="h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-1" />
      </Field>
      <Field label="Bio">
        <input name="bio" defaultValue={artist?.bio ?? ""} placeholder="Short bio" className={inputClass} />
      </Field>
    </div>
  );
}

function ArtistsPanel({ catalog }: { catalog: SafeCatalog }) {
  return (
    <div className="space-y-6">
      <PanelCard icon={Plus} title="Add an artist">
        <ActionForm action={addArtistAction}>
          <ArtistFields genres={catalog.genres} />
          <div className="mt-5">
            <SubmitButton>Add artist</SubmitButton>
          </div>
        </ActionForm>
      </PanelCard>
      <PanelCard icon={Headphones} title={`Manage artists (${catalog.artists.length})`}>
        <div className="space-y-4">
          {catalog.artists.map((artist) => (
            <div key={artist.slug} className="clay-inset rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{artist.name}</p>
                  <p className="truncate text-xs text-slate-400">{artist.genre} · {artist.slug}</p>
                </div>
                <DangerButton action={() => removeArtistAction(artist.slug)} confirm={`Remove "${artist.name}"?`}>
                  <Trash2 size={14} /> Remove
                </DangerButton>
              </div>
              <ActionForm action={updateArtistAction} resetOnSuccess={false}>
                <ArtistFields artist={artist} genres={catalog.genres} />
                <div className="mt-4">
                  <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
                </div>
              </ActionForm>
            </div>
          ))}
          {catalog.artists.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No artists yet.</p>}
        </div>
      </PanelCard>
    </div>
  );
}

function GenreFields({ genre }: { genre?: Genre }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {genre && <input type="hidden" name="slug" value={genre.slug} />}
      <Field label="Name">
        <input name="name" defaultValue={genre?.name ?? ""} required placeholder="Genre name" className={inputClass} />
      </Field>
      <Field label="Track count">
        <input type="number" name="count" defaultValue={genre?.count ?? 0} min={0} className={inputClass} />
      </Field>
      <Field label="Image URL or ID">
        <input name="image" defaultValue={genre?.image ?? ""} placeholder="https://… or unsplash id" className={inputClass} />
      </Field>
      <Field label="Color">
        <input type="color" name="color" defaultValue={genre?.color ?? "#6d28d9"} className="h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-white/[0.06] px-1" />
      </Field>
      <div className="sm:col-span-2 lg:col-span-2">
        <Field label="Blurb">
          <input name="blurb" defaultValue={genre?.blurb ?? ""} placeholder="Short description" className={inputClass} />
        </Field>
      </div>
    </div>
  );
}

function GenresPanel({ catalog }: { catalog: SafeCatalog }) {
  return (
    <div className="space-y-6">
      <PanelCard icon={Plus} title="Add a genre">
        <ActionForm action={addGenreAction}>
          <GenreFields />
          <div className="mt-5">
            <SubmitButton>Add genre</SubmitButton>
          </div>
        </ActionForm>
      </PanelCard>
      <PanelCard icon={Disc3} title={`Manage genres (${catalog.genres.length})`}>
        <div className="space-y-4">
          {catalog.genres.map((genre) => (
            <div key={genre.slug} className="clay-inset rounded-2xl p-4">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-8 w-8 shrink-0 rounded-lg" style={{ background: genre.color }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{genre.name}</p>
                  <p className="truncate text-xs text-slate-400">{genre.slug}</p>
                </div>
                <DangerButton action={() => removeGenreAction(genre.slug)} confirm={`Remove "${genre.name}"?`}>
                  <Trash2 size={14} /> Remove
                </DangerButton>
              </div>
              <ActionForm action={updateGenreAction} resetOnSuccess={false}>
                <GenreFields genre={genre} />
                <div className="mt-4">
                  <SubmitButton pendingLabel="Saving…">Save changes</SubmitButton>
                </div>
              </ActionForm>
            </div>
          ))}
          {catalog.genres.length === 0 && <p className="py-6 text-center text-sm text-slate-400">No genres yet.</p>}
        </div>
      </PanelCard>
    </div>
  );
}

function SecurityPanel({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-6">
      <PanelCard
        icon={Lock}
        title="Admin password"
        subtitle="The password is read from the ADMIN_PASSWORD environment variable, so it is never stored in the code or the catalog."
      >
        <p className="text-sm text-slate-400">
          Change it in Netlify under{" "}
          <span className="font-semibold text-slate-200">Site configuration → Environment variables</span>, then
          redeploy. Locally it falls back to <span className="font-semibold text-slate-200">admin2302</span>.
        </p>
      </PanelCard>

      <PanelCard icon={RotateCcw} title="Catalog tools" subtitle="Bulk actions apply to the whole catalog and update the live site immediately.">
        <div className="flex flex-wrap items-center gap-3">
          <DangerButton action={importDemoSongsAction} className="btn-glass text-emerald-300">
            <Upload size={14} /> Import demo songs
          </DangerButton>
          <DangerButton action={clearSongsAction} confirm="Remove ALL songs from the catalog? This cannot be undone." className="btn-glass text-pink-300">
            <Trash2 size={14} /> Clear all songs
          </DangerButton>
          <DangerButton action={resetCatalogAction} confirm="Reset songs, playlists, artists and genres to the original demo data? Your edits will be lost." className="btn-glass text-amber-300">
            <RotateCcw size={14} /> Reset catalog
          </DangerButton>
        </div>
      </PanelCard>

      <PanelCard icon={LogOut} title="Session">
        <button onClick={onLogout} className="btn-glass inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-bold text-pink-300">
          <LogOut size={15} className="mr-2" /> Log out of admin
        </button>
      </PanelCard>
    </div>
  );
}
