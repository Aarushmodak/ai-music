import Link from "next/link";
import { Compass, Flame, Disc3, Headphones, ListMusic, ChevronRight } from "lucide-react";
import PageHeader from "@/components/page-header";
import SectionHeader from "@/components/section-header";
import SongCard from "@/components/song-card";
import { ArtistCard, GenreCard, PlaylistCard } from "@/components/cards";
import { trendingSongs } from "@/lib/data";
import { getCatalog } from "@/lib/catalog";

export const metadata = { title: "Explore — SONORA" };

export default async function ExplorePage() {
  const { songs, genres, artists, playlists } = await getCatalog();
  const trending = trendingSongs(songs);

  return (
    <>
      <PageHeader
        eyebrow="DISCOVER"
        title="Explore SONORA"
        subtitle="A hand-picked tour through AI originals, genres, virtual artists and curated playlists."
        icon={Compass}
      />

      <section>
        <SectionHeader
          icon={Flame}
          title="Top picks for you"
          subtitle="The most-played tracks across the platform right now"
          action={
            <Link href="/trending" className="hover-underline text-xs font-semibold text-blue-400 transition hover:text-violet-300">
              See all <ChevronRight className="ml-1 inline" size={14} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trending.slice(0, 8).map((song) => (
            <SongCard key={song.id} song={song} queue={trending} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          icon={Disc3}
          title="Browse by genre"
          subtitle="Twelve worlds of sound, each built by AI"
          action={
            <Link href="/genres" className="hover-underline text-xs font-semibold text-blue-400 transition hover:text-violet-300">
              All genres <ChevronRight className="ml-1 inline" size={14} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {genres.map((genre) => (
            <GenreCard key={genre.slug} genre={genre} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          icon={Headphones}
          title="Featured artists"
          subtitle="The virtual voices shaping the future of music"
          action={
            <Link href="/artists" className="hover-underline text-xs font-semibold text-blue-400 transition hover:text-violet-300">
              All artists <ChevronRight className="ml-1 inline" size={14} />
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {artists.slice(0, 6).map((artist) => (
            <ArtistCard key={artist.slug} artist={artist} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader
          icon={ListMusic}
          title="Curated playlists"
          subtitle="Handcrafted AI collections for every mood"
          action={
            <Link href="/playlists" className="hover-underline text-xs font-semibold text-blue-400 transition hover:text-violet-300">
              All playlists <ChevronRight className="ml-1 inline" size={14} />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.slice(0, 4).map((playlist) => (
            <PlaylistCard key={playlist.slug} playlist={playlist} />
          ))}
        </div>
      </section>
    </>
  );
}
