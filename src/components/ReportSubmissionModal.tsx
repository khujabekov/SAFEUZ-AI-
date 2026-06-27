import React, { useState } from "react";
import { 
  X, 
  ShieldAlert, 
  Send, 
  CheckCircle, 
  AlertTriangle,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ReportSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReport: any) => void;
  preFilledData?: {
    target: string;
    category: string;
    riskScore: number;
    severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  };
}

const DISTRICTS = [
  "Sirdaryo tumani",
  "Guliston shahri",
  "Yangiyer shahri",
  "Sardoba tumani",
  "Xovos tumani",
  "Boyovut tumani",
  "Shirin shahri",
  "Sayxunobod tumani",
  "Mirzaobod tumani",
  "Oqoltin tumani"
];

const CATEGORIES = [
  { id: "Narcotics Detection", label: "🚨 Narcotics Detection (Giyohvandlik/Dori)" },
  { id: "Phishing Detection", label: "🎣 Phishing Detection (Fishg/Soxta sayt)" },
  { id: "APK Analysis", label: "📦 APK Analysis (Xavfli APK dastur)" },
  { id: "Telegram Monitoring", label: "📲 Telegram Monitoring (Shubhali guruh/kanal)" },
  { id: "Regional Analytics", label: "📊 Regional Incident (Boshqa kiber tahdid)" },
];

export default function ReportSubmissionModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  preFilledData 
}: ReportSubmissionModalProps) {
  const [district, setDistrict] = useState(DISTRICTS[0]);
  const [category, setCategory] = useState(preFilledData?.category || CATEGORIES[1].id);
  const [target, setTarget] = useState(preFilledData?.target || "");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">(preFilledData?.severity || "MEDIUM");
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  React.useEffect(() => {
    if (preFilledData) {
      if (preFilledData.target) setTarget(preFilledData.target);
      if (preFilledData.severity) setSeverity(preFilledData.severity);
      if (preFilledData.category) {
        // map category key to modal category name if possible
        const matched = CATEGORIES.find(c => c.id.toLowerCase().includes(preFilledData.category.toLowerCase()) || preFilledData.category.toLowerCase().includes(c.id.toLowerCase()));
        if (matched) setCategory(matched.id);
      }
    }
  }, [preFilledData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          district,
          category,
          target,
          description,
          severity,
          riskScore: preFilledData?.riskScore || (severity === "CRITICAL" ? 95 : severity === "HIGH" ? 85 : severity === "MEDIUM" ? 65 : 35)
        })
      });

      if (!response.ok) {
        throw new Error("Yuborishda xatolik");
      }

      const data = await response.json();
      setSubmittedSuccess(true);
      
      setTimeout(() => {
        onSuccess(data.report);
        setSubmittedSuccess(false);
        setTarget("");
        setDescription("");
        onClose();
      }, 1500);

    } catch (err) {
      console.error(err);
      alert("Xabar yuborish muvaffaqiyatsiz tugadi. Iltimos qayta urinib ko'ring.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#131D2E] border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-white"
        >
          {/* Top Bar Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-blue-400" />
              <span className="font-semibold font-display text-sm tracking-wide">
                Xavfsiz hudud bo'yicha tahdid yuborish
              </span>
            </div>
            <button 
              onClick={onClose}
              className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/5 cursor-pointer transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          {submittedSuccess ? (
            <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Xabar muvaffaqiyatli qabul qilindi</h3>
                <p className="text-xs text-white/50 mt-1">
                  Xabar tahlil qilindi va Sirdaryo markaziy operatoriga yo'naltirildi. Rahmat!
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-sans">
              
              {/* Target Input */}
              <div className="space-y-1.5">
                <label className="text-white/60 uppercase font-mono tracking-wider font-semibold">
                  Tahdid Manbasi (Telegram havola, sayt manzili, yoki fayl nomi) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan, @sirdaryo_dori_bot yoki http://payme-bonus-check.uz"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all placeholder-white/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* District */}
                <div className="space-y-1.5">
                  <label className="text-white/60 uppercase font-mono tracking-wider font-semibold">
                    Hudud (Sirdaryo viloyati) *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-[#0E1726] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-white/60 uppercase font-mono tracking-wider font-semibold">
                    Tahlil toifasi *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0E1726] border border-white/10 rounded-xl px-3 py-2.5 text-white outline-none focus:border-blue-500 transition-all cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Severity Level */}
              <div className="space-y-1.5">
                <label className="text-white/60 uppercase font-mono tracking-wider font-semibold">
                  Tahdid Darajasi *
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "LOW", label: "Past", color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10" },
                    { id: "MEDIUM", label: "O'rtacha", color: "border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10" },
                    { id: "HIGH", label: "Yuqori", color: "border-amber-500/30 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10" },
                    { id: "CRITICAL", label: "Kritik", color: "border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10" },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSeverity(lvl.id as any)}
                      className={`py-2 rounded-lg border text-center font-semibold transition-all cursor-pointer ${
                        severity === lvl.id 
                          ? "bg-white/15 border-white text-white shadow-md"
                          : lvl.color
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-white/60 uppercase font-mono tracking-wider font-semibold">
                  Qo'shimcha tavsif (skrinshot tafsilotlari, noqonuniy dori turlari, hamyon manzili va hk)
                </label>
                <textarea
                  placeholder="Ushbu kiber tahdid haqida qo'shimcha ma'lumot qoldiring. Masalan: telegram guruhi a'zolari 2500 kishi, giyohvandlik rekvizitlari taqdim etilgan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all placeholder-white/20 resize-none"
                />
              </div>

              {/* Warning label */}
              <div className="p-3 bg-red-950/10 border border-red-500/10 rounded-xl text-red-400 flex items-start gap-2 text-[11px]">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  SafeUZ AI milliy kiberxavfsizlik qonunchiligiga muvofiq, yolg'on ma'lumot berish yoki soxta hisobotlar yuborish javobgarlikka sabab bo'lishi mumkin.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={submitting || !target.trim()}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/15 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Yuborish
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
