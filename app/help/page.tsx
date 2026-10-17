"use client";

import { useState } from "react";
import { Sparkles, Laptop, Download, Shield, Headphones, MessageCircle } from "lucide-react";
import PageHeader from "@/components/page-header";

const FAQS = [
  {
    q: "What is SONORA?",
    a: "SONORA is an AI-native music platform. Every track, artist and playlist in the catalog is generated or curated by machine-learning models, then polished for a studio-quality listen.",
  },
  {
    q: "How do I play a song?",
    a: "Tap any cover art or row to start playback instantly. The player at the bottom (mobile) or right (desktop) keeps the music going as you browse — playback never stops when you change pages.",
  },
  {
    q: "How do I like a song?",
    a: "Hit the heart icon on any track. Liked songs are saved to your library and available offline in the Liked Songs section.",
  },
  {
    q: "Can I build my own playlists?",
    a: "Yes. Head to Playlists and select Create playlist, then add any track from the catalog. Your collections live in the Library.",
  },
  {
    q: "Is my listening data private?",
    a: "Absolutely. Enable Private session in Settings to keep your activity out of recommendations. We never sell personal data.",
  },
  {
    q: "Which audio formats are supported?",
    a: "SONORA streams adaptive audio from Low up to Very High quality. Pick your preferred quality in Settings → Audio quality.",
  },
];

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-semibold">{q}</span>
        <span className={`transition ${open ? "rotate-180" : ""}`}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>
      {open && <p className="-mt-1 max-w-2xl pb-4 text-sm leading-6 text-slate-400">{a}</p>}
    </div>
  );
}

const TOPICS = [
  { icon: Sparkles, title: "Getting started", copy: "Learn the basics of browsing and playing AI music." },
  { icon: Laptop, title: "Keyboard shortcuts", copy: "Space to play, arrows to skip, and more." },
  { icon: Download, title: "Offline listening", copy: "Save tracks and playlists for when you're offline." },
  { icon: Shield, title: "Privacy & data", copy: "Control what SONORA remembers about you." },
];

export default function HelpPage() {
  return (
    <>
      <PageHeader
        eyebrow="SUPPORT"
        title="Help & Support"
        subtitle="Answers to common questions, plus ways to reach a human when you need one."
        icon={Headphones}
      />

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TOPICS.map((t) => (
          <div key={t.title} className="clay hover-lift rounded-[1.6rem] p-5 transition">
            <span className="clay-accent mb-4 flex h-11 w-11 items-center justify-center rounded-2xl">
              <t.icon size={20} />
            </span>
            <h3 className="text-sm font-bold">{t.title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-slate-400">{t.copy}</p>
          </div>
        ))}
      </section>

      <section className="clay rounded-[1.75rem] p-5 sm:p-8">
        <h2 className="mb-3 flex items-center gap-2.5 text-lg font-black">
          <span className="clay-accent flex h-9 w-9 items-center justify-center rounded-xl">
            <MessageCircle size={18} />
          </span>
          Frequently asked
        </h2>
        <div>
          {FAQS.map((f) => (
            <Faq key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </section>

      <section className="glass glass-refract relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-black">Still need a hand?</h2>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Our support team replies within a few hours, every day of the week.
            </p>
          </div>
          <button className="btn-clay shrink-0 rounded-2xl px-6 py-3 text-sm font-bold">
            Contact support
          </button>
        </div>
      </section>
    </>
  );
}
