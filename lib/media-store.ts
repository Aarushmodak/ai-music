import { promises as fs } from "fs";
import path from "path";

const MEDIA_STORE_NAME = process.env.SONORA_MEDIA_STORE || "sonora-media";
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

export type MediaMetadata = {
  contentType: string;
  size: number;
  originalName: string;
  uploadedAt: number;
  chunked?: boolean;
  totalChunks?: number;
};

type NetlifyBlobStore = {
  set: (
    key: string,
    data: ArrayBuffer | Blob | string,
    options?: { metadata?: Record<string, unknown> },
  ) => Promise<unknown>;
  delete?: (key: string) => Promise<unknown>;
  get: (key: string, options: { type: "arrayBuffer" }) => Promise<ArrayBuffer | null>;
  getWithMetadata: (
    key: string,
    options: { type: "arrayBuffer" },
  ) => Promise<{ data: ArrayBuffer; metadata: Record<string, unknown> } | null>;
};

async function getNetlifyMediaStore(): Promise<NetlifyBlobStore | null> {
  try {
    const { getStore } = await import("@netlify/blobs");
    return getStore({ name: MEDIA_STORE_NAME, consistency: "strong" }) as unknown as NetlifyBlobStore;
  } catch {
    return null;
  }
}

export function sanitizeFilename(name: string, fixedId?: string): string {
  const ext = path.extname(name).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin";
  const base = path
    .basename(name, path.extname(name))
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "track";
  const stamp =
    fixedId?.replace(/[^a-z0-9_-]/gi, "") ||
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  return `${base}-${stamp}${ext}`;
}

export function inferMimeType(filename: string, providedType?: string): string {
  if (providedType && providedType !== "application/octet-stream") {
    return providedType;
  }
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".m4a": "audio/mp4",
    ".aac": "audio/aac",
    ".flac": "audio/flac",
    ".opus": "audio/opus",
    ".webm": "audio/webm",
    ".mp4": "audio/mp4",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
  };
  return map[ext] || "application/octet-stream";
}

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
}

export async function saveUploadedMedia(
  buffer: Buffer,
  originalName: string,
  providedType?: string,
): Promise<{ url: string; filename: string; contentType: string; size: number }> {
  const filename = sanitizeFilename(originalName);
  const contentType = inferMimeType(originalName, providedType);
  const size = buffer.byteLength;
  const meta: MediaMetadata = {
    contentType,
    size,
    originalName,
    uploadedAt: Date.now(),
  };

  const store = await getNetlifyMediaStore();
  if (store) {
    try {
      await store.set(filename, toArrayBuffer(buffer), { metadata: meta });
      return {
        url: `/api/media/${encodeURIComponent(filename)}`,
        filename,
        contentType,
        size,
      };
    } catch {
      // Fall through to local filesystem if blob store fails
    }
  }

  await fs.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
  const filePath = path.join(LOCAL_UPLOADS_DIR, filename);
  await fs.writeFile(filePath, buffer);

  return {
    url: `/api/media/${encodeURIComponent(filename)}`,
    filename,
    contentType,
    size,
  };
}

export async function saveUploadedMediaChunk(params: {
  uploadId: string;
  chunkIndex: number;
  totalChunks: number;
  buffer: Buffer;
  originalName: string;
  providedType?: string;
  totalSize?: number;
}): Promise<{
  done: boolean;
  url?: string;
  filename: string;
  contentType: string;
}> {
  const { uploadId, chunkIndex, totalChunks, buffer, originalName, providedType } = params;
  const filename = sanitizeFilename(originalName, uploadId);
  const contentType = inferMimeType(originalName, providedType);
  const isFinal = chunkIndex >= totalChunks - 1;

  // Try Netlify Blobs first when running in Netlify runtime
  const store = await getNetlifyMediaStore();
  if (store) {
    try {
      const partKey = `${filename}.part.${chunkIndex}`;
      await store.set(partKey, toArrayBuffer(buffer));

      if (!isFinal) {
        return { done: false, filename, contentType };
      }

      // Assemble all parts on final chunk
      const parts: Buffer[] = [];
      for (let i = 0; i < totalChunks; i++) {
        const key = `${filename}.part.${i}`;
        const ab = i === chunkIndex ? toArrayBuffer(buffer) : await store.get(key, { type: "arrayBuffer" });
        if (!ab) {
          throw new Error(`Missing upload chunk ${i + 1} of ${totalChunks}.`);
        }
        parts.push(Buffer.from(ab));
      }

      const fullBuffer = Buffer.concat(parts);
      const meta: MediaMetadata = {
        contentType,
        size: fullBuffer.byteLength,
        originalName,
        uploadedAt: Date.now(),
      };
      await store.set(filename, toArrayBuffer(fullBuffer), { metadata: meta });

      // Clean up temporary part blobs in background
      for (let i = 0; i < totalChunks; i++) {
        const key = `${filename}.part.${i}`;
        await store.delete?.(key).catch(() => {});
      }

      return {
        done: true,
        url: `/api/media/${encodeURIComponent(filename)}`,
        filename,
        contentType,
      };
    } catch {
      // Fall through to local filesystem
    }
  }

  // Local filesystem chunk assembly
  await fs.mkdir(LOCAL_UPLOADS_DIR, { recursive: true });
  const tempPath = path.join(LOCAL_UPLOADS_DIR, `${filename}.uploading`);
  const finalPath = path.join(LOCAL_UPLOADS_DIR, filename);

  if (chunkIndex === 0) {
    await fs.writeFile(tempPath, buffer);
  } else {
    await fs.appendFile(tempPath, buffer);
  }

  if (!isFinal) {
    return { done: false, filename, contentType };
  }

  await fs.rename(tempPath, finalPath);
  return {
    done: true,
    url: `/api/media/${encodeURIComponent(filename)}`,
    filename,
    contentType,
  };
}

export async function readUploadedMedia(
  key: string,
): Promise<{ buffer: Buffer; contentType: string } | null> {
  const safeKey = path.basename(decodeURIComponent(key));
  if (!safeKey || safeKey.includes("..") || safeKey.includes("/") || safeKey.includes("\\")) {
    return null;
  }

  // 1. Check local filesystem first (fast in dev/VPS/node server)
  const localPath = path.join(LOCAL_UPLOADS_DIR, safeKey);
  try {
    const data = await fs.readFile(localPath);
    return {
      buffer: data,
      contentType: inferMimeType(safeKey),
    };
  } catch {
    // Not on local disk, check Netlify Blobs
  }

  // 2. Check Netlify Blobs
  const store = await getNetlifyMediaStore();
  if (store) {
    try {
      const entry = await store.getWithMetadata(safeKey, { type: "arrayBuffer" });
      if (entry && entry.data) {
        const contentType =
          typeof entry.metadata?.contentType === "string"
            ? entry.metadata.contentType
            : inferMimeType(safeKey);
        return {
          buffer: Buffer.from(entry.data),
          contentType,
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}
