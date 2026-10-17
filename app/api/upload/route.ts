import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import {
  inferMimeType,
  saveUploadedMedia,
  saveUploadedMediaChunk,
} from "@/lib/media-store";

export async function POST(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in to the admin dashboard first." },
        { status: 401 },
      );
    }

    const uploadId = request.headers.get("x-upload-id");
    const chunkIndexHeader = request.headers.get("x-chunk-index");
    const totalChunksHeader = request.headers.get("x-total-chunks");

    // Handle chunked upload for large audio/image files
    if (uploadId && chunkIndexHeader !== null && totalChunksHeader !== null) {
      const chunkIndex = parseInt(chunkIndexHeader, 10);
      const totalChunks = parseInt(totalChunksHeader, 10);
      if (Number.isNaN(chunkIndex) || Number.isNaN(totalChunks) || totalChunks < 1) {
        return NextResponse.json({ error: "Invalid chunk headers." }, { status: 400 });
      }
      const originalName = decodeURIComponent(request.headers.get("x-file-name") || "upload.mp3");
      const mimeType = request.headers.get("x-file-type") || inferMimeType(originalName);
      const totalSize = parseInt(request.headers.get("x-file-size") || "0", 10) || undefined;
      const arrayBuffer = await request.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const res = await saveUploadedMediaChunk({
        uploadId,
        chunkIndex,
        totalChunks,
        buffer,
        originalName,
        providedType: mimeType,
        totalSize,
      });

      return NextResponse.json({
        ok: true,
        done: res.done,
        url: res.url,
        secure_url: res.url,
        filename: res.filename,
        contentType: res.contentType,
      });
    }

    // Standard single-request upload (multipart/form-data or raw binary)
    const contentTypeHeader = request.headers.get("content-type") || "";
    let buffer: Buffer;
    let originalName = "track.mp3";
    let mimeType = "application/octet-stream";

    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file");
      if (!file || !(file instanceof Blob)) {
        return NextResponse.json({ error: "No file provided in form data." }, { status: 400 });
      }
      originalName = file instanceof File && file.name ? file.name : "upload.mp3";
      mimeType = file.type || inferMimeType(originalName);
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      originalName = decodeURIComponent(request.headers.get("x-file-name") || "upload.mp3");
      mimeType = contentTypeHeader.split(";")[0]?.trim() || inferMimeType(originalName);
      const arrayBuffer = await request.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    if (buffer.byteLength === 0) {
      return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
    }

    const saved = await saveUploadedMedia(buffer, originalName, mimeType);
    return NextResponse.json({
      ok: true,
      done: true,
      url: saved.url,
      secure_url: saved.url,
      filename: saved.filename,
      contentType: saved.contentType,
      size: saved.size,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save uploaded file.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
