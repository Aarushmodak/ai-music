import Link from "next/link";
import { ChevronRight, ListMusic } from "lucide-react";
import {
  artistFollowers,
  formatCount,
  imageUrl,
  type Artist,
  type Genre,
  type Playlist,
} from "@/lib/data";

export function GenreCard({ genre }: { genre: Genre }) {
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className="clay group hover-lift hover-glow relative h-32 overflow-hidden rounded-[1.7rem] text-left transition duration-300 sm:h-36"
    >
      <img
        src={imageUrl(genre.image)}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-500 group-hover:scale-110 group-hover:opacity-75"
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(100deg, ${genre.color}c0, transparent)` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      <div className="absolute bottom-3.5 left-4">
        <h3 className="text-base font-bold">{genre.name}</h3>
        <p className="mt-1 text-[10px] text-white/70">{formatCount(genre.count)} tracks</p>
      </div>
      <ChevronRight className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-100" size={18} />
    </Link>
  );
}

export function PlaylistCard({ playlist }: { playlist: Playlist }) {
  return (
    <Link
      href={`/playlists/${playlist.slug}`}
      className="clay group hover-lift hover-glow min-w-0 rounded-[1.7rem] p-3 transition duration-300 hover:border-violet-300/30"
    >
      <div className="relative aspect-square overflow-hidden rounded-[1.35rem]" style={{ background: playlist.color }}>
        <img
          src={imageUrl(playlist.image)}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
          <ListMusic size={12} /> {playlist.songIds.length} tracks
        </span>
      </div>
      <h3 className="mt-3.5 truncate px-1 text-sm font-bold">{playlist.name}</h3>
      <p className="mt-1 line-clamp-2 px-1 text-xs text-slate-400">{playlist.description}</p>
    </Link>
  );
}

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group flex flex-col items-center rounded-[1.6rem] px-2 py-4 transition hover:-translate-y-1 hover:bg-white/[0.06]"
    >
      <div className="clay mb-3 rounded-full p-1.5 transition group-hover:scale-105">
        <img
          src={imageUrl(artist.image, 300)}
          alt={artist.name}
          loading="lazy"
          className="h-20 w-20 rounded-full object-cover sm:h-24 sm:w-24"
          style={{ boxShadow: `0 0 0 3px ${artist.color}55` }}
        />
      </div>
      <h3 className="text-center text-xs font-bold sm:text-sm">{artist.name}</h3>
      <p className="mt-1 text-[10px] text-slate-500">{artistFollowers(artist.followers)} followers</p>
    </Link>
  );
}
