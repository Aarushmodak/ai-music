import { CalendarDays } from "lucide-react";
import PageHeader from "@/components/page-header";
import SongCard from "@/components/song-card";
import { newReleases } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "New Releases — SONORA" };

export default async function ReleasesPage() {
  const { songs: allSongs } = await getCatalog();
  const songs = newReleases(allSongs);
  return (
    <>
      <PageHeader
        eyebrow="FRESH DROPS"
        title="New Releases"
        subtitle="The latest AI-generated tracks, straight from the studio."
        icon={CalendarDays}
      />
      <section>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} queue={songs} />
          ))}
        </div>
      </section>
    </>
  );
}
