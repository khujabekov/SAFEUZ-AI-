import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Video, AlertTriangle, Activity, Users, ShieldAlert,
  Camera, MapPin, Clock, Download, Trash2, Eye, Play, Pause,
  Focus, Fingerprint, Radar, ChevronRight, CheckCircle2
} from "lucide-react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CAMERAS = [
  { id: "cam-1", name: "Asosiy Kirish (Webcam)", location: "Toshkent, Chilonzor", status: "online", rtsp: "rtsp://..." },
  { id: "cam-2", name: "Avtoturargoh (Zona B)", location: "Toshkent, Chilonzor", status: "online", rtsp: "rtsp://..." },
  { id: "cam-3", name: "Koridor (2-qavat)", location: "Toshkent, Chilonzor", status: "online", rtsp: "rtsp://..." },
  { id: "cam-4", name: "Orqa hovli", location: "Toshkent, Chilonzor", status: "offline", rtsp: "rtsp://..." }
];

interface SuspiciousVideo {
  id: string;
  cameraId: string;
  cameraName: string;
  timestamp: string;
  riskScore: number;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
}

interface AIEvent {
  id: string;
  time: string;
  action: string;
  confidence: number;
  riskScore: number;
  isHighRisk: boolean;
}

export function CamerasModule() {
  const [selectedCamera, setSelectedCamera] = useState<any | null>(null);
  const [suspiciousVideos, setSuspiciousVideos] = useState<SuspiciousVideo[]>([]);
  const [aiEvents, setAiEvents] = useState<AIEvent[]>([]);
  
  const [objectsCount, setObjectsCount] = useState({ people: 0, bags: 0, vehicles: 0 });
  const [trackedPeople, setTrackedPeople] = useState<string[]>([]);
  const [currentRiskScore, setCurrentRiskScore] = useState(12);
  const [aiConfidence, setAiConfidence] = useState(98);
  const [isPlaying, setIsPlaying] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  // Webcam & Recording Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const isRecordingEventRef = useRef<boolean>(false);
  const eventTimeoutRef = useRef<any>(null);

  useEffect(() => {
    // Generate initial suspicious videos
    setSuspiciousVideos([
      {
        id: "vid-1",
        cameraId: "cam-1",
        cameraName: "Asosiy Kirish (Janubiy)",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toLocaleTimeString(), // 30 mins ago
        riskScore: 85,
        description: "Ta'qiqlangan hududga kirish harakati",
        thumbnailUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80"
      },
      {
        id: "vid-2",
        cameraId: "cam-2",
        cameraName: "Avtoturargoh (Zona B)",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toLocaleTimeString(), // 2 hours ago
        riskScore: 92,
        description: "Shubhali paket qoldirildi va shaxs uzoqlashdi",
        thumbnailUrl: "https://images.unsplash.com/photo-1494252713559-f26b4bf0b174?w=400&q=80"
      }
    ]);
  }, []);

  // Webcam logic
  useEffect(() => {
    if (selectedCamera?.id === "cam-1" && isPlaying) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          
          try {
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];
            
            mediaRecorder.ondataavailable = (e) => {
              if (e.data.size > 0) {
                chunksRef.current.push(e.data);
                // Keep rolling buffer of roughly 20 chunks (assuming 1s per chunk)
                if (!isRecordingEventRef.current && chunksRef.current.length > 20) {
                  chunksRef.current.shift();
                }
              }
            };
            
            mediaRecorder.start(1000); // 1 chunk per second
          } catch (err) {
            console.error("MediaRecorder init error:", err);
          }
        })
        .catch(err => console.error("Webcam init error:", err));
        
      return () => {
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stop();
        }
        if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
        }
        if (eventTimeoutRef.current) {
          clearTimeout(eventTimeoutRef.current);
        }
      };
    }
  }, [selectedCamera, isPlaying]);

  // Simulate AI Analysis and Tracking
  useEffect(() => {
    if (!selectedCamera || !isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    
    // Simulate tracked entities
    const entities = [
      { id: "Person #1", type: "person", x: 100, y: 150, w: 80, h: 200, dx: 0.5, dy: 0.2, color: "#00ff00", conf: 99, action: "Oddiy harakat", risk: 10 },
      { id: "Person #2", type: "person", x: 400, y: 200, w: 70, h: 180, dx: -0.3, dy: 0, color: "#00ff00", conf: 95, action: "Kutmoqda", risk: 30 },
      { id: "Bag #1", type: "bag", x: 420, y: 350, w: 40, h: 40, dx: 0, dy: 0, color: "#ffaa00", conf: 88, action: "Qoldirilgan", risk: 40 }
    ];

    setTrackedPeople(["Person #1", "Person #2"]);
    setObjectsCount({ people: 2, bags: 1, vehicles: 0 });

    const renderLoop = () => {
      frame++;
      
      // Update dimensions to match container
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid / tech background slightly
      ctx.strokeStyle = "rgba(0, 255, 0, 0.05)";
      ctx.lineWidth = 1;
      for(let i=0; i<canvas.width; i+=40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for(let i=0; i<canvas.height; i+=40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      let maxRisk = 12;

      entities.forEach(ent => {
        // Move
        ent.x += ent.dx;
        ent.y += ent.dy;
        
        // Bounce
        if (ent.x <= 0 || ent.x + ent.w >= canvas.width) ent.dx *= -1;
        if (ent.y <= 0 || ent.y + ent.h >= canvas.height) ent.dy *= -1;

        // Simulate suspicious behavior randomly
        if (ent.id === "Person #2" && frame % 300 === 0) {
          ent.color = "#ff0000";
          ent.action = "Atrofni shubhali kuzatish, yashirin harakat";
          ent.risk = 85;
          maxRisk = Math.max(maxRisk, ent.risk);
          
          const timeStr = new Date().toLocaleTimeString();
          
          const newEvent = {
            id: Date.now().toString(),
            time: timeStr,
            action: `${ent.id}: Atrofni shubhali kuzatish`,
            confidence: 96,
            riskScore: ent.risk,
            isHighRisk: true
          };
          setAiEvents(prev => [newEvent, ...prev].slice(0, 50));
          
          if (!isRecordingEventRef.current && selectedCamera.id === "cam-1" && mediaRecorderRef.current) {
            isRecordingEventRef.current = true;
            
            // Generate video record ID
            const vidId = `vid-${Date.now()}`;
            
            // Start a timer for 10 seconds to collect the "after" footage
            eventTimeoutRef.current = setTimeout(async () => {
              isRecordingEventRef.current = false;
              
              if (chunksRef.current.length > 0) {
                try {
                  const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                  // Keep only latest 20 chunks
                  chunksRef.current = chunksRef.current.slice(-20);
                  
                  // Upload to Firebase Storage
                  if (storage) {
                    const videoRefStorage = ref(storage, `suspicious_videos/${vidId}.webm`);
                    await uploadBytes(videoRefStorage, blob);
                    const downloadUrl = await getDownloadURL(videoRefStorage);
                    
                    const newVideo: SuspiciousVideo = {
                      id: vidId,
                      cameraId: selectedCamera.id,
                      cameraName: selectedCamera.name,
                      timestamp: timeStr,
                      riskScore: ent.risk,
                      description: "Shubhali xatti-harakat: Atrofni kuzatib, asabiy holatda uzoq vaqt turish va yashirinish",
                      thumbnailUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80",
                      videoUrl: downloadUrl // Custom property for future use
                    };
                    setSuspiciousVideos(prev => [newVideo, ...prev]);
                    console.log("Video saved to Firebase successfully");
                  }
                } catch (err) {
                  console.error("Video upload error:", err);
                }
              }
            }, 10000); // 10 seconds after event
          } else if (!isRecordingEventRef.current) {
            const newVideo: SuspiciousVideo = {
              id: `vid-${Date.now()}`,
              cameraId: selectedCamera.id,
              cameraName: selectedCamera.name,
              timestamp: timeStr,
              riskScore: ent.risk,
              description: "Shubhali xatti-harakat: Atrofni kuzatib, asabiy holatda uzoq vaqt turish va yashirinish",
              thumbnailUrl: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80"
            };
            setSuspiciousVideos(prev => [newVideo, ...prev]);
          }
          
          setTimeout(() => {
            ent.color = "#00ff00";
            ent.action = "Oddiy harakat";
            ent.risk = 20;
          }, 5000);
        }

        maxRisk = Math.max(maxRisk, ent.risk);

        // Draw bounding box
        ctx.strokeStyle = ent.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(ent.x, ent.y, ent.w, ent.h);
        
        // Draw corners
        const cornerLen = 10;
        ctx.lineWidth = 4;
        ctx.beginPath();
        // TL
        ctx.moveTo(ent.x, ent.y + cornerLen); ctx.lineTo(ent.x, ent.y); ctx.lineTo(ent.x + cornerLen, ent.y);
        // TR
        ctx.moveTo(ent.x + ent.w - cornerLen, ent.y); ctx.lineTo(ent.x + ent.w, ent.y); ctx.lineTo(ent.x + ent.w, ent.y + cornerLen);
        // BL
        ctx.moveTo(ent.x, ent.y + ent.h - cornerLen); ctx.lineTo(ent.x, ent.y + ent.h); ctx.lineTo(ent.x + cornerLen, ent.y + ent.h);
        // BR
        ctx.moveTo(ent.x + ent.w - cornerLen, ent.y + ent.h); ctx.lineTo(ent.x + ent.w, ent.y + ent.h); ctx.lineTo(ent.x + ent.w, ent.y + ent.h - cornerLen);
        ctx.stroke();

        // Label bg
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(ent.x, ent.y - 25, 140, 20);
        
        // Label text
        ctx.fillStyle = ent.color;
        ctx.font = "12px monospace";
        ctx.fillText(`${ent.id} | ${ent.conf}%`, ent.x + 5, ent.y - 10);
      });

      setCurrentRiskScore(maxRisk);

      animationRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [selectedCamera, isPlaying]);

  return (
    <div className="w-full text-white h-full flex flex-col space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-sans tracking-tight text-white flex items-center gap-3">
            <Video className="w-8 h-8 text-blue-500" />
            AI Kameralar Nazorati
          </h2>
          <p className="text-gray-400 mt-1 text-sm max-w-2xl">
            Sun'iy intellekt orqali kameralarni real vaqt rejimida tahlil qilish, obyektlarni kuzatish va shubhali xatti-harakatlarni aniqlash tizimi.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-2">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          <div className="text-sm">
            <div className="text-gray-400 text-xs">Tizim holati</div>
            <div className="font-medium text-green-400">Faol | AI Monitor</div>
          </div>
        </div>
      </div>

      {!selectedCamera ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CAMERAS.map(cam => (
            <div 
              key={cam.id} 
              onClick={() => cam.status === "online" && setSelectedCamera(cam)}
              className={`bg-black/30 border ${cam.status === "online" ? "border-white/10 hover:border-blue-500 cursor-pointer" : "border-red-500/20 opacity-60"} rounded-2xl p-4 transition-all group`}
            >
              <div className="aspect-video bg-gray-900 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-white/5 group-hover:border-blue-500/50 transition-all">
                {cam.status === "online" ? (
                  <>
                    <img src={`https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80`} alt="camera view" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                    <Play className="w-10 h-10 text-white/70 absolute opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                  </>
                ) : (
                  <div className="text-red-500/70 flex flex-col items-center gap-2">
                    <Video className="w-8 h-8" />
                    <span className="text-xs font-medium uppercase tracking-wider">OFFLINE</span>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider">
                  <div className={`w-2 h-2 rounded-full ${cam.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  {cam.status}
                </div>
              </div>
              <h3 className="font-semibold text-lg text-white mb-1 group-hover:text-blue-400 transition-colors">{cam.name}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                {cam.location}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-[calc(100vh-140px)] min-h-[700px]">
          
          {/* Main View Area */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            
            {/* Top Bar for View */}
            <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-2xl p-3 px-5">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedCamera(null)}
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" /> Orqaga
                </button>
                <div className="h-6 w-px bg-white/10" />
                <div className="flex items-center gap-2 text-blue-400 font-medium">
                  <Camera className="w-5 h-5" />
                  {selectedCamera.name}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg text-xs font-mono">
                  <Focus className="w-4 h-4" /> AI TRACKING FAOL
                </div>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                </button>
              </div>
            </div>

            {/* Video Canvas Container */}
            <div className="flex-1 bg-black rounded-3xl border border-white/10 overflow-hidden relative group">
              {/* Fake or Real video background */}
              {selectedCamera?.id === "cam-1" ? (
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover ${!isPlaying && 'grayscale'}`}
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=1600&q=80" 
                  alt="Feed" 
                  className={`w-full h-full object-cover opacity-40 ${!isPlaying && 'grayscale'}`} 
                />
              )}
              
              {/* Canvas Overlay for AI Bounding Boxes */}
              <canvas 
                ref={canvasRef} 
                className="absolute inset-0 w-full h-full pointer-events-none"
              />

              {/* Status Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 flex items-center gap-2 text-xs font-mono text-white/90 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  LIVE REC
                </div>
                <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/5 text-xs font-mono text-green-400 flex items-center gap-2 shadow-lg">
                  <Radar className="w-4 h-4" />
                  AI CONF: {aiConfidence}%
                </div>
              </div>

              {/* Bottom Info Bar Overlay */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20 flex justify-between items-end">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-blue-400/70 font-semibold">Odamlar</div>
                      <div className="font-mono text-lg leading-none mt-0.5">{objectsCount.people} ta</div>
                    </div>
                  </div>
                  <div className="bg-amber-500/20 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-xl backdrop-blur-md flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-amber-400/70 font-semibold">Buyumlar</div>
                      <div className="font-mono text-lg leading-none mt-0.5">{objectsCount.bags} ta</div>
                    </div>
                  </div>
                </div>
                <div className="text-white/50 text-xs font-mono">
                  RES: 1080p | FPS: 30 | BITRATE: 4.2Mbps
                </div>
              </div>
            </div>

            {/* AI Events Timeline */}
            <div className="bg-black/30 border border-white/10 rounded-3xl p-5 shrink-0 overflow-x-auto">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                AI Hodisalar Tarixi
              </h3>
              <div className="flex gap-4">
                <AnimatePresence>
                  {aiEvents.length === 0 ? (
                    <div className="text-gray-500 text-sm py-4">Hozircha hodisalar yo'q...</div>
                  ) : (
                    aiEvents.map(event => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={event.id}
                        className={`min-w-[280px] p-4 rounded-2xl border ${event.isHighRisk ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'} flex flex-col gap-2`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="text-xs text-gray-400">{event.time}</div>
                          <div className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${event.isHighRisk ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/60'}`}>
                            Risk: {event.riskScore}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-white/90 leading-snug">
                          {event.action}
                        </div>
                        <div className="text-xs text-blue-400/80 font-mono flex items-center gap-1 mt-auto">
                          <Radar className="w-3 h-3" /> Conf: {event.confidence}%
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Panel: AI Analysis & Suspicious Videos */}
          <div className="flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
            
            {/* Risk Score Widget */}
            <div className="bg-black/30 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <ShieldAlert className="w-32 h-32 text-red-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">Joriy Xavf Darajasi (Risk Score)</h3>
              
              <div className="flex items-end gap-4 mb-4">
                <div className={`text-6xl font-bold font-mono tracking-tighter ${
                  currentRiskScore > 75 ? 'text-red-500' : currentRiskScore > 40 ? 'text-amber-500' : 'text-green-500'
                }`}>
                  {currentRiskScore}
                </div>
                <div className="text-gray-500 text-sm mb-2 font-medium">/ 100</div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                <div 
                  className={`h-full transition-all duration-500 ${
                    currentRiskScore > 75 ? 'bg-red-500' : currentRiskScore > 40 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${currentRiskScore}%` }}
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-blue-400 font-medium mb-1 text-sm">
                  <Fingerprint className="w-4 h-4" />
                  AI Izohi
                </div>
                <p className="text-xs text-blue-200/70 leading-relaxed">
                  {currentRiskScore > 75 
                    ? "Diqqat! Shubhali xatti-harakat aniqlandi. Shaxs atrofni kuzatib, asabiy holatda." 
                    : "Hozirda hududda odatiy harakatlar kuzatilmoqda. Maxsus shubhali holatlar mavjud emas."}
                </p>
              </div>
            </div>

            {/* Tracked Entities */}
            <div className="bg-black/30 border border-white/10 rounded-3xl p-6">
              <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider flex items-center justify-between">
                <span>Kuzatilayotgan Shaxslar</span>
                <span className="bg-white/10 text-white/70 px-2 py-0.5 rounded text-xs">{trackedPeople.length}</span>
              </h3>
              <div className="space-y-3">
                {trackedPeople.map(person => (
                  <div key={person} className="bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center group hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white/90">{person}</div>
                        <div className="text-xs text-green-400 font-mono">ID Tracker: faol</div>
                      </div>
                    </div>
                    <button className="text-gray-500 hover:text-white transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Suspicious Videos Archive */}
            <div className="bg-black/30 border border-white/10 rounded-3xl p-6 flex-1 flex flex-col min-h-[300px]">
              <h3 className="text-sm font-medium text-red-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Shubhali Videolar
              </h3>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-1">
                {suspiciousVideos.map(video => (
                  <div key={video.id} className="bg-black/40 border border-red-500/20 rounded-2xl overflow-hidden group">
                    <div className="h-24 relative">
                      <img src={video.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-xs text-white/90 font-medium">
                        <Camera className="w-3 h-3 text-red-400" />
                        {video.cameraName}
                      </div>
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Risk: {video.riskScore}
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="text-xs text-gray-400 mb-1">{video.timestamp}</div>
                      <p className="text-sm text-white/90 leading-tight mb-3 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex gap-2">
                        {video.videoUrl ? (
                          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-white/5 hover:bg-white/10 text-white py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1">
                            <Play className="w-3 h-3" /> Ko'rish
                          </a>
                        ) : (
                          <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1">
                            <Eye className="w-3 h-3" /> Ko'rish
                          </button>
                        )}
                        {video.videoUrl ? (
                          <a href={video.videoUrl} download={`video-${video.id}.webm`} className="flex-1 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 text-white py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1">
                            <Download className="w-3 h-3" /> Yuklash
                          </a>
                        ) : (
                          <button className="flex-1 bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 text-white py-1.5 rounded-lg text-xs font-medium transition-colors flex justify-center items-center gap-1">
                            <Download className="w-3 h-3" /> Yuklash
                          </button>
                        )}
                        <button className="bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-gray-400 py-1.5 px-2.5 rounded-lg text-xs transition-colors flex justify-center items-center">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
