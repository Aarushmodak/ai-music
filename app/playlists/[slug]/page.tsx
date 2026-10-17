import { notFound } from "next/navigation";
import { ListMusic } from "lucide-react";
import SongRow from "@/components/song-row";
import PlayAllButton from "@/components/play-all";
import { formatPlays, imageUrl, playlistBySlug, playlistSongs } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";

export async function generateStaticParams() {
  const { playlists } = await getCatalog();
  return playlists.map((playlist) => ({ slug: playlist.slug }));
}

export default async function PlaylistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { songs: allSongs, playlists } = await getCatalog();
  const playlist = playlistBySlug(playlists, slug);
  if (!playlist) notFound();

  const songs = playlistSongs(allSongs, playlist);
  const totalPlays = songs.reduce((a, s) => a + s.plays, 0);
  const minutes = Math.round(
    songs.reduce((a, s) => {
      const [m, sec] = s.duration.split(":").map(Number);
      return a + m * 60 + sec;
    }, 0) / 60,
  );

  return (
    <>
      <section className="glass glass-refract relative overflow-hidden rounded-[2rem] p-6 sm:p-9">
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full blur-3xl"
          style={{ background: `${playlist.color}40` }}
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="clay overflow-hidden rounded-[1.6rem] p-1.5">
              <img
                src={imageUrl(playlist.image, 400)}
                alt={playlist.name}
                className="h-32 w-32 rounded-[1.25rem] object-cover sm:h-36 sm:w-36"
              />
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] text-violet-300">
                <ListMusic size={13} /> PLAYLIST
              </span>
              <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{playlist.name}</h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">{playlist.description}</p>
              <p className="mt-2 text-xs text-slate-400">
                {songs.length} tracks · {minutes} min · {formatPlays(totalPlays)} plays
              </p>
            </div>
          </div>
          <PlayAllButton songs={songs} />
        </div>
      </section>

      <section>
        <div className="clay rounded-[1.75rem] p-2 sm:p-3">
          <div className="space-y-1">
            {songs.map((song, i) => (
              <SongRow key={song.id} song={song} rank={i + 1} queue={songs} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
