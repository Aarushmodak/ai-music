"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search as SearchIcon, Disc3, Headphones, ListMusic, Music2 } from "lucide-react";
import PageHeader from "@/components/page-header";
import SongCard from "@/components/song-card";
import { ArtistCard, GenreCard, PlaylistCard } from "@/components/cards";
import type { Artist, Genre, Playlist, Song } from "@/lib/data";

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Music2;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-4 flex items-center gap-2.5 text-lg font-black">
        <Icon size={18} className="text-violet-300" /> {title}
      </h2>
      {children}
    </section>
  );
}

export default function SearchResults({
  songs,
  artists,
  genres,
  playlists,
}: {
  songs: Song[];
  artists: Artist[];
  genres: Genre[];
  playlists: Playlist[];
}) {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const term = q.toLowerCase();
  const hit = (v: string) => v.toLowerCase().includes(term);

  if (!q) {
    return (
      <section className="glass glass-refract flex flex-col items-center justify-center rounded-[2rem] px-6 py-20 text-center">
        <span className="clay-accent mb-5 flex h-16 w-16 items-center justify-center rounded-2xl">
          <SearchIcon size={28} />
        </span>
        <h1 className="text-2xl font-black">Search SONORA</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Find songs, artists, genres and playlists across the entire AI catalog.
        </p>
      </section>
    );
  }

  const songHits = songs.filter((s) => hit(s.title) || hit(s.artist) || hit(s.genre));
  const artistHits = artists.filter((a) => hit(a.name) || hit(a.genre));
  const genreHits = genres.filter((g) => hit(g.name) || hit(g.blurb));
  const playlistHits = playlists.filter((p) => hit(p.name) || hit(p.description));
  const total = songHits.length + artistHits.length + genreHits.length + playlistHits.length;

  return (
    <>
      <PageHeader
        eyebrow="RESULTS"
        title={`"${q}"`}
        subtitle={`${total} result${total === 1 ? "" : "s"} across songs, artists, genres and playlists.`}
        icon={SearchIcon}
      />

      {total === 0 ? (
        <section className="glass glass-refract flex flex-col items-center justify-center rounded-[2rem] px-6 py-16 text-center">
          <h2 className="text-xl font-black">No results found</h2>
          <p className="mt-2 max-w-sm text-sm text-slate-400">
            Try a different artist, genre, or track name.
          </p>
          <Link href="/explore" className="btn-clay mt-6 rounded-2xl px-6 py-3 text-sm font-bold">
            Explore music
          </Link>
        </section>
      ) : (
        <>
          {songHits.length > 0 && (
            <Section icon={Music2} title="Songs">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {songHits.map((song) => (
                  <SongCard key={song.id} song={song} queue={songHits} />
                ))}
              </div>
            </Section>
          )}

          {artistHits.length > 0 && (
            <Section icon={Headphones} title="Artists">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                {artistHits.map((artist) => (
                  <ArtistCard key={artist.slug} artist={artist} />
                ))}
              </div>
            </Section>
          )}

          {genreHits.length > 0 && (
            <Section icon={Disc3} title="Genres">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {genreHits.map((genre) => (
                  <GenreCard key={genre.slug} genre={genre} />
                ))}
              </div>
            </Section>
          )}

          {playlistHits.length > 0 && (
            <Section icon={ListMusic} title="Playlists">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {playlistHits.map((playlist) => (
                  <PlaylistCard key={playlist.slug} playlist={playlist} />
                ))}
              </div>
            </Section>
          )}
        </>
      )}
    </>
  );
}
