import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const activities = [
  "AI detected suspicious Telegram channel...",
  "Scanning APK file...",
  "Website analysis completed...",
  "Risk score updated...",
  "Threat blocked successfully...",
  "Network node optimized...",
  "New threat signature added...",
];

export default function LiveActivity() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#0E1726]/80 backdrop-blur-md border border-white/10 rounded-xl p-4 overflow-hidden relative">
      <h3 className="text-xs font-mono text-blue-400 mb-2 uppercase tracking-widest">Live Activity</h3>
      <div className="h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            className="text-xs text-white font-mono"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activities[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
    </div>
  );
}
