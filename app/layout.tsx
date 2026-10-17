import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/app-shell";
import { getCatalog } from "@/lib/catalog";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SONORA — AI Music. Infinite Possibilities.",
  description: "Discover original songs, virtual artists and unforgettable soundscapes — all created with AI.",
};

export const instant = false;

const themeScript = `(function(){try{var t=localStorage.getItem("sonora.theme");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { songs } = await getCatalog();
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="app-root min-h-full overflow-x-hidden">
        <AppShell songs={songs}>{children}</AppShell>
      </body>
    </html>
  );
}
