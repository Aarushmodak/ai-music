import { Disc3 } from "lucide-react";
import PageHeader from "@/components/page-header";
import { GenreCard } from "@/components/cards";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "Genres — SONORA" };

export default async function GenresPage() {
  const { genres } = await getCatalog();
  return (
    <>
      <PageHeader
        eyebrow="BROWSE"
        title="Genres"
        subtitle="Twelve worlds of AI-generated sound. Find the one that fits your mood."
        icon={Disc3}
      />
      <section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {genres.map((genre) => (
            <GenreCard key={genre.slug} genre={genre} />
          ))}
        </div>
      </section>
    </>
  );
}
