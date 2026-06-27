import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import safeUzLogo from '../assets/images/safeuz_logo_1782537166156.jpg';

interface Props {
  onClose: () => void;
  onLoginSuccess: (role: "admin" | "inspector", inspectorName?: string) => void;
}

export default function LoginModalComponent({ onClose, onLoginSuccess }: Props) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    
    // Check for admin first
    if (login === "admin" && password === "admin123") {
      onLoginSuccess("admin");
      return;
    } 
    
    // Fallback to inspector
    try {
      const res = await fetch("/api/login/inspector", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password })
      });
      const data = await res.json();
      if (data.success) {
        onLoginSuccess("inspector", data.inspector.fullName);
      } else {
        setError(data.error || "Login yoki parol noto'g'ri");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-[#131D2E] border border-white/10 rounded-2xl p-6 space-y-4 text-white shadow-2xl relative"
      >
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <span className="font-semibold font-display text-sm flex items-center gap-2">
            <img 
              src={safeUzLogo} 
              alt="SafeUZ AI Logo" 
              className="w-5 h-5 rounded-full object-cover border border-white/10"
              referrerPolicy="no-referrer"
            />
            Kiber-shtab tizimiga kirish
          </span>
          <button onClick={onClose} className="text-white/40 hover:text-white cursor-pointer">&times;</button>
        </div>

        <div className="space-y-3 text-xs font-sans">
          <div className="space-y-1">
            <label className="text-white/60">Login</label>
            <input 
              type="text" 
              value={login} 
              onChange={(e) => setLogin(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" 
              placeholder="Login kiriting"
            />
          </div>
          <div className="space-y-1">
            <label className="text-white/60">Maxfiy kalit (Password)</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" 
            />
          </div>
          {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
        </div>

        <button 
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md"
        >
          Tizimga kirish
        </button>
      </motion.div>
    </div>
  );
}
