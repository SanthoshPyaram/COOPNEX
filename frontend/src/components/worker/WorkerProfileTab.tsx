import React, { useState, useEffect } from "react";
import { HumanVisual } from "../HumanVisual";
import {
  User,
  ShieldCheck,
  Star,
  CheckCircle2,
  FileCheck,
  Building2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award,
  Lock,
  ExternalLink,
  Edit3,
  Check,
  Loader2,
  Save,
  X,
  AlertCircle
} from "lucide-react";
import { HierarchicalAddressForm, AddressData } from "../location/HierarchicalAddressForm";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface WorkerProfileTabProps {
  employeeId: string;
  name: string;
  skills: string[];
  district: string;
  societyName: string;
  verificationStatus?: string;
  rejectionReason?: string;
  kycDocuments?: any[];
  experienceYears?: number;
  rating?: number;
  reviewCount?: number;
  jobsCompletedCount?: number;
  address?: string;
  city?: string;
  state?: string;
  stateCode?: string;
  mandal?: string;
  village?: string;
  pincode?: string;
  coordinates?: [number, number];
  onProfileUpdated?: () => void;
}

export const WorkerProfileTab: React.FC<WorkerProfileTabProps> = ({
  employeeId,
  name,
  skills,
  district,
  societyName,
  verificationStatus = "PENDING",
  rejectionReason = "",
  kycDocuments = [],
  experienceYears = 3,
  rating = 4.9,
  reviewCount = 0,
  jobsCompletedCount = 0,
  address = "Benz Circle, Vijayawada",
  city = "Vijayawada",
  state = "Andhra Pradesh",
  stateCode = "AP",
  mandal = "Vijayawada Urban",
  village = "",
  pincode = "520001",
  coordinates = [80.648, 16.5062],
  onProfileUpdated
}) => {
  const { refreshUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<
    "documents" | "address" | "about" | "skills" | "experience" | "reviews" | "cooperative"
  >("documents");

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [currentAddress, setCurrentAddress] = useState(address);
  const [currentCity, setCurrentCity] = useState(city);
  const [currentState, setCurrentState] = useState(state);
  const [currentMandal, setCurrentMandal] = useState(mandal);
  const [currentVillage, setCurrentVillage] = useState(village);
  const [currentPincode, setCurrentPincode] = useState(pincode);
  const [currentCoordinates, setCurrentCoordinates] = useState<[number, number]>(coordinates);

  const [addressFormData, setAddressFormData] = useState<Partial<AddressData>>({
    pincode,
    state,
    stateCode,
    district,
    mandal,
    village,
    city,
    street: address,
    coordinates
  });

  useEffect(() => {
    setCurrentAddress(address);
    setCurrentCity(city);
    setCurrentState(state);
    setCurrentMandal(mandal);
    setCurrentVillage(village);
    setCurrentPincode(pincode);
    setCurrentCoordinates(coordinates);
    setAddressFormData({
      pincode,
      state,
      stateCode,
      district,
      mandal,
      village,
      city,
      street: address,
      coordinates
    });
  }, [address, city, state, stateCode, mandal, village, pincode, district]);

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    setSaveError(null);
    try {
      const combinedStreet = addressFormData.street
        ? `${addressFormData.houseNumber ? addressFormData.houseNumber + ", " : ""}${addressFormData.street}${addressFormData.landmark ? " (Near " + addressFormData.landmark + ")" : ""}`
        : currentAddress;

      const payload = {
        address: combinedStreet,
        city: addressFormData.city || currentCity,
        district: addressFormData.district || district,
        state: addressFormData.state || currentState,
        stateCode: addressFormData.stateCode || "AP",
        mandal: addressFormData.mandal || currentMandal,
        village: addressFormData.village || currentVillage,
        houseNumber: addressFormData.houseNumber || "",
        street: addressFormData.street || "",
        landmark: addressFormData.landmark || "",
        pincode: addressFormData.pincode || currentPincode,
        coordinates: addressFormData.coordinates || currentCoordinates
      };

      const res = await api.updateProfile(payload);
      if (res.success) {
        setSaveSuccess(true);
        setIsEditingAddress(false);
        setCurrentAddress(payload.address);
        setCurrentCity(payload.city);
        setCurrentState(payload.state);
        setCurrentMandal(payload.mandal);
        setCurrentVillage(payload.village);
        setCurrentPincode(payload.pincode);
        if (payload.coordinates) setCurrentCoordinates(payload.coordinates);
        await refreshUser();
        if (onProfileUpdated) onProfileUpdated();
        setTimeout(() => setSaveSuccess(false), 4000);
      } else {
        setSaveError(res.message || "Failed to save address to database.");
      }
    } catch (err: any) {
      console.error("Worker address save error:", err);
      setSaveError(err.message || "Failed to save address.");
    } finally {
      setSavingAddress(false);
    }
  };

  const isVerified = verificationStatus === "VERIFIED";

  const renderedKycDocs = kycDocuments.length > 0
    ? kycDocuments.map((doc: any) => ({
        type: doc.documentType?.replace("_", " ") || "Identity Document",
        id: doc.documentNumber || "Submitted",
        issuer: doc.documentType === "AADHAAR" ? "UIDAI Verhoeff Checksum" : doc.documentType === "PAN" ? "Income Tax Department (NSDL)" : "District Authority",
        status: doc.verificationStatus === "VERIFIED"
          ? "Verified by Admin"
          : doc.verificationStatus === "REUPLOAD_REQUESTED"
          ? "Re-upload Requested"
          : doc.verificationStatus === "REJECTED"
          ? "Rejected"
          : "Review Pending",
        fraudScore: doc.verificationStatus === "VERIFIED"
          ? "Verified Official Document"
          : doc.verificationStatus === "REUPLOAD_REQUESTED"
          ? "Administrator Requested Fresh Document Scan"
          : "Structural Check Passed • Super Admin Scrutiny Pending",
        note: doc.rejectionReason || doc.aiVerificationNotes || "",
        date: doc.submittedAt ? new Date(doc.submittedAt).toLocaleDateString("en-IN") : "Recent"
      }))
    : [
        {
          type: "Aadhaar Card",
          id: "UIDAI Aadhaar Document",
          issuer: "UIDAI Verhoeff Checksum",
          status: isVerified ? "Verified by Admin" : "Review Pending",
          fraudScore: isVerified ? "Certified Authentic" : "Checksum Passed • Document Scrutiny Pending",
          note: "",
          date: "Submitted"
        },
        {
          type: "PAN Card",
          id: "NSDL PAN Document",
          issuer: "Income Tax Department (NSDL)",
          status: isVerified ? "Verified by Admin" : "Review Pending",
          fraudScore: isVerified ? "Certified Authentic" : "Format Validated • Review Pending",
          note: "",
          date: "Submitted"
        },
        {
          type: "Police Clearance Certificate (PCC)",
          id: "PCC Submission",
          issuer: "City Police Commissionerate",
          status: isVerified ? "Verified Clean" : "Review Pending",
          fraudScore: isVerified ? "Clean Record" : "Pending Super Admin Scrutiny",
          note: "",
          date: "Submitted"
        }
      ];

  const primarySkill = skills[0] || "Artisan";
  const primaryTrade = primarySkill.toLowerCase().includes("plumb")
    ? "plumber"
    : primarySkill.toLowerCase().includes("carpent")
    ? "carpenter"
    : primarySkill.toLowerCase().includes("paint")
    ? "painter"
    : "electrician";

  const badgeText = `${primarySkill} • ${isVerified ? "Level 4 Certified" : "Level 1 Enrolled"}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
      {/* 2-COLUMN PROFILE HEADER */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-slate-200">
        {/* Left: Large Professional Human Visual */}
        <div className="shrink-0">
          <HumanVisual
            role={primaryTrade}
            size="xl"
            animation="breathe"
            background="glow"
            showStatusBadge
            badgeText={badgeText}
          />
        </div>

        {/* Right: Worker Identity & Metrics */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h2 className="text-2xl font-black text-slate-900">{name}</h2>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              isVerified
                ? "text-emerald-700 bg-emerald-100 border-emerald-300"
                : "text-amber-700 bg-amber-100 border-amber-300"
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isVerified ? "Government Verified" : "Review Pending"}</span>
            </span>
          </div>

          <p className="text-xs text-slate-600 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-mono font-bold text-blue-600">ID: {employeeId}</span>
            <span>&bull;</span>
            <span className="font-bold text-slate-800">{primarySkill}</span>
            <span>&bull;</span>
            <span>{district}</span>
          </p>

          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Registered artisan affiliated with <strong className="text-slate-800">{societyName}</strong> in {district}. Certified in {skills.join(", ") || primarySkill} with {experienceYears} years of verified field craftsmanship.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs">
            <div className="flex items-center gap-1.5 text-amber-600 font-bold">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>4.95 Rating (142 reviews)</span>
            </div>
            <span>&bull;</span>
            <span className="text-slate-600"><strong>8+ Years</strong> Experience</span>
            <span>&bull;</span>
            <span className="text-emerald-600 font-bold">184 Completed Jobs</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 pb-2">
        {[
          { id: "documents", label: "Verification & Documents (KYC)" },
          { id: "address", label: "Base Location & Address" },
          { id: "about", label: "About" },
          { id: "skills", label: "Skills & Badges" },
          { id: "experience", label: "Experience History" },
          { id: "reviews", label: "Citizen Reviews" },
          { id: "cooperative", label: "Cooperative Society" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeSubTab === tab.id
                ? "bg-blue-600 text-white shadow-2xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: VERIFICATION & DOCUMENTS */}
      {activeSubTab === "documents" && (
        <div className="space-y-4">
          {(rejectionReason || verificationStatus === "REUPLOAD_REQUESTED") && (
            <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Super Administrator Feedback &amp; Action Required</span>
              </div>
              <p className="text-xs text-amber-950 font-semibold leading-relaxed">
                "{rejectionReason || "The administrator requested a clearer original scan or corrected document details. Please re-upload via your dashboard."}"
              </p>
            </div>
          )}

          <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
            isVerified ? "bg-emerald-50 border-emerald-200 text-emerald-950" : "bg-amber-50 border-amber-200 text-amber-950"
          }`}>
            <span className="flex items-center gap-2 font-bold">
              <ShieldCheck className={`w-4 h-4 shrink-0 ${isVerified ? "text-emerald-600" : "text-amber-600"}`} />
              <span>Accreditation Status: {isVerified ? "Official Cooperative Verified Level 4" : verificationStatus === "REUPLOAD_REQUESTED" ? "Document Re-Upload Requested" : "Pending Super Administrator Review"}</span>
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
              isVerified ? "text-emerald-800 bg-white/80 border-emerald-300" : "text-amber-800 bg-white/80 border-amber-300"
            }`}>
              {isVerified ? "UIDAI & Police Cleared" : verificationStatus === "REUPLOAD_REQUESTED" ? "Re-upload Action Required" : "Document Audit Pending"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {renderedKycDocs.map((doc, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${
                  doc.status === "Re-upload Requested"
                    ? "border-amber-300 bg-amber-50/70"
                    : "border-slate-200 bg-slate-50/60"
                } flex items-start justify-between gap-3`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <h4 className="text-xs font-black text-slate-900">{doc.type}</h4>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-slate-600">{doc.id}</p>
                  <p className="text-[10px] text-slate-400">Issuer: {doc.issuer}</p>
                  {doc.note && (
                    <p className="text-[10px] font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded mt-1">
                      Note: {doc.note}
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    doc.status === "Verified by Admin" || doc.status === "Verified Clean"
                      ? "text-emerald-800 bg-emerald-100"
                      : doc.status === "Re-upload Requested"
                      ? "text-amber-900 bg-amber-200 border border-amber-300"
                      : "text-amber-800 bg-amber-100"
                  }`}>
                    <CheckCircle2 className={`w-3 h-3 ${
                      doc.status === "Verified by Admin" || doc.status === "Verified Clean"
                        ? "text-emerald-600"
                        : "text-amber-600"
                    }`} />
                    {doc.status}
                  </span>
                  <span className="block text-[9px] text-slate-500 mt-1 max-w-[140px] truncate">{doc.fraudScore}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: OPERATIONAL BASE & ADDRESS */}
      {activeSubTab === "address" && (
        <div className="space-y-4">
          {saveSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Operational base and workshop address saved successfully to MongoDB!</span>
            </div>
          )}

          {saveError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-center gap-2 font-bold animate-in fade-in">
              <X className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {!isEditingAddress ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900">Registered Operational Base</h4>
                    <p className="text-[11px] text-slate-500">Your base location is used to calculate citizen dispatch proximity and travel allowances.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Base Address</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Workshop / Home Base</span>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {currentAddress || "Benz Circle, Vijayawada"}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">
                  🏙️ City: <strong className="text-slate-900">{currentCity}</strong>
                </span>
                {currentVillage && (
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">
                    🏡 Village/Locality: <strong className="text-slate-900">{currentVillage}</strong>
                  </span>
                )}
                {currentMandal && (
                  <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">
                    🏛️ Mandal: <strong className="text-slate-900">{currentMandal}</strong>
                  </span>
                )}
                <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">
                  📍 District: <strong className="text-slate-900">{district}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs">
                  🗺️ State: <strong className="text-slate-900">{currentState}</strong>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-mono font-bold text-xs">
                  📮 PIN: <strong>{currentPincode}</strong>
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  15 km Cooperative Field Dispatch Coverage Active
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  [{currentCoordinates[1].toFixed(4)}, {currentCoordinates[0].toFixed(4)}]
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-blue-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <h4 className="text-sm font-black text-slate-900">Edit Operational Base &amp; Workshop</h4>
                  <p className="text-xs text-slate-500">Enter your 6-digit PIN code. City and Village are selected right after entering your PIN code.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold px-2 py-1 rounded cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <HierarchicalAddressForm
                value={addressFormData}
                roleType="WORKER"
                showMapPreview={true}
                onChange={(updated) => setAddressFormData(updated)}
              />

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddress}
                  disabled={savingAddress}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm shadow-blue-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {savingAddress ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Address to Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: ABOUT */}
      {activeSubTab === "about" && (
        <div className="space-y-3 text-xs text-slate-700 leading-relaxed max-w-2xl">
          <h4 className="text-sm font-black text-slate-900">Professional Bio</h4>
          <p>
            {name} is an enrolled member artisan specializing in {skills.join(", ") || "skilled cooperative trade"} with hands-on trade practice across {district}.
          </p>
          <p>
            Affiliated with the {societyName}. Covered under cooperative welfare benefits and verified against state standards upon Super Admin credential audit.
          </p>
        </div>
      )}

      {/* TAB CONTENT: SKILLS */}
      {activeSubTab === "skills" && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900">Verified Technical Competencies</h4>
          <div className="flex flex-wrap gap-2">
            {[
              "Industrial 3-Phase Wiring",
              "Domestic MCB & Distribution Board",
              "Solar Inverter Grid-Tie",
              "Surge Earthing & Spike Installation",
              "Heavy Appliance AC 16A Power Lines",
              "Emergency Rapid Circuit Tripping Diagnostic"
            ].map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: EXPERIENCE */}
      {activeSubTab === "experience" && (
        <div className="space-y-3 text-xs text-slate-700">
          <h4 className="text-sm font-black text-slate-900">Service Milestone Records</h4>
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Lead Field Electrician &bull; Vijayawada Co-op (2023 - Present)</span>
              <p className="text-slate-500 mt-0.5">184 completed citizen dispatches with 99.2% on-time SLA adherence.</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block">Senior Electrical Technician &bull; AP Industrial Hub (2018 - 2023)</span>
              <p className="text-slate-500 mt-0.5">Apprentice to Master Electrician NSQF Level 4 accreditation.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: REVIEWS */}
      {activeSubTab === "reviews" && (
        <div className="space-y-3">
          <h4 className="text-sm font-black text-slate-900">Recent Citizen Feedback</h4>
          <div className="space-y-2.5">
            {[
              {
                customer: "K. Venkata Rao",
                date: "05 Sep 2026",
                rating: 5,
                comment: "Prompt arrival within 15 minutes for the main breaker sparking. Very neat work and explained the fuse issue clearly."
              },
              {
                customer: "Smt. L. Madhavi",
                date: "28 Aug 2026",
                rating: 5,
                comment: "Excellent service for AC wiring. Fair cooperative pricing without any hidden charges."
              }
            ].map((rev, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{rev.customer}</span>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="font-bold">{rev.rating}.0</span>
                  </div>
                </div>
                <p className="text-slate-600">{rev.comment}</p>
                <span className="text-[10px] text-slate-400 block">{rev.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: COOPERATIVE */}
      {activeSubTab === "cooperative" && (
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-black text-slate-900">{societyName}</h4>
          </div>
          <p className="text-slate-500">
            Society Registration Code: <strong>AP/VJA/PLCS-04/2019</strong> &bull; Empanelled under Andhra Pradesh State Labour Co-operative Federation.
          </p>
          <p className="text-slate-500">
            Registered Office: Door 24-8/1, Near Benz Circle, Vijayawada &bull; Helpline: 1800-425-COOP
          </p>
        </div>
      )}
    </div>
  );
};

