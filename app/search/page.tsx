import { Suspense } from "react";
import { getCatalog } from "@/lib/catalog";
import SearchResults from "./search-results";

export const metadata = { title: "Search — SONORA" };

export default async function SearchPage() {
  const { songs, artists, genres, playlists } = await getCatalog();
  return (
    <Suspense
      fallback={
        <div className="glass flex items-center justify-center rounded-[2rem] px-6 py-20 text-sm text-slate-400">
          Searching…
        </div>
      }
    >
      <SearchResults songs={songs} artists={artists} genres={genres} playlists={playlists} />
    </Suspense>
  );
}
