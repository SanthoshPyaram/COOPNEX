import { API_BASE } from "../services/api";

export const MALE_WORKER_FALLBACK = "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80";
export const FEMALE_WORKER_FALLBACK = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80";
export const NEUTRAL_WORKER_FALLBACK = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80";

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

  if (clean.includes("photo-1540569014015-19a7be504e3a") || clean.includes("photo-1573496359142-b8d87734a5a2")) {
    return false;
  }

  return clean.startsWith("http://") || clean.startsWith("https://");
}

export function resolveWorkerAvatar(worker?: WorkerAvatarInput | null): string {
  if (!worker) return NEUTRAL_WORKER_FALLBACK;

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

  const normalizedGender = (worker.gender || "").trim().toUpperCase();

  if (normalizedGender === "FEMALE" || normalizedGender.startsWith("FEM")) {
    return FEMALE_WORKER_FALLBACK;
  }

  if (normalizedGender === "MALE" || normalizedGender === "MAN") {
    return MALE_WORKER_FALLBACK;
  }

  return NEUTRAL_WORKER_FALLBACK;
}
