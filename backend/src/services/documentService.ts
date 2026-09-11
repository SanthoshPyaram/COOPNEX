import fs from "fs";
import path from "path";
import crypto from "crypto";
import mongoose from "mongoose";
import { StoredDocument } from "../models/StoredDocument";
import { Worker } from "../models/Worker";

const UPLOADS_ROOT = path.resolve(__dirname, "../../uploads");
const DOCUMENTS_DIR = path.join(UPLOADS_ROOT, "documents");
const AVATARS_DIR = path.join(UPLOADS_ROOT, "avatars");

// Ensure protected directories exist on module load
[UPLOADS_ROOT, DOCUMENTS_DIR, AVATARS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export interface StoredDocumentMeta {
  documentId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storedAt: Date;
  storageReference: string;
}

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg"
};



/**
 * Saves a document payload into protected storage (MongoDB Atlas + Local Disk Cache).
 */
export async function saveDocument(params: {
  rawContent: string | Buffer;
  originalName: string;
  mimeType?: string;
  isAvatar?: boolean;
  workerId?: string;
  documentType?: string;
}): Promise<StoredDocumentMeta> {
  const { rawContent, originalName, isAvatar, workerId, documentType } = params;
  let mimeType = params.mimeType || "application/octet-stream";
  let buffer: Buffer;

  if (typeof rawContent === "string") {
    if (rawContent.startsWith("data:")) {
      const match = rawContent.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        buffer = Buffer.from(match[2], "base64");
      } else {
        buffer = Buffer.from(rawContent, "utf-8");
      }
    } else {
      buffer = Buffer.from(rawContent, "base64");
    }
  } else {
    buffer = rawContent;
  }

  // Detect MIME type from buffer magic bytes if available
  if (buffer.length >= 4) {
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
      mimeType = "application/pdf";
    } else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      mimeType = "image/png";
    } else if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      mimeType = "image/jpeg";
    } else if (buffer.length >= 12 && buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP") {
      mimeType = "image/webp";
    }
  }

  if (mimeType === "application/octet-stream" || (mimeType === "application/pdf" && !buffer.subarray(0, 4).toString().startsWith("%PDF"))) {
    const extFromFilename = path.extname(originalName).replace(".", "").toLowerCase();
    if (extFromFilename === "pdf") mimeType = "application/pdf";
    else if (extFromFilename === "jpg" || extFromFilename === "jpeg") mimeType = "image/jpeg";
    else if (extFromFilename === "png") mimeType = "image/png";
    else if (extFromFilename === "webp") mimeType = "image/webp";
  }

  // Size limit check: max 10MB
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error("Document exceeds the maximum permissible limit of 10 MB.");
  }

  // Determine safe extension
  const ext = ALLOWED_MIME_TYPES[mimeType.toLowerCase()] ||
    path.extname(originalName).replace(".", "").toLowerCase() ||
    "bin";

  const documentId = `DOC-${crypto.randomUUID()}`;
  const filename = `${documentId}.${ext}`;
  const targetDir = isAvatar ? AVATARS_DIR : DOCUMENTS_DIR;
  const filePath = path.join(targetDir, filename);

  // 1. Write to local disk cache
  try {
    fs.writeFileSync(filePath, buffer);
  } catch (fsErr) {
    console.warn("Local disk write warning:", fsErr);
  }

  // 2. Persist permanently to MongoDB Atlas (survives container restarts)
  if (mongoose.connection.readyState === 1) {
    try {
      const base64Data = buffer.toString("base64");
      await StoredDocument.findOneAndUpdate(
        { documentId },
        {
          documentId,
          originalName: path.basename(originalName),
          mimeType,
          sizeBytes: buffer.length,
          data: `data:${mimeType};base64,${base64Data}`,
          isAvatar: Boolean(isAvatar),
          workerId,
          documentType
        },
        { upsert: true, new: true }
      );
    } catch (dbErr) {
      console.warn("Failed to persist document to MongoDB Atlas:", dbErr);
    }
  }

  const storageReference = isAvatar
    ? `/api/documents/avatar/${documentId}`
    : `/api/documents/${documentId}`;

  return {
    documentId,
    originalName: path.basename(originalName),
    mimeType,
    sizeBytes: buffer.length,
    storedAt: new Date(),
    storageReference
  };
}

export async function saveAvatar(params: {
  rawContent: string | Buffer;
  originalName: string;
  mimeType?: string;
  workerId?: string;
}): Promise<StoredDocumentMeta> {
  return saveDocument({ ...params, isAvatar: true });
}

/**
 * Finds and retrieves stored document data by documentId.
 * Checks local disk -> MongoDB StoredDocument -> Worker KYC raw data.
 * Strictly ignores legacy synthetic SVG cards so authentic uploads or "Original document unavailable" are returned.
 */
export async function getDocumentData(documentId: string): Promise<{
  buffer: Buffer;
  mimeType: string;
  filename: string;
} | null> {
  const sanitizedId = path.basename(documentId).trim();
  const baseId = sanitizedId.replace(/\.[a-zA-Z0-9]+$/, "");

  // 1. Try local disk cache
  const localFile = getDocumentFilePath(sanitizedId) || getDocumentFilePath(baseId);
  if (localFile && fs.existsSync(localFile.filePath)) {
    try {
      const buffer = fs.readFileSync(localFile.filePath);
      const isLegacySvg = localFile.mimeType === "image/svg+xml" || buffer.toString("utf8", 0, 120).includes("<svg");
      if (!isLegacySvg) {
        return {
          buffer,
          mimeType: localFile.mimeType,
          filename: path.basename(localFile.filePath)
        };
      } else {
        console.warn(`Ignoring synthetic SVG disk file for ${sanitizedId}`);
      }
    } catch (readErr) {
      console.warn("Disk read error, falling back to DB:", readErr);
    }
  }

  // 2. Query MongoDB StoredDocument collection
  if (mongoose.connection.readyState === 1) {
    try {
      const stored = await StoredDocument.findOne({
        $or: [{ documentId: sanitizedId }, { documentId: baseId }]
      });
      if (stored && stored.data) {
        let buffer: Buffer;
        if (stored.data.startsWith("data:")) {
          const parts = stored.data.split(",");
          buffer = Buffer.from(parts[1] || "", "base64");
        } else {
          buffer = Buffer.from(stored.data, "base64");
        }

        const isLegacySvg = stored.mimeType === "image/svg+xml" || buffer.toString("utf8", 0, 120).includes("<svg");
        if (!isLegacySvg) {
          // Re-populate local disk cache
          try {
            const ext = ALLOWED_MIME_TYPES[stored.mimeType.toLowerCase()] || "bin";
            const targetDir = stored.isAvatar ? AVATARS_DIR : DOCUMENTS_DIR;
            const filePath = path.join(targetDir, `${stored.documentId}.${ext}`);
            fs.writeFileSync(filePath, buffer);
          } catch (cacheErr) {
            // Non-fatal cache failure
          }

          return {
            buffer,
            mimeType: stored.mimeType || "application/octet-stream",
            filename: stored.originalName || `${stored.documentId}.bin`
          };
        } else {
          console.warn(`Ignoring synthetic SVG in StoredDocument for ${sanitizedId}`);
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB StoredDocument lookup error:", dbErr);
    }
  }

  // 3. Fallback: Check if real document binary is stored in Worker record in MongoDB
  if (mongoose.connection.readyState === 1) {
    try {
      const worker = await Worker.findOne({
        $or: [
          { "kycDocuments.fileUrl": { $regex: baseId } },
          { "kycDocuments.storageReference": { $regex: baseId } }
        ]
      });

      if (worker) {
        const doc = Array.isArray(worker.kycDocuments)
          ? worker.kycDocuments.find(
              (d) => d.fileUrl?.includes(baseId) || (d as any).storageReference?.includes(baseId)
            )
          : null;

        const rawFile = (doc as any)?.fileData || (doc as any)?.base64;
        if (rawFile && typeof rawFile === "string" && rawFile.length > 50) {
          let buffer: Buffer;
          let mime = doc?.mimeType || "application/octet-stream";
          if (rawFile.startsWith("data:")) {
            const parts = rawFile.split(",");
            mime = parts[0].replace("data:", "").split(";")[0];
            buffer = Buffer.from(parts[1] || "", "base64");
          } else {
            buffer = Buffer.from(rawFile, "base64");
          }

          const isLegacySvg = mime.includes("svg") || buffer.toString("utf8", 0, 120).includes("<svg");
          if (!isLegacySvg) {
            return {
              buffer,
              mimeType: mime,
              filename: doc?.originalFilename || `${sanitizedId}.bin`
            };
          }
        }
      }
    } catch (workerErr) {
      console.warn("Worker KYC raw data lookup error:", workerErr);
    }
  }

  // Document scan is truly unavailable; return null so API returns 404
  return null;
}

/**
 * Finds a stored document path on disk by documentId.
 * Prioritizes authentic binary formats over any legacy SVG files.
 */
export function getDocumentFilePath(documentId: string): { filePath: string; mimeType: string } | null {
  const sanitizedId = path.basename(documentId);

  for (const dir of [DOCUMENTS_DIR, AVATARS_DIR]) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    const matchingFiles = files.filter((f) => f.startsWith(sanitizedId));
    if (matchingFiles.length === 0) continue;

    // Prioritize non-svg files (png, jpg, jpeg, webp, pdf)
    const authenticFile = matchingFiles.find((f) => !f.endsWith(".svg")) || null;
    const chosenFile = authenticFile || matchingFiles[0];

    if (chosenFile) {
      const fullPath = path.join(dir, chosenFile);
      const ext = path.extname(chosenFile).replace(".", "").toLowerCase();
      let mime = "application/octet-stream";
      if (ext === "pdf") mime = "application/pdf";
      else if (ext === "jpg" || ext === "jpeg") mime = "image/jpeg";
      else if (ext === "png") mime = "image/png";
      else if (ext === "webp") mime = "image/webp";
      else if (ext === "svg") mime = "image/svg+xml";

      return { filePath: fullPath, mimeType: mime };
    }
  }

  return null;
}
