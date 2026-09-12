import React, { useState } from "react";
import { WorkerProfile, Booking } from "../types";
import { api } from "../services/api";
import { resolveWorkerAvatar } from "../utils/workerAvatar";
import { FormField } from "./common/FormField";
import { validateRequired, validateMinLength } from "../utils/validation";
import {
  X,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  Zap,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface CustomerBookingModalProps {
  worker: WorkerProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingCreated: (booking: Booking) => void;
  customerAddressDefault?: string;
}

export const CustomerBookingModal: React.FC<CustomerBookingModalProps> = ({
  worker,
  isOpen,
  onClose,
  onBookingCreated,
  customerAddressDefault = "Flat 402, Sri Sai Residency, Near Benz Circle, Vijayawada"
}) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Form State
  const [serviceCategory, setServiceCategory] = useState(worker?.skills?.[0] || "Electrician");
  const [description, setDescription] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  const [timeSlot, setTimeSlot] = useState("Today Morning (9:00 AM - 12:00 PM)");
  const [address, setAddress] = useState(customerAddressDefault);
  const [landmark, setLandmark] = useState("Near Benz Circle");
  const [createdBooking, setCreatedBooking] = useState<any | null>(null);

  // Validation State
  const [descError, setDescError] = useState<string | null>(null);
  const [descTouched, setDescTouched] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [addressTouched, setAddressTouched] = useState(false);
  const [landmarkError, setLandmarkError] = useState<string | null>(null);
  const [landmarkTouched, setLandmarkTouched] = useState(false);

  React.useEffect(() => {
    if (worker?.skills?.[0]) {
      setServiceCategory(worker.skills[0]);
    }
  }, [worker]);

  if (!isOpen || !worker) return null;

  // Pricing calculations
  const baseRate = worker.baseHourlyRate || 350;
  const rateMultiplier = isEmergency ? 1.35 : 1.0;
  const hourlyRate = Math.round(baseRate * rateMultiplier);
  const estimatedHours = 1;
  const totalAmount = hourlyRate * estimatedHours;

  const handleNextStep = () => {
    if (step === 1) {
      setDescTouched(true);
      const descRes = validateMinLength(description, 5, "Requirement description", "📝");
      if (!descRes.isValid) {
        setDescError(descRes.error || null);
        return;
      }
      setDescError(null);
    }
    if (step === 3) {
      setAddressTouched(true);
      setLandmarkTouched(true);
      const addrRes = validateRequired(address, "Service address", "🏠");
      const lmRes = validateRequired(landmark, "Nearest landmark", "📍");
      let hasErr = false;
      if (!addrRes.isValid) {
        setAddressError(addrRes.error || null);
        hasErr = true;
      } else {
        setAddressError(null);
      }
      if (!lmRes.isValid) {
        setLandmarkError(lmRes.error || null);
        hasErr = true;
      } else {
        setLandmarkError(null);
      }
      if (hasErr) return;
    }
    setErrorMsg("");
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setErrorMsg("");
    if (step === 1) {
      onClose();
    } else {
      setStep((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const payload = {
        serviceCategory,
        requirementDescription: description.trim() || `Scheduled ${serviceCategory} maintenance`,
        serviceLocation: {
          address: `${address} (Landmark: ${landmark})`,
          coordinates: worker.location?.coordinates || [80.6480, 16.5062]
        },
        workerId: worker._id,
        bookingType: isEmergency ? "EMERGENCY" : "STANDARD"
      };

      const res = await api.createBooking(payload);
      if (res.success && res.booking) {
        setCreatedBooking(res.booking);
        setStep(5); // Success step
        onBookingCreated(res.booking);
      } else {
        setErrorMsg(res.message || "Could not complete booking. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Network error connecting to booking service. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full my-6 shadow-2xl border border-slate-200 overflow-hidden text-slate-900 font-sans">
        {/* Header with Back Button */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#172554] via-[#1E3A8A] to-[#312E81] text-white flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition cursor-pointer border border-white/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{step === 1 ? "Cancel & Back" : "Back"}</span>
          </button>

          <div className="text-center">
            <h3 className="font-bold text-sm text-white">Book Specialist</h3>
            <span className="text-[10px] text-[#F59E0B] font-mono">
              {step <= 4 ? `Step ${step} of 4` : "Booking Confirmed"}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progression Bar */}
        {step <= 4 && (
          <div className="w-full bg-slate-100 h-1.5 flex">
            <div
              className="bg-[#2563EB] h-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        )}

        {/* Step Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Service Requirement & Urgency */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <img
                  src={resolveWorkerAvatar(worker)}
                  alt={worker.name}
                  className="w-12 h-12 rounded-xl object-cover border border-blue-200 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{worker.name}</h4>
                  <p className="text-slate-500 text-[11px]">
                    {worker.skills?.[0] || "Specialist"} • {worker.societyName || "Vijayawada Central Cooperative"}
                  </p>
                  <span className="text-emerald-700 font-bold text-[10px]">
                    ★ {worker.rating || 4.9} ({worker.reviewCount || 94} ratings)
                  </span>
                </div>
              </div>

              <FormField
                id="booking-description"
                label="Describe Your Issue or Requirement"
                error={descError}
                touched={descTouched}
                required
              >
                <textarea
                  id="booking-description"
                  rows={3}
                  placeholder="e.g. Master bedroom switchboard sparking with burning smell, need rewiring check and MCB inspection..."
                  value={description}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDescription(val);
                    if (descTouched) {
                      setDescError(validateMinLength(val, 5, "Requirement description", "📝").error || null);
                    }
                  }}
                  onBlur={() => {
                    setDescTouched(true);
                    setDescError(validateMinLength(description, 5, "Requirement description", "📝").error || null);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                />
              </FormField>
              <span className="text-[10px] text-slate-400 block -mt-2">
                Provide specific details so the specialist brings the right diagnostic equipment.
              </span>

              {/* Emergency Urgency Toggle */}
              <div
                onClick={() => setIsEmergency(!isEmergency)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                  isEmergency
                    ? "bg-rose-50/70 border-rose-300 text-rose-900"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isEmergency ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <strong className="block text-xs">Emergency Immediate Priority (7-15 min)</strong>
                    <span className="text-[10px] text-slate-500">
                      Dispatches worker immediately (+35% statutory emergency overtime allowance)
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isEmergency}
                  onChange={(e) => setIsEmergency(e.target.checked)}
                  className="rounded text-rose-600 focus:ring-rose-500"
                />
              </div>

              <button
                onClick={handleNextStep}
                disabled={!description.trim() || (descTouched && !!descError)}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>Continue to Schedule</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Date & Time Slot */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Select Service Time Slot</h4>
                <p className="text-slate-500 text-[11px]">Specialist will arrive within the selected cooperative window</p>
              </div>

              <div className="space-y-2">
                {[
                  "Today Morning (9:00 AM - 12:00 PM)",
                  "Today Afternoon (1:00 PM - 4:00 PM)",
                  "Today Evening (5:00 PM - 8:00 PM)",
                  "Tomorrow Morning (9:00 AM - 12:00 PM)",
                  "Tomorrow Afternoon (1:00 PM - 4:00 PM)"
                ].map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                      timeSlot === slot
                        ? "border-[#2563EB] bg-blue-50/70 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#2563EB]" />
                      <span className="font-bold text-slate-900">{slot}</span>
                    </div>
                    {timeSlot === slot && <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Location</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Service Address */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Service Location</h4>
                <p className="text-slate-500 text-[11px]">Confirm the residence or premises where assistance is needed</p>
              </div>

              <FormField
                id="booking-address"
                label="Full Street Address / Door No."
                error={addressError}
                touched={addressTouched}
                required
              >
                <input
                  type="text"
                  id="booking-address"
                  value={address}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAddress(val);
                    if (addressTouched) {
                      setAddressError(validateRequired(val, "Service address", "🏠").error || null);
                    }
                  }}
                  onBlur={() => {
                    setAddressTouched(true);
                    setAddressError(validateRequired(address, "Service address", "🏠").error || null);
                  }}
                  placeholder="e.g. Flat 402, Sri Sai Residency, Benz Circle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                />
              </FormField>

              <FormField
                id="booking-landmark"
                label="Nearest Landmark"
                error={landmarkError}
                touched={landmarkTouched}
                required
              >
                <input
                  type="text"
                  id="booking-landmark"
                  value={landmark}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLandmark(val);
                    if (landmarkTouched) {
                      setLandmarkError(validateRequired(val, "Nearest landmark", "📍").error || null);
                    }
                  }}
                  onBlur={() => {
                    setLandmarkTouched(true);
                    setLandmarkError(validateRequired(landmark, "Nearest landmark", "📍").error || null);
                  }}
                  placeholder="e.g. Opposite Trendset Mall, Benz Circle"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden"
                />
              </FormField>

              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span className="text-[11px] text-[#2563EB] font-semibold">
                  Vijayawada Central Cooperative Zone • Service radius verified
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 py-3 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!address.trim() || !landmark.trim() || (addressTouched && !!addressError) || (landmarkTouched && !!landmarkError)}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <span>Review Fair Wage</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Fair Wage Breakdown & Confirmation */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Statutory Fair Wage Summary</h4>
                <p className="text-slate-500 text-[11px]">100% direct payment to artisan with complete transparency</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 font-mono text-xs">
                <div className="flex justify-between text-slate-700">
                  <span className="font-sans">Base Hourly Rate ({worker.name})</span>
                  <span>₹{hourlyRate}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="font-sans">Estimated Service Duration</span>
                  <span>{estimatedHours} Hour</span>
                </div>
                {isEmergency && (
                  <div className="flex justify-between text-rose-700">
                    <span className="font-sans">Emergency Rapid Dispatch (35%)</span>
                    <span>Included</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span className="font-sans">Cooperative Platform Commission</span>
                  <span className="font-bold text-emerald-700">₹0 (Zero Middleman)</span>
                </div>
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span className="font-sans">PMSBY Safety &amp; Accidental Cover</span>
                  <span className="font-bold text-emerald-700">₹0 (Govt Subsidized)</span>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900 font-sans">
                  <span>Total Payable on Completion</span>
                  <span className="font-mono text-base text-[#2563EB]">₹{totalAmount}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-snug">
                  <strong>Zero Advance Fee:</strong> Payment is handled directly or via UPI upon job completion after you inspect the work and provide the service OTP.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={loading}
                  className="flex-1 py-3 rounded-full border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmitBooking}
                  disabled={loading}
                  className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold transition shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Registering Order...</span>
                  ) : (
                    <>
                      <span>Confirm &amp; Dispatch</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Success & Real Service OTP */}
          {step === 5 && createdBooking && (
            <div className="space-y-4 text-center py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">Booking Confirmed!</h4>
                <p className="text-slate-500 text-xs mt-0.5">
                  Your request has been routed to <strong>{worker.name}</strong>.
                </p>
              </div>

              {/* Service OTP Card */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 font-mono space-y-1">
                <span className="text-[10px] uppercase font-sans font-bold text-amber-800 tracking-wider block">
                  Your One-Time Service OTP
                </span>
                <span className="text-3xl font-black tracking-widest text-amber-700 block">
                  {createdBooking.otp || "8924"}
                </span>
                <span className="text-[10px] font-sans text-amber-800/80 block pt-1">
                  Share this OTP with the specialist only upon their physical arrival.
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-1 font-mono text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span className="font-sans text-slate-500">Order ID:</span>
                  <span className="font-bold text-slate-900">{createdBooking.bookingNumber || `#BK-${createdBooking._id.slice(-6).toUpperCase()}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-500">Time Window:</span>
                  <span className="font-bold text-slate-900">{timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-500">Specialist Contact:</span>
                  <span className="font-bold text-[#2563EB]">{worker.phone || "+91 98490 12345"}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white font-bold transition shadow-xs cursor-pointer"
              >
                View in My Bookings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

