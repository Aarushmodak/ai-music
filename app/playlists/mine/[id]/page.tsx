import { Suspense } from "react";
import UserPlaylistView from "./view";

export const metadata = { title: "Your Playlist — SONORA" };
export const instant = false;

export default async function UserPlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="glass flex items-center justify-center rounded-[2rem] px-6 py-20 text-sm text-slate-400">
          Loading…
        </div>
      }
    >
      <UserPlaylistView id={id} />
    </Suspense>
  );
}
