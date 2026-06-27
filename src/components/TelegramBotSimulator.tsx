import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Image as ImageIcon, 
  MapPin, 
  Smile, 
  Paperclip, 
  Check, 
  AlertCircle, 
  Navigation, 
  Coins, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  HelpCircle,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  image?: string;
  location?: { district: string; lat: number; lng: number };
  timestamp: string;
  isSystem?: boolean;
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

// Sample kiber-tahdid pictures to make testing extremely easy!
const SAMPLE_IMAGES = [
  { id: "img1", name: "Giyohvandlik kanali (Telegram guruh)", url: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=60", desc: "Psixotrop yoki sintetik dori vositalarini sotuvchi guruh skrinshoti" },
  { id: "img2", name: "Narkotik yashirish (Zakladka isboti)", url: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=500&auto=format&fit=crop&q=60", desc: "Giyohvand moddalar yashirilayotgan joy rasmi va isboti" },
  { id: "img3", name: "Giyohvand do'koni graffitisi (Devordagi reklama)", url: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=500&auto=format&fit=crop&q=60", desc: "Ko'chadagi devorga chizilgan narkotik do'koni manzili" },
];

export default function TelegramBotSimulator() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [botStep, setBotStep] = useState<"welcome" | "photo" | "comment" | "location" | "confirm" | "submitting" | "done">("welcome");
  
  // Temporary states for multi-step submission
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState<string | null>(null);
  const [tempLocation, setTempLocation] = useState<{ district: string; lat: number; lng: number } | null>(null);
  
  const [safeCoins, setSafeCoins] = useState(350); // Initial simulated coin count
  const [isApiSubmitting, setIsApiSubmitting] = useState(false);
  const [latestSubmittedId, setLatestSubmittedId] = useState<string | null>(null);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside telegram chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Start Bot Session
  useEffect(() => {
    resetBotSession();
  }, []);

  const resetBotSession = () => {
    setBotStep("welcome");
    setTempImage(null);
    setTempComment(null);
    setTempLocation(null);
    
    setMessages([
      {
        id: "msg_init_sys",
        sender: "bot",
        text: "⚡️ SafeUZ AI Narkotrafik va noqonuniy dori-darmonlar aylanmasiga qarshi kurash botiga xush kelibsiz! Sirdaryo viloyati volontyorlari uchun tezkor hisobot yuborish tizimi.",
        timestamp: getFormattedTime(),
        isSystem: true
      },
      {
        id: "msg_init_1",
        sender: "bot",
        text: "Assalomu alaykum, hurmatli SafeUZ Volontyori! 🤝\n\nQanday noqonuniy dori-savdosi, giyohvandlik, psixotrop moddalar tarqatish guruhlari yoki 'zakladka' holatlari haqida xabar bermoqchisiz?\n\nIltimos, tasdiqlovchi rasm dalillarni yuklang (Masalan: skrinshot rasm, graffiti devor surati yoki joylashuv rasmi). Agar rasm bo'lmasa, shunchaki 'O'tkazib yuborish' tugmasini bosing.",
        timestamp: getFormattedTime()
      }
    ]);
  };

  function getFormattedTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Step 1: User uploads image or clicks Skip
  const handlePhotoStep = (imageUrl: string | null) => {
    if (botStep !== "welcome") return;

    // Add user action to message log
    if (imageUrl) {
      setTempImage(imageUrl);
      const matched = SAMPLE_IMAGES.find(i => i.url === imageUrl);
      setMessages(prev => [
        ...prev,
        {
          id: `usr_${Date.now()}`,
          sender: "user",
          text: `📸 Rasm yuklandi: ${matched ? matched.name : "Narkotrafik dalil rasmi"}`,
          image: imageUrl,
          timestamp: getFormattedTime()
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: `usr_${Date.now()}`,
          sender: "user",
          text: "⏭️ Rasm o'tkazib yuborildi",
          timestamp: getFormattedTime()
        }
      ]);
    }

    // Advance to comment step
    setBotStep("comment");
    
    // Bot replies
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: "✅ Dalil qabul qilindi!\n\nEndi ushbu noqonuniy savdo yoki giyohvandlik holati bo'yicha qisqacha izoh yoki tavsif qoldiring (Masalan: 'Telegram narkotik boti @narko_sirdaryo' yoki 'Ko'chadagi devorda giyohvand do'konining graffiti reklamasi').\n\nAgar izoh bo'lmasa, pastdagi 'O'tkazib yuborish' tugmasini bosing.",
          timestamp: getFormattedTime()
        }
      ]);
    }, 600);
  };

  // Step 2: User enters text comment or clicks Skip
  const handleCommentStep = (commentText: string | null) => {
    if (botStep !== "comment") return;

    if (commentText && commentText.trim()) {
      setTempComment(commentText);
      setMessages(prev => [
        ...prev,
        {
          id: `usr_${Date.now()}`,
          sender: "user",
          text: `💬 Izoh: "${commentText}"`,
          timestamp: getFormattedTime()
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: `usr_${Date.now()}`,
          sender: "user",
          text: "⏭️ Izoh o'tkazib yuborildi",
          timestamp: getFormattedTime()
        }
      ]);
    }

    setBotStep("location");
    setInputText("");

    // Bot replies
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: "📍 Zo'r! Endi ushbu noqonuniy dori savdosi yoki giyohvandlik holati aniqlangan Sirdaryo hududini tanlang, yoki pastdagi 'O'tkazib yuborish' ni bosing.",
          timestamp: getFormattedTime()
        }
      ]);
    }, 600);
  };

  // Step 3: User selects location or clicks Skip
  const handleLocationStep = (district: string | null) => {
    if (botStep !== "location") return;

    let locDetails = null;
    if (district) {
      // Calculate random coords within Sirdaryo range roughly
      const lat = 40.5 + Math.random() * 0.3;
      const lng = 68.6 + Math.random() * 0.4;
      locDetails = { district, lat, lng };
      setTempLocation(locDetails);
    }

    setMessages(prev => [
      ...prev,
      {
        id: `usr_${Date.now()}`,
        sender: "user",
        text: district ? `📍 Hudud: ${district}` : "⏭️ Hudud o'tkazib yuborildi",
        location: locDetails || undefined,
        timestamp: getFormattedTime()
      }
    ]);

    setBotStep("confirm");

    // Bot replies to ask for explicit confirmation before submitting
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: `bot_${Date.now()}`,
          sender: "bot",
          text: `📝 Murojaat ma'lumotlarini tekshiring va jo'natishni tasdiqlang:\n\n` +
            `📸 Rasm dalil: ${tempImage ? "✅ Yuklangan" : "❌ Yo'q"}\n` +
            `💬 Izoh / Tavsif: ${tempComment ? `"${tempComment}"` : "❌ Yo'q"}\n` +
            `📍 Hudud: ${district ? `✅ ${district}` : "❌ Yo'q"}\n\n` +
            `Hamma ma'lumotlar to'g'rimi? Quyidagi '🟢 Jo'natishni tasdiqlash' tugmasini bosing. Qolgan chuqur tahlil (AI tahlil, xavf balli, tezkor guruhlarga yo'naltirish) jarayonlarini AI tizimi avtomatik ravishda bajaradi! 🤖⚡️`,
          timestamp: getFormattedTime()
        }
      ]);
    }, 600);
  };

  // Step 4: Final Confirmation Submission
  const handleConfirmStep = async () => {
    if (botStep !== "confirm") return;

    setBotStep("submitting");
    setIsApiSubmitting(true);

    setMessages(prev => [
      ...prev,
      {
        id: `usr_confirm_${Date.now()}`,
        sender: "user",
        text: "🟢 Jo'natishni tasdiqlayman",
        timestamp: getFormattedTime()
      }
    ]);

    setTimeout(async () => {
      try {
        const finalDistrict = tempLocation?.district || "Guliston shahri";
        const finalComment = tempComment || "Volontyor tomonidan tezkor xabar";
        const finalImage = tempImage || "";
        const targetUrl = tempComment?.match(/@\w+|https?:\/\/\S+/g)?.[0] || tempComment?.slice(0, 30) || "Telegram noqonuniy guruhi";
        
        // Post report to DB
        const response = await fetch("/api/reports", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            district: finalDistrict,
            category: finalImage.includes("dori") || finalComment.includes("dori") ? "Narcotics Detection" : "Telegram Monitoring",
            target: targetUrl,
            description: `${finalComment}. (Telegram Bot Simulyatoridan yuborildi. Rasm isboti: ${finalImage ? "Bor" : "Yo'q"})`,
            severity: "HIGH",
            riskScore: 85,
            latitude: tempLocation ? String(tempLocation.lat) : "40.5124",
            longitude: tempLocation ? String(tempLocation.lng) : "68.6231",
            botUserId: 1 // Link to first bot user
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reportId = data.report?.incidentId || `REP-${Math.floor(1000 + Math.random() * 9000)}`;
          setLatestSubmittedId(reportId);
          setSafeCoins(prev => prev + 50);

          setMessages(prev => [
            ...prev,
            {
              id: `bot_${Date.now()}`,
              sender: "bot",
              text: `🎉 TABRIKLAYMIZ! Murojaatingiz muvaffaqiyatli qabul qilindi va AI tomonidan avtomatik tahlildan o'tkazildi.\n\n🆔 Ariza ID: ${reportId}\n🪙 Hisobingizga +50 SafeCoins qo'shildi!\n\nUshbu holat dori-darmonlar va giyohvandlikka qarshi kurashish monitoring xaritasida real vaqtda faollashtirildi. Ko'rsatgan yordamingiz uchun rahmat! 🛡️`,
              timestamp: getFormattedTime()
            }
          ]);
        } else {
          throw new Error("Yuborish xatosi");
        }
      } catch (err) {
        console.error(err);
        // Fallback for offline mode
        const mockId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
        setLatestSubmittedId(mockId);
        setSafeCoins(prev => prev + 50);
        
        setMessages(prev => [
          ...prev,
          {
            id: `bot_${Date.now()}`,
            sender: "bot",
            text: `🎉 Murojaatingiz qabul qilindi va SafeUZ AI tomonidan tahlil qilindi.\n\n🆔 Ariza ID: ${mockId}\n🪙 Hisobingizga +50 SafeCoins qo'shildi!\n\nMurojaat giyohvandlik va noqonuniy dori aylanmasiga qarshi kurashish shtabi panellariga muvaffaqiyatli fiksatsiya qilindi. Rahmat! 🛡️`,
            timestamp: getFormattedTime()
          }
        ]);
      } finally {
        setIsApiSubmitting(false);
        setBotStep("done");
      }
    }, 1200);
  };

  // Submit Text using send button
  const handleSendText = () => {
    if (!inputText.trim()) return;
    
    if (botStep === "comment") {
      handleCommentStep(inputText);
    } else {
      // Just normal chatter
      const userText = inputText;
      setMessages(prev => [
        ...prev,
        { id: `usr_${Date.now()}`, sender: "user", text: userText, timestamp: getFormattedTime() }
      ]);
      setInputText("");
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { 
            id: `bot_${Date.now()}`, 
            sender: "bot", 
            text: "Ushbu simulyator murojaatni bosqichma-bosqich yuborish uchun mo'ljallangan. Iltimos, interaktiv boshqaruv tugmalaridan foydalaning.", 
            timestamp: getFormattedTime() 
          }
        ]);
      }, 500);
    }
  };

  return (
    <div className="space-y-6 text-left animate-fade-in" id="telegram-bot-simulator-root">
      
      {/* Title & Info Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display flex items-center gap-2 text-white">
            <span className="p-1.5 bg-sky-500/10 border border-sky-500/20 text-sky-400 rounded-lg">🤖</span>
            @SafeUZ_AI_bot Simulyatori
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Volontyorlar uchun mukammal giyohvandlik va noqonuniy dori-darmonlar haqida xabar berish Telegram bot ishlash prinsipi va interaktiv sinovi
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#131D2E]/80 border border-white/5 px-3 py-2 rounded-xl text-[11px] font-mono">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-gray-300">SafeCoins:</span>
            <span className="text-amber-400 font-bold">{safeCoins}🪙</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Info Guide + Mobile Mockup Sim */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Info Guide Card (Left Column) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#131D2E]/40 border border-white/5 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-sm text-sky-400 flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="w-4 h-4" /> Ideal Bot Ishlash Prinsipi
            </h3>
            
            <p className="text-xs text-gray-300 leading-relaxed">
              Volontyorlik faoliyatini soddalashtirish va <strong>narkotrafik hamda noqonuniy dori savdosiga chek qo'yish</strong> uchun bot 
              <strong> 4 ta qulay va tezkor bosqich</strong>dan iborat. 
              Mavjud bo'lmagan ma'lumotlarni shunchaki o'tkazib yuborishingiz (Skip) mumkin, oxirida esa jo'natishni tasdiqlaysiz.
            </p>

            {/* Workflow steps */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                  1
                </div>
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-white">📸 Dalil rasmi (Skrinshot / rasm)</p>
                  <p className="text-gray-400 text-[11px]">Telegram giyohvandlik guruhlari skrinshoti, noqonuniy dorilar yoki devorlardagi narkotik-reklama graffiti rasmi. Mavjud bo'lmasa, o'tkazib yuboring.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                  2
                </div>
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-white">💬 Qisqacha izoh / tavsif</p>
                  <p className="text-gray-400 text-[11px]">Guruh havolasi yoki sotuvchilar haqida qo'shimcha ma'lumot. Mavjud bo'lsa kiriting, bo'lmasa o'tkazib yuboring.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                  3
                </div>
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-white">📍 Hudud / Geolokatsiya</p>
                  <p className="text-gray-400 text-[11px]">Sirdaryoning dori yoki narkotik vositalar tarqalayotgan tumanini belgilash yoki GPS yuborish. Mavjud bo'lmasa, o'tkazib yuboring.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-400 shrink-0">
                  4
                </div>
                <div className="text-xs leading-relaxed">
                  <p className="font-semibold text-white">🟢 Jo'natishni tasdiqlash</p>
                  <p className="text-gray-400 text-[11px]">Kiritilgan ma'lumotlar to'g'riligini tasdiqlab botga yakuniy jo'natish.</p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-950/20 border border-blue-500/15 rounded-xl text-[11px] text-blue-300 flex gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-blue-400 mt-0.5" />
              <span>
                <strong>Avtomatlashtirish:</strong> Botga narkotik yoki kiber-tahdid dalili yuborilishi bilan SafeUZ AI motori tahlil qiladi va dori-vositalari hamda kiber-narkotik inspektorlariga real vaqtda yo'naltiradi.
              </span>
            </div>
          </div>

          {/* Quick API Live Monitor */}
          <div className="bg-[#131D2E]/40 border border-white/5 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono flex justify-between items-center">
              <span>🖥️ API Live Request Log</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </h4>
            
            <div className="bg-black/40 p-3 rounded-xl border border-white/10 font-mono text-[10px] text-gray-300 space-y-2 max-h-[160px] overflow-y-auto">
              <div>
                <span className="text-emerald-400 font-bold">POST</span> <span className="text-blue-400">/api/reports</span>
              </div>
              <div className="text-gray-400">
                {`{`}
                <div className="pl-4">
                  <div>"district": "{tempLocation?.district || "Guliston shahri"}",</div>
                  <div>"category": "Telegram Monitoring",</div>
                  <div>"target": "${tempComment?.slice(0, 20) || "Telegram noqonuniy guruhi"}",</div>
                  <div>"description": "${tempComment || "Tavsif kiritilmagan"}",</div>
                  <div>"latitude": "${tempLocation?.lat || "40.5124"}",</div>
                  <div>"longitude": "${tempLocation?.lng || "68.6231"}",</div>
                  <div>"botUserId": 1</div>
                </div>
                {`}`}
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
              <span>Status: {isApiSubmitting ? "⌛ YUBORILMOQDA" : latestSubmittedId ? "✅ MUVAFFAQIYATLI (200)" : "💤 KUTILMOQDA"}</span>
              {latestSubmittedId && <span className="text-sky-400 font-bold">ID: {latestSubmittedId}</span>}
            </div>
          </div>
        </div>

        {/* Telegram Chat Mobile Mockup (Right Column) */}
        <div className="lg:col-span-7">
          <div className="w-full max-w-md mx-auto bg-[#0F172A] border border-white/10 rounded-[38px] p-3 shadow-2xl shadow-black/80 relative">
            
            {/* Phone Speaker & Camera Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-20 flex items-center justify-center gap-1.5">
              <span className="w-12 h-1 bg-white/20 rounded-full" />
              <span className="w-2.5 h-2.5 bg-white/10 rounded-full" />
            </div>

            {/* Simulated Phone Content Area */}
            <div className="bg-[#17212B] rounded-[30px] overflow-hidden flex flex-col h-[650px] relative border border-white/5">
              
              {/* Telegram App Header */}
              <div className="bg-[#1B2936] px-4 pt-8 pb-3 flex items-center justify-between border-b border-black/20 text-white shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-extrabold shadow-md">
                    🛡️
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-xs flex items-center gap-1">
                      SafeUZ Antinarkotik Bot 🤖
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </h4>
                    <span className="text-[10px] text-sky-400 font-mono font-medium">bot • online</span>
                  </div>
                </div>
                
                <button 
                  onClick={resetBotSession}
                  className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-all cursor-pointer"
                  title="Botni qayta yuklash"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Message Bubble Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-950/20">
                {messages.map((msg) => {
                  if (msg.isSystem) {
                    return (
                      <div key={msg.id} className="flex justify-center">
                        <span className="bg-[#1C2732] text-white/60 text-[10px] px-3 py-1 rounded-full font-sans font-medium max-w-[90%] text-center leading-normal">
                          {msg.text}
                        </span>
                      </div>
                    );
                  }

                  const isBot = msg.sender === "bot";
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isBot ? "justify-start" : "justify-end"} animate-fade-in`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-3 shadow-md relative group text-xs text-left ${
                        isBot 
                          ? "bg-[#182533] text-white rounded-tl-none border border-white/5" 
                          : "bg-[#2B5278] text-white rounded-tr-none border border-sky-400/10"
                      }`}>
                        
                        {/* Message Image attachment if any */}
                        {msg.image && (
                          <div className="mb-2 rounded-lg overflow-hidden border border-black/20">
                            <img src={msg.image} alt="Narkotrafik dalil" className="w-full h-32 object-cover" />
                          </div>
                        )}

                        {/* Message Text with proper linebreaks */}
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                        
                        {/* Location pin if attached */}
                        {msg.location && (
                          <div className="mt-2 p-2 bg-black/20 rounded-lg flex items-center gap-1.5 text-[11px] font-mono border border-white/5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300 font-bold">{msg.location.district}</span>
                          </div>
                        )}

                        {/* Timestamp */}
                        <span className="text-[9px] text-white/40 font-mono block text-right mt-1.5 leading-none">
                          {msg.timestamp}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Interactive Quick action Buttons based on step */}
              <div className="bg-[#17212B] p-3 border-t border-black/15 text-xs text-left shrink-0">
                <div className="space-y-2">
                  
                  {/* Step 1: Image Select */}
                  {botStep === "welcome" && (
                    <div className="space-y-2">
                      <span className="text-gray-400 text-[10px] font-mono block uppercase">📋 BOSQICH 1: RASM YUBLASH (Yoki o'tkazib yuborish):</span>
                      <div className="grid grid-cols-1 gap-2">
                        {SAMPLE_IMAGES.map((img) => (
                          <button
                            key={img.id}
                            onClick={() => handlePhotoStep(img.url)}
                            className="w-full bg-[#1F2E3E] hover:bg-[#2A3E54] text-white/90 p-2 rounded-xl text-left font-sans flex items-center gap-2.5 transition-all cursor-pointer border border-white/5"
                          >
                            <ImageIcon className="w-4 h-4 text-sky-400 shrink-0" />
                            <div className="truncate">
                              <p className="font-semibold text-[11px] truncate">{img.name}</p>
                              <p className="text-[9px] text-gray-400 truncate">{img.desc}</p>
                            </div>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-500 ml-auto shrink-0" />
                          </button>
                        ))}
                        
                        {/* Skip Image */}
                        <button
                          onClick={() => handlePhotoStep(null)}
                          className="w-full bg-[#243343] hover:bg-[#2E4257] text-sky-400 border border-sky-500/20 font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          ⏭️ Rasm yo'q (O'tkazib yuborish)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Comment Input / Templates */}
                  {botStep === "comment" && (
                    <div className="space-y-2 animate-fade-in">
                      <span className="text-gray-400 text-[10px] font-mono block uppercase">📋 BOSQICH 2: IZOH / TAVSIF:</span>
                      
                      {/* Suggestion Template Buttons */}
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          "Telegram narkotik boti (@narko_sirdaryo)",
                          "Sintetik dori vositalari savdosi guruhi",
                          "Ko'chada devordagi giyohvandlik reklama graffitisi",
                          "Narkotik moddalarni yashirayotgan shubhali shaxs (zakladka)"
                        ].map((tpl) => (
                          <button
                            key={tpl}
                            onClick={() => handleCommentStep(tpl)}
                            className="text-[10px] bg-[#1F2E3E] hover:bg-[#2A3E54] border border-white/5 text-gray-300 hover:text-white px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                          >
                            {tpl}
                          </button>
                        ))}
                      </div>

                      {/* Skip Comment */}
                      <button
                        onClick={() => handleCommentStep(null)}
                        className="w-full bg-[#243343] hover:bg-[#2E4257] text-sky-400 border border-sky-500/20 font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        ⏭️ Izohsiz o'tkazib yuborish
                      </button>
                    </div>
                  )}

                  {/* Step 3: Location Select */}
                  {botStep === "location" && (
                    <div className="space-y-2 animate-fade-in">
                      <span className="text-gray-400 text-[10px] font-mono block uppercase">📋 BOSQICH 3: SIRDARYO HUDUDINI BELGILASH:</span>
                      
                      <div className="grid grid-cols-2 gap-1.5 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                        {DISTRICTS.map((dst) => (
                          <button
                            key={dst}
                            onClick={() => handleLocationStep(dst)}
                            className="bg-[#1F2E3E] hover:bg-[#2A3E54] text-white p-1.5 rounded-lg font-semibold text-[10px] text-center transition-all cursor-pointer border border-white/5 truncate"
                          >
                            📍 {dst}
                          </button>
                        ))}
                      </div>

                      {/* Skip Location */}
                      <button
                        onClick={() => handleLocationStep(null)}
                        className="w-full bg-[#243343] hover:bg-[#2E4257] text-sky-400 border border-sky-500/20 font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        ⏭️ Lokatsiyasiz o'tkazib yuborish
                      </button>
                    </div>
                  )}

                  {/* Step 4: Confirm Submission */}
                  {botStep === "confirm" && (
                    <div className="space-y-2 animate-fade-in">
                      <span className="text-gray-400 text-[10px] font-mono block uppercase">📋 BOSQICH 4: TASDIQLASH:</span>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={resetBotSession}
                          className="flex-1 bg-[#2D1F1F] hover:bg-[#3E2A2A] border border-red-500/20 text-red-400 font-bold py-2.5 rounded-xl text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          ❌ Qayta boshlash
                        </button>
                        <button
                          onClick={handleConfirmStep}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/20"
                        >
                          🟢 Jo'natishni tasdiqlash
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submitting step */}
                  {botStep === "submitting" && (
                    <div className="py-4 text-center space-y-2 animate-pulse">
                      <RefreshCw className="w-6 h-6 text-sky-400 animate-spin mx-auto" />
                      <p className="text-[11px] text-gray-300 font-mono">Xabar tahlil qilinmoqda va bazaga sinxronlanmoqda...</p>
                    </div>
                  )}

                  {/* Done step / Reset button */}
                  {botStep === "done" && (
                    <div className="space-y-2 text-center py-2 animate-fade-in">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                        <Check className="w-6 h-6" />
                      </div>
                      <p className="text-emerald-400 font-bold text-xs">Murojaat Qabul Qilindi!</p>
                      
                      <button
                        onClick={resetBotSession}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl text-xs transition-all cursor-pointer mt-1"
                      >
                        🔄 Yangi xabar yuborish (Yaxshilangan Flow)
                      </button>
                    </div>
                  )}

                </div>
              </div>

              {/* Bot Text Input Field */}
              <div className="bg-[#1B2936] p-2.5 flex items-center gap-2 border-t border-black/20 shrink-0">
                <Smile className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
                
                <input
                  type="text"
                  placeholder={botStep === "comment" ? "Izoh yozing va jo'nating..." : "Matn kiritish faqat izoh qadamida ishlaydi..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSendText();
                  }}
                  disabled={botStep !== "comment"}
                  className="flex-1 bg-black/20 text-white outline-none border border-white/5 rounded-full px-3.5 py-1.5 text-xs focus:border-sky-500/50 placeholder-white/20"
                />
                
                <button
                  onClick={handleSendText}
                  disabled={!inputText.trim() || botStep !== "comment"}
                  className="p-1.5 bg-sky-500 text-white rounded-full hover:bg-sky-400 transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
