import React, { useState, useEffect } from "react";
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
  Radar,
  Trash2,
  Edit,
  UserPlus,
  Plus,
  FileSpreadsheet,
  Download,
  ExternalLink,
  Filter,
  Calendar,
  BarChart2,
  Sliders,
  Database,
  Key,
  HardDrive,
  Mail,
  Phone,
  Lock,
  FileText,
  UserCheck,
  Award,
  Bell,
  History,
  Shield,
  FileDown,
  Send,
  MessageSquare,
  Navigation
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AIOCMap from "./AIOCMap";
import { CamerasModule } from "./CamerasModule";
import { db, auth, isFirebaseConfigured, handleFirestoreError, OperationType } from "../firebase";
import { collection, doc, setDoc, onSnapshot, deleteDoc } from "firebase/firestore";

// Shared Interfaces
interface Incident {
  id: string;
  time: string;
  incident: string;
  district: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  inspector: string;
  status: "Assigned" | "Accepted" | "Investigating" | "Evidence Uploaded" | "Resolved" | "Blocked" | "NEW";
  description?: string;
  source?: string;
  target?: string;
  date: string;
  type?: string;
  riskScore?: number;
  reporterName?: string;
  reporterId?: string;
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

// Global Simulated Data
const INITIAL_INCIDENTS: Incident[] = [
  {
    id: "INC-4821",
    time: "14:22:15",
    date: "2026-06-26",
    incident: "Telegram dori savdosi noqonuniy reklamasi aniqlandi",
    district: "Guliston Shahri",
    riskLevel: "CRITICAL",
    inspector: "Kpt. Safarov M.",
    status: "Blocked",
    source: "@sirdaryo_dori_reklama",
    description: "Kanalda noqonuniy dori va psixotrop moddalarning narxlari va manzillari ko'rsatilgan matn va koordinatali rasmlar tarqatilgan.",
    volunteer: {
      telegramName: "Sherzodbek Aslanov",
      telegramUsername: "@sherzod_kiber",
      telegramId: "598471203",
      submissionTime: "14:20:05",
      gpsLocation: "40.4984° N, 68.7011° E (Guliston shahri, Sirdaryo)",
      uploadedImages: ["https://images.unsplash.com/photo-1526256262150-78a02c753ff1?w=600&q=80"],
      uploadedVideos: ["kiber_dalil_dori_video_381.mp4"],
      uploadedVoice: "telegram_voice_report_821.ogg (0:24)",
      uploadedFiles: ["screenshot_threat_evidence.png", "dori_list_rekvizit.txt"],
      submittedText: "Kanalda noqonuniy dori va psixotrop moddalarning narxlari va manzillari ko'rsatilgan matn va koordinatali rasmlar tarqatilgan. Iltimos buni tezroq tekshirib bloklang.",
      trustScore: 98,
      previousReports: 42,
      confirmedReports: 41,
      falseReports: 1,
      reportCount: 42
    }
  },
  {
    id: "INC-4818",
    time: "14:18:02",
    date: "2026-06-26",
    incident: "Soxta 'Click bonus' fishing sayti aniqlandi (http://click-bonus-uz.com)",
    district: "Sirdaryo Tumani",
    riskLevel: "HIGH",
    inspector: "Ltn. Alimov F.",
    status: "Evidence Uploaded",
    source: "https://click-bonus-uz.com",
    description: "Click to'lov tizimining soxta interfeysi orqali foydalanuvchilarning plastik karta ma'lumotlarini (SMS kod, karta raqami) o'g'irlash harakati.",
    volunteer: {
      telegramName: "Laylo Qodirova",
      telegramUsername: "@laylo_q",
      telegramId: "612440952",
      submissionTime: "14:15:10",
      gpsLocation: "40.8432° N, 68.6621° E (Sirdaryo tumani, Sirdaryo)",
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
    id: "INC-4810",
    time: "14:10:45",
    date: "2026-06-26",
    incident: "Zararli Android troyan dasturi aniqlandi (TezkorInternet.apk)",
    district: "Yangiyer Shahri",
    riskLevel: "CRITICAL",
    inspector: "Kpt. Yo'ldoshev S.",
    status: "Resolved",
    source: "TezkorInternet.apk",
    description: "Internet tezligini oshirishni va'da qiluvchi soxta ilova. O'rnatilgach SMS xabarlarni o'g'irlab maxfiy serverga yo'naltiradi.",
    volunteer: {
      telegramName: "Jahongir To'rayev",
      telegramUsername: "@jahongir_cybersec",
      telegramId: "471109401",
      submissionTime: "14:05:30",
      gpsLocation: "40.2642° N, 68.8140° E (Yangiyer shahri, Sirdaryo)",
      uploadedImages: ["https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&q=80"],
      uploadedVideos: [],
      uploadedVoice: undefined,
      uploadedFiles: ["TezkorInternet.apk", "antivirus_log_report.txt"],
      submittedText: "Guruhda g'alati dastur tarqatishdi, internet tezligini oshiradi deb. Yuklab tekshirdim, ichida troyan kodi bor ekan.",
      trustScore: 84,
      previousReports: 25,
      confirmedReports: 22,
      falseReports: 3,
      reportCount: 25
    }
  },
  {
    id: "INC-4802",
    time: "14:02:30",
    date: "2026-06-26",
    incident: "Telegram bot firibgarligi faollashdi (@pul_yutug_bot)",
    district: "Boyovut Tumani",
    riskLevel: "MEDIUM",
    inspector: "Kpt. Qodirov J.",
    status: "Investigating",
    source: "@pul_yutug_bot",
    description: "Prezident nomidan kompensatsiya puli tarqatishni va'da qilib, odamlardan guruhlarga odam qo'shishni va karta raqamini kiritishni talab qiladi.",
    volunteer: {
      telegramName: "Maftuna Sobirova",
      telegramUsername: "@maftuna_cyber",
      telegramId: "704812390",
      submissionTime: "13:58:20",
      gpsLocation: "40.4312° N, 68.9912° E (Boyovut tumani, Sirdaryo)",
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
    date: "2026-06-26",
    incident: "Davlat tashkiloti xodimlariga soxta kompensatsiya fishing pochtasi jo'natildi",
    district: "Xovos Tumani",
    riskLevel: "HIGH",
    inspector: "Ltn. Karimov A.",
    status: "Accepted",
    source: "comp-verify@gov-uz.org",
    description: "Xizmat pochtalariga kompensatsiya olish uchun ariza topshirish so'ralgan soxta hukumat ssilkasi.",
    volunteer: {
      telegramName: "Farrux Ziyoyev",
      telegramUsername: "@farrux_z",
      telegramId: "550184291",
      submissionTime: "13:50:00",
      gpsLocation: "39.9012° N, 68.6721° E (Xovos tumani, Sirdaryo)",
      uploadedImages: ["https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=600&q=80"],
      uploadedVideos: [],
      uploadedVoice: undefined,
      uploadedFiles: ["email_headers_phishing.txt"],
      submittedText: "Pochtaga shubhali xat keldi, davlat kompaniyasi nomidan. Havolasi soxta, kirmanglar deb ogohlantiraman.",
      trustScore: 40,
      previousReports: 5,
      confirmedReports: 1,
      falseReports: 4,
      reportCount: 5
    }
  },
  {
    id: "INC-4788",
    time: "13:48:40",
    date: "2026-06-26",
    incident: "Energetika korxonasi xostingiga shubhali SQL injection urinishi",
    district: "Shirin Shahri",
    riskLevel: "HIGH",
    inspector: "Tizim Patrul Bot",
    status: "Assigned",
    source: "185.112.45.92",
    description: "Shirin shahridagi energetika korxonasi tashqi axborot tizimi login panelida SQL qidiruv elementlarini buzish urinishi fiksatsiya qilindi.",
    volunteer: {
      telegramName: "Sardor Salimov",
      telegramUsername: "@sardor_sec",
      telegramId: "482019472",
      submissionTime: "13:42:00",
      gpsLocation: "40.2112° N, 69.1124° E (Shirin shahri, Sirdaryo)",
      uploadedImages: ["https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80"],
      uploadedVideos: [],
      uploadedVoice: "cyber_threat_audio_08.ogg (1:12)",
      uploadedFiles: ["sql_payload_log.txt"],
      submittedText: "Server login sahifasida shubhali SQL injeksiya urinishlari ko'zga tashlandi, IP rekvizitlarni log fayli ko'rinishida jo'natyapman.",
      trustScore: 95,
      previousReports: 30,
      confirmedReports: 29,
      falseReports: 1,
      reportCount: 30
    }
  }
];

const INITIAL_INSPECTORS: any[] = [];

const INITIAL_VOLUNTEERS = [
  { id: "VOL-440", name: "Sherzodbek Aslanov", trustScore: 98, reports: 42, falseReports: 1, reputation: "Oltin Kiber-Volontyor", points: 840, status: "Aktiv" },
  { id: "VOL-215", name: "Laylo Qodirova", trustScore: 92, reports: 19, falseReports: 0, reputation: "Kumush Kiber-Volontyor", points: 380, status: "Aktiv" },
  { id: "VOL-119", name: "Jahongir To'rayev", trustScore: 84, reports: 25, falseReports: 3, reputation: "Bronza Kiber-Volontyor", points: 290, status: "Aktiv" },
  { id: "VOL-502", name: "Maftuna Sobirova", trustScore: 99, reports: 56, falseReports: 0, reputation: "Kiber Qahramon", points: 1220, status: "Aktiv" },
  { id: "VOL-089", name: "Farrux Ziyoyev", trustScore: 40, reports: 5, falseReports: 4, reputation: "Boshlovchi", points: 20, status: "Kuzatuvda" }
];

export default function AdminModules({ activeTab, setActiveTab }: { activeTab: string, setActiveTab?: (tab: string) => void }) {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [inspectors, setInspectors] = useState<any[]>(INITIAL_INSPECTORS);
  const [volunteers, setVolunteers] = useState(INITIAL_VOLUNTEERS);
  
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);
  
  useEffect(() => {
    fetch("/api/inspectors")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.inspectors) {
          const mapped = data.inspectors.map((ins: any) => ({
            id: `INS-${ins.id}`,
            dbId: ins.id,
            name: ins.fullName || ins.full_name || ins.name || "Noma'lum",
            district: ins.district || "Biriktirilmagan",
            status: ins.status || "ONLINE",
            solved: ins.solved !== undefined ? ins.solved : 0,
            active: ins.active !== undefined ? ins.active : 0,
            responseTime: ins.responseTime || ins.response_time || "0.0 m",
            email: ins.login || ins.email || "",
            password: ins.password || ""
          }));
          setInspectors(mapped);
        }
      })
      .catch(err => console.error("Failed to fetch inspectors:", err));
  }, []);
  
  // --- VOLUNTEER & TELEGRAM BLOCKING BOT STATE MACHINE (connected to Firebase) ---
  const [blockTasks, setBlockTasks] = useState<any[]>(() => {
    const saved = localStorage.getItem("safeuz_block_tasks");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "TSK-101", title: "Kanal: Oson Pul Yutug'i Firibgarligi", target: "@pul_yutug_bot", type: "Bot", coins: 150, status: "Active", message: "Kanalda barcha foydalanuvchilarga soxta yutuqlar taklif etiladi va plastik karta ma'lumotlari talab etiladi.", createdAt: "2026-06-26 10:15" },
      { id: "TSK-102", title: "Guruh: Noqonuniy Dori Vositalari Sirdaryo", target: "@sirdaryo_dori_savdo", type: "Guruh", coins: 200, status: "Active", message: "Sirdaryo va atrof tumanlarda litsenziyasiz taqiqlangan dorilar sotiladigan ochiq guruh.", createdAt: "2026-06-26 10:45" },
      { id: "TSK-103", title: "Ssilka: Click Bonus Cloned Fishing Portal", target: "https://click-bonus-uz.cc", type: "Veb-sayt", coins: 300, status: "Active", message: "Click brend darchasi orqali foydalanuvchilarning SMS kodlarini o'g'irlaydigan fishing sahifa.", createdAt: "2026-06-26 11:00" }
    ];
  });

  const [simulatedVolunteerId, setSimulatedVolunteerId] = useState("VOL-502"); // default to Maftuna Sobirova
  const [newBroadcastTitle, setNewBroadcastTitle] = useState("");
  const [newBroadcastTarget, setNewBroadcastTarget] = useState("");
  const [newBroadcastType, setNewBroadcastType] = useState("Bot");
  const [newBroadcastCoins, setNewBroadcastCoins] = useState(100);
  const [newBroadcastMessage, setNewBroadcastMessage] = useState("");
  
  // Telegram Bot Integration settings
  const [tgBotToken, setTgBotToken] = useState(() => {
    return localStorage.getItem("safeuz_tg_bot_token") || "7630596658:AAHwq3KOAHB10sX12StgCXGkcf9S1jwwMEo";
  });
  const [tgChatId, setTgChatId] = useState(() => {
    return localStorage.getItem("safeuz_tg_chat_id") || "@safeuz_kiber_gvardiya";
  });
  const [isTestingTgConnection, setIsTestingTgConnection] = useState(false);
  const [tgConnectionStatus, setTgConnectionStatus] = useState<string | null>(null);
  const [isBroadcastingTg, setIsBroadcastingTg] = useState(false);
  const [registeredBotUsers, setRegisteredBotUsers] = useState<any[]>([]);

  // Fetch bot users
  useEffect(() => {
    const fetchBotUsers = async () => {
      try {
        const res = await fetch("/api/bot-users");
        if (res.ok) {
          const data = await res.json();
          setRegisteredBotUsers(data);
        }
      } catch (err) {
        console.error("Failed to fetch bot users", err);
      }
    };
    
    fetchBotUsers();
    const interval = setInterval(fetchBotUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  
  // Volunteer CRUD and Telegram Command Designer States
  const [isAddingVolunteer, setIsAddingVolunteer] = useState(false);
  const [newVolunteerName, setNewVolunteerName] = useState("");
  const [newVolunteerPoints, setNewVolunteerPoints] = useState(100);
  const [newVolunteerReports, setNewVolunteerReports] = useState(5);
  const [editingVolunteerId, setEditingVolunteerId] = useState<string | null>(null);
  const [editingVolunteerName, setEditingVolunteerName] = useState("");
  const [editingVolunteerPoints, setEditingVolunteerPoints] = useState(0);
  const [editingVolunteerReports, setEditingVolunteerReports] = useState(0);
  const [editingVolunteerStatus, setEditingVolunteerStatus] = useState("Aktiv");

  const [tgDesignerCommand, setTgDesignerCommand] = useState("/block_channel");
  const [tgDesignerTarget, setTgDesignerTarget] = useState("@fishing_uz_bot");
  const [tgDesignerCoins, setTgDesignerCoins] = useState(250);
  const [tgDesignerMessage, setTgDesignerMessage] = useState("DIQQAT: Ushbu fishing bot foydalanuvchilarning plastik kartalaridagi mablag'larni o'g'irlamoqda! Iltimos, buni block qiling.");
  const [tgDesignerButtons, setTgDesignerButtons] = useState<any[]>([
    { id: "btn-1", text: "🚫 Bloklash va Shikoyat", type: "URL", value: "https://t.me/notoscam" },
    { id: "btn-2", text: "🔍 Audit Xulosasi", type: "Callback", value: "audit_scam_report" }
  ]);
  const [newBtnText, setNewBtnText] = useState("");
  const [newBtnType, setNewBtnType] = useState("URL");
  const [newBtnValue, setNewBtnValue] = useState("");

  const [fbLogs, setFbLogs] = useState<any[]>([
    { time: new Date().toLocaleTimeString(), action: "INITIALIZED", detail: "Sinxronizatsiya tizimi ishga tushdi." }
  ]);
  const [dbTab, setDbTab] = useState<"volunteers" | "tasks" | "reports">("volunteers");
  const [blockReports, setBlockReports] = useState<any[]>(() => {
    const saved = localStorage.getItem("safeuz_block_reports");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: "REP-901", taskId: "TSK-101", volunteerId: "VOL-502", coinsAwarded: 150, timestamp: "2026-06-26 10:30" },
      { id: "REP-902", taskId: "TSK-102", volunteerId: "VOL-440", coinsAwarded: 200, timestamp: "2026-06-26 10:55" }
    ];
  });
  const [selectedCase, setSelectedCase] = useState<Incident | null>(INITIAL_INCIDENTS[0]);
  const [incidentToDelete, setIncidentToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "resolved">("all");
  const [aiAnalysisCount, setAiAnalysisCount] = useState(2415);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);
  const [focusedDistrict, setFocusedDistrict] = useState("Guliston Shahri");
  const [focusedCoords, setFocusedCoords] = useState<[number, number] | undefined>(undefined);
  const [investigationRightTab, setInvestigationRightTab] = useState<"reports" | "leaderboard">("reports");
  const [showTgConfig, setShowTgConfig] = useState(false);

  // State for creating new inspector
  const [isAddingInspector, setIsAddingInspector] = useState(false);
  const [newInspector, setNewInspector] = useState({ name: "", district: "Guliston Shahri", email: "", password: "" });
  const [editingInspector, setEditingInspector] = useState<any | null>(null);
  const [inspectorToDelete, setInspectorToDelete] = useState<any | null>(null);

  // Stateful items for newly requested interactive features
  const [isAddingIncident, setIsAddingIncident] = useState(false);
  const [newIncident, setNewIncident] = useState({
    incident: "",
    district: "Guliston Shahri",
    riskLevel: "HIGH" as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
    inspector: "Kpt. Safarov M.",
    source: "",
    description: ""
  });

  // Decrypt Stream (Live Log Console) State
  const [logs, setLogs] = useState([
    { time: "10:22:31", type: "[TG_BOT_MONITOR]", message: "Skanerlanmoqda: @pul_yutug_bot ... OK", color: "text-indigo-400" },
    { time: "10:22:15", type: "[CRITICAL]", message: "Telegram dori noqonuniy reklamasi aniqlandi: Guliston Shahri", color: "text-red-400 font-bold animate-pulse" },
    { time: "10:21:40", type: "[WARNING]", message: "Shubhali havolaga tashrif: https://payme-bonus-uz.cc", color: "text-amber-400" },
    { time: "10:20:02", type: "[INFO]", message: "Kpt. Safarov M. INC-4821 ob'ektini tahlil etishni boshladi", color: "text-blue-400" },
    { time: "10:18:02", type: "[CRITICAL]", message: "Klik fishing tahlili fiksatsiya qilindi. IP: 185.115.92.11", color: "text-red-400" },
    { time: "10:15:22", type: "[DEBUG]", message: "Sandbox tahlili yakunlandi: TezkorInternet.apk - Malware Score: 94%", color: "text-gray-500" },
    { time: "10:12:45", type: "[SUCCESS]", message: "Milliy xosting tahlili yakunlandi. Shubhali elementlar: 0", color: "text-emerald-400 font-bold" },
    { time: "10:10:01", type: "[DEBUG]", message: "Guliston kiber-monitoring tuguni barqaror ishlamoqda. Ping: 12ms", color: "text-gray-500" }
  ]);

  // Telegram Intelligence Module State
  const [tgChannels, setTgChannels] = useState([
    { name: "@sirdaryo_dori_reklama", type: "Kanal", score: "98% (Kritik)", action: "BLOKLANGAN" },
    { name: "@click_bonus_uzbekistan", type: "Guruh", score: "86% (Yuqori)", action: "KUZATUVDA" },
    { name: "@pul_yutug_bot", type: "Bot", score: "92% (Kritik)", action: "BLOKLANGAN" },
    { name: "@oson_pul_topish_bot", type: "Bot", score: "95% (Kritik)", action: "BLOKLANGAN" }
  ]);
  const [newTelegramHandle, setNewTelegramHandle] = useState("");
  const [newTelegramType, setNewTelegramType] = useState("Kanal");
  const [telegramScanStatus, setTelegramScanStatus] = useState("");
  const [isScanningTelegram, setIsScanningTelegram] = useState(false);

  // Website Intelligence Module State
  const [webDomains, setWebDomains] = useState([
    { domain: "https://click-verify-card.online", ip: "185.112.5.90", status: "BLOKLANGAN", score: "99% (Kritik)" },
    { domain: "https://payme-bonus-cabinet.uz", ip: "91.215.118.4", status: "HOSTING BLOCKED", score: "96% (Kritik)" },
    { domain: "https://uzcard-recalc.info", ip: "104.21.32.115", status: "KUZATUVDA", score: "52% (O'rta)" }
  ]);
  const [newWebDomain, setNewWebDomain] = useState("");
  const [isScanningDomain, setIsScanningDomain] = useState(false);
  const [domainScanStatus, setDomainScanStatus] = useState("");

  // APK Intelligence Module State
  const [apkFiles, setApkFiles] = useState([
    { name: "Tezkor_Internet_Uz.apk", package: "com.android.netoptimizer.uz", risk: "94% (Kritik)", malware: "Malware: SMS Trojan Spy.Agent", permissions: ["RECEIVE_SMS", "READ_PHONE_STATE", "INTERNET"] },
    { name: "SirdaryoDori_Market_Secured.apk", package: "com.sir.pharmacymarket", risk: "99% (Kritik)", malware: "Malware: Illegal Pharma Dist", permissions: ["RECEIVE_SMS", "ACCESS_FINE_LOCATION", "INTERNET"] }
  ]);
  const [newApkName, setNewApkName] = useState("");
  const [newApkPackage, setNewApkPackage] = useState("");
  const [isScanningApk, setIsScanningApk] = useState(false);
  const [apkScanStatus, setApkScanStatus] = useState("");

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([
    { time: "2026-06-26 10:22", actor: "ADMIN", action: "Bloklash buyrug'ini yubordi (INC-4821)", ip: "185.112.5.4" },
    { time: "2026-06-26 10:18", actor: "INSPECTOR", action: "Kiber-dalillarni tekshirdi va tahlil yukladi (INC-4818)", ip: "91.115.12.8" },
    { time: "2026-06-26 10:10", actor: "SYSTEM", action: "Yangi kiber-tahdid fiksatsiya qilindi", ip: "Local Node" }
  ]);

  // System Settings State
  const [systemSettings, setSystemSettings] = useState({
    nodeId: "SIRDARYO_HQ_NODE_01",
    autoBlock: true,
    scanFrequency: "85 r/sec",
    model: "gemini-3.5-flash",
    sensitivity: "95%"
  });

  // Profile Settings State
  const [profile, setProfile] = useState({
    name: "General-Major S. Alisherovich",
    rank: "General-Major",
    email: "alisherovich@safeuz.uz",
    phone: "+998 (90) 115-4422",
    dept: "Kiber-Gvardiya Maxsus Bo'linmasi"
  });

  // Helper to add dynamic audit logs
  const addAuditLog = (actor: string, action: string, ip: string = "185.115.42.12") => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;
    setAuditLogs(prev => [
      { time: timeStr, actor, action, ip },
      ...prev
    ]);
  };

  // --- FIREBASE SYNC ENGINE & HELPERS ---
  const addFbLog = (action: string, detail: string) => {
    setFbLogs(prev => [
      { time: new Date().toLocaleTimeString(), action, detail },
      ...prev.slice(0, 15)
    ]);
  };

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          // Transform API output to match UI Incident properties
          const mapped = data.map((d: any) => {
            const isImage = d.target && d.target.includes('firebasestorage.googleapis.com');
            const isBase64OrFileId = d.target && d.target.length > 50 && !d.target.includes(' ');
            return {
              id: d.id,
              time: d.timestamp,
              incident: (isImage || isBase64OrFileId) ? "Rasmli antinarkotik dalil" : d.target || "Noma'lum Incident",
              district: d.district || d.region || "Aniqlanmagan",
              riskLevel: d.severity || "MEDIUM",
              riskScore: d.riskScore || 0,
              inspector: d.inspector || "Biriktirilmagan",
              status: d.status || "Evidence Uploaded",
              description: d.description,
              type: d.category || "Boshqa",
              reporterName: d.reporterName || "Kiber Gvardiya",
              reporterId: d.reporterId,
              latitude: d.latitude,
              longitude: d.longitude,
              volunteer: {
                telegramName: d.reporterName,
                telegramId: d.reporterId,
                uploadedImages: isImage ? [d.target] : (isBase64OrFileId ? [(d.target.startsWith("iVBORw0KGgo") ? `data:image/png;base64,${d.target}` : (d.target.startsWith("/9j/") ? `data:image/jpeg;base64,${d.target}` : d.target))] : []),
                submittedText: d.description
              }
            };
          });
          setIncidents(mapped);
        }
      } catch (err) {
        console.error("Failed to fetch incidents", err);
      }
    };
    
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isFirebaseConfigured && db) {
      addFbLog("FIREBASE_CONNECTING", "Firestore ma'lumotlar bazasiga ulanmoqda...");
      
      const unsubVolunteers = onSnapshot(collection(db, "volunteers"), (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data());
        });
        if (list.length > 0) {
          const mappedList = list.map(item => ({
            id: item.id,
            name: item.name,
            reputation: item.reputation || "Boshlovchi",
            points: item.coins || 0,
            reports: item.blockedCount || 0,
            status: item.status || "Aktiv",
            trustScore: 90
          }));
          setVolunteers(mappedList);
          addFbLog("FIRESTORE_SYNC", `Muvaffaqiyatli yuklandi: ${list.length} ta volontyor`);
        }
      }, (err) => {
        addFbLog("FIRESTORE_ERROR", `Sinxronizatsiya xatosi: ${err.message}`);
      });

      const unsubTasks = onSnapshot(collection(db, "block_tasks"), (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data());
        });
        if (list.length > 0) {
          setBlockTasks(list.sort((a, b) => b.id.localeCompare(a.id)));
          addFbLog("FIRESTORE_SYNC", `Muvaffaqiyatli yuklandi: ${list.length} ta bloklash vazifasi`);
        }
      }, (err) => {
        addFbLog("FIRESTORE_ERROR", `Vazifalar yuklash xatosi: ${err.message}`);
      });

      const unsubReports = onSnapshot(collection(db, "block_reports"), (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data());
        });
        if (list.length > 0) {
          setBlockReports(list);
          addFbLog("FIRESTORE_SYNC", `Muvaffaqiyatli yuklandi: ${list.length} ta hisobotlar`);
        }
      }, (err) => {
        addFbLog("FIRESTORE_ERROR", `Hisobotlar yuklash xatosi: ${err.message}`);
      });

      return () => {
        unsubVolunteers();
        unsubTasks();
        unsubReports();
      };
    } else {
      addFbLog("LOCALSTORAGE_MODE", "Offline rejim ishlamoqda. Ma'lumotlar brauzerda saqlanadi.");
      const localVols = localStorage.getItem("safeuz_volunteers");
      if (localVols) {
        try { setVolunteers(JSON.parse(localVols)); } catch (e) {}
      } else {
        localStorage.setItem("safeuz_volunteers", JSON.stringify(volunteers));
      }

      const localTasks = localStorage.getItem("safeuz_block_tasks");
      if (localTasks) {
        try { setBlockTasks(JSON.parse(localTasks)); } catch (e) {}
      } else {
        localStorage.setItem("safeuz_block_tasks", JSON.stringify(blockTasks));
      }

      const localReports = localStorage.getItem("safeuz_block_reports");
      if (localReports) {
        try { setBlockReports(JSON.parse(localReports)); } catch (e) {}
      } else {
        localStorage.setItem("safeuz_block_reports", JSON.stringify(blockReports));
      }
    }
  }, []);

  const updateVolunteerCoins = async (volId: string, coinsDiff: number, isBlockComplete = false) => {
    let updatedList = volunteers.map(vol => {
      if (vol.id === volId) {
        const newPoints = Math.max(0, vol.points + coinsDiff);
        const newReports = isBlockComplete ? vol.reports + 1 : vol.reports;
        
        let newRep = vol.reputation;
        if (newPoints >= 1500) newRep = "Kiber Qahramon 👑";
        else if (newPoints >= 1000) newRep = "Oltin Kiber-Volontyor 🥇";
        else if (newPoints >= 500) newRep = "Kumush Kiber-Volontyor 🥈";
        else if (newPoints >= 200) newRep = "Bronza Kiber-Volontyor 🥉";
        else newRep = "Boshlovchi 🌱";

        return { ...vol, points: newPoints, reports: newReports, reputation: newRep };
      }
      return vol;
    });

    setVolunteers(updatedList);
    localStorage.setItem("safeuz_volunteers", JSON.stringify(updatedList));

    if (isFirebaseConfigured && db) {
      try {
        const targetVol = updatedList.find(v => v.id === volId);
        if (targetVol) {
          const volRef = doc(db, "volunteers", volId);
          await setDoc(volRef, {
            id: targetVol.id,
            name: targetVol.name,
            telegramUsername: targetVol.name.toLowerCase().replace(/[^a-z0-9]/g, "") + "_cyber",
            reputation: targetVol.reputation,
            coins: targetVol.points,
            blockedCount: targetVol.reports,
            status: targetVol.status
          });
          addFbLog("FIRESTORE_WRITE", `Sinxronlandi: /volunteers/${volId} (Coin: ${targetVol.points})`);
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `volunteers/${volId}`);
      }
    } else {
      addFbLog("LOCALSTORAGE_WRITE", `Yozildi: /volunteers/${volId} (+${coinsDiff} Coin)`);
    }
  };

  const createVolunteer = async (name: string, initialPoints: number = 0, initialReports: number = 0) => {
    const newId = "VOL-" + Math.floor(100 + Math.random() * 900);
    
    let rep = "Boshlovchi 🌱";
    if (initialPoints >= 1500) rep = "Kiber Qahramon 👑";
    else if (initialPoints >= 1000) rep = "Oltin Kiber-Volontyor 🥇";
    else if (initialPoints >= 500) rep = "Kumush Kiber-Volontyor 🥈";
    else if (initialPoints >= 200) rep = "Bronza Kiber-Volontyor 🥉";

    const newVol = {
      id: newId,
      name,
      trustScore: 100,
      reports: initialReports,
      falseReports: 0,
      reputation: rep,
      points: initialPoints,
      status: "Aktiv"
    };

    const updatedList = [...volunteers, newVol];
    setVolunteers(updatedList);
    localStorage.setItem("safeuz_volunteers", JSON.stringify(updatedList));

    if (isFirebaseConfigured && db) {
      try {
        const volRef = doc(db, "volunteers", newId);
        await setDoc(volRef, {
          id: newId,
          name: newVol.name,
          telegramUsername: newVol.name.toLowerCase().replace(/[^a-z0-9]/g, "") + "_cyber",
          reputation: newVol.reputation,
          coins: newVol.points,
          blockedCount: newVol.reports,
          status: newVol.status
        });
        addFbLog("FIRESTORE_WRITE", `Yangi Volontyor: /volunteers/${newId}`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `volunteers/${newId}`);
      }
    } else {
      addFbLog("LOCALSTORAGE_WRITE", `Yangi Volontyor: /volunteers/${newId} (Offline)`);
    }

    addAuditLog("ADMIN", `Yangi kiber-volontyor qo'shildi: ${name}`);
  };

  const saveVolunteerToDb = async (updatedVol: any) => {
    let rep = "Boshlovchi 🌱";
    if (updatedVol.points >= 1500) rep = "Kiber Qahramon 👑";
    else if (updatedVol.points >= 1000) rep = "Oltin Kiber-Volontyor 🥇";
    else if (updatedVol.points >= 500) rep = "Kumush Kiber-Volontyor 🥈";
    else if (updatedVol.points >= 200) rep = "Bronza Kiber-Volontyor 🥉";

    const finalVol = { ...updatedVol, reputation: rep };
    const updatedList = volunteers.map(v => v.id === finalVol.id ? finalVol : v);
    setVolunteers(updatedList);
    localStorage.setItem("safeuz_volunteers", JSON.stringify(updatedList));

    if (isFirebaseConfigured && db) {
      try {
        const volRef = doc(db, "volunteers", finalVol.id);
        await setDoc(volRef, {
          id: finalVol.id,
          name: finalVol.name,
          telegramUsername: finalVol.name.toLowerCase().replace(/[^a-z0-9]/g, "") + "_cyber",
          reputation: finalVol.reputation,
          coins: finalVol.points,
          blockedCount: finalVol.reports,
          status: finalVol.status
        });
        addFbLog("FIRESTORE_WRITE", `Sinxronlandi: /volunteers/${finalVol.id} (Tahrirlandi)`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `volunteers/${finalVol.id}`);
      }
    } else {
      addFbLog("LOCALSTORAGE_WRITE", `Tahrirlandi: /volunteers/${finalVol.id} (Offline)`);
    }
    
    addAuditLog("ADMIN", `Volontyor ma'lumotlari yangilandi: ${finalVol.id}`);
  };

  const deleteVolunteerFromDb = async (volId: string) => {
    const updatedList = volunteers.filter(v => v.id !== volId);
    setVolunteers(updatedList);
    localStorage.setItem("safeuz_volunteers", JSON.stringify(updatedList));

    if (isFirebaseConfigured && db) {
      try {
        const volRef = doc(db, "volunteers", volId);
        await deleteDoc(volRef);
        addFbLog("FIRESTORE_DELETE", `O'chirildi: /volunteers/${volId}`);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `volunteers/${volId}`);
      }
    } else {
      addFbLog("LOCALSTORAGE_DELETE", `O'chirildi: /volunteers/${volId} (Offline)`);
    }

    addAuditLog("ADMIN", `Volontyor o'chirildi: ${volId}`);
  };

  const saveIncidentToDb = async (updatedInc: Incident) => {
    const exists = incidents.some(item => item.id === updatedInc.id);
    const updatedList = exists 
      ? incidents.map(item => item.id === updatedInc.id ? updatedInc : item)
      : [updatedInc, ...incidents];

    setIncidents(updatedList);
    
    try {
      await fetch('/api/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: updatedInc.id, 
          status: updatedInc.status,
          inspector: updatedInc.inspector
        })
      });
      addFbLog("API_WRITE", `Sinxronlandi: /incidents/${updatedInc.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteIncidentFromDb = async (incId: string) => {
    const updatedList = incidents.filter(r => r.id !== incId);
    setIncidents(updatedList);
    
    try {
      await fetch(`/api/reports/${incId}`, { method: 'DELETE' });
      addFbLog("API_DELETE", `O'chirildi: /incidents/${incId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const createBlockTask = async (title: string, target: string, type: string, coins: number, message: string) => {
    const taskId = "TSK-" + (100 + blockTasks.length + 1);
    const newTask = {
      id: taskId,
      title,
      target,
      type,
      coins: Number(coins),
      status: "Active",
      message: message || "Ushbu xavfli manbani bloklang va xavfsizligimizga hissa qo'shing.",
      createdAt: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const updatedTasks = [newTask, ...blockTasks];
    setBlockTasks(updatedTasks);
    localStorage.setItem("safeuz_block_tasks", JSON.stringify(updatedTasks));

    if (isFirebaseConfigured && db) {
      try {
        const taskRef = doc(db, "block_tasks", taskId);
        await setDoc(taskRef, newTask);
        addFbLog("FIRESTORE_WRITE", `Sinxronlandi: /block_tasks/${taskId} (Target: ${target})`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `block_tasks/${taskId}`);
      }
    } else {
      addFbLog("LOCALSTORAGE_WRITE", `Yozildi: /block_tasks/${taskId}`);
    }

    addAuditLog("ADMIN", `Yangi bloklash topshirig'i botga yuborildi: ${target}`);
  };

  const testTelegramConnection = async () => {
    if (!tgBotToken) {
      showToast("Iltimos, avval Telegram Bot tokenini kiriting!", "error");
      return;
    }
    setIsTestingTgConnection(true);
    setTgConnectionStatus("🔄 Bot ulanishi tekshirilmoqda...");
    try {
      const res = await fetch("/api/bot-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tgBotToken })
      });
      const data = await res.json();
      if (data.ok) {
        setTgConnectionStatus(`✅ Ulandi: @${data.result.username} (${data.result.first_name})`);
        addFbLog("TG_BOT", `Ulanish muvaffaqiyatli: @${data.result.username}`);
        showToast(`Bot ulanishi tasdiqlandi: @${data.result.username}`, "success");
      } else {
        setTgConnectionStatus(`❌ Xatolik: ${data.description || "Noma'lum"}`);
        addFbLog("TG_BOT_ERROR", `Xato token yoki ruxsat yetarli emas`);
        showToast(`Bot ulanish xatosi: ${data.description || "Noma'lum"}_`, "error");
      }
    } catch (err: any) {
      setTgConnectionStatus(`❌ Ulanib bo'lmadi: ${err.message}`);
      addFbLog("TG_BOT_ERROR", `So'rov xatosi: ${err.message}`);
      showToast(`Tarmoq xatosi: ${err.message}`, "error");
    } finally {
      setIsTestingTgConnection(false);
    }
  };

  const sendTelegramBroadcast = async (task: any) => {
    setIsBroadcastingTg(true);
    try {
      const messageText = `🛡️ <b>YANGI KIBER-TOPSHIRIQ</b>\n\n` +
        `<b>Sarlavha:</b> ${task.title}\n` +
        `<b>Turi:</b> ${task.type}\n` +
        `<b>Bounty Mukofot:</b> ${task.coins} SafeCoins\n\n` +
        `📝 <b>Yo'riqnoma:</b>\n<i>${task.message}</i>\n\n` +
        `🎯 <b>Manzil/Havola:</b> ${task.target}\n\n` +
        `⚡ <i>Kiber Gvardiya jamoasi, ushbu manbani bloklashda ishtirok eting va SafeCoins tangalariga ega bo'ling!</i>`;

      const res = await fetch("/api/bot-broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          target: task.target,
          token: tgBotToken
        })
      });

      const data = await res.json();
      if (data.success) {
        addFbLog("TG_BROADCAST_SUCCESS", `Xabar yuborildi: ${data.count} ta volontyorga`);
        showToast(`Kiber-topshiriq barcha volontyorlarga muvaffaqiyatli broadcast qilindi! Qabul qilganlar: ${data.count} ta`, "success");
      } else {
        addFbLog("TG_BROADCAST_ERROR", `Xatolik: ${data.error}`);
        showToast(`Telegram orqali yuborishda muammo: ${data.error}`, "error");
      }
    } catch (err: any) {
      addFbLog("TG_BROADCAST_ERROR", `Xato: ${err.message}`);
      showToast(`Backendga ulanish xatosi: ${err.message}`, "error");
    } finally {
      setIsBroadcastingTg(false);
    }
  };

  const addBlockReport = async (taskId: string, volId: string, coinsAwarded: number) => {
    const reportId = "REP-" + (100 + blockReports.length + 1);
    const newReport = {
      id: reportId,
      taskId,
      volunteerId: volId,
      coinsAwarded,
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const updatedReports = [newReport, ...blockReports];
    setBlockReports(updatedReports);
    localStorage.setItem("safeuz_block_reports", JSON.stringify(updatedReports));

    if (isFirebaseConfigured && db) {
      try {
        const reportRef = doc(db, "block_reports", reportId);
        await setDoc(reportRef, newReport);
        addFbLog("FIRESTORE_WRITE", `Sinxronlandi: /block_reports/${reportId}`);
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `block_reports/${reportId}`);
      }
    } else {
      addFbLog("LOCALSTORAGE_WRITE", `Yozildi: /block_reports/${reportId}`);
    }
  };

  // Real-time Decrypt Stream Simulator
  useEffect(() => {
    const types = [
      { type: "[INFO]", color: "text-blue-400", messages: ["Yangi volontyor arizasi qabul qilindi", "Inspektor Alimov F. navbatchilikka kirishdi", "Tizim ma'lumotlar bazasi zaxira nusxasi yaratildi"] },
      { type: "[WARNING]", color: "text-amber-400", messages: ["Sirdaryo dori kanali orqali shubhali xabarlar soni oshdi", "Domen skanerlash navbati yuklandi: https://uzcard-recalc.info", "Bot faolligi aniqlandi: @oson_pul_topish_bot"] },
      { type: "[CRITICAL]", color: "text-red-400 font-bold animate-pulse", messages: ["Yangi SQL Injection urinishi fiksatsiya qilindi (IP: 195.12.84.22)", "Yangi troyan APK fayli yuklandi: OsonPul_Bonus.apk", "Klik soxta klon sayti faollashdi"] },
      { type: "[SUCCESS]", color: "text-[#10B981] font-bold", messages: ["Domen provayder orqali muvaffaqiyatli bloklandi", "Troyan paketi tahlili yakunlandi", "Kiber-inspektor vaziyatni hal qildi"] }
    ];

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const msg = selectedType.messages[Math.floor(Math.random() * selectedType.messages.length)];
      
      setLogs(prev => [
        { time: timeStr, type: selectedType.type, message: msg, color: selectedType.color },
        ...prev.slice(0, 19) // Limit to last 20 logs
      ]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateInspector = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/inspectors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newInspector.name,
          login: newInspector.email,
          password: newInspector.password || "123456",
          district: newInspector.district || "Guliston Shahri"
        })
      });
      if (res.ok) {
        const data = await res.json();
        const savedIns = data.inspector;
        setInspectors(prev => [
          ...prev,
          {
            id: `INS-${savedIns.id}`,
            dbId: savedIns.id,
            name: savedIns.fullName || savedIns.full_name || savedIns.name || newInspector.name,
            district: savedIns.district || newInspector.district,
            status: savedIns.status || "ONLINE",
            solved: savedIns.solved || 0,
            active: savedIns.active || 0,
            responseTime: savedIns.responseTime || "0.0 m",
            email: savedIns.login || newInspector.email
          }
        ]);
        addAuditLog("ADMIN", `Yangi kiber-inspektor qo'shildi: ${newInspector.name}`);
        setIsAddingInspector(false);
        setNewInspector({ name: "", district: "Guliston Shahri", email: "", password: "" });
      } else {
        const err = await res.json();
        alert("Xatolik: " + err.error);
      }
    } catch (err: any) {
      alert("Tarmoq xatosi: " + err.message);
    }
  };

  const handleDeleteInspector = (ins: any) => {
    setInspectorToDelete(ins);
  };

  const handleDeleteInspectorConfirm = async () => {
    if (!inspectorToDelete) return;
    const ins = inspectorToDelete;
    if (!ins.dbId) {
      setInspectors(prev => prev.filter(item => item.id !== ins.id));
      setInspectorToDelete(null);
      return;
    }
    try {
      const res = await fetch(`/api/inspectors/${ins.dbId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setInspectors(prev => prev.filter(item => item.id !== ins.id));
        addAuditLog("ADMIN", `Kiber-inspektor o'chirildi: ${ins.name}`);
      } else {
        const err = await res.json();
        alert("O'chirishda xatolik: " + err.error);
      }
    } catch (err: any) {
      alert("Aloqa xatosi: " + err.message);
    } finally {
      setInspectorToDelete(null);
    }
  };

  const handleUpdateInspector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInspector || !editingInspector.dbId) return;
    try {
      const res = await fetch(`/api/inspectors/${editingInspector.dbId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editingInspector.name,
          login: editingInspector.email,
          password: editingInspector.password,
          district: editingInspector.district,
          status: editingInspector.status,
          solved: editingInspector.solved,
          active: editingInspector.active,
          responseTime: editingInspector.responseTime
        })
      });
      if (res.ok) {
        setInspectors(prev => prev.map(item => item.id === editingInspector.id ? editingInspector : item));
        addAuditLog("ADMIN", `Kiber-inspektor tahrirlandi: ${editingInspector.name}`);
        setEditingInspector(null);
      } else {
        const err = await res.json();
        alert("Tahrirlashda xatolik: " + err.error);
      }
    } catch (err: any) {
      alert("Aloqa xatosi: " + err.message);
    }
  };

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `INC-${Math.floor(4800 + Math.random() * 200)}`;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const dateStr = now.toISOString().split('T')[0];

    const item: Incident = {
      id,
      time: timeStr,
      date: dateStr,
      incident: newIncident.incident,
      district: newIncident.district,
      riskLevel: newIncident.riskLevel,
      inspector: newIncident.inspector,
      status: "Assigned",
      source: newIncident.source,
      description: newIncident.description,
      volunteer: {
        telegramName: profile.name,
        telegramUsername: "@admin_shtab",
        telegramId: "9982001",
        submissionTime: timeStr,
        gpsLocation: "40.5001° N, 68.7801° E (Sirdaryo Shtab)",
        uploadedImages: [],
        uploadedVideos: [],
        uploadedFiles: [],
        submittedText: "Ma'muriyat tomonidan qo'lda kiritilgan kiber-incident.",
        trustScore: 100,
        previousReports: 0,
        confirmedReports: 0,
        falseReports: 0,
        reportCount: 0
      }
    };

    saveIncidentToDb(item);
    setSelectedCase(item);
    addAuditLog("ADMIN", `Yangi incident qo'shildi: ${id} - ${newIncident.incident}`);
    setIsAddingIncident(false);
    setNewIncident({
      incident: "",
      district: "Guliston Shahri",
      riskLevel: "HIGH",
      inspector: "Kpt. Safarov M.",
      source: "",
      description: ""
    });
    alert(`Yangi incident muvaffaqiyatli saqlandi! ID: ${id}`);
  };

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
      case "Blocked": return "text-red-400 bg-red-950/20 border border-red-500/20";
      case "Resolved": return "text-emerald-400 bg-emerald-950/20 border border-emerald-500/20";
      case "Evidence Uploaded": return "text-purple-400 bg-purple-950/20 border border-purple-500/20";
      case "Investigating": return "text-blue-400 bg-blue-950/20 border border-blue-500/20";
      case "Accepted": return "text-indigo-400 bg-indigo-950/20 border border-indigo-500/20";
      default: return "text-amber-400 bg-amber-950/20 border border-amber-500/20";
    }
  };

  // AI Skanerlash simulyatori
  const handleAiScan = () => {
    if (isAiScanning) return;
    setIsAiScanning(true);
    setScanFeedback("Tizim skanerlashni boshladi...");
    
    // Add logs to local log array
    const timeStr = new Date().toLocaleTimeString();
    setLogs(prev => [
      { time: timeStr, type: "[AI_SCAN_START]", message: "Sirdaryo axborot makonini tahlil etish boshlandi...", color: "text-emerald-400 font-bold animate-pulse" },
      ...prev
    ]);

    setTimeout(() => {
      setScanFeedback("Telegram guruh va kanallar filtrlanmoqda...");
      setLogs(prev => [
        { time: new Date().toLocaleTimeString(), type: "[AI_FILTERING]", message: "Ochiq guruhlardagi spam va shubhali kalit so'zlar aniqlanmoqda", color: "text-blue-400" },
        ...prev
      ]);
    }, 1000);

    setTimeout(() => {
      setScanFeedback("Fishing havolalari xavf darajasi baholanmoqda...");
      setLogs(prev => [
        { time: new Date().toLocaleTimeString(), type: "[AI_HEURISTICS]", message: "Click/Payme soxta brend dizaynlari aniqlandi", color: "text-amber-400" },
        ...prev
      ]);
    }, 2000);

    setTimeout(() => {
      setIsAiScanning(false);
      setScanFeedback(null);
      setAiAnalysisCount(prev => prev + 18);
      
      const finalTime = new Date().toLocaleTimeString();
      setLogs(prev => [
        { time: finalTime, type: "[AI_SCAN_COMPLETE]", message: "Muvaffaqiyatli yakunlandi. Yangi shubhali kiber-tahdid aniqlandi!", color: "text-emerald-400 font-bold" },
        ...prev
      ]);

      const newIncId = `INC-${Math.floor(1000 + Math.random() * 9000)}`;
      const newSimulatedIncident: Incident = {
        id: newIncId,
        time: finalTime.slice(0, 5),
        date: new Date().toISOString().slice(0, 10),
        incident: "Yangi AI Skaner orqali: Soxta yutuq taklif qiluvchi bot (@payme_sovgasi_bot)",
        district: "Yangiyer Shahri",
        riskLevel: "CRITICAL",
        inspector: "Kpt. Safarov M.",
        status: "NEW",
        source: "@payme_sovgasi_bot",
        description: "AI skaneri tomonidan aniqlangan foydalanuvchi kartasidan pul yechib oluvchi shubhali telegram bot.",
        volunteer: {
          telegramName: "AI Kiber-Gvardiya Skaneri",
          telegramUsername: "@cyber_guard_ai_bot",
          telegramId: "999999999",
          submissionTime: finalTime.slice(0, 5),
          gpsLocation: "40.2618° N, 68.8122° E (Yangiyer shahri)",
          uploadedImages: ["https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80"],
          uploadedVideos: [],
          uploadedVoice: "",
          uploadedFiles: [],
          submittedText: "AI tizimi tomonidan avtomatik ravishda aniqlandi. Xavf darajasi yuqori.",
          trustScore: 100,
          previousReports: 1402,
          confirmedReports: 1400,
          falseReports: 2,
          reportCount: 1402
        }
      };

      setIncidents(prev => [newSimulatedIncident, ...prev]);
      addAuditLog("AI_SYSTEM", `AI Skaner orqali yangi kiber-tahdid fiksatsiya qilindi: ${newIncId}`);
    }, 3500);
  };

  // Helper for exporting
  const [isExporting, setIsExporting] = useState(false);
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      addAuditLog("ADMIN", "Tizim ma'lumotlari kiber-excel formatda eksport qilindi");
      alert("Ma'lumotlar muvaffaqiyatli Excel/CSV formatida yuklab olindi.");
    }, 1200);
  };

  // Filtering incidents
  const filteredIncidents = incidents.filter(inc => {
    const matchesSearch = inc.incident.toLowerCase().includes(searchTerm.toLowerCase()) || inc.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = filterDistrict === "all" || inc.district === filterDistrict;
    const matchesSeverity = filterSeverity === "all" || inc.riskLevel === filterSeverity;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "pending" && inc.status !== "Blocked" && inc.status !== "Resolved") ||
      (filterStatus === "resolved" && (inc.status === "Blocked" || inc.status === "Resolved"));
    return matchesSearch && matchesDistrict && matchesSeverity && matchesStatus;
  });

  return (
    <div className="p-4 md:p-8 space-y-8 text-left text-white max-w-7xl mx-auto w-full">
      
      {/* 1. DASHBOARD OVERVIEW PAGE */}
      {activeTab === "admin-dashboard" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Tizim Ishchi Monitoringi</h1>
            <p className="text-xs text-gray-400 font-mono">Tezkor shtab nazorati ostidagi umumiy axborotlar va mini-GIS xaritasi</p>
          </div>

          {/* Core overview stats */}
          {scanFeedback && (
            <div className="bg-blue-900/30 border border-blue-500/30 p-3 rounded-xl flex items-center justify-between text-xs text-blue-200 animate-pulse">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
                {scanFeedback}
              </span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded">AKTIV_SKANERLASH</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: "BUGUNGI AI TAHLILLARI", 
                val: `${aiAnalysisCount.toLocaleString()} ta`, 
                sub: isAiScanning ? "AI skanerlamoqda..." : "Muntazam skanerlash faol", 
                trend: isAiScanning ? "Skanerda..." : "+14.2%", 
                isTrendUp: true, 
                icon: Sparkles,
                hint: isAiScanning ? "Iltimos kuting..." : "AI skanerlashni ishga tushirish",
                action: handleAiScan,
                color: isAiScanning ? "border-emerald-500/40 shadow-lg shadow-emerald-950/20 bg-emerald-950/15" : "hover:border-blue-500/30 hover:bg-blue-950/15"
              },
              { 
                label: "KRITIK TAHIDLAR", 
                val: `${10 + incidents.filter(i => i.riskLevel === "CRITICAL").length} ta`, 
                sub: "Tezkor chora talab etiladi", 
                trend: `+${incidents.filter(i => i.riskLevel === "CRITICAL").length} ta`, 
                isTrendUp: true, 
                icon: AlertOctagon,
                hint: "Ro'yxatni ko'rish (CRITICAL)",
                action: () => {
                  setFilterSeverity("CRITICAL");
                  setFilterStatus("all");
                  if (setActiveTab) setActiveTab("incident-management");
                },
                color: "hover:border-red-500/30 hover:bg-red-950/15"
              },
              { 
                label: "KUTILAYOTGAN ISHLAR", 
                val: `${6 + incidents.filter(i => i.status !== "Blocked" && i.status !== "Resolved").length} ta`, 
                sub: "Inspektor tasdig'i navbatida", 
                trend: `-${(incidents.filter(i => i.status !== "Blocked" && i.status !== "Resolved").length * 1.5).toFixed(0)}%`, 
                isTrendUp: false, 
                icon: Clock,
                hint: "Kutilayotganlarni ko'rish (Pending)",
                action: () => {
                  setFilterStatus("pending");
                  setFilterSeverity("all");
                  if (setActiveTab) setActiveTab("incident-management");
                },
                color: "hover:border-amber-500/30 hover:bg-amber-950/15"
              },
              { 
                label: "YAKUNLANGAN HOLATLAR", 
                val: `${180 + incidents.filter(i => i.status === "Blocked" || i.status === "Resolved").length} ta`, 
                sub: "Bloklangan va hal qilingan", 
                trend: "+8.3%", 
                isTrendUp: true, 
                icon: CheckCircle,
                hint: "Yakunlanganlarni ko'rish (Resolved)",
                action: () => {
                  setFilterStatus("resolved");
                  setFilterSeverity("all");
                  if (setActiveTab) setActiveTab("incident-management");
                },
                color: "hover:border-emerald-500/30 hover:bg-emerald-950/15"
              }
            ].map((st, i) => (
              <div 
                key={i} 
                onClick={st.action}
                className={`bg-[#131D2E]/60 border border-white/5 p-4 rounded-2xl flex flex-col justify-between cursor-pointer transition-all duration-300 transform hover:-translate-y-0.5 select-none ${st.color}`}
                title={st.hint}
              >
                <div className="flex justify-between items-start text-gray-400 text-[10px] font-mono font-bold tracking-wider">
                  <span>{st.label}</span>
                  <st.icon className={`w-4 h-4 ${st.label.includes("AI") && isAiScanning ? "text-emerald-400 animate-spin" : "text-blue-400"}`} />
                </div>
                <div className="my-3 flex items-baseline gap-2">
                  <span className={`text-2xl font-extrabold font-display ${st.label.includes("AI") && isAiScanning ? "text-emerald-400" : ""}`}>{st.val}</span>
                  <span className={`text-[10px] font-mono font-bold ${st.isTrendUp ? "text-emerald-400" : "text-red-400"}`}>
                    {st.trend}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-500 font-light">{st.sub}</span>
                  <span className="text-blue-400/60 font-mono text-[9px] hover:text-blue-400">kliklang ↗</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Mini GIS Map wrapper */}
            <div className="lg:col-span-8 bg-[#131D2E]/40 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Radar className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: "6s" }} />
                    Hududiy Kiber-Poligon (Mini GIS Xaritasi)
                  </h3>
                  <p className="text-[10px] text-gray-400">Tumanlar risk darajasi va faol markerlar</p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono uppercase">
                  GIS_STABLE
                </span>
              </div>

              <div className="h-96 rounded-2xl overflow-hidden border border-white/5 bg-slate-900 relative">
                <AIOCMap height="100%" layerType="risk" focusedDistrict={focusedDistrict} focusedCoords={focusedCoords} liveIncidents={incidents} />
              </div>
            </div>

            {/* Recent notifications & Quick actions */}
            <div className="lg:col-span-4 space-y-6">

              <div className="bg-[#131D2E]/60 border border-white/8 rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 border-b border-white/5 pb-2">
                  So'nggi Bildirishnomalar
                </h3>
                <div className="space-y-3">
                  {[
                    { title: "Zararli Telegram kanal aniqlandi", desc: "Guliston shahri hududida reklamasi tarqalgan dori kanali bloklash uchun jo'natildi.", time: "Hozirgina" },
                    { title: "Fishing sayti hosting bloklandi", desc: "http://click-bonus-uz.com sayti provayder tomonidan fiksatsiya qilinib o'chirildi.", time: "12 min oldin" },
                    { title: "Kiber-inspektor vaziyatni hal qildi", desc: "Safarov M. Guliston shahri bo'yicha INC-4810 troyan ishini yopdi.", time: "42 min oldin" }
                  ].map((notif, idx) => (
                    <div key={idx} className="space-y-1 text-xs border-b border-white/5 pb-2.5 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white/90">{notif.title}</span>
                        <span className="text-[10px] text-gray-500 font-mono">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-normal font-light">{notif.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. LIVE OPERATIONS PAGE */}
      {activeTab === "live-operations" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display flex items-center gap-2">
              <Radar className="w-6 h-6 text-red-500 animate-spin" />
              Real Vaqtdagi Kiber-Gvardiya Skaneri
            </h1>
            <p className="text-xs text-gray-400">Sirdaryo viloyati bo'yicha real vaqtdagi faol kiber-skanerlashlar darchasi</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Operational Terminal log */}
            <div className="lg:col-span-2 bg-[#0C111A] border border-blue-500/10 rounded-2xl p-4 font-mono text-xs space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-blue-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  REAL_TIME_DECRYPT_STREAM
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 rounded">ONLINE</span>
              </div>

              <div className="space-y-2 max-h-[480px] overflow-y-auto font-mono text-gray-300 pr-2">
                {logs.map((log, i) => (
                  <div key={i} className="transition-all duration-300">
                    [{log.time}] <span className={log.color}>{log.type}</span> {log.message}
                  </div>
                ))}
              </div>
            </div>

            {/* Right scanner controls */}
            <div className="bg-[#131D2E]/60 border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-sm border-b border-white/5 pb-2">Skaner Parametrlari</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 block mb-1">Telegram skanerlash tezligi</span>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "85%" }} />
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono mt-1 block">85 r/sec (Yuqori tezlik)</span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-1">Web API Monitoring darajasi</span>
                  <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "95%" }} />
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono mt-1 block">Maksimal (95%)</span>
                </div>

                <div>
                  <span className="text-gray-400 block mb-1">Apk Sandbox tekshiruv vaqti</span>
                  <span className="font-bold block text-white font-mono">15 soniya (Static & Dynamic)</span>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
                <button className="bg-red-600 hover:bg-red-500 py-2.5 rounded-xl font-bold text-xs transition-all">
                  Favqulodda Skanerlarni To'xtatish
                </button>
                <button className="bg-white/5 hover:bg-white/10 text-white/95 py-2.5 rounded-xl font-bold text-xs transition-all border border-white/10">
                  Sinov Skanerini Ishga Tushirish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. INCIDENT MANAGEMENT PAGE */}
      {activeTab === "incident-management" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-end items-center gap-4 border-b border-white/5 pb-4">
            <div className="flex flex-wrap gap-2.5">
              <button 
                onClick={() => setIsAddingIncident(!isAddingIncident)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yangi Incident Qo'shish</span>
              </button>
            </div>
          </div>

          {/* New Incident Creation Form */}
          {isAddingIncident && (
            <form onSubmit={handleCreateIncident} className="bg-[#131D2E]/60 border border-blue-500/20 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-blue-400 border-b border-white/5 pb-2">Yangi Kiber-Incident Kirish Formasi</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-400 block">Kiber-Tahdid Sarlavhasi (Incident Name)</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Telegram dori reklama guruhi yoki Click fishing sayti"
                    value={newIncident.incident}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, incident: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 block">Kiber Tahdid Manbasi (Source URL/Channel)</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: @pul_yutug_bot yoki click-free.com"
                    value={newIncident.source}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 block">Operativ Tuman / Hudud</label>
                  <select
                    value={newIncident.district}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, district: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Guliston Shahri">Guliston Shahri</option>
                    <option value="Sirdaryo Tumani">Sirdaryo Tumani</option>
                    <option value="Yangiyer Shahri">Yangiyer Shahri</option>
                    <option value="Boyovut Tumani">Boyovut Tumani</option>
                    <option value="Xovos Tumani">Xovos Tumani</option>
                    <option value="Shirin Shahri">Shirin Shahri</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 block">Kritiklik / Risk Darajasi</label>
                  <select
                    value={newIncident.riskLevel}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, riskLevel: e.target.value as any }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400 block">Tezkor Inspektor Biriktirish</label>
                  <select
                    value={newIncident.inspector}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, inspector: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                  >
                    {inspectors.map((ins, idx) => (
                      <option key={idx} value={ins.name}>{ins.name} ({ins.district})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-gray-400 block">Kiber-Tahdid Tahlil Tavsifi</label>
                  <textarea
                    required
                    placeholder="Tahdid bo'yicha batafsil ma'lumot kiriting..."
                    value={newIncident.description}
                    onChange={(e) => setNewIncident(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 h-20"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddingIncident(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer"
                >
                  Saqlash va Yuborish 💾
                </button>
              </div>
            </form>
          )}

          {/* Search and filtering bars */}
          <div className="bg-[#131D2E]/40 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input 
                type="text" 
                placeholder="ID yoki kiber-tahdid nomi bo'yicha qidirish..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2 w-full md:w-auto shrink-0">
              <select 
                value={filterDistrict} 
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Barcha Tumanlar</option>
                <option value="Guliston Shahri">Guliston Shahri</option>
                <option value="Sirdaryo Tumani">Sirdaryo Tumani</option>
                <option value="Yangiyer Shahri">Yangiyer Shahri</option>
                <option value="Boyovut Tumani">Boyovut Tumani</option>
                <option value="Xovos Tumani">Xovos Tumani</option>
                <option value="Shirin Shahri">Shirin Shahri</option>
              </select>

              <select 
                value={filterSeverity} 
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="all">Barcha Xavf Darajalari</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
              </select>

              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 cursor-pointer animate-fade-in"
              >
                <option value="all">Barcha Holatlar</option>
                <option value="pending">Kutilayotgan (Pending)</option>
                <option value="resolved">Yakunlangan (Resolved/Blocked)</option>
              </select>
            </div>
          </div>

          {/* Incidents Table */}
          <div className="bg-[#131D2E]/30 border border-white/5 rounded-2xl overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 font-mono">
                    <th className="p-4 w-28">ID</th>
                    <th className="p-4">Kiber-Tahdid Nomi & Tur</th>
                    <th className="p-4 w-44">Hudud & GPS Lokatsiya</th>
                    <th className="p-4 w-28">Xavf Skori</th>
                    <th className="p-4 w-36">Yuboruvchi</th>
                    <th className="p-4 w-44">Mas'ul Inspektor</th>
                    <th className="p-4 w-36">Joriy Holat (Jarayon)</th>
                    <th className="p-4 text-center w-24">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredIncidents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-gray-500 font-light">Kiber-tahdid topilmadi.</td>
                    </tr>
                  ) : (
                    filteredIncidents.map((inc) => (
                      <tr key={inc.id} className="hover:bg-white/5 transition-all">
                        <td className="p-4 font-mono font-bold text-blue-400">{inc.id}</td>
                        <td className="p-4 text-white">
                          <div className="flex items-center gap-3">
                            {inc.volunteer?.uploadedImages && inc.volunteer.uploadedImages.length > 0 && (inc.volunteer.uploadedImages[0].startsWith("http") || inc.volunteer.uploadedImages[0].startsWith("data:")) ? (
                              <img 
                                src={inc.volunteer.uploadedImages[0]} 
                                alt="Dalil" 
                                className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0 bg-slate-900"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg border border-white/5 bg-[#131D2E]/50 shrink-0 flex items-center justify-center text-xs text-gray-600">
                                🖼️
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm line-clamp-1">{inc.incident}</p>
                              <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded font-mono mt-1 inline-block">{inc.type || "Noma'lum"}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-300 font-semibold text-[11px] leading-tight">
                          <div>{inc.district}</div>
                          {inc.volunteer?.gpsLocation && (
                            <button
                              onClick={() => {
                                const coordsMatch = inc.volunteer?.gpsLocation?.match(/([\d.]+)\s*°\s*N,\s*([\d.]+)\s*°\s*E/);
                                if (coordsMatch) {
                                  const lat = parseFloat(coordsMatch[1]);
                                  const lng = parseFloat(coordsMatch[2]);
                                  setFocusedCoords([lng, lat]);
                                }
                                setFocusedDistrict(inc.district);
                                if (setActiveTab) {
                                  setActiveTab("gis-intelligence");
                                }
                              }}
                              className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1 font-mono font-medium hover:underline cursor-pointer"
                              title="Xaritada ko'rsatish"
                            >
                              <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                              <span className="truncate max-w-[120px]">{inc.volunteer.gpsLocation.split(" (")[0]}</span>
                            </button>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border max-w-fit ${getSeverityStyle(inc.riskLevel)}`}>
                              {inc.riskLevel}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">Score: {inc.riskScore || 50}/100</span>
                          </div>
                        </td>
                        <td className="p-4">
                           <div className="flex flex-col">
                              <span className="font-semibold text-gray-300 text-[11px]">{inc.reporterName || "Kiber Gvardiya"}</span>
                              <span className="text-[9px] text-gray-500 font-mono">{inc.reporterId || ""}</span>
                           </div>
                        </td>
                        <td className="p-4">
                          <select
                            value={inc.inspector || "Biriktirilmagan"}
                            onChange={(e) => {
                              const updated = { ...inc, inspector: e.target.value };
                              saveIncidentToDb(updated);
                            }}
                            className="bg-[#131D2E] border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white outline-none focus:border-blue-500 cursor-pointer w-full max-w-[140px] font-mono"
                          >
                            <option value="Biriktirilmagan">-- Biriktirilmagan --</option>
                            {inspectors.map((ins, idx) => (
                              <option key={idx} value={ins.name}>{ins.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <select
                            value={inc.status}
                            onChange={(e) => {
                              const updated = { ...inc, status: e.target.value as any };
                              saveIncidentToDb(updated);
                            }}
                            className={`border rounded-lg px-2 py-1.5 text-[11px] font-semibold outline-none focus:border-blue-500 cursor-pointer w-full max-w-[130px] ${
                              inc.status === "Blocked" ? "bg-red-950/40 text-red-400 border-red-500/30" :
                              inc.status === "Resolved" ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" :
                              inc.status === "Investigating" ? "bg-blue-950/40 text-blue-400 border-blue-500/30" :
                              inc.status === "Evidence Uploaded" ? "bg-purple-950/40 text-purple-400 border-purple-500/30" :
                              inc.status === "Accepted" ? "bg-sky-950/40 text-sky-400 border-sky-500/30" :
                              inc.status === "Assigned" ? "bg-amber-950/40 text-amber-400 border-amber-500/30" :
                              "bg-zinc-950/40 text-zinc-400 border-zinc-500/30"
                            }`}
                          >
                            <option value="NEW">🆕 YANGI (NEW)</option>
                            <option value="Assigned">📋 Assigned</option>
                            <option value="Accepted">📥 Accepted</option>
                            <option value="Investigating">🔍 Investigating</option>
                            <option value="Evidence Uploaded">📸 Evidence</option>
                            <option value="Resolved">✅ Resolved</option>
                            <option value="Blocked">🚫 Blocked</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center items-center gap-1.5">
                            <button 
                              onClick={() => setSelectedCase(inc)}
                              className="p-1.5 rounded bg-blue-500/5 hover:bg-blue-500/20 text-blue-400 transition-all cursor-pointer border border-blue-500/10"
                              title="Tekshirish"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => {
                                setIncidentToDelete(inc.id);
                              }}
                              className="p-1.5 rounded bg-red-500/5 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer border border-red-500/10"
                              title="O'chirish"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {incidentToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-[#131D2E] border border-red-500/30 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white font-display">Incidentni o'chirish</h3>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  Haqiqatdan ham ushbu <span className="font-mono text-blue-400 font-bold">{incidentToDelete}</span> incidentini jurnaldan butunlay o'chirib tashlamoqchimisiz? Ushbu amalni ortga qaytarib bo'lmaydi.
                </p>
              </div>
              <div className="flex gap-3 w-full pt-2">
                <button
                  onClick={() => setIncidentToDelete(null)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 font-bold py-2.5 rounded-xl text-xs transition-all border border-white/5 cursor-pointer"
                >
                  Yo'q, qolsin
                </button>
                <button
                  onClick={() => {
                    deleteIncidentFromDb(incidentToDelete);
                    if (selectedCase && selectedCase.id === incidentToDelete) {
                      setSelectedCase(null);
                    }
                    setIncidentToDelete(null);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer shadow-lg shadow-red-600/20"
                >
                  Ha, o'chirilsin
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedCase && activeTab === "incident-management" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#131D2E] border border-white/10 rounded-3xl p-6 w-full max-w-4xl shadow-2xl mt-10 md:mt-0 relative max-h-[92vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setSelectedCase(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-all cursor-pointer"
            >
              ✕
            </button>
            
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-blue-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-ping" />
                    {selectedCase.id} / TIZIMLI TERGOV JURNALI
                  </span>
                  <h2 className="text-lg font-bold text-white leading-tight">{selectedCase.incident}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    selectedCase.status === "Blocked" ? "bg-red-950/40 text-red-400 border-red-500/20" :
                    selectedCase.status === "Resolved" ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20" :
                    selectedCase.status === "Investigating" ? "bg-blue-950/40 text-blue-400 border-blue-500/20" :
                    selectedCase.status === "Evidence Uploaded" ? "bg-purple-950/40 text-purple-400 border-purple-500/20" :
                    selectedCase.status === "Accepted" ? "bg-sky-950/40 text-sky-400 border-sky-500/20" :
                    selectedCase.status === "Assigned" ? "bg-amber-950/40 text-amber-400 border-amber-500/20" :
                    "bg-zinc-950/40 text-zinc-400 border-zinc-500/20"
                  }`}>
                    HOLAT: {selectedCase.status}
                  </span>
                </div>
              </div>

              {/* Grid: Details & Map Coordinate link */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-left">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-1">
                  <span className="text-gray-500 font-mono block">HUDUDIY SHTAB JOYLANUVI:</span>
                  <span className="text-white font-bold text-sm block mt-1">{selectedCase.district}</span>
                </div>
                
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 space-y-1">
                  <span className="text-gray-500 font-mono block">AI XAVF BAHOLANISHI:</span>
                  <span className="text-white font-bold text-sm block mt-1 uppercase">
                    Score: {selectedCase.riskScore || 50}/100 ({selectedCase.riskLevel})
                  </span>
                </div>

                {/* Coordinates & GIS Map link */}
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-gray-500 font-mono block flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-red-400" /> GPS KOORDINATA:
                    </span>
                    <span className="text-white font-mono font-bold block mt-1">
                      {selectedCase.volunteer?.gpsLocation ? selectedCase.volunteer.gpsLocation.split(" (")[0] : "Aniqlanmagan"}
                    </span>
                  </div>
                  {selectedCase.volunteer?.gpsLocation && (
                    <button
                      onClick={() => {
                        const coordsMatch = selectedCase.volunteer?.gpsLocation?.match(/([\d.]+)\s*°\s*N,\s*([\d.]+)\s*°\s*E/);
                        if (coordsMatch) {
                          const lat = parseFloat(coordsMatch[1]);
                          const lng = parseFloat(coordsMatch[2]);
                          setFocusedCoords([lng, lat]);
                        }
                        setFocusedDistrict(selectedCase.district);
                        setSelectedCase(null);
                        if (setActiveTab) {
                          setActiveTab("gis-intelligence");
                        }
                      }}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 mt-2 hover:underline cursor-pointer self-start"
                    >
                      <Navigation className="w-3 h-3" /> GIS Xaritada ko'rsatish
                    </button>
                  )}
                </div>
              </div>

              {/* Description Summary */}
              <div className="space-y-2 text-left">
                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" /> Kiber-Shtab Tergov Xulosasi (AI):
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed font-light bg-black/25 p-4 rounded-xl border border-white/5">
                  {selectedCase.description || "Ushbu holat bo'yicha qo'shimcha tahlil ma'lumotlari hozircha kiritilmagan."}
                </p>
              </div>

              {/* Evidence Images Gallery ("Rasmlari") */}
              {selectedCase.volunteer?.uploadedImages && selectedCase.volunteer.uploadedImages.length > 0 && (
                <div className="space-y-2 text-left">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                    🖼️ Yuborilgan Dalil Rasmlari (Uploaded Evidence Images):
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedCase.volunteer.uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video flex items-center justify-center">
                        {(img.startsWith("http") || img.startsWith("data:")) ? (
                          <>
                            <img 
                              src={img} 
                              alt={`Evidence ${idx + 1}`} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <a 
                              href={img} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-[10px] text-white font-mono gap-1"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> To'liq o'lchamda ↗
                            </a>
                          </>
                        ) : (
                           <div className="text-gray-500 text-[10px] font-mono px-2 text-center">Telegram File ID:<br/>{img.substring(0, 15)}...</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bot Submission Info */}
              <div className="bg-[#1D2B44]/30 border border-white/5 p-4 rounded-2xl space-y-3 text-left">
                <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                  🤖 Telegram Bot: Volontyor Murojaati va Dalillari
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-gray-500 font-mono text-[10px]">TELEGRAM YUBORUVCHI:</span>
                    <span className="text-blue-300 font-bold block">{selectedCase.reporterName || "Kiber Gvardiya"}</span>
                    <span className="text-[10px] text-gray-500 block font-mono">ID: {selectedCase.reporterId || "Noma'lum"}</span>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-gray-500 font-mono text-[10px]">MUROJAAT VAQTI:</span>
                    <span className="text-white font-bold block">{selectedCase.time || "-"} ({selectedCase.date})</span>
                  </div>
                </div>

                {selectedCase.volunteer?.submittedText && (
                  <div className="mt-2 bg-black/20 p-3 rounded-xl border border-white/5 text-xs">
                    <span className="text-gray-500 font-mono text-[10px] block mb-1">MUKOFAOTLANUVCHI VOLONTYOR MATNI:</span>
                    <p className="text-gray-300 font-light italic">"{selectedCase.volunteer.submittedText}"</p>
                  </div>
                )}
              </div>

              {/* Redesigned Administrator Assignment & Process Control Panel */}
              <div className="bg-[#131D2E]/60 border border-white/10 rounded-2xl p-5 space-y-4 text-left">
                <h3 className="font-bold text-sm text-blue-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
                  🛠️ Administrator Nazorat va Biriktirish Paneli
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Select Inspector */}
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-mono text-[11px] block">👮 TEZKOR INSPIKTORGA BIRIKTIRISH:</label>
                    <select
                      value={selectedCase.inspector || "Biriktirilmagan"}
                      onChange={(e) => {
                        const updated = { ...selectedCase, inspector: e.target.value };
                        setSelectedCase(updated);
                        saveIncidentToDb(updated);
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Biriktirilmagan">-- Biriktirilmagan --</option>
                      {inspectors.map((ins, idx) => (
                        <option key={idx} value={ins.name}>{ins.name} ({ins.district})</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Process Status */}
                  <div className="space-y-1.5">
                    <label className="text-gray-400 font-mono text-[11px] block">🔄 JARAYON BOSQICHINI O'ZGARTIRISH:</label>
                    <select
                      value={selectedCase.status}
                      onChange={(e) => {
                        const updated = { ...selectedCase, status: e.target.value as any };
                        setSelectedCase(updated);
                        saveIncidentToDb(updated);
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer font-semibold"
                    >
                      <option value="NEW">🆕 YANGI (NEW)</option>
                      <option value="Assigned">📋 BIRIKTIRILDI (Assigned)</option>
                      <option value="Accepted">📥 QABUL QILINDI (Accepted)</option>
                      <option value="Investigating">🔍 TERGOV KETMOQDA (Investigating)</option>
                      <option value="Evidence Uploaded">📸 DALIL YUKLANDI (Evidence Uploaded)</option>
                      <option value="Resolved">✅ TO'LIQ HAL ETILDI (Resolved)</option>
                      <option value="Blocked">🚫 BLOKLANDI (Blocked)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => {
                      const updated = { ...selectedCase, status: "Blocked" as const };
                      setSelectedCase(updated);
                      saveIncidentToDb(updated);
                      alert("Incident holati 'Blocked' rejimiga o'zgartirildi!");
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    🚫 IP/Domen/Kanalni Bloklash
                  </button>
                  <button 
                    onClick={() => {
                      const updated = { ...selectedCase, status: "Resolved" as const };
                      setSelectedCase(updated);
                      saveIncidentToDb(updated);
                      alert("Incident muvaffaqiyatli 'Resolved' qilib hal etildi!");
                    }}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    ✔️ Holatni To'liq Hal Etish
                  </button>
                  <button 
                    onClick={() => {
                      setIncidentToDelete(selectedCase.id);
                    }}
                    className="bg-black/40 hover:bg-red-600/20 text-red-400 border border-red-500/20 hover:border-red-500/40 px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5"
                    title="Jurnaldan o'chirish"
                  >
                    <Trash2 className="w-4 h-4" /> O'chirish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. GIS INTELLIGENCE MAP PAGE */}
      {activeTab === "gis-intelligence" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Hududiy GIS Tahliliy Xaritasi</h1>
            <p className="text-xs text-gray-400 font-mono">Sirdaryo viloyati bo'yicha integratsiyalashgan kiber-risk poligonlari va faol hodisalar</p>
          </div>

          <div className="h-[680px] rounded-3xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl relative">
            <AIOCMap height="100%" layerType="heatmap" focusedDistrict={focusedDistrict} focusedCoords={focusedCoords} liveIncidents={incidents} />
          </div>
        </div>
      )}

      {/* 5. INSPECTOR MANAGEMENT PAGE */}
      {activeTab === "inspector-management" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-bold font-display">Kiber-Inspektorlarni Boshqarish</h1>
              <p className="text-xs text-gray-400">Navbatchilik guruhidagi kiber-inspektorlar va tumanlar bo'yicha yuklamalar monitoringi</p>
            </div>

            <button 
              onClick={() => setIsAddingInspector(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>Yangi Inspektor</span>
            </button>
          </div>

          {/* Add / Edit Inspector Forms (Conditional Modal-style inside page) */}
          <div className="flex flex-wrap gap-4">
            <AnimatePresence>
              {isAddingInspector && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#131D2E]/90 border border-white/10 p-6 rounded-3xl space-y-4 max-w-md flex-1 min-w-[300px]"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="font-bold text-sm">Yangi Inspektor Qo'shish</h3>
                    <button onClick={() => setIsAddingInspector(false)} className="text-gray-400 hover:text-white">&times;</button>
                  </div>
                  <form onSubmit={handleCreateInspector} className="space-y-3 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-medium">To'liq ismi (FISH)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Masalan: Kpt. Safarov M." 
                        value={newInspector.name}
                        onChange={(e) => setNewInspector({ ...newInspector, name: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-medium">Login</label>
                      <input 
                        type="text" 
                        required
                        placeholder="inspector_login" 
                        value={newInspector.email}
                        onChange={(e) => setNewInspector({ ...newInspector, email: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-medium">Parol (Maxfiy Kalit)</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        value={newInspector.password || ""}
                        onChange={(e) => setNewInspector({ ...newInspector, password: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-medium">Assigned Tuman / Hudud</label>
                      <select 
                        value={newInspector.district}
                        onChange={(e) => setNewInspector({ ...newInspector, district: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                      >
                        <option>Guliston Shahri</option>
                        <option>Sirdaryo Tumani</option>
                        <option>Yangiyer Shahri</option>
                        <option>Boyovut Tumani</option>
                        <option>Xovos Tumani</option>
                        <option>Shirin Shahri</option>
                      </select>
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-all">
                        Saqlash
                      </button>
                      <button type="button" onClick={() => setIsAddingInspector(false)} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-all border border-white/10">
                        Bekor qilish
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {editingInspector && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#131D2E]/90 border border-amber-500/20 p-6 rounded-3xl space-y-4 max-w-md flex-1 min-w-[300px]"
                >
                  <div className="flex justify-between items-center border-b border-white/5 pb-2">
                    <h3 className="font-bold text-sm text-amber-400">Inspektor Ma'lumotlarini Tahrirlash</h3>
                    <button onClick={() => setEditingInspector(null)} className="text-gray-400 hover:text-white">&times;</button>
                  </div>
                  <form onSubmit={handleUpdateInspector} className="space-y-3 text-xs font-sans">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-medium">To'liq ismi (FISH)</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Masalan: Kpt. Safarov M." 
                        value={editingInspector.name}
                        onChange={(e) => setEditingInspector({ ...editingInspector, name: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-medium">Login</label>
                      <input 
                        type="text" 
                        required
                        placeholder="inspector_login" 
                        value={editingInspector.email}
                        onChange={(e) => setEditingInspector({ ...editingInspector, email: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-400 font-medium">Parol (Maxfiy Kalit)</label>
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••" 
                        value={editingInspector.password || ""}
                        onChange={(e) => setEditingInspector({ ...editingInspector, password: e.target.value })}
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-medium">Assigned Tuman / Hudud</label>
                        <select 
                          value={editingInspector.district}
                          onChange={(e) => setEditingInspector({ ...editingInspector, district: e.target.value })}
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option>Guliston Shahri</option>
                          <option>Sirdaryo Tumani</option>
                          <option>Yangiyer Shahri</option>
                          <option>Boyovut Tumani</option>
                          <option>Xovos Tumani</option>
                          <option>Shirin Shahri</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-medium">Status</label>
                        <select 
                          value={editingInspector.status}
                          onChange={(e) => setEditingInspector({ ...editingInspector, status: e.target.value })}
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 cursor-pointer"
                        >
                          <option>ONLINE</option>
                          <option>OFFLINE</option>
                          <option>KUZATUVDA</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <label className="text-gray-400 font-medium">Bajarilgan</label>
                        <input 
                          type="number" 
                          value={editingInspector.solved}
                          onChange={(e) => setEditingInspector({ ...editingInspector, solved: parseInt(e.target.value) || 0 })}
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-medium">Faol</label>
                        <input 
                          type="number" 
                          value={editingInspector.active}
                          onChange={(e) => setEditingInspector({ ...editingInspector, active: parseInt(e.target.value) || 0 })}
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-gray-400 font-medium">Javob Vaqti</label>
                        <input 
                          type="text" 
                          value={editingInspector.responseTime}
                          onChange={(e) => setEditingInspector({ ...editingInspector, responseTime: e.target.value })}
                          className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-all">
                        Saqlash
                      </button>
                      <button type="button" onClick={() => setEditingInspector(null)} className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-bold cursor-pointer transition-all border border-white/10">
                        Bekor qilish
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {inspectorToDelete && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#1C161B]/95 border border-red-500/30 p-6 rounded-3xl space-y-4 max-w-md flex-1 min-w-[300px]"
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-2 text-red-400">
                    <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                    <h3 className="font-bold text-sm">O'chirishni tasdiqlang</h3>
                  </div>
                  <div className="text-xs text-gray-300 space-y-2">
                    <p>
                      Haqiqatan ham <span className="text-white font-bold">{inspectorToDelete.name}</span> kiber-inspektorini ma'lumotlar bazasidan butunlay o'chirib tashlamoqchimisiz?
                    </p>
                    <p className="text-[10px] text-red-400/80">
                      Ushbu amal qaytarib bo'lmas hisoblanadi va ushbu inspektorning barcha ma'lumotlari tizimdan butunlay o'chiriladi.
                    </p>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button 
                      onClick={handleDeleteInspectorConfirm} 
                      className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Ha, o'chirilsin</span>
                    </button>
                    <button 
                      onClick={() => setInspectorToDelete(null)} 
                      className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl font-bold text-xs cursor-pointer transition-all border border-white/10"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Inspectors roster table */}
          <div className="bg-[#131D2E]/30 border border-white/5 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 font-mono">
                    <th className="p-4 w-28">ID</th>
                    <th className="p-4">Kiber-Inspektor Ismi</th>
                    <th className="p-4 w-44">Tuman / Hudud</th>
                    <th className="p-4 w-32">Status</th>
                    <th className="p-4 w-28 text-center">Bajarilgan</th>
                    <th className="p-4 w-28 text-center">Faol</th>
                    <th className="p-4 w-32 text-center">Javob Vaqti</th>
                    <th className="p-4 text-center w-28">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {inspectors.map((ins) => (
                    <tr key={ins.id} className="hover:bg-white/5 transition-all">
                      <td className="p-4 font-mono font-bold text-indigo-400">{ins.id}</td>
                      <td className="p-4 text-white font-medium flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-indigo-400" />
                        <span>{ins.name}</span>
                      </td>
                      <td className="p-4 text-slate-300 font-semibold">{ins.district}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                          ins.status === "ONLINE" ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20" : "text-gray-400 bg-white/5 border border-white/10"
                        }`}>
                          {ins.status}
                        </span>
                      </td>
                      <td className="p-4 text-center font-bold font-mono text-emerald-400">{ins.solved} ta</td>
                      <td className="p-4 text-center font-bold font-mono text-amber-400">{ins.active} ta</td>
                      <td className="p-4 text-center font-mono text-gray-300">{ins.responseTime}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-1.5">
                          <button 
                            onClick={() => {
                              setEditingInspector(ins);
                            }}
                            className="p-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-all cursor-pointer border border-blue-500/15"
                            title="Tahrirlash"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteInspector(ins)}
                            className="p-1.5 rounded bg-red-500/5 hover:bg-red-500/20 text-red-400 transition-all cursor-pointer border border-red-500/15"
                            title="O'chirish"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 6. VOLUNTEER MANAGEMENT PAGE */}
      {activeTab === "volunteer-management" && (
        <div className="space-y-6 text-left animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-bold font-display flex items-center gap-2 text-white">
                🤖 Telegram Botdan Ro'yxatdan O'tganlar
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Bot orqali PostgreSQL bazasiga qo'shilgan va profilni shakllantirgan barcha foydalanuvchilar ma'lumotlari
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#131D2E]/80 border border-white/5 px-3 py-2 rounded-xl text-[10px] font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-gray-300">
                  POSTGRESQL SYNC
                </span>
              </div>
            </div>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Foydalanuvchi ismini qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>

          {/* Table list */}
          <div className="bg-[#131D2E]/30 border border-white/5 rounded-2xl overflow-hidden mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs font-sans">
                <thead>
                  <tr className="border-b border-white/5 text-gray-400 font-mono">
                    <th className="p-4 w-32">Foydalanuvchi ID</th>
                    <th className="p-4">Foydalanuvchi / Username</th>
                    <th className="p-4 w-40 text-center">Telefon Raqami</th>
                    <th className="p-4 w-48 text-center">Hudud / Manzil</th>
                    <th className="p-4 w-24 text-center">Murojaatlar</th>
                    <th className="p-4 w-32 text-center">Ro'yxatdan o'tgan</th>
                    <th className="p-4 text-center w-32">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registeredBotUsers
                    .filter(v => (v.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || (v.username || "").toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((user) => {
                      return (
                        <tr key={user.id || user.userId} className={`hover:bg-white/5 transition-all`}>
                          <td className="p-4 font-mono font-bold text-teal-400">{user.userId || "Kutilmoqda..."}</td>
                          
                          {/* Name / User details */}
                          <td className="p-4 text-white font-medium">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold">
                                {(user.fullName || "?")[0].toUpperCase()}
                              </div>
                              <div className="leading-tight">
                                <p className="font-semibold text-white">{user.fullName || "Ism kiritilmagan"}</p>
                                <span className="text-[10px] text-gray-500 font-mono">@{user.username || "username_yo'q"}</span>
                              </div>
                            </div>
                          </td>

                          {/* Phone */}
                          <td className="p-4 text-center">
                            <span className="font-mono text-gray-300">{user.phone || "-"}</span>
                          </td>

                          {/* Location */}
                          <td className="p-4 text-center">
                            <div className="leading-tight">
                              <p className="text-xs text-white/90">{user.region || "-"}</p>
                              <span className="text-[10px] text-gray-500">{user.district || "-"} • {user.mahalla || "-"}</span>
                            </div>
                          </td>

                          {/* Reports count */}
                          <td className="p-4 text-center">
                            <span className="font-bold font-mono text-amber-400">
                              {user.reportsSubmitted || 0}
                            </span>
                          </td>

                          {/* Created at */}
                          <td className="p-4 text-center font-medium text-slate-300">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                          </td>

                          {/* Status */}
                          <td className="p-4 text-center">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                              user.status === "REGISTERED" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
                            }`}>
                              {user.status || "PENDING"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. TELEGRAM INTELLIGENCE PAGE */}
      {activeTab === "telegram-intelligence" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Telegram Kiber-Razvedka Moduli</h1>
            <p className="text-xs text-gray-400">Telegram kanallari, botlar, firibgarlik dasturlari va AI dekonstruksiyalari</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#131D2E]/40 border border-white/5 rounded-2xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm">Telegram Noqonuniy Kanal/Bot Skanerlari</h3>
                <span className="text-[10px] font-mono text-blue-400">Jami: {tgChannels.length} ta</span>
              </div>
              <div className="space-y-3">
                {tgChannels.map((tg, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/20 p-3.5 rounded-xl border border-white/5 text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono text-white/95 font-semibold">{tg.name}</span>
                      <span className="text-gray-500 block text-[10px]">Turi: {tg.type} | Risk: {tg.score}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTgChannels(prev => prev.map((item, idx) => idx === i ? { ...item, action: item.action === "BLOKLANGAN" ? "KUZATUVDA" : "BLOKLANGAN" } : item));
                          addAuditLog("ADMIN", `Telegram ${tg.name} statusi o'zgartirildi`);
                        }}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-gray-400 text-[10px] transition-all cursor-pointer"
                      >
                        Status 🔄
                      </button>
                      <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold ${
                        tg.action === "BLOKLANGAN" ? "text-red-400 bg-red-500/10 border-red-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      }`}>
                        {tg.action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {/* Active Scanner Terminal Form */}
              <div className="bg-[#131D2E]/40 border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-sm border-b border-white/5 pb-2">Tezkor Skanerlash va Tahlil (Bot/Kanal)</h3>
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-400 block">Telegram Handle (Masalan: @oson_pul)</label>
                    <input
                      type="text"
                      placeholder="@handle"
                      value={newTelegramHandle}
                      onChange={(e) => setNewTelegramHandle(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 block">Manba Turi</label>
                    <select
                      value={newTelegramType}
                      onChange={(e) => setNewTelegramType(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Kanal">Kanal</option>
                      <option value="Guruh">Guruh</option>
                      <option value="Bot">Bot</option>
                    </select>
                  </div>

                  {isScanningTelegram ? (
                    <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-xl space-y-2 text-[11px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                        <span className="text-blue-300 font-bold">FAOL SCAN:</span>
                      </div>
                      <p className="text-gray-300">{telegramScanStatus}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!newTelegramHandle) {
                          alert("Telegram handle kiritilishi shart!");
                          return;
                        }
                        setIsScanningTelegram(true);
                        setTelegramScanStatus("🔍 Tarmoqqa ulanish o'rnatilmoqda...");
                        
                        setTimeout(() => {
                          setTelegramScanStatus("📊 So'nggi 40 ta post yuklandi va visual tahlil o'tkazilmoqda...");
                        }, 1000);

                        setTimeout(() => {
                          setTelegramScanStatus("✨ Gemini AI kiber-audit dekonstruksiyasi amalga oshirilmoqda...");
                        }, 2000);

                        setTimeout(() => {
                          const scoreNum = Math.floor(75 + Math.random() * 24);
                          const isCritical = scoreNum > 90;
                          const newTg = {
                            name: newTelegramHandle.startsWith("@") ? newTelegramHandle : "@" + newTelegramHandle,
                            type: newTelegramType,
                            score: `${scoreNum}% (${isCritical ? "Kritik" : "Yuqori"})`,
                            action: isCritical ? "BLOKLANGAN" : "KUZATUVDA"
                          };
                          setTgChannels(prev => [...prev, newTg]);
                          addAuditLog("ADMIN", `Telegram razvedka skanerlandi: ${newTg.name} (${newTg.score})`);
                          setIsScanningTelegram(false);
                          setNewTelegramHandle("");
                          alert(`Telegram razvedka muvaffaqiyatli yakunlandi!\nKanal: ${newTg.name}\nRisk darajasi: ${newTg.score}`);
                        }, 3000);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                    >
                      🤖 Skanerlash va AI Tahlilni Boshlash
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#131D2E]/40 border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="font-bold text-sm border-b border-white/5 pb-2">AI Kalit So'zlar Buluti (Keywords)</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {["dori", "psixotrop", "click aksiya", "kompensatsiya", "pul yutuq", "karta", "kod", "massa", "reklama", "click verify", "uzcard bonus"].map((kw, idx) => (
                    <span key={idx} className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-xl text-blue-400 font-mono">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. WEBSITE INTELLIGENCE PAGE */}
      {activeTab === "website-intelligence" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Veb-Sayt Kiber-Razvedka Moduli</h1>
            <p className="text-xs text-gray-400">Fishing domenlari, IP manzillar tahlili, milliy provayderlar va xosting bloklash jarayonlari</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm">Skan qilingan fishing domenlar</h3>
                <span className="text-[10px] font-mono text-blue-400">Jami: {webDomains.length} ta</span>
              </div>
              <div className="space-y-3">
                {webDomains.map((site, i) => (
                  <div key={i} className="bg-black/20 p-3.5 rounded-xl border border-white/5 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-white/95 font-semibold truncate max-w-[200px]">{site.domain}</span>
                      <div className="flex items-center gap-2">
                        <select
                          value={site.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            setWebDomains(prev => prev.map((item, idx) => idx === i ? { ...item, status: newStatus } : item));
                            addAuditLog("ADMIN", `Veb-sayt ${site.domain} statusi o'zgartirildi: ${newStatus}`);
                          }}
                          className="bg-black/30 border border-white/10 rounded px-1.5 py-0.5 text-[10px] text-gray-300 cursor-pointer"
                        >
                          <option value="BLOKLANGAN">BLOKLANGAN</option>
                          <option value="HOSTING BLOCKED">HOSTING BLOCKED</option>
                          <option value="KUZATUVDA">KUZATUVDA</option>
                          <option value="TUGATILGAN">TUGATILGAN</option>
                        </select>
                        <span className="text-[10px] font-mono text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">{site.status}</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      Server IP: {site.ip} | Risk: {site.score || "99%"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm border-b border-white/5 pb-2">Yangi Fishing Domenini Tekshirish</h3>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-400 block">Domen URL manzili (Masalan: https://payme-verify.cc)</label>
                  <input
                    type="text"
                    placeholder="https://"
                    value={newWebDomain}
                    onChange={(e) => setNewWebDomain(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>

                {isScanningDomain ? (
                  <div className="p-3 bg-blue-950/20 border border-blue-500/20 rounded-xl space-y-2 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping" />
                      <span className="text-blue-300 font-bold">FAOL SCAN:</span>
                    </div>
                    <p className="text-gray-300">{domainScanStatus}</p>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      if (!newWebDomain) {
                        alert("Domen manzili kiritilishi shart!");
                        return;
                      }
                      setIsScanningDomain(true);
                      setDomainScanStatus("🔍 DNS rekordlari va hosting tahlil qilinmoqda...");
                      
                      setTimeout(() => {
                        setDomainScanStatus("🌐 Server IP aniqlandi: 104.22.4." + Math.floor(Math.random() * 254));
                      }, 1000);

                      setTimeout(() => {
                        setDomainScanStatus("✨ Gemini AI vizual OCR brend va darcha klonini baholamoqda...");
                      }, 2000);

                      setTimeout(() => {
                        const newIp = "185.112." + Math.floor(Math.random() * 254) + "." + Math.floor(Math.random() * 254);
                        const newSite = {
                          domain: newWebDomain.startsWith("http") ? newWebDomain : "https://" + newWebDomain,
                          ip: newIp,
                          status: "BLOKLANGAN",
                          score: "98% (Kritik)"
                        };
                        setWebDomains(prev => [...prev, newSite]);
                        addAuditLog("ADMIN", `Domen razvedka skanlandi: ${newSite.domain}`);
                        setIsScanningDomain(false);
                        setNewWebDomain("");
                        alert(`Fishing domeni tahlil qilindi va avtomatik ravishda BLOKLANDI!\nDomen: ${newSite.domain}\nServer IP: ${newSite.ip}`);
                      }, 3000);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                  >
                    🔍 Domen kiber-auditini boshlash
                  </button>
                )}
              </div>

              <div className="border border-white/10 rounded-xl p-4 bg-black/40 text-xs text-gray-400 flex flex-col items-center justify-center text-center space-y-2 pt-4">
                <Globe className="w-6 h-6 text-blue-400 animate-pulse" />
                <h4 className="text-white font-bold text-xs">Veb-Interfeys klonining dekonstruksiyasi</h4>
                <p className="max-w-xs text-[11px] leading-relaxed">
                  Sun'iy intellekt yuklangan veb-sayt skrinshotidagi brend belgilari va plastik karta kirish darchalarini avtomat tarzda tahlil etadi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. APK INTELLIGENCE PAGE */}
      {activeTab === "apk-intelligence" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Zararli APK Skanerlash Laboratoriyasi</h1>
            <p className="text-xs text-gray-400">Android ilova paketlari (.apk) va ularda saqlangan SMS ruxsatnomalarini statik tahlili</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <h3 className="font-bold text-sm">Skanlangan troyan APK fayllari</h3>
                <span className="text-[10px] font-mono text-blue-400">Jami: {apkFiles.length} ta</span>
              </div>
              <div className="space-y-3">
                {apkFiles.map((apk, i) => (
                  <div key={i} className="bg-black/20 p-3.5 rounded-xl border border-white/5 text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-white/95 font-semibold truncate max-w-[200px]">{apk.name}</span>
                      <span className="text-[10px] font-mono text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">{apk.risk}</span>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono">
                      Paket: {apk.package} | Malware: {apk.malware || "SMS Trojan Spy.Agent"}
                    </div>
                    <div className="flex flex-wrap gap-1 pt-1.5">
                      {apk.permissions && apk.permissions.map((perm, pIdx) => (
                        <span key={pIdx} className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/10 px-1.5 py-0.5 rounded">
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
                <h3 className="font-bold text-sm border-b border-white/5 pb-2">Yangi APK Sandbox Tekshiruvi</h3>
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-400 block">APK Fayl Nomi (Masalan: ClickUz_Premium.apk)</label>
                    <input
                      type="text"
                      placeholder="Ilova_nomi.apk"
                      value={newApkName}
                      onChange={(e) => setNewApkName(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 block">Ilova Paketi (Masalan: com.premium.click)</label>
                    <input
                      type="text"
                      placeholder="com.package.name"
                      value={newApkPackage}
                      onChange={(e) => setNewApkPackage(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  {isScanningApk ? (
                    <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl space-y-2 text-[11px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-red-400 rounded-full animate-ping" />
                        <span className="text-red-300 font-bold">SANDBOX FAOL:</span>
                      </div>
                      <p className="text-gray-300">{apkScanStatus}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!newApkName || !newApkPackage) {
                          alert("APK nomi va paket manzili kiritilishi shart!");
                          return;
                        }
                        setIsScanningApk(true);
                        setApkScanStatus("🔍 APK dekompilyatsiya qilinmoqda va manba kodlari o'rganilmoqda...");
                        
                        setTimeout(() => {
                          setApkScanStatus("📊 AndroidManifest.xml tahlil etilmoqda... RECEIVE_SMS ruxsatnomasi fiksatsiya qilindi!");
                        }, 1000);

                        setTimeout(() => {
                          setApkScanStatus("✨ Gemini AI kiber-klassifikatsiya va exploit qidiruv tahlilini yakunlamoqda...");
                        }, 2000);

                        setTimeout(() => {
                          const newApk = {
                            name: newApkName.endsWith(".apk") ? newApkName : newApkName + ".apk",
                            package: newApkPackage,
                            risk: "95% (Kritik)",
                            malware: "Malware: Trojan-Spy.AndroidOS.Agent.b",
                            permissions: ["RECEIVE_SMS", "READ_PHONE_STATE", "INTERNET"]
                          };
                          setApkFiles(prev => [...prev, newApk]);
                          addAuditLog("ADMIN", `Zararli APK tahlil qilindi: ${newApk.name}`);
                          setIsScanningApk(false);
                          setNewApkName("");
                          setNewApkPackage("");
                          alert(`APK virusli deb topildi va sandbox tahlil tugatildi!\nIlova: ${newApk.name}\nMalware turi: ${newApk.malware}`);
                        }, 3000);
                      }}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl cursor-pointer transition-all"
                    >
                      🛡️ APK Sandbox tahlilini boshlash
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold border-b border-white/5 pb-1">Statik tahlil standartlari</h4>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex justify-between items-center bg-red-500/10 border border-red-500/20 p-2 rounded text-red-400">
                    <span>RECEIVE_SMS (SMS xabarlarni tutish)</span>
                    <span className="font-bold">CRITICAL</span>
                  </div>
                  <div className="flex justify-between items-center bg-red-500/10 border border-red-500/20 p-2 rounded text-red-400">
                    <span>READ_PHONE_STATE (Raqamni aniqlash)</span>
                    <span className="font-bold">CRITICAL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. EVIDENCE CENTER PAGE */}
      {activeTab === "evidence-center" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Kiber-Dalillar Ombori (Forensics)</h1>
            <p className="text-xs text-gray-400">Yuklangan barcha rasmlar, audio yozuvlar va OCR tahlillar arxivi</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidents.map((inc) => (
              <div key={inc.id} className="bg-[#131D2E]/40 border border-white/8 rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-blue-400 font-bold text-xs">{inc.id}</span>
                  <span className="text-[10px] text-gray-500 font-mono">{inc.time}</span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl h-36 flex items-center justify-center text-gray-500 text-xs font-mono">
                  [ KIBER_DALIL_SKRINSHOT_OCR ]
                </div>
                <p className="text-xs font-bold text-white/95 line-clamp-1">{inc.incident}</p>
                <div className="border-t border-white/5 pt-2 flex justify-between text-[10px] font-mono">
                  <span className="text-gray-400">O'QILGAN MATN:</span>
                  <span className="text-emerald-400 font-bold">100% ANALYZED</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. KIBER TERGOV MARKAZI */}
      {activeTab === "case-investigation" && (
        <div className="space-y-6 text-left animate-fade-in">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-bold font-display flex items-center gap-2 text-white">
                <span className="p-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">🛡️</span>
                Kiber Tergov Markazi
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Kiber-tahdidlar bo'yicha tezkor tergovlar, volontyorlarga bot orqali topshiriqlar yuborish va GPS xaritasi.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-[#131D2E]/80 border border-white/5 px-3 py-1.5 rounded-xl text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isFirebaseConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400 animate-pulse"}`} />
              <span className="text-gray-300">
                {isFirebaseConfigured ? "FIRESTORE ONLINE" : "LOCAL STORAGE"}
              </span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#131D2E]/30 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Jami Topshiriqlar</span>
              <span className="text-xl font-bold text-white block mt-1">{blockTasks.length} ta</span>
            </div>
            <div className="bg-[#131D2E]/30 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Volontyorlar</span>
              <span className="text-xl font-bold text-blue-400 block mt-1">{volunteers.length} nafar</span>
            </div>
            <div className="bg-[#131D2E]/30 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Tarqatilgan SafeCoins</span>
              <span className="text-xl font-bold text-amber-400 block mt-1">
                {volunteers.reduce((acc, v) => acc + (v.points || 0), 0)} Coin
              </span>
            </div>
            <div className="bg-[#131D2E]/30 border border-white/5 p-4 rounded-2xl">
              <span className="text-[10px] text-gray-500 uppercase font-mono block">Muvaffaqiyatli Bloklar</span>
              <span className="text-xl font-bold text-emerald-400 block mt-1">
                {volunteers.reduce((acc, v) => acc + (v.reports || 0), 0)} ta
              </span>
            </div>
          </div>

          {/* Main 2-Column Balanced Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* COLUMN 1: Topshiriqlar va Bot Integratsiyasi */}
            <div className="bg-[#131D2E]/40 border border-white/5 p-5 rounded-3xl space-y-4">
              <div className="border-b border-white/5 pb-2 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-blue-400 flex items-center gap-1.5">
                    <Send className="w-4 h-4" /> Kiber-Topshiriq Yaratish
                  </h3>
                  <p className="text-[11px] text-gray-400">Volontyorlar uchun botga yangi topshiriq va mukofot belgilash</p>
                </div>
                <button
                  onClick={() => setShowTgConfig(!showTgConfig)}
                  className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 px-2 py-1 rounded-xl transition-all font-mono"
                >
                  {showTgConfig ? "⚙️ Sozlamalarni yopish" : "⚙️ Bot sozlamalari"}
                </button>
              </div>

              {/* Collapsible Bot Settings */}
              {showTgConfig && (
                <div className="bg-[#17212b]/90 border border-blue-500/25 p-4 rounded-2xl space-y-3 text-xs text-left animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                    <span className="font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                      🤖 Bot Integratsiyasi Sozlamalari
                    </span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <label className="text-gray-400 block text-[10px]">Telegram Bot Token (HTTP API):</label>
                      <input
                        type="password"
                        placeholder="Bot tokenini kiriting..."
                        value={tgBotToken}
                        onChange={(e) => {
                          setTgBotToken(e.target.value);
                          localStorage.setItem("safeuz_tg_bot_token", e.target.value);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-blue-500 font-mono text-[10px]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 block text-[10px]">Telegram Chat/Kanal ID:</label>
                      <input
                        type="text"
                        placeholder="Masalan: @safeuz_kiber_gvardiya yoki -100..."
                        value={tgChatId}
                        onChange={(e) => {
                          setTgChatId(e.target.value);
                          localStorage.setItem("safeuz_tg_chat_id", e.target.value);
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-white outline-none focus:border-blue-500 font-mono text-[10px]"
                      />
                    </div>

                    <button
                      onClick={testTelegramConnection}
                      disabled={isTestingTgConnection}
                      className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 py-1.5 rounded-lg text-[10px] font-semibold cursor-pointer transition-all flex items-center justify-center gap-1"
                    >
                      {isTestingTgConnection ? "🔄 Tekshirilmoqda..." : "🔌 Bot Ulanishini Tekshirish"}
                    </button>

                    {tgConnectionStatus && (
                      <div className="p-2 bg-black/30 rounded-lg font-mono text-[10px] text-gray-300 leading-tight">
                        {tgConnectionStatus}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Select from Incidents */}
              <div className="space-y-1 text-xs">
                <label className="text-gray-400 block font-medium">Xavf jurnaldan tezkor tanlash (ixtiyoriy):</label>
                <select 
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const found = incidents.find(inc => inc.id === selectedId);
                    if (found) {
                      setNewBroadcastTitle(found.incident);
                      setNewBroadcastTarget(found.source || "");
                      setNewBroadcastMessage(`Diqqat barcha volontyorlar! Ushbu "${found.incident}" xavfini aniqladik. Iltimos quyidagi silkaga/botga o'tib kiber-audit va block so'rovini yuboring. Katta rahmat!`);
                    }
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-gray-300 outline-none focus:border-blue-500"
                >
                  <option value="">-- Jurnaldan tanlash --</option>
                  {incidents.map(inc => (
                    <option key={inc.id} value={inc.id}>{inc.id} - {inc.incident.substring(0, 40)}...</option>
                  ))}
                </select>
              </div>

              {/* Form Input fields */}
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-400 block font-medium">Tahdid nomi:</label>
                  <input
                    type="text"
                    placeholder="Masalan: Soxta Click aksiyasi firibgarligi"
                    value={newBroadcastTitle}
                    onChange={(e) => setNewBroadcastTitle(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-400 block font-medium">Manba (Kanal/Bot handle):</label>
                    <input
                      type="text"
                      placeholder="@kanal_nomi yoki URL"
                      value={newBroadcastTarget}
                      onChange={(e) => setNewBroadcastTarget(e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-mono text-[11px]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 block font-medium">Turi:</label>
                    <select
                      value={newBroadcastType}
                      onChange={(e) => setNewBroadcastType(e.target.value)}
                      className="w-full bg-[#131D2E] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 cursor-pointer text-xs"
                    >
                      <option value="Bot">Bot 🤖</option>
                      <option value="Kanal">Kanal 📢</option>
                      <option value="Guruh">Guruh 👥</option>
                      <option value="Veb-sayt">Veb-sayt 🌐</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 block font-medium">Mukofot miqdori (SafeCoins):</label>
                  <input
                    type="number"
                    placeholder="Coins miqdori"
                    value={newBroadcastCoins}
                    onChange={(e) => setNewBroadcastCoins(Number(e.target.value))}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 block font-medium">Ko'rsatma va Yo'riqnoma:</label>
                  <textarea
                    rows={2}
                    placeholder="Bloklash bo'yicha ko'rsatmalarni kiriting..."
                    value={newBroadcastMessage}
                    onChange={(e) => setNewBroadcastMessage(e.target.value)}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500 text-xs resize-none"
                  />
                </div>

                <button
                  onClick={async () => {
                    if (!newBroadcastTitle || !newBroadcastTarget) {
                      showToast("Tahdid sarlavhasi va rekvizit manzili kiritilishi shart!", "error");
                      return;
                    }
                    
                    const taskId = "TSK-" + (100 + blockTasks.length + 1);
                    const taskObj = {
                      id: taskId,
                      title: newBroadcastTitle,
                      target: newBroadcastTarget,
                      type: newBroadcastType,
                      coins: Number(newBroadcastCoins),
                      message: newBroadcastMessage || "Ushbu xavfli manbani bloklang va xavfsizligimizga hissa qo'shing.",
                    };
                    
                    try {
                      // 1. Create the task persistently in state and localStorage
                      await createBlockTask(newBroadcastTitle, newBroadcastTarget, newBroadcastType, newBroadcastCoins, newBroadcastMessage);
                      showToast(`"${newBroadcastTitle}" topshirig'i muvaffaqiyatli yaratildi!`, "success");
                      
                      // Clear input fields immediately
                      setNewBroadcastTitle("");
                      setNewBroadcastTarget("");
                      setNewBroadcastMessage("");
                      
                      // 2. Perform the Telegram broadcast asynchronously
                      try {
                        await sendTelegramBroadcast(taskObj);
                      } catch (tgErr: any) {
                        console.error("Telegram broadcast exception:", tgErr);
                        showToast("Topshiriq yaratildi, lekin Telegram xabarini yuborib bo'lmadi.", "error");
                      }
                    } catch (err: any) {
                      showToast(`Topshiriq yaratishda xato yuz berdi: ${err.message}`, "error");
                    }
                  }}
                  disabled={isBroadcastingTg}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs disabled:bg-blue-600/50"
                >
                  <Send className="w-4 h-4" /> 
                  {isBroadcastingTg ? "Yuborilmoqda..." : "Topshiriqni Telegram Botga Broadcast qilish 📡"}
                </button>
              </div>

              {/* Tidy List of dispatched tasks */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <h4 className="text-xs font-bold text-gray-300 flex justify-between">
                  <span>Yuborilgan Faol Topshiriqlar</span>
                  <span className="text-[10px] text-blue-400 font-mono">{blockTasks.length} ta</span>
                </h4>
                <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {blockTasks.length === 0 ? (
                    <p className="text-center text-gray-500 py-4 italic text-[11px]">Hozircha faol topshiriqlar mavjud emas.</p>
                  ) : (
                    blockTasks.map((task) => (
                      <div key={task.id} className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-[11px] space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-blue-400 font-semibold">{task.id}</span>
                          <span className="bg-amber-500/10 text-amber-400 font-mono text-[9px] px-1.5 py-0.5 rounded">+{task.coins} COIN</span>
                        </div>
                        <p className="font-semibold text-white/95 truncate">{task.title}</p>
                        <p className="text-gray-500 font-mono text-[10px] truncate">Target: {task.target}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 2: Volontyorlar Faoliyati (Tabs: Murojaatlar / Leaderboard) */}
            <div className="bg-[#131D2E]/40 border border-white/5 p-5 rounded-3xl flex flex-col space-y-4">
              {/* Tab Selector */}
              <div className="flex border-b border-white/5 pb-2 justify-between items-center">
                <div className="flex bg-black/35 p-1 rounded-xl border border-white/5 gap-1">
                  <button
                    onClick={() => setInvestigationRightTab("reports")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      investigationRightTab === "reports" 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    📍 Volontyor Murojaatlari
                  </button>
                  <button
                    onClick={() => setInvestigationRightTab("leaderboard")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      investigationRightTab === "leaderboard" 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    🏆 Reyting (Leaderboard)
                  </button>
                </div>
                
                <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2.5 py-1 rounded-xl font-mono uppercase font-bold flex items-center gap-1">
                  LIVE_FEED
                </span>
              </div>

              {/* Tab 1: Volontyor Murojaatlari (Reports Feed) */}
              {investigationRightTab === "reports" && (
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
                  {incidents.filter(inc => inc.reporterName).length === 0 ? (
                    <div className="text-center text-gray-500 py-12 italic text-xs">
                      Hozircha volontyorlar tomonidan hech qanday murojaat kelib tushmagan.
                    </div>
                  ) : (
                    incidents
                      .filter(inc => inc.reporterName)
                      .map((inc, index) => {
                        const hasCoords = inc.latitude && inc.longitude;
                        return (
                          <div key={inc.id || index} className="bg-black/25 p-3.5 rounded-2xl border border-white/5 flex flex-col gap-2.5 transition-all hover:border-white/10 text-left">
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <span className="text-[10px] font-mono text-gray-500 block">ID: {inc.id}</span>
                                <h4 className="font-bold text-white leading-snug text-xs">{inc.incident}</h4>
                              </div>
                              <span className={`text-[8px] px-2 py-0.5 rounded font-bold uppercase ${
                                inc.riskLevel === "CRITICAL" ? "bg-red-500/20 text-red-400 border border-red-500/10" :
                                inc.riskLevel === "HIGH" ? "bg-amber-500/20 text-amber-400 border border-amber-500/10" :
                                "bg-blue-500/20 text-blue-400 border border-blue-500/10"
                              }`}>
                                {inc.riskLevel}
                              </span>
                            </div>

                            {inc.description && (
                              <p className="text-gray-300 text-[11px] bg-black/10 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                                {inc.description}
                              </p>
                            )}

                            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400 pt-1 border-t border-white/5">
                              <div>
                                <span className="text-gray-500 block">Yuboruvchi Volontyor:</span>
                                <span className="text-blue-300 font-semibold">{inc.reporterName}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Hudud:</span>
                                <span className="text-gray-200">📍 {inc.district}</span>
                              </div>
                            </div>

                            {/* Show coordinates & Navigation trigger button */}
                            {hasCoords ? (
                              <div className="pt-1 flex flex-col gap-2">
                                <div className="bg-[#10B981]/5 border border-[#10B981]/10 rounded-xl p-2 flex items-center justify-between text-[10px] font-mono">
                                  <span className="text-[#10B981] font-bold">GPS: {parseFloat(inc.latitude!).toFixed(4)}, {parseFloat(inc.longitude!).toFixed(4)}</span>
                                  <span className="text-gray-500 text-[9px]">Aniq geolokatsiya</span>
                                </div>
                                <button
                                  onClick={() => {
                                    const lat = parseFloat(inc.latitude!);
                                    const lng = parseFloat(inc.longitude!);
                                    if (!isNaN(lat) && !isNaN(lng)) {
                                      setFocusedCoords([lng, lat]);
                                      setFocusedDistrict(inc.district);
                                      
                                      // Smooth scroll to the Map / GPS element at the bottom
                                      const mapEl = document.getElementById("volunteer-gis-map-container");
                                      if (mapEl) {
                                        mapEl.scrollIntoView({ behavior: "smooth", block: "center" });
                                      }
                                    }
                                  }}
                                  className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/20"
                                >
                                  📍 Ushbu Lokatsiyani Xaritada Ko'rsatish
                                </button>
                              </div>
                            ) : (
                              <div className="text-[9px] text-gray-500 italic font-mono pt-1">
                                GPS koordinatalari kiritilmagan (Birlamchi tuman markaziga bog'langan)
                              </div>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>
              )}

              {/* Tab 2: Leaderboard (Volontyorlar Reytingi) */}
              {investigationRightTab === "leaderboard" && (
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
                  <div className="text-xs text-gray-400 mb-2 font-medium">Kim qancha coin yig'di - reyting jadvali va monitoringi:</div>
                  {[...volunteers]
                    .sort((a, b) => (b.points || 0) - (a.points || 0))
                    .map((vol, index) => (
                      <div key={vol.id} className="bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-3 text-left">
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-[10px] font-bold flex items-center justify-center">
                            #{index + 1}
                          </span>
                          <div className="text-left leading-tight truncate">
                            <p className="font-semibold text-white/95 truncate">{vol.name}</p>
                            <span className="text-[9px] font-mono text-gray-400">{vol.reputation}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right font-mono">
                            <span className="text-amber-400 font-bold text-xs">{(vol.points || 0)}</span>
                            <span className="text-[8px] text-gray-400 block">coins</span>
                          </div>
                          
                          {/* Admin adjust controls */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              onClick={() => {
                                updateVolunteerCoins(vol.id, 50);
                              }}
                              className="bg-blue-600/10 hover:bg-blue-600/30 text-blue-400 text-[8px] px-1 rounded border border-blue-500/20 cursor-pointer font-bold"
                              title="+50 Coins"
                            >
                              +50
                            </button>
                            <button
                              onClick={() => {
                                updateVolunteerCoins(vol.id, -20);
                              }}
                              className="bg-red-600/10 hover:bg-red-600/30 text-red-400 text-[8px] px-1 rounded border border-red-500/20 cursor-pointer font-bold"
                              title="-20 Coins"
                            >
                              -20
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

          </div>

          {/* Unified Real-time GIS & GPS Navigation System for Volunteer Submissions */}
          <div id="volunteer-gis-map-container" className="bg-[#131D2E]/40 border border-white/5 p-5 rounded-3xl space-y-4 mt-6 animate-fade-in text-left">
            <div className="border-b border-white/5 pb-3 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
              <div>
                <h3 className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                  <Navigation className="w-4.5 h-4.5" /> Milliy Kiber-Gvardiya Navigatsiya & GPS Tizimi
                </h3>
                <p className="text-[11px] text-gray-400">Volontyorlar tomonidan yuborilgan aniq geolokatsiyalar va kiber-belgilarning interaktiv xaritasi</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-xl font-mono uppercase font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                  ONLINE_GPS_MAP
                </span>
                {focusedCoords && (
                  <button
                    onClick={() => {
                      setFocusedCoords(undefined);
                      setFocusedDistrict("Guliston Shahri");
                    }}
                    className="text-[9px] bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-2 py-1 rounded-xl font-mono uppercase font-bold cursor-pointer transition-all"
                  >
                    Reset Zoom 🔍
                  </button>
                )}
              </div>
            </div>

            <div className="h-[400px] rounded-2xl overflow-hidden border border-white/5 bg-slate-950 relative shadow-inner">
              <AIOCMap 
                height="100%" 
                layerType="risk" 
                focusedDistrict={focusedDistrict} 
                focusedCoords={focusedCoords} 
                liveIncidents={incidents} 
              />
            </div>
          </div>

        </div>
      )}

      {/* DISABLED OLD CASE INVESTIGATION VIEW BLOCK */}
      {false && activeTab === "case-investigation" && (
        <div className="space-y-6">
          {/* TEST MATCH SUCCESS */}
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Tezkor Tergov va Kiber-Tahlil Markazi</h1>
            <p className="text-xs text-gray-400">Alohida kiber-tahdid holatini atroflicha o'rganish, uning kiber timeline tarixi va ekspertiza xulosalari</p>
          </div>

          {selectedCase ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Deep details */}
              <div className="lg:col-span-8 bg-[#131D2E]/40 border border-white/8 p-6 rounded-3xl space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono font-bold text-blue-400">{selectedCase.id} / SIR_CASE_EXPERT</span>
                    <h2 className="text-lg font-bold text-white">{selectedCase.incident}</h2>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(selectedCase.status)}`}>
                    {selectedCase.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-gray-500 font-mono block">HUDUDIY SHTAB JOYLANUVI:</span>
                    <span className="text-white font-bold text-sm block mt-1">{selectedCase.district}</span>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                    <span className="text-gray-500 font-mono block">TAHDID MANBASI / REKVIZITI:</span>
                    <span className="text-white font-bold text-sm block mt-1 truncate" title={selectedCase.source}>{selectedCase.source || "Nomalum"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Kiber-Shtab Tergov Xulosasi (AI):</h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-light bg-black/25 p-4 rounded-xl border border-white/5">
                    {selectedCase.description || "Ushbu holat kiber-xavfsizlik milliy standartlariga asosan kiber-inspektorga topshirilgan va hozirda yakuniy tergov ostida."}
                  </p>
                </div>

                {/* Volunteer Telegram Submission Details */}
                {selectedCase.volunteer && (
                  <div className="bg-[#1D2B44]/50 border border-blue-500/20 p-5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-blue-400 flex items-center gap-1.5 font-mono">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        🤖 Telegram Bot: Volontyor Murojaat Ma'lumotlari
                      </h4>
                      <span className="text-[10px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">
                        Kiber-Gvardiya Integratsiyasi
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-gray-500 font-mono text-[10px]">TELEGRAM USERNAME:</span>
                        <span className="text-blue-300 font-bold block">{selectedCase.volunteer.telegramUsername}</span>
                        <span className="text-[10px] text-gray-500 block font-mono">ID: {selectedCase.volunteer.telegramId}</span>
                      </div>
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-gray-500 font-mono text-[10px]">VOLONTYOR ISMI:</span>
                        <span className="text-white font-bold block">{selectedCase.volunteer.telegramName}</span>
                        <span className="text-[10px] text-emerald-400 block font-mono">Reyting: ★ {selectedCase.volunteer.trustScore}% Trust</span>
                      </div>
                      <div className="bg-black/20 p-3 rounded-xl border border-white/5 space-y-1">
                        <span className="text-gray-500 font-mono text-[10px]">MUROJAAT VAQTI & GPS:</span>
                        <span className="text-white font-bold block">{selectedCase.volunteer.submissionTime}</span>
                        <span className="text-[10px] text-gray-400 block truncate" title={selectedCase.volunteer.gpsLocation}>{selectedCase.volunteer.gpsLocation}</span>
                      </div>
                    </div>

                    <div className="bg-black/30 p-3.5 rounded-xl border border-white/5 text-xs space-y-2">
                      <span className="text-gray-500 font-mono text-[10px] block">YUBORILGAN TAVSIF / MATN:</span>
                      <p className="text-gray-200 leading-relaxed font-sans">{selectedCase.volunteer.submittedText}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Left: Files / Audio */}
                      <div className="space-y-2.5">
                        <span className="text-gray-500 font-mono text-[10px] block">YUBORILGAN FAYLLAR VA HUJJATLAR:</span>
                        <div className="space-y-1.5">
                          {selectedCase.volunteer.uploadedFiles.map((file, i) => (
                            <div key={i} className="flex items-center justify-between bg-black/25 px-3 py-2 rounded-lg border border-white/5 font-mono text-[11px] text-gray-300">
                              <span className="truncate">📁 {file}</span>
                              <span className="text-blue-400 text-[10px] hover:underline cursor-pointer">Yuklash</span>
                            </div>
                          ))}
                          {selectedCase.volunteer.uploadedVoice && (
                            <div className="flex items-center justify-between bg-blue-950/25 px-3 py-2 rounded-lg border border-blue-900/30 font-mono text-[11px] text-blue-300">
                              <span className="truncate">🎙️ {selectedCase.volunteer.uploadedVoice}</span>
                              <span className="text-blue-400 text-[10px] font-bold animate-pulse">Eshitish (Play)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Media Videos */}
                      <div className="space-y-2.5">
                        <span className="text-gray-500 font-mono text-[10px] block">YUBORILGAN VIDEO DALILLAR:</span>
                        {selectedCase.volunteer.uploadedVideos.length > 0 ? (
                          <div className="space-y-1.5">
                            {selectedCase.volunteer.uploadedVideos.map((vid, i) => (
                              <div key={i} className="flex items-center justify-between bg-black/25 px-3 py-2 rounded-lg border border-white/5 font-mono text-[11px] text-gray-300">
                                <span className="truncate">🎥 {vid}</span>
                                <span className="text-cyan-400 text-[10px] hover:underline cursor-pointer">Ko'rish (Play)</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-gray-500 italic text-[11px] bg-black/10 p-3 rounded-lg border border-dashed border-white/5">Video material yuborilmagan</div>
                        )}
                      </div>
                    </div>

                    {/* Image Attachment (Photos) */}
                    {selectedCase.volunteer.uploadedImages.length > 0 && (
                      <div className="space-y-2.5 pt-1">
                        <span className="text-gray-500 font-mono text-[10px] block">YUBORILGAN SKRINSHOTLAR / RASMLAR:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {selectedCase.volunteer.uploadedImages.map((img, i) => (
                            <div key={i} className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 h-32 flex items-center justify-center">
                              {(img.startsWith("http") || img.startsWith("data:")) ? (
                                <>
                                  <img src={img} alt="Volunteer Evidence Screenshot" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-[10px] font-mono text-white bg-blue-600 px-2 py-1 rounded">Kattalashtirish</span>
                                  </div>
                                </>
                              ) : (
                                 <div className="text-gray-500 text-[10px] font-mono px-2 text-center">Telegram File ID:<br/>{img.substring(0, 15)}...</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Volunteer History Stats inside Details */}
                    <div className="border-t border-white/5 pt-3.5 mt-2 text-[11px] font-mono text-gray-400 grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>Habarlar soni: <span className="text-white font-bold">{selectedCase.volunteer.reportCount} ta</span></div>
                      <div>Tasdiqlangan: <span className="text-emerald-400 font-bold">{selectedCase.volunteer.confirmedReports} ta</span></div>
                      <div>Xato/Soxta: <span className="text-red-400 font-bold">{selectedCase.volunteer.falseReports} ta</span></div>
                      <div>Tizim ishonchi: <span className="text-blue-400 font-bold">{selectedCase.volunteer.trustScore}%</span></div>
                    </div>
                  </div>
                )}

                {/* Simulated Timeline */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-gray-400">Case Tergov Xronologiyasi (Timeline)</h4>
                  <div className="space-y-3 font-mono text-[11px] text-gray-400 pl-4 border-l border-white/10">
                    <div>⏱ {selectedCase.time} - Avtomat kiber-tizim skaneri tomonidan xavf fiksatsiya qilindi.</div>
                    <div>🤖 {selectedCase.time} - Gemini-3.5-Flash tomonidan OCR tahlillari yakunlandi va xavf baholandi.</div>
                    <div>👮 {selectedCase.time} - Inspektor {selectedCase.inspector} tergovga akkreditatsiya qilindi.</div>
                    <div>📂 {selectedCase.time} - Kiber-dalillar va visual skrinshotlar fiksatsiya qilindi.</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="lg:col-span-4 bg-[#131D2E]/60 border border-white/5 rounded-3xl p-6 space-y-6">
                <h3 className="font-bold text-sm border-b border-white/5 pb-2">Administrator Harakatlari</h3>

                <div className="space-y-4">
                  {/* Dynamic Inspector Re-assignment */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider">Tezkor Inspektor Biriktirish:</label>
                    <select 
                      value={selectedCase.inspector}
                      onChange={(e) => {
                        const newName = e.target.value;
                        const updated = { ...selectedCase, inspector: newName };
                        saveIncidentToDb(updated);
                        setSelectedCase(updated);
                        addAuditLog("ADMIN", `Incident (${selectedCase.id}) inspektori o'zgartirildi: ${newName}`);
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {inspectors.map((ins, idx) => (
                        <option key={idx} value={ins.name}>{ins.name} ({ins.district})</option>
                      ))}
                    </select>
                  </div>

                  {/* Dynamic Status Changer */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 block font-mono uppercase tracking-wider">Incident Joriy Holati:</label>
                    <select 
                      value={selectedCase.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as any;
                        const updated = { ...selectedCase, status: newStatus };
                        saveIncidentToDb(updated);
                        setSelectedCase(updated);
                        addAuditLog("ADMIN", `Incident (${selectedCase.id}) holati o'zgartirildi: ${newStatus}`);
                      }}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="Assigned">Assigned (Biriktirilgan)</option>
                      <option value="Accepted">Accepted (Qabul qilingan)</option>
                      <option value="Investigating">Investigating (Tergov ostida)</option>
                      <option value="Evidence Uploaded">Evidence Uploaded (Dalil yuklangan)</option>
                      <option value="Resolved">Resolved (Hal etilgan)</option>
                      <option value="Blocked">Blocked (Bloklangan)</option>
                    </select>
                  </div>

                  <div className="border-t border-white/5 pt-3 space-y-2">
                    <button 
                      onClick={() => {
                        const updated = { ...selectedCase, status: "Blocked" as const };
                        saveIncidentToDb(updated);
                        setSelectedCase(updated);
                        addAuditLog("ADMIN", `Incident (${selectedCase.id}) bloklandi`);
                      }}
                      className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      🚫 IP/Domen/Kanalni Bloklash
                    </button>
                    <button 
                      onClick={() => {
                        const updated = { ...selectedCase, status: "Resolved" as const };
                        saveIncidentToDb(updated);
                        setSelectedCase(updated);
                        addAuditLog("ADMIN", `Incident (${selectedCase.id}) holati hal qilindi (Resolved)`);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      ✔️ Holatni To'liq Hal Etish (Resolve)
                    </button>
                    <button 
                      onClick={() => {
                        alert(`Inspektor ${selectedCase.inspector} ga tezkor eslatma va bildirishnoma yuborildi.`);
                        addAuditLog("ADMIN", `Eslatma yuborildi: Inspektor ${selectedCase.inspector} (Ish: ${selectedCase.id})`);
                      }}
                      className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      📢 Inspektorga Eslatma Yuborish
                    </button>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 text-[10px] font-mono text-gray-500 space-y-1">
                  <div>TIZIM_KODI: SEC_CASE_PROC_02</div>
                  <div>RUHSAT_DARAJASI: FULL_ADMIN</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 font-light border border-dashed border-white/10 rounded-2xl">
              Tahlil qilish uchun chapdagi Jurnal orqali holatni tanlang.
            </div>
          )}
        </div>
      )}

      {/* 12. REPORTS PAGE */}
      {activeTab === "admin-reports" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Kiber-Gvardiya Hisobotlar Markazi</h1>
            <p className="text-xs text-gray-400 font-mono">Kunlik, haftalik va oylik statistik axborotlarni tahlili va PDF/Excel yuklanishi</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Kunlik Operativ Hisobot", date: "2026-06-26", desc: "So'nggi 24 soat ichida aniqlangan barcha kiber holatlar va yechilgan ishlar tahlili." },
              { title: "Haftalik Sirdaryo Monitoringi", date: "Xavfsizlik Hisoboti", desc: "Hafta davomida Sirdaryo viloyati tumanlari risk koeffitsiyenti va kiber hudud o'zgarishi." },
              { title: "Gemini Model Tahlil Statistikasi", date: "Model Accuracy", desc: "Sun'iy intellektning skrinshot matnini aniqlash ishonchlilik ko'rsatkichi tahlili." }
            ].map((rep, idx) => (
              <div key={idx} className="bg-[#131D2E]/40 border border-white/8 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">{rep.date}</span>
                  <h3 className="font-bold text-sm text-white">{rep.title}</h3>
                  <p className="text-xs text-gray-400 leading-normal font-light">{rep.desc}</p>
                </div>
                <button 
                  onClick={handleExport}
                  className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Hisobotni PDF Yuklab Olish</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CAMERAS PAGE */}
      {activeTab === "cameras" && (
        <CamerasModule />
      )}

      {/* 13. ANALYTICS PAGE */}
      {activeTab === "admin-analytics" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Tizim Tahlili va Diagrammalar</h1>
            <p className="text-xs text-gray-400 font-mono">Tumanlar va kiber-tahdid turlari kesimidagi tahliliy egrilar va prognozlar</p>
          </div>

          {/* Static SVG Charts representing High Fidelity Graphics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Telegram vs Website Fishing trends (Haftalik)</h3>
              <div className="h-48 w-full relative flex flex-col justify-between pt-4">
                <svg className="w-full h-36" preserveAspectRatio="none">
                  <path d="M 0,100 Q 50,40 100,80 T 200,20 T 300,60 T 400,10" fill="none" stroke="#3B82F6" strokeWidth="3" />
                  <path d="M 0,110 Q 50,70 100,100 T 200,50 T 300,90 T 400,30" fill="none" stroke="#F59E0B" strokeWidth="3" />
                </svg>
                <div className="flex justify-between text-[10px] font-mono text-gray-500">
                  <span>Dush</span>
                  <span>Chor</span>
                  <span>Pay</span>
                  <span>Shan</span>
                  <span>Yak</span>
                </div>
              </div>
            </div>

            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">Tumanlar kesimida risk darajasi (Critical vs Medium)</h3>
              <div className="space-y-3">
                {[
                  { name: "Guliston Shahri", critical: "92%", color: "bg-red-500" },
                  { name: "Sirdaryo Tumani", critical: "81%", color: "bg-amber-500" },
                  { name: "Yangiyer Shahri", critical: "75%", color: "bg-amber-500" },
                  { name: "Boyovut Tumani", critical: "42%", color: "bg-blue-500" }
                ].map((dt, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-gray-400">{dt.name}</span>
                      <span className="text-white font-bold">{dt.critical}</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                      <div className={`h-full ${dt.color} rounded-full`} style={{ width: dt.critical }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14. NOTIFICATIONS PAGE */}
      {activeTab === "admin-notifications" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Bildirishnomalar Sozlamalari</h1>
            <p className="text-xs text-gray-400">Favqulodda milliy ogohlantirishlar va inspektorlar navbatchilik tizimi bildirishlari</p>
          </div>

          <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4 max-w-2xl">
            <h3 className="font-bold text-sm border-b border-white/5 pb-2 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-400 animate-bounce" />
              Tizim Bildirishnomalari Sozlamalari (MFA Push)
            </h3>
            
            <div className="space-y-4 text-xs font-sans">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white">Critical Alert (Kritik tahdidlar)</h4>
                  <p className="text-gray-400 text-[11px]">Kritik kiber-tahdidlar aniqlanganda zudlik bilan SMS va Telegram ogohlantirish berish.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between border-t border-white/5 pt-4">
                <div>
                  <h4 className="font-bold text-white">Inspector Case Alert (Inspektor topshiriqlari)</h4>
                  <p className="text-gray-400 text-[11px]">Yangi kiber ish biriktirilganda inspektorlarga avtomat tarzda push-bildirishnoma.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 15. AI INTELLIGENCE CENTER PAGE */}
      {activeTab === "ai-intelligence" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Sirdaryo AI Intelligence Laboratoriyasi</h1>
            <p className="text-xs text-gray-400 font-mono">Google Gemini-3.5-Flash model parametrlari va kiber-tahlil sozlamalari</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm border-b border-white/5 pb-2">Gemini Model Holati</h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Faol tahlilchi model:</span>
                  <span className="font-bold font-mono text-emerald-400">gemini-3.5-flash</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Model accuracy (Ishonch):</span>
                  <span className="font-bold font-mono text-emerald-400">96.8% accurate</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Xato dekonstruksiya (False positive):</span>
                  <span className="font-bold font-mono text-gray-300">1.2% rate</span>
                </div>
              </div>
            </div>

            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm border-b border-white/5 pb-2">Prompt Sozlamalari (System Instruction)</h3>
              <p className="text-xs text-gray-300 leading-relaxed font-light bg-black/35 p-3 rounded-xl border border-white/5">
                "Siz kiber-shtab tahlilchisiz. Skrinshottan milliy o'zbek tilidagi noqonuniy dori rekvizitlari, dorilar narxlari, koordinatalari, Click yoki Payme fishing soxta darchalarini tutib oling va kiber-dalil sifatida belgilang."
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 16. AUDIT LOGS PAGE */}
      {activeTab === "audit-logs" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Tizimli Tahliliy Audit Jurnali</h1>
            <p className="text-xs text-gray-400 font-mono">Tizim bo'yicha barcha foydalanuvchilar, inspektorlar va adminlar xatti-harakati jurnali</p>
          </div>

          <div className="bg-[#131D2E]/30 border border-white/5 rounded-2xl overflow-hidden text-xs">
            <div className="p-4 bg-black/20 font-bold border-b border-white/5">Shtab xavfsizlik audit jurnali</div>
            <div className="divide-y divide-white/5 font-mono">
              {[
                { time: "2026-06-26 10:22", actor: "ADMIN", action: "Bloklash buyrug'ini yubordi (INC-4821)", ip: "185.112.5.4" },
                { time: "2026-06-26 10:18", actor: "INSPECTOR", action: "Kiber-dalillarni tekshirdi va tahlil yukladi (INC-4818)", ip: "91.115.12.8" },
                { time: "2026-06-26 10:10", actor: "SYSTEM", action: "Yangi kiber-tahdid fiksatsiya qilindi", ip: "Local Node" }
              ].map((log, i) => (
                <div key={i} className="p-3.5 flex justify-between items-center text-gray-300 hover:bg-white/5">
                  <div className="flex gap-4">
                    <span className="text-gray-500">{log.time}</span>
                    <span className="font-bold text-blue-400">{log.actor}</span>
                    <span>{log.action}</span>
                  </div>
                  <span className="text-gray-500">{log.ip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 17. USER MANAGEMENT PAGE */}
      {activeTab === "user-management" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Shtab Kiber-A'zolari Jurnali</h1>
            <p className="text-xs text-gray-400 font-mono">Tizimga kirish huquqiga ega bo'lgan barcha shtab a'zolari profil boshqaruvi</p>
          </div>

          <div className="bg-[#131D2E]/30 border border-white/5 rounded-2xl overflow-hidden">
            <div className="p-4 bg-black/20 font-bold border-b border-white/5">Shtab a'zolari ro'yxati</div>
            <div className="divide-y divide-white/5 text-xs">
              {inspectors.map((ins, i) => (
                <div key={i} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-indigo-500/10 flex items-center justify-center text-indigo-400">👮</div>
                    <div>
                      <h4 className="font-bold text-white">{ins.name}</h4>
                      <p className="text-gray-500 text-[10px]">{ins.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded text-[10px]">INSPECTOR</span>
                    <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded border border-white/10 text-gray-300">Bloklash 🚫</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 18. ROLE MANAGEMENT PAGE */}
      {activeTab === "role-management" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Vakolatlar va Rollar Matritsasi</h1>
            <p className="text-xs text-gray-400 font-mono">Kiber shtab a'zolarining ruxsat darajalari (Access Matrices)</p>
          </div>

          <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4 max-w-2xl">
            <h3 className="font-bold text-sm border-b border-white/5 pb-2">Shtab ruxsat darajasi matritsasi</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center bg-black/35 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="font-bold text-white block">Shtab Boshlig'i (Administrator)</span>
                  <span className="text-gray-400 text-[11px]">Barcha modullarni boshqarish, kiber-fiksatsiya, inspektorlar biriktirish, kiber sozlash.</span>
                </div>
                <span className="text-emerald-400 font-mono font-bold">FULL_ACCESS</span>
              </div>

              <div className="flex justify-between items-center bg-black/35 p-3 rounded-xl border border-white/5">
                <div>
                  <span className="font-bold text-white block">Tezkor Inspektor (Field Inspector)</span>
                  <span className="text-gray-400 text-[11px]">Unga biriktirilgan ishlarni ko'rib chiqish, dalil va xulosalar yuklash, holatni hal qilish.</span>
                </div>
                <span className="text-indigo-400 font-mono font-bold">FIELD_ACCESS</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 19. SYSTEM SETTINGS PAGE */}
      {activeTab === "system-settings" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Tizim Global Sozlamalari</h1>
            <p className="text-xs text-gray-400">Server xostingi, API kalitlar shifrlanishi va zaxira nusxalar ombori boshqaruvi</p>
          </div>

          <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4 max-w-xl">
            <h3 className="font-bold text-sm border-b border-white/5 pb-2">Axborot Tizimi Sozlamalari</h3>
            <div className="space-y-3 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-gray-400 block">Sirdaryo operativ tugun kodi (Node ID)</label>
                <input type="text" defaultValue="SIRDARYO_HQ_NODE_01" className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-gray-400 block">Gemini API Integratsiya Kaliti (Encrypted)</label>
                <input type="password" defaultValue="••••••••••••••••••••••••••••••••" disabled className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white/50 outline-none" />
              </div>
              <button onClick={() => alert("Tizim sozlamalari muvaffaqiyatli saqlandi.")} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-bold transition-all">
                Sozlamalarni Saqlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 20. PROFILE PAGE */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h1 className="text-2xl font-bold font-display">Administrator Shaxsiy Profili</h1>
            <p className="text-xs text-gray-400 font-mono">Shtab boshlig'i akkreditatsiya ma'lumotlari va xavfsizlik sozlamalari</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-full bg-blue-500/10 border-2 border-blue-500/30 flex items-center justify-center text-3xl">
                🛡️
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">General-Major S. Alisherovich</h3>
                <p className="text-xs text-blue-400 font-mono">Sirdaryo Tezkor Shtab Boshlig'i</p>
              </div>
              <div className="border-t border-white/5 pt-4 w-full text-xs text-left space-y-2 text-gray-400">
                <div>Rank: <span className="text-white font-bold">General-Major</span></div>
                <div>Departament: <span className="text-white font-bold">Kiber-Gvardiya Maxsus Bo'linmasi</span></div>
                <div>Hudud: <span className="text-white font-bold">Sirdaryo Viloyati Shtabi</span></div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-[#131D2E]/40 border border-white/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm border-b border-white/5 pb-2">Shaxsiy Profil Tahriri</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1">
                  <label className="text-gray-400">Elektron pochta</label>
                  <input type="email" defaultValue="alisherovich@safeuz.uz" className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-400">Telefon raqam</label>
                  <input type="text" defaultValue="+998 (90) 115-4422" className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-white outline-none" />
                </div>
              </div>
              <button onClick={() => alert("Profil ma'lumotlari muvaffaqiyatli yangilandi.")} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl text-xs font-bold transition-all">
                Ma'lumotlarni Yangilash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md text-xs font-medium max-w-sm ${
              toast.type === "success" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                : toast.type === "error"
                  ? "bg-red-500/10 border-red-500/20 text-red-400"
                  : "bg-blue-500/10 border-blue-500/20 text-blue-400"
            }`}
          >
            <span className="text-sm">
              {toast.type === "success" ? "🛡️" : toast.type === "error" ? "⚠️" : "ℹ️"}
            </span>
            <div className="flex-1 leading-tight">{toast.message}</div>
            <button 
              onClick={() => setToast(null)} 
              className="text-gray-400 hover:text-white ml-2 transition-all cursor-pointer text-xs"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
