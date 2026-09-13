import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { HeatmapZone } from "../types";

interface LeafletMapProps {
  center?: [number, number]; // [lat, lon]
  zoom?: number;
  workers?: Array<{
    id: string;
    name: string;
    skills: string[];
    rating: number;
    coordinates: [number, number]; // [lon, lat]
    verificationLevel: number;
  }>;
  customerLocation?: [number, number]; // [lat, lon]
  customerLocationLabel?: string;
  status?: "AVAILABLE" | "COMING_SOON" | "INVALID_PINCODE";
  nearestHubCoordinates?: [number, number]; // [lat, lon]
  nearestHubName?: string;
  zones?: HeatmapZone[];
  onWorkerSelect?: (workerId: string) => void;
  onZoneSelect?: (zone: HeatmapZone) => void;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [16.5062, 80.6480], // default lat/lon
  zoom = 13,
  workers = [],
  customerLocation,
  customerLocationLabel,
  status = "AVAILABLE",
  nearestHubCoordinates,
  nearestHubName,
  zones = [],
  onWorkerSelect,
  onZoneSelect,
  height = "380px"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(center, zoom);

      // OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Map cleanup if container is unmounted
    };
  }, []);

  // Update map view smoothly when center changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center[0], center[1], zoom]);

  // Update markers, routes, and zones whenever data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    // 1. Add Customer / Locality Marker if available
    if (customerLocation) {
      const isComingSoon = status === "COMING_SOON";
      const pinColor = isComingSoon ? "#f59e0b" : "#2563eb";
      const pinIcon = isComingSoon ? "⏳" : "🏠";

      const custIcon = L.divIcon({
        className: "custom-customer-pin",
        html: `
          <div style="background-color: ${pinColor}; color: white; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.35); font-size: 15px; position: relative;">
            ${pinIcon}
            ${isComingSoon ? '<span style="position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; background: #ef4444; border-radius: 50%; border: 2px solid white;"></span>' : ""}
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });

      const popupContent = isComingSoon
        ? `<div style="font-family: sans-serif; min-width: 160px;">
            <strong style="color: #0f172a; font-size: 13px;">${customerLocationLabel || "Your Locality"}</strong><br/>
            <span style="color: #b45309; font-size: 11px; font-weight: 600;">COOPNEX Expansion Area</span><br/>
            <span style="color: #64748b; font-size: 11px;">Coverage launch in progress</span>
           </div>`
        : `<div style="font-family: sans-serif; min-width: 160px;">
            <strong style="color: #0f172a; font-size: 13px;">${customerLocationLabel || "Your Service Location"}</strong><br/>
            <span style="color: #16a34a; font-size: 11px; font-weight: 600;">✓ Active Service Hub Area</span>
           </div>`;

      L.marker(customerLocation, { icon: custIcon })
        .addTo(layerGroupRef.current)
        .bindPopup(popupContent);
    }

    // 2. If COMING_SOON and nearestHubCoordinates provided, render nearest hub marker and connection route
    if (status === "COMING_SOON" && customerLocation && nearestHubCoordinates) {
      const hubIcon = L.divIcon({
        className: "custom-hub-pin",
        html: `
          <div style="background-color: #0f766e; color: white; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.25); font-size: 14px;">
            🏢
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      L.marker(nearestHubCoordinates, { icon: hubIcon })
        .addTo(layerGroupRef.current)
        .bindPopup(`
          <div style="font-family: sans-serif; min-width: 170px;">
            <strong style="font-size: 13px; color: #0f766e;">${nearestHubName || "Nearest Operational Hub"}</strong><br/>
            <span style="font-size: 11px; color: #16a34a; font-weight: 600;">✓ Active Cooperative Network</span><br/>
            <span style="font-size: 11px; color: #64748b;">Expansion corridor active</span>
          </div>
        `);

      // Draw dashed connecting route representing expansion
      L.polyline([customerLocation, nearestHubCoordinates], {
        color: "#f59e0b",
        weight: 3,
        opacity: 0.8,
        dashArray: "6, 8",
        lineCap: "round"
      }).addTo(layerGroupRef.current).bindPopup(`
        <div style="font-family: sans-serif; font-size: 11px; color: #475569;">
          <strong>Planned Expansion Corridor</strong><br/>
          From ${nearestHubName || "Active Hub"} to your district
        </div>
      `);
    }

    // 3. Add Worker Markers (only if available)
    if (status === "AVAILABLE") {
      workers.forEach((w) => {
        const [lon, lat] = w.coordinates;
        const workerIcon = L.divIcon({
          className: "custom-worker-pin",
          html: `
            <div style="background-color: #0f766e; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #f59e0b; box-shadow: 0 4px 6px rgba(0,0,0,0.25); font-weight: bold; font-size: 11px;">
              ${w.verificationLevel >= 4 ? "★" : "✓"}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([lat, lon], { icon: workerIcon })
          .addTo(layerGroupRef.current!)
          .bindPopup(`
            <div style="font-family: sans-serif; min-width: 140px;">
              <strong style="font-size: 13px; color: #0f172a;">${w.name}</strong><br/>
              <span style="font-size: 11px; color: #0f766e; font-weight: 600;">${w.skills.join(", ")}</span><br/>
              <span style="font-size: 11px; color: #64748b;">Rating: ${w.rating}★ • Level ${w.verificationLevel} Verified</span>
            </div>
          `);

        marker.on("click", () => {
          if (onWorkerSelect) onWorkerSelect(w.id);
        });
      });
    }

    // 4. Add Heatmap Circles for Demand Zones
    zones.forEach((z) => {
      const [lon, lat] = z.coordinates;
      let color = "#10b981"; // Low = Green
      if (z.demandLevel === "MEDIUM") color = "#f59e0b"; // Yellow/Orange
      if (z.demandLevel === "HIGH") color = "#ea580c";   // Orange
      if (z.demandLevel === "CRITICAL") color = "#dc2626"; // Red

      const circle = L.circle([lat, lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.28,
        radius: 1400
      }).addTo(layerGroupRef.current!);

      circle.bindPopup(`
        <div style="font-family: sans-serif; min-width: 170px;">
          <strong style="font-size: 13px; color: #0f172a;">${z.zoneName}</strong><br/>
          <span style="font-size: 11px; font-weight: bold; color: ${color};">Demand: ${z.demandLevel} (${z.demandVolume} req)</span><br/>
          <span style="font-size: 11px; color: #475569;">Available Workers: ${z.availableWorkers}</span><br/>
          <span style="font-size: 11px; color: #dc2626; font-weight: 600;">Shortage: ${z.shortage} workers</span><br/>
          <p style="font-size: 10px; color: #0f766e; margin-top: 4px;">AI: ${z.aiRecommendation}</p>
        </div>
      `);

      circle.on("click", () => {
        if (onZoneSelect) onZoneSelect(z);
      });
    });
  }, [workers, customerLocation, customerLocationLabel, status, nearestHubCoordinates, nearestHubName, zones]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-slate-600 font-medium z-[1000] border border-slate-200 shadow-xs">
        📍 OpenStreetMap / MapLibre Geospatial Layer • 2dsphere Indexed
      </div>
    </div>
  );
};

