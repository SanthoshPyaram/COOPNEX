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
  skills?: string[] | null;
  trade?: string | null;
  avatar?: string | null;
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

  const rawPhoto = worker.profileImage || worker.avatarUrl || worker.photoUrl || worker.avatar;

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

/**
 * Curated high-resolution artisan photos specifically for the Home Page.
 * Purely frontend presentation to showcase verified cooperative workers
 * WITHOUT saving or storing anything into the database.
 */
export const HOME_PAGE_TRADE_PHOTOS: Record<string, { male: string; female: string; default: string }> = {
  electrician: {
    male: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
    female: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
    default: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
  },
  plumber: {
    male: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    female: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    default: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
  },
  carpenter: {
    male: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    female: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
    default: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
  },
  painter: {
    male: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
    female: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    default: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80"
  },
  cleaner: {
    male: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80",
    female: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    default: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"
  },
  caregiver: {
    male: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
    female: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80",
    default: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80"
  },
  driver: {
    male: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    female: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80",
    default: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80"
  },
  gardener: {
    male: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80",
    female: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    default: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80"
  },
  technician: {
    male: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80",
    female: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
    default: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80"
  },
  "domestic helper": {
    male: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&q=80",
    female: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
    default: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"
  }
};

export const DEFAULT_MALE_ARTISAN_PHOTO = "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&q=80";
export const DEFAULT_FEMALE_ARTISAN_PHOTO = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80";

export function getTradeFallbackPhoto(trade?: string | null, gender?: string | null, _name?: string | null): string {
  const normalizedTrade = (trade || "").toLowerCase().trim();
  const normalizedGender = (gender || "").toLowerCase().trim();

  for (const [key, mapping] of Object.entries(HOME_PAGE_TRADE_PHOTOS)) {
    if (normalizedTrade.includes(key) || key.includes(normalizedTrade)) {
      if (normalizedGender.startsWith("f") || normalizedGender === "female" || normalizedGender === "woman") {
        return mapping.female;
      }
      if (normalizedGender.startsWith("m") || normalizedGender === "male" || normalizedGender === "man") {
        return mapping.male;
      }
      return mapping.default;
    }
  }

  // If trade didn't match, return gender-based fallback
  if (normalizedGender.startsWith("f") || normalizedGender === "female") {
    return DEFAULT_FEMALE_ARTISAN_PHOTO;
  }
  return DEFAULT_MALE_ARTISAN_PHOTO;
}

/**
 * Foolproof SVG data URI fallback for onError handler when images fail to load
 */
export function getArtisanSvgFallback(name?: string, trade?: string): string {
  const initial = (name || "A").trim().charAt(0).toUpperCase() || "A";
  const label = (trade || "Artisan").slice(0, 12);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1E3A8A"/>
        <stop offset="100%" stop-color="#3B82F6"/>
      </linearGradient>
    </defs>
    <rect width="128" height="128" rx="20" fill="url(#g)"/>
    <text x="64" y="66" font-family="system-ui, -apple-system, sans-serif" font-size="44" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="central">${initial}</text>
    <rect x="14" y="96" width="100" height="20" rx="6" fill="#0f172a" fill-opacity="0.65"/>
    <text x="64" y="110" font-family="system-ui, -apple-system, sans-serif" font-size="10" font-weight="700" fill="#93c5fd" text-anchor="middle" dominant-baseline="central">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Resolves artisan photos strictly for the Home Page without writing to MongoDB.
 * 1. Checks if worker has an uploaded photo or valid image URL (including curated presentation URLs).
 * 2. If worker came from DB without a photo or has no photo, deterministically provides a trade/gender matched artisan photo.
 */
export function resolveHomePageWorkerAvatar(worker?: any): string {
  if (!worker) return DEFAULT_MALE_ARTISAN_PHOTO;

  const rawPhoto = worker.profileImage || worker.avatarUrl || worker.photoUrl || worker.avatar;

  if (rawPhoto && typeof rawPhoto === "string") {
    const clean = rawPhoto.trim();
    if (clean) {
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
  }

  // Deterministic trade and gender matched photo for Home Page presentation
  const trade = Array.isArray(worker.skills) && worker.skills.length > 0 ? worker.skills[0] : (worker.trade || "");
  return getTradeFallbackPhoto(trade, worker.gender, worker.name);
}
