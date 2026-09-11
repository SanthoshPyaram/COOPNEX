import { API_BASE } from "../services/api";

export const MALE_WORKER_FALLBACK = "";
export const FEMALE_WORKER_FALLBACK = "";
export const NEUTRAL_WORKER_FALLBACK = "";

export interface WorkerAvatarInput {
  avatarUrl?: string | null;
  profileImage?: string | null;
  photoUrl?: string | null;
  gender?: string | null;
  name?: string | null;
}

export function isUploadedWorkerPhoto(url?: string | null): boolean {
  if (!url || typeof url !== "string") return false;
  const clean = url.trim();
  if (!clean) return false;

  if (clean.includes("unsplash.com")) {
    return false;
  }

  if (
    clean.startsWith("/api/documents/") ||
    clean.startsWith("DOC-") ||
    clean.startsWith("/DOC-") ||
    clean.startsWith("data:image/") ||
    clean.startsWith("blob:") ||
    clean.startsWith("/uploads/")
  ) {
    return true;
  }

  return clean.startsWith("http://") || clean.startsWith("https://");
}

export function resolveWorkerAvatar(worker?: WorkerAvatarInput | null): string {
  if (!worker) return "";

  const rawPhoto = worker.profileImage || worker.avatarUrl || worker.photoUrl;

  if (rawPhoto && isUploadedWorkerPhoto(rawPhoto)) {
    const clean = rawPhoto.trim();
    if (
      clean.startsWith("http://") ||
      clean.startsWith("https://") ||
      clean.startsWith("data:") ||
      clean.startsWith("blob:")
    ) {
      return clean;
    }
    const apiOrigin = API_BASE.replace(/\/api\/?$/, "");
    if (clean.startsWith("DOC-") || clean.startsWith("/DOC-")) {
      return `${apiOrigin}/api/documents/avatar/${clean.replace(/^\//, "")}`;
    }
    return `${apiOrigin}${clean.startsWith("/") ? "" : "/"}${clean}`;
  }

  return "";
}

