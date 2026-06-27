import React, { useState } from "react";
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  AlertOctagon, 
  Terminal, 
  CheckCircle, 
  ArrowRight, 
  AlertTriangle,
  Loader2,
  FileSpreadsheet,
  RefreshCw,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ScanResult } from "../types";

interface ThreatScanBoxProps {
  onAddReportFromScan: (scan: ScanResult) => void;
}

export default function ThreatScanBox({ onAddReportFromScan }: ThreatScanBoxProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"narcotics" | "phishing" | "apk" | "telegram" | "general">("general");
  const [loading, setLoading] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPlaceholder = () => {
    switch (category) {
      case "narcotics": return "Narkotik tarqatuvchi dori guruhlari yoki shubhali telegram foydalanuvchilarini qidiring...";
      case "phishing": return "Shubhali soxta bank, aksiya yoki to'lov havolalarini kiriting (masalan, click-uzb.click)...";
      case "apk": return "Shubhali Android APK dastur fayllari yoki nomini kiriting (masalan, TelegramModPremium.apk)...";
      case "telegram": return "Shubhali Telegram kanal havolasi yoki sarlavhasini qidiring (@guliston_dori_kanali)...";
      default: return "Shubhali Telegram kanal, link, APK yoki kiber tahdidni qidiring...";
    }
  };

  const getSampleQueries = () => {
    switch (category) {
      case "narcotics": return ["Sirdaryo yulduzi yashirin dori kanali", "@sirdaryo_dori_savdo"];
      case "phishing": return ["http://payme-bonus-card.uz", "http://fastclick-verification.online"];
      case "apk": return ["SirdaryoDori_Bot_Premium.apk", "CyberSecureProxy.apk"];
      default: return ["@Sirdaryo_Xavfsiz_Bozor", "http://guliston-click-support.online"];
    }
  };

  const executeScan = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setScanResult(null);
    setTerminalLines([]);

    // Simulated terminal scanning step output
    const steps = [
      `[Tizim] SafeUZ AI Kiber Tahlil Tizimi v3.1 ishga tushdi...`,
      `[Tizim] So'rov tekshirilmoqda: "${searchQuery}" (${category.toUpperCase()} toifasida)...`,
      `[Tizim] Sirdaryo va Respublika kiber-baza DNS so'rovlari yuklanmoqda...`,
      `[AI Tahlil] Gemini-3.5-Flash kiber tahlil motoriga so'rov yuborilmoqda...`,
      `[AI Tahlil] Hevristik va xavf modellarini simulyatsiya qilish...`,
      `[Yakunlash] Tahlil hisoboti muvaffaqiyatli shakllantirildi.`
    ];

    // Stream terminal lines
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300));
      setTerminalLines(prev => [...prev, steps[i]]);
    }

    try {
      const response = await fetch("/api/threat-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, category }),
      });
      if (!response.ok) {
        throw new Error("Tizim bilan bog'lanishda xatolik yuz berdi");
      }
      const data = await response.json();
      setScanResult(data);
    } catch (err: any) {
      setError(err.message || "Tahlil jarayonida kutilmagan xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sample: string) => {
    setQuery(sample);
    executeScan(sample);
  };

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "CRITICAL": return { text: "text-[#EF4444]", border: "border-[#EF4444]/35", bg: "bg-[#EF4444]/10", label: "KRITIK (CRITICAL)" };
      case "HIGH": return { text: "text-[#F59E0B]", border: "border-[#F59E0B]/35", bg: "bg-[#F59E0B]/10", label: "YUQORI (HIGH)" };
      case "MEDIUM": return { text: "text-blue-400", border: "border-blue-500/35", bg: "bg-blue-500/10", label: "O'RTA (MEDIUM)" };
      default: return { text: "text-[#10B981]", border: "border-[#10B981]/35", bg: "bg-[#10B981]/10", label: "PAST (LOW)" };
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Type Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-3">
        {[
          { key: "general", label: "Umumiy Tahlil" },
          { key: "narcotics", label: "🚨 Dori & Narkotika" },
          { key: "phishing", label: "🎣 Fishg havolalar" },
          { key: "apk", label: "📦 APK Tahlil" },
          { key: "telegram", label: "📲 Telegram guruh" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setCategory(tab.key as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
              category === tab.key
                ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/20"
                : "bg-white/5 hover:bg-white/10 text-white/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Search Input Form */}
      <div className="relative max-w-full group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-40 transition pointer-events-none"></div>
        <form onSubmit={(e) => { e.preventDefault(); executeScan(query); }} className="relative flex items-center bg-[#131D2E] border border-white/10 rounded-full p-1.5 shadow-2xl">
          <div className="absolute left-4 text-white/40">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={loading}
            className="w-full bg-transparent border-none pl-12 pr-36 py-3 text-sm font-sans placeholder-gray-500 text-white outline-none focus:ring-0 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-lg shadow-blue-900/20 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Tahlilda...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Tahlil qilish
              </>
            )}
          </button>
        </form>
      </div>

      {/* Recommended Search Triggers */}
      <div className="flex items-center flex-wrap gap-2 text-xs">
        <span className="text-white/40">Tezkor tahlil namunalari:</span>
        {getSampleQueries().map((sample, idx) => (
          <button
            key={idx}
            onClick={() => handleSampleClick(sample)}
            disabled={loading}
            className="bg-black/20 hover:bg-black/40 border border-white/5 hover:border-blue-500/30 text-blue-400 px-2.5 py-1 rounded-md cursor-pointer transition-all font-mono text-[11px]"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Interactive scanning animation / terminal */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-black/70 border border-blue-500/20 rounded-xl p-4 font-mono text-xs text-blue-400 space-y-2 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute right-3 top-3 flex items-center gap-1 text-[10px] text-blue-500 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-500/10">
              <Terminal className="w-3.5 h-3.5" /> LAB SCANNING
            </div>
            <div className="flex items-center gap-2 border-b border-blue-500/10 pb-2 text-blue-300 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              Tizim terminali (Sirdaryo kiber-operatsiyalar laboratoriyasi)
            </div>
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {terminalLines.map((line, idx) => (
                <div key={idx} className="flex items-start gap-1">
                  <span className="text-blue-500 select-none">&gt;</span>
                  <span>{line}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-blue-400/55 animate-pulse">
                <span>&gt;</span>
                <span className="w-1.5 h-3 bg-blue-400 inline-block" />
                <span>Gemini API orqali hisobot kutilmoqda...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scan Results Output */}
      <AnimatePresence>
        {scanResult && !loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#131D2E] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Top Bar Status */}
            <div className={`p-4 flex flex-wrap items-center justify-between border-b border-white/5 gap-3 ${getSeverityStyles(scanResult.severity).bg}`}>
              <div className="flex items-center gap-2">
                {scanResult.riskScore >= 75 ? (
                  <AlertOctagon className="w-5 h-5 text-[#EF4444] animate-bounce" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-[#F59E0B]" />
                )}
                <div>
                  <div className="text-xs font-mono text-white/50 uppercase">Tahlil obyekti</div>
                  <div className="text-sm font-semibold font-display text-white">{scanResult.target}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-mono px-3 py-1 rounded-full border ${getSeverityStyles(scanResult.severity).border} ${getSeverityStyles(scanResult.severity).text} bg-black/40 font-bold`}>
                  {getSeverityStyles(scanResult.severity).label}
                </span>
                {scanResult.isLiveAI ? (
                  <span className="text-[10px] bg-blue-500/10 border border-blue-500/30 text-blue-400 px-2 py-0.5 rounded font-mono flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-blue-400" /> LIVE AI
                  </span>
                ) : (
                  <span className="text-[10px] bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                    FALLBACK SCAN
                  </span>
                )}
              </div>
            </div>

            {/* Content Split */}
            <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Score Gauge */}
              <div className="md:col-span-4 flex flex-col items-center justify-center bg-black/20 rounded-xl p-5 border border-white/5">
                <div className="text-xs font-mono text-white/50 uppercase mb-3">XAVF DARAJASI (RISK)</div>
                
                {/* Radial risk circle */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      className="stroke-white/5 fill-none"
                      strokeWidth="8"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r="48"
                      className={`fill-none transition-all duration-1000 ${
                        scanResult.riskScore >= 75 ? "stroke-[#EF4444]" : scanResult.riskScore >= 45 ? "stroke-[#F59E0B]" : "stroke-[#10B981]"
                      }`}
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 48}`}
                      strokeDashoffset={`${2 * Math.PI * 48 * (1 - scanResult.riskScore / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold font-display tracking-tighter text-white">
                      {scanResult.riskScore}
                    </span>
                    <span className="text-[9px] font-mono text-white/40 uppercase">MAX 100%</span>
                  </div>
                </div>

                <div className="mt-4 text-center text-xs font-mono text-white/60">
                  <div>Tahdid turi:</div>
                  <div className="text-white font-semibold mt-1 font-sans">{scanResult.threatType}</div>
                </div>
              </div>

              {/* Right Analysis Details */}
              <div className="md:col-span-8 space-y-4">
                <div>
                  <h4 className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">
                    Markaz Sun'iy Intellekti Tahlil Xulosasi:
                  </h4>
                  <p className="text-sm text-white/90 leading-relaxed font-sans bg-black/10 border border-white/5 p-3 rounded-lg">
                    {scanResult.aiAnalysis}
                  </p>
                </div>

                {/* Cyber signs bullets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-mono text-[#EF4444] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Shubhali Belgilar:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-white/70">
                      {scanResult.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#EF4444] font-semibold font-mono mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="text-xs font-mono text-[#10B981] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5" /> Milliy Tavsiyalar:
                    </h5>
                    <ul className="space-y-1.5 text-xs text-white/70">
                      {scanResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#10B981] font-semibold font-mono mt-0.5">✓</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-black/20 border-t border-white/5 flex flex-wrap gap-3 items-center justify-between">
              <span className="text-xs font-mono text-white/40 flex items-center gap-1">
                Tahlil vaqti: {new Date(scanResult.timestamp).toLocaleString("uz-UZ")}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setQuery("");
                    setScanResult(null);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Qayta Tahlil
                </button>
                <button
                  onClick={() => onAddReportFromScan(scanResult)}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-red-500/10 transition-all cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Milliy Markazga Report Tarzida Yuborish
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 bg-red-900/15 border border-red-500/20 rounded-xl text-xs text-red-400 flex items-center gap-2">
          <AlertOctagon className="w-5 h-5 text-red-500 shrink-0" />
          <span>{error}. Tizim simulyatsiya fallback rejimiga o'tdi. So'rovingizni qayta yuborib ko'ring.</span>
        </div>
      )}
    </div>
  );
}
