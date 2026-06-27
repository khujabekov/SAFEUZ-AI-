import React, { useState } from "react";
import { 
  Map, 
  Layers, 
  ShieldAlert, 
  AlertOctagon, 
  ArrowRight, 
  TrendingUp, 
  ChevronRight,
  Info
} from "lucide-react";
import { motion } from "motion/react";
import { DistrictStat } from "../types";

// Standard administrative districts of Sirdaryo with dynamic simulated indexes
const INITIAL_DISTRICT_STATS: DistrictStat[] = [
  { name: "Sirdaryo tumani", threatScore: 92, casesCount: 842, criticalCount: 48, topThreatType: "Narcotics / Telegram Channels" },
  { name: "Guliston shahri", threatScore: 88, casesCount: 1214, criticalCount: 64, topThreatType: "Phishing / Credential Theft" },
  { name: "Yangiyer shahri", threatScore: 78, casesCount: 412, criticalCount: 22, topThreatType: "APK Trojan / Spyware" },
  { name: "Sardoba tumani", threatScore: 74, casesCount: 310, criticalCount: 18, topThreatType: "Social Scam / Compensation phishing" },
  { name: "Xovos tumani", threatScore: 68, casesCount: 285, criticalCount: 12, topThreatType: "Transit/Border Narcotics" },
  { name: "Boyovut tumani", threatScore: 65, casesCount: 198, criticalCount: 8, topThreatType: "Fake Agricultural Grants" },
  { name: "Shirin shahri", threatScore: 54, casesCount: 124, criticalCount: 4, topThreatType: "Critical Infrastructure scan attempts" },
  { name: "Sayxunobod tumani", threatScore: 48, casesCount: 104, criticalCount: 3, topThreatType: "General phishing" },
  { name: "Mirzaobod tumani", threatScore: 42, casesCount: 92, criticalCount: 2, topThreatType: "Telegram Lottery Scam" },
  { name: "Oqoltin tumani", threatScore: 35, casesCount: 71, criticalCount: 1, topThreatType: "Fake SMS/USSD codes" },
];

interface RegionalMonitoringProps {
  onNavigateToFullAnalytics: () => void;
}

export default function RegionalMonitoring({ onNavigateToFullAnalytics }: RegionalMonitoringProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictStat>(INITIAL_DISTRICT_STATS[0]);
  const [mapLayer, setMapLayer] = useState<"threat" | "critical" | "density">("threat");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#EF4444]";
    if (score >= 60) return "text-[#F59E0B]";
    return "text-[#10B981]";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-[#EF4444]";
    if (score >= 60) return "bg-[#F59E0B]";
    return "bg-[#10B981]";
  };

  return (
    <div className="space-y-6">
      {/* Upper Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h3 className="text-lg font-bold font-display text-white tracking-tight">
            Sirdaryo bo'yicha xavfli hududlar monitoringi
          </h3>
          <p className="text-xs text-white/40">
            Viloyat tumanlari va shaharlari kesimida sun'iy intellekt tomonidan hisoblangan kiber-xavf darajasi
          </p>
        </div>
        
        {/* Layer Selectors */}
        <div className="flex items-center gap-2 bg-black/30 p-1 rounded-lg border border-white/5">
          {[
            { key: "threat", label: "Tahdid darajasi" },
            { key: "critical", label: "Kritik holatlar" },
            { key: "density", label: "Xabarlar zichligi" },
          ].map((layer) => (
            <button
              key={layer.key}
              onClick={() => setMapLayer(layer.key as any)}
              className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                mapLayer === layer.key
                  ? "bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SVG/Interactive Map Column (8 Columns) */}
        <div className="lg:col-span-7 bg-black/40 border border-white/5 rounded-2xl p-4 relative flex flex-col justify-between overflow-hidden min-h-[350px]">
          {/* Neon grid pattern */}
          <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />
          
          <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs font-mono text-white/40 bg-black/50 px-2 py-1 rounded border border-white/5">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Xarita qatlami: <strong className="text-blue-400 capitalize">{mapLayer} map</strong></span>
          </div>

          {/* Interactive SVG/3D Blueprint Map of Sirdaryo */}
          <div className="flex-1 flex items-center justify-center py-6 relative">
            <div className="relative w-full max-w-[420px] aspect-video">
              {/* Sirdaryo Map Districts Layout */}
              <svg viewBox="0 0 400 240" className="w-full h-full drop-shadow-[0_0_25px_rgba(59,130,246,0.15)]">
                {/* Defs for glow gradients */}
                <defs>
                  <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Sirdaryo tumani */}
                <path 
                  d="M 120,40 L 200,30 L 250,70 L 210,100 L 150,110 Z" 
                  className={`stroke-white/15 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Sirdaryo tumani" 
                      ? "fill-red-500/40 stroke-[#EF4444] stroke-2" 
                      : "fill-[#EF4444]/15 hover:fill-[#EF4444]/30"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[0])}
                />
                
                {/* Guliston shahri */}
                <circle 
                  cx="195" cy="130" r="16"
                  className={`stroke-white/30 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Guliston shahri" 
                      ? "fill-red-600/50 stroke-[#EF4444] stroke-2 animate-pulse" 
                      : "fill-[#EF4444]/25 hover:fill-[#EF4444]/40"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[1])}
                />

                {/* Yangiyer shahri */}
                <rect 
                  x="180" y="165" width="22" height="22" rx="4"
                  className={`stroke-white/30 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Yangiyer shahri" 
                      ? "fill-amber-500/40 stroke-[#F59E0B] stroke-2" 
                      : "fill-[#F59E0B]/15 hover:fill-[#F59E0B]/30"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[2])}
                />

                {/* Sardoba tumani */}
                <path 
                  d="M 90,120 L 140,115 L 170,150 L 115,185 Z" 
                  className={`stroke-white/15 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Sardoba tumani" 
                      ? "fill-amber-500/40 stroke-[#F59E0B] stroke-2" 
                      : "fill-[#F59E0B]/15 hover:fill-[#F59E0B]/30"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[3])}
                />

                {/* Xovos tumani */}
                <path 
                  d="M 175,190 L 220,185 L 245,225 L 190,230 Z" 
                  className={`stroke-white/15 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Xovos tumani" 
                      ? "fill-amber-500/35 stroke-[#F59E0B] stroke-2" 
                      : "fill-[#F59E0B]/10 hover:fill-[#F59E0B]/25"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[4])}
                />

                {/* Boyovut tumani */}
                <path 
                  d="M 235,115 L 290,110 L 310,155 L 255,160 Z" 
                  className={`stroke-white/15 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Boyovut tumani" 
                      ? "fill-amber-500/30 stroke-[#F59E0B] stroke-2" 
                      : "fill-[#F59E0B]/10 hover:fill-[#F59E0B]/25"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[5])}
                />

                {/* Shirin shahri */}
                <polygon 
                  points="260,175 285,165 295,190 270,200"
                  className={`stroke-white/20 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Shirin shahri" 
                      ? "fill-emerald-500/40 stroke-[#10B981] stroke-2" 
                      : "fill-[#10B981]/15 hover:fill-[#10B981]/30"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[6])}
                />

                {/* Sayxunobod tumani */}
                <path 
                  d="M 215,105 L 265,95 L 290,135 L 235,145 Z" 
                  className={`stroke-white/15 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Sayxunobod tumani" 
                      ? "fill-emerald-500/30 stroke-[#10B981] stroke-2" 
                      : "fill-[#10B981]/10 hover:fill-[#10B981]/25"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[7])}
                />

                {/* Mirzaobod tumani */}
                <path 
                  d="M 145,115 L 180,110 L 190,150 L 155,155 Z" 
                  className={`stroke-white/15 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Mirzaobod tumani" 
                      ? "fill-emerald-500/30 stroke-[#10B981] stroke-2" 
                      : "fill-[#10B981]/10 hover:fill-[#10B981]/25"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[8])}
                />

                {/* Oqoltin tumani */}
                <path 
                  d="M 50,110 L 105,90 L 115,135 L 60,145 Z" 
                  className={`stroke-white/15 cursor-pointer transition-all duration-300 ${
                    selectedDistrict.name === "Oqoltin tumani" 
                      ? "fill-emerald-500/20 stroke-[#10B981] stroke-2" 
                      : "fill-[#10B981]/5 hover:fill-[#10B981]/20"
                  }`}
                  onClick={() => setSelectedDistrict(INITIAL_DISTRICT_STATS[9])}
                />

                {/* Outer connections lines (cyber styling) */}
                <line x1="195" y1="130" x2="330" y2="40" stroke="#3B82F6" strokeWidth="0.5" strokeDasharray="4" />
                <line x1="120" y1="40" x2="40" y2="40" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="4" />
              </svg>

              {/* Hologram/Label overlay */}
              <div className="absolute top-1/2 right-2 -translate-y-1/2 text-[10px] font-mono text-[#3B82F6]/60 text-right pointer-events-none hidden sm:block">
                <div>GRID: UZ_SIR_NODE</div>
                <div>SECURE LATENCY: 1.4ms</div>
                <div>THREAT MATRIX ACTIVE</div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-white/30 text-center font-mono border-t border-white/5 pt-2">
            * Xaritadan hududni tanlang. Tanlangan hudud tahlili o'ng panelda yangilanadi.
          </div>
        </div>

        {/* Detailed Stats Column (5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Active District Detail Card */}
          <div className="bg-[#131D2E] border border-white/8 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <span className="text-sm font-semibold font-display text-white">
                {selectedDistrict.name}
              </span>
              <span className={`text-xs font-mono font-bold ${getScoreColor(selectedDistrict.threatScore)}`}>
                XAVF: {selectedDistrict.threatScore}%
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Row 1: Active Cases */}
              <div className="flex justify-between items-center text-white/70">
                <span>Yuborilgan xabarlar:</span>
                <span className="font-mono text-white font-semibold">{selectedDistrict.casesCount} ta</span>
              </div>

              {/* Row 2: Critical Cases */}
              <div className="flex justify-between items-center text-white/70">
                <span>Kritik kiber tahdidlar:</span>
                <span className="font-mono text-[#EF4444] font-bold">{selectedDistrict.criticalCount} ta</span>
              </div>

              {/* Row 3: Main Threat */}
              <div className="space-y-1 border-t border-white/5 pt-3">
                <span className="text-white/40 block">Eng asosiy tahdid turi:</span>
                <span className="text-white font-semibold flex items-center gap-1.5 mt-1 bg-black/30 p-2 rounded border border-white/5 font-mono text-[11px]">
                  <ShieldAlert className="w-3.5 h-3.5 text-[#EF4444]" />
                  {selectedDistrict.topThreatType}
                </span>
              </div>

              {/* Risk bar animation */}
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between font-mono text-[11px] text-white/40">
                  <span>HUDUDIY RISK INDEKSI</span>
                  <span>{selectedDistrict.threatScore}/100</span>
                </div>
                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getScoreBg(selectedDistrict.threatScore)} transition-all duration-500`}
                    style={{ width: `${selectedDistrict.threatScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick action info */}
            <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/10 flex items-start gap-2 text-[11px] text-blue-400">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                Sirdaryo milliy shtabi sun'iy intellekti ushbu tumandagi Telegram guruhlar, fishing sayt va APK dasturlardan yig'ilgan so'rovlarni real vaqtda indekslab xavflilik darajasini baholadi.
              </p>
            </div>
          </div>

          {/* Scoreboard / Mini Ranking */}
          <div className="bg-[#131D2E] border border-white/8 rounded-2xl p-4 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
                <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-[#EF4444]" />
                  Xavflilik Scoreboard (TOP 5)
                </h4>
              </div>
              
              <div className="space-y-2">
                {INITIAL_DISTRICT_STATS.slice(0, 5).map((dist, idx) => (
                  <div 
                    key={dist.name} 
                    onClick={() => setSelectedDistrict(dist)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                      selectedDistrict.name === dist.name
                        ? "bg-blue-500/10 border-blue-500/30 text-white"
                        : "bg-black/10 border-white/5 hover:border-white/10 text-white/70"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white/40">{idx + 1}.</span>
                      <span className="font-semibold">{dist.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold">{dist.threatScore}%</span>
                      <ChevronRight className="w-3 h-3 text-white/30" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={onNavigateToFullAnalytics}
              className="mt-4 w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-blue-500/30 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer"
            >
              To'liq hududiy analyticsni ochish
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
