import { BarChart3 } from "lucide-react";
import PageHeader from "@/components/page-header";
import SongRow from "@/components/song-row";
import { formatPlays, topCharts } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "Top Charts — SONORA" };

export default async function ChartsPage() {
  const { songs: allSongs } = await getCatalog();
  const songs = topCharts(allSongs);
  return (
    <>
      <PageHeader
        eyebrow="CHARTS"
        title="Top Charts"
        subtitle="The definitive ranking of AI music, updated daily by plays and likes."
        icon={BarChart3}
      />
      <section>
        <div className="clay rounded-[1.75rem] p-2 sm:p-3">
          <div className="space-y-1">
            {songs.map((song, i) => (
              <SongRow key={song.id} song={song} queue={songs} rank={i + 1} />
            ))}
          </div>
        </div>
      </section>
      <p className="text-center text-xs text-slate-500">
        {songs.length} charting tracks · {formatPlays(songs.reduce((a, s) => a + s.plays, 0))} combined plays
      </p>
    </>
  );
}
