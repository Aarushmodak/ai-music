import Link from "next/link";
import { notFound } from "next/navigation";
import { Music2 } from "lucide-react";
import SongCard from "@/components/song-card";
import PlayAllButton from "@/components/play-all";
import { PlaylistCard } from "@/components/cards";
import {
  artistBySlug,
  artistFollowers,
  formatPlays,
  genreSlug,
  imageUrl,
  songsByArtist,
} from "@/lib/data";
import { getCatalog } from "@/lib/catalog";

export async function generateStaticParams() {
  const { artists } = await getCatalog();
  return artists.map((artist) => ({ slug: artist.slug }));
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { songs: allSongs, artists, playlists } = await getCatalog();
  const artist = artistBySlug(artists, slug);
  if (!artist) notFound();

  const songs = songsByArtist(allSongs, artist.name);
  const totalPlays = songs.reduce((a, s) => a + s.plays, 0);
  const idSet = new Set(songs.map((s) => s.id));
  const featured = playlists.filter((p) => p.songIds.some((id) => idSet.has(id))).slice(0, 4);

  return (
    <>
      <section className="glass glass-refract relative overflow-hidden rounded-[2rem] p-6 sm:p-9">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl"
          style={{ background: `${artist.color}33` }}
        />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="clay rounded-full p-2">
              <img
                src={imageUrl(artist.image, 400)}
                alt={artist.name}
                className="h-28 w-28 rounded-full object-cover sm:h-32 sm:w-32"
                style={{ boxShadow: `0 0 0 4px ${artist.color}66` }}
              />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-[0.2em] text-violet-300">AI ARTIST</span>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{artist.name}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400">
                <Link
                  href={`/genres/${genreSlug(artist.genre)}`}
                  className="rounded-full bg-white/[0.08] px-3 py-1 font-semibold text-slate-200 transition hover:bg-white/[0.16]"
                >
                  {artist.genre}
                </Link>
                <span>{artistFollowers(artist.followers)} followers</span>
                <span>·</span>
                <span>{songs.length} tracks</span>
                <span>·</span>
                <span>{formatPlays(totalPlays)} plays</span>
              </div>
            </div>
          </div>
          <PlayAllButton songs={songs} />
        </div>
        <p className="relative mt-5 max-w-2xl text-sm leading-6 text-slate-300">{artist.bio}</p>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2.5 text-xl font-black">
          <Music2 size={20} className="text-violet-300" /> Songs
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-black">Featured in</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((playlist) => (
              <PlaylistCard key={playlist.slug} playlist={playlist} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
