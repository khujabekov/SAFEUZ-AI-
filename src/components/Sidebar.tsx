import React from "react";
import safeUzLogo from "../assets/images/safeuz_logo_1782537166156.jpg";
import { 
  ShieldAlert, 
  Home, 
  Info, 
  Settings,
  HelpCircle,
  PhoneCall, 
  Cpu,
  Users,
  Activity,
  FileText,
  Map,
  User,
  Navigation,
  Upload,
  History,
  BarChart2,
  Bell,
  Award,
  Radar,
  Lock,
  LayoutDashboard,
  Key,
  ClipboardList,
  Database,
  FileCode,
  CheckCircle,
  Sparkles,
  Plus,
  X,
  Video
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenLoginModal: () => void;
  isLoggedIn: boolean;
  dashboardRole: "inspector" | "admin";
  onLogout: () => void;
  inspectorName?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  onOpenLoginModal,
  isLoggedIn,
  dashboardRole,
  onLogout,
  inspectorName,
  isOpen,
  onClose
}: SidebarProps) {

  // Menu items for logged out visitors
  const publicMenuItems = [
    { key: "home", label: "Bosh sahifa", icon: Home },
    { key: "about", label: "SafeUZ AI haqida", icon: Info },
    { key: "features", label: "Imkoniyatlar", icon: Settings },
    { key: "how-it-works", label: "AI qanday ishlaydi", icon: Cpu },
    { key: "faq", label: "FAQ", icon: HelpCircle },
    { key: "contact", label: "Bog'lanish", icon: PhoneCall },
  ];

  // Menu items for Administrator (strictly Inspectors, Incidents, AI, Telegram Bot, Reports, Analytics, Settings as requested)
  const adminMenuItems = [
    { key: "admin-dashboard", label: "Boshqaruv Paneli", icon: LayoutDashboard },
    { key: "volunteer-management", label: "Volontyorlar", icon: Users },
    { key: "incident-management", label: "Incidents Jurnali", icon: ClipboardList },
    { key: "case-investigation", label: "Tergov Markazi", icon: ShieldAlert },
    { key: "inspector-management", label: "Kiber-Inspektorlar", icon: User },
    { key: "cameras", label: "📹 Kameralar Nazorati", icon: Video },
    { key: "admin-analytics", label: "Kiber-Analitika", icon: BarChart2 }
  ];

  // Menu items for Inspector (strictly Assigned Cases, GPS, Navigation, Investigation Form items)
  const inspectorMenuItems = [
    { key: "inspector-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "assigned-cases", label: "Menga Biriktirilgan Ishlar", icon: ClipboardList },
    { key: "my-district", label: "Mening Shaxsiy Tumanim", icon: MapPin },
    { key: "inspector-gis-map", label: "GIS Xaritasi", icon: Map },
    { key: "inspector-navigation", label: "GPS Navigatsiya", icon: Navigation },
    { key: "evidence-upload", label: "Dalillar Yuklash", icon: Upload }
  ];

  // Determine current active menu
  const getMenuItems = () => {
    if (!isLoggedIn) return publicMenuItems;
    if (dashboardRole === "admin") return adminMenuItems;
    return inspectorMenuItems;
  };

  const menuItems = getMenuItems();

  const handleTabClick = (key: string) => {
    setActiveTab(key);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      <aside 
        id="left-sidebar" 
        className={`fixed inset-y-0 left-0 w-72 bg-[#0E1726] border-r border-white/10 flex flex-col justify-between shrink-0 h-screen z-50 p-6 shadow-2xl overflow-y-auto transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:w-64 lg:z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo & Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-[#131D2E] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group cursor-pointer border border-white/10">
                <img 
                  src={safeUzLogo} 
                  alt="SafeUZ AI Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10B981] border-2 border-[#0E1726] rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-blue-500 leading-none">
                  SafeUZ <span className="text-[#3B82F6] font-semibold text-xs bg-blue-500/10 px-1 py-0.5 rounded">AI</span>
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold mt-1">
                  {isLoggedIn ? `${dashboardRole.toUpperCase()} PORTAL` : "Threat Intelligence"}
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onClose && (
              <button 
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 border border-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = (item as any).icon;
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => handleTabClick(item.key)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer text-left relative group ${
                    isActive
                      ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                  }`} />
                  
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

      {/* Footer / Account Actions */}
      <div className="border-t border-white/5 pt-5 mt-6">
        {isLoggedIn ? (
          <div className="space-y-3">
            {inspectorName && dashboardRole === "inspector" && (
              <div className="bg-white/5 border border-white/10 p-3 rounded-xl text-center">
                <span className="block text-[10px] text-gray-400 font-mono">Tizimga kirilgan:</span>
                <span className="block text-sm font-bold text-blue-400 truncate">{inspectorName}</span>
              </div>
            )}
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/30 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
            >
              Chiqish (Logout) 🚪
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLoginModal}
            className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/90 border border-white/10 hover:border-blue-500/20 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all"
          >
            🔐 Kirish
          </button>
        )}
      </div>
    </aside>
  </>
);
}

// Dummy elements to avoid compile errors
const Trophy = (props: any) => <Award {...props} />;
const Globe = (props: any) => <GlobeIcon {...props} />;
const GlobeIcon = (props: any) => <Activity {...props} />;
const MapPin = (props: any) => <Navigation {...props} />;
