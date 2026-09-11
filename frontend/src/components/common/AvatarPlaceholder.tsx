import React from "react";
import { User } from "lucide-react";
import { API_BASE } from "../../services/api";

interface AvatarPlaceholderProps {
  src?: string | null;
  name?: string;
  gender?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  shape?: "rounded" | "circle";
  alt?: string;
}

const sizeClasses = {
  xs: "w-7 h-7 text-[10px]",
  sm: "w-9 h-9 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-base",
  xl: "w-24 h-28 text-lg"
};

const iconSizes = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12"
};

export const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({
  src,
  name = "",
  gender,
  size = "md",
  className = "",
  shape = "rounded",
  alt = "User Avatar"
}) => {
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [src]);

  const resolvedSrc = React.useMemo(() => {
    if (!src || typeof src !== "string" || !src.trim()) return "";
    const clean = src.trim();
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
  }, [src]);

  // Check if src is valid and not a legacy generic unsplash placeholder
  const isUnsplashStock = typeof resolvedSrc === "string" && resolvedSrc.includes("images.unsplash.com/photo-");
  const hasValidSrc = Boolean(resolvedSrc && !imgError && !isUnsplashStock);

  const roundedClass = shape === "circle" ? "rounded-full" : "rounded-2xl";

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Deterministic color palette derived from worker's name or alt
  const palette = React.useMemo(() => {
    const palettes = [
      "bg-gradient-to-tr from-blue-600 to-indigo-700 text-white border-blue-500",
      "bg-gradient-to-tr from-emerald-600 to-teal-700 text-white border-emerald-500",
      "bg-gradient-to-tr from-amber-600 to-orange-700 text-white border-amber-500",
      "bg-gradient-to-tr from-purple-600 to-violet-700 text-white border-purple-500",
      "bg-gradient-to-tr from-cyan-600 to-blue-700 text-white border-cyan-500",
      "bg-gradient-to-tr from-teal-600 to-emerald-700 text-white border-teal-500",
      "bg-gradient-to-tr from-rose-600 to-pink-700 text-white border-rose-500",
      "bg-gradient-to-tr from-indigo-600 to-purple-700 text-white border-indigo-500"
    ];
    const key = (name || alt || "worker").trim();
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash << 5) - hash + key.charCodeAt(i);
    }
    return palettes[Math.abs(hash) % palettes.length];
  }, [name, alt]);

  const activeImageSrc = (hasValidSrc && resolvedSrc) ? resolvedSrc : null;

  if (activeImageSrc) {
    return (
      <img
        src={activeImageSrc}
        alt={alt || name}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} ${roundedClass} object-cover border border-slate-200 dark:border-slate-700 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${roundedClass} ${palette} flex flex-col items-center justify-center font-black border shrink-0 shadow-xs ${className}`}
      title={name || "Member Avatar"}
    >
      {initials ? (
        <span className="font-mono tracking-tighter leading-none">{initials}</span>
      ) : (
        <User className={`${iconSizes[size]} text-white/80`} />
      )}
    </div>
  );
};
