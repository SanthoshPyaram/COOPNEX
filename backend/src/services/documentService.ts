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

  if (mimeType === "application/octet-stream") {
    const extFromFilename = path.extname(originalName).replace(".", "").toLowerCase();
    if (extFromFilename === "pdf") mimeType = "application/pdf";
    else if (extFromFilename === "jpg" || extFromFilename === "jpeg") mimeType = "image/jpeg";
    else if (extFromFilename === "png") mimeType = "image/png";
    else if (extFromFilename === "webp") mimeType = "image/webp";
    else if (extFromFilename === "svg") mimeType = "image/svg+xml";
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
 * Checks local disk -> MongoDB StoredDocument -> Worker KYC Document Fallback Generator.
 */
export async function getDocumentData(documentId: string): Promise<{
  buffer: Buffer;
  mimeType: string;
  filename: string;
} | null> {
  const sanitizedId = path.basename(documentId).trim();

  // 1. Try local disk cache
  const localFile = getDocumentFilePath(sanitizedId);
  if (localFile && fs.existsSync(localFile.filePath)) {
    try {
      const buffer = fs.readFileSync(localFile.filePath);
      return {
        buffer,
        mimeType: localFile.mimeType,
        filename: path.basename(localFile.filePath)
      };
    } catch (readErr) {
      console.warn("Disk read error, falling back to DB:", readErr);
    }
  }

  // 2. Query MongoDB StoredDocument collection
  if (mongoose.connection.readyState === 1) {
    try {
      const stored = await StoredDocument.findOne({ documentId: sanitizedId });
      if (stored && stored.data) {
        let buffer: Buffer;
        if (stored.data.startsWith("data:")) {
          const parts = stored.data.split(",");
          buffer = Buffer.from(parts[1] || "", "base64");
        } else {
          buffer = Buffer.from(stored.data, "base64");
        }

        // Re-populate local disk cache
        try {
          const ext = ALLOWED_MIME_TYPES[stored.mimeType.toLowerCase()] || "bin";
          const targetDir = stored.isAvatar ? AVATARS_DIR : DOCUMENTS_DIR;
          const filePath = path.join(targetDir, `${sanitizedId}.${ext}`);
          fs.writeFileSync(filePath, buffer);
        } catch (cacheErr) {
          // Non-fatal cache failure
        }

        return {
          buffer,
          mimeType: stored.mimeType || "application/octet-stream",
          filename: stored.originalName || `${sanitizedId}.bin`
        };
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
          { "kycDocuments.fileUrl": { $regex: sanitizedId } },
          { "kycDocuments.storageReference": { $regex: sanitizedId } }
        ]
      });

      if (worker) {
        const doc = Array.isArray(worker.kycDocuments)
          ? worker.kycDocuments.find(
              (d) => d.fileUrl?.includes(sanitizedId) || (d as any).storageReference?.includes(sanitizedId)
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

          return {
            buffer,
            mimeType: mime,
            filename: doc?.originalFilename || `${sanitizedId}.bin`
          };
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
 */
export function getDocumentFilePath(documentId: string): { filePath: string; mimeType: string } | null {
  const sanitizedId = path.basename(documentId);

  for (const dir of [DOCUMENTS_DIR, AVATARS_DIR]) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    const found = files.find((f) => f.startsWith(sanitizedId));
    if (found) {
      const fullPath = path.join(dir, found);
      const ext = path.extname(found).replace(".", "").toLowerCase();
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
