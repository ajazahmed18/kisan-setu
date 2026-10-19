import React, { useState, useRef, useEffect } from 'react';
import {
  UserRole,
  Language,
  UserProfile,
} from '../types';
import {
  PhoneCall,
  Mic,
  ShieldCheck,
  Bell,
  Truck,
  Building2,
  User,
  Wheat,
  Globe,
  CheckCircle2,
  LogOut,
  LogIn,
  Camera,
  Crop as CropIcon,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  BadgeCheck,
  ArrowLeftRight,
  Sparkles,
  TrendingUp,
  ArrowLeft,
  X,
  Menu,
} from 'lucide-react';
import { CloudSyncIndicator } from './CloudSyncIndicator';
import { useLanguage } from '../context/LanguageContext';
import { useLocation } from '../context/LocationContext';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange?: (newRole: UserRole) => void;
  currentUser: UserProfile | null;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenIVR: () => void;
  onOpenVoice: () => void;
  onStartDemoFlow?: () => void;
  pendingOffersCount: number;
  onNavigateTab: (tab: string) => void;
  activeTab: string;
  onOpenCropScanner?: () => void;
  onOpenSellProduce?: () => void;
  onOpenMarketAdmin?: () => void;
  onSignOut?: () => void;
  onOpenLogin?: () => void;
  lastSyncedAt?: Date;
  isSyncing?: boolean;
  onRefreshData?: () => Promise<void>;
  onOpenMobileDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  currentUser,
  language,
  onLanguageChange,
  onOpenIVR,
  onOpenVoice,
  onStartDemoFlow,
  pendingOffersCount,
  onNavigateTab,
  activeTab,
  onOpenCropScanner,
  onOpenSellProduce,
  onOpenMarketAdmin,
  onSignOut,
  onOpenLogin,
  lastSyncedAt,
  isSyncing,
  onRefreshData,
  onOpenMobileDrawer,
}) => {
  const { t } = useLanguage();
  const {
    selectedCity,
    selectedCityId,
    selectCity,
    requestLocationAccess,
    isGpsActive,
    allCities,
  } = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserMenu]);

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        return language === 'te' ? 'రైతు' : language === 'hi' ? 'किसान' : 'Farmer';
      case 'fpo':
        return language === 'te' ? 'FPO సంఘం' : language === 'hi' ? 'FPO संगठन' : 'FPO Co-Op';
      case 'market':
        return language === 'te' ? 'మార్కెట్ అడ్మిన్' : language === 'hi' ? 'मार्केट एडमिन' : 'Market Admin';
      case 'transporter':
        return language === 'te' ? 'రవాణాదారు' : language === 'hi' ? 'ट्रांसपोर्टर' : 'Transporter';
      case 'admin':
        return language === 'te' ? 'అడ్మిన్' : language === 'hi' ? 'एडमिन' : 'Admin Portal';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        return <Wheat className="w-4 h-4 text-emerald-700" />;
      case 'fpo':
        return <Building2 className="w-4 h-4 text-blue-700" />;
      case 'market':
        return <Building2 className="w-4 h-4 text-emerald-700" />;
      case 'transporter':
        return <Truck className="w-4 h-4 text-amber-700" />;
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-rose-700" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Wheat className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t('appName')}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                {language === 'te' ? 'స్మార్ట్ మార్కెట్ & ధరల వేదిక' : language === 'hi' ? 'स्मार्ट कृषि बाजार और मूल्य खोज' : 'Smart Market Linkage & Price Discovery'}
              </p>
            </div>
          </button>

          {/* Quick Navigation Links */}
          <nav className="hidden lg:flex items-center ml-4 pl-4 border-l border-slate-200 gap-1.5 text-xs font-medium">
            <button
              type="button"
              onClick={() => onNavigateTab(currentRole === 'transporter' || currentRole === 'fpo' ? 'dashboard' : 'home')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {currentRole === 'transporter' ? 'Driver Desk' : currentRole === 'fpo' ? 'Assayer Desk' : t('navHome')}
            </button>

            {/* In Transporter mode: NO PRICES and NO SELLING. Show Rapido Driver Console */}
            {currentRole === 'transporter' && (
              <button
                type="button"
                id="header-nav-transporter-desk"
                onClick={() => {
                  onNavigateTab('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-amber-900 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 border border-amber-300'
                }`}
                title="Rapido-style Driver Partner Desk (Incoming Farmer Bookings Only, No Market Prices)"
              >
                <Truck className="w-3.5 h-3.5 text-slate-950" />
                <span>Rapido Freight Partner</span>
              </button>
            )}

            {/* SELLING PAGE LINK (Shown for farmers/buyers, NOT transporters) */}
            {currentRole !== 'transporter' && currentRole !== 'fpo' && (
              <button
                type="button"
                id="header-nav-selling-page"
                onClick={() => {
                  if (onRoleChange && currentRole !== 'farmer' && currentRole !== 'fpo') {
                    onRoleChange('farmer');
                  }
                  onNavigateTab('selling');
                }}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                  activeTab === 'selling' || (activeTab === 'dashboard' && currentRole === 'farmer')
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-emerald-800 hover:text-emerald-950 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80'
                }`}
                title="Open Selling Page: List harvest produce, create crop lots, track buyer offers and FPO requests"
              >
                <Wheat className="w-3.5 h-3.5" />
                <span>{t('navSelling')}</span>
              </button>
            )}

            {/* EXISTING PRICES PAGE LINK (Shown for farmers & traders, NEVER for transporters) */}
            {currentRole !== 'transporter' && currentRole !== 'fpo' && (
              <button
                type="button"
                id="header-nav-existing-prices-page"
                onClick={() => {
                  onNavigateTab('markets');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                  activeTab === 'prices' || activeTab === 'markets'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Open Existing Prices Page: Live APMC mandi rates, vegetable board & trends"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t('navExistingPrices')}</span>
              </button>
            )}

            {currentRole === 'fpo' && (
              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-800 text-white shadow-xs'
                    : 'text-blue-900 bg-blue-50 border border-blue-200'
                }`}
                id="header-nav-fpo-desk"
                title="Open FPO Physical Quality Checkup Portal"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-300" />
                <span>Physical Checkup Desk</span>
              </button>
            )}

            {(currentRole === 'market' || currentRole === 'market_admin') && (
              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
                id="header-nav-market-admin-desk"
                title="Open Market Admin Desk & Manage Vegetable Rates"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === 'te' ? 'మార్కెట్ అడ్మిన్' : language === 'hi' ? 'मार्केट एडमिन' : 'Market Admin'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onNavigateTab('community')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'community'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold'
              }`}
            >
              <span>{t('navCommunity')}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('tracking')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tracking'
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold'
              }`}
              id="header-nav-track-shipment"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'te' ? 'రవాణా ట్రాకింగ్' : language === 'hi' ? 'शिपमेंट ट्रैकिंग' : 'Track Shipment'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </nav>
        </div>

        {/* Right Actions: Sell, Buy, Voice Assistant, Language, Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Voice Assistant Mic Button */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-200 shadow-2xs cursor-pointer"
            title="Ask via voice in Telugu, Hindi or English with dialect tolerance"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">{t('navVoiceAssistant')}</span>
          </button>

          {/* IVR Phone Simulator Button */}
          <button
            onClick={onOpenIVR}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-all border border-slate-200 shadow-2xs cursor-pointer"
            title="Non-Smartphone IVR Simulator"
          >
            <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">{t('navIvr')}</span>
          </button>

          {/* Notifications button with badge */}
          <button
            onClick={() => onNavigateTab('dashboard')}
            className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            title="Notifications & Alerts"
          >
            <Bell className="w-4 h-4" />
            {pendingOffersCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center">
                {pendingOffersCount}
              </span>
            )}
          </button>

          {/* Location Access & City Selector */}
          <div
            className="hidden md:flex items-center bg-white rounded-xl px-2.5 py-1 border border-slate-200 shadow-2xs text-xs font-semibold hover:border-emerald-300 transition-colors"
            title="Current Market City (Click GPS icon to detect location, or pick any city)"
          >
            <button
              type="button"
              onClick={requestLocationAccess}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 mr-1.5 cursor-pointer"
              title="Detect GPS location"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {isGpsActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
            <select
              value={selectedCityId}
              onChange={(e) => selectCity(e.target.value)}
              className="bg-transparent border-0 py-0.5 pr-2 pl-0 text-slate-800 font-bold focus:outline-hidden cursor-pointer text-xs"
              aria-label="Current Market City"
            >
              {allCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name} {city.id === 'hyd' ? '(Hyd Hub)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selector */}
          <div className="hidden sm:flex relative items-center bg-white rounded-xl px-2 py-1 border border-slate-200 shadow-2xs text-xs font-medium">
            <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent border-0 py-0.5 pr-4 pl-0 text-slate-700 font-medium focus:outline-hidden cursor-pointer text-xs"
            >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {/* Quick Role Switcher (Farmer, Transporter, FPO, Market Admin) */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/90 shadow-2xs text-xs font-semibold" id="header-quick-role-switcher">
            <button
              type="button"
              onClick={() => {
                if (onRoleChange && currentRole !== 'farmer') {
                  onRoleChange('farmer');
                }
                onNavigateTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentRole === 'farmer'
                  ? 'bg-white text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title="Switch to Farmer Portal"
              id="header-role-switch-farmer"
            >
              <Wheat className={`w-3.5 h-3.5 ${currentRole === 'farmer' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{language === 'te' ? 'రైతు' : language === 'hi' ? 'किसान' : 'Farmer'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onRoleChange && currentRole !== 'transporter') {
                  onRoleChange('transporter');
                }
                onNavigateTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentRole === 'transporter'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title="Switch to Transporter Driver Partner Mode (Rapido style)"
              id="header-role-switch-transporter"
            >
              <Truck className={`w-3.5 h-3.5 ${currentRole === 'transporter' ? 'text-slate-950' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">Transporter</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onRoleChange && currentRole !== 'fpo') {
                  onRoleChange('fpo');
                }
                onNavigateTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentRole === 'fpo'
                  ? 'bg-blue-800 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title="Switch to FPO Physical Quality Assayer Desk"
              id="header-role-switch-fpo"
            >
              <Building2 className={`w-3.5 h-3.5 ${currentRole === 'fpo' ? 'text-blue-300' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">FPO Assayer</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (onRoleChange && currentRole !== 'market' && currentRole !== 'market_admin') {
                  onRoleChange('market');
                }
                if (onOpenMarketAdmin) onOpenMarketAdmin();
                else onNavigateTab('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                currentRole === 'market' || currentRole === 'market_admin'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs ring-1 ring-slate-900/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
              title="Switch to Market Admin Portal to Manage Vegetable Rates"
              id="header-role-switch-market"
            >
              <Building2 className={`w-3.5 h-3.5 ${currentRole === 'market' || currentRole === 'market_admin' ? 'text-slate-950' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{language === 'te' ? 'మార్కెట్ అడ్మిన్' : language === 'hi' ? 'मार्केट एडमिन' : 'Market Admin'}</span>
            </button>
          </div>

          {/* User Account & Auth Status */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                  showUserMenu
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs'
                }`}
                title={`${currentUser.name} (${currentRole})`}
                aria-expanded={showUserMenu}
              >
                <div className="relative shrink-0">
                  {currentUser.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[11px] flex items-center justify-center">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="hidden lg:flex flex-col items-start text-left leading-tight">
                  <span className={`text-xs font-semibold max-w-[120px] truncate ${showUserMenu ? 'text-white' : 'text-slate-900'}`}>
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] ${showUserMenu ? 'text-slate-300' : 'text-slate-500'}`}>
                    {currentRole === 'farmer' ? 'Farmer' : (currentRole === 'market' || currentRole === 'market_admin') ? 'Market Admin' : (currentRole === 'fpo' ? 'FPO Officer' : getRoleLabel(currentRole))}
                  </span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-150 ${
                    showUserMenu ? 'rotate-180 text-white' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-[320px] sm:w-[360px] max-w-[calc(100vw-1.5rem)] bg-white rounded-2xl shadow-xl border border-slate-200/90 z-50 overflow-hidden flex flex-col animate-in fade-in-50 zoom-in-95 duration-150">
                  {/* User Header */}
                  <div className="p-4 border-b border-slate-100 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {currentUser.avatar ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center shrink-0">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-semibold text-slate-900 truncate">
                            {currentUser.name}
                          </h4>
                          <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        </div>
                        {currentUser.email && (
                          <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowUserMenu(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      aria-label="Close user menu"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* User Meta Row (Zero-Pill discipline) */}
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-medium text-slate-900">
                        {currentRole === 'market' || currentRole === 'market_admin'
                          ? 'Market Administrator'
                          : currentRole === 'farmer'
                          ? 'Farmer'
                          : currentRole === 'fpo'
                          ? 'FPO Field Officer'
                          : 'Member'}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="truncate">{currentUser.location || 'Warangal, Telangana'}</span>
                    </div>
                    {currentUser.phone && (
                      <span className="font-mono text-[11px] text-slate-500 shrink-0 ml-2">{currentUser.phone}</span>
                    )}
                  </div>

                  {/* Interactive Portal Switcher */}
                  <div className="p-3 border-b border-slate-100">
                    <div className="text-[11px] font-medium text-slate-500 mb-1.5">
                      Select Role & Portal View
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => {
                          if (onRoleChange) onRoleChange('farmer');
                          onNavigateTab('dashboard');
                          setShowUserMenu(false);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          currentRole === 'farmer'
                            ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Wheat className={`w-3.5 h-3.5 ${currentRole === 'farmer' ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span>Farmer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onRoleChange) onRoleChange('transporter');
                          onNavigateTab('dashboard');
                          setShowUserMenu(false);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          currentRole === 'transporter'
                            ? 'bg-amber-500 text-slate-950 font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Truck className={`w-3.5 h-3.5 ${currentRole === 'transporter' ? 'text-slate-950' : 'text-slate-400'}`} />
                        <span>Transporter</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onRoleChange) onRoleChange('fpo');
                          onNavigateTab('dashboard');
                          setShowUserMenu(false);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          currentRole === 'fpo'
                            ? 'bg-blue-800 text-white font-bold shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Building2 className={`w-3.5 h-3.5 ${currentRole === 'fpo' ? 'text-blue-300' : 'text-slate-400'}`} />
                        <span>FPO Assayer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (onRoleChange) onRoleChange('market');
                          onNavigateTab('dashboard');
                          setShowUserMenu(false);
                        }}
                        className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer ${
                          currentRole === 'market' || currentRole === 'market_admin'
                            ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Building2 className={`w-3.5 h-3.5 ${currentRole === 'market' || currentRole === 'market_admin' ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span>Market Admin</span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="p-2 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onRoleChange && currentRole !== 'farmer') onRoleChange('farmer');
                        onNavigateTab('selling');
                      }}
                      className="w-full p-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                          <Wheat className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                            Selling Desk
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            Post crop lots, inspect harvest, review bids
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigateTab('markets');
                      }}
                      className="w-full p-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                            Market Rates & Trends
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            Live APMC wholesale auction rates
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigateTab('tracking');
                      }}
                      className="w-full p-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                            Logistics & Tracking
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            Active shipments, driver contact & delivery
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigateTab('profile');
                      }}
                      className="w-full p-2 text-left rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-slate-900">
                            Account & KYC Profile
                          </div>
                          <div className="text-[11px] text-slate-500 font-normal">
                            Land records, bank details & credentials
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                    </button>
                  </div>

                  {/* Sticky Footer */}
                  <div className="p-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUserMenu(false);
                        onNavigateTab('profile');
                      }}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    >
                      Manage Profile
                    </button>

                    {onSignOut && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          onSignOut();
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
                        id="profile-menu-footer-signout-btn"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Drawer Trigger */}
          {onOpenMobileDrawer && (
            <button
              type="button"
              onClick={onOpenMobileDrawer}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/90 shadow-2xs active:scale-95 ml-0.5"
              aria-label="Open Mobile Menu"
              id="header-mobile-hamburger-btn"
              title="Open all mobile options"
            >
              <Menu className="w-5 h-5 text-slate-800" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
