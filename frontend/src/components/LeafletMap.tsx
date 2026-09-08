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
  zones?: HeatmapZone[];
  onWorkerSelect?: (workerId: string) => void;
  onZoneSelect?: (zone: HeatmapZone) => void;
  height?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [16.5062, 80.6480], // Vijayawada
  zoom = 13,
  workers = [],
  customerLocation,
  zones = [],
  onWorkerSelect,
  onZoneSelect,
  height = "380px"
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

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

  // Update markers and zones whenever data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    // 1. Add Customer Marker if available
    if (customerLocation) {
      const custIcon = L.divIcon({
        className: "custom-customer-pin",
        html: `
          <div style="background-color: #2563eb; color: white; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); font-weight: bold; font-size: 14px;">
            🏠
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      L.marker(customerLocation, { icon: custIcon })
        .addTo(layerGroupRef.current)
        .bindPopup("<b>Your Service Location</b><br>Benz Circle, Vijayawada");
    }

    // 2. Add Worker Markers
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

    // 3. Add Heatmap Circles for Demand Zones
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
  }, [workers, customerLocation, zones]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} style={{ height, width: "100%" }} />
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] text-slate-600 font-medium z-[1000] border border-slate-200 shadow-xs">
        📍 OpenStreetMap / MapLibre Geospatial Layer • 2dsphere Indexed
      </div>
    </div>
  );
};

