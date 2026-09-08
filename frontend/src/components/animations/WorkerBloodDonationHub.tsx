import React, { useState } from "react";
import { 
  Droplet, 
  Heart, 
  Activity, 
  Bell, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Flame,
  Award
} from "lucide-react";

interface WorkerBloodDonationHubProps {
  initialBloodGroup?: string;
  workerName?: string;
}

export const WorkerBloodDonationHub: React.FC<WorkerBloodDonationHubProps> = ({
  initialBloodGroup = "O+",
  workerName = "Raj Kumar"
}) => {
  const [bloodGroup, setBloodGroup] = useState<string>(() => {
    return localStorage.getItem("sahakari_worker_blood_group") || initialBloodGroup;
  });
  const [isVolunteer, setIsVolunteer] = useState<boolean>(() => {
    return localStorage.getItem("sahakari_worker_blood_volunteer") !== "false";
  });
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [selectedHospitalRequest, setSelectedHospitalRequest] = useState<any | null>(null);
  const [pledgeConfirmed, setPledgeConfirmed] = useState<boolean>(false);

  // Hospital Emergency Requests in Vijayawada
  const hospitalRequests = [
    {
      id: "REQ-01",
      hospital: "Govt. General Hospital (GGH) Trauma Ward",
      location: "Near Railway Station Corridor, Vijayawada",
      neededBlood: "O+",
      units: "2 Units Required Urgently",
      etaLimit: "Under 45 mins",
      distance: "1.8 km away",
      reason: "Emergency scaffolding trauma & internal hemorrhage"
    },
    {
      id: "REQ-02",
      hospital: "Ramesh Hospitals Cardiac & Surgical Unit",
      location: "Benz Circle, Vijayawada",
      neededBlood: "A+",
      units: "1 Unit Required",
      etaLimit: "Under 90 mins",
      distance: "2.4 km away",
      reason: "Emergency vascular bypass procedure"
    }
  ];

  const handleBloodGroupChange = (bg: string) => {
    setBloodGroup(bg);
    localStorage.setItem("sahakari_worker_blood_group", bg);
  };

  const handleToggleVolunteer = () => {
    const nextVal = !isVolunteer;
    setIsVolunteer(nextVal);
    localStorage.setItem("sahakari_worker_blood_volunteer", String(nextVal));
  };

  return (
    <div className="bg-gradient-to-br from-[#12080a] via-[#210c12] to-[#12080a] text-white p-6 sm:p-8 rounded-3xl border border-rose-800/50 shadow-2xl space-y-6 relative overflow-hidden">
      {/* Background Animated Glowing Ambient Lights */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-900/60 pb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-700 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/40">
              <Droplet className="w-7 h-7 fill-white animate-pulse" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-[#12080a]"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-rose-300 bg-rose-500/20 px-2.5 py-0.5 rounded-full border border-rose-500/30">
                Cooperative Social Security
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
              Shramik Rakta Setu • Artisan Blood Solidarity Network
            </h3>
            <p className="text-xs text-rose-200/80 mt-0.5">
              Worksite life shield &amp; community blood emergency network connecting fellow artisans and local hospital wards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-700/60 text-rose-200 font-mono text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>NTR District Emergency Relay</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Left Animated Liquid Vial (Different Animation) | Right Controls & Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* LEFT COLUMN: LIQUID WAVE BLOOD RESERVE VIAL & BUBBLING PLASMA GAUGE (UNIQUE ANIMATION) */}
        <div className="lg:col-span-5 bg-black/40 backdrop-blur-md p-6 rounded-3xl border border-rose-800/40 flex flex-col items-center justify-between text-center relative overflow-hidden shadow-inner">
          <div className="w-full flex items-center justify-between text-xs font-mono border-b border-rose-900/40 pb-2 mb-4">
            <span className="text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Cooperative Reserve Flask</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
              85% CAPACITY
            </span>
          </div>

          {/* SVG Animated Flask / Vial with Liquid Waves & Rising Bubbles */}
          <div className="relative w-44 h-64 my-2 flex items-center justify-center">
            {/* Ambient Background Tube Glow */}
            <div className="absolute inset-x-6 inset-y-2 bg-rose-600/20 rounded-full blur-xl animate-pulse"></div>

            {/* Flask Glass Cylinder */}
            <div className="relative w-36 h-60 rounded-3xl border-2 border-rose-400/40 bg-gradient-to-b from-white/10 via-white/5 to-rose-950/30 overflow-hidden shadow-2xl backdrop-blur-xs flex flex-col justify-end">
              
              {/* Measurement Volume Ticks on Glass */}
              <div className="absolute left-2 inset-y-4 flex flex-col justify-between text-[8px] font-mono text-rose-300/60 z-30 select-none">
                <span>450ml -</span>
                <span>350ml -</span>
                <span>250ml -</span>
                <span>150ml -</span>
                <span>50ml -</span>
              </div>

              {/* Floating Bubbles in Liquid */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <span className="absolute bottom-6 left-8 w-2.5 h-2.5 rounded-full bg-white/40 animate-bounce" style={{ animationDuration: "2.8s" }}></span>
                <span className="absolute bottom-12 right-8 w-3.5 h-3.5 rounded-full bg-rose-200/50 animate-bounce" style={{ animationDuration: "3.4s", animationDelay: "0.5s" }}></span>
                <span className="absolute bottom-20 left-12 w-2 h-2 rounded-full bg-white/60 animate-bounce" style={{ animationDuration: "2.1s", animationDelay: "1s" }}></span>
                <span className="absolute bottom-28 right-10 w-3 h-3 rounded-full bg-rose-300/40 animate-bounce" style={{ animationDuration: "3.1s", animationDelay: "1.4s" }}></span>
              </div>

              {/* Rising Liquid Column with Animated Wave Crest */}
              <div className="w-full h-44 bg-gradient-to-t from-rose-900 via-rose-700 to-red-600 relative overflow-hidden">
                {/* SVG Animated Waves */}
                <div className="absolute -top-3 left-0 right-0 w-[200%] h-6 opacity-80 animate-[spin_6s_linear_infinite]">
                  <svg viewBox="0 0 100 20" className="w-full h-full text-red-500 fill-current" preserveAspectRatio="none">
                    <path d="M0,10 Q25,0 50,10 T100,10 T150,10 T200,10 L200,20 L0,20 Z"></path>
                  </svg>
                </div>

                {/* Secondary wave for liquid depth */}
                <div className="absolute -top-2 left-0 right-0 w-[200%] h-5 opacity-50 animate-[spin_4s_linear_infinite_reverse]">
                  <svg viewBox="0 0 100 20" className="w-full h-full text-rose-300 fill-current" preserveAspectRatio="none">
                    <path d="M0,10 Q25,20 50,10 T100,10 T150,10 T200,10 L200,20 L0,20 Z"></path>
                  </svg>
                </div>

                {/* Floating Blood Drop Icon in Core */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="p-3 rounded-full bg-rose-950/40 border border-white/20 shadow-inner">
                    <Droplet className="w-8 h-8 text-rose-100 fill-white drop-shadow-md animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Glass Glare Highlight */}
              <div className="absolute inset-y-0 right-2 w-1.5 bg-gradient-to-b from-white/30 via-white/10 to-transparent rounded-full pointer-events-none z-30"></div>
            </div>
          </div>

          <div className="mt-3 text-center space-y-1">
            <div className="text-sm font-black text-white flex items-center justify-center gap-1.5">
              <span>Artisan Reserve:</span>
              <span className="text-rose-400 font-mono">380 Units In District Vault</span>
            </div>
            <p className="text-[10px] text-rose-200/70">
              Verified cooperative blood bank network • Automated cold-chain storage
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: WORKER BLOOD SELECTION, VOLUNTEER PLEDGE & HOSPITAL EMERGENCY RELAYS */}
        <div className="lg:col-span-7 space-y-4">
          <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
            Cooperative brotherhood extends to life-saving emergency care. When a fellow artisan suffers a severe site accident, or a registered citizen requires rapid cross-matched blood, our cooperative dispatch instantly mobilizes matching on-field responders within a 5 km radius.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Blood Group Selector Box */}
            <div className="p-4 rounded-2xl bg-black/30 border border-rose-800/40 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
                Your Registered Blood Type
              </span>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-white flex items-center gap-2">
                  <Droplet className="w-6 h-6 fill-rose-500 text-rose-500" />
                  <span>{bloodGroup}</span>
                </span>
                <select
                  value={bloodGroup}
                  onChange={(e) => handleBloodGroupChange(e.target.value)}
                  className="bg-rose-900 text-white font-bold text-xs rounded-xl px-3 py-1.5 border border-rose-500/40 cursor-pointer outline-none shadow-sm"
                >
                  {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((g) => (
                    <option key={g} value={g} className="bg-slate-900 text-white font-bold">
                      {g}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[10px] text-rose-200/80">
                {bloodGroup === "O+" && "Can donate to O+, A+, B+, AB+ • Critical on-field emergency reserve."}
                {bloodGroup === "O-" && "Universal Red Cell Donor • Compatible with every citizen."}
                {bloodGroup === "A+" && "Can donate to A+, AB+ patients."}
                {bloodGroup === "A-" && "Can donate to A+, A-, AB+, AB- patients."}
                {bloodGroup === "B+" && "Can donate to B+, AB+ patients."}
                {bloodGroup === "B-" && "Can donate to B+, B-, AB+, AB- patients."}
                {bloodGroup === "AB+" && "Universal Plasma Donor • Can receive all blood types."}
                {bloodGroup === "AB-" && "Can donate to AB+, AB- patients."}
              </p>
            </div>

            {/* Emergency Volunteer Donor Status */}
            <div className="p-4 rounded-2xl bg-black/30 border border-rose-800/40 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300 block">
                  Artisan Lifeline Pledge
                </span>
                <div className="text-sm font-bold text-white mt-1">
                  {isVolunteer ? "Active On-Duty Donor Volunteer" : "Standby (Notifications Paused)"}
                </div>
                <p className="text-[10px] text-rose-200/80 mt-1">
                  {isVolunteer
                    ? "You will receive high-priority SOS alerts if someone near your work corridor needs your blood group."
                    : "You will not be notified for emergency blood requirements."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleVolunteer}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isVolunteer
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/30"
                    : "bg-white/20 hover:bg-white/30 text-rose-100"
                }`}
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{isVolunteer ? "Enrolled as Volunteer (Click to Pause)" : "Enroll as Active Volunteer"}</span>
              </button>
            </div>
          </div>

          {/* Active Hospital Emergency Requests in Vijayawada */}
          <div className="p-4 rounded-2xl bg-black/30 border border-rose-800/40 space-y-3">
            <div className="flex items-center justify-between border-b border-rose-900/50 pb-2">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                <span>Active Hospital Emergency Demands (Nearby)</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/40">
                2 Active Calls
              </span>
            </div>

            <div className="space-y-2.5">
              {hospitalRequests.map((req) => (
                <div 
                  key={req.id}
                  className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{req.hospital}</span>
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono font-bold">
                        NEED: {req.neededBlood}
                      </span>
                    </div>
                    <p className="text-[11px] text-rose-200/80">{req.reason}</p>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2 font-mono">
                      <span>{req.distance}</span>
                      <span>•</span>
                      <span className="text-emerald-400">{req.etaLimit}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedHospitalRequest(req);
                      setPledgeConfirmed(false);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Respond to SOS</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Action Strip: Simulate Worksite Trauma Beacon */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-rose-200/90 font-medium">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Guild Honor: <strong>3 Lifetime Donations</strong> • Certified Lifesaver</span>
            </div>

            <button
              type="button"
              onClick={() => setShowSosModal(true)}
              className="py-2.5 px-4 rounded-xl bg-white text-rose-950 hover:bg-rose-50 font-bold text-xs shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-rose-600 animate-bounce" />
              <span>Simulate Worksite Trauma Beacon</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: HOSPITAL EMERGENCY RESPONSE DIALOG */}
      {selectedHospitalRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn text-slate-900">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                  <Heart className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600">
                    Artisan Emergency Donor Confirmation
                  </div>
                  <h4 className="text-base font-black text-slate-900">{selectedHospitalRequest.hospital}</h4>
                </div>
              </div>
              <button
                onClick={() => setSelectedHospitalRequest(null)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {pledgeConfirmed ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto animate-bounce" />
                <h5 className="font-black text-sm">Pledge Confirmed &amp; Dispatched!</h5>
                <p className="text-[11px] text-emerald-800">
                  The hospital trauma coordinator and District Ambulance Relay have been notified. Priority transit token generated for {workerName} ({bloodGroup}).
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedHospitalRequest(null)}
                    className="py-2 px-5 rounded-full bg-emerald-600 text-white font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
                  <div className="font-bold flex items-center justify-between">
                    <span>Required Blood:</span>
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono font-bold">
                      {selectedHospitalRequest.neededBlood} ({selectedHospitalRequest.units})
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-800 leading-relaxed">
                    Patient condition: {selectedHospitalRequest.reason}. Your current location ({selectedHospitalRequest.distance}) is inside the optimal 15-minute response corridor.
                  </p>
                </div>

                <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 font-mono text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span>Donor Name:</span>
                    <span className="font-bold text-slate-900">{workerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Donor Blood Type:</span>
                    <span className="font-bold text-rose-600">{bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cooperative Lifeline Escrow:</span>
                    <span className="font-bold text-emerald-700">Free Non-Profit Service</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setPledgeConfirmed(true)}
                    className="flex-1 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Confirm Emergency Donation Pledge</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedHospitalRequest(null)}
                    className="px-4 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: SIMULATE WORKSITE TRAUMA BEACON */}
      {showSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fadeIn text-slate-900">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-rose-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                  <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600">
                    Simulation Drill
                  </div>
                  <h4 className="text-base font-black text-slate-900">Worksite Trauma Blood Relay Alert</h4>
                </div>
              </div>
              <button
                onClick={() => setShowSosModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              If an artisan on a worksite in Vijayawada experiences severe trauma, high-voltage flashover, or heavy tool injury, this distress protocol activates immediately:
            </p>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 font-mono text-[11px] text-rose-900">
              <div className="flex justify-between">
                <span>1. 108 Emergency Ambulance:</span>
                <span className="font-bold text-emerald-700">DISPATCHED (ETA 6 Mins)</span>
              </div>
              <div className="flex justify-between">
                <span>2. Trauma Hospital Pre-Alert:</span>
                <span className="font-bold text-slate-900">Govt General Hospital ICU</span>
              </div>
              <div className="flex justify-between">
                <span>3. Matching {bloodGroup} Blood Cross-matched:</span>
                <span className="font-bold text-rose-700">2 Units Reserved</span>
              </div>
              <div className="flex justify-between">
                <span>4. Nearby Artisan Guild Donors:</span>
                <span className="font-bold text-indigo-700">8 Notified in 3 km Radius</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  alert("Worksite trauma emergency drill completed successfully.");
                  setShowSosModal(false);
                }}
                className="py-2.5 px-6 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs cursor-pointer"
              >
                Close Drill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

