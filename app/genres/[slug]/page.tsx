import Link from "next/link";
import { notFound } from "next/navigation";
import { Disc3 } from "lucide-react";
import PageHeader from "@/components/page-header";
import SongCard from "@/components/song-card";
import PlayAllButton from "@/components/play-all";
import { formatCount, genreBySlug, songsByGenre } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";

export async function generateStaticParams() {
  const { genres } = await getCatalog();
  return genres.map((genre) => ({ slug: genre.slug }));
}

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { songs: allSongs, genres } = await getCatalog();
  const genre = genreBySlug(genres, slug);
  if (!genre) notFound();

  const songs = songsByGenre(allSongs, genre.name);

  return (
    <>
      <PageHeader
        eyebrow="GENRE"
        title={genre.name}
        subtitle={`${genre.blurb} · ${formatCount(genre.count)} tracks in this universe.`}
        icon={Disc3}
      >
        <PlayAllButton songs={songs} />
      </PageHeader>

      <nav className="flex flex-wrap gap-2">
        {genres.map((g) => (
          <Link
            key={g.slug}
            href={`/genres/${g.slug}`}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
              g.slug === genre.slug
                ? "bg-white text-slate-900"
                : "glass text-slate-300 hover:bg-white/[0.12] hover:text-white"
            }`}
          >
            {g.name}
          </Link>
        ))}
      </nav>

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
