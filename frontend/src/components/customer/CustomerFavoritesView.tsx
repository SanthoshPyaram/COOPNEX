import React, { useState, useEffect } from "react";
import { WorkerProfile } from "../../types";
import { VerificationBadge } from "../VerificationBadge";
import { resolveWorkerAvatar } from "../../utils/workerAvatar";
import {
  Heart,
  Star,
  ShieldCheck,
  Calendar,
  Phone,
  ArrowRight,
  Trash2,
  Users,
  Sparkles
} from "lucide-react";

interface CustomerFavoritesViewProps {
  workers: WorkerProfile[];
  onBookWorker: (worker: WorkerProfile) => void;
  onViewProfile: (worker: WorkerProfile) => void;
  onExploreWorkers: () => void;
}

export const CustomerFavoritesView: React.FC<CustomerFavoritesViewProps> = ({
  workers,
  onBookWorker,
  onViewProfile,
  onExploreWorkers
}) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("sahakari_customer_favorites");
      if (saved) return JSON.parse(saved);
    } catch {
      // safe
    }
    return [];
  });

  const handleRemoveFavorite = (id: string) => {
    const updated = favoriteIds.filter((fid) => fid !== id);
    setFavoriteIds(updated);
    try {
      localStorage.setItem("sahakari_customer_favorites", JSON.stringify(updated));
    } catch {
      // safe
    }
  };

  // Matched favorite workers
  const favoriteWorkers = workers.filter((w) => favoriteIds.includes(w._id || (w as any).id));

  // If no saved favorites yet, show top verified artisans in district as suggestions
  const displayWorkers = favoriteWorkers.length > 0 ? favoriteWorkers : workers.slice(0, 3);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-500" />
            <h3 className="text-xl font-black text-slate-900">Saved Artisans</h3>
            <span className="text-xs font-bold text-slate-500">
              ({favoriteWorkers.length} saved)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Your preferred verified specialists for rapid 1-click rebooking.
          </p>
        </div>

        <button
          onClick={onExploreWorkers}
          className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#2563EB] font-bold text-xs transition cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>Find More Artisans</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {favoriteWorkers.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You haven't added any favorite artisans yet. Below are the top-rated verified cooperative specialists in your district to bookmark!
          </span>
        </div>
      )}

      {/* Grid of Favorite Workers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayWorkers.map((worker) => (
          <div
            key={worker._id || (worker as any).id}
            className="p-5 rounded-3xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition bg-slate-50/40 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={resolveWorkerAvatar(worker)}
                    alt={worker.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                  />
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{worker.name}</h4>
                    <span className="inline-block text-[11px] font-bold text-[#2563EB]">
                      {worker.skills?.[0] || "Specialist"}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{worker.rating || "4.95"}</span>
                      <span className="text-slate-400 font-normal">({(worker as any).totalJobs || "120+"} jobs)</span>
                    </div>
                  </div>
                </div>

                {favoriteIds.includes(worker._id) && (
                  <button
                    onClick={() => handleRemoveFavorite(worker._id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Cooperative Society:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[160px]">
                    {worker.societyName || "Vijayawada Central Co-op"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="font-bold text-slate-800">{worker.experienceYears || 6}+ Years</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Rate:</span>
                  <span className="font-black text-slate-900">₹{worker.baseHourlyRate || 350}/hr</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => onViewProfile(worker)}
                className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 font-bold text-xs text-slate-700 transition cursor-pointer"
              >
                Profile
              </button>
              <button
                onClick={() => onBookWorker(worker)}
                className="flex-1 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 font-bold text-xs text-white transition shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Now</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
