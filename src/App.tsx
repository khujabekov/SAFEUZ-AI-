import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Search, 
  Sparkles, 
  CheckCircle, 
  Info,
  AlertTriangle, 
  Activity, 
  ArrowRight, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Database, 
  Send, 
  ShieldCheck, 
  Users, 
  Fingerprint, 
  Globe, 
  Lock, 
  Cpu, 
  FileText,
  AlertOctagon,
  Bell,
  Terminal,
  HelpCircle,
  Image,
  MessageSquare,
  Map,
  Sliders,
  Settings,
  Github,
  BookOpen,
  Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "./components/Sidebar";
import SirdaryoMapIllustration from "./components/SirdaryoMapIllustration";
import RegionalMonitoring from "./components/RegionalMonitoring";
import ReportSubmissionModal from "./components/ReportSubmissionModal";
import AnalyticsPanel from "./components/AnalyticsPanel";
import ThreatScanBox from "./components/ThreatScanBox";
import RightStatusPanel from "./components/RightStatusPanel";
import AdminModules from "./components/AdminModules";
import InspectorModules from "./components/InspectorModules";
import CyberBackground from "./components/CyberBackground";
import CyberWidgets from "./components/CyberWidgets";
import LiveActivity from "./components/LiveActivity";
import TelegramBotSimulator from "./components/TelegramBotSimulator";
import LoginModalComponent from "./components/LoginModalComponent";
import AIChatbotWidget from "./components/AIChatbotWidget";
import { ActiveTab, ThreatReport, ScanResult } from "./types";
import safeUzLogo from "./assets/images/safeuz_logo_1782537166156.jpg";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [reports, setReports] = useState<ThreatReport[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [preFillData, setPreFillData] = useState<any>(undefined);
  
  // Simulated Auth States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState(""); 
  const [dashboardRole, setDashboardRole] = useState<"inspector" | "admin">("admin");
  const [inspectorName, setInspectorName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);

  // Active laboratory details inside features section
  const [activeLabFeature, setActiveLabFeature] = useState<string | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      if (dashboardRole === "admin") {
        setActiveTab("volunteer-management");
      } else if (dashboardRole === "inspector") {
        setActiveTab("inspector-dashboard");
      }
    } else {
      setActiveTab("home");
    }
  }, [isLoggedIn, dashboardRole]);

  // Load reports from Express backend
  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      if (res.ok) {
        const data = await res.json();
        setReports(data);
      }
    } catch (err) {
      console.error("Xabarlarni yuklashda xatolik:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAddReport = async (newRep: Omit<ThreatReport, "id" | "status" | "timestamp">) => {
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRep)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReports(prev => [data.report, ...prev]);
        }
      }
    } catch (err) {
      console.error("Xabarni saqlashda xatolik:", err);
    }
  };

  const handleActionReport = async (id: string, action: string) => {
    if (action === "delete") {
      setReports(prev => prev.filter(r => r.id !== id));
    } else {
      // Simulate update status in state
      setReports(prev => prev.map(r => {
        if (r.id === id) {
          let updatedStatus = "Ko'rib chiqildi";
          if (action === "block") updatedStatus = "Tasdiqlandi (Bloklandi)";
          if (action === "archive") updatedStatus = "Arxivlandi";
          return { ...r, status: updatedStatus };
        }
        return r;
      }));
    }
  };

  const handleAddReportFromScan = (scan: ScanResult) => {
    setPreFillData({
      target: scan.target,
      category: scan.threatType,
      riskScore: scan.riskScore,
      severity: scan.severity
    });
    setIsReportModalOpen(true);
  };

  // Calculate average risk score
  const getAverageRiskScore = () => {
    if (reports.length === 0) return 78;
    const sum = reports.reduce((acc, curr) => acc + curr.riskScore, 0);
    return Math.round(sum / reports.length);
  };

  // FAQ state toggle
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqData = [
    {
      q: "SafeUZ AI nima?",
      a: "SafeUZ AI — Sirdaryo viloyatida giyohvandlik vositalari, psixotrop moddalar, kuchli ta'sir qiluvchi dori-darmonlarning noqonuniy aylanmasi (sintetik guruhlar, devorlardagi graffiti reklamalari, 'zakladka' holatlari) va dorixonalardagi noqonuniy dori-darmonlar savdosini aniqlash, tahlil qilish hamda monitoring qilish bo'yicha milliy innovatsion platformadir."
    },
    {
      q: "Xabarlar va dalillar qanday tahlil qilinadi?",
      a: "Taqdim etilgan skrinshotlar, xabarlar yoki devoriy graffiti rasmlari Google Gemini-3.5-Flash sun'iy intellekti va maxsus dori-tahlil algoritmlari tomonidan 10 soniya ichida matn dekonstruksiyasi, kontekstli tahlil va risklarni baholash tizimidan o'tkaziladi."
    },
    {
      q: "Xabar yuborish anonimmi?",
      a: "Ha. Tizimimizga noqonuniy dori yoki narkotik aylanmasi haqidagi ma'lumotlarni mutlaqo anonim tarzda yuborishingiz mumkin. Arizachilardan shaxsiy identifikatsiya ma'lumotlari majburiy talab etilmaydi, bu esa fuqarolar xavfsizligini kafolatlaydi."
    },
    {
      q: "Qanday dalillarni yuklash yoki tahlil qilish mumkin?",
      a: "Shubhali telegram giyohvandlik guruhlari va kanallarining skrinshotlari (PNG, JPG formatida), devorlarga chizilgan giyohvand boti reklamalari rasmlari yoki dori yashirilgan joy (zakladka) lokatsiyasini yuborishingiz mumkin."
    },
    {
      q: "Kimlar ushbu platformadan foydalanishi mumkin?",
      a: "Barcha O'zbekiston Respublikasi fuqarolari (aynan Sirdaryo viloyati volontyorlari) giyohvandlikka qarshi kurashda hissa qo'shish uchun platformadan bepul foydalanishlari mumkin. Maxsus monitoring, statistika va tahlil panellari esa maxsus tezkor shtab va antinarkotik inspektorlari uchun ochiqdir."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#070B14] text-[#f3f4f6] relative">
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        isLoggedIn={isLoggedIn}
        dashboardRole={dashboardRole}
        onLogout={() => setIsLoggedIn(false)}
        inspectorName={inspectorName}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main content scroll wrapper */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto relative">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
             style={{ backgroundImage: "radial-gradient(#3b82f6 0.5px, transparent 0.5px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none z-0" />
        
        {/* Global Security Header */}
        <header className="bg-[#0E1726]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Trigger */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-blue-500/20 transition-all cursor-pointer focus:outline-none flex items-center justify-center mr-1"
              id="mobile-sidebar-toggle"
            >
              <Menu className="w-5 h-5" />
            </button>

            <span className="text-xs font-mono text-[#3B82F6] font-semibold bg-blue-500/10 px-2.5 py-1 rounded border border-blue-500/20 uppercase tracking-wider flex items-center gap-1.5">
              <img 
                src={safeUzLogo} 
                alt="Logo" 
                className="w-4 h-4 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
              {isLoggedIn ? `Operativ Shtab: ${dashboardRole.toUpperCase()}` : "SafeUZ AI Portal"}
            </span>
            <span className="text-white/40 text-xs hidden sm:inline">/</span>
            <span className="text-xs font-mono text-white/50 capitalize hidden sm:inline">
              {isLoggedIn ? "Dashboard" : activeTab.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center gap-1.5 bg-black/30 px-3 py-1.5 rounded-full border border-white/5 text-xs font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-white/60 truncate max-w-[150px]">{userEmail}</span>
                </div>

                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-red-500/20 px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  Logout 🚪
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer"
                >
                  🔐 Kirish
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Dynamic page area depending on Login state */}
        {isLoggedIn && (
          dashboardRole === 'admin' ? (
            <AdminModules activeTab={activeTab} setActiveTab={setActiveTab} />
          ) : (
            <InspectorModules activeTab={activeTab} setActiveTab={setActiveTab} inspectorName={inspectorName} />
          )
        )}
        {!isLoggedIn && (
          /* ========================================================== */
          /* LANDING PAGE WRAPPER (LOGGED OUT)                         */
          /* ========================================================== */
          <div className="p-6 md:p-8 lg:p-12 space-y-20 max-w-7xl mx-auto flex-1 relative z-10 w-full">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: HERO / HOME */}
              {activeTab === "home" && (
                <motion.div
                  key="home"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-24"
                >
                  {/* HERO SECTION */}
                  <div className="relative bg-[#070B14] border border-white/10 rounded-[32px] p-8 md:p-12 overflow-hidden shadow-2xl">
                    <CyberBackground />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                      {/* Left Column (Hero Content) */}
                      <div className="lg:col-span-6 space-y-6 text-left">
                        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-[11px] text-blue-400 font-mono font-bold tracking-widest uppercase">
                          <Sparkles className="w-3.5 h-3.5" />
                          SafeUZ AI • Narkotik va Noqonuniy Dori Savdosi Monitoringi
                        </div>

                        <div className="flex items-center gap-4">
                          <img 
                            src={safeUzLogo} 
                            alt="SafeUZ AI Logo" 
                            className="w-16 h-16 rounded-2xl border border-white/10 shadow-lg shadow-blue-500/10 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <h1 className="text-4xl sm:text-6xl font-extrabold font-display leading-tight tracking-tight text-white">
                            SafeUZ AI
                          </h1>
                        </div>

                        <p className="text-lg sm:text-xl font-medium leading-relaxed text-gray-200">
                          Sirdaryoda noqonuniy dori va giyohvandlik holatlarini <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 font-extrabold">Sun'iy Intellekt</span> yordamida aniqlash va tahlil qilish platformasi
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                          <button 
                            onClick={() => setIsLoginModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all cursor-pointer transform hover:scale-105 flex items-center gap-2"
                          >
                            🔐 Operativ Shtabga Kirish
                          </button>
                        </div>
                        
                        <div className="pt-8">
                          <CyberWidgets />
                        </div>
                        
                        <div className="pt-4">
                          <LiveActivity />
                        </div>
                      </div>

                      {/* Right Column (Map) */}
                      <div className="lg:col-span-6 w-full">
                        <SirdaryoMapIllustration />
                      </div>
                    </div>
                  </div>

                  {/* PLATFORM HIGHLIGHTS */}
                  <div className="space-y-8">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                        Platforma Asosiy Yo'nalishlari
                      </h2>
                      <p className="text-xs text-gray-400">
                        Giyohvandlik va noqonuniy dori-darmonlar savdosini tezkor monitoring qilish va nazorat vositalari
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        {
                          icon: "🤖",
                          title: "AI orqali tahlil",
                          desc: "Matn, rasm, Telegram havolalari va APK fayllari sun'iy intellekt yordamida avtomatik tahlil qilinadi.",
                          border: "hover:border-blue-500/40"
                        },
                        {
                          icon: "🛡️",
                          title: "Murojaat yo'nalishlari",
                          desc: "Platforma narkotik savdosi reklamalari, noqonuniy sintetik giyohvandlik guruhlari, psixotrop dorilar aylanmasi va 'zakladka' holatlarini aniqlashga yordam beradi.",
                          border: "hover:border-red-500/30"
                        },
                        {
                          icon: "🔒",
                          title: "Xavfsiz va maxfiy",
                          desc: "Yuborilgan ma'lumotlar himoyalangan holda saqlanadi va foydalanuvchi maxfiyligi ta'minlanadi.",
                          border: "hover:border-emerald-500/30"
                        },
                        {
                          icon: "📍",
                          title: "Hududiy monitoring",
                          desc: "Hududlar bo'yicha giyohvandlik holatlari interaktiv xaritalar va tahlillar orqali vizual ko'rsatiladi.",
                          border: "hover:border-indigo-500/30"
                        }
                      ].map((item, idx) => (
                        <div 
                          key={idx} 
                          className={`bg-[#131D2E] border border-white/8 rounded-2xl p-6 space-y-4 hover:scale-[1.03] transition-all hover:shadow-xl hover:shadow-blue-950/20 duration-300 ${item.border}`}
                        >
                          <div className="text-3xl">{item.icon}</div>
                          <h3 className="text-sm font-bold text-white font-display">{item.title}</h3>
                          <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PRIVACY & SECURITY BRIEF SECTION */}
                  <div className="bg-gradient-to-r from-blue-950/40 via-[#131D2E]/60 to-blue-950/40 border border-white/5 rounded-3xl p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                      <div className="lg:col-span-7 space-y-4 text-left">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs text-emerald-400 font-mono font-bold">
                          <ShieldCheck className="w-4 h-4" />
                          XAVFSIZLIK VA MAXFIYLIK KAFOLATLANGAN
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
                          Foydalanuvchi maxfiyligi — bizning oliy ustuvorligimizdir
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                          SafeUZ AI tizimida barcha murojaat hisobotlari shifrlangan ma'lumotlar omborida saqlanadi. Biz shaxsiy loglar yoki IP manzillarini saqlamaymiz. Xabar yuborish to'liq anonim tarzda amalga oshiriladi, bu esa giyohvandlik va noqonuniy dori-darmonlar haqida xabar bergan har bir Sirdaryo fuqarosining daxlsizligini kafolatlaydi.
                        </p>
                      </div>
                      <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                        {[
                          { title: "Shifrlangan saqlash", desc: "Xabarlar AES-256 algoritmi yordamida mustahkam himoyalangan." },
                          { title: "Mas'uliyatli AI", desc: "Natijalar antinarkotik inspektorlari nazorati ostida tahlil etiladi." },
                          { title: "Himoyalangan IP", desc: "Foydalanuvchilarning tarmoq identifikatorlari fiksatsiya qilinmaydi." },
                          { title: "Tezkor tahlil", desc: "Murojaat va uning dalillari maxsus tahliliy sandonda tekshiriladi." }
                        ].map((sec, idx) => (
                          <div key={idx} className="bg-black/20 border border-white/5 rounded-xl p-4 text-left space-y-1">
                            <h4 className="text-xs font-bold text-blue-400">{sec.title}</h4>
                            <p className="text-[10px] text-gray-400 leading-relaxed">{sec.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: ABOUT SECTION */}
              {activeTab === "about" && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12 text-left"
                >
                  <div className="bg-[#131D2E]/80 border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                    
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
                        <Info className="w-3.5 h-3.5" />
                        Platforma haqida
                      </div>
                      <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                        SafeUZ AI qanday platforma?
                      </h2>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans font-light">
                        <strong>SafeUZ AI</strong> — giyohvandlik, noqonuniy dori vositalari reklamalari, sintetik giyohvand guruhlari va dori-reklamalarini avtomatik tarzda tahlil qiluvchi va monitoring olib boruvchi jamoatchilik nazorati tizimidir. Platforma jamoat salomatligini ta'minlash hamda narkobiznesni kamaytirish maqsadida antinarkotik inspektorlari va maxsus tezkor guruh mutaxassislariga operativ shtab sifatida yordam beradi.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      {[
                        {
                          title: "Nima uchun yaratildi?",
                          desc: "Telegram guruhlari va internet havolalari orqali tarqalayotgan xavfli moddalar savdosi, noqonuniy dori reklamalari va fishing firibgarliklarini o'z vaqtida fiksatsiya qilish va javobgarlikka tortish uchun davlat idoralariga tezkor tahlillar berish maqsadida yaratilgan."
                        },
                        {
                          title: "AI qanday yordam beradi?",
                          desc: "Katta hajmdagi ma'lumotlarni qo'lda ko'rib chiqish o'rniga, SafeUZ AI bir necha soniyada yuborilgan skrinshotlardagi matnni tanib oladi, kontekstni o'rganadi, xavflilik ballini hisoblaydi va tizimli ravishda tasniflaydi."
                        },
                        {
                          title: "Murojaat qilishning ahamiyati",
                          desc: "Har bir giyohvandlik hisoboti yoki skrinshot tezkor shtabga jinoyatchilarni topish va guruhlarni bloklashda eng muhim dalil bo'lib xizmat qiladi. Siz yuborgan har bir xabar sog'lom kelajakka ulkan hissa qo'shadi."
                        },
                        {
                          title: "To'liq anonimlik",
                          desc: "Platforma jamoatchilik ishonchini oshirish uchun mutlaqo anonim hisobot yuborish imkoniyatini taqdim etadi. Xabar jo'natuvchining hech qanday shaxsiy daxlsiz ma'lumotlari saqlab qolinmaydi va log qilinmaydi."
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-black/20 border border-white/5 rounded-2xl p-6 space-y-2">
                          <h4 className="text-sm font-bold text-blue-400 flex items-center gap-2 font-display">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            {item.title}
                          </h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PRIVACY & SECURITY COMPLETE DETAILS */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold font-display text-white text-center">Xavfsizlik va Maxfiylik Standarti</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          title: "Shifrlangan ma'lumotlar bazasi",
                          desc: "Barcha foydalanuvchilar tomonidan yuborilgan hisobotlar va tahlillar yuqori darajada shifrlangan milliy ma'lumotlar omborida fiksatsiya qilinadi."
                        },
                        {
                          title: "Mas'uliyatli Sun'iy Intellekt",
                          desc: "Tahlillar faqat rasm, matn va texnik ob'ektlar ko'rinishida amalga oshiriladi. Hech qachon foydalanuvchilarning shaxsiy yoki oilaviy ma'lumotlari tahlil qilinmaydi."
                        },
                        {
                          title: "Xavfsiz fayl qayta ishlash",
                          desc: "Tizimga yuklangan rasm va koordinatalar maxsus himoyalangan xavfsiz virtual serverlarda statik tahlil qilinadi, bu esa asosiy infratuzilmani zararlanishdan himoyalaydi."
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-[#131D2E] border border-white/5 rounded-2xl p-6 space-y-3">
                          <Lock className="w-6 h-6 text-emerald-400" />
                          <h4 className="text-sm font-bold text-white font-display">{item.title}</h4>
                          <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: FEATURES SECTION */}
              {activeTab === "features" && (
                <motion.div
                  key="features"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12"
                >
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
                      <Settings className="w-3.5 h-3.5" />
                      Platforma Imkoniyatlari
                    </div>
                    <h2 className="text-3xl font-extrabold font-display text-white">
                      Asosiy Imkoniyatlar
                    </h2>
                    <p className="text-xs text-gray-400">
                      SafeUZ AI giyohvandlik va noqonuniy dori aylanmasini tahlil qilish uchun quyidagi keng qamrovli modullarni taqdim etadi
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                    {[
                      {
                        title: "🤖 AI Image Analysis",
                        desc: "Skanerlangan rasm va skrinshotlardagi o'zbek tilidagi dori iboralari, noqonuniy yozuvlar va giyohvandlik koordinatalarini o'qish.",
                        icon: Image,
                        color: "group-hover:text-blue-400 text-blue-400"
                      },
                      {
                        title: "📝 AI Text Analysis",
                        desc: "Telegram guruh va kanallardagi yashirin narkotik xabarlari, shubhali sotuvchilar va noqonuniy iboralarni Gemini AI yordamida aniqlash.",
                        icon: FileText,
                        color: "group-hover:text-indigo-400 text-indigo-400"
                      },
                      {
                        title: "🎣 Phishing Detection",
                        desc: "Noqonuniy dori va narkotik vositalari sotiladigan saytlar, onlayn-do'konlar va shubhali guruhlarni tahlil qilish moduli.",
                        icon: Globe,
                        color: "group-hover:text-amber-400 text-amber-400"
                      },
                      {
                        title: "📍 GPS & Zakladka Tracking",
                        desc: "Giyohvand moddalar yashiriladigan joylar (zakladka), devorlardagi koordinatali graffiti reklamalari va real vaqtda joylashuv tahlili.",
                        icon: Cpu,
                        color: "group-hover:text-red-400 text-red-400"
                      },
                      {
                        title: "📲 Telegram Content Analysis",
                        desc: "Firibgarlik maqsadida yaratilgan telegram botlari, yopiq noqonuniy guruh va kanallar kontekstual tahlili.",
                        icon: MessageSquare,
                        color: "group-hover:text-purple-400 text-purple-400"
                      },
                      {
                        title: "🔒 Anonymous Secure Reporting",
                        desc: "Hech qanday ro'yxatdan o'tish yoki shaxsiy identifikatsiyalashsiz, shaxsiy daxlsizlikni saqlab giyohvandlik holatlarini fiksatsiya qilish.",
                        icon: Lock,
                        color: "group-hover:text-emerald-400 text-emerald-400"
                      }
                    ].map((feat, idx) => {
                      const Icon = feat.icon;
                      return (
                        <div 
                          key={idx}
                          className="group bg-[#131D2E] border border-white/8 hover:border-blue-500/30 rounded-2xl p-6 space-y-4 hover:scale-[1.03] hover:shadow-xl transition-all duration-300"
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-500/5 border border-white/5 flex items-center justify-center">
                            <Icon className={`w-5 h-5 ${feat.color}`} />
                          </div>
                          <h3 className="text-base font-bold text-white font-display group-hover:text-blue-400 transition-colors">
                            {feat.title}
                          </h3>
                          <p className="text-xs text-gray-400 leading-relaxed font-light">
                            {feat.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 4: HOW IT WORKS SECTION */}
              {activeTab === "how-it-works" && (
                <motion.div
                  key="how-it-works"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12"
                >
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
                      <Cpu className="w-3.5 h-3.5" />
                      AI QANDAY ISHLAYDI?
                    </div>
                    <h2 className="text-3xl font-extrabold font-display text-white">
                      AI Tahlil Bosqichlari
                    </h2>
                    <p className="text-xs text-gray-400">
                      Platformamizda shubhali xabarlar sun'iy intellekt tomonidan tahlil qilinish jarayoni
                    </p>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="relative max-w-2xl mx-auto pl-8 sm:pl-0">
                    {/* Vertical connecting line */}
                    <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-0.5 bg-blue-500/20 -translate-x-1/2 hidden sm:block" />
                    <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-blue-500/20 sm:hidden" />

                    <div className="space-y-12">
                      {[
                        {
                          step: "Step 1",
                          title: "Murojaat yuklanishi (Upload)",
                          items: ["Rasm / Skrinshot", "Matn ko'rinishi", "Telegram guruh ssilkasi", "GPS joylashuv isboti"],
                          align: "left",
                          icon: "📤"
                        },
                        {
                          step: "Step 2",
                          title: "Sun'iy Intellekt Ekstraksiyasi",
                          items: ["Matn dekonstruksiyasi (OCR)", "Ob'ektlarni aniqlash", "Meta-ma'lumotlar tahlili", "Kontekstual indikatorlar"],
                          align: "right",
                          icon: "🤖"
                        },
                        {
                          step: "Step 3",
                          title: "Risk Ballarini Hisoblash",
                          items: ["Giyohvandlik va noqonuniy dori risk darajasi", "Sintetik narkotik reklamasi balli", "Zakladka va graffiti xavf darajasi"],
                          align: "left",
                          icon: "⚡"
                        },
                        {
                          step: "Step 4",
                          title: "Shtabga Yo'naltirish (Routing)",
                          items: ["Yuqori xavfli (High/Critical) — Antinarkotik inspektorlar ko'rib chiqishi", "Boshqa barcha murojaatlar — Tezkor shtab administratorlari nazorati"],
                          align: "right",
                          icon: "👮"
                        }
                      ].map((item, idx) => (
                        <div key={idx} className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between sm:odd:flex-row-reverse group">
                          {/* Circle marker */}
                          <div className="absolute left-4 sm:left-1/2 top-1 w-8 h-8 rounded-full bg-[#131D2E] border-2 border-blue-500 flex items-center justify-center -translate-x-1/2 z-20 shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-transform group-hover:scale-110">
                            <span className="text-xs font-bold text-blue-400">{idx + 1}</span>
                          </div>

                          {/* Empty space helper for side placement on desktop */}
                          <div className="w-full sm:w-[45%] hidden sm:block" />

                          {/* Card Content */}
                          <div className="w-full sm:w-[45%] bg-[#131D2E] border border-white/8 rounded-2xl p-6 text-left shadow-lg relative transition-all hover:border-blue-500/20">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-xl">{item.icon}</span>
                              <span className="text-[10px] font-mono font-bold text-blue-400 tracking-wider uppercase">{item.step}</span>
                            </div>
                            <h4 className="text-sm font-bold text-white font-display mb-3">{item.title}</h4>
                            <ul className="space-y-1.5">
                              {item.items.map((it, subIdx) => (
                                <li key={subIdx} className="text-xs text-gray-400 flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-blue-500" />
                                  {it}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 5: USER ROLES SECTION */}
              {activeTab === "user-roles" && (
                <motion.div
                  key="user-roles"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12"
                >
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
                      <Users className="w-3.5 h-3.5" />
                      TIZIM FOYDALANUVCHILARI
                    </div>
                    <h2 className="text-3xl font-extrabold font-display text-white">
                      Foydalanuvchi Rollari va Vakolatlari
                    </h2>
                    <p className="text-xs text-gray-400">
                      Tizimda rollar taqsimlanishi va har bir roldagi imkoniyatlar doirasi
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {[
                      {
                        icon: "👤",
                        role: "Foydalanuvchi (User)",
                        desc: "Platforma orqali giyohvandlik va noqonuniy dori holatlari haqidagi dalillarni yuboradi va o'zining murojaatlar tarixi hamda AI tahlili natijalarini kuzatadi.",
                        points: [
                          "Shubhali kontentlarni yuklash",
                          "Shaxsiy arizalar jurnalini yuritish",
                          "AI laboratoriya tahlilidan foydalanish"
                        ],
                        color: "hover:border-blue-500/30"
                      },
                      {
                        icon: "👮",
                        role: "Antinarkotik Inspektor (Inspector)",
                        desc: "AI tomonidan o'ta xavfli (High/Critical) deb topilgan barcha hisobotlarni va rasm isbotlarini operativ ko'rib chiqadi.",
                        points: [
                          "Noqonuniy dori va narkotrafik holatlarini bloklash yoki tasdiqlash",
                          "AI tahlillarini tekshirish va tasdiqlash",
                          "Ish tahlil holatlarini yangilash"
                        ],
                        color: "hover:border-indigo-500/30"
                      },
                      {
                        icon: "🛠",
                        role: "Shtab Administratori (Admin)",
                        desc: "Platformaning umumiy ishlash holati, antinarkotik inspektorlar ro'yxati va barcha yuklangan murojaatlar monitoringini olib boradi.",
                        points: [
                          "Tizim foydalanuvchilarini boshqarish",
                          "Integratsiyalashgan antinarkotik xarita",
                          "AI sozlamalari va risk modellarini boshqarish"
                        ],
                        color: "hover:border-emerald-500/30"
                      }
                    ].map((item, idx) => (
                      <div 
                        key={idx} 
                        className={`bg-[#131D2E] border border-white/8 rounded-2xl p-6 space-y-4 hover:scale-[1.03] transition-all duration-300 ${item.color}`}
                      >
                        <div className="text-3xl">{item.icon}</div>
                        <h3 className="text-lg font-bold text-white font-display">{item.role}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed font-light">{item.desc}</p>
                        <div className="border-t border-white/5 pt-3 space-y-2">
                          {item.points.map((pt, pIdx) => (
                            <div key={pIdx} className="text-[11px] text-gray-300 flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* TAB 6: FAQ SECTION */}
              {activeTab === "faq" && (
                <motion.div
                  key="faq"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8 max-w-3xl mx-auto"
                >
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-400 font-mono font-bold uppercase tracking-wider">
                      <HelpCircle className="w-3.5 h-3.5" />
                      SAVOL VA JAVOBLAR
                    </div>
                    <h2 className="text-3xl font-extrabold font-display text-white">
                      Tez-tez so'raladigan savollar
                    </h2>
                    <p className="text-xs text-gray-400">
                      SafeUZ AI antinarkotik monitoring tizimi bo'yicha eng ko'p so'raladigan savollar va ularning javoblari
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        q: "SafeUZ AI o'zi nima?",
                        a: "SafeUZ AI — Sirdaryo viloyatidagi noqonuniy dori vositalari savdosi va giyohvand moddalarning tarqalishini sun'iy intellekt orqali aniqlaydigan hamda monitoring qiladigan operativ jamoatchilik platformasidir."
                      },
                      {
                        q: "AI tahdidlarni qanday tahlil qiladi?",
                        a: "Tizimga yuklangan rasm, matn yoki havolalar Google Gemini-3.5-Flash tahliliy modeli orqali zudlik bilan dekonstruksiya qilinib, noqonuniy dori va narkotik risk indeksini hisoblab chiqadi."
                      },
                      {
                        q: "Murojaat yuborishda to'liq anonim qolish mumkinmi?",
                        a: "Mutlaqo ha! SafeUZ AI portalida fuqarolarning daxlsizligi to'liq himoyalangan. Hisobotlarni yuborishda hech qanday pasport ma'lumotlari yoki shaxsiy identifikatsiya ma'lumotlari saqlab qolinmaydi."
                      },
                      {
                        q: "Platforma qanday fayllarni qo'llab-quvvatlaydi?",
                        a: "Platforma orqali shubhali skrinshot va rasmlarni (PNG, JPG), noqonuniy dori va giyohvandlik botlari, telegram guruh hamda dori yashirilgan joy (zakladka) koordinatalarini tahlil qilish mumkin."
                      },
                      {
                        q: "Murojaatlarni kimlar ko'rib chiqadi?",
                        a: "Murojaatlar AI tomonidan dastlabki saralovdan o'tgach, uning xavflilik balliga qarab Sirdaryo operativ shtabi antinarkotik inspektorlari va administratorlari tomonidan yakuniy chora ko'rish uchun ko'rib chiqiladi."
                      }
                    ].map((faq, idx) => {
                      const isOpen = openFaqIndex === idx;
                      return (
                        <div 
                          key={idx} 
                          className="bg-[#131D2E] border border-white/8 rounded-2xl overflow-hidden transition-all duration-300 text-left"
                        >
                          <button
                            onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                            className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-sm text-white hover:text-blue-400 font-display cursor-pointer transition-colors"
                          >
                            <span>{faq.q}</span>
                            <span className="text-blue-500 text-lg ml-4 shrink-0">{isOpen ? "−" : "+"}</span>
                          </button>
                          
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-white/5 bg-black/10 text-xs text-gray-300 leading-relaxed font-light px-6 py-4"
                              >
                                {faq.a}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 7: CONTACT SECTION */}
              {activeTab === "contact" && (
                <motion.div
                  key="contact"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-12 max-w-4xl mx-auto text-left"
                >
                  <div className="space-y-2 text-center max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-xs text-blue-400 font-mono font-bold">
                      <Phone className="w-3.5 h-3.5" />
                      Bog'lanish
                    </div>
                    <h2 className="text-3xl font-bold font-display text-white">
                      Operativ Shtab Tezkor Aloqa
                    </h2>
                    <p className="text-xs text-gray-400">
                      Tizim bo'yicha savollaringizni operativ shtab tezkor guruhiga yuborishingiz mumkin
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center max-w-2xl mx-auto">
                    <a 
                      href="https://t.me/SafeUZ_AI_bot" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-[#131D2E] border border-white/8 hover:border-blue-500/30 rounded-2xl p-5 shadow-md flex flex-col items-center justify-center gap-2 group transition-all"
                    >
                      <MessageSquare className="w-6 h-6 text-sky-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white font-display">Telegram</span>
                      <span className="text-[10px] text-gray-400">@SafeUZ_AI_bot</span>
                    </a>

                    <a 
                      href="mailto:support@safeuz.uz"
                      className="bg-[#131D2E] border border-white/8 hover:border-blue-500/30 rounded-2xl p-5 shadow-md flex flex-col items-center justify-center gap-2 group transition-all"
                    >
                      <Mail className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-white font-display">Elektron pochta</span>
                      <span className="text-[10px] text-gray-400">support@safeuz.uz</span>
                    </a>
                  </div>

                  <div className="bg-[#131D2E] border border-white/8 rounded-2xl p-6 sm:p-8 space-y-6">
                    <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      Murojaat qoldirish formasi
                    </h3>
                    {contactSuccess ? (
                      <div className="p-8 flex flex-col items-center justify-center text-center space-y-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                        <CheckCircle className="w-10 h-10 text-emerald-400 animate-bounce" />
                        <h4 className="text-sm font-bold text-white">Murojaat qabul qilindi</h4>
                        <p className="text-xs text-gray-400">Operatorlarimiz tez orada siz bilan bog'lanishadi.</p>
                      </div>
                    ) : (
                      <form 
                        onSubmit={(e) => { 
                          e.preventDefault(); 
                          setContactSuccess(true); 
                          setTimeout(() => {
                            setContactSuccess(false);
                            setContactForm({ name: "", phone: "", message: "" });
                          }, 2500);
                        }} 
                        className="space-y-4 text-xs font-sans"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Ism-familyangiz *</label>
                            <input
                              type="text"
                              required
                              value={contactForm.name}
                              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                              placeholder="Ismingiz"
                              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500 transition-all placeholder-white/20"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Telefon raqamingiz *</label>
                            <input
                              type="text"
                              required
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                              placeholder="+998 (90) 123-4567"
                              className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500 transition-all placeholder-white/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-gray-400 font-semibold uppercase tracking-wider text-[9px]">Xabar matni *</label>
                          <textarea
                            required
                            rows={4}
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            placeholder="Sizga qanday yordam bera olamiz?"
                            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500 transition-all placeholder-white/20 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          Murojaatni jo'natish
                        </button>
                      </form>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 8: TELEGRAM BOT SIMULATOR FOR VOLUNTEERS */}
              {activeTab === "volunteer-bot" && (
                <motion.div
                  key="volunteer-bot"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="w-full"
                >
                  <TelegramBotSimulator />
                </motion.div>
              )}

            </AnimatePresence>

            {/* LANDING PAGE FOOTER */}
            <footer className="border-t border-white/5 pt-8 pb-4 text-xs text-gray-500 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="text-white font-bold font-display text-sm flex items-center justify-center sm:justify-start gap-1.5">
                    <img 
                      src={safeUzLogo} 
                      alt="SafeUZ AI Logo" 
                      className="w-5 h-5 rounded-full object-cover border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    SafeUZ <span className="text-blue-500 text-[10px] bg-blue-500/10 px-1 rounded font-mono">AI</span>
                  </div>
                  <p className="max-w-xs text-[11px] text-gray-400 leading-relaxed">
                    Sirdaryo viloyati antinarkotik va jamoat salomatligi milliy monitoring platformasi.
                  </p>
                </div>
                
                <div className="flex gap-8 text-[11px]">
                  <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab("about")}>SafeUZ AI haqida</span>
                  <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab("features")}>Imkoniyatlar</span>
                  <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab("faq")}>FAQ</span>
                  <span className="hover:text-white cursor-pointer" onClick={() => setActiveTab("contact")}>Bog'lanish</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] border-t border-white/5 pt-4 gap-2 text-center">
                <span>© 2026 SafeUZ AI. Sirdaryo antinarkotik va noqonuniy dori aylanmasi milliy monitoring tizimi.</span>
                <div className="flex gap-4">
                  <span className="hover:text-white cursor-pointer">Maxfiylik siyosati</span>
                  <span>•</span>
                  <span className="hover:text-white cursor-pointer">Foydalanish shartlari</span>
                </div>
              </div>
            </footer>
          </div>
        )}

      </main>

      {/* Global Modals */}
      
      {/* 1. Report Submission Modal */}
      <ReportSubmissionModal 
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setPreFillData(undefined);
        }}
        onSuccess={handleAddReport}
        preFilledData={preFillData}
      />

      {/* 2. Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <LoginModalComponent 
            onClose={() => setIsLoginModalOpen(false)}
            onLoginSuccess={(role, name) => {
              setDashboardRole(role);
              if (name) setInspectorName(name);
              setIsLoggedIn(true);
              setIsLoginModalOpen(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* 3. Register Modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#131D2E] border border-white/10 rounded-2xl p-6 space-y-4 text-white shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="font-semibold font-display text-sm flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-400" />
                  Kiber Gvardiya a'zoligi
                </span>
                <button onClick={() => setIsRegisterModalOpen(false)} className="text-white/40 hover:text-white cursor-pointer">&times;</button>
              </div>

              <div className="space-y-3 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-white/60">Yangi elektron pochta</label>
                  <input 
                    type="email" 
                    placeholder="example@safeuz.uz" 
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60">Maxfiy parol</label>
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/60">Sirdaryo tumani / Shahar</label>
                  <select className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500">
                    <option>Guliston shahri</option>
                    <option>Sirdaryo tumani</option>
                    <option>Yangiyer shahri</option>
                    <option>Shirin shahri</option>
                    <option>Oqoltin tumani</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsLoggedIn(true);
                  setIsRegisterModalOpen(false);
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-md"
              >
                Tasdiqlash va ro'yxatdan o'tish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating AI Chatbot Assistant */}
      <AIChatbotWidget />

    </div>
  );
}
