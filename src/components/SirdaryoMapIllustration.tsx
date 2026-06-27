import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { 
  Info, 
  Globe,
  Compass
} from "lucide-react";
// @ts-ignore
import sirdaryoGeoJsonUrl from "./sirdaryo.geojson?url";

// Types
interface RiskRegion {
  id: string;
  name: string; // Region Name
  district: string; // District/City
  riskLevel: "Safe" | "Medium" | "High" | "Critical" | "Patrol";
  confidence: number; // AI Confidence (%)
  reports: number; // Number of Reports
  lastUpdate: string; // Last Detection Time
  status: string; // Status
  latLonString: string; // Coordinates
  description: string; // Description
  recommendedAction: string; // Recommended Action
  center: [number, number]; // For camera panning
  coordinates?: [number, number][][]; // Polygon outer rings - deprecated in favor of GeoJSON
}

// Color mapping matching futuristic cyber-security specs
const RISK_COLORS = {
  Safe: "#00FF7F",      // Green — Safe Zone
  Medium: "#FFD54F",    // Yellow — Medium Risk
  High: "#FF9800",      // Orange — High Risk
  Critical: "#FF3B30",  // Red — Critical Risk
  Patrol: "#2196F3"     // Blue — Police / Monitoring Zone
};

// Uzbek translations for Risk Levels
const RISK_LABELS_UZ = {
  Safe: "Xavfsiz Hudud (Safe Zone)",
  Medium: "O'rtacha Xavf (Medium Risk)",
  High: "Yuqori Xavf (High Risk)",
  Critical: "Kritik Xavf (Critical Risk)",
  Patrol: "Monitoring Hududi (Police / Monitoring)"
};

// Sirdaryo Region Centered Data - 11 actual districts with geographic polygon shapes
const SIRDARYO_REGIONS: RiskRegion[] = [
  {
    id: "guliston_sh",
    name: "Guliston Shahri",
    district: "Guliston shahri (Viloyat markazi)",
    riskLevel: "Critical",
    confidence: 95,
    reports: 45,
    lastUpdate: "Bugun, 16:10",
    status: "Fikr-mulohazalar va anomal kiber-faollik",
    latLonString: "40.4894° N, 68.7842° E",
    description: "Telegram kanallari orqali noqonuniy reklama va kiber-firibgarlik havolalari aniqlangan.",
    recommendedAction: "Kiber-patrul xizmati monitoringini kuchaytirish.",
    center: [68.7842, 40.4894]
  },
  {
    id: "sirdaryo_t",
    name: "Sirdaryo Tumani",
    district: "Sirdaryo tumani va logistika tuguni",
    riskLevel: "High",
    confidence: 88,
    reports: 28,
    lastUpdate: "Bugun, 15:30",
    status: "Kuchaytirilgan kiber-tahlil",
    latLonString: "40.8433° N, 68.6640° E",
    description: "Transport haydovchilariga qaratilgan phishing saytlari harakati aniqlandi.",
    recommendedAction: "Soxta to'lov tizimlarining xosting IP-manzillarini bloklash.",
    center: [68.6640, 40.8433]
  },
  {
    id: "boyovut",
    name: "Boyovut Tumani",
    district: "Boyovut tumani hududlari",
    riskLevel: "High",
    confidence: 84,
    reports: 19,
    lastUpdate: "Kecha, 18:45",
    status: "Faol kiber-skanerlash",
    latLonString: "40.4350° N, 68.9660° E",
    description: "Mahalliy guruhlarda soxta subsidiyalar va fishing havolalar tarqalishi.",
    recommendedAction: "Domenlarni tezkorlik bilan o'chirish choralarini ko'rish.",
    center: [68.9660, 40.4350]
  },
  {
    id: "mirzaobod",
    name: "Mirzaobod Tumani",
    district: "Mirzaobod agrar hududi",
    riskLevel: "Medium",
    confidence: 81,
    reports: 11,
    lastUpdate: "Bugun, 09:25",
    status: "Mo'tadil kiber-nazorat",
    latLonString: "40.5200° N, 68.5800° E",
    description: "Qishloq xo'jaligi sohasi xodimlariga soxta kompensatsiyalar va'da qiluvchi botlar.",
    recommendedAction: "Fishing kanallarini tahlil qilish va bloklash.",
    center: [68.5800, 40.5200],
    coordinates: [[
      [68.450, 40.620],
      [68.670, 40.580],
      [68.670, 40.440],
      [68.480, 40.440],
      [68.420, 40.520],
      [68.450, 40.620]
    ]]
  },
  {
    id: "oqoltin",
    name: "Oqoltin Tumani",
    district: "Oqoltin tumani markazi",
    riskLevel: "Safe",
    confidence: 97,
    reports: 0,
    lastUpdate: "Tizim barqaror",
    status: "Barqaror xavfsiz holat",
    latLonString: "40.5800° N, 68.2200° E",
    description: "Faol kiber yoki ijtimoiy xatarlar aniqlanmagan. Mahalliy tarmoqlar himoyalangan.",
    recommendedAction: "Profilaktik masofaviy monitoringni davom ettirish.",
    center: [68.2200, 40.5800],
    coordinates: [[
      [68.050, 40.680],
      [68.310, 40.660],
      [68.310, 40.500],
      [68.100, 40.480],
      [68.000, 40.580],
      [68.050, 40.680]
    ]]
  },
  {
    id: "sardoba",
    name: "Sardoba Tumani",
    district: "Sardoba agro-ekologik zonasi",
    riskLevel: "Medium",
    confidence: 79,
    reports: 14,
    lastUpdate: "Kecha, 21:10",
    status: "Doimiy monitoring",
    latLonString: "40.4800° N, 68.4200° E",
    description: "Tarmoq zaifliklarini skanerlash va soxta subsidiyalar tarqatilishi.",
    recommendedAction: "Tarmoq xavfsizlik devorlari qoidalarini kuchaytirish.",
    center: [68.4200, 40.4800],
    coordinates: [[
      [68.310, 40.500],
      [68.480, 40.440],
      [68.440, 40.320],
      [68.250, 40.320],
      [68.100, 40.480],
      [68.310, 40.500]
    ]]
  },
  {
    id: "sayxunobod",
    name: "Sayxunobod Tumani",
    district: "Sayxunobod sanoat zonasi",
    riskLevel: "Patrol",
    confidence: 92,
    reports: 4,
    lastUpdate: "Bugun, 07:45",
    status: "Kiber-patrul faol",
    latLonString: "40.7600° N, 68.9100° E",
    description: "Sanoat korxonalari xodimlari o'rtasida profilaktik kiber-immunizatsiya.",
    recommendedAction: "Elektron pochta xavfsizlik filtrlarini yangilash.",
    center: [68.9100, 40.7600],
    coordinates: [[
      [68.650, 40.920],
      [68.880, 40.880],
      [68.980, 40.820],
      [68.850, 40.680],
      [68.740, 40.820],
      [68.650, 40.920]
    ]]
  },
  {
    id: "xovos",
    name: "Xovos Tumani",
    district: "Xovos chegara-transport tuguni",
    riskLevel: "High",
    confidence: 86,
    reports: 22,
    lastUpdate: "Bugun, 13:15",
    status: "Chegara kiber-himoyasi",
    latLonString: "40.2100° N, 68.6800° E",
    description: "Jamoat Wi-Fi tarmoqlaridan foydalanuvchilarning ma'lumotlarini o'g'irlash harakatlari.",
    recommendedAction: "Shubhali Wi-Fi tarmoq ulanishlarini tahlil qilish va bloklash.",
    center: [68.6800, 40.2100],
    coordinates: [[
      [68.440, 40.320],
      [68.740, 40.320],
      [68.790, 40.100],
      [68.490, 40.120],
      [68.440, 40.320]
    ]]
  },
  {
    id: "guliston_t",
    name: "Guliston Tumani",
    district: "Guliston tumani hududlari",
    riskLevel: "Medium",
    confidence: 77,
    reports: 15,
    lastUpdate: "Kecha, 14:22",
    status: "Nazorat ostida",
    latLonString: "40.5200° N, 68.8500° E",
    description: "Bank kartalaridan pul o'g'irlashga urinish botlari aniqlangan.",
    recommendedAction: "Aholiga 3D Secure va xavfsiz to'lov tizimlarini tushuntirish.",
    center: [68.8500, 40.5200],
    coordinates: [[
      [68.740, 40.580],
      [68.950, 40.580],
      [68.980, 40.480],
      [68.720, 40.440],
      [68.670, 40.520],
      [68.740, 40.580]
    ]]
  },
  {
    id: "yangiyer_sh",
    name: "Yangiyer Shahri",
    district: "Yangiyer ilmiy-sanoat zonasi",
    riskLevel: "Patrol",
    confidence: 94,
    reports: 3,
    lastUpdate: "Bugun, 10:05",
    status: "Profilaktik tahlil",
    latLonString: "40.2620° N, 68.8350° E",
    description: "Oliy ta'lim muassasalarida profilaktik kiber-immunitet o'quvlari ketmoqda.",
    recommendedAction: "Talabalar kiber-klublarini qo'llab-quvvatlash.",
    center: [68.8350, 40.2620],
    coordinates: [[
      [68.795, 40.280],
      [68.875, 40.280],
      [68.875, 40.235],
      [68.795, 40.235],
      [68.795, 40.280]
    ]]
  },
  {
    id: "shirin_sh",
    name: "Shirin Shahri",
    district: "Shirin energetika kompleksi",
    riskLevel: "Medium",
    confidence: 80,
    reports: 9,
    lastUpdate: "Bugun, 11:15",
    status: "Strategik nazorat",
    latLonString: "40.2312° N, 69.1170° E",
    description: "Energetika korporativ pochta tizimlariga qaratilgan fishing hujumlari.",
    recommendedAction: "2FA va korporativ himoya devorlarini kuchaytirish.",
    center: [69.1170, 40.2312],
    coordinates: [[
      [69.045, 40.250],
      [69.155, 40.250],
      [69.145, 40.200],
      [69.045, 40.200],
      [69.045, 40.250]
    ]]
  }
];

export default function SirdaryoMapIllustration() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Default selected region is Guliston (Viloyat markazi) so we always show rich data
  const [selectedRegion, setSelectedRegion] = useState<RiskRegion>(SIRDARYO_REGIONS[0]);

  // Handle Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center map on Sirdaryo Region
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: [68.68, 40.50], // Perfect balance center to capture all districts
      zoom: 8.7,             // Perfect zoom to show all 11 districts beautifully
      pitch: 45,             // Cinematic perspective
      bearing: -5
    });

    mapRef.current = map;

    // Add navigation controls (Zoom, Rotation)
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "top-left");
    // Add Fullscreen control for pristine experience
    map.addControl(new maplibregl.FullscreenControl(), "top-right");

    map.on("load", async () => {
      const response = await fetch(sirdaryoGeoJsonUrl);
      const geojson = await response.json();

      // Add custom district polygons
      SIRDARYO_REGIONS.forEach((region) => {
        const sourceId = `source-${region.id}`;
        
        let feature;
        // More robust matching for specific district/city types
        if (region.id === 'guliston_sh') {
          feature = geojson.features.find(f => f.properties.ADM2_EN.toLowerCase() === 'guliston city');
        } else if (region.id === 'guliston_t') {
          feature = geojson.features.find(f => f.properties.ADM2_EN.toLowerCase() === 'guliston district');
        } else if (region.id === 'yangiyer_sh') {
          feature = geojson.features.find(f => f.properties.ADM2_EN.toLowerCase() === 'yangiyer city');
        } else if (region.id === 'shirin_sh') {
          feature = geojson.features.find(f => f.properties.ADM2_EN.toLowerCase() === 'shirin city');
        } else {
          // Default matching for districts
          const districtName = region.id.split('_')[0].toLowerCase();
          feature = geojson.features.find(f => f.properties.ADM2_EN.toLowerCase().includes(districtName));
        }
        
        if (!feature) {
          console.warn(`Feature not found for region: ${region.id}`);
          return;
        }

        // 1. Add GeoJSON Source
        map.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {
              id: region.id,
              name: region.name,
              riskLevel: region.riskLevel,
              color: RISK_COLORS[region.riskLevel]
            },
            geometry: feature.geometry
          }
        });

        // 2. Semi-transparent Area Fill Layer (30-50% opacity as requested)
        map.addLayer({
          id: `layer-fill-${region.id}`,
          type: "fill",
          source: sourceId,
          layout: {},
          paint: {
            "fill-color": RISK_COLORS[region.riskLevel],
            "fill-opacity": 0.35,
            "fill-opacity-transition": { duration: 300 }
          }
        });

        // 3. Glowing Outer Border Layer (Dual outline for a high-tech glowing outline)
        map.addLayer({
          id: `layer-glow-${region.id}`,
          type: "line",
          source: sourceId,
          layout: {},
          paint: {
            "line-color": RISK_COLORS[region.riskLevel],
            "line-width": 4.5,
            "line-blur": 3.0,
            "line-opacity": 0.45,
            "line-opacity-transition": { duration: 300 },
            "line-width-transition": { duration: 300 }
          }
        });

        // 4. Crisp Top Border Layer
        map.addLayer({
          id: `layer-line-${region.id}`,
          type: "line",
          source: sourceId,
          layout: {},
          paint: {
            "line-color": RISK_COLORS[region.riskLevel],
            "line-width": 2.0,
            "line-opacity": 0.95,
            "line-color-transition": { duration: 300 },
            "line-width-transition": { duration: 300 }
          }
        });

        // --- Interactive Mouse Handlers on Fill Layers ---
        map.on("mouseenter", `layer-fill-${region.id}`, () => {
          map.getCanvas().style.cursor = "pointer";
          map.setPaintProperty(`layer-fill-${region.id}`, "fill-opacity", 0.50);
          map.setPaintProperty(`layer-glow-${region.id}`, "line-width", 7.0);
          map.setPaintProperty(`layer-glow-${region.id}`, "line-opacity", 0.85);
        });

        map.on("mouseleave", `layer-fill-${region.id}`, () => {
          map.getCanvas().style.cursor = "";
          const isSelected = selectedRegion.id === region.id;
          map.setPaintProperty(`layer-fill-${region.id}`, "fill-opacity", isSelected ? 0.50 : 0.35);
          map.setPaintProperty(`layer-glow-${region.id}`, "line-width", isSelected ? 7.0 : 4.5);
          map.setPaintProperty(`layer-glow-${region.id}`, "line-opacity", isSelected ? 0.85 : 0.45);
        });

        map.on("click", `layer-fill-${region.id}`, () => {
          setSelectedRegion(region);
          map.easeTo({
            center: region.center,
            zoom: 11.0, // Smooth zoom to center
            pitch: 52,
            duration: 900
          });
        });
      });

      // --- Custom High-Tech Markers at Administrative Centers ---
      
      // Group regions by center to avoid overlapping markers
      const groupedRegions: Record<string, RiskRegion[]> = {};
      SIRDARYO_REGIONS.forEach((region) => {
        const key = region.center.join(',');
        if (!groupedRegions[key]) groupedRegions[key] = [];
        groupedRegions[key].push(region);
      });

      const riskOrder = {
        Critical: 4,
        High: 3,
        Patrol: 2,
        Medium: 1,
        Safe: 0
      };

      Object.values(groupedRegions).forEach((regions) => {
        // Find the region with the highest risk level
        const region = regions.reduce((prev, curr) => 
          riskOrder[curr.riskLevel] > riskOrder[prev.riskLevel] ? curr : prev
        );

        const el = document.createElement("div");
        el.className = "relative flex items-center justify-center w-8 h-8 cursor-pointer";
        
        // Pulse Ring
        const ring = document.createElement("div");
        ring.className = "absolute rounded-full border border-dashed animate-ping";
        ring.style.borderColor = RISK_COLORS[region.riskLevel];
        ring.style.width = "22px";
        ring.style.height = "22px";
        ring.style.animationDuration = region.riskLevel === "Critical" ? "1.2s" : "2.2s";
        
        // Inner Core Dot
        const core = document.createElement("div");
        core.className = "w-2.5 h-2.5 rounded-full border border-white shadow-[0_0_8px_rgba(255,255,255,0.7)] transition-transform duration-300 hover:scale-125";
        core.style.backgroundColor = RISK_COLORS[region.riskLevel];

        el.appendChild(ring);
        el.appendChild(core);

        // Click handler on Marker
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          setSelectedRegion(region);
          map.easeTo({
            center: region.center,
            zoom: 11.0,
            pitch: 52,
            duration: 900
          });
        });

        // Add Marker
        const marker = new maplibregl.Marker(el)
          .setLngLat(region.center)
          .addTo(map);

        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  // Update paint properties dynamically on selection
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    
    SIRDARYO_REGIONS.forEach((region) => {
      const isSelected = region.id === selectedRegion.id;
      const fillLayerId = `layer-fill-${region.id}`;
      const glowLayerId = `layer-glow-${region.id}`;
      const lineLayerId = `layer-line-${region.id}`;
      
      if (map.getLayer(fillLayerId)) {
        map.setPaintProperty(fillLayerId, "fill-opacity", isSelected ? 0.50 : 0.35);
      }
      if (map.getLayer(glowLayerId)) {
        map.setPaintProperty(glowLayerId, "line-width", isSelected ? 8.0 : 4.5);
        map.setPaintProperty(glowLayerId, "line-opacity", isSelected ? 0.85 : 0.45);
      }
      if (map.getLayer(lineLayerId)) {
        map.setPaintProperty(lineLayerId, "line-width", isSelected ? 3.0 : 2.0);
        map.setPaintProperty(lineLayerId, "line-color", isSelected ? "#FFFFFF" : RISK_COLORS[region.riskLevel]);
      }
    });
  }, [selectedRegion]);

  // Handle region selection from legend or click
  const handleSelectRegion = (region: RiskRegion) => {
    setSelectedRegion(region);
    if (mapRef.current) {
      mapRef.current.easeTo({
        center: region.center,
        zoom: 11.0,
        pitch: 52,
        duration: 1000
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-left" id="sirdaryo-map-section">
      
      {/* 1. MAP PANEL (Full width, elegant, interactive) */}
      <div 
        className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-[#071A2E] border border-white/10 shadow-2xl"
        id="cyber-map-viewport"
      >
        {/* Map Container */}
        <div ref={mapContainerRef} className="w-full h-full absolute inset-0 z-0" />

        {/* Navigation Indicator Overlay */}
        <div className="absolute bottom-4 left-4 z-10 bg-[#091527]/90 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md flex items-center gap-2 pointer-events-none">
          <Compass className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span className="text-[10px] font-mono tracking-wider text-slate-300 uppercase">
            3D GIS Xarita Rejimi
          </span>
        </div>

        {/* Scan line effect overlay to fit cyberpunk theme (passive only) */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent animate-pulse" />
        </div>
      </div>

      {/* 2. DYNAMIC INFORMATION PANEL (Compact, Modern Glassmorphism, Outside Map - Strictly NO 'Tahlil va tavsiyalar' column) */}
      <div 
        className="w-full max-w-2xl mx-auto bg-[#091527]/85 border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-xl transition-all flex flex-col gap-4"
        id="dynamic-info-panel"
      >
        {/* Region Title Header */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-3">
          <span 
            className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0" 
            style={{ 
              backgroundColor: RISK_COLORS[selectedRegion.riskLevel],
              boxShadow: `0 0 10px ${RISK_COLORS[selectedRegion.riskLevel]}` 
            }} 
          />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight font-display">
              {selectedRegion.name}
            </h3>
            <p className="text-[10px] text-gray-400 font-sans">
              SafeUz AI Kiber-Tahlil Tizimi
            </p>
          </div>
        </div>

        {/* Structured Metadata List - 100% Focused on HUDUD METADATALARI */}
        <div className="space-y-2 py-1 text-xs flex-grow">
          
          {/* Field 1: District */}
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-gray-500 uppercase font-mono font-medium">Tuman / Shahar</span>
            <span className="text-slate-200 font-semibold truncate max-w-[320px]" title={selectedRegion.district}>
              {selectedRegion.district}
            </span>
          </div>

          {/* Field 2: Coordinates */}
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-gray-500 uppercase font-mono font-medium">Koordinatalar</span>
            <span className="text-slate-300 font-mono text-[11px]">{selectedRegion.latLonString}</span>
          </div>

          {/* Field 3: AI Risk Level */}
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-gray-500 uppercase font-mono font-medium">AI Xavf Darajasi</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: RISK_COLORS[selectedRegion.riskLevel] }} />
              <span 
                className="font-bold tracking-wide uppercase font-mono text-[11px]"
                style={{ color: RISK_COLORS[selectedRegion.riskLevel] }}
              >
                {RISK_LABELS_UZ[selectedRegion.riskLevel]}
              </span>
            </div>
          </div>

          {/* Field 4: AI Confidence (%) */}
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-gray-500 uppercase font-mono font-medium">AI Ishonch Ko'rsatkichi</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-200 font-mono font-bold">{selectedRegion.confidence}%</span>
              <div className="w-20 bg-[#05111f] rounded-full h-1.5 overflow-hidden border border-white/5">
                <div 
                  className="h-full rounded-full transition-all duration-700"
                  style={{ 
                    width: `${selectedRegion.confidence}%`,
                    backgroundColor: RISK_COLORS[selectedRegion.riskLevel]
                  }}
                />
              </div>
            </div>
          </div>

          {/* Field 5 & 6: Number of Reports & Last Detection Time */}
          <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
            <span className="text-[10px] text-gray-500 uppercase font-mono font-medium">Faol Kiber Xabarlar / Oxirgi Skan</span>
            <span className="text-slate-200 font-mono text-[11px]">
              {selectedRegion.reports} ta faol / {selectedRegion.lastUpdate}
            </span>
          </div>

          {/* Field 7: Status */}
          <div className="flex justify-between items-center pb-1">
            <span className="text-[10px] text-gray-500 uppercase font-mono font-medium">Holati</span>
            <span className="text-blue-300 font-mono text-[11px] truncate max-w-[320px]" title={selectedRegion.status}>
              {selectedRegion.status}
            </span>
          </div>

        </div>

        {/* 3. INTERACTIVE LEGEND KEY (Shows all 11 districts beautifully) */}
        <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <Info className="w-3 h-3 text-blue-400" />
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">Interactive Hududlar Paneli (Barcha 11 Hudud):</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] font-mono">
            {SIRDARYO_REGIONS.map((r) => (
              <button 
                key={r.id}
                onClick={() => handleSelectRegion(r)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border transition-all cursor-pointer truncate ${
                  selectedRegion.id === r.id 
                    ? "bg-blue-950/40 border-blue-500/50 text-white shadow-md shadow-blue-500/10" 
                    : "bg-[#0b1c31]/40 border-white/5 text-gray-400 hover:text-white hover:bg-slate-800/30"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: RISK_COLORS[r.riskLevel] }} />
                <span className="truncate">{r.name}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
