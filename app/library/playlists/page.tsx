import { Library } from "lucide-react";
import PageHeader from "@/components/page-header";
import { PlaylistCard } from "@/components/cards";
import YourPlaylists from "@/components/your-playlists";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "Your Playlists — SONORA" };

export default async function LibraryPlaylistsPage() {
  const { playlists } = await getCatalog();
  return (
    <>
      <PageHeader
        eyebrow="YOUR LIBRARY"
        title="Your Playlists"
        subtitle="Playlists you create are saved on this device, plus the SONORA favourites."
        icon={Library}
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
