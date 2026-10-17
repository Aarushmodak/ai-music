export type Song = {
  id: string;
  title: string;
  artist: string;
  genre: string;
  color: string;
  image: string;
  duration: string;
  audio: string;
  plays: number;
  year: number;
};

export type Artist = {
  slug: string;
  name: string;
  genre: string;
  followers: number;
  color: string;
  image: string;
  bio: string;
};

export type Genre = {
  slug: string;
  name: string;
  count: number;
  color: string;
  image: string;
  blurb: string;
};

export type Playlist = {
  slug: string;
  name: string;
  description: string;
  color: string;
  image: string;
  songIds: string[];
};

const COVERS = [
  "photo-1519608487953-e999c86e7455",
  "photo-1470252649378-9c29740c9fa8",
  "photo-1519681393784-d120267933ba",
  "photo-1470770841072-f978cf4d019e",
  "photo-1518837695005-2083093ee35b",
  "photo-1516280440614-37939bbacd81",
  "photo-1508700115892-45ecd05ae2ad",
  "photo-1507838153414-b4b713384a76",
];

const PORTRAITS = [
  "photo-1534528741775-53994a69daeb",
  "photo-1500648767791-00dcc994a43e",
  "photo-1531123897727-8f129e1688ce",
  "photo-1524504388940-b1c1722653e1",
  "photo-1506794778202-cad84cf45f1d",
  "photo-1508214751196-bcfd4ca60f91",
];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "item";

export const imageUrl = (id: string, w = 600) => {
  if (!id) return "";
  if (/^(https?:)?\/\//.test(id) || id.startsWith("/") || id.startsWith("data:")) return id;
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;
};

export const cover = (i: number) => COVERS[i % COVERS.length];
export const portrait = (i: number) => PORTRAITS[i % PORTRAITS.length];

export const seedGenres: Genre[] = [
  { slug: "pop", name: "Pop", count: 1420, color: "#812ee8", image: cover(0), blurb: "Bright hooks and unforgettable choruses, generated for the mainstream." },
  { slug: "electronic", name: "Electronic", count: 1180, color: "#087fc2", image: cover(1), blurb: "Synths, pulses and machine-built grooves from the bleeding edge." },
  { slug: "synthwave", name: "Synthwave", count: 860, color: "#4726a1", image: cover(2), blurb: "Retro-future neon and chrome-drenched nostalgia." },
  { slug: "ambient", name: "Ambient", count: 940, color: "#187fa0", image: cover(4), blurb: "Weightless textures for focus, sleep and everything between." },
  { slug: "rock", name: "Rock", count: 730, color: "#d34b39", image: cover(5), blurb: "Driven guitars and thunderous drums, synthesized with attitude." },
  { slug: "hip-hop", name: "Hip Hop", count: 610, color: "#a52dba", image: cover(6), blurb: "Hard-hitting beats and razor-sharp flows." },
  { slug: "classical", name: "Classical", count: 420, color: "#a87843", image: cover(7), blurb: "Orchestral movements reborn through generative composition." },
  { slug: "lo-fi", name: "Lo-Fi", count: 680, color: "#7c6f64", image: cover(3), blurb: "Dusty, warm and endlessly loopable study companions." },
  { slug: "jazz", name: "Jazz", count: 390, color: "#b7791f", image: cover(7), blurb: "Improvised, blue-note complexity from a tireless machine mind." },
  { slug: "r-and-b", name: "R&B", count: 520, color: "#c13e9c", image: cover(0), blurb: "Silky, slow-burning soul with modern production." },
  { slug: "house", name: "House", count: 770, color: "#2563eb", image: cover(1), blurb: "Four-on-the-floor euphoria built for the dancefloor." },
  { slug: "cinematic", name: "Cinematic", count: 310, color: "#8b5cf6", image: cover(2), blurb: "Sweeping, emotional scores for film and imagination." },
];

export const seedArtists: Artist[] = [
  { slug: "luna-phase", name: "Luna Phase", genre: "Electronic", followers: 842000, color: "#9c4ee8", image: portrait(0), bio: "Luna Phase fuses luminous synth design with pop sensibility, mapping the emotional spectrum of machines." },
  { slug: "solar-tides", name: "Solar Tides", genre: "Synthwave", followers: 620000, color: "#2089c9", image: portrait(1), bio: "Solar Tides builds warm, analog-flavoured synthwave inspired by endless summer highways." },
  { slug: "velvet-echoes", name: "Velvet Echoes", genre: "Pop", followers: 498000, color: "#c13e9c", image: portrait(2), bio: "Velvet Echoes writes velvet-smooth pop hooks that linger long after the last note." },
  { slug: "eclipse-heart", name: "Eclipse Heart", genre: "Pop", followers: 412000, color: "#d58d54", image: portrait(3), bio: "Eclipse Heart crafts bittersweet anthems about love, loss and glowing horizons." },
  { slug: "aether-mind", name: "Aether Mind", genre: "Ambient", followers: 356000, color: "#178da7", image: portrait(4), bio: "Aether Mind composes vast, meditative soundscapes for deep focus and rest." },
  { slug: "nova-iris", name: "Nova Iris", genre: "Rock", followers: 301000, color: "#b53c63", image: portrait(5), bio: "Nova Iris merges stadium-sized riffs with a neon-soaked futuristic sheen." },
  { slug: "pulse-riot", name: "Pulse Riot", genre: "Electronic", followers: 289000, color: "#7c3aed", image: portrait(0), bio: "Pulse Riot delivers relentless electronic energy built for the floor." },
  { slug: "sage-hollow", name: "Sage Hollow", genre: "Classical", followers: 274000, color: "#a87843", image: portrait(1), bio: "Sage Hollow writes patient, ornate chamber pieces for a synthetic orchestra." },
  { slug: "kairo-waves", name: "Kairo Waves", genre: "Synthwave", followers: 241000, color: "#2563eb", image: portrait(2), bio: "Kairo Waves rides retro arpeggios into neon-drenched horizons." },
  { slug: "mono-lith", name: "Mono Lith", genre: "Hip Hop", followers: 228000, color: "#a52dba", image: portrait(3), bio: "Mono Lith pairs concrete-heavy beats with sharp, minimalist wordplay." },
  { slug: "lunar-vale", name: "Lunar Vale", genre: "Ambient", followers: 198000, color: "#0e7490", image: portrait(4), bio: "Lunar Vale drifts through glacial pads and slow-burning drones." },
  { slug: "echo-siren", name: "Echo Siren", genre: "Pop", followers: 176000, color: "#db2777", image: portrait(5), bio: "Echo Siren blends airy vocals with crystalline electronic production." },
  { slug: "cobalt-heart", name: "Cobalt Heart", genre: "Rock", followers: 152000, color: "#dc2626", image: portrait(1), bio: "Cobalt Heart writes stadium choruses with grit and chrome." },
  { slug: "nimbus-9", name: "Nimbus 9", genre: "Cinematic", followers: 132000, color: "#8b5cf6", image: portrait(3), bio: "Nimbus 9 composes widescreen scores for imagined futures." },
];

export const seedSongs: Song[] = [
  { id: "neon-dreams", title: "Neon Dreams", artist: "Luna Phase", genre: "Electronic", color: "#5528a5", image: cover(0), duration: "3:42", audio: "/music/song1.mp3", plays: 2140000, year: 2026 },
  { id: "broken-angels", title: "Broken Angels", artist: "Velvet Echoes", genre: "Pop", color: "#b34476", image: cover(1), duration: "3:18", audio: "/music/song2.mp3", plays: 1820000, year: 2025 },
  { id: "midnight-drive", title: "Midnight Drive", artist: "Solar Tides", genre: "Synthwave", color: "#4726a1", image: cover(2), duration: "4:06", audio: "/music/song3.mp3", plays: 3050000, year: 2026 },
  { id: "lost-in-your-eyes", title: "Lost in Your Eyes", artist: "Eclipse Heart", genre: "Pop", color: "#a9573d", image: cover(3), duration: "3:51", audio: "/music/song4.mp3", plays: 1460000, year: 2025 },
  { id: "ocean-of-thoughts", title: "Ocean of Thoughts", artist: "Aether Mind", genre: "Ambient", color: "#176d9b", image: cover(4), duration: "5:12", audio: "/music/song5.mp3", plays: 980000, year: 2024 },
  { id: "fire-within", title: "Fire Within", artist: "Nova Iris", genre: "Rock", color: "#b34418", image: cover(5), duration: "3:36", audio: "/music/song1.mp3", plays: 1320000, year: 2025 },
  { id: "glass-horizon", title: "Glass Horizon", artist: "Pulse Riot", genre: "Electronic", color: "#6d28d9", image: cover(6), duration: "3:28", audio: "/music/song2.mp3", plays: 1980000, year: 2026 },
  { id: "velvet-skies", title: "Velvet Skies", artist: "Velvet Echoes", genre: "Pop", color: "#c13e9c", image: cover(7), duration: "3:12", audio: "/music/song3.mp3", plays: 1240000, year: 2026 },
  { id: "parallax", title: "Parallax", artist: "Kairo Waves", genre: "Synthwave", color: "#2563eb", image: cover(0), duration: "4:22", audio: "/music/song4.mp3", plays: 1690000, year: 2025 },
  { id: "deep-current", title: "Deep Current", artist: "Lunar Vale", genre: "Ambient", color: "#0e7490", image: cover(1), duration: "5:48", audio: "/music/song5.mp3", plays: 720000, year: 2024 },
  { id: "concrete-poetry", title: "Concrete Poetry", artist: "Mono Lith", genre: "Hip Hop", color: "#a52dba", image: cover(2), duration: "3:05", audio: "/music/song1.mp3", plays: 1540000, year: 2026 },
  { id: "gilded-halls", title: "Gilded Halls", artist: "Sage Hollow", genre: "Classical", color: "#a87843", image: cover(3), duration: "4:47", audio: "/music/song2.mp3", plays: 640000, year: 2024 },
  { id: "electric-bloom", title: "Electric Bloom", artist: "Luna Phase", genre: "Electronic", color: "#8b5cf6", image: cover(4), duration: "3:33", audio: "/music/song3.mp3", plays: 2310000, year: 2026 },
  { id: "crimson-static", title: "Crimson Static", artist: "Cobalt Heart", genre: "Rock", color: "#dc2626", image: cover(5), duration: "3:58", audio: "/music/song4.mp3", plays: 1110000, year: 2025 },
  { id: "night-bloom", title: "Night Bloom", artist: "Echo Siren", genre: "Pop", color: "#db2777", image: cover(6), duration: "3:24", audio: "/music/song5.mp3", plays: 1380000, year: 2026 },
  { id: "astral-tides", title: "Astral Tides", artist: "Nimbus 9", genre: "Cinematic", color: "#7c3aed", image: cover(7), duration: "4:58", audio: "/music/song1.mp3", plays: 890000, year: 2025 },
  { id: "harvest-moon", title: "Harvest Moon", artist: "Sage Hollow", genre: "Classical", color: "#b7791f", image: cover(0), duration: "4:31", audio: "/music/song2.mp3", plays: 560000, year: 2026 },
  { id: "undertow", title: "Undertow", artist: "Aether Mind", genre: "Ambient", color: "#0f766e", image: cover(1), duration: "6:02", audio: "/music/song3.mp3", plays: 610000, year: 2025 },
  { id: "paper-planes", title: "Paper Planes", artist: "Eclipse Heart", genre: "Pop", color: "#d58d54", image: cover(2), duration: "3:16", audio: "/music/song4.mp3", plays: 1270000, year: 2026 },
  { id: "voltage", title: "Voltage", artist: "Pulse Riot", genre: "House", color: "#4338ca", image: cover(3), duration: "3:44", audio: "/music/song5.mp3", plays: 1760000, year: 2026 },
  { id: "slow-motion", title: "Slow Motion", artist: "Echo Siren", genre: "R&B", color: "#be185d", image: cover(4), duration: "3:39", audio: "/music/song1.mp3", plays: 1050000, year: 2025 },
  { id: "afterglow", title: "Afterglow", artist: "Luna Phase", genre: "House", color: "#2563eb", image: cover(5), duration: "4:11", audio: "/music/song2.mp3", plays: 1890000, year: 2026 },
  { id: "dust-and-rain", title: "Dust and Rain", artist: "Lunar Vale", genre: "Lo-Fi", color: "#78716c", image: cover(6), duration: "3:02", audio: "/music/song3.mp3", plays: 830000, year: 2025 },
  { id: "iron-tide", title: "Iron Tide", artist: "Nova Iris", genre: "Rock", color: "#b45309", image: cover(7), duration: "4:02", audio: "/music/song4.mp3", plays: 940000, year: 2026 },
];

export const seedPlaylists: Playlist[] = [
  { slug: "synthwave-sunset", name: "Synthwave Sunset", description: "Neon-drenched retro futures for golden-hour drives.", color: "#a21caf", image: cover(2), songIds: ["midnight-drive", "parallax", "neon-dreams", "glass-horizon", "electric-bloom"] },
  { slug: "midnight-focus", name: "Midnight Focus", description: "Deep ambient and cinematic textures for late-night work.", color: "#0e7490", image: cover(4), songIds: ["ocean-of-thoughts", "deep-current", "undertow", "gilded-halls", "astral-tides"] },
  { slug: "neon-workout", name: "Neon Workout", description: "High-voltage energy to power every rep.", color: "#7c3aed", image: cover(6), songIds: ["glass-horizon", "fire-within", "electric-bloom", "voltage", "iron-tide"] },
  { slug: "dream-pop", name: "Dream Pop", description: "Soft, hazy pop for drifting off.", color: "#db2777", image: cover(0), songIds: ["broken-angels", "lost-in-your-eyes", "velvet-skies", "night-bloom", "paper-planes"] },
  { slug: "rock-rebellion", name: "Rock Rebellion", description: "Turn it up and break the rules.", color: "#dc2626", image: cover(5), songIds: ["fire-within", "crimson-static", "iron-tide", "concrete-poetry"] },
  { slug: "cinematic-worlds", name: "Cinematic Worlds", description: "Sweeping scores that feel like entire universes.", color: "#8b5cf6", image: cover(2), songIds: ["astral-tides", "gilded-halls", "harvest-moon", "ocean-of-thoughts", "deep-current"] },
  { slug: "synth-city", name: "Synth City", description: "A nocturnal tour through a machine-built metropolis.", color: "#2563eb", image: cover(1), songIds: ["parallax", "midnight-drive", "neon-dreams", "afterglow", "glass-horizon"] },
  { slug: "feel-good-pop", name: "Feel-Good Pop", description: "Bright, buoyant pop to lift any mood.", color: "#c13e9c", image: cover(3), songIds: ["paper-planes", "velvet-skies", "night-bloom", "broken-angels", "afterglow"] },
  { slug: "low-key-lofi", name: "Low-Key Lo-Fi", description: "Warm, dusty loops for studying and unwinding.", color: "#78716c", image: cover(6), songIds: ["dust-and-rain", "undertow", "deep-current", "harvest-moon", "ocean-of-thoughts"] },
  { slug: "soul-and-rb", name: "Soul & R&B", description: "Silky slow-burners with modern production.", color: "#be185d", image: cover(4), songIds: ["slow-motion", "velvet-skies", "lost-in-your-eyes", "night-bloom"] },
];

const GENRE_SLUGS = new Map(seedGenres.map((g) => [g.name, g.slug]));

export const genreSlug = (name: string) => GENRE_SLUGS.get(name) ?? slugify(name);

export const genreBySlug = (genres: Genre[], slug: string) => genres.find((g) => g.slug === slug);
export const artistBySlug = (artists: Artist[], slug: string) => artists.find((a) => a.slug === slug);
export const playlistBySlug = (playlists: Playlist[], slug: string) => playlists.find((p) => p.slug === slug);
export const songById = (songs: Song[], id: string) => songs.find((s) => s.id === id);

export const songsByGenre = (songs: Song[], name: string) => songs.filter((s) => s.genre === name);
export const songsByArtist = (songs: Song[], name: string) => songs.filter((s) => s.artist === name);
export const playlistSongs = (songs: Song[], p: Playlist) =>
  p.songIds.map((id) => songById(songs, id)).filter((s): s is Song => Boolean(s));
export const artistFollowers = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
};
export const formatCount = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return `${n}`;
};
export const formatPlays = (n: number) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${Math.round(n / 1000)}K`;
  return `${n}`;
};

export const trendingSongs = (songs: Song[]) => [...songs].sort((a, b) => b.plays - a.plays);
export const newReleases = (songs: Song[]) =>
  [...songs].sort((a, b) => b.year - a.year || b.plays - a.plays);
export const topCharts = (songs: Song[]) => [...songs].sort((a, b) => b.plays - a.plays);
