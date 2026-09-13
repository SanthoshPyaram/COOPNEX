import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Booking } from "../../types";
import {
  Star,
  Camera,
  Video,
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
  Plus,
  Eye,
  X,
  Award,
  MessageSquare
} from "lucide-react";

interface CustomerReviewsViewProps {
  myBookings: Booking[];
  onOpenReviewModal: (booking: Booking) => void;
}

export const CustomerReviewsView: React.FC<CustomerReviewsViewProps> = ({
  myBookings,
  onOpenReviewModal
}) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<{ type: "IMAGE" | "VIDEO"; url: string } | null>(null);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await api.getMyReviews();
      if (res && res.success && Array.isArray(res.reviews)) {
        setReviews(res.reviews);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error("Failed to load customer reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  // Find completed bookings that haven't been reviewed yet
  const reviewedBookingIds = new Set(
    reviews.map((r) => (typeof r.bookingId === "string" ? r.bookingId : r.bookingId?._id))
  );

  const unreviewedCompletedBookings = myBookings.filter(
    (b) => b.status === "COMPLETED" && !reviewedBookingIds.has(b._id)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              My Service Reviews &amp; Work Proofs
            </h2>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              {reviews.length} Submitted
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ratings, feedback comments, and work completion photos &amp; videos submitted by you
          </p>
        </div>

        <button
          onClick={loadReviews}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Unreviewed Bookings Alert Callout */}
      {unreviewedCompletedBookings.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-200 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">
              Pending Reviews: {unreviewedCompletedBookings.length} Completed Service(s) Ready for Feedback
            </h3>
          </div>
          <p className="text-xs text-slate-600">
            Share your experience and attach photos or videos of the completed work. Your feedback unlocks quality bonus dividends for verified artisans.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {unreviewedCompletedBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <span className="font-bold text-xs text-slate-900 block">{b.serviceCategory}</span>
                  <span className="text-[11px] text-slate-500">
                    Worker: {b.workerName || "Cooperative Specialist"} • {b.bookingNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenReviewModal(b)}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>Rate &amp; Add Media</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center text-xs text-slate-500 border border-slate-200 space-y-2">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
          <p>Loading your reviews and media proofs...</p>
        </div>
      ) : reviews.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-100">
            <Star className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No Reviews Given Yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            You haven't submitted any reviews yet. Once your booked cooperative specialist completes a job, you can rate their craftsmanship, behavior, and upload completion photos and video demonstration proofs here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r) => {
            const worker = r.workerId || {};
            const booking = r.bookingId || {};
            const images: string[] = Array.isArray(r.workImages) ? r.workImages : [];
            const video: string = r.workVideo || "";

            return (
              <div
                key={r._id}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Worker & Rating Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black flex items-center justify-center text-base shadow-xs overflow-hidden shrink-0">
                        {worker.profilePhoto ? (
                          <img src={worker.profilePhoto} alt={worker.name} className="w-full h-full object-cover" />
                        ) : (
                          (worker.name || "Artisan").charAt(0)
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{worker.name || "Cooperative Specialist"}</h4>
                        <p className="text-xs text-slate-500">
                          {worker.primaryTrade || booking.serviceType || "Service"} • {booking.bookingNumber || "Completed Service"}
                        </p>
                      </div>
                    </div>

                    {/* Star Rating Badge */}
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-black text-xs text-amber-800 font-mono">
                        {Number(r.overallRating || r.rating || 5).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  {/* Rating Breakdown Pill */}
                  <div className="flex flex-wrap gap-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      Quality: <strong>{r.qualityScore || r.overallRating || 5}★</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      Punctuality: <strong>{r.punctualityScore || r.overallRating || 5}★</strong>
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      Behavior: <strong>{r.behaviourRating || r.professionalismScore || 5}★</strong>
                    </span>
                  </div>

                  {/* Written Comment */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <p className="text-slate-800 italic leading-relaxed">
                      "{r.comment || r.experienceComment || "Work completed with high skill and cooperative care."}"
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      Submitted: {r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" }) : "Recently"}
                    </span>
                  </div>

                  {/* Photos Proof Section */}
                  {images.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        <span>Work Photos ({images.length}):</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {images.map((imgUrl, imgIdx) => (
                          <div
                            key={imgIdx}
                            onClick={() => setSelectedMedia({ type: "IMAGE", url: imgUrl })}
                            className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 cursor-pointer group hover:opacity-90 transition"
                          >
                            <img src={imgUrl} alt={`Proof ${imgIdx + 1}`} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <Eye className="w-4 h-4 text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Video Proof Section */}
                  {video && (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-purple-700">
                        <Video className="w-3.5 h-3.5" />
                        <span>Work Video Proof:</span>
                      </div>
                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video">
                        <video controls className="w-full h-full object-cover">
                          <source src={video} type="video/mp4" />
                          Your browser does not support HTML5 video.
                        </video>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Permanent Cooperative Record</span>
                  </span>

                  {booking._id && (
                    <button
                      type="button"
                      onClick={() => onOpenReviewModal({
                        ...booking,
                        workerId: worker._id || booking.workerId,
                        workerName: worker.name
                      })}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold underline cursor-pointer"
                    >
                      Update Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enlarged Media Preview Modal */}
      {selectedMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-3xl overflow-hidden p-2">
            <button
              onClick={() => setSelectedMedia(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer transition"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2 flex items-center justify-center max-h-[80vh]">
              {selectedMedia.type === "IMAGE" ? (
                <img src={selectedMedia.url} alt="Enlarged proof" className="max-h-[75vh] w-auto object-contain rounded-2xl" />
              ) : (
                <video controls autoPlay className="w-full rounded-2xl max-h-[75vh]">
                  <source src={selectedMedia.url} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

