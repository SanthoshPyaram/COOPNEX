import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Check, Search } from "lucide-react";
import { FormField } from "./common/FormField";
import { validatePincode } from "../utils/validation";

interface AreaOption {
  name: string;
  pincode: string;
  ward: string;
  district: string;
  city: string;
}

const PREDEFINED_AREAS: AreaOption[] = [
  { name: "Benz Circle", pincode: "520010", ward: "Central Hub", district: "Vijayawada", city: "Vijayawada" },
  { name: "Governorpet", pincode: "520002", ward: "Commercial District", district: "Vijayawada", city: "Vijayawada" },
  { name: "Patamata", pincode: "520010", ward: "East Sector", district: "Vijayawada", city: "Vijayawada" },
  { name: "One Town", pincode: "520001", ward: "Heritage Ward", district: "Vijayawada", city: "Vijayawada" },
  { name: "Bhavanipuram", pincode: "520012", ward: "West Gateway", district: "Vijayawada", city: "Vijayawada" },
  { name: "Gollapudi", pincode: "521225", ward: "Suburban Hub", district: "Vijayawada", city: "Vijayawada" },
  { name: "Auto Nagar", pincode: "520007", ward: "Industrial Zone", district: "Vijayawada", city: "Vijayawada" },
  { name: "Gunadala", pincode: "520004", ward: "North Sector", district: "Vijayawada", city: "Vijayawada" }
];

interface CustomerLocationModalProps {
  isOpen: boolean;
  activeArea: string;
  activePincode: string;
  onClose: () => void;
  onSelectArea: (area: string, pincode: string) => void;
}

export const CustomerLocationModal: React.FC<CustomerLocationModalProps> = ({
  isOpen,
  activeArea,
  activePincode,
  onClose,
  onSelectArea
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customPincode, setCustomPincode] = useState("");
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [pincodeTouched, setPincodeTouched] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Lock body scroll while modal is open & listen for Escape
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      setTimeout(() => searchInputRef.current?.focus(), 150);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = prevOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAreas = PREDEFINED_AREAS.filter((area) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      area.name.toLowerCase().includes(q) ||
      area.pincode.includes(q) ||
      area.ward.toLowerCase().includes(q) ||
      area.district.toLowerCase().includes(q) ||
      area.city.toLowerCase().includes(q)
    );
  });

  const handleApplyCustomPincode = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeTouched(true);
    const pinRes = validatePincode(customPincode);
    if (!pinRes.isValid) {
      setPincodeError(pinRes.error || null);
      return;
    }
    const cleanPin = customPincode.replace(/\D/g, "");
    onSelectArea(`Ward PIN ${cleanPin}`, cleanPin);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Modal Dialog with scale from 0.96 -> 1, opacity 0 -> 1, slight upward translate */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="location-modal-title"
          className="relative bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 z-10 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 id="location-modal-title" className="text-base font-black text-slate-900 leading-tight">
                  Select Cooperative Area
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  Current: <strong className="text-[#2563EB]">{activeArea}</strong> • PIN {activePincode}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close location selector"
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed shrink-0">
            Select your residential ward or enter a pincode. Showing verified specialists with minimum transit times and statutory floor rates.
          </p>

          {/* Search Filter Box */}
          <div className="relative shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search area name, ward, or pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] transition font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Area Options Grid - Scrollable Container */}
          <div className="overflow-y-auto max-h-60 pr-1 space-y-2 flex-1 scrollbar-thin">
            {filteredAreas.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No cooperative wards match &quot;{searchQuery}&quot;. You can enter any 6-digit pincode below.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredAreas.map((area) => {
                  const isSelected = activeArea === area.name || activePincode === area.pincode;
                  return (
                    <button
                      key={area.name}
                      type="button"
                      onClick={() => {
                        onSelectArea(area.name, area.pincode);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? "border-[#2563EB] bg-blue-50/80 ring-2 ring-blue-500/20 shadow-xs"
                          : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-bold text-xs text-slate-900">{area.name}</div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">PIN: {area.pincode}</div>
                      <div className="text-[9px] text-[#2563EB] font-semibold mt-0.5">{area.ward}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Custom Pincode Form */}
          <form onSubmit={handleApplyCustomPincode} className="pt-3 border-t border-slate-100 shrink-0">
            <FormField
              id="custom-pincode-input"
              label="Enter Custom Pincode (Andhra Pradesh / Pan-India):"
              error={pincodeError}
              touched={pincodeTouched}
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  id="custom-pincode-input"
                  maxLength={6}
                  placeholder="e.g. 520008"
                  value={customPincode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setCustomPincode(val);
                    if (pincodeTouched) {
                      setPincodeError(validatePincode(val).error || null);
                    }
                  }}
                  onBlur={() => {
                    setPincodeTouched(true);
                    setPincodeError(validatePincode(customPincode).error || null);
                  }}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#2563EB] transition"
                />
                <button
                  type="submit"
                  disabled={!customPincode || customPincode.length !== 6 || (pincodeTouched && !!pincodeError)}
                  className="px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#4F46E5] hover:opacity-95 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50 cursor-pointer shrink-0"
                >
                  Apply PIN
                </button>
              </div>
            </FormField>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

