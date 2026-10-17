import { ListMusic } from "lucide-react";
import PageHeader from "@/components/page-header";
import { PlaylistCard } from "@/components/cards";
import YourPlaylists from "@/components/your-playlists";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "Playlists — SONORA" };

export default async function PlaylistsPage() {
  const { playlists } = await getCatalog();
  return (
    <>
      <PageHeader
        eyebrow="CURATED"
        title="Playlists"
        subtitle="Handcrafted collections for every mood, moment and all-nighter."
        icon={ListMusic}
      />

      <YourPlaylists />

      <section>
        <h2 className="mb-4 text-lg font-black">SONORA playlists</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.slug} playlist={playlist} />
          ))}
        </div>
      </section>
    </>
  );
}
