import React from "react";

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs animate-pulse space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-slate-100 rounded w-full" />
            <div className="h-3 bg-slate-100 rounded w-4/5" />
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-8 bg-slate-200 rounded-lg w-1/3" />
          </div>
        </div>
      ))}
    </>
  );
};

export const TableRowSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 4,
  cols = 5
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="animate-pulse border-b border-slate-100">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="py-4 px-4">
              <div className="h-3.5 bg-slate-200 rounded w-4/5" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

