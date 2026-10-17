import { getCatalog } from "@/lib/catalog";
import HomeView from "./home-view";

export const metadata = { title: "SONORA — AI Music" };

export default async function Home() {
  const { songs, genres, artists, playlists } = await getCatalog();
  return <HomeView songs={songs} genres={genres} artists={artists} playlists={playlists} />;
}
