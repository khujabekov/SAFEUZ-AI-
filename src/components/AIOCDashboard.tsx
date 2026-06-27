import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  Globe, 
  Cpu, 
  Users, 
  TrendingUp, 
  TrendingDown,
  Terminal, 
  Layers, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Eye, 
  FileCode, 
  Play, 
  Pause, 
  RefreshCw,
  Search,
  BookOpen,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertOctagon,
  Radar
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AIOCMap from "./AIOCMap";

// Interfaces
interface LiveIncident {
  id: string;
  time: string;
  incident: string;
  district: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  inspector: string;
  status: "Assigned" | "Accepted" | "Investigating" | "Evidence Uploaded" | "Resolved" | "Blocked";
  rawTime: Date;
}

interface StatCardData {
  title: string;
  value: number;
  increment: number;
  trend: string;
  trendDir: "up" | "down" | "stable";
  status: string;
  statusColor: string;
  borderColor: string;
  glowColor: string;
  icon: React.ComponentType<any>;
}

// Initial Live Incidents
const INITIAL_INCIDENTS: LiveIncident[] = [
  {
    id: "INC-4821",
    time: "14:22:15",
    incident: "Telegram dori savdosi noqonuniy reklamasi aniqlandi",
    district: "Guliston Shahri",
    riskLevel: "CRITICAL",
    inspector: "Kpt. Safarov M.",
    status: "Blocked",
    rawTime: new Date(Date.now() - 1000 * 60 * 15)
  },
  {
    id: "INC-4818",
    time: "14:18:02",
    incident: "Soxta 'Click bonus' fishing sayti aniqlandi (http://click-bonus-uz.com)",
    district: "Sirdaryo Tumani",
    riskLevel: "HIGH",
    inspector: "Ltn. Alimov F.",
    status: "Evidence Uploaded",
    rawTime: new Date(Date.now() - 1000 * 60 * 19)
  },
  {
    id: "INC-4810",
    time: "14:10:45",
    incident: "Zararli Android troyan dasturi aniqlandi (TezkorInternet.apk)",
    district: "Yangiyer Shahri",
    riskLevel: "CRITICAL",
    inspector: "Kpt. Yo'ldoshev S.",
    status: "Resolved",
    rawTime: new Date(Date.now() - 1000 * 60 * 27)
  },
  {
    id: "INC-4802",
    time: "14:02:30",
    incident: "Telegram bot firibgarligi faollashdi (@pul_yutug_bot)",
    district: "Boyovut Tumani",
    riskLevel: "MEDIUM",
    inspector: "Kpt. Qodirov J.",
    status: "Investigating",
    rawTime: new Date(Date.now() - 1000 * 60 * 35)
  },
  {
    id: "INC-4795",
    time: "13:55:12",
    incident: "Davlat tashkiloti xodimlariga soxta kompensatsiya fishing pochtasi jo'natildi",
    district: "Xovos Tumani",
    riskLevel: "HIGH",
    inspector: "Ltn. Karimov A.",
    status: "Accepted",
    rawTime: new Date(Date.now() - 1000 * 60 * 42)
  },
  {
    id: "INC-4788",
    time: "13:48:40",
    incident: "Energetika korxonasi xostingiga shubhali SQL injection urinishi",
    district: "Shirin Shahri",
    riskLevel: "HIGH",
    inspector: "Tizim Patrul Bot",
    status: "Assigned",
    rawTime: new Date(Date.now() - 1000 * 60 * 49)
  }
];

// Pool of simulated incidents to draw from
const SIMULATED_INCIDENT_POOL = [
  {
    incident: "Zararli josus dastur kloni tahlil etildi (Sirdaryo_Dori_Market.apk)",
    district: "Guliston Shahri",
    riskLevel: "CRITICAL",
    inspector: "Kpt. Safarov M."
  },
  {
    incident: "Soxta 'Payme investitsiya' phishing havolasi tarqaldi (https://payme-invest-uz.info)",
    district: "Sirdaryo Tumani",
    riskLevel: "HIGH",
    inspector: "Ltn. Alimov F."
  },
  {
    incident: "Noqonuniy farmatsevtik preparatlar sotuvi kanali fiksatsiya qilindi",
    district: "Sayxunobod Tumani",
    riskLevel: "CRITICAL",
    inspector: "Ltn. Yo'ldoshev S."
  },
  {
    incident: "Sug'urta kompensatsiyasi haqida yolg'on ijtimoiy xabar aniqlandi",
    district: "Sardoba Tumani",
    riskLevel: "MEDIUM",
    inspector: "Kpt. Qodirov J."
  },
  {
    incident: "Davlat idorasining soxta xabarnoma xati tarqalishi bloklandi",
    district: "Mirzaobod Tumani",
    riskLevel: "HIGH",
    inspector: "Ltn. Karimov A."
  },
  {
    incident: "Bank foydalanuvchilarining parollarini o'g'irlovchi soxta telegram bot aniqlandi",
    district: "Yangiyer Shahri",
    riskLevel: "HIGH",
    inspector: "Kpt. Yo'ldoshev S."
  },
  {
    incident: "Mobil diler nomidan soxta aksiyalar va USSD kodlar tarqatilmoqda",
    district: "Oqoltin Tumani",
    riskLevel: "MEDIUM",
    inspector: "Tizim Patrul Bot"
  }
];

const STATUS_ORDER: Array<LiveIncident["status"]> = ["Assigned", "Accepted", "Investigating", "Evidence Uploaded", "Resolved", "Blocked"];

// Helper component for animated stats count
function AnimatedNumber({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 600; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const ease = progress * (2 - progress);
      const current = Math.floor(start + (end - start) * ease);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

export default function AIOCDashboard() {
  const [incidents, setIncidents] = useState<LiveIncident[]>(INITIAL_INCIDENTS);
  const [mapLayer, setMapLayer] = useState<"risk" | "heatmap" | "density">("risk");
  const [focusedDistrict, setFocusedDistrict] = useState<string>("Guliston Shahri");
  const [isSimulatorRunning, setIsSimulatorRunning] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Real-time dynamic stats
  const [stats, setStats] = useState({
    aiAnalysis: 2415,
    activeIncidents: 34,
    criticalIncidents: 12,
    telegramMonitoring: 185,
    websiteMonitoring: 94,
    apkAnalysis: 18,
    onlineInspectors: 8,
    aiConfidence: 96.8
  });

  // Simulator for real-time incidents
  useEffect(() => {
    if (!isSimulatorRunning) return;

    const interval = setInterval(() => {
      // 1. Generate new incident
      const randomBase = SIMULATED_INCIDENT_POOL[Math.floor(Math.random() * SIMULATED_INCIDENT_POOL.length)];
      const date = new Date();
      const timeStr = date.toLocaleTimeString("uz-UZ", { hour12: false });
      const newId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const newIncident: LiveIncident = {
        id: newId,
        time: timeStr,
        incident: randomBase.incident,
        district: randomBase.district,
        riskLevel: randomBase.riskLevel as any,
        inspector: randomBase.inspector,
        status: "Assigned",
        rawTime: date
      };

      // 2. Add to incident feed
      setIncidents(prev => [newIncident, ...prev.slice(0, 19)]); // Keep last 20
      setFocusedDistrict(randomBase.district);

      // 3. Increment counters
      setStats(prev => {
        const isCritical = randomBase.riskLevel === "CRITICAL";
        const isHigh = randomBase.riskLevel === "HIGH";
        
        return {
          aiAnalysis: prev.aiAnalysis + 1,
          activeIncidents: prev.activeIncidents + 1,
          criticalIncidents: isCritical ? prev.criticalIncidents + 1 : prev.criticalIncidents,
          telegramMonitoring: prev.telegramMonitoring + (Math.random() > 0.5 ? 1 : 0),
          websiteMonitoring: prev.websiteMonitoring + (Math.random() > 0.7 ? 1 : 0),
          apkAnalysis: prev.apkAnalysis + (Math.random() > 0.8 ? 1 : 0),
          onlineInspectors: prev.onlineInspectors,
          aiConfidence: parseFloat((prev.aiConfidence + (Math.random() * 0.2 - 0.1)).toFixed(2))
        };
      });

      setLastUpdated(date);
    }, 8000); // Add every 8 seconds for nice realistic speed

    return () => clearInterval(interval);
  }, [isSimulatorRunning]);

  // Uptime ticker
  const [uptime, setUptime] = useState("02:14:45");
  useEffect(() => {
    let secs = 8085; // Simulated initial uptime in seconds (2h 14m 45s)
    const interval = setInterval(() => {
      secs++;
      const hrs = Math.floor(secs / 3600).toString().padStart(2, "0");
      const mins = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
      const s = (secs % 60).toString().padStart(2, "0");
      setUptime(`${hrs}:${mins}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulator step-by-step update for existing incidents
  useEffect(() => {
    if (!isSimulatorRunning) return;

    const interval = setInterval(() => {
      setIncidents(prev => {
        return prev.map(inc => {
          // If already resolved or blocked, leave it
          if (inc.status === "Resolved" || inc.status === "Blocked") return inc;
          
          // 40% chance of advancing status
          if (Math.random() > 0.6) {
            const currentIdx = STATUS_ORDER.indexOf(inc.status);
            if (currentIdx !== -1 && currentIdx < STATUS_ORDER.length - 1) {
              const nextStatus = STATUS_ORDER[currentIdx + 1];
              
              // If resolving/blocking, decrement active incident counter
              if (nextStatus === "Resolved" || nextStatus === "Blocked") {
                setStats(s => ({
                  ...s,
                  activeIncidents: Math.max(0, s.activeIncidents - 1),
                  criticalIncidents: inc.riskLevel === "CRITICAL" ? Math.max(0, s.criticalIncidents - 1) : s.criticalIncidents
                }));
              }
              
              return {
                ...inc,
                status: nextStatus
              };
            }
          }
          return inc;
        });
      });
    }, 5000); // Status updates every 5 seconds

    return () => clearInterval(interval);
  }, [isSimulatorRunning]);

  const handleIncidentClick = (inc: LiveIncident) => {
    setFocusedDistrict(inc.district);
  };

  const getSeverityColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "text-red-400 border-red-500/30 bg-red-500/10";
      case "HIGH": return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "MEDIUM": return "text-blue-400 border-blue-500/30 bg-blue-500/10";
      default: return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Blocked": return "text-red-400 bg-red-950/20 border border-red-500/20";
      case "Resolved": return "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20";
      case "Evidence Uploaded": return "text-purple-400 bg-purple-950/20 border border-purple-500/20";
      case "Investigating": return "text-blue-400 bg-blue-950/20 border border-blue-500/20";
      case "Accepted": return "text-indigo-400 bg-indigo-950/20 border border-indigo-500/20";
      default: return "text-amber-400 bg-amber-950/20 border border-amber-500/20 animate-pulse";
    }
  };

  const statusCards: StatCardData[] = [
    {
      title: "AI TAHLILLARI BUGUN",
      value: stats.aiAnalysis,
      increment: 12,
      trend: "+14.2%",
      trendDir: "up",
      status: "Skaner faol",
      statusColor: "text-blue-400 bg-blue-500/10",
      borderColor: "border-blue-500/15 hover:border-blue-500/40",
      glowColor: "group-hover:shadow-blue-500/10",
      icon: Sparkles
    },
    {
      title: "FAOL TAHIDLAR",
      value: stats.activeIncidents,
      increment: 2,
      trend: "Muntazam",
      trendDir: "stable",
      status: "Nazorat ostida",
      statusColor: "text-amber-400 bg-amber-500/10",
      borderColor: "border-amber-500/15 hover:border-amber-500/40",
      glowColor: "group-hover:shadow-amber-500/10",
      icon: ShieldAlert
    },
    {
      title: "KRITIK TAHIDLAR",
      value: stats.criticalIncidents,
      increment: 1,
      trend: "Tezkor chora",
      trendDir: "up",
      status: "Tahdid darajasi: Yuqori",
      statusColor: "text-red-400 bg-red-500/10 animate-pulse",
      borderColor: "border-red-500/15 hover:border-red-500/40",
      glowColor: "group-hover:shadow-red-500/10",
      icon: AlertTriangle
    },
    {
      title: "TELEGRAM MONITORING",
      value: stats.telegramMonitoring,
      increment: 8,
      trend: "+11.5%",
      trendDir: "up",
      status: "Kanallar skanlanmoqda",
      statusColor: "text-emerald-400 bg-emerald-500/10",
      borderColor: "border-emerald-500/15 hover:border-emerald-500/40",
      glowColor: "group-hover:shadow-emerald-500/10",
      icon: Globe
    },
    {
      title: "VEB-SAYT MONITORINGI",
      value: stats.websiteMonitoring,
      increment: 4,
      trend: "+4.1%",
      trendDir: "up",
      status: "Phishing filtrlari faol",
      statusColor: "text-indigo-400 bg-indigo-500/10",
      borderColor: "border-indigo-500/15 hover:border-indigo-500/40",
      glowColor: "group-hover:shadow-indigo-500/10",
      icon: Cpu
    },
    {
      title: "APK TAHLILLARI",
      value: stats.apkAnalysis,
      increment: 1,
      trend: "+2.5%",
      trendDir: "up",
      status: "Zararli ilova aniqlagich",
      statusColor: "text-purple-400 bg-purple-500/10",
      borderColor: "border-purple-500/15 hover:border-purple-500/40",
      glowColor: "group-hover:shadow-purple-500/10",
      icon: FileCode
    },
    {
      title: "NAVBATCHI INSPEKTORLAR",
      value: stats.onlineInspectors,
      increment: 0,
      trend: "Tarkib to'liq",
      trendDir: "stable",
      status: "Hududiy gvardiya online",
      statusColor: "text-cyan-400 bg-cyan-500/10",
      borderColor: "border-cyan-500/15 hover:border-cyan-500/40",
      glowColor: "group-hover:shadow-cyan-500/10",
      icon: Users
    },
    {
      title: "AI ISHONCH DARAJASI",
      value: stats.aiConfidence,
      increment: 0,
      trend: "Mukammal",
      trendDir: "stable",
      status: "Gemini-3.5-Flash tahlili",
      statusColor: "text-teal-400 bg-teal-500/10",
      borderColor: "border-teal-500/15 hover:border-teal-500/40",
      glowColor: "group-hover:shadow-teal-500/10",
      icon: Activity
    }
  ];

  return (
    <div className="flex-1 w-full bg-[#070B14] p-4 md:p-6 lg:p-8 space-y-8 z-10 text-left">
      
      {/* Dynamic Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#0E1726]/40 border border-white/5 p-4 rounded-2xl backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <h2 className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-2">
              Sirdaryo AIOC Terminali
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono">
            National AI Cyber-Threat Intelligence Operations Center — Sirdaryo HQ Node 01
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="bg-black/40 border border-white/5 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-gray-400">STATUS:</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>

          <div className="bg-black/40 border border-white/5 rounded-xl px-3 py-1.5 flex items-center gap-2">
            <span className="text-gray-400">UPTIME:</span>
            <span className="text-blue-400 font-bold">{uptime}</span>
          </div>

          <button 
            onClick={() => setIsSimulatorRunning(!isSimulatorRunning)}
            className={`px-3 py-1.5 rounded-xl font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
              isSimulatorRunning 
                ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20" 
                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {isSimulatorRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulatorRunning ? "Simulyatsiyani To'xtatish" : "Simulyatsiyani Yoqish"}</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 1: NATIONAL STATUS CARDS           */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="national-status-cards">
        {statusCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              className={`bg-[#131D2E]/60 backdrop-blur-md border rounded-2xl p-4 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer ${card.borderColor} ${card.glowColor}`}
              whileHover={{ y: -4, scale: 1.02 }}
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
                  {card.title}
                </span>
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              <div className="my-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-display text-white tracking-tight">
                  <AnimatedNumber value={card.value} />
                </span>
                <span className={`text-[10px] font-mono font-semibold flex items-center gap-0.5 ${
                  card.trendDir === "up" ? "text-emerald-400" : card.trendDir === "down" ? "text-red-400" : "text-gray-400"
                }`}>
                  {card.trendDir === "up" ? <TrendingUp className="w-3 h-3" /> : card.trendDir === "down" ? <TrendingDown className="w-3 h-3" /> : null}
                  {card.trend}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px]">
                <span className={`px-2 py-0.5 rounded font-medium ${card.statusColor}`}>
                  {card.status}
                </span>
                <span className="text-gray-500 font-mono">NODE_01</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ========================================== */}
      {/* SECTION 2: INTERACTIVE INTELLIGENCE MAP     */}
      {/* ========================================== */}
      <div className="space-y-4" id="interactive-intelligence-map">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold font-display text-white">Interactive Kiber-Tahdidlar GIS Xaritasi</h3>
            <p className="text-xs text-gray-400">
              Sirdaryo viloyati hududiy risk poligonlari, real vaqtda faol insident markerlari va tahlil qatlamlari
            </p>
          </div>

          {/* Map Layer Selectors */}
          <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/10">
            {[
              { key: "risk", label: "🛡️ AI Risk Poligonlari" },
              { key: "heatmap", label: "🔥 Zichlik Issiqlik Xaritasi (Heatmap)" },
              { key: "density", label: "📊 Monitoring Zonalari" }
            ].map(layer => (
              <button
                key={layer.key}
                onClick={() => setMapLayer(layer.key as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  mapLayer === layer.key 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Largest Visual Component: Height 750px */}
        <div className="relative w-full rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-[#09111e]">
          <AIOCMap 
            height="750px" 
            layerType={mapLayer} 
            focusedDistrict={focusedDistrict} 
            liveIncidents={incidents}
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 3: LIVE INCIDENT FEED              */}
      {/* ========================================== */}
      <div className="bg-[#131D2E]/40 border border-white/8 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4" id="live-incident-feed">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Radar className="w-5 h-5 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
              Kiber-Gvardiya Real-Vaqt Voqealar Tasmasi
            </h3>
            <p className="text-xs text-gray-400">
              Avtomatik tarzda yangilanuvchi tahdid hodisalari, tizim xabarlari va inspektorlar tasdiqlash navbati
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-gray-500">
              OXIRGI VOQEA: {lastUpdated.toLocaleTimeString("uz-UZ")}
            </span>
            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/5 border border-blue-500/20 text-blue-400 animate-spin-slow">
              <RefreshCw className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Incident table layout */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-white/5 text-gray-500 font-mono">
                <th className="pb-3 font-semibold w-24">Vaqt</th>
                <th className="pb-3 font-semibold w-28">ID</th>
                <th className="pb-3 font-semibold">Kiber Hodisa / Tahdid Tavsifi</th>
                <th className="pb-3 font-semibold w-40">Hudud / Tuman</th>
                <th className="pb-3 font-semibold w-28">Xavf Indeksi</th>
                <th className="pb-3 font-semibold w-44">Biriktirilgan Inspektor</th>
                <th className="pb-3 font-semibold w-36">Joriy Holat</th>
                <th className="pb-3 font-semibold text-right w-16">GIS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence initial={false}>
                {incidents.map((inc) => (
                  <motion.tr
                    key={inc.id}
                    initial={{ opacity: 0, y: -10, backgroundColor: "rgba(59, 130, 246, 0.08)" }}
                    animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    onClick={() => handleIncidentClick(inc)}
                    className={`hover:bg-white/5 transition-all cursor-pointer ${
                      focusedDistrict === inc.district ? "bg-blue-500/5 border-l-2 border-l-blue-500" : ""
                    }`}
                  >
                    <td className="py-3.5 font-mono text-gray-400 text-[11px]">{inc.time}</td>
                    <td className="py-3.5 font-mono font-bold text-blue-400">{inc.id}</td>
                    <td className="py-3.5">
                      <div className="flex items-center gap-2">
                        {inc.riskLevel === "CRITICAL" ? (
                          <AlertOctagon className="w-4 h-4 text-red-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span className="text-white font-medium text-[12px]">{inc.incident}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-300 font-semibold flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{inc.district}</span>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${getSeverityColor(inc.riskLevel)}`}>
                        {inc.riskLevel === "CRITICAL" ? "92% CRITICAL" : inc.riskLevel === "HIGH" ? "84% HIGH" : "65% MEDIUM"}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-300 font-mono text-[11px]">{inc.inspector}</td>
                    <td className="py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusColor(inc.status)}`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button 
                        className="p-1 rounded bg-blue-500/5 hover:bg-blue-500/20 text-blue-400 hover:text-white transition-all cursor-pointer"
                        title="GIS Xaritada topish"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* SECTION 4: AI INTELLIGENCE OVERVIEW        */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="ai-intelligence-overview">
        
        {/* Left Card: Main Analytic Progress Metrics */}
        <div className="lg:col-span-7 bg-[#131D2E]/60 border border-white/8 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6">
          <div className="border-b border-white/5 pb-3">
            <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              Sun'iy Intellekt Tahliliy Ko'rsatkichlari
            </h3>
            <p className="text-xs text-gray-400">
              Algoritmlar va Gemini-3.5-Flash tomonidan shakllantirilgan real vaqt kiber-statistika indekslari
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Index 1: Highest Risk District */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">ENG YUQORI XAVFLI HUDUD</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-display">Guliston Shahri (Markaz)</span>
                <span className="text-red-400 font-bold font-mono text-xs bg-red-500/10 px-2 py-0.5 rounded">95% CRITICAL</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: "95%" }} />
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                Telegram dori reklamalari va klon fishing to'lov sahifalari konsentratsiyasi eng yuqori bo'lgan hudud.
              </p>
            </div>

            {/* Index 2: Fastest Response Time */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">MUNOSABAT VAQTI (RESPONSE)</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-display">O'rtacha 6.4 daqiqa</span>
                <span className="text-emerald-400 font-bold font-mono text-xs bg-emerald-500/10 px-2 py-0.5 rounded">-18% kamayish</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "84%" }} />
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                Inspektorlarning ariza kelib tushgandan so'ng kiber-dalilni tekshirish va tasdiqlash o'rtacha davomiyligi.
              </p>
            </div>

            {/* Index 3: Most Reported Area */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">ENG KO'P XABAR QILINGAN</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-display">Telegram Firibgarligi</span>
                <span className="text-blue-400 font-bold font-mono text-xs bg-blue-500/10 px-2 py-0.5 rounded">73% ulush</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: "73%" }} />
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                Yuborilgan jami kiber shubhalarning qariyb robo-qismi Telegram soxta yutuqli bot va dori kanallaridir.
              </p>
            </div>

            {/* Index 4: Average AI Confidence */}
            <div className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-2">
              <span className="text-[10px] font-mono uppercase text-gray-500 block">AI ISHONCH KOEFFITSIYENTI</span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white font-display">96.8% Barqaror</span>
                <span className="text-teal-400 font-bold font-mono text-xs bg-teal-500/10 px-2 py-0.5 rounded">Excellent</span>
              </div>
              <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full" style={{ width: "96.8%" }} />
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed font-light">
                Sun'iy intellekt tomonidan skrinshot matnini aniqlash va xavflilik ballarini hisoblashning aniqligi.
              </p>
            </div>
          </div>

          {/* Today's Trend Area chart custom SVG */}
          <div className="bg-black/35 border border-white/5 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase text-gray-500">BUGUNGI TAHDID INTENSIVLIGI TRENDI</span>
                <h4 className="text-xs font-semibold text-white">Soatlik faollik egrisi va AI prognozi</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                Dinamik o'sish: +14%
              </span>
            </div>

            <div className="h-32 w-full relative flex flex-col justify-between pt-2">
              <svg className="w-full h-20 overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path 
                  d="M 0,60 Q 50,40 100,70 T 200,20 T 300,50 T 400,10 T 500,60 L 500,80 L 0,80 Z" 
                  fill="url(#trendGradient)" 
                />
                <path 
                  d="M 0,60 Q 50,40 100,70 T 200,20 T 300,50 T 400,10 T 500,60" 
                  fill="none" 
                  stroke="#3B82F6" 
                  strokeWidth="2" 
                />
                {/* Highlights */}
                <circle cx="200" cy="20" r="4.5" fill="#EF4444" stroke="#131D2E" strokeWidth="2" className="animate-pulse" />
                <circle cx="400" cy="10" r="4.5" fill="#3B82F6" stroke="#131D2E" strokeWidth="2" />
              </svg>
              <div className="flex justify-between text-[9px] font-mono text-gray-500 border-t border-white/5 pt-2">
                <span>08:00</span>
                <span>10:00</span>
                <span>12:00</span>
                <span>14:00 (Hozir)</span>
                <span>16:00 (Prognoz)</span>
                <span>18:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Flagged suspicious resources, websites, channels & AI predictions */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* List Card: High Risk Flagged Elements */}
          <div className="bg-[#131D2E]/60 border border-white/8 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4">
            <div className="border-b border-white/5 pb-3">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-1.5">
                <Terminal className="w-4.5 h-4.5 text-blue-400" />
                Aniqlangan shubhali manbalar
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">
                Oxirgi 24 soat ichida bloklangan va tahlil qilinayotgan ob'ektlar
              </p>
            </div>

            <div className="space-y-3">
              {/* Suspicious telegram channels */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">TELEGRAM KANALLARI (CRITICAL):</span>
                {[
                  { name: "@sirdaryo_dori_reklama", status: "BLOKLANDI", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                  { name: "@click_bonus_uzbekistan", status: "KUZATUVDA", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                  { name: "@oson_pul_topish_bot", status: "BLOKLANDI", color: "text-red-400 bg-red-500/10 border-red-500/20" }
                ].map((tg, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl border border-white/5 text-xs">
                    <span className="font-mono text-white/90 font-medium">{tg.name}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${tg.color}`}>
                      {tg.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Phishing sites */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">PHISHING SAYTLARI (HIGH):</span>
                {[
                  { url: "https://click-verify-card.online", status: "IP BLOKLANGAN", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                  { url: "https://payme-bonus-cabinet.uz", status: "HOSTING BLOCKED", color: "text-red-400 bg-red-500/10 border-red-500/20" },
                  { url: "https://uzcard-recalc.info", status: "KUZATUVDA", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
                ].map((site, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl border border-white/5 text-xs">
                    <span className="font-mono text-white/90 truncate max-w-[180px]" title={site.url}>{site.url}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${site.color}`}>
                      {site.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Malware APK threats */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-mono text-gray-500 font-bold uppercase">ZARARLI APKLAR (CRITICAL):</span>
                {[
                  { name: "SirdaryoDori_Market_Secured.apk", status: "DETEKSIYA ETILDI" },
                  { name: "Tezkor_Internet_Uz.apk", status: "VIRUS TAZIQLANDI" }
                ].map((apk, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/20 p-2.5 rounded-xl border border-white/5 text-xs">
                    <span className="font-mono text-white/90 truncate max-w-[180px]" title={apk.name}>{apk.name}</span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded text-red-400 bg-red-500/10 border border-red-500/20 animate-pulse">
                      {apk.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Prediction Card */}
          <div className="bg-gradient-to-tr from-blue-950/40 via-[#131D2E]/60 to-[#0c1829] border border-blue-500/15 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] text-blue-400 font-mono font-bold uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5 animate-bounce" />
                AI BASHORATI & PROGNOZ
              </div>
              
              <h4 className="text-sm font-bold text-white font-display">
                Kelgusi 24 soatlik xavflilik prognozi
              </h4>
              
              <p className="text-[11px] text-gray-300 leading-relaxed font-light">
                Guliston shahri va Sirdaryo tumanidagi Telegram dori-bozori va phishing guruhlari to'lqini davom etadi. Prognoz qilinayotgan umumiy Sirdaryo kiber-xavf darajasi: <strong className="text-amber-400 font-mono">84% (HIGH)</strong>. Sayxunobod tumanida korporativ pochtalarga phishing urinishlari 12% ortishi prognoz qilinmoqda.
              </p>

              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-500">PROGNOZ ISHONCHLILIGI:</span>
                <span className="text-blue-400 font-bold">92.4% ACCURACY</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

// Dummy Brain Component used above
function Brain(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M12 5v14" />
      <path d="M12 12h6" />
      <path d="M12 12H6" />
    </svg>
  );
}
