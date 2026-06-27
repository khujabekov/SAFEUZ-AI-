import React, { useState, useEffect } from "react";
import { 
  Activity, 
  ShieldAlert, 
  Database, 
  Clock, 
  Calendar, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle 
} from "lucide-react";
import { motion } from "motion/react";

interface RightStatusPanelProps {
  reportsCount: number;
  averageRiskScore: number;
}

export default function RightStatusPanel({ reportsCount, averageRiskScore }: RightStatusPanelProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [pulseScale, setPulseScale] = useState(true);
  const [simulatedLoad, setSimulatedLoad] = useState(24);

  useEffect(() => {
    // Dynamic time ticking
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("uz-UZ", { hour12: false }));
      setCurrentDate(now.toLocaleDateString("uz-UZ", { 
        weekday: "long", 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate server load fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedLoad(prev => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = prev + delta;
        return Math.max(12, Math.min(48, next));
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="right-status-panel" className="bg-[#131D2E] border border-white/8 rounded-2xl p-5 space-y-6 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Decorative scan overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span className="text-sm font-semibold tracking-wider uppercase font-display text-emerald-400">
            SYSTEM ONLINE
          </span>
        </div>
        <div className="text-[10px] font-mono text-white/40">
          SECURE_NODE_UZ_01
        </div>
      </div>

      {/* Interactive Glowing Radar Sweeper */}
      <div className="flex justify-center py-2">
        <div className="relative w-36 h-36 rounded-full border border-blue-500/10 flex items-center justify-center bg-black/30 overflow-hidden">
          {/* Radar circular rings */}
          <div className="absolute w-28 h-28 rounded-full border border-blue-500/15" />
          <div className="absolute w-16 h-16 rounded-full border border-blue-500/20" />
          <div className="absolute w-6 h-6 rounded-full border border-blue-500/30 bg-blue-500/10" />
          
          {/* Crosshairs */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-blue-500/10" />
          <div className="absolute left-0 right-0 h-[1px] bg-blue-500/10" />

          {/* Sweeper Hand */}
          <div className="absolute inset-0 animate-radar origin-center pointer-events-none">
            <div className="w-1/2 h-full border-r border-blue-500/40 bg-gradient-to-l from-blue-500/10 to-transparent transform rotate-0 origin-right" />
          </div>

          {/* Blinking threat nodes in radar */}
          <motion.div 
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute top-8 right-10 w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_8px_#EF4444]"
          />
          <motion.div 
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-12 left-8 w-2 h-2 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]"
          />
          <motion.div 
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1.2 }}
            className="absolute bottom-16 right-12 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_#3B82F6]"
          />

          <div className="absolute bottom-2 text-[9px] font-mono text-blue-400/75 tracking-widest uppercase">
            SCANNING AREA
          </div>
        </div>
      </div>

      {/* Connectivity & Services Indicators */}
      <div className="bg-black/20 rounded-xl p-3 border border-white/5 space-y-3">
        <h4 className="text-xs font-mono text-white/50 uppercase tracking-wider">
          Platforma xizmatlari:
        </h4>
        
        {/* Row 1: AI Monitor */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <Cpu className="w-3.5 h-3.5 text-[#3B82F6] animate-pulse" />
            <span>AI Monitoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6] animate-pulse" />
            <span className="text-blue-400 font-mono text-[11px] font-semibold">FAOL (ACTIVE)</span>
          </div>
        </div>

        {/* Row 2: Firebase Status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <Database className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Firebase DB</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[#10B981] font-mono text-[11px] font-semibold">CONNECTED</span>
          </div>
        </div>

        {/* Row 3: Security Integrity */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-white/80">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Tizim butunligi</span>
          </div>
          <div className="text-emerald-400 font-mono text-[11px] font-semibold">MUKAMMAL</div>
        </div>
      </div>

      {/* Dynamic Key Stats Gauges */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Stats: Reports */}
        <div className="bg-black/10 border border-white/5 rounded-xl p-3 text-center">
          <div className="text-[10px] uppercase font-mono text-white/50 mb-1">Xabarlar Bugun</div>
          <div className="text-2xl font-bold font-display text-white tracking-tight">
            {reportsCount}
          </div>
          <div className="text-[10px] text-[#10B981] font-mono mt-0.5 flex items-center justify-center gap-1">
            <Activity className="w-2.5 h-2.5" /> +14% o'sish
          </div>
        </div>

        {/* Right Stats: Threat Index */}
        <div className="bg-black/10 border border-white/5 rounded-xl p-3 text-center relative overflow-hidden">
          <div className="text-[10px] uppercase font-mono text-white/50 mb-1">Xavflilik Indeksi</div>
          <div className="text-2xl font-bold font-display text-[#EF4444] tracking-tight">
            {averageRiskScore.toFixed(0)}%
          </div>
          <div className="text-[10px] text-red-400 font-mono mt-0.5 flex items-center justify-center gap-1">
            <ShieldAlert className="w-2.5 h-2.5" /> CRITICAL
          </div>
        </div>
      </div>

      {/* CPU / RAM telemetry bars */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] font-mono text-white/40">
          <span>AI SERVER YUKLANISHI</span>
          <span>{simulatedLoad}%</span>
        </div>
        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
            animate={{ width: `${simulatedLoad}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Time and Date */}
      <div className="border-t border-white/5 pt-4 flex flex-col items-center justify-center text-center space-y-1">
        <div className="flex items-center gap-1.5 text-[#3B82F6] font-mono text-lg font-bold tracking-widest bg-black/40 px-3 py-1 rounded-lg border border-blue-500/10">
          <Clock className="w-4 h-4 text-blue-400" />
          <span>{currentTime || "00:00:00"}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-white/50 font-mono">
          <Calendar className="w-3.5 h-3.5 text-white/30" />
          <span className="capitalize">{currentDate || "Sana yuklanmoqda..."}</span>
        </div>
      </div>
    </div>
  );
}
