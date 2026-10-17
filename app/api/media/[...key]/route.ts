import { type NextRequest } from "next/server";
import { readUploadedMedia } from "@/lib/media-store";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params;
  const filename = Array.isArray(key) ? key[key.length - 1] : key;
  if (!filename) {
    return new Response("Not Found", { status: 404 });
  }

  const media = await readUploadedMedia(filename);
  if (!media) {
    return new Response("Not Found", { status: 404 });
  }

  const { buffer, contentType } = media;
  const total = buffer.byteLength;
  const rangeHeader = request.headers.get("range");

  const commonHeaders: Record<string, string> = {
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=31536000, immutable",
  };

  if (rangeHeader && rangeHeader.startsWith("bytes=")) {
    const parts = rangeHeader.replace(/bytes=/, "").split("-");
    const startStr = parts[0];
    const endStr = parts[1];

    const start = startStr ? parseInt(startStr, 10) : 0;
    const end = endStr ? Math.min(parseInt(endStr, 10), total - 1) : total - 1;

    if (Number.isNaN(start) || Number.isNaN(end) || start > end || start >= total) {
      return new Response(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${total}`,
        },
      });
    }

    const chunk = buffer.subarray(start, end + 1);
    return new Response(new Uint8Array(chunk), {
      status: 206,
      headers: {
        ...commonHeaders,
        "Content-Range": `bytes ${start}-${end}/${total}`,
        "Content-Length": String(chunk.byteLength),
      },
    });
  }

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      ...commonHeaders,
      "Content-Length": String(total),
    },
  });
}
