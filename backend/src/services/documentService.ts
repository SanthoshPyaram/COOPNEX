import fs from "fs";
import path from "path";
import crypto from "crypto";

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
  "image/webp": "webp"
};

/**
 * Saves a document payload (either Base64 string or Buffer) into the protected document directory.
 */
export async function saveDocument(params: {
  rawContent: string | Buffer;
  originalName: string;
  mimeType?: string;
  isAvatar?: boolean;
}): Promise<StoredDocumentMeta> {
  const { rawContent, originalName, isAvatar } = params;
  let mimeType = params.mimeType || "application/octet-stream";
  let buffer: Buffer;

  if (typeof rawContent === "string") {
    // Check if Data URI (e.g. data:image/jpeg;base64,...)
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

  fs.writeFileSync(filePath, buffer);

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
}): Promise<StoredDocumentMeta> {
  return saveDocument({ ...params, isAvatar: true });
}

/**
 * Finds and reads a stored document by documentId.
 */
export function getDocumentFilePath(documentId: string): { filePath: string; mimeType: string } | null {
  // Sanitize documentId to prevent directory traversal
  const sanitizedId = path.basename(documentId);

  // Check both documents and avatars directories
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

      return { filePath: fullPath, mimeType: mime };
    }
  }

  return null;
}
