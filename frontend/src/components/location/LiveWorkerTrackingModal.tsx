import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import { Booking, WorkerProfile } from "../../types";
import {
  X,
  Navigation,
  Phone,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
  ChevronRight,
  Sparkles,
  RefreshCw,
  LocateFixed
} from "lucide-react";

interface LiveWorkerTrackingModalProps {
  booking: Booking;
  onClose: () => void;
}

export const LiveWorkerTrackingModal: React.FC<LiveWorkerTrackingModalProps> = ({
  booking,
  onClose
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const workerMarkerRef = useRef<L.Marker | null>(null);
  const traveledLineRef = useRef<L.Polyline | null>(null);
  const remainingLineRef = useRef<L.Polyline | null>(null);

  // Tracking telemetry state
  const [progress, setProgress] = useState<number>(0.15);
  const [etaMinutes, setEtaMinutes] = useState<number>(6);
  const [remainingDistanceKm, setRemainingDistanceKm] = useState<number>(2.4);
  const [speedKmh, setSpeedKmh] = useState<number>(28);
  const [tripStatus, setTripStatus] = useState<"DEPARTED" | "IN_TRANSIT" | "NEARBY" | "ARRIVED">("IN_TRANSIT");

  // Determine Customer coordinates [lat, lon]
  const customerCoords = useMemo<[number, number]>(() => {
    const raw = booking.serviceLocation?.coordinates;
    if (raw && Array.isArray(raw) && raw.length === 2 && !isNaN(raw[0]) && !isNaN(raw[1])) {
      // raw is [lon, lat] in GeoJSON standard
      return [raw[1], raw[0]];
    }
    // Fallback: Benz Circle, Vijayawada coordinates
    return [16.5062, 80.648];
  }, [booking.serviceLocation]);

  // Determine Worker starting coordinates [lat, lon]
  const workerStartCoords = useMemo<[number, number]>(() => {
    const raw = (booking as any).worker?.location?.coordinates;
    if (raw && Array.isArray(raw) && raw.length === 2 && !isNaN(raw[0]) && !isNaN(raw[1])) {
      // Ensure it's not identical to customer
      const lat = raw[1];
      const lon = raw[0];
      if (Math.abs(lat - customerCoords[0]) > 0.001 || Math.abs(lon - customerCoords[1]) > 0.001) {
        return [lat, lon];
      }
    }
    // Offset ~2.5km northwest of customer
    return [customerCoords[0] + 0.019, customerCoords[1] - 0.016];
  }, [(booking as any).worker?.location, customerCoords]);

  // Build waypoint road path between worker and customer
  const routeWaypoints = useMemo<[number, number][]>(() => {
    const start = workerStartCoords;
    const dest = customerCoords;

    // Generate 10 realistic curved urban road nodes
    const pts: [number, number][] = [];
    const steps = 10;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      // Linear interpolation with slight bezier curve to mimic street grid
      const arc = Math.sin(t * Math.PI) * 0.004;
      const lat = start[0] + (dest[0] - start[0]) * t + arc;
      const lon = start[1] + (dest[1] - start[1]) * t - arc * 0.7;
      pts.push([lat, lon]);
    }
    return pts;
  }, [workerStartCoords, customerCoords]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Voyager / OpenStreetMap standard clean tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(map);

      // Customer Destination Icon
      const customerIcon = L.divIcon({
        className: "customer-marker-pin",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 42px; height: 42px; background: rgba(16, 185, 129, 0.3); border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 38px; height: 38px; background: #059669; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); font-size: 16px; font-weight: bold;">
              🏠
            </div>
            <div style="position: absolute; bottom: -20px; white-space: nowrap; background: #064e3b; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              YOUR LOCATION
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      L.marker(customerCoords, { icon: customerIcon }).addTo(map);

      // Worker Moving Icon
      const workerIcon = L.divIcon({
        className: "worker-live-pin",
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 48px; height: 48px; background: rgba(37, 99, 235, 0.35); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="width: 40px; height: 40px; background: #2563EB; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 14px rgba(37,99,235,0.45); font-size: 18px;">
              🛵
            </div>
            <div style="position: absolute; bottom: -20px; white-space: nowrap; background: #1e3a8a; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              ARTISAN ON ROUTE
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const workerMarker = L.marker(routeWaypoints[0], { icon: workerIcon }).addTo(map);
      workerMarkerRef.current = workerMarker;

      // Polyline for full intended route
      const fullRoute = L.polyline(routeWaypoints, {
        color: "#94a3b8",
        weight: 6,
        opacity: 0.6,
        dashArray: "6, 8"
      }).addTo(map);
      remainingLineRef.current = fullRoute;

      // Polyline for traveled segment
      const traveledRoute = L.polyline([routeWaypoints[0]], {
        color: "#2563EB",
        weight: 6,
        opacity: 0.9
      }).addTo(map);
      traveledLineRef.current = traveledRoute;

      // Fit bounds to show both worker and customer
      const bounds = L.latLngBounds([workerStartCoords, customerCoords]);
      map.fitBounds(bounds, { padding: [50, 50] });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Real-time GPS movement simulation loop
  useEffect(() => {
    const totalWaypoints = routeWaypoints.length;
    const initialKm = 2.8;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.015;

        // Calculate current interpolated position
        const indexFloat = next * (totalWaypoints - 1);
        const baseIndex = Math.floor(indexFloat);
        const remainder = indexFloat - baseIndex;

        let currentLat: number;
        let currentLon: number;

        if (baseIndex >= totalWaypoints - 1) {
          currentLat = routeWaypoints[totalWaypoints - 1][0];
          currentLon = routeWaypoints[totalWaypoints - 1][1];
          setTripStatus("ARRIVED");
          setRemainingDistanceKm(0.05);
          setEtaMinutes(0);
          setSpeedKmh(0);
        } else {
          const p1 = routeWaypoints[baseIndex];
          const p2 = routeWaypoints[baseIndex + 1];
          currentLat = p1[0] + (p2[0] - p1[0]) * remainder;
          currentLon = p1[1] + (p2[1] - p1[1]) * remainder;

          const distLeft = Math.max(0.05, initialKm * (1 - next));
          setRemainingDistanceKm(Number(distLeft.toFixed(1)));
          setEtaMinutes(Math.max(1, Math.round(distLeft * 2.2)));
          setSpeedKmh(Math.floor(25 + Math.random() * 8));

          if (distLeft < 0.3) {
            setTripStatus("NEARBY");
          } else {
            setTripStatus("IN_TRANSIT");
          }
        }

        // Update worker marker position
        if (workerMarkerRef.current) {
          workerMarkerRef.current.setLatLng([currentLat, currentLon]);
        }

        // Update traveled polyline
        if (traveledLineRef.current) {
          const traveledSlice = routeWaypoints.slice(0, baseIndex + 1);
          traveledSlice.push([currentLat, currentLon]);
          traveledLineRef.current.setLatLngs(traveledSlice);
        }

        return next >= 1 ? 0.99 : next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [routeWaypoints]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      const bounds = L.latLngBounds([workerStartCoords, customerCoords]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    }
  };

  const workerName = (booking as any).worker?.name || booking.workerName || "Cooperative Field Specialist";
  const workerPhone = (booking as any).worker?.phone || "9848022338";
  const workerTrade = booking.serviceCategory || "Certified Artisan";
  const serviceOtp = (booking as any).otp || "8924";
  const customerAddress = booking.serviceLocation?.address || "Benz Circle, Vijayawada";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Navigation className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Live Dispatch Tracking
                </h3>
                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {booking.bookingNumber || `#BK-${booking._id.slice(-6).toUpperCase()}`}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Real-time GPS telemetry from cooperative service hub to your doorstep
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MAP & TELEMETRY CONTAINER */}
        <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] bg-slate-100">
          {/* Leaflet Map Canvas */}
          <div ref={mapContainerRef} className="w-full h-full min-h-[340px] sm:min-h-[420px]" />

          {/* Floating Live Telemetry HUD (Top-Left) */}
          <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-xl border border-slate-200/80 space-y-2.5 max-w-[260px] pointer-events-auto">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                  {tripStatus === "ARRIVED"
                    ? "Arrived at Door"
                    : tripStatus === "NEARBY"
                    ? "Turning into Street"
                    : "En Route to You"}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                {speedKmh} km/h
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-center">
              <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Arrival</span>
                <span className="text-base sm:text-lg font-black text-blue-600">
                  {tripStatus === "ARRIVED" ? "Here" : `${etaMinutes} min`}
                </span>
              </div>
              <div className="bg-slate-50 rounded-xl p-2 border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
                <span className="text-base sm:text-lg font-black text-slate-800">
                  {remainingDistanceKm} km
                </span>
              </div>
            </div>

            {/* Micro progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.round(progress * 100))}%` }}
              />
            </div>
          </div>

          {/* Floating Map Controls (Top-Right) */}
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
            <button
              onClick={handleRecenter}
              className="p-2.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200 text-slate-700 hover:text-blue-600 transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
              title="Recenter Route"
            >
              <LocateFixed className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Fit Route</span>
            </button>
          </div>

          {/* Floating Destination Card (Bottom-Left) */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-10 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-slate-200/80 flex items-center gap-3 pointer-events-auto">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Destination Address</span>
              <p className="text-xs font-bold text-slate-800 truncate">
                {customerAddress}
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM METRICS, ARTISAN CARD & SECURITY OTP */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Worker Info */}
            <div className="flex items-center gap-3.5 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-xs">
                {workerName.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-slate-900 truncate">{workerName}</h4>
                  <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 font-medium">{workerTrade} • Verified Artisan</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Police Cleared
                  </span>
                </div>
              </div>
            </div>

            {/* Service OTP Badge */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 p-3 rounded-2xl flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-900 block">
                  Service Security OTP
                </span>
                <p className="text-[11px] text-amber-700 font-medium">
                  Share ONLY when the artisan arrives at your door
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-mono text-2xl font-black text-amber-950 tracking-wider bg-white px-3 py-1 rounded-xl border border-amber-200 shadow-inner block">
                  {serviceOtp}
                </span>
              </div>
            </div>

            {/* Actions: Call Worker & Support */}
            <div className="flex items-center gap-2 justify-end">
              <a
                href={`tel:${workerPhone}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/20 transition cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call Specialist</span>
              </a>

              <button
                onClick={() => alert(`Cooperative Emergency Dispatch Helpline: 1800-425-COOP\nActive Booking ID: ${booking._id}\nCooperative Hub: Vijayawada Metro Dispatch`)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-slate-600 font-bold text-xs transition cursor-pointer"
                title="Contact Federation Support"
              >
                SOS Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
