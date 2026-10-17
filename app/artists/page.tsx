import { Headphones } from "lucide-react";
import PageHeader from "@/components/page-header";
import { ArtistCard } from "@/components/cards";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "AI Artists — SONORA" };

export default async function ArtistsPage() {
  const { artists } = await getCatalog();
  return (
    <>
      <PageHeader
        eyebrow="THE ROSTER"
        title="AI Artists"
        subtitle="Fourteen virtual artists, each with their own voice, story and signature sound."
        icon={Headphones}
      />
      <section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {artists.map((artist) => (
            <ArtistCard key={artist.slug} artist={artist} />
          ))}
        </div>
      </section>
    </>
  );
}
