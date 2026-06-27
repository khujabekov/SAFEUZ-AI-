import React from 'react';
import { Brain, ShieldCheck, Radar, ShieldAlert, Cpu, Activity } from 'lucide-react';
import { motion } from 'motion/react';

const widgets = [
  { title: "AI Detection", value: "Online", icon: Brain, color: "text-blue-400" },
  { title: "Threat Prot.", value: "99.8% Active", icon: ShieldCheck, color: "text-emerald-400" },
  { title: "Live Monitor", value: "Realtime", icon: Radar, color: "text-amber-400" },
  { title: "Active Threats", value: "12", icon: ShieldAlert, color: "text-red-400" },
  { title: "Confidence", value: "98%", icon: Cpu, color: "text-blue-400" },
  { title: "Safe Regions", value: "9", icon: Activity, color: "text-emerald-400" },
];

export default function CyberWidgets() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {widgets.map((w, i) => (
        <motion.div
          key={i}
          className="bg-[#131D2E]/80 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center gap-3 shadow-lg"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <w.icon className={`w-5 h-5 ${w.color}`} />
          <div>
            <p className="text-[10px] text-gray-400 font-mono uppercase">{w.title}</p>
            <p className="text-xs font-bold text-white">{w.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
