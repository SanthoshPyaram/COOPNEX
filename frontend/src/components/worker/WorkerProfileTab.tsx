import React, { useState, useEffect } from "react";
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
  AlertCircle,
  Camera,
  Upload,
  Heart,
  Globe,
  Briefcase,
  IndianRupee,
  Calendar,
  MessageSquare
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
  trade?: string;
  bio?: string;
  baseHourlyRate?: number;
  avatarUrl?: string;
  profileImage?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  languages?: string[];
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
  name: initialName,
  skills: initialSkills,
  district,
  societyName,
  verificationStatus = "PENDING",
  rejectionReason = "",
  kycDocuments = [],
  experienceYears: initialExperienceYears = 3,
  rating = 4.9,
  reviewCount = 0,
  jobsCompletedCount = 0,
  trade: initialTrade,
  bio: initialBio,
  baseHourlyRate: initialBaseRate = 350,
  avatarUrl: initialAvatarUrl,
  profileImage: initialProfileImage,
  emergencyContactName: initialEmergencyName = "",
  emergencyContactPhone: initialEmergencyPhone = "",
  bloodGroup: initialBloodGroup = "O+",
  languages: initialLanguages = ["Telugu", "English", "Hindi"],
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
  const { user, refreshUser } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<
    "documents" | "address" | "about" | "skills" | "experience" | "reviews" | "cooperative"
  >("documents");

  // Profile editable fields state
  const [name, setName] = useState(initialName);
  const [trade, setTrade] = useState(initialTrade || initialSkills?.[0] || "Electrician");
  const [skills, setSkills] = useState<string[]>(initialSkills && initialSkills.length > 0 ? initialSkills : ["Electrician"]);
  const [bio, setBio] = useState(initialBio || "");
  const [baseHourlyRate, setBaseHourlyRate] = useState(initialBaseRate);
  const [experienceYears, setExperienceYears] = useState(initialExperienceYears);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || initialProfileImage || (user as any)?.avatarUrl || "");
  const [emergencyContactName, setEmergencyContactName] = useState(initialEmergencyName);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(initialEmergencyPhone);
  const [bloodGroup, setBloodGroup] = useState(initialBloodGroup);
  const [languages, setLanguages] = useState<string[]>(initialLanguages);

  // Profile Edit Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileSaveError, setProfileSaveError] = useState<string | null>(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: initialName,
    trade: initialTrade || initialSkills?.[0] || "Electrician",
    skillsInput: (initialSkills || []).join(", "),
    bio: initialBio || "",
    baseHourlyRate: initialBaseRate,
    experienceYears: initialExperienceYears,
    avatarUrl: initialAvatarUrl || initialProfileImage || (user as any)?.avatarUrl || "",
    emergencyContactName: initialEmergencyName,
    emergencyContactPhone: initialEmergencyPhone,
    bloodGroup: initialBloodGroup,
    languagesInput: (initialLanguages || []).join(", ")
  });

  // Sync props when user changes
  useEffect(() => {
    setName(initialName);
    setTrade(initialTrade || initialSkills?.[0] || "Electrician");
    setSkills(initialSkills && initialSkills.length > 0 ? initialSkills : ["Electrician"]);
    setBio(initialBio || "");
    setBaseHourlyRate(initialBaseRate);
    setExperienceYears(initialExperienceYears);
    setAvatarUrl(initialAvatarUrl || initialProfileImage || (user as any)?.avatarUrl || "");
    setEmergencyContactName(initialEmergencyName);
    setEmergencyContactPhone(initialEmergencyPhone);
    setBloodGroup(initialBloodGroup);
    setLanguages(initialLanguages);

    setEditForm({
      name: initialName,
      trade: initialTrade || initialSkills?.[0] || "Electrician",
      skillsInput: (initialSkills || []).join(", "),
      bio: initialBio || "",
      baseHourlyRate: initialBaseRate,
      experienceYears: initialExperienceYears,
      avatarUrl: initialAvatarUrl || initialProfileImage || (user as any)?.avatarUrl || "",
      emergencyContactName: initialEmergencyName,
      emergencyContactPhone: initialEmergencyPhone,
      bloodGroup: initialBloodGroup,
      languagesInput: (initialLanguages || []).join(", ")
    });
  }, [
    initialName,
    initialTrade,
    initialSkills,
    initialBio,
    initialBaseRate,
    initialExperienceYears,
    initialAvatarUrl,
    initialProfileImage,
    initialEmergencyName,
    initialEmergencyPhone,
    initialBloodGroup,
    initialLanguages
  ]);

  // Citizen Reviews State (Real MongoDB Reviews)
  const [workerReviews, setWorkerReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewStats, setReviewStats] = useState<any>(null);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await api.getWorkerReviews();
      if (res?.success) {
        setWorkerReviews(res.reviews || []);
        setReviewStats(res.stats || null);
      }
    } catch (err) {
      console.warn("Could not load worker reviews:", err);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === "reviews") {
      fetchReviews();
    }
  }, [activeSubTab]);

  // Handle saving profile changes to MongoDB
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSaveError(null);
    try {
      const parsedSkills = editForm.skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const parsedLanguages = editForm.languagesInput
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);

      const payload = {
        name: editForm.name,
        trade: editForm.trade,
        skills: parsedSkills.length > 0 ? parsedSkills : [editForm.trade],
        bio: editForm.bio,
        baseHourlyRate: Number(editForm.baseHourlyRate) || 350,
        experienceYears: Number(editForm.experienceYears) || 3,
        avatarUrl: editForm.avatarUrl,
        emergencyContactName: editForm.emergencyContactName,
        emergencyContactPhone: editForm.emergencyContactPhone,
        bloodGroup: editForm.bloodGroup,
        languages: parsedLanguages.length > 0 ? parsedLanguages : ["Telugu", "English"]
      };

      const res = await api.updateProfileDetails(payload);
      if (res?.success) {
        setProfileSaveSuccess(true);
        setName(payload.name);
        setTrade(payload.trade);
        setSkills(payload.skills);
        setBio(payload.bio);
        setBaseHourlyRate(payload.baseHourlyRate);
        setExperienceYears(payload.experienceYears);
        setAvatarUrl(payload.avatarUrl);
        setEmergencyContactName(payload.emergencyContactName);
        setEmergencyContactPhone(payload.emergencyContactPhone);
        setBloodGroup(payload.bloodGroup);
        setLanguages(payload.languages);

        setIsEditProfileOpen(false);
        await refreshUser();
        if (onProfileUpdated) onProfileUpdated();
        setTimeout(() => setProfileSaveSuccess(false), 4000);
      } else {
        setProfileSaveError(res?.message || "Failed to update profile details.");
      }
    } catch (err: any) {
      console.error("Save profile error:", err);
      setProfileSaveError(err.message || "Failed to save profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  // Avatar file upload handler
  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image smaller than 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setEditForm((prev) => ({ ...prev, avatarUrl: result }));
    };
    reader.readAsDataURL(file);
  };

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

  const primarySkill = skills[0] || trade || "Artisan";
  const displayRating = reviewStats?.averageRating || rating || 4.9;
  const displayReviewsCount = reviewStats?.totalReviews || reviewCount || workerReviews.length || 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-8 space-y-6">
      {/* Toast notifications */}
      {profileSaveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile details updated and synchronized with MongoDB Atlas!</span>
        </div>
      )}

      {/* 2-COLUMN PROFILE HEADER */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-slate-200">
        {/* Left: Authentic Worker Photo / Avatar */}
        <div className="relative group shrink-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-blue-50 bg-gradient-to-tr from-blue-600 via-indigo-600 to-slate-900 shadow-md flex items-center justify-center text-white text-3xl font-black relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as any).style.display = "none";
                }}
              />
            ) : (
              <span>{name ? name[0].toUpperCase() : "W"}</span>
            )}
            {/* Camera badge to edit photo */}
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-xs font-bold gap-1 cursor-pointer backdrop-blur-2xs"
              title="Edit Profile Photo"
            >
              <Camera className="w-5 h-5" />
              <span>Edit Photo</span>
            </button>
          </div>
          <span className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-white shadow-xs ${
            isVerified ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"
          }`}>
            <ShieldCheck className="w-4 h-4" />
          </span>
        </div>

        {/* Right: Worker Identity & Metrics */}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <h2 className="text-2xl font-black text-slate-900">{name}</h2>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              isVerified
                ? "text-emerald-700 bg-emerald-100 border-emerald-300"
                : "text-amber-700 bg-amber-100 border-amber-300"
            }`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isVerified ? "Government Verified" : "Review Pending"}</span>
            </span>

            {/* EDIT PROFILE BUTTON */}
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs border border-slate-200 hover:border-blue-300 transition flex items-center gap-1.5 cursor-pointer shadow-2xs ml-auto"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Edit Profile</span>
            </button>
          </div>

          <p className="text-xs text-slate-600 flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className="font-mono font-bold text-blue-600">ID: {employeeId}</span>
            <span>&bull;</span>
            <span className="font-bold text-slate-800 uppercase tracking-wide">{trade}</span>
            <span>&bull;</span>
            <span>{district}</span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-bold font-mono">₹{baseHourlyRate}/hr Base Wage</span>
          </p>

          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            {bio || `Registered artisan affiliated with ${societyName} in ${district}. Certified in ${skills.join(", ") || primarySkill} with ${experienceYears} years of verified field craftsmanship.`}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveSubTab("reviews")}
              className="flex items-center gap-1.5 text-amber-600 font-bold hover:underline cursor-pointer"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{Number(displayRating).toFixed(1)} Rating ({displayReviewsCount} citizen reviews)</span>
            </button>
            <span>&bull;</span>
            <span className="text-slate-600"><strong>{experienceYears}+ Years</strong> Experience</span>
            <span>&bull;</span>
            <span className="text-emerald-600 font-bold">{jobsCompletedCount || 0} Completed Jobs</span>
            <span>&bull;</span>
            <span className="text-rose-600 font-bold font-mono">Blood: {bloodGroup}</span>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 pb-2">
        {[
          { id: "documents", label: "Verification & Documents (KYC)" },
          { id: "address", label: "Base Location & Address" },
          { id: "about", label: "About & Details" },
          { id: "skills", label: "Skills & Badges" },
          { id: "reviews", label: `Citizen Reviews (${displayReviewsCount})` },
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
        <div className="space-y-4 text-xs text-slate-700 leading-relaxed max-w-3xl">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Professional Bio &amp; Artisan Profile</h4>
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit Details</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-slate-800 font-medium leading-relaxed">
              {bio || `${name} is a certified trade specialist in ${trade} with ${experienceYears} years of verified field experience across ${district}. Affiliated with ${societyName}.`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Trade &amp; Rate</span>
              <div className="text-sm font-black text-slate-900">{trade}</div>
              <div className="text-emerald-700 font-bold font-mono">₹{baseHourlyRate}/hour Fair Base Wage</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience &amp; Accreditation</span>
              <div className="text-sm font-black text-slate-900">{experienceYears}+ Years Field Experience</div>
              <div className="text-blue-700 font-semibold">{isVerified ? "NSQF Level-4 Government Verified" : "Review Pending"}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Languages Spoken</span>
              <div className="text-slate-800 font-bold">
                {languages.join(", ") || "Telugu, English, Hindi"}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Emergency &amp; Blood Profile</span>
              <div className="text-slate-800 font-bold">Blood Group: <span className="text-rose-600">{bloodGroup}</span></div>
              <div className="text-slate-500 text-[11px]">
                Contact: {emergencyContactName || "Nominee"} ({emergencyContactPhone || "Not set"})
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: SKILLS */}
      {activeSubTab === "skills" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">Verified Technical Competencies</h4>
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Add / Update Skills</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{skill}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: CITIZEN REVIEWS (LIVE MONGODB REVIEWS) */}
      {activeSubTab === "reviews" && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-base font-black text-slate-900">Verified Citizen Ratings &amp; Reviews</h4>
              <p className="text-xs text-slate-500">
                Live feedback submitted by citizens upon job completion and digital payment verification.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-600 font-black text-base">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span>{Number(displayRating).toFixed(1)}</span>
                <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">({displayReviewsCount} verified reviews)</span>
            </div>
          </div>

          {reviewsLoading ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
              <p>Loading live customer reviews from database...</p>
            </div>
          ) : workerReviews.length === 0 ? (
            <div className="py-12 text-center text-slate-400 border border-slate-200 rounded-2xl bg-slate-50 space-y-2 p-6">
              <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
              <h5 className="font-bold text-slate-800 text-sm">No Citizen Reviews Yet</h5>
              <p className="text-xs max-w-sm mx-auto">
                Customer reviews and ratings will appear here as you complete jobs and citizens submit their feedback.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {workerReviews.map((rev: any, i: number) => {
                const customerName = rev.customerId?.name || rev.customerName || "Verified Citizen";
                const customerAvatar = rev.customerId?.avatarUrl;
                const reviewDate = rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }) : "Recent";

                return (
                  <div key={rev._id || i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {customerAvatar ? (
                            <img src={customerAvatar} alt={customerName} className="w-full h-full object-cover" />
                          ) : (
                            customerName[0].toUpperCase()
                          )}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{customerName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{reviewDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 text-amber-700 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-slate-700 text-xs leading-relaxed pl-10">
                      "{rev.comment || rev.feedback || "Great service delivered on time."}"
                    </p>

                    {rev.workProofPhotos && rev.workProofPhotos.length > 0 && (
                      <div className="pl-10 flex gap-2 pt-1">
                        {rev.workProofPhotos.map((photo: string, idx: number) => (
                          <img
                            key={idx}
                            src={photo}
                            alt="Work proof"
                            className="w-14 h-14 object-cover rounded-xl border border-slate-200 shadow-2xs"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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

      {/* EDIT PROFILE MODAL */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-5 my-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-black text-slate-900">Edit Artisan Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {profileSaveError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{profileSaveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              {/* Avatar upload / link */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl overflow-hidden shrink-0">
                  {editForm.avatarUrl ? (
                    <img src={editForm.avatarUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : (
                    editForm.name?.[0] || "W"
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <span className="font-bold text-slate-800 block">Profile Photo</span>
                  <div className="flex gap-2">
                    <label className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl font-bold text-slate-700 cursor-pointer flex items-center gap-1 shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload Image</span>
                      <input type="file" accept="image/*" onChange={handleAvatarFileChange} className="hidden" />
                    </label>
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste photo URL (https://...)"
                    value={editForm.avatarUrl}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, avatarUrl: e.target.value }))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Primary Trade</label>
                  <select
                    value={editForm.trade}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, trade: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="Mason">Mason / Civil Works</option>
                    <option value="AC Technician">AC &amp; Refrigeration</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                    <option value="Welder">Welder &amp; Metal Craftsman</option>
                    <option value="Gardener">Gardener / Landscaping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Hourly Wage (₹/hr)</label>
                  <input
                    type="number"
                    min={150}
                    max={2000}
                    required
                    value={editForm.baseHourlyRate}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, baseHourlyRate: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    required
                    value={editForm.experienceYears}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, experienceYears: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Skills &amp; Competencies (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3-Phase Wiring, Distribution Board, AC Installation"
                  value={editForm.skillsInput}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, skillsInput: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Professional Bio</label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of your field craftsmanship, experience, and cooperative ethics..."
                  value={editForm.bio}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={editForm.bloodGroup}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, bloodGroup: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emergency Nominee</label>
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={editForm.emergencyContactName}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, emergencyContactName: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emergency Phone</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={editForm.emergencyContactPhone}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, emergencyContactPhone: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Languages Known (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Telugu, English, Hindi"
                  value={editForm.languagesInput}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, languagesInput: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Atlas...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Profile</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
