import React from "react";
import { ShieldCheck, Award, CheckCircle, Info } from "lucide-react";

interface VerificationBadgeProps {
  level: number; // 1 to 5
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  level = 1,
  showText = true,
  size = "md"
}) => {
  const levelDetails: Record<number, { title: string; color: string; bg: string; border: string; desc: string }> = {
    1: {
      title: "Level 1: Identity Verified",
      color: "text-blue-700",
      bg: "bg-blue-50",
      border: "border-blue-200",
      desc: "Aadhaar e-KYC biometric identity verified"
    },
    2: {
      title: "Level 2: Co-op Member",
      color: "text-indigo-700",
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      desc: "Registered member of certified Labour Cooperative Society"
    },
    3: {
      title: "Level 3: Skill Verified",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      desc: "Trade assessment passed by cooperative technical jury"
    },
    4: {
      title: "Level 4: State Certified",
      color: "text-amber-800",
      bg: "bg-amber-50",
      border: "border-amber-300",
      desc: "NSDC / State Skill Development Council accredited"
    },
    5: {
      title: "Level 5: Master Craftsman",
      color: "text-purple-800",
      bg: "bg-purple-50",
      border: "border-purple-300",
      desc: "7+ years verified tenure, safety supervisor & master trainer"
    }
  };

  const info = levelDetails[level] || levelDetails[1];

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div
      className={`inline-flex items-center rounded-full font-semibold border shadow-xs transition hover:shadow-sm ${info.bg} ${info.color} ${info.border} ${sizeClasses[size]}`}
      title={info.desc}
    >
      <ShieldCheck className={`${iconSizes[size]} fill-current/10 text-current flex-shrink-0`} />
      {showText && <span>{info.title}</span>}
    </div>
  );
};

