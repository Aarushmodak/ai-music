"use client";

import { useRef, useState } from "react";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import { inputClass, labelClass } from "./form-controls";
import { formatTime } from "@/lib/format";

const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Serverless gateways (Netlify / Vercel) cap individual request bodies around 4.5–6 MB.
// By uploading in 2.5 MB chunks, tracks of any size (10 MB, 50 MB, WAV/FLAC, etc.)
// upload reliably without hitting HTTP 413 Payload Too Large errors.
const CHUNK_SIZE = 2.5 * 1024 * 1024;

function extractAudioDuration(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    if (!file.type.startsWith("audio/") && !/\.(mp3|wav|ogg|m4a|aac|flac|opus|webm)$/i.test(file.name)) {
      resolve(null);
      return;
    }
    const url = URL.createObjectURL(file);
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    const cleanup = () => {
      URL.revokeObjectURL(url);
      audio.removeAttribute("src");
    };
    const timer = window.setTimeout(() => {
      cleanup();
      resolve(null);
    }, 5000);
    audio.onloadedmetadata = () => {
      window.clearTimeout(timer);
      const dur = audio.duration;
      cleanup();
      if (Number.isFinite(dur) && dur > 0) {
        resolve(formatTime(dur));
      } else {
        resolve(null);
      }
    };
    audio.onerror = () => {
      window.clearTimeout(timer);
      cleanup();
      resolve(null);
    };
    audio.src = url;
  });
}

async function uploadToCloudinary(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const cloud = CLOUD?.trim();
  const preset = PRESET?.trim();
  if (!cloud || !preset) {
    throw new Error("Cloudinary is not configured.");
  }

  // Cloudinary requires /video/upload or /auto/upload for audio files.
  // For files > 10MB, Cloudinary standard upload supports up to 100MB for video/audio resource_type.
  const isAudio =
    file.type.startsWith("audio/") ||
    /\.(mp3|wav|ogg|m4a|aac|flac|opus|webm)$/i.test(file.name);
  const resourceType = isAudio ? "video" : "auto";

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloud}/${resourceType}/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      let data: { secure_url?: string; error?: { message?: string } } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // ignore JSON parse error
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.secure_url) {
        resolve(data.secure_url);
      } else {
        const msg = data?.error?.message ? `: ${data.error.message}` : "";
        reject(new Error(`Cloudinary HTTP ${xhr.status}${msg}`));
      }
    };

    xhr.onerror = () => reject(new Error("Network error while connecting to Cloudinary."));

    const body = new FormData();
    body.append("file", file);
    body.append("upload_preset", preset);
    xhr.send(body);
  });
}

async function uploadToPlatformServer(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  // If file is small (<= 3 MB), send in a single multipart request
  if (file.size <= 3 * 1024 * 1024) {
    onProgress?.(20);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body,
    });
    const data = (await res.json().catch(() => ({}))) as {
      url?: string;
      secure_url?: string;
      error?: string;
    };
    if (!res.ok) {
      const detail = data?.error ? `: ${data.error}` : "";
      throw new Error(`Upload failed (HTTP ${res.status})${detail}`);
    }
    const uploadedUrl = data.url || data.secure_url;
    if (!uploadedUrl) {
      throw new Error("Server upload did not return a URL.");
    }
    onProgress?.(100);
    return uploadedUrl;
  }

  // For larger files (> 3 MB), upload in chunks so serverless function payload limits are never exceeded
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
  const uploadId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  let finalUrl = "";

  for (let index = 0; index < totalChunks; index++) {
    const start = index * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const slice = file.slice(start, end);

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream",
        "X-Upload-Id": uploadId,
        "X-Chunk-Index": String(index),
        "X-Total-Chunks": String(totalChunks),
        "X-File-Name": encodeURIComponent(file.name),
        "X-File-Type": file.type || "application/octet-stream",
        "X-File-Size": String(file.size),
      },
      body: slice,
    });

    const data = (await res.json().catch(() => ({}))) as {
      url?: string;
      secure_url?: string;
      error?: string;
    };

    if (!res.ok) {
      const detail = data?.error ? `: ${data.error}` : "";
      throw new Error(`Upload failed on part ${index + 1}/${totalChunks} (HTTP ${res.status})${detail}`);
    }

    onProgress?.(Math.round(((index + 1) / totalChunks) * 100));

    if (data.url || data.secure_url) {
      finalUrl = (data.url || data.secure_url) as string;
    }
  }

  if (!finalUrl) {
    throw new Error("Chunked upload completed but did not return a URL.");
  }

  return finalUrl;
}

export default function MediaUpload({
  name,
  label,
  accept,
  defaultValue = "",
  hint,
  onUploaded,
  onAudioDuration,
}: {
  name: string;
  label: string;
  accept: string;
  defaultValue?: string;
  hint?: string;
  onUploaded?: (url: string, file: File) => void;
  onAudioDuration?: (duration: string, file: File) => void;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const hasCloudinary = Boolean(CLOUD?.trim() && PRESET?.trim());

  async function handleFile(file: File) {
    setBusy(true);
    setProgress(0);
    setError(null);
    setUploadedName(null);

    try {
      const durationPromise = onAudioDuration ? extractAudioDuration(file) : Promise.resolve(null);

      let uploadedUrl: string;
      if (hasCloudinary) {
        try {
          uploadedUrl = await uploadToCloudinary(file, setProgress);
        } catch {
          // Automatic fallback to built-in server/blob storage if Cloudinary rejects (e.g. HTTP 400/401/413)
          setProgress(0);
          uploadedUrl = await uploadToPlatformServer(file, setProgress);
        }
      } else {
        uploadedUrl = await uploadToPlatformServer(file, setProgress);
      }

      const detectedDuration = await durationPromise;
      setValue(uploadedUrl);
      setUploadedName(file.name);
      onUploaded?.(uploadedUrl, file);
      if (detectedDuration && onAudioDuration) {
        onAudioDuration(detectedDuration, file);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  }

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex gap-2">
        <input
          name={name}
          value={value}
          onChange={(event) => {
            setValue(event.target.value);
            setUploadedName(null);
          }}
          placeholder="https://… or click Upload to select a file"
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="btn-glass inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-200 transition hover:text-white disabled:opacity-50"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {busy ? (progress > 0 ? `Uploading ${progress}%` : "Uploading…") : "Upload"}
        </button>
        <input ref={fileRef} type="file" accept={accept} onChange={onFileChange} className="hidden" />
      </div>
      {uploadedName && !error && (
        <p className="mt-1 flex items-center gap-1.5 truncate text-[11px] font-medium text-emerald-400">
          <CheckCircle2 size={13} className="shrink-0" />
          Uploaded {uploadedName} ({value})
        </p>
      )}
      {!uploadedName && value && <p className="mt-1 truncate text-[11px] text-slate-500">{value}</p>}
      {error ? (
        <p className="mt-1 text-[11px] font-semibold text-pink-400">{error}</p>
      ) : (
        hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>
      )}
    </div>
  );
}
