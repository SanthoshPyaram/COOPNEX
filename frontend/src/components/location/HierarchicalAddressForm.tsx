import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building2,
  Compass,
  Home,
  Navigation,
  Info,
  Layers,
  Sparkles,
  Map as MapIcon
} from "lucide-react";
import { LeafletMap } from "../LeafletMap";

export interface AddressData {
  pincode: string;
  state: string;
  stateCode?: string;
  district: string;
  mandal?: string;
  postOffice: string;
  city?: string;
  village?: string;
  street: string;
  houseNumber: string;
  landmark?: string;
  addressType: "PERMANENT" | "WORK";
  coordinates?: [number, number]; // [lng, lat]
  precision?: string;
  serviceAvailable?: boolean;
  status?: "AVAILABLE" | "COMING_SOON" | "INVALID_PINCODE";
}

interface HierarchicalAddressFormProps {
  value: Partial<AddressData>;
  onChange: (updated: AddressData) => void;
  showMapPreview?: boolean;
  required?: boolean;
  error?: string | null;
  roleType?: "CUSTOMER" | "WORKER";
}

export const HierarchicalAddressForm: React.FC<HierarchicalAddressFormProps> = ({
  value,
  onChange,
  showMapPreview = true,
  required = true,
  error = null,
  roleType = "CUSTOMER"
}) => {
  const [pincode, setPincode] = useState(value.pincode || "");
  const [isLoading, setIsLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lookupSuccess, setLookupSuccess] = useState(false);

  // Administrative hierarchy options returned by API
  const [stateName, setStateName] = useState(value.state || "");
  const [stateCode, setStateCode] = useState(value.stateCode || "");
  const [districtName, setDistrictName] = useState(value.district || "");
  const [postOfficesList, setPostOfficesList] = useState<Array<{ name: string; type?: string; delivery?: boolean }>>([]);
  const [selectedPostOffice, setSelectedPostOffice] = useState(value.postOffice || "");
  const [mandalsList, setMandalsList] = useState<string[]>([]);
  const [selectedMandal, setSelectedMandal] = useState(value.mandal || "");
  const [customMandal, setCustomMandal] = useState("");
  const [citiesList, setCitiesList] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState(value.city || "");
  const [customCity, setCustomCity] = useState("");
  const [villagesList, setVillagesList] = useState<Array<{ code?: string; name: string }>>([]);
  const [selectedVillage, setSelectedVillage] = useState(value.village || "");
  const [customVillage, setCustomVillage] = useState("");

  // Detailed street & dwelling fields
  const [street, setStreet] = useState(value.street || "");
  const [houseNumber, setHouseNumber] = useState(value.houseNumber || "");
  const [landmark, setLandmark] = useState(value.landmark || "");
  const [addressType, setAddressType] = useState<"PERMANENT" | "WORK">(value.addressType || "PERMANENT");

  // Geolocation & Service Availability
  const [coordinates, setCoordinates] = useState<[number, number] | undefined>(value.coordinates);
  const [precision, setPrecision] = useState<string>(value.precision || "POST_OFFICE");
  const [serviceStatus, setServiceStatus] = useState<"AVAILABLE" | "COMING_SOON" | "INVALID_PINCODE" | null>(
    value.status || null
  );
  const [serviceMessage, setServiceMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Trigger real backend pincode resolution
  const fetchPincodeData = async (rawPin: string) => {
    if (!/^[1-9][0-9]{5}$/.test(rawPin)) {
      setLookupError("PIN code must be a 6-digit number.");
      setLookupSuccess(false);
      setServiceStatus("INVALID_PINCODE");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setLookupError(null);

    try {
      const res = await fetch(`/api/location/pincode/${encodeURIComponent(rawPin)}`, {
        signal: controller.signal
      });
      const json = await res.json();
      setIsLoading(false);

      if (json.success && json.data) {
        const d = json.data;
        setLookupSuccess(true);
        setLookupError(null);

        setStateName(d.state || "");
        setStateCode(d.stateCode || "");
        setDistrictName(d.district || "");
        setServiceStatus(d.status || (d.serviceAvailable ? "AVAILABLE" : "COMING_SOON"));
        setServiceMessage(d.message || null);
        setPrecision(d.precision || "POST_OFFICE");

        // Post Offices
        const offices = Array.isArray(d.postOffices) ? d.postOffices : [];
        setPostOfficesList(offices);
        const initialPo = offices.length > 0 ? offices[0].name : "";
        setSelectedPostOffice(initialPo);

        // Mandals / Subdistricts
        const mandals = Array.isArray(d.mandals) ? d.mandals : [];
        setMandalsList(mandals);
        const initialMandal = mandals.length > 0 ? mandals[0] : "";
        setSelectedMandal(initialMandal);

        // Cities
        const cities = Array.isArray(d.cities) ? d.cities : [];
        setCitiesList(cities);
        const initialCity = cities.length > 0 ? cities[0] : d.district || "";
        setSelectedCity(initialCity);

        // Villages
        const villages = Array.isArray(d.villages) ? d.villages : [];
        setVillagesList(villages);
        const initialVillage = villages.length > 0 ? villages[0].name : "";
        setSelectedVillage(initialVillage);

        // Coordinates [lng, lat]
        if (d.coordinates && d.coordinates.length === 2) {
          setCoordinates(d.coordinates);
        }

        // Notify parent
        emitChange({
          pincode: rawPin,
          state: d.state,
          stateCode: d.stateCode,
          district: d.district,
          mandal: initialMandal,
          postOffice: initialPo,
          city: initialCity,
          village: initialVillage,
          street,
          houseNumber,
          landmark,
          addressType,
          coordinates: d.coordinates,
          precision: d.precision || "POST_OFFICE",
          serviceAvailable: d.serviceAvailable,
          status: d.status
        });
      } else {
        setLookupSuccess(false);
        setLookupError(json.message || "Unrecognized Indian postal PIN code. Please verify your 6-digit code.");
        setServiceStatus("INVALID_PINCODE");
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setIsLoading(false);
        setLookupSuccess(false);
        setLookupError("Unable to verify PIN code right now. Please check your connection or re-enter.");
      }
    }
  };

  const handlePincodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPincode(raw);

    if (raw.length === 6) {
      fetchPincodeData(raw);
    } else {
      setLookupSuccess(false);
      setLookupError(null);
      setServiceStatus(null);
      setServiceMessage(null);
    }
  };

  const emitChange = (overrides?: Partial<AddressData>) => {
    const effectiveCity = selectedCity === "__CUSTOM__" ? customCity : selectedCity;
    const effectiveMandal = selectedMandal === "__CUSTOM__" ? customMandal : selectedMandal;
    const effectiveVillage = selectedVillage === "__CUSTOM__" ? customVillage : selectedVillage;

    const data: AddressData = {
      pincode,
      state: stateName,
      stateCode,
      district: districtName,
      mandal: effectiveMandal,
      postOffice: selectedPostOffice,
      city: effectiveCity,
      village: effectiveVillage,
      street,
      houseNumber,
      landmark,
      addressType,
      coordinates,
      precision,
      serviceAvailable: serviceStatus === "AVAILABLE",
      status: serviceStatus || undefined,
      ...overrides
    };

    onChange(data);
  };

  return (
    <div className="space-y-4 text-left">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Official Postal &amp; Locality Address</span>
              {required && <span className="text-rose-500 font-black">*</span>}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Validated against the official India Post and Local Government Directory
            </p>
          </div>
        </div>

        {/* Live Precision Badge */}
        {coordinates && lookupSuccess && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Compass className="w-3 h-3 text-blue-500" />
            <span>Precision: {precision}</span>
          </span>
        )}
      </div>

      {/* 1. 6-Digit PIN Code Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Postal PIN Code (6 Digits) {required && <span className="text-rose-500">*</span>}
          </label>
          {isLoading && (
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Verifying with India Post...</span>
            </span>
          )}
        </div>
        <div className="relative">
          <Navigation className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="Enter 6-digit PIN code (e.g. 520001, 500001)"
            value={pincode}
            onChange={handlePincodeInput}
            className={`w-full bg-slate-50 dark:bg-slate-800/90 border ${
              lookupError || error
                ? "border-rose-500 ring-1 ring-rose-500/20 text-rose-900 dark:text-rose-200"
                : lookupSuccess
                ? "border-emerald-500 ring-1 ring-emerald-500/20 text-emerald-900 dark:text-emerald-200"
                : "border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
            } rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition`}
          />
          {lookupSuccess && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3" />
          )}
        </div>

        {/* Error Feedback */}
        {lookupError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 mt-1"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{lookupError}</span>
          </motion.p>
        )}
      </div>

      {/* 2. Detected Administrative Region & Service Status Strip */}
      <AnimatePresence>
        {lookupSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-3"
          >
            {/* Service Availability Notice Card */}
            {serviceStatus === "AVAILABLE" ? (
              <div className="p-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">
                    COOPNEX Services Active in {districtName}, {stateName}
                  </span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Cooperative artisans are actively on-call with zero commission fair wages.
                  </p>
                </div>
              </div>
            ) : serviceStatus === "COMING_SOON" ? (
              <div className="p-3 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-900 dark:text-amber-200">
                      Coming Soon to {stateName}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 rounded-full">
                      Expansion Corridor
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-1 leading-relaxed">
                    {serviceMessage ||
                      `We're currently operational across all districts of Andhra Pradesh and Telangana. You can complete ${
                        roleType === "WORKER" ? "onboarding" : "registration"
                      } now — we'll notify you as soon as direct dispatch opens in your locality!`}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Read-Only Detected Hierarchy Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  Detected State
                </label>
                <div className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{stateName}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      serviceStatus === "AVAILABLE"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    }`}
                  >
                    {serviceStatus === "AVAILABLE" ? "SUPPORTED REGION" : "EXPANSION REGION"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                  District
                </label>
                <div className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white">
                  {districtName}
                </div>
              </div>
            </div>

            {/* 3. Post Office & Mandal Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Local Post Office {postOfficesList.length > 1 ? `(${postOfficesList.length} choices)` : ""}
                </label>
                {postOfficesList.length > 1 ? (
                  <select
                    value={selectedPostOffice}
                    onChange={(e) => {
                      setSelectedPostOffice(e.target.value);
                      emitChange({ postOffice: e.target.value });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                  >
                    {postOfficesList.map((po, i) => (
                      <option key={i} value={po.name}>
                        {po.name} {po.type ? `[${po.type}]` : ""} {po.delivery ? "(Delivery PO)" : ""}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white">
                    {selectedPostOffice || "Postal Center"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mandal / Subdistrict / Taluk
                </label>
                {mandalsList.length > 0 ? (
                  <div className="space-y-1.5">
                    <select
                      value={selectedMandal}
                      onChange={(e) => {
                        setSelectedMandal(e.target.value);
                        emitChange({ mandal: e.target.value === "__CUSTOM__" ? customMandal : e.target.value });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                    >
                      {mandalsList.map((m, i) => (
                        <option key={i} value={m}>
                          {m} Mandal
                        </option>
                      ))}
                      <option value="__CUSTOM__">Other (Enter manually)</option>
                    </select>
                    {selectedMandal === "__CUSTOM__" && (
                      <input
                        type="text"
                        placeholder="Type mandal / taluk name"
                        value={customMandal}
                        onChange={(e) => {
                          setCustomMandal(e.target.value);
                          emitChange({ mandal: e.target.value });
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs"
                      />
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter mandal / subdistrict"
                    value={customMandal}
                    onChange={(e) => {
                      setCustomMandal(e.target.value);
                      emitChange({ mandal: e.target.value });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                )}
              </div>
            </div>

            {/* 4. City / Town and Village Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  City / Town Name
                </label>
                {citiesList.length > 0 ? (
                  <div className="space-y-1.5">
                    <select
                      value={selectedCity}
                      onChange={(e) => {
                        setSelectedCity(e.target.value);
                        emitChange({ city: e.target.value === "__CUSTOM__" ? customCity : e.target.value });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                    >
                      {citiesList.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="__CUSTOM__">Other (Enter manually)</option>
                    </select>
                    {selectedCity === "__CUSTOM__" && (
                      <input
                        type="text"
                        placeholder="Type city or town name"
                        value={customCity}
                        onChange={(e) => {
                          setCustomCity(e.target.value);
                          emitChange({ city: e.target.value });
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs"
                      />
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter city / town"
                    value={customCity}
                    onChange={(e) => {
                      setCustomCity(e.target.value);
                      emitChange({ city: e.target.value });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Village / Locality {villagesList.length > 0 ? `(${villagesList.length} mapped)` : ""}
                </label>
                {villagesList.length > 0 ? (
                  <div className="space-y-1.5">
                    <select
                      value={selectedVillage}
                      onChange={(e) => {
                        setSelectedVillage(e.target.value);
                        emitChange({ village: e.target.value === "__CUSTOM__" ? customVillage : e.target.value });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                    >
                      {villagesList.map((v, i) => (
                        <option key={i} value={v.name}>
                          {v.name}
                        </option>
                      ))}
                      <option value="__CUSTOM__">Other (Enter manually)</option>
                    </select>
                    {selectedVillage === "__CUSTOM__" && (
                      <input
                        type="text"
                        placeholder="Type village name"
                        value={customVillage}
                        onChange={(e) => {
                          setCustomVillage(e.target.value);
                          emitChange({ village: e.target.value });
                        }}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs"
                      />
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter village or locality name"
                    value={customVillage}
                    onChange={(e) => {
                      setCustomVillage(e.target.value);
                      emitChange({ village: e.target.value });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white"
                  />
                )}
              </div>
            </div>

            {/* 5. Street, House Number & Landmark */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Street / Road / Colony {required && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <Navigation className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required={required}
                    placeholder="e.g. MG Road, Near RTC Complex"
                    value={street}
                    onChange={(e) => {
                      setStreet(e.target.value);
                      emitChange({ street: e.target.value });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  House / Door No. {required && <span className="text-rose-500">*</span>}
                </label>
                <div className="relative">
                  <Home className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required={required}
                    placeholder="e.g. D.No 12-4/A"
                    value={houseNumber}
                    onChange={(e) => {
                      setHouseNumber(e.target.value);
                      emitChange({ houseNumber: e.target.value });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Prominent Landmark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Opposite State Bank of India"
                value={landmark}
                onChange={(e) => {
                  setLandmark(e.target.value);
                  emitChange({ landmark: e.target.value });
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>

            {/* 6. Address Type Selector: Permanent vs Work */}
            <div className="pt-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Address Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAddressType("PERMANENT");
                    emitChange({ addressType: "PERMANENT" });
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                    addressType === "PERMANENT"
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 shadow-xs"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Permanent Address</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAddressType("WORK");
                    emitChange({ addressType: "WORK" });
                  }}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                    addressType === "WORK"
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 shadow-xs"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Work / Service Address</span>
                </button>
              </div>
            </div>

            {/* 7. Geospatial Mini-Map Preview */}
            {showMapPreview && coordinates && (
              <div className="mt-2 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                <div className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <MapIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Locality Map Centered on {selectedPostOffice || districtName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {coordinates[1].toFixed(4)}° N, {coordinates[0].toFixed(4)}° E
                  </span>
                </div>
                <LeafletMap
                  center={[coordinates[1], coordinates[0]]} // Leaflet takes [lat, lng]
                  zoom={14}
                  customerLocation={[coordinates[1], coordinates[0]]}
                  customerLocationLabel={`${selectedPostOffice || districtName} (${pincode})`}
                  status={serviceStatus === "AVAILABLE" ? "AVAILABLE" : "COMING_SOON"}
                  height="160px"
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

