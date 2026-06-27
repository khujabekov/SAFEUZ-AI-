import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// @ts-ignore
import sirdaryoGeoJsonUrl from "./sirdaryo.geojson?url";
import { Compass, ZoomIn, ZoomOut, Maximize2, Layers } from "lucide-react";

interface AIOCMapProps {
  height?: string;
  layerType: "risk" | "heatmap" | "density";
  focusedDistrict: string;
  focusedCoords?: [number, number];
  liveIncidents: Array<{
    id: string;
    incident: string;
    district: string;
    riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    status: string;
    latitude?: string;
    longitude?: string;
  }>;
}

const DISTRICT_COORDS: Record<string, { center: [number, number]; id: string }> = {
  "Guliston Shahri": { center: [68.78, 40.49], id: "guliston_sh" },
  "Sirdaryo Tumani": { center: [68.66, 40.85], id: "sirdaryo" },
  "Yangiyer Shahri": { center: [68.83, 40.26], id: "yangiyer_sh" },
  "Boyovut Tumani": { center: [68.96, 40.38], id: "boyovut" },
  "Xovos Tumani": { center: [68.68, 40.21], id: "xovos" },
  "Shirin Shahri": { center: [69.11, 40.23], id: "shirin_sh" },
  "Sayxunobod Tumani": { center: [68.88, 40.61], id: "sayxunobod" },
  "Sardoba Tumani": { center: [68.43, 40.22], id: "sardoba" },
  "Mirzaobod Tumani": { center: [68.56, 40.47], id: "mirzaobod" },
  "Oqoltin Tumani": { center: [68.22, 40.41], id: "oqoltin" },
  "Guliston Tumani": { center: [68.75, 40.54], id: "guliston_t" }
};

const RISK_COLORS: Record<string, string> = {
  "Critical": "#FF3B30",
  "High": "#FF9500",
  "Medium": "#FFCC00",
  "Patrol": "#34C759",
  "Safe": "#30D158"
};

const DISTRICT_RISKS: Record<string, "Critical" | "High" | "Medium" | "Patrol" | "Safe"> = {
  "guliston_sh": "Critical",
  "sirdaryo": "High",
  "yangiyer_sh": "High",
  "boyovut": "High",
  "xovos": "High",
  "shirin_sh": "Medium",
  "sayxunobod": "Patrol",
  "sardoba": "Medium",
  "mirzaobod": "Medium",
  "oqoltin": "Safe",
  "guliston_t": "Medium"
};

export default function AIOCMap({ height = "750px", layerType, focusedDistrict, focusedCoords, liveIncidents }: AIOCMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const isLoadedRef = useRef(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [68.68, 40.48], // Centered on Sirdaryo
      zoom: 8.9,             // Perfect bounding box zoom
      pitch: 42,             // HUD style angled view
      bearing: -6,
      attributionControl: false
    });

    mapRef.current = map;

    map.on("load", async () => {
      isLoadedRef.current = true;
      try {
        const response = await fetch(sirdaryoGeoJsonUrl);
        const geojson = await response.json();

        // Add Sirdaryo GeoJSON source
        map.addSource("sirdaryo-districts", {
          type: "geojson",
          data: geojson
        });

        // 1. Core Fill layer
        map.addLayer({
          id: "districts-fill",
          type: "fill",
          source: "sirdaryo-districts",
          paint: {
            "fill-color": [
              "match",
              ["downcase", ["get", "ADM2_EN"]],
              "guliston city", RISK_COLORS.Critical,
              "yangiyer city", RISK_COLORS.High,
              "shirin city", RISK_COLORS.Medium,
              "guliston district", RISK_COLORS.Medium,
              "sirdaryo district", RISK_COLORS.High,
              "boyovut district", RISK_COLORS.High,
              "xovos district", RISK_COLORS.High,
              "sayxunobod district", RISK_COLORS.Patrol,
              "sardoba district", RISK_COLORS.Medium,
              "mirzaobod district", RISK_COLORS.Medium,
              "oqoltin district", RISK_COLORS.Safe,
              "#1e293b" // Fallback dark blue-gray
            ],
            "fill-opacity": 0.25
          }
        });

        // 2. Glowing Layer
        map.addLayer({
          id: "districts-glow",
          type: "line",
          source: "sirdaryo-districts",
          paint: {
            "line-color": [
              "match",
              ["downcase", ["get", "ADM2_EN"]],
              "guliston city", RISK_COLORS.Critical,
              "yangiyer city", RISK_COLORS.High,
              "shirin city", RISK_COLORS.Medium,
              "guliston district", RISK_COLORS.Medium,
              "sirdaryo district", RISK_COLORS.High,
              "boyovut district", RISK_COLORS.High,
              "xovos district", RISK_COLORS.High,
              "sayxunobod district", RISK_COLORS.Patrol,
              "sardoba district", RISK_COLORS.Medium,
              "mirzaobod district", RISK_COLORS.Medium,
              "oqoltin district", RISK_COLORS.Safe,
              "#3b82f6"
            ],
            "line-width": 4.5,
            "line-blur": 3.0,
            "line-opacity": 0.4
          }
        });

        // 3. Crisp Border Layer
        map.addLayer({
          id: "districts-border",
          type: "line",
          source: "sirdaryo-districts",
          paint: {
            "line-color": [
              "match",
              ["downcase", ["get", "ADM2_EN"]],
              "guliston city", RISK_COLORS.Critical,
              "yangiyer city", RISK_COLORS.High,
              "shirin city", RISK_COLORS.Medium,
              "guliston district", RISK_COLORS.Medium,
              "sirdaryo district", RISK_COLORS.High,
              "boyovut district", RISK_COLORS.High,
              "xovos district", RISK_COLORS.High,
              "sayxunobod district", RISK_COLORS.Patrol,
              "sardoba district", RISK_COLORS.Medium,
              "mirzaobod district", RISK_COLORS.Medium,
              "oqoltin district", RISK_COLORS.Safe,
              "#ffffff"
            ],
            "line-width": 1.5,
            "line-opacity": 0.8
          }
        });

        // Add a pulsing Heatmap simulation layer if requested
        if (layerType === "heatmap") {
          // Add dummy heat points around critical centers for visualization
          const heatFeatures = [];
          Object.entries(DISTRICT_COORDS).forEach(([name, val]) => {
            const level = DISTRICT_RISKS[val.id];
            const weight = level === "Critical" ? 0.9 : level === "High" ? 0.7 : level === "Medium" ? 0.4 : 0.2;
            
            // Add a cluster of points
            for (let i = 0; i < 6; i++) {
              const dx = (Math.random() - 0.5) * 0.04;
              const dy = (Math.random() - 0.5) * 0.04;
              heatFeatures.push({
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [val.center[0] + dx, val.center[1] + dy]
                },
                properties: { weight }
              });
            }
          });

          map.addSource("heatmap-points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: heatFeatures
            } as any
          });

          map.addLayer({
            id: "heatmap-layer",
            type: "heatmap",
            source: "heatmap-points",
            maxzoom: 15,
            paint: {
              "heatmap-weight": ["get", "weight"],
              "heatmap-intensity": 1.8,
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0, "rgba(0, 0, 255, 0)",
                0.2, "rgba(59, 130, 246, 0.4)",
                0.4, "rgba(16, 185, 129, 0.6)",
                0.6, "rgba(245, 158, 11, 0.8)",
                0.8, "rgba(239, 68, 68, 0.9)"
              ],
              "heatmap-radius": 35,
              "heatmap-opacity": 0.65
            }
          });
        }

        // Mouse handlers
        map.on("mouseenter", "districts-fill", () => {
          map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "districts-fill", () => {
          map.getCanvas().style.cursor = "";
        });

        map.on("click", "districts-fill", (e) => {
          if (e.features && e.features[0]) {
            const props = e.features[0].properties;
            const rawName = props?.ADM2_EN || "";
            
            // Look up corresponding local district name
            let foundName = "Guliston Shahri";
            Object.entries(DISTRICT_COORDS).forEach(([localName, data]) => {
              const districtNamePart = data.id.split('_')[0].toLowerCase();
              if (rawName.toLowerCase().includes(districtNamePart)) {
                foundName = localName;
              }
            });

            // Trigger panning
            const data = DISTRICT_COORDS[foundName];
            if (data) {
              map.easeTo({
                center: data.center,
                zoom: 11.2,
                pitch: 50,
                duration: 1000
              });
            }
          }
        });

      } catch (err) {
        console.error("Failed to setup map layers:", err);
      }
    });

    return () => {
      map.remove();
    };
  }, []);

  // Sync Layer Type
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    if (map.getLayer("heatmap-layer")) {
      map.setLayoutProperty("heatmap-layer", "visibility", layerType === "heatmap" ? "visible" : "none");
    } else if (layerType === "heatmap") {
      // Re-trigger load heatmap if source exists
      try {
        const heatFeatures = [];
        Object.entries(DISTRICT_COORDS).forEach(([name, val]) => {
          const level = DISTRICT_RISKS[val.id];
          const weight = level === "Critical" ? 0.9 : level === "High" ? 0.7 : level === "Medium" ? 0.4 : 0.2;
          for (let i = 0; i < 6; i++) {
            const dx = (Math.random() - 0.5) * 0.04;
            const dy = (Math.random() - 0.5) * 0.04;
            heatFeatures.push({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [val.center[0] + dx, val.center[1] + dy]
              },
              properties: { weight }
            });
          }
        });

        if (!map.getSource("heatmap-points")) {
          map.addSource("heatmap-points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: heatFeatures
            } as any
          });
        }

        map.addLayer({
          id: "heatmap-layer",
          type: "heatmap",
          source: "heatmap-points",
          maxzoom: 15,
          paint: {
            "heatmap-weight": ["get", "weight"],
            "heatmap-intensity": 1.8,
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0, "rgba(0, 0, 255, 0)",
              0.2, "rgba(59, 130, 246, 0.4)",
              0.4, "rgba(16, 185, 129, 0.6)",
              0.6, "rgba(245, 158, 11, 0.8)",
              0.8, "rgba(239, 68, 68, 0.9)"
            ],
            "heatmap-radius": 35,
            "heatmap-opacity": 0.65
          }
        });
      } catch (e) {}
    }

    // Dynamic opacities based on layer type
    if (map.getLayer("districts-fill")) {
      map.setPaintProperty(
        "districts-fill", 
        "fill-opacity", 
        layerType === "heatmap" ? 0.12 : layerType === "density" ? 0.4 : 0.25
      );
    }
  }, [layerType]);

  // Handle focused district panning or focusedCoords
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (focusedCoords) {
      map.easeTo({
        center: focusedCoords,
        zoom: 14.0,
        pitch: 52,
        bearing: -8,
        duration: 1200
      });
    } else if (focusedDistrict) {
      const data = DISTRICT_COORDS[focusedDistrict];
      if (data) {
        map.easeTo({
          center: data.center,
          zoom: 11.4,
          pitch: 52,
          bearing: -8,
          duration: 1200
        });
      }
    }
  }, [focusedDistrict, focusedCoords]);

  // Handle dynamic Live Incident Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add beacons to map for all incidents
    liveIncidents.forEach((inc) => {
      let center: [number, number] | null = null;
      if (inc.latitude && inc.longitude) {
        const lat = parseFloat(inc.latitude);
        const lng = parseFloat(inc.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          center = [lng, lat];
        }
      }

      if (!center && inc.district) {
        const coordData = DISTRICT_COORDS[inc.district];
        if (coordData) {
          center = coordData.center;
        }
      }

      if (!center) return;

      const el = document.createElement("div");
      el.className = "relative flex items-center justify-center cursor-pointer group";
      
      const isCritical = inc.riskLevel === "CRITICAL";
      const color = isCritical ? "#FF3B30" : "#FF9500";

      // Glow pulse wave
      const wave = document.createElement("div");
      wave.className = "absolute rounded-full border animate-ping pointer-events-none";
      wave.style.borderColor = color;
      wave.style.width = isCritical ? "38px" : "28px";
      wave.style.height = isCritical ? "38px" : "28px";
      wave.style.opacity = "0.75";
      wave.style.animationDuration = isCritical ? "1.1s" : "1.8s";

      // Inner glowing core
      const core = document.createElement("div");
      core.className = "w-4 h-4 rounded-full border-2 border-white shadow-lg transition-transform duration-300 hover:scale-125 flex items-center justify-center relative";
      core.style.backgroundColor = color;
      core.style.boxShadow = `0 0 12px ${color}`;

      // Floating indicator dot
      const alertBadge = document.createElement("div");
      alertBadge.className = "absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full flex items-center justify-center text-[7px] font-black text-black scale-90";
      alertBadge.innerText = "!";

      core.appendChild(alertBadge);
      el.appendChild(wave);
      el.appendChild(core);

      // Simple interactive popup
      const popupHtml = `
        <div style="background-color: #0c1524; color: #fff; padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.12); font-family: monospace; font-size: 11px; max-width: 220px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5)">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; align-items: center">
            <span style="color: ${color}; font-weight: bold; text-transform: uppercase">${inc.riskLevel}</span>
            <span style="color: rgba(255,255,255,0.4)">${inc.id}</span>
          </div>
          <div style="font-weight: bold; margin-bottom: 6px; line-height: 1.3">${inc.incident}</div>
          <div style="color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 4px">
            📍 ${inc.district}
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 12, closeButton: false })
        .setHTML(popupHtml);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(center)
        .setPopup(popup)
        .addTo(map);

      // Auto-show popup if focused
      if (focusedDistrict === inc.district) {
        marker.togglePopup();
      }

      markersRef.current.push(marker);
    });

  }, [liveIncidents, focusedDistrict, focusedCoords]);

  // Native map zoom helpers
  const zoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const zoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const resetBearing = () => {
    mapRef.current?.easeTo({
      pitch: 42,
      bearing: -6,
      zoom: 8.9,
      center: [68.68, 40.48],
      duration: 1000
    });
  };

  return (
    <div className="relative w-full h-full" style={{ height }}>
      {/* Actual Map Container */}
      <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

      {/* Futuristic Cyber Overlay Grid and subtle scanlines */}
      <div className="absolute inset-0 pointer-events-none border border-blue-500/10 z-10" />

      {/* Cybernetic HUD Controls Sidebar (Clean, floating in top-left) */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 bg-black/60 border border-white/10 p-1.5 rounded-xl backdrop-blur-md">
        <button 
          onClick={zoomIn}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
          title="Yaqinlashtirish"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={zoomOut}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
          title="Uzoqlashtirish"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={resetBearing}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
          title="Kamera holatini tiklash"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Floating HUD Legends (At bottom-left) */}
      <div className="absolute bottom-4 left-4 z-20 bg-black/75 border border-white/10 p-4 rounded-2xl backdrop-blur-md max-w-xs space-y-3 pointer-events-auto">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500 block border-b border-white/5 pb-1.5">
          HUD TAHLIL SHKALASI (LEGEND)
        </span>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS.Critical }} />
            <span className="text-white/80">Kritik (Red)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS.High }} />
            <span className="text-white/80">Yuqori (Orange)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS.Medium }} />
            <span className="text-white/80">O'rta (Yellow)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS.Patrol }} />
            <span className="text-white/80">Patrul (Blue)</span>
          </div>
        </div>

        <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[9px] font-mono text-gray-400">
          <span>DOKUMENT: GEOJSON_V1_SIR</span>
          <span className="text-emerald-400 font-bold">LIVE_DATA</span>
        </div>
      </div>

      {/* Floating HUD Telemetry (At top-right) */}
      <div className="absolute top-4 right-4 z-20 bg-black/75 border border-blue-500/20 p-4 rounded-2xl backdrop-blur-md space-y-2 select-none">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400">
            GIS_METRIC_STATUS
          </span>
        </div>
        <div className="space-y-1 text-[10px] font-mono text-gray-400">
          <div>HUDUD: <span className="text-white font-bold">{focusedDistrict}</span></div>
          <div>MARKERLAR: <span className="text-white">{liveIncidents.length} ta faol</span></div>
          <div>BORD-PROS: <span className="text-blue-400 font-semibold">100% ONLINE</span></div>
        </div>
      </div>
    </div>
  );
}
