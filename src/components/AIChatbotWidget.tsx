import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, ShieldAlert, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import safeUzLogo from "../assets/images/safeuz_logo_1782537166156.jpg";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

export default function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "👋 Assalomu alaykum! SafeUZ AI platformasining rasmiy sun'iy intellekt yordamchisiman.\n\nSizga platformadan foydalanish, shubhali holatlar bo'yicha hisobot yuborish tartibi yoki AI imkoniyatlari haqida qanday yordam bera olaman? 😊",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const updatedMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, {
          role: "assistant",
          content: data.reply || "Kechirasiz, muammo yuz berdi.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      } else {
        throw new Error("API xatosi");
      }
    } catch (err) {
      console.error("Chatbot xatoligi:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Tarmoq xatoligi yoki xizmat faol emas. Iltimos qayta urinib ko'ring.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestionChips = [
    { label: "Qanday yuboraman? 📸", value: "Qanday yuboraman?" },
    { label: "AI nima qiladi? 🤖", value: "AI nima qiladi?" },
    { label: "Ma'lumotlarim saqlanadimi? 🔒", value: "Ma'lumotlarim saqlanadimi?" }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-[360px] max-w-[calc(100vw-32px)] h-[500px] bg-[#0A111F] border border-blue-500/30 rounded-3xl shadow-[0_0_50px_rgba(30,144,255,0.15)] flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-950 to-slate-900 border-b border-white/5 p-4 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <img 
                      src={safeUzLogo} 
                      alt="SafeUZ AI Logo" 
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0A111F] rounded-full animate-pulse" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white font-display flex items-center gap-1">
                    SafeUZ <span className="text-blue-400 text-[9px] bg-blue-500/10 px-1 rounded font-mono uppercase tracking-wider">AI</span>
                  </h3>
                  <p className="text-[9px] text-emerald-400 font-mono">Rasmiy Virtual Yordamchi</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/40 hover:text-white cursor-pointer bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((m, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role !== 'user' && (
                    <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div className="max-w-[80%] space-y-1">
                    <div className={`p-3 rounded-2xl text-[11px] leading-relaxed font-sans ${
                      m.role === 'user' 
                        ? 'bg-blue-600 text-white rounded-tr-none' 
                        : 'bg-[#131D2E] text-gray-100 border border-white/5 rounded-tl-none whitespace-pre-wrap'
                    }`}>
                      {m.content}
                    </div>
                    <div className={`text-[8px] text-gray-500 font-mono ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                      {m.time}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-400/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#131D2E] border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Suggested Chips */}
            <div className="px-4 py-2 border-t border-white/5 bg-[#131D2E]/20 flex flex-wrap gap-1.5">
              {suggestionChips.map((chip, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(chip.value)}
                  className="bg-[#131D2E]/80 hover:bg-blue-600/10 border border-white/5 hover:border-blue-500/30 text-white/70 hover:text-white rounded-full px-2.5 py-1 text-[9px] cursor-pointer transition-all whitespace-nowrap"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
              className="p-3 border-t border-white/5 bg-black/40 flex gap-2 items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Savolingizni yozing..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white placeholder-white/20 outline-none focus:border-blue-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8.5 h-8.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/5 disabled:text-white/20 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-md flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-blue-400/20 relative group"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="bot"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hover label */}
        <span className="absolute right-16 bg-[#0A111F] border border-blue-500/20 text-white text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md font-medium">
          Virtual Yordamchi 🤖
        </span>
      </motion.button>
    </div>
  );
}
