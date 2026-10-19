import React, { useEffect } from 'react';
import {
  X,
  Wheat,
  TrendingUp,
  Building2,
  Users,
  Truck,
  ShieldCheck,
  Camera,
  ShoppingBag,
  Mic,
  PhoneCall,
  MapPin,
  Globe,
  User,
  LogOut,
  ChevronRight,
  Sparkles,
  Compass,
  Navigation,
  CheckCircle2,
  Layers,
  Store,
  DollarSign,
  FileText,
  BadgeCheck,
} from 'lucide-react';
import { UserRole, Language, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange?: (newRole: UserRole) => void;
  currentUser: UserProfile | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenCropScanner?: () => void;
  onOpenSellProduce?: () => void;
  onOpenVoice: () => void;
  onOpenIVR: () => void;
  onOpenLogistics?: () => void;
  onStartDemoFlow?: () => void;
  onSignOut?: () => void;
  lotsCount?: number;
  offersCount?: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange,
  currentUser,
  language,
  onLanguageChange,
  activeTab,
  onNavigateTab,
  onOpenCropScanner,
  onOpenSellProduce,
  onOpenVoice,
  onOpenIVR,
  onOpenLogistics,
  onStartDemoFlow,
  onSignOut,
  lotsCount = 0,
  offersCount = 0,
}) => {
  const { t } = useLanguage();
  const {
    selectedCity,
    selectedCityId,
    selectCity,
    requestLocationAccess,
    isGpsActive,
    geolocationStatus,
    allCities,
  } = useLocation();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNav = (tab: string) => {
    onNavigateTab(tab);
    onClose();
  };

  const handleRole = (role: UserRole) => {
    if (onRoleChange) {
      onRoleChange(role);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex justify-end" id="mobile-navigation-drawer">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className="relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden text-left animate-in slide-in-from-right duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between border-b border-emerald-700/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Wheat className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-black text-lg tracking-tight text-white">
                  KisanSetu
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                  Mobile Hub
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">
                {language === 'te'
                  ? 'అన్ని ఎంపికలు & సేవల కేంద్రం'
                  : language === 'hi'
                  ? 'सभी विकल्प और सेवा केंद्र'
                  : 'All Portals, Tools & Mandi Services'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-5">
          {/* 1. USER PROFILE SUMMARY */}
          {currentUser && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white font-bold text-base flex items-center justify-center">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white">
                    ✓
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {currentUser.name}
                    </h4>
                    <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 truncate">
                    {currentUser.phone || currentUser.email || 'Verified Kisan Member'}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold truncate mt-0.5">
                    📍 {currentUser.location || selectedCity.name}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleNav('profile')}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>View Account & KYC Settings</span>
                </button>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold">
                  Active
                </span>
              </div>
            </div>
          )}

          {/* 2. ROLE & PORTAL SWITCHER */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Select Your Portal View:
              </span>
              <span className="text-[11px] font-bold text-emerald-700">
                Current: {currentRole === 'farmer' ? 'Farmer' : currentRole === 'market' || currentRole === 'market_admin' ? 'Market Admin' : currentRole === 'fpo' ? 'FPO Officer' : 'Member'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Farmer Portal */}
              <button
                type="button"
                onClick={() => {
                  handleRole('farmer');
                  handleNav('dashboard');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  currentRole === 'farmer'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  currentRole === 'farmer' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Wheat className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold truncate">Farmer Desk</span>
                  <span className="text-[10px] text-slate-500 block truncate">రైతు పోర్టల్</span>
                </div>
              </button>

              {/* Market Admin Portal */}
              <button
                type="button"
                onClick={() => {
                  handleRole('market');
                  handleNav('dashboard');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  currentRole === 'market' || currentRole === 'market_admin'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  currentRole === 'market' || currentRole === 'market_admin' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold truncate">Market Admin</span>
                  <span className="text-[10px] text-slate-500 block truncate">మార్కెట్ అడ్మిన్</span>
                </div>
              </button>

              {/* FPO Officer Desk */}
              <button
                type="button"
                onClick={() => {
                  handleRole('fpo');
                  handleNav('dashboard');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  currentRole === 'fpo'
                    ? 'bg-blue-50 border-blue-400 text-blue-950 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  currentRole === 'fpo' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold truncate">FPO Officer</span>
                  <span className="text-[10px] text-slate-500 block truncate">FPO సంఘం</span>
                </div>
              </button>

              {/* Transporter Desk */}
              <button
                type="button"
                onClick={() => {
                  handleRole('transporter');
                  handleNav('dashboard');
                }}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  currentRole === 'transporter'
                    ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-2xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  currentRole === 'transporter' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Truck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-bold truncate">Transporter</span>
                  <span className="text-[10px] text-slate-500 block truncate">రవాణాదారు</span>
                </div>
              </button>
            </div>
          </div>

          {/* 3. CORE NAVIGATION PAGES */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Core Application Pages:
            </span>

            {/* Home / Overview */}
            <button
              type="button"
              onClick={() => handleNav(currentRole === 'transporter' || currentRole === 'fpo' ? 'dashboard' : 'home')}
              className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className={`w-4 h-4 ${activeTab === 'home' ? 'text-amber-400' : 'text-slate-500'}`} />
                <div>
                  <span className="text-xs font-bold block">
                    {currentRole === 'transporter' ? 'Driver Partner Console' : currentRole === 'fpo' ? 'FPO Assayer Desk' : t('navHome')}
                  </span>
                  <span className={`text-[10px] block ${activeTab === 'home' ? 'text-slate-300' : 'text-slate-500'}`}>
                    {currentRole === 'transporter' ? 'Incoming farm bookings & active trips' : 'Overview & services'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            {/* In Transporter mode: Show Driver Desk & Hide Selling & Prices */}
            {currentRole === 'transporter' ? (
              <button
                type="button"
                onClick={() => handleNav('dashboard')}
                className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-bold shadow-xs'
                    : 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-4 h-4 text-slate-950" />
                  <div>
                    <span className="text-xs font-bold block">Rapido Freight Partner</span>
                    <span className="text-[10px] block text-amber-900">
                      Incoming farmer pickups, OTP verification & trips
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-950">
                  Driver
                </span>
              </button>
            ) : currentRole === 'fpo' ? (
              <button
                type="button"
                onClick={() => handleNav('dashboard')}
                className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-800 text-white border-blue-800 font-bold shadow-xs'
                    : 'bg-blue-50 border-blue-300 text-blue-950 hover:bg-blue-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-blue-300" />
                  <div>
                    <span className="text-xs font-bold block">Physical Checkup Desk</span>
                    <span className="text-[10px] block text-blue-800">
                      Incoming checkup notifications, assignment & certification
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 text-blue-950">
                  Assayer
                </span>
              </button>
            ) : (
              <>
                {/* Selling Desk for Farmers */}
                <button
                  type="button"
                  onClick={() => {
                    if (onRoleChange && currentRole !== 'farmer') onRoleChange('farmer');
                    handleNav('selling');
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                    activeTab === 'selling'
                      ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                      : 'bg-emerald-50/70 border-emerald-200/90 text-emerald-950 hover:bg-emerald-100/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wheat className={`w-4 h-4 ${activeTab === 'selling' ? 'text-amber-300' : 'text-emerald-700'}`} />
                    <div>
                      <span className="text-xs font-bold block">{t('navSelling')}</span>
                      <span className={`text-[10px] block ${activeTab === 'selling' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                        List harvest produce, view buyer offers & FPO visits
                      </span>
                    </div>
                  </div>
                  {(lotsCount > 0 || offersCount > 0) && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950">
                      {lotsCount + offersCount}
                    </span>
                  )}
                </button>

                {/* Live Mandi Rates */}
                <button
                  type="button"
                  onClick={() => handleNav('markets')}
                  className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                    activeTab === 'markets' || activeTab === 'prices'
                      ? 'bg-slate-900 text-white border-slate-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className={`w-4 h-4 ${activeTab === 'markets' || activeTab === 'prices' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <div>
                      <span className="text-xs font-bold block">{t('navExistingPrices')}</span>
                      <span className={`text-[10px] block ${activeTab === 'markets' || activeTab === 'prices' ? 'text-slate-300' : 'text-slate-500'}`}>
                        Live APMC Mandi rates, Warangal vegetables & trends
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                    Live
                  </span>
                </button>
              </>
            )}

            {/* Kisan Community Hub */}
            <button
              type="button"
              onClick={() => handleNav('community')}
              className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                activeTab === 'community'
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 ${activeTab === 'community' ? 'text-amber-400' : 'text-slate-600'}`} />
                <div>
                  <span className="text-xs font-bold block">{t('navCommunity')}</span>
                  <span className={`text-[10px] block ${activeTab === 'community' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Farmer feed, field updates, Q&A & direct chats
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>

            {/* Logistics & Shipment Tracking */}
            <button
              type="button"
              onClick={() => handleNav('tracking')}
              className={`w-full p-3 rounded-xl border text-left transition-colors flex items-center justify-between cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-slate-900 text-white border-slate-900 font-bold'
                  : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Truck className={`w-4 h-4 ${activeTab === 'tracking' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <div>
                  <span className="text-xs font-bold block">
                    {language === 'te' ? 'రవాణా ట్రాకింగ్' : language === 'hi' ? 'शिपमेंट ट्रैकिंग' : 'Track Shipment'}
                  </span>
                  <span className={`text-[10px] block ${activeTab === 'tracking' ? 'text-slate-300' : 'text-slate-500'}`}>
                    Live GPS transit, driver call & COD settlement
                  </span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </div>

          {/* 4. ONE-TAP SMART ACTIONS */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Quick Mobile Actions:
            </span>

            <div className="grid grid-cols-2 gap-2">
              {/* AI Crop Scanner */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenCropScanner) onOpenCropScanner();
                }}
                className="p-3 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl shadow-xs text-left cursor-pointer active:scale-95 transition-all flex flex-col justify-between"
              >
                <Camera className="w-5 h-5 text-amber-300 mb-2" />
                <div>
                  <span className="text-xs font-bold block">Crop Scanner</span>
                  <span className="text-[10px] text-emerald-100 block">AI Quality & Grade</span>
                </div>
              </button>

              {/* Sell Produce Modal */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenSellProduce) onOpenSellProduce();
                }}
                className="p-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl shadow-xs text-left cursor-pointer active:scale-95 transition-all flex flex-col justify-between"
              >
                <ShoppingBag className="w-5 h-5 text-emerald-400 mb-2" />
                <div>
                  <span className="text-xs font-bold block">Sell Produce</span>
                  <span className="text-[10px] text-slate-300 block">Direct Mandi Sale</span>
                </div>
              </button>

              {/* Voice Assistant */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenVoice();
                }}
                className="p-3 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-2xs text-left cursor-pointer hover:bg-slate-50 active:scale-95 transition-all flex flex-col justify-between"
              >
                <Mic className="w-5 h-5 text-emerald-600 mb-2" />
                <div>
                  <span className="text-xs font-bold block">Voice Assistant</span>
                  <span className="text-[10px] text-slate-500 block">Telugu, Hindi & EN</span>
                </div>
              </button>

              {/* IVR Simulator */}
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenIVR();
                }}
                className="p-3 bg-white border border-slate-200 text-slate-800 rounded-xl shadow-2xs text-left cursor-pointer hover:bg-slate-50 active:scale-95 transition-all flex flex-col justify-between"
              >
                <PhoneCall className="w-5 h-5 text-amber-600 mb-2" />
                <div>
                  <span className="text-xs font-bold block">IVR Simulator</span>
                  <span className="text-[10px] text-slate-500 block">Toll-Free Phone</span>
                </div>
              </button>
            </div>
          </div>

          {/* 5. LOCATION & MANDI HUB SELECTOR */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Market City & APMC Hub</span>
              </span>
              <button
                type="button"
                onClick={requestLocationAccess}
                disabled={geolocationStatus === 'detecting'}
                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3 h-3" />
                <span>{isGpsActive ? 'GPS Active' : 'Detect GPS'}</span>
              </button>
            </div>

            <select
              value={selectedCityId}
              onChange={(e) => {
                selectCity(e.target.value);
              }}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              aria-label="Select Market City"
            >
              {allCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} ({city.state}) {city.id === 'hyd' ? '• Primary Hub' : ''} {city.id === 'warangal' ? '• 🥬 Vegetables Hub' : ''}
                </option>
              ))}
            </select>

            <p className="text-[11px] text-slate-500 flex items-center justify-between">
              <span>Selected APMC: <strong>{selectedCity.name}</strong></span>
              <span className="text-emerald-700 font-semibold">{selectedCity.apmcOverview.totalActiveMandis} Mandis</span>
            </p>
          </div>

          {/* 6. LANGUAGE SELECTOR */}
          <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
              <Globe className="w-4 h-4 text-slate-500" />
              <span>Display Language (భాష / भाषा)</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onLanguageChange('en')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  language === 'en'
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('te')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  language === 'te'
                    ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                తెలుగు
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('hi')}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  language === 'hi'
                    ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                हिंदी
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Sticky Footer with Logout */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/90 shrink-0 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => handleNav('profile')}
            className="text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer flex items-center gap-1.5"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Profile & KYC</span>
          </button>

          {onSignOut && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onSignOut();
              }}
              className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              id="mobile-drawer-signout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
