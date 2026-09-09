import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "default" | "full" | "narrow";
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = "",
  maxWidth = "default"
}) => {
  const maxWClass =
    maxWidth === "full"
      ? "max-w-full"
      : maxWidth === "narrow"
      ? "max-w-5xl"
      : "max-w-7xl";

  return (
    <div
      className={`w-full ${maxWClass} mx-auto px-4 sm:px-6 lg:px-8 py-6 min-w-0 overflow-x-hidden ${className}`}
    >
      {children}
    </div>
  );
};

