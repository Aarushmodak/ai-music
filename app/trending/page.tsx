import { Flame } from "lucide-react";
import PageHeader from "@/components/page-header";
import SongRow from "@/components/song-row";
import { formatPlays, trendingSongs } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "Trending — SONORA" };

export default async function TrendingPage() {
  const { songs: allSongs } = await getCatalog();
  const songs = trendingSongs(allSongs);
  const totalPlays = songs.reduce((sum, s) => sum + s.plays, 0);

  return (
    <>
      <PageHeader
        eyebrow="HOT RIGHT NOW"
        title="Trending"
        subtitle="The most-played AI originals this week. Updated continuously as the world listens."
        icon={Flame}
      />
      <section className="clay rounded-[1.75rem] p-2 sm:p-3">
        <div className="space-y-1">
          {songs.map((song, i) => (
            <SongRow key={song.id} song={song} queue={songs} rank={i + 1} />
          ))}
        </div>
      </section>
      <p className="text-center text-xs text-slate-500">
        {songs.length} tracks · {formatPlays(totalPlays)} total plays
      </p>
    </>
  );
}
