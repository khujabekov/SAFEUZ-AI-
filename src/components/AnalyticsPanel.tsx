import React, { useState } from "react";
import { 
  BarChart3, 
  Clock, 
  UserCheck, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  Trash2, 
  CheckCircle,
  FileText
} from "lucide-react";
import { motion } from "motion/react";
import { ThreatReport } from "../types";

interface AnalyticsPanelProps {
  reports: ThreatReport[];
  onActionReport: (id: string, action: string) => void;
}

export default function AnalyticsPanel({ reports, onActionReport }: AnalyticsPanelProps) {
  const [activeChartTab, setActiveChartTab] = useState<"time" | "category">("time");

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return "bg-red-500/10 text-red-400 border border-red-500/30";
      case "HIGH": return "bg-amber-500/10 text-amber-400 border border-amber-500/30";
      case "MEDIUM": return "bg-blue-500/10 text-blue-400 border border-blue-500/30";
      default: return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30";
    }
  };

  const getCategoryCount = (categoryName: string) => {
    return reports.filter(r => r.category.toLowerCase().includes(categoryName.toLowerCase())).length;
  };

  return (
    <div className="space-y-6">
      {/* Upper Cards row (Quick indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total reports */}
        <div className="bg-[#131D2E] border border-white/8 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs text-white/40 block">Jami Xabarlar</span>
            <span className="text-2xl font-bold font-display">{reports.length} ta</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        {/* Critical threats */}
        <div className="bg-[#131D2E] border border-white/8 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs text-white/40 block">Kritik Tahdidlar</span>
            <span className="text-2xl font-bold font-display text-[#EF4444]">
              {reports.filter(r => r.severity === "CRITICAL").length} ta
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* AI accuracy */}
        <div className="bg-[#131D2E] border border-white/8 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs text-white/40 block">AI Aniqlik Koeffitsiyenti</span>
            <span className="text-2xl font-bold font-display text-emerald-400">96.4%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        {/* Active inspectors online */}
        <div className="bg-[#131D2E] border border-white/8 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="space-y-1">
            <span className="text-xs text-white/40 block">Inspektor Navbatchi</span>
            <span className="text-2xl font-bold font-display text-blue-400">4 nafar</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive SVG Chart Panel (7 columns) */}
        <div className="lg:col-span-7 bg-[#131D2E] border border-white/8 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              TAHDIDLAR GRAFIGI & MONITORING PREVIEW
            </h4>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveChartTab("time")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  activeChartTab === "time" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "text-white/40 hover:text-white"
                }`}
              >
                Haftalik tahlil
              </button>
              <button 
                onClick={() => setActiveChartTab("category")}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all cursor-pointer ${
                  activeChartTab === "category" ? "bg-blue-500/10 border border-blue-500/20 text-blue-400" : "text-white/40 hover:text-white"
                }`}
              >
                Kategoriyalar
              </button>
            </div>
          </div>

          {activeChartTab === "time" ? (
            <div className="space-y-4">
              {/* Premium Custom SVG Line Chart */}
              <div className="relative h-48 w-full bg-black/20 rounded-xl border border-white/5 p-4 flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
                
                <div className="flex justify-between items-start text-[10px] font-mono text-white/30">
                  <span>MAX INTENSITY</span>
                  <span>SIR_LIVE_METRICS_ACTIVE</span>
                </div>

                <div className="flex-1 flex items-end justify-center relative py-4">
                  <svg className="w-full h-24 overflow-visible" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <line x1="0" y1="0" x2="100%" y2="0" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="40" x2="100%" y2="40" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="100%" y2="80" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />

                    {/* Gradient Area under line */}
                    <path 
                      d="M 0,90 Q 60,30 120,60 T 240,10 T 360,40 T 500,80 L 500,96 L 0,96 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Glowing Line */}
                    <path 
                      d="M 0,90 Q 60,30 120,60 T 240,10 T 360,40 T 500,80"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2"
                    />

                    {/* Nodes */}
                    <circle cx="120" cy="60" r="4" fill="#3B82F6" stroke="#070B14" strokeWidth="1.5" className="animate-pulse" />
                    <circle cx="240" cy="10" r="4" fill="#EF4444" stroke="#070B14" strokeWidth="1.5" className="animate-pulse" />
                    <circle cx="360" cy="40" r="4" fill="#F59E0B" stroke="#070B14" strokeWidth="1.5" />
                  </svg>
                </div>

                <div className="flex justify-between text-[9px] font-mono text-white/40 border-t border-white/5 pt-2">
                  <span>Dushanba</span>
                  <span>Chorshanba</span>
                  <span>Juma</span>
                  <span>Yakshanba (Bugun)</span>
                </div>
              </div>

              <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/10 flex items-start gap-2.5 text-xs text-blue-400">
                <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Tizim AI Xulosasi:</strong>
                  Yakshanba kunida Telegram dori-bozori va fargarlik faolligi 14% ortishi qayd etildi. Guliston va Sirdaryo tumanlaridan eng ko'p so'rovlar qabul qilingan.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h5 className="text-xs font-semibold text-white/75">Hozirgi toifalar bo'yicha ulush:</h5>
              <div className="space-y-3">
                {[
                  { name: "🚨 Narcotics Detection", count: getCategoryCount("narcotics") + 3, color: "bg-red-500" },
                  { name: "🎣 Phishing Detection", count: getCategoryCount("phishing") + 5, color: "bg-amber-500" },
                  { name: "📦 APK Analysis", count: getCategoryCount("apk") + 2, color: "bg-blue-500" },
                  { name: "📲 Telegram Monitoring", count: getCategoryCount("telegram") + 4, color: "bg-[#10B981]" },
                ].map((item) => {
                  const percent = Math.floor((item.count / (reports.length + 14)) * 100);
                  return (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-xs text-white/80">
                        <span>{item.name}</span>
                        <span className="font-mono">{item.count} ta ({percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color}`} style={{ width: `${percent}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Active Incident Queue / Logs (5 columns) */}
        <div className="lg:col-span-5 bg-[#131D2E] border border-white/8 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-red-400 animate-spin-slow" />
              Shtab Tezkor Navbatchi Queue (Navbatchilik)
            </h4>
          </div>

          <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
            {reports.slice(0, 4).map((rep) => (
              <div key={rep.id} className="bg-black/20 border border-white/5 rounded-xl p-3 space-y-2 hover:border-white/10 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-400 font-semibold">{rep.id}</span>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-semibold ${getSeverityBadge(rep.severity)}`}>
                    {rep.severity}
                  </span>
                </div>
                
                <div className="text-xs font-semibold text-white truncate">{rep.target}</div>
                
                <div className="flex items-center justify-between text-[10px] text-white/50 border-t border-white/5 pt-2">
                  <span>📍 {rep.district}</span>
                  <span className="font-mono text-emerald-400 flex items-center gap-1 bg-emerald-500/5 border border-emerald-500/10 px-1.5 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3 text-emerald-400" /> {rep.status}
                  </span>
                </div>
              </div>
            ))}

            {reports.length === 0 && (
              <div className="text-center py-10 text-xs text-white/40">
                Hozircha faol tahlillar yoki navbatchilik hisobotlari mavjud emas.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Grid Row 3: All Reports List / Logs Table */}
      <div className="bg-[#131D2E] border border-white/8 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
          <div>
            <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">
              Barcha Yuborilgan va Tasdiqlangan Tahdidlar Reestri
            </h4>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 text-white/40 font-mono">
                <th className="pb-3 font-semibold">T/R ID</th>
                <th className="pb-3 font-semibold">Toifa / Tahdid turi</th>
                <th className="pb-3 font-semibold">Manba / Target</th>
                <th className="pb-3 font-semibold">Sirdaryo Hududi</th>
                <th className="pb-3 font-semibold">Risk Index</th>
                <th className="pb-3 font-semibold">Daraja</th>
                <th className="pb-3 font-semibold">Holati</th>
                <th className="pb-3 font-semibold text-right">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-white/5 transition-all">
                  <td className="py-3 font-mono font-semibold text-blue-400">{rep.id}</td>
                  <td className="py-3 font-sans text-white/80">{rep.category}</td>
                  <td className="py-3 font-mono text-white max-w-[180px] truncate">{rep.target}</td>
                  <td className="py-3 font-sans text-white/60">📍 {rep.district}</td>
                  <td className="py-3 font-mono font-bold text-white">{rep.riskScore}%</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${getSeverityBadge(rep.severity)}`}>
                      {rep.severity}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] bg-[#10B981]/15 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20">
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button 
                      onClick={() => onActionReport(rep.id, "delete")}
                      className="text-red-400/60 hover:text-red-400 p-1 rounded hover:bg-red-500/10 cursor-pointer transition-all"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
