import React from "react";
import { User } from "lucide-react";
import { API_BASE } from "../../services/api";

interface AvatarPlaceholderProps {
  src?: string | null;
  name?: string;
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

  if (hasValidSrc && resolvedSrc) {
    return (
      <img
        src={resolvedSrc}
        alt={alt || name}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} ${roundedClass} object-cover border border-slate-200 dark:border-slate-700 shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${roundedClass} bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-600 dark:text-slate-300 flex flex-col items-center justify-center font-black border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs ${className}`}
      title={name || "Member Avatar"}
    >
      {initials ? (
        <span className="font-mono tracking-tighter leading-none">{initials}</span>
      ) : (
        <User className={`${iconSizes[size]} text-slate-400 dark:text-slate-500`} />
      )}
    </div>
  );
};
