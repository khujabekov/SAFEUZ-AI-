import React, { useState, useRef } from "react";
import { 
  ShieldAlert, 
  Activity, 
  Sparkles, 
  Globe, 
  Cpu, 
  Users, 
  TrendingUp, 
  Terminal, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Eye, 
  Play, 
  RefreshCw,
  Search,
  MapPin,
  ChevronRight,
  ShieldCheck,
  AlertOctagon,
  Radar,
  Trash2,
  Edit,
  Plus,
  FileSpreadsheet,
  Download,
  Filter,
  BarChart2,
  Sliders,
  Database,
  Mail,
  Phone,
  Lock,
  FileText,
  UserCheck,
  Award,
  Bell,
  Map,
  Compass,
  Upload,
  EyeOff
} from "lucide-react";
import AIOCMap from "./AIOCMap";

// Interfaces
interface CaseItem {
  id: string;
  time: string;
  incident: string;
  district: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "Assigned" | "Accepted" | "Investigating" | "Evidence Uploaded" | "Resolved";
  source?: string;
  description?: string;
  inspector?: string;
  volunteer?: {
    telegramName: string;
    telegramUsername: string;
    telegramId: string;
    submissionTime: string;
    gpsLocation: string;
    uploadedImages: string[];
    uploadedVideos: string[];
    uploadedVoice?: string;
    uploadedFiles: string[];
    submittedText: string;
    trustScore: number;
    previousReports: number;
    confirmedReports: number;
    falseReports: number;
    reportCount: number;
  };
}

const INITIAL_CASES: CaseItem[] = [
  {
    id: "INC-4818",
    time: "14:18:02",
    incident: "Soxta 'Click bonus' fishing sayti aniqlandi (http://click-bonus-uz.com)",
    district: "Guliston Shahri",
    riskLevel: "HIGH",
    status: "Accepted",
    inspector: "Kpt. Safarov M.",
    source: "https://click-bonus-uz.com",
    description: "Click to'lov tizimining soxta interfeysi orqali foydalanuvchilarning plastik karta ma'lumotlarini (SMS kod, karta raqami) o'g'irlash harakati.",
    volunteer: {
      telegramName: "Laylo Qodirova",
      telegramUsername: "@laylo_q",
      telegramId: "612440952",
      submissionTime: "14:15:10",
      gpsLocation: "40.4912° N, 68.7121° E (Guliston shahri, Sirdaryo)",
      uploadedImages: ["https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80"],
      uploadedVideos: ["click_bonus_fraud_screencast.mp4"],
      uploadedVoice: "click_warning_voice_952.ogg (0:45)",
      uploadedFiles: ["click_fake_login_ocr.txt", "bonus_site_screenshot.jpg"],
      submittedText: "Click nomidan soxta aksiya va pul yutuqlari va'da qilishyapti. Karta kodimni kiritishni so'radi, kirmadim, ssilkani yuboryapman.",
      trustScore: 92,
      previousReports: 19,
      confirmedReports: 19,
      falseReports: 0,
      reportCount: 19
    }
  },
  {
    id: "INC-4802",
    time: "14:02:30",
    incident: "Telegram bot firibgarligi faollashdi (@pul_yutug_bot)",
    district: "Guliston Shahri",
    riskLevel: "MEDIUM",
    status: "Investigating",
    inspector: "Kpt. Safarov M.",
    source: "@pul_yutug_bot",
    description: "Prezident nomidan kompensatsiya puli tarqatishni va'da qilib, odamlardan guruhlarga odam qo'shishni va karta raqamini kiritishni talab qiladi.",
    volunteer: {
      telegramName: "Maftuna Sobirova",
      telegramUsername: "@maftuna_cyber",
      telegramId: "704812390",
      submissionTime: "13:58:20",
      gpsLocation: "40.4855° N, 68.6912° E (Guliston shahri, Sirdaryo)",
      uploadedImages: ["https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=600&q=80"],
      uploadedVideos: ["bot_scam_video_evidence.mp4"],
      uploadedVoice: "voice_note_scam_report.ogg (0:15)",
      uploadedFiles: ["bot_screenshot_main.jpg"],
      submittedText: "Prezident nomidan kompensatsiya puli berayotgan soxta bot. Odam qo'shishni va karta ma'lumotlarini so'rayapti.",
      trustScore: 99,
      previousReports: 56,
      confirmedReports: 56,
      falseReports: 0,
      reportCount: 56
    }
  },
  {
    id: "INC-4795",
    time: "13:55:12",
    incident: "Davlat tashkiloti xodimlariga soxta kompensatsiya fishing pochtasi jo'natildi",
    district: "Guliston Shahri",
    riskLevel: "HIGH",
    status: "Assigned",
    inspector: "Ltn. Alimov F.",
    source: "comp-verify@gov-uz.org",
    description: "Xizmat pochtalariga kompensatsiya olish uchun ariza topshirish so'ralgan soxta hukumat ssilkasi.",
    volunteer: {
      telegramName: "Farrux Ziyoyev",
      telegramUsername: "@farrux_z",
      telegramId: "550184291",
      submissionTime: "13:50:00",
      gpsLocation: "40.4901° N, 68.7099° E (Guliston shahri, Sirdaryo)",
      uploadedImages: ["https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=600&q=80"],
      uploadedVideos: [],
      uploadedVoice: undefined,
      uploadedFiles: ["email_headers_phishing.txt"],
      submittedText: "Pochtaga shubhali xat keldi, davlat kompanayasi nomidan. Havolasi soxta, kirmanglar deb ogohlantiraman.",
      trustScore: 40,
      previousReports: 5,
      confirmedReports: 1,
      falseReports: 4,
      reportCount: 5
    }
  }
];

export default function InspectorModules({ 
  activeTab, 
  setActiveTab, 
  inspectorName = "Kpt. Safarov M." 
}: { 
  activeTab: string; 
  setActiveTab?: (tab: string) => void; 
  inspectorName?: string;
}) {
  const [cases, setCases] = useState<CaseItem[]>(INITIAL_CASES);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(INITIAL_CASES[0]);
  const [evidenceText, setEvidenceText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedEvidence, setUploadedEvidence] = useState<{ id: string, file: string, type: string, image?: string }[]>([]);

  // Status indicators colors
  const getSeverityStyle = (level: string) => {
    switch (level) {
      case "CRITICAL": return "text-red-400 bg-red-500/10 border-red-500/20";
      case "HIGH": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "MEDIUM": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      default: return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved": return "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20";
      case "Evidence Uploaded": return "text-purple-400 bg-purple-950/20 border border-purple-500/20";
      case "Investigating": return "text-blue-400 bg-blue-950/20 border border-blue-500/20";
      case "Accepted": return "text-indigo-400 bg-indigo-950/20 border border-indigo-500/20";
      default: return "text-amber-400 bg-amber-950/20 border border-amber-500/20";
    }
  };

  // Load real incidents from the server
  React.useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          const dbCases: CaseItem[] = data.map((d: any) => {
            const isImage = d.target && d.target.includes('firebasestorage.googleapis.com');
            const isBase64OrFileId = d.target && d.target.length > 50 && !d.target.includes(' ');
            return {
              id: d.id,
              time: d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : "00:00:00",
              incident: (isImage || isBase64OrFileId) ? "Rasmli antinarkotik dalil" : d.target || "Noma'lum Incident",
              district: d.district || d.region || "Guliston Shahri",
              riskLevel: d.severity || "MEDIUM",
              status: d.status || "Assigned",
              source: d.category || "Telegram",
              description: d.description || "Tavsif kiritilmagan",
              inspector: d.inspector || "Biriktirilmagan",
              volunteer: {
                telegramName: d.reporterName || "Kiber Gvardiya",
                telegramUsername: "@" + (d.reporterName || "kiber").toLowerCase().replace(/[^a-z0-9]/g, "") + "_gvardiya",
                telegramId: d.reporterId || "Nomalum",
                submissionTime: d.timestamp ? new Date(d.timestamp).toLocaleTimeString() : "00:00:00",
                gpsLocation: d.latitude && d.longitude ? `${d.latitude}° N, ${d.longitude}° E` : "Guliston shahri, Sirdaryo",
                uploadedImages: isImage ? [d.target] : (isBase64OrFileId ? [(d.target.startsWith("iVBORw0KGgo") ? `data:image/png;base64,${d.target}` : (d.target.startsWith("/9j/") ? `data:image/jpeg;base64,${d.target}` : d.target))] : []),
                uploadedVideos: [],
                uploadedFiles: [],
                submittedText: d.description || ""
              }
            };
          });

          // Merge dbCases and INITIAL_CASES
          const merged = [...dbCases];
          INITIAL_CASES.forEach(ic => {
            if (!merged.some(m => m.id === ic.id)) {
              merged.push(ic);
            }
          });
          setCases(merged);

          // Auto-select first case that belongs to this inspector if available
          const firstMyCase = merged.find(c => c.inspector === inspectorName);
          if (firstMyCase) {
            setSelectedCase(firstMyCase);
          } else if (merged.length > 0) {
            setSelectedCase(merged[0]);
          }
        }
      } catch (err) {
        console.error("Xatolik cases yuklashda:", err);
      }
    };

    fetchCases();
  }, [inspectorName]);

  // Real status updater with API sync
  const handleUpdateStatus = async (id: string, newStatus: any) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    if (selectedCase && selectedCase.id === id) {
      setSelectedCase(prev => prev ? { ...prev, status: newStatus } : null);
    }
    
    try {
      await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (err) {
      console.error("Xabarni yangilashda xatolik:", err);
    }
  };

  const handleUploadEvidenceFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceText) return;
    
    let imageUrl: string | undefined;
    if (selectedFile) {
        imageUrl = URL.createObjectURL(selectedFile); // Simulated URL for demonstration
    }

    setUploadedEvidence(prev => [
      ...prev,
      {
        id: `EVI-${Math.floor(100 + Math.random() * 900)}`,
        file: evidenceText,
        type: "Matnli antinarkotik tahlil",
        image: imageUrl
      }
    ]);
    if (selectedCase) {
      handleUpdateStatus(selectedCase.id, "Evidence Uploaded");
    }
    setEvidenceText("");
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    alert("Antinarkotik dalil muvaffaqiyatli yuklandi va ushbu ishning tergoviga fiksatsiya qilindi!");
  };

  return (
    <div className="p-4 md:p-8 space-y-8 text-left text-white max-w-7xl mx-auto w-full">
      
      {/* 1. DASHBOARD OVERVIEW PAGE */}
      {activeTab === "inspector-dashboard" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Tergovchi Boshqaruv Jurnali</h1>
            <p className="text-xs text-gray-400">Sizga biriktirilgan hududlar va tezkor antinarkotik holat monitoringi</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-[#131D2E]/60 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-gray-400 font-bold block">BIRIKTIRILGAN SHOHOTLAR</span>
              <span className="text-2xl font-extrabold block my-2">3 ta faol</span>
              <span className="text-[10px] text-gray-500 font-light">Navbatchilikdagi murojaatlar</span>
            </div>
            <div className="bg-[#131D2E]/60 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-gray-400 font-bold block">YECHILGAN HOLATLAR</span>
              <span className="text-2xl font-extrabold block my-2 text-emerald-400">48 ta ish</span>
              <span className="text-[10px] text-gray-500 font-light">Muvaffaqiyatli bloklangan/arxivlangan</span>
            </div>
            <div className="bg-[#131D2E]/60 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] font-mono text-gray-400 font-bold block">O'RTACHA JAVOB VAQTI</span>
              <span className="text-2xl font-extrabold block my-2">5.4 minut</span>
              <span className="text-[10px] text-gray-500 font-light">Normativ doiradagi tezkor javob</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm border-b border-white/5 pb-2">Mening Hududim - Guliston Shahri</h3>
              <div className="h-64 rounded-xl overflow-hidden border border-white/5">
                <AIOCMap height="100%" layerType="risk" focusedDistrict="Guliston Shahri" liveIncidents={cases as any} />
              </div>
            </div>

            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm border-b border-white/5 pb-2">Tezkor Harakatlar</h3>
              <div className="space-y-2.5">
                <button className="w-full text-left bg-blue-600 hover:bg-blue-500 text-white p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all">
                  <span>📥 Yangi antinarkotik dalil (OCR) yuklash</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button className="w-full text-left bg-white/5 hover:bg-white/10 text-white p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all border border-white/10">
                  <span>📍 GPS navigatsiyasini yoqish</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ASSIGNED CASES PAGE */}
      {activeTab === "assigned-cases" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Menga Biriktirilgan Ishlar</h1>
            <p className="text-xs text-gray-400">Tergov va chora ko'rish navbatidagi antinarkotik murojaatlar ro'yxati</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 space-y-3">
              {(() => {
                const myCases = cases.filter(c => c.inspector === inspectorName);
                if (myCases.length === 0) {
                  return (
                    <div className="p-8 text-center text-gray-500 text-xs border border-dashed border-white/5 rounded-2xl bg-[#131D2E]/20">
                      Sizga biriktirilgan faol ishlar mavjud emas.
                    </div>
                  );
                }
                return myCases.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => setSelectedCase(c)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                      selectedCase?.id === c.id ? "bg-blue-600/10 border-blue-500/40 shadow-lg" : "bg-[#131D2E]/40 border-white/5 hover:border-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-[10px] text-blue-400 font-bold">{c.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${getSeverityStyle(c.riskLevel)}`}>
                        {c.riskLevel}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-1">{c.incident}</h4>
                    <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono mt-2 pt-2 border-t border-white/5">
                      <span>{c.district}</span>
                      <span className={`px-2 py-0.5 rounded ${getStatusStyle(c.status)}`}>{c.status}</span>
                    </div>
                  </div>
                ));
              })()}
            </div>

            <div className="lg:col-span-7 bg-[#131D2E]/40 border border-white/5 p-6 rounded-3xl space-y-6">
              {selectedCase ? (
                <>
                  {/* 1. CASE INFORMATION */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-3">
                    <div>
                      <span className="font-mono text-[10px] text-blue-400 font-bold">{selectedCase.id} / SIR_INSP_PATROL</span>
                      <h3 className="font-bold text-sm text-white">{selectedCase.incident}</h3>
                    </div>
                    <span className="font-mono text-xs text-gray-500 shrink-0">{selectedCase.time}</span>
                  </div>

                  <div className="text-xs space-y-3 bg-black/25 p-4 rounded-xl border border-white/5">
                    <div><strong>Manba / Rekvizit:</strong> <code className="bg-black/40 px-2 py-0.5 rounded text-blue-400 font-mono">{selectedCase.source || "Nomalum"}</code></div>
                    <div><strong>Tafsilot (Tavsif):</strong> {selectedCase.description}</div>
                  </div>

                  {/* 2. AI ANALYSIS */}
                  <div className="space-y-2.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5 font-mono">
                      <span>🤖</span> SUN'IY INTELLEKT TAHLILI (GEMINI)
                    </h4>
                    <div className="bg-blue-500/5 border border-blue-500/15 p-4 rounded-xl text-xs space-y-2 leading-relaxed text-gray-200 font-sans">
                      <div><strong className="text-blue-300">Tahdid turi:</strong> Tizimli fishing va moliyaviy klon sayt.</div>
                      <div><strong className="text-blue-300">OCR matn aniqlash:</strong> Click tizimiga o'xshash interfeys, "Sizga bonus berildi" kabi vizual firibgarlik elementlari.</div>
                      <div><strong className="text-blue-300">Xavf darajasi:</strong> {selectedCase.riskLevel} | Avtomatik bloklash tavsiya etiladi.</div>
                    </div>
                  </div>

                  {/* 3. PHOTOS & VIDEOS (EVIDENCE CAPTURES) */}
                  {selectedCase.volunteer && (
                    <div className="space-y-3 border-t border-white/5 pt-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5 font-mono">
                        <span>📸</span> YUKLANGAN RASM VA VIDEOLAR (TELEGRAM BOT)
                      </h4>
                      {selectedCase.volunteer.uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 gap-3">
                          {selectedCase.volunteer.uploadedImages.map((img, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden border border-white/5 bg-black/40 h-28">
                              <img src={img} alt="Evidence" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className="absolute top-1 left-1 bg-black/70 px-1.5 py-0.5 rounded font-mono text-[8px] text-gray-300">Skrinshot {i + 1}</div>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {selectedCase.volunteer.uploadedVideos.length > 0 && (
                        <div className="space-y-1.5">
                          {selectedCase.volunteer.uploadedVideos.map((vid, i) => (
                            <div key={i} className="flex items-center justify-between bg-black/25 px-3 py-2 rounded-lg border border-white/5 text-[11px] font-mono">
                              <span>🎥 {vid}</span>
                              <span className="text-cyan-400 text-[10px] cursor-pointer hover:underline">Play (Ko'rish)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 4. EVIDENCE & VOLUNTEER SUBMISSIONS */}
                  {selectedCase.volunteer && (
                    <div className="space-y-2.5 border-t border-white/5 pt-4">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5 font-mono">
                        <span>📁</span> ASOSIY DALILLAR (EVIDENCE FILES)
                      </h4>
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5 text-[11px] space-y-2">
                        <div className="text-gray-400"><strong>Volontyor Murojaati:</strong> "{selectedCase.volunteer.submittedText}"</div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-500 block">ANTINARKOTIK DALILLAR (LOGLAR/FAYLLAR):</span>
                          {selectedCase.volunteer.uploadedFiles.map((f, i) => (
                            <div key={i} className="text-blue-300 font-mono text-[10px]">📁 {f}</div>
                          ))}
                          {selectedCase.volunteer.uploadedVoice && (
                            <div className="text-indigo-300 font-mono text-[10px]">🎙️ {selectedCase.volunteer.uploadedVoice}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 5. GPS & NAVIGATION */}
                  <div className="space-y-3 border-t border-white/5 pt-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5 font-mono">
                      <span>📍</span> GPS JOYLANISH VA NAVIGATSIYA (MAP/GPS)
                    </h4>
                    {selectedCase.volunteer && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-black/20 p-3.5 rounded-xl border border-white/5">
                        <div className="space-y-1">
                          <span className="text-gray-500 text-[10px] block">KOORDINATA / GPS:</span>
                          <span className="text-white font-semibold">{selectedCase.volunteer.gpsLocation}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-500 text-[10px] block">NAVIGATSIYA MASOFA:</span>
                          <span className="text-emerald-400 font-bold">1.2 km • Mashinada ~ 4 daqiqa</span>
                        </div>
                      </div>
                    )}
                    <div className="h-44 rounded-xl overflow-hidden border border-white/10 bg-black/40 relative cursor-pointer" onClick={() => setActiveTab && setActiveTab("inspector-navigation")}>
                      <AIOCMap height="100%" layerType="heatmap" focusedDistrict={selectedCase.district} liveIncidents={cases as any} />
                      <div className="absolute inset-0 bg-blue-500/10 hover:bg-transparent transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                        <span className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold">Kattalashtirish / Navigatsiya</span>
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-gray-500 italic text-center">
                      Navigatsiya yo'riqnomasi: {selectedCase.district} antinarkotik shtabidan to'g'ri yo'nalishda.
                    </div>
                  </div>

                  {/* 6. INVESTIGATION FORM & ACTIONS */}
                  <div className="border-t border-white/5 pt-4 space-y-3 bg-blue-500/5 p-4 rounded-xl border border-blue-500/10">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5 font-mono">
                      <span>👮</span> TERGOV AMALLARI VA INVESTIGATION FORM
                    </h4>
                    
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-mono text-gray-400 block uppercase">TERGOVCHI TASVIR / QAYDLAR (NOTES):</label>
                      <textarea 
                        placeholder="Ushbu antinarkotik holat bo'yicha tezkor qaydlaringiz, provayderga xat, bloklash so'rovi va h.k."
                        value={evidenceText}
                        onChange={(e) => setEvidenceText(e.target.value)}
                        className="w-full bg-black/35 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-blue-500 h-20 placeholder:text-gray-600"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1.5">
                      <button 
                        onClick={() => handleUpdateStatus(selectedCase.id, "Investigating")}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0"
                      >
                        ⏱ Tergovni Boshlash (Investigate)
                      </button>
                      <button 
                        onClick={() => {
                          if (!evidenceText.trim()) {
                            alert("Iltimos, avval tergov qaydlarini (notes) kiriting!");
                            return;
                          }
                          handleUpdateStatus(selectedCase.id, "Resolved");
                          alert("Tergov yakunlandi, holat muvaffaqiyatli 'Resolved' antinarkotik arxiviga joylandi!");
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all shrink-0"
                      >
                        ✔️ Ishni Yakunlash (Resolve)
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-gray-500 font-light border border-dashed border-white/10 rounded-2xl">
                  Batafsil ma'lumot olish uchun chapdan murojaatni tanlang.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. MY DISTRICT PAGE */}
      {activeTab === "my-district" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Mening Shaxsiy Tumanim</h1>
            <p className="text-xs text-gray-400 font-mono">Sizga biriktirilgan Guliston shahri hududidagi antinarkotik profil va risk o'zgarishi</p>
          </div>

          <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm">Guliston Shahri Antinarkotik Profili</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Risk darajasi:</span>
                  <span className="text-amber-400 font-bold">O'RTACHA (68%)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Faol arizalar:</span>
                  <span className="text-white font-bold">3 ta faol antinarkotik ish</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-gray-400">Antinarkotik murojaat turi:</span>
                  <span className="text-red-400 font-bold">Fishing saytlari</span>
                </div>
              </div>
            </div>

            <div className="h-56 rounded-xl overflow-hidden border border-white/5">
              <AIOCMap height="100%" layerType="risk" focusedDistrict="Guliston Shahri" liveIncidents={cases as any} />
            </div>
          </div>
        </div>
      )}

      {/* 4. GIS MAP PAGE */}
      {activeTab === "inspector-gis-map" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Milliy GIS Razvedka Xaritasi</h1>
            <p className="text-xs text-gray-400 font-mono">Butun Sirdaryo viloyati bo'yicha integratsiyalashgan antinarkotik xarita va faol tumanlar</p>
          </div>

          <div className="h-[520px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl relative">
            <AIOCMap height="100%" layerType="risk" focusedDistrict="" liveIncidents={cases as any} />
          </div>
        </div>
      )}

      {/* 5. NAVIGATION PAGE */}
      {activeTab === "inspector-navigation" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-400 animate-spin" style={{ animationDuration: "8s" }} />
              Operativ GPS Navigatsiya
            </h1>
            <p className="text-xs text-gray-400">Dalillarda fiksatsiya qilingan jinoyat koordinatalariga tezkor transit yo'li tahlili</p>
          </div>

          <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-bold text-sm">Operativ Marshrut Ma'lumotlari</h3>
              <div className="space-y-3 text-xs font-mono bg-black/20 p-4 rounded-xl border border-white/5 text-gray-300">
                <div>📍 Boshlang'ich nuqta: Sirdaryo Shtabi (Guliston Shahri)</div>
                <div>📍 Manzil: {selectedCase?.district || "Guliston dehqon bozori"} ({selectedCase?.incident || "Dori savdosi koordinatasi"})</div>
                <div>⏱ Masofa / Vaqt: Navigatsiya yo'nalishi aniqlanmoqda...</div>
              </div>
            </div>

            <div className="h-56 bg-slate-900/60 rounded-xl overflow-hidden border border-white/5 relative">
              <AIOCMap height="100%" layerType="density" focusedDistrict={selectedCase?.district || "Guliston Shahri"} liveIncidents={cases as any} />
            </div>
          </div>
        </div>
      )}

      {/* 6. EVIDENCE UPLOAD PAGE */}
      {activeTab === "evidence-upload" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Tergov Dalillarini Yuklash</h1>
            <p className="text-xs text-gray-400">Tergov jarayonida aniqlangan yangi dalillar, skrinshotlar va OCR ekstraktlari</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm border-b border-white/5 pb-2">Dalil Yuklash Formasi</h3>
              <form onSubmit={handleUploadEvidenceFile} className="space-y-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Dalil haqida izoh *</label>
                  <textarea 
                    required
                    rows={4}
                    value={evidenceText}
                    onChange={(e) => setEvidenceText(e.target.value)}
                    placeholder="Masalan: Kanalda dori vositalari sotilayotganligi isboti skrinshoti OCR matni..." 
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Rasm dalil yuklash</label>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500" 
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center justify-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>Antinarkotik Dalilni Yuklash</span>
                </button>
              </form>
            </div>

            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm border-b border-white/5 pb-2">Yuklangan Dalillar Arxivi</h3>
              {uploadedEvidence.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-xs font-light">Yuklangan dalillar yo'q.</div>
              ) : (
                <div className="space-y-2">
                  {uploadedEvidence.map((evi) => (
                    <div key={evi.id} className="bg-black/20 p-3 rounded-xl border border-white/5 text-xs flex flex-col gap-2 font-mono">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-indigo-400 font-bold block">{evi.id}</span>
                          {evi.file.length > 50 && (evi.file.startsWith("data:image/") || evi.file.startsWith("iVBORw0KGgo") || evi.file.startsWith("/9j/")) ? (
                             <img src={evi.file.startsWith("iVBORw0KGgo") ? `data:image/png;base64,${evi.file}` : (evi.file.startsWith("/9j/") ? `data:image/jpeg;base64,${evi.file}` : evi.file)} alt="Dalil" className="w-32 h-32 object-cover rounded-lg" />
                          ) : (
                             <span className="text-gray-400 block text-[10px] truncate max-w-[200px]">{evi.file}</span>
                          )}
                        </div>
                        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 rounded">{evi.type}</span>
                      </div>
                      {evi.image && (
                          <img src={evi.image} alt="Dalil" className="w-full h-24 object-cover rounded-lg" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Removed sections 7 to 11 */}

    </div>
  );
}
