"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  Gauge,
  BellRing,
  Shield,
  Download,
  Check,
} from "lucide-react";
import PageHeader from "@/components/page-header";

const QUALITIES = ["Low", "Normal", "High", "Very High"];

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 py-3.5 text-left"
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        <span className="mt-0.5 block text-xs text-slate-400">{hint}</span>
      </span>
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-gradient-to-r from-violet-500 to-cyan-400" : "bg-white/[0.14]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? "left-[1.375rem]" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function Card({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Sparkles;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="clay rounded-[1.75rem] p-5 sm:p-7">
      <h2 className="mb-2 flex items-center gap-2.5 text-lg font-black">
        <span className="clay-accent flex h-9 w-9 items-center justify-center rounded-xl">
          <Icon size={18} />
        </span>
        {title}
      </h2>
      <div className="divide-y divide-white/[0.07]">{children}</div>
    </section>
  );
}

export default function SettingsPage() {
  const [autoplay, setAutoplay] = useState(true);
  const [crossfade, setCrossfade] = useState(false);
  const [gapless, setGapless] = useState(true);
  const [normalize, setNormalize] = useState(true);
  const [explicit, setExplicit] = useState(false);
  const [privateSession, setPrivateSession] = useState(false);
  const [releaseAlerts, setReleaseAlerts] = useState(true);
  const [recommendations, setRecommendations] = useState(true);
  const [quality, setQuality] = useState("High");

  return (
    <>
      <PageHeader
        eyebrow="PREFERENCES"
        title="Settings"
        subtitle="Tune SONORA to sound exactly the way you like it."
        icon={SlidersHorizontal}
      />

      <section className="glass glass-refract relative overflow-hidden rounded-[2rem] p-6 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="relative flex items-center gap-5">
          <span className="clay-accent flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-black">
            G
          </span>
          <div>
            <h2 className="text-xl font-black">Guest Listener</h2>
            <p className="mt-1 text-xs text-slate-400">Free plan · Unlimited AI playback</p>
          </div>
          <button className="btn-clay ml-auto shrink-0 rounded-2xl px-5 py-2.5 text-sm font-bold">
            Upgrade
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card icon={Gauge} title="Playback">
          <Toggle label="Autoplay" hint="Keep the music going with similar tracks" checked={autoplay} onChange={setAutoplay} />
          <Toggle label="Gapless playback" hint="Remove silence between tracks" checked={gapless} onChange={setGapless} />
          <Toggle label="Crossfade" hint="Blend the end of one track into the next" checked={crossfade} onChange={setCrossfade} />
        </Card>

        <Card icon={Sparkles} title="Audio quality">
          <div className="py-3.5">
            <span className="block text-sm font-semibold">Streaming quality</span>
            <span className="mt-0.5 block text-xs text-slate-400">Higher quality uses more data</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {QUALITIES.map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    quality === q
                      ? "bg-white text-slate-900"
                      : "glass text-slate-300 hover:bg-white/[0.12] hover:text-white"
                  }`}
                >
                  {quality === q && <Check size={13} />}
                  {q}
                </button>
              ))}
            </div>
          </div>
          <Toggle label="Normalize volume" hint="Keep every track at a consistent loudness" checked={normalize} onChange={setNormalize} />
        </Card>

        <Card icon={Shield} title="Content">
          <Toggle label="Filter explicit content" hint="Hide tracks marked explicit" checked={explicit} onChange={setExplicit} />
          <Toggle label="Private session" hint="Don't use your activity for recommendations" checked={privateSession} onChange={setPrivateSession} />
        </Card>

        <Card icon={BellRing} title="Notifications">
          <Toggle label="New release alerts" hint="Know the moment your artists drop" checked={releaseAlerts} onChange={setReleaseAlerts} />
          <Toggle label="AI recommendations" hint="Personalised picks, refreshed weekly" checked={recommendations} onChange={setRecommendations} />
          <div className="pt-3.5">
            <button className="btn-glass flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold">
              <Download size={15} /> Manage downloads
            </button>
          </div>
        </Card>
      </div>
    </>
  );
}
