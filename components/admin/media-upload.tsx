"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { inputClass, labelClass } from "./form-controls";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

export default function MediaUpload({
  name,
  label,
  accept,
  defaultValue = "",
  hint,
}: {
  name: string;
  label: string;
  accept: string;
  defaultValue?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const configured = Boolean(CLOUD && PRESET);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!configured) {
      setError("Cloudinary is not configured — paste a URL instead.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("upload_preset", PRESET as string);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/auto/upload`, {
        method: "POST",
        body,
      });
      if (!res.ok) throw new Error(`Upload failed (HTTP ${res.status}).`);
      const data = (await res.json()) as { secure_url?: string };
      if (!data.secure_url) throw new Error("Upload did not return a URL.");
      setValue(data.secure_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://… or upload a file"
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy || !configured}
          title={configured ? undefined : "Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET"}
          className="btn-glass inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-200 disabled:opacity-50"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {busy ? "Uploading…" : "Upload"}
        </button>
        <input ref={fileRef} type="file" accept={accept} onChange={onFile} className="hidden" />
      </div>
      {value && <p className="mt-1 truncate text-[11px] text-slate-500">{value}</p>}
      {error ? (
        <p className="mt-1 text-[11px] font-semibold text-pink-400">{error}</p>
      ) : (
        hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>
      )}
    </div>
  );
}
