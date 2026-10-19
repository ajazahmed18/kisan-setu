import { useState, useRef, useEffect } from "react";
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
  LogOut,
  LogIn,
  Camera,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  BadgeCheck,
  ArrowLeftRight,
  TrendingUp,
  ArrowLeft,
  X
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useLocation } from "../context/LocationContext";
export const Header = ({
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
  onRefreshData
}) => {
  const { t } = useLanguage();
  const {
    selectedCity,
    selectedCityId,
    selectCity,
    requestLocationAccess,
    isGpsActive,
    allCities
  } = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowUserMenu(false);
      }
    };
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showUserMenu]);
  const getRoleLabel = (role) => {
    switch (role) {
      case "farmer":
        return language === "te" ? "\u0C30\u0C48\u0C24\u0C41" : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928" : "Farmer";
      case "fpo":
        return language === "te" ? "FPO \u0C38\u0C02\u0C18\u0C02" : language === "hi" ? "FPO \u0938\u0902\u0917\u0920\u0928" : "FPO Co-Op";
      case "market":
        return language === "te" ? "\u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C21\u0C4D\u0C2E\u0C3F\u0C28\u0C4D" : language === "hi" ? "\u092E\u093E\u0930\u094D\u0915\u0947\u091F \u090F\u0921\u092E\u093F\u0928" : "Market Admin";
      case "transporter":
        return language === "te" ? "\u0C30\u0C35\u0C3E\u0C23\u0C3E\u0C26\u0C3E\u0C30\u0C41" : language === "hi" ? "\u091F\u094D\u0930\u093E\u0902\u0938\u092A\u094B\u0930\u094D\u091F\u0930" : "Transporter";
      case "admin":
        return language === "te" ? "\u0C05\u0C21\u0C4D\u0C2E\u0C3F\u0C28\u0C4D" : language === "hi" ? "\u090F\u0921\u092E\u093F\u0928" : "Admin Portal";
    }
  };
  const getRoleIcon = (role) => {
    switch (role) {
      case "farmer":
        return <Wheat className="w-4 h-4 text-emerald-700" />;
      case "fpo":
        return <Building2 className="w-4 h-4 text-blue-700" />;
      case "market":
        return <Building2 className="w-4 h-4 text-emerald-700" />;
      case "transporter":
        return <Truck className="w-4 h-4 text-amber-700" />;
      case "admin":
        return <ShieldCheck className="w-4 h-4 text-rose-700" />;
    }
  };
  return <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {
    /* Main Navbar */
  }
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {
    /* Brand & Logo */
  }
        <div className="flex items-center gap-3">
          <button
    onClick={() => onNavigateTab("home")}
    className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
  >
            <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg border border-slate-800 shadow-2xs">
              🌾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-lg tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t("appName")}
                </span>
                <span className="text-[10px] font-mono bg-slate-100 text-slate-700 border border-slate-200 font-bold px-1.5 py-0.2 rounded">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                {language === "te" ? "\u0C38\u0C4D\u0C2E\u0C3E\u0C30\u0C4D\u0C1F\u0C4D \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D & \u0C27\u0C30\u0C32 \u0C35\u0C47\u0C26\u0C3F\u0C15" : language === "hi" ? "\u0938\u094D\u092E\u093E\u0930\u094D\u091F \u0915\u0943\u0937\u093F \u092C\u093E\u091C\u093E\u0930 \u0914\u0930 \u092E\u0942\u0932\u094D\u092F \u0916\u094B\u091C" : "Smart Market Linkage & Price Discovery"}
              </p>
            </div>
          </button>

          {
    /* Quick Navigation Links */
  }
          <nav className="hidden lg:flex items-center ml-4 pl-4 border-l border-slate-200 gap-1.5 text-xs font-medium">
            <button
    type="button"
    onClick={() => onNavigateTab("home")}
    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${activeTab === "home" ? "bg-slate-900 text-white font-semibold shadow-xs" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
  >
              {t("navHome")}
            </button>

            {
    /* SELLING PAGE LINK */
  }
            <button
    type="button"
    id="header-nav-selling-page"
    onClick={() => {
      if (onRoleChange && currentRole !== "farmer" && currentRole !== "fpo") {
        onRoleChange("farmer");
      }
      onNavigateTab("selling");
    }}
    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${activeTab === "selling" || activeTab === "dashboard" && currentRole === "farmer" ? "bg-emerald-700 text-white shadow-xs" : "text-emerald-800 hover:text-emerald-950 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80"}`}
    title="Open Selling Page: List harvest produce, create crop lots, track buyer offers and FPO requests"
  >
              <Wheat className="w-3.5 h-3.5" />
              <span>{t("navSelling")}</span>
            </button>

            {
    /* EXISTING PRICES PAGE LINK */
  }
            <button
    type="button"
    id="header-nav-existing-prices-page"
    onClick={() => {
      onNavigateTab("markets");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold ${activeTab === "prices" || activeTab === "markets" ? "bg-slate-900 text-white shadow-xs" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
    title="Open Existing Prices Page: Live APMC mandi rates, vegetable board & trends"
  >
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t("navExistingPrices")}</span>
            </button>

            {currentRole === "fpo" && <button
    type="button"
    onClick={() => onNavigateTab("dashboard")}
    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-blue-800 text-white font-semibold shadow-xs" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
    id="header-nav-fpo-desk"
    title="Open FPO Field Officer Portal & seller requests"
  >
                <Building2 className="w-3.5 h-3.5 text-blue-300" />
                <span>{language === "te" ? "FPO \u0C06\u0C2B\u0C40\u0C38\u0C30\u0C4D \u0C2A\u0C4B\u0C30\u0C4D\u0C1F\u0C32\u0C4D" : language === "hi" ? "FPO \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u092A\u094B\u0930\u094D\u091F\u0932" : "FPO Officer Portal"}</span>
              </button>}

            {(currentRole === "market" || currentRole === "market_admin") && <button
    type="button"
    onClick={() => onNavigateTab("dashboard")}
    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "dashboard" ? "bg-emerald-800 text-white font-semibold shadow-xs" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"}`}
    id="header-nav-market-admin-desk"
    title="Open Market Admin Desk & Manage Vegetable Rates"
  >
                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{language === "te" ? "\u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C21\u0C4D\u0C2E\u0C3F\u0C28\u0C4D" : language === "hi" ? "\u092E\u093E\u0930\u094D\u0915\u0947\u091F \u090F\u0921\u092E\u093F\u0928" : "Market Admin"}</span>
              </button>}
            <button
    type="button"
    onClick={() => onNavigateTab("community")}
    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "community" ? "bg-slate-900 text-white font-semibold shadow-xs" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold"}`}
  >
              <span>{t("navCommunity")}</span>
            </button>
            <button
    type="button"
    onClick={() => onNavigateTab("tracking")}
    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${activeTab === "tracking" ? "bg-slate-900 text-white font-semibold shadow-xs" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold"}`}
    id="header-nav-track-shipment"
  >
              <Truck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === "te" ? "\u0C30\u0C35\u0C3E\u0C23\u0C3E \u0C1F\u0C4D\u0C30\u0C3E\u0C15\u0C3F\u0C02\u0C17\u0C4D" : language === "hi" ? "\u0936\u093F\u092A\u092E\u0947\u0902\u091F \u091F\u094D\u0930\u0948\u0915\u093F\u0902\u0917" : "Track Shipment"}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
          </nav>
        </div>

        {
    /* Right Actions: Sell, Buy, Voice Assistant, Language, Profile */
  }
        <div className="flex items-center gap-1.5 sm:gap-2">
          {
    /* Voice Assistant Mic Button */
  }
          <button
    onClick={onOpenVoice}
    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold transition-all border border-slate-200 shadow-2xs cursor-pointer"
    title="Ask via voice in Telugu, Hindi or English with dialect tolerance"
  >
            <Mic className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">{t("navVoiceAssistant")}</span>
          </button>

          {
    /* IVR Phone Simulator Button */
  }
          <button
    onClick={onOpenIVR}
    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-medium transition-all border border-slate-200 shadow-2xs cursor-pointer"
    title="Non-Smartphone IVR Simulator"
  >
            <PhoneCall className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden md:inline">{t("navIvr")}</span>
          </button>

          {
    /* Notifications button with badge */
  }
          <button
    onClick={() => onNavigateTab("dashboard")}
    className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
    title="Notifications & Alerts"
  >
            <Bell className="w-4 h-4" />
            {pendingOffersCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white font-mono font-bold text-[9px] rounded-full flex items-center justify-center">
                {pendingOffersCount}
              </span>}
          </button>

          {
    /* Location Access & City Selector */
  }
          <div
    className="hidden sm:flex items-center bg-white rounded-xl px-2.5 py-1 border border-slate-200 shadow-2xs text-xs font-semibold hover:border-emerald-300 transition-colors"
    title="Current Market City (Click GPS icon to detect location, or pick any city)"
  >
            <button
    type="button"
    onClick={requestLocationAccess}
    className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 mr-1.5 cursor-pointer"
    title="Detect GPS location"
  >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {isGpsActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
            <select
    value={selectedCityId}
    onChange={(e) => selectCity(e.target.value)}
    className="bg-transparent border-0 py-0.5 pr-2 pl-0 text-slate-800 font-bold focus:outline-hidden cursor-pointer text-xs"
    aria-label="Current Market City"
  >
              {allCities.map((city) => <option key={city.id} value={city.id}>
                  {city.name} {city.id === "hyd" ? "(Hyd Hub)" : ""}
                </option>)}
            </select>
          </div>

          {
    /* Language Selector */
  }
          <div className="relative flex items-center bg-white rounded-xl px-2 py-1 border border-slate-200 shadow-2xs text-xs font-medium">
            <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <select
    value={language}
    onChange={(e) => onLanguageChange(e.target.value)}
    className="bg-transparent border-0 py-0.5 pr-4 pl-0 text-slate-700 font-medium focus:outline-hidden cursor-pointer text-xs"
  >
              <option value="en">English</option>
              <option value="te">తెలుగు</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>

          {
    /* Quick Role Switcher for Farmer <-> Market Admin */
  }
          {currentRole === "fpo" ? <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-xl text-xs">
              <span className="w-5 h-5 rounded-lg bg-blue-600 text-white shadow-2xs flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <span className="font-bold text-blue-900 text-xs">FPO Officer</span>
            </div> : <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/90 shadow-2xs text-xs font-semibold" id="header-quick-role-switcher">
              <button
    type="button"
    onClick={() => {
      if (onRoleChange && currentRole !== "farmer") {
        onRoleChange("farmer");
      }
      onNavigateTab("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentRole === "farmer" ? "bg-white text-emerald-950 font-bold shadow-xs ring-1 ring-emerald-500/20" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"}`}
    title="Switch to Farmer Portal"
    id="header-role-switch-farmer"
  >
                <Wheat className={`w-3.5 h-3.5 ${currentRole === "farmer" ? "text-emerald-600" : "text-slate-400"}`} />
                <span className="hidden sm:inline">{language === "te" ? "\u0C30\u0C48\u0C24\u0C41" : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928" : "Farmer"}</span>
              </button>

              <button
    type="button"
    onClick={() => {
      if (onRoleChange && currentRole !== "market" && currentRole !== "market_admin") {
        onRoleChange("market");
      }
      if (onOpenMarketAdmin) onOpenMarketAdmin();
      else onNavigateTab("dashboard");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${currentRole === "market" || currentRole === "market_admin" ? "bg-amber-400 text-slate-950 font-black shadow-xs ring-1 ring-amber-500/30" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"}`}
    title="Switch to Market Admin Portal to Manage Vegetable Rates"
    id="header-role-switch-market"
  >
                <Building2 className={`w-3.5 h-3.5 ${currentRole === "market" || currentRole === "market_admin" ? "text-slate-950" : "text-slate-400"}`} />
                <span className="hidden sm:inline">{language === "te" ? "\u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C21\u0C4D\u0C2E\u0C3F\u0C28\u0C4D" : language === "hi" ? "\u092E\u093E\u0930\u094D\u0915\u0947\u091F \u090F\u0921\u092E\u093F\u0928" : "Market Admin"}</span>
              </button>
            </div>}

          {
    /* User Account & Auth Status */
  }
          {currentUser ? <div className="relative" ref={userMenuRef}>
              <button
    onClick={() => setShowUserMenu(!showUserMenu)}
    className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-2xl text-xs font-medium transition-all duration-200 cursor-pointer border ${showUserMenu ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-2xs"}`}
    title={`${currentUser.name} (${currentRole})`}
    aria-expanded={showUserMenu}
  >
                <div className="relative shrink-0">
                  {currentUser.avatar ? <img
    src={currentUser.avatar}
    alt={currentUser.name}
    className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/30"
    referrerPolicy="no-referrer"
  /> : <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-800 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div className="hidden lg:flex flex-col items-start text-left leading-tight">
                  <span className={`text-xs font-bold max-w-[120px] truncate capitalize ${showUserMenu ? "text-white" : "text-slate-900"}`}>
                    {currentUser.name}
                  </span>
                  <span className={`text-[10.5px] font-semibold flex items-center gap-1 ${showUserMenu ? "text-emerald-300" : "text-slate-500"}`}>
                    {currentRole === "farmer" ? "\u{1F33E} Farmer" : currentRole === "market" || currentRole === "market_admin" ? "\u{1F3DB}\uFE0F Market Admin" : getRoleLabel(currentRole)}
                  </span>
                </div>
                <ChevronDown
    className={`w-3.5 h-3.5 transition-transform duration-200 ${showUserMenu ? "rotate-180 text-white" : "text-slate-400 group-hover:text-slate-600"}`}
  />
              </button>

              {showUserMenu && <div className="absolute right-0 mt-3 w-[360px] sm:w-[380px] max-h-[85vh] bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(15,23,42,0.25),0_0_1px_1px_rgba(15,23,42,0.06)] border border-slate-100 z-50 overflow-hidden ring-1 ring-black/5 animate-in fade-in-50 zoom-in-95 duration-150 flex flex-col">
                  {
    /* Top Profile Hero Card with Modern Luxury Gradient & Back Button */
  }
                  <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white relative overflow-hidden shrink-0">
                    <div className="absolute -top-12 -right-12 w-36 h-36 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />

                    {
    /* Top Bar with Back and Close Buttons */
  }
                    <div className="relative flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                      <button
    type="button"
    onClick={() => setShowUserMenu(false)}
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs font-bold transition-all cursor-pointer shadow-2xs group"
    id="profile-menu-back-top-btn"
    title="Go Back"
  >
                        <ArrowLeft className="w-4 h-4 text-emerald-300 group-hover:-translate-x-0.5 transition-transform" />
                        <span>{language === "te" ? "\u0C35\u0C46\u0C28\u0C41\u0C15\u0C15\u0C41" : language === "hi" ? "\u0935\u093E\u092A\u0938" : "Back"}</span>
                      </button>

                      <span className="text-[11px] font-mono font-bold tracking-wider text-emerald-300 uppercase">
                        {language === "te" ? "\u0C2F\u0C42\u0C1C\u0C30\u0C4D \u0C2A\u0C4D\u0C30\u0C4A\u0C2B\u0C48\u0C32\u0C4D" : language === "hi" ? "\u0909\u092A\u092F\u094B\u0917\u0915\u0930\u094D\u0924\u093E \u092A\u094D\u0930\u094B\u092B\u093C\u093E\u0907\u0932" : "User Profile"}
                      </span>

                      <button
    type="button"
    onClick={() => setShowUserMenu(false)}
    className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
    title="Close Menu"
    aria-label="Close"
  >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="relative flex items-start gap-3.5">
                      <div className="relative shrink-0">
                        {currentUser.avatar ? <img
    src={currentUser.avatar}
    alt={currentUser.name}
    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-400/40 ring-offset-2 ring-offset-slate-900 shadow-md"
    referrerPolicy="no-referrer"
  /> : <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-800 text-white font-black text-xl flex items-center justify-center shadow-md ring-2 ring-emerald-400/40 ring-offset-2 ring-offset-slate-900">
                            {currentUser.name.charAt(0).toUpperCase()}
                          </div>}
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full flex items-center justify-center shadow-xs">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-white truncate capitalize tracking-tight">
                          {currentUser.name}
                        </h4>
                        {currentUser.email && <p className="text-xs text-slate-300 truncate flex items-center gap-1.5 mt-0.5 font-normal">
                            <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{currentUser.email}</span>
                          </p>}

                        <div className="mt-2.5 flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border shadow-2xs ${currentRole === "market" || currentRole === "market_admin" ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40" : currentRole === "farmer" ? "bg-emerald-500/20 text-emerald-200 border-emerald-400/40" : "bg-purple-500/20 text-purple-200 border-purple-400/40"}`}>
                            <BadgeCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                            <span>
                              {currentRole === "market" || currentRole === "market_admin" ? language === "te" ? "\u0C27\u0C43\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C28 \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C21\u0C4D\u0C2E\u0C3F\u0C28\u0C4D" : language === "hi" ? "\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u092E\u093E\u0930\u094D\u0915\u0947\u091F \u090F\u0921\u092E\u093F\u0928" : "Verified MARKET ADMIN" : currentRole === "farmer" ? language === "te" ? "\u0C27\u0C43\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C3F\u0C28 \u0C30\u0C48\u0C24\u0C41" : language === "hi" ? "\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0915\u093F\u0938\u093E\u0928" : "Verified FARMER" : `Verified ${currentRole.toUpperCase()}`}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {
    /* Scrollable Body: Role Switcher, Details & Actions */
  }
                  <div className="flex-1 overflow-y-auto overscroll-contain">

                  {
    /* Interactive Role Switcher or FPO Dedicated Status */
  }
                  {currentRole === "fpo" ? <div className="px-4 py-3.5 bg-blue-50/80 border-b border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10.5px] font-bold tracking-wider text-blue-900 uppercase flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-700" />
                          <span>{language === "te" ? "\u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F\u0C15 \u0C2A\u0C3E\u0C24\u0C4D\u0C30" : language === "hi" ? "\u0906\u0927\u093F\u0915\u093E\u0930\u093F\u0915 \u092A\u0926" : "Official Designation"}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-blue-800 bg-blue-200/70 px-2 py-0.5 rounded-full">
                          {language === "te" ? "\u0C15\u0C4D\u0C37\u0C47\u0C24\u0C4D\u0C30 \u0C05\u0C27\u0C3F\u0C15\u0C3E\u0C30\u0C3F" : language === "hi" ? "\u092B\u0940\u0932\u094D\u0921 \u0905\u0927\u093F\u0915\u093E\u0930\u0940" : "Field Officer"}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white/90 rounded-xl border border-blue-200/80 shadow-2xs">
                        <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                          <ShieldCheck className="w-4 h-4 text-blue-700" />
                          <span>{language === "te" ? "FPO \u0C35\u0C3F\u0C15\u0C4D\u0C30\u0C2F \u0C05\u0C2D\u0C4D\u0C2F\u0C30\u0C4D\u0C25\u0C28\u0C32 \u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D" : language === "hi" ? "FPO \u0935\u093F\u0915\u094D\u0930\u092F \u0905\u0928\u0941\u0930\u094B\u0927 \u0921\u0947\u0938\u094D\u0915" : "FPO Produce Inspection Officer"}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {language === "te" ? "\u0C30\u0C48\u0C24\u0C41\u0C32 \u0C28\u0C41\u0C02\u0C21\u0C3F \u0C35\u0C1A\u0C4D\u0C1A\u0C47 \u0C05\u0C2E\u0C4D\u0C2E\u0C15\u0C2A\u0C41 \u0C05\u0C2D\u0C4D\u0C2F\u0C30\u0C4D\u0C25\u0C28\u0C32\u0C28\u0C41 \u0C28\u0C47\u0C30\u0C41\u0C17\u0C3E \u0C38\u0C4D\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C3F \u0C06\u0C2E\u0C4B\u0C26\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F." : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928\u094B\u0902 \u0938\u0947 \u0906\u0928\u0947 \u0935\u093E\u0932\u0947 \u0935\u093F\u0915\u094D\u0930\u092F \u0905\u0928\u0941\u0930\u094B\u0927 \u0938\u094D\u0935\u0940\u0915\u093E\u0930 \u0915\u0930\u0947\u0902 \u0914\u0930 \u092D\u094C\u0924\u093F\u0915 \u091C\u093E\u0902\u091A \u0915\u0930\u0947\u0902\u0964" : "Review and accept incoming seller requests directly in your FPO portal."}
                        </p>
                      </div>
                    </div> : currentRole === "farmer" ? <div className="px-4 py-3.5 bg-emerald-50/70 border-b border-emerald-100">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10.5px] font-bold tracking-wider text-emerald-800 uppercase flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === "te" ? "\u0C30\u0C48\u0C24\u0C41 \u0C2A\u0C4D\u0C30\u0C4A\u0C2B\u0C48\u0C32\u0C4D" : language === "hi" ? "\u0938\u0924\u094D\u092F\u093E\u092A\u093F\u0924 \u0915\u093F\u0938\u093E\u0928" : "Verified Farmer"}</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {language === "te" ? "\u0C30\u0C48\u0C24\u0C41" : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928" : "Farmer"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {language === "te" ? "\u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C30\u0C47\u0C1F\u0C4D\u0C32\u0C41 \u0C1A\u0C42\u0C21\u0C1F\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C05\u0C02\u0C26\u0C41\u0C2C\u0C3E\u0C1F\u0C41\u0C32\u0C4B \u0C09\u0C28\u0C4D\u0C28\u0C3E\u0C2F\u0C3F. APMC \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C21\u0C4D\u0C2E\u0C3F\u0C28\u0C4D \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E \u0C2E\u0C3E\u0C24\u0C4D\u0C30\u0C2E\u0C47 \u0C27\u0C30\u0C32\u0C41 \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C3F\u0C02\u0C1A\u0C2C\u0C21\u0C24\u0C3E\u0C2F\u0C3F." : language === "hi" ? "\u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u0915\u0947\u0935\u0932 \u0926\u0947\u0916\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0939\u0948\u0902\u0964 \u0938\u0902\u092A\u093E\u0926\u0928 \u0915\u0947\u0935\u0932 \u0905\u0927\u093F\u0915\u0943\u0924 \u090F\u092A\u0940\u090F\u092E\u0938\u0940 \u092E\u093E\u0930\u094D\u0915\u0947\u091F \u090F\u0921\u092E\u093F\u0928 \u0926\u094D\u0935\u093E\u0930\u093E \u0939\u0940 \u0915\u093F\u092F\u093E \u091C\u093E\u0924\u093E \u0939\u0948\u0964" : "Market rates are read-only. Official APMC Market Administrators alone have credentials to edit or publish prices."}
                      </p>
                    </div> : <div className="px-4 py-3.5 bg-slate-50/80 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10.5px] font-bold tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
                          <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{language === "te" ? "\u0C35\u0C4D\u0C2F\u0C3E\u0C2A\u0C3E\u0C30 \u0C2A\u0C3E\u0C24\u0C4D\u0C30 \u0C2E\u0C3E\u0C30\u0C4D\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F" : language === "hi" ? "\u091F\u094D\u0930\u0947\u0921\u093F\u0902\u0917 \u092D\u0942\u092E\u093F\u0915\u093E \u092C\u0926\u0932\u0947\u0902" : "Switch Trading Role"}</span>
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded-full">
                          {language === "te" ? "\u0C24\u0C15\u0C4D\u0C37\u0C23 \u0C2F\u0C3E\u0C15\u0C4D\u0C38\u0C46\u0C38\u0C4D" : language === "hi" ? "\u0924\u0924\u094D\u0915\u093E\u0932 \u092A\u0939\u0941\u0902\u091A" : "Instant Access"}
                        </span>
                      </div>

                      {
    /* Segmented Switcher for Farmer & Market Admin */
  }
                      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/70 rounded-2xl">
                        {
    /* Farmer Button */
  }
                        <button
    type="button"
    onClick={() => {
      if (onRoleChange) {
        onRoleChange("farmer");
      }
      onNavigateTab("dashboard");
      setShowUserMenu(false);
    }}
    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-semibold text-xs transition-all cursor-pointer ${currentRole === "farmer" ? "bg-white text-emerald-950 shadow-sm ring-1 ring-emerald-500/25 font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"}`}
  >
                          <Wheat className={`w-4 h-4 ${currentRole === "farmer" ? "text-emerald-600" : "text-slate-400"}`} />
                          <span>{language === "te" ? "\u0C30\u0C48\u0C24\u0C41 (Farmer)" : language === "hi" ? "\u0915\u093F\u0938\u093E\u0928 (Farmer)" : "Farmer"}</span>
                          {currentRole === "farmer" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />}
                        </button>

                        {
    /* Market Admin Button */
  }
                        <button
    type="button"
    onClick={() => {
      if (onRoleChange) {
        onRoleChange("market");
      }
      onNavigateTab("dashboard");
      setShowUserMenu(false);
    }}
    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-semibold text-xs transition-all cursor-pointer ${currentRole === "market" || currentRole === "market_admin" ? "bg-white text-emerald-950 shadow-sm ring-1 ring-emerald-500/25 font-bold" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"}`}
  >
                          <Building2 className={`w-4 h-4 ${currentRole === "market" || currentRole === "market_admin" ? "text-emerald-600" : "text-slate-400"}`} />
                          <span>{language === "te" ? "\u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C21\u0C4D\u0C2E\u0C3F\u0C28\u0C4D" : language === "hi" ? "\u092E\u093E\u0930\u094D\u0915\u0947\u091F \u090F\u0921\u092E\u093F\u0928" : "Market Admin"}</span>
                          {(currentRole === "market" || currentRole === "market_admin") && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />}
                        </button>
                      </div>

                      <p className="text-[10px] text-slate-500 mt-1.5 text-center font-medium">
                        {currentRole === "farmer" ? language === "te" ? "\u{1F33E} \u0C2A\u0C02\u0C1F\u0C32\u0C28\u0C41 \u0C05\u0C2E\u0C4D\u0C2E\u0C02\u0C21\u0C3F, \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C27\u0C30\u0C32\u0C41 \u0C1A\u0C42\u0C21\u0C02\u0C21\u0C3F" : language === "hi" ? "\u{1F33E} \u092B\u0938\u0932 \u092C\u0947\u091A\u0947\u0902, \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u0926\u0947\u0916\u0947\u0902" : "\u{1F33E} Sell harvest produce & check market rates" : language === "te" ? "\u{1F3DB}\uFE0F \u0C15\u0C42\u0C30\u0C17\u0C3E\u0C2F\u0C32 \u0C27\u0C30\u0C32\u0C28\u0C41 \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2A\u0C4D\u0C30\u0C24\u0C4D\u0C2F\u0C15\u0C4D\u0C37 \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C28\u0C35\u0C40\u0C15\u0C30\u0C23\u0C32\u0C41 \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F" : language === "hi" ? "\u{1F3DB}\uFE0F \u0938\u092C\u094D\u091C\u0940 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u092A\u094D\u0930\u092C\u0902\u0927\u093F\u0924 \u0915\u0930\u0947\u0902 \u0914\u0930 \u0932\u093E\u0907\u0935 \u0905\u092A\u0921\u0947\u091F \u0915\u0930\u0947\u0902" : "\u{1F3DB}\uFE0F Manage vegetable mandi prices and monitor live market trends"}
                      </p>
                    </div>}

                  {
    /* Profile Metadata Mini-Grid */
  }
                  <div className="px-4 py-2.5 bg-white grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/90">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-semibold">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Location</span>
                      </div>
                      <div className="text-slate-800 font-semibold truncate text-[11.5px] mt-0.5">
                        {currentUser.location || "Warangal District, Telangana"}
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100/90">
                      <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase font-semibold">
                        <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>Phone</span>
                      </div>
                      <div className="text-slate-800 font-semibold font-mono text-[11.5px] mt-0.5 truncate">
                        {currentUser.phone || "+91 98480 23456"}
                      </div>
                    </div>
                  </div>

                  {
    /* Navigation Action Buttons */
  }
                  <div className="px-3 pb-2 space-y-1">
                    {
    /* Role Specific Desk Button */
  }
                    {currentRole === "fpo" ? <button
    type="button"
    onClick={() => {
      setShowUserMenu(false);
      onNavigateTab("dashboard");
    }}
    className="w-full p-2.5 text-left rounded-2xl hover:bg-blue-50/70 active:bg-blue-100/50 transition-colors cursor-pointer flex items-center justify-between group border border-transparent hover:border-blue-100"
  >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200/80 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900 transition-colors">
                              {language === "te" ? "FPO \u0C06\u0C2B\u0C40\u0C38\u0C30\u0C4D \u0C2A\u0C4B\u0C30\u0C4D\u0C1F\u0C32\u0C4D" : language === "hi" ? "FPO \u0905\u0927\u093F\u0915\u093E\u0930\u0940 \u092A\u094B\u0930\u094D\u091F\u0932" : "FPO Officer Portal"}
                            </div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              {language === "te" ? "\u0C30\u0C48\u0C24\u0C41\u0C32 \u0C05\u0C2E\u0C4D\u0C2E\u0C15\u0C2A\u0C41 \u0C05\u0C2D\u0C4D\u0C2F\u0C30\u0C4D\u0C25\u0C28\u0C32\u0C41 & \u0C24\u0C28\u0C3F\u0C16\u0C40\u0C32\u0C41" : language === "hi" ? "\u0935\u093F\u0915\u094D\u0930\u0947\u0924\u093E \u0905\u0928\u0941\u0930\u094B\u0927 \u0935 \u0916\u0947\u0924 \u0928\u093F\u0930\u0940\u0915\u094D\u0937\u0923" : "Seller harvest requests & farm inspections"}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                      </button> : currentRole === "market" || currentRole === "market_admin" ? <button
    type="button"
    onClick={() => {
      setShowUserMenu(false);
      onNavigateTab("dashboard");
    }}
    className="w-full p-2.5 text-left rounded-2xl hover:bg-emerald-50/70 active:bg-emerald-100/50 transition-colors cursor-pointer flex items-center justify-between group border border-transparent hover:border-emerald-100"
  >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs shrink-0">
                            <Building2 className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 transition-colors">
                              {language === "te" ? "\u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C05\u0C21\u0C4D\u0C2E\u0C3F\u0C28\u0C4D \u0C21\u0C46\u0C38\u0C4D\u0C15\u0C4D" : language === "hi" ? "\u092E\u093E\u0930\u094D\u0915\u0947\u091F \u090F\u0921\u092E\u093F\u0928 \u0921\u0947\u0938\u094D\u0915" : "Market Admin Desk"}
                            </div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              {language === "te" ? "\u0C15\u0C42\u0C30\u0C17\u0C3E\u0C2F\u0C32 \u0C27\u0C30\u0C32\u0C41 \u0C28\u0C3F\u0C30\u0C4D\u0C35\u0C39\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F & \u0C28\u0C35\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F" : language === "hi" ? "\u0938\u092C\u094D\u091C\u0940 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 \u092A\u094D\u0930\u092C\u0902\u0927\u093F\u0924 \u0914\u0930 \u0905\u092A\u0921\u0947\u091F \u0915\u0930\u0947\u0902" : "Manage vegetable prices & mandi rate board"}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                      </button> : null}

                    {
    /* SELLING PAGE BUTTON */
  }
                    <button
    type="button"
    onClick={() => {
      setShowUserMenu(false);
      if (onRoleChange && currentRole !== "farmer") onRoleChange("farmer");
      onNavigateTab("selling");
    }}
    className="w-full p-2.5 text-left rounded-2xl hover:bg-emerald-50/70 active:bg-emerald-100/50 transition-colors cursor-pointer flex items-center justify-between group border border-emerald-100 bg-emerald-50/30"
  >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-2xs shrink-0">
                          <Wheat className="w-4 h-4 text-amber-300" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 transition-colors">
                            {language === "te" ? "\u{1F33E} \u0C2A\u0C02\u0C1F \u0C05\u0C2E\u0C4D\u0C2E\u0C15\u0C02 \u0C2A\u0C47\u0C1C\u0C40 (Selling)" : language === "hi" ? "\u{1F33E} \u092B\u0938\u0932 \u092C\u093F\u0915\u094D\u0930\u0940 \u092A\u0947\u091C (Selling)" : "\u{1F33E} Selling Desk (Sell Produce)"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            {language === "te" ? "\u0C05\u0C2E\u0C4D\u0C2E\u0C15\u0C2A\u0C41 \u0C05\u0C2D\u0C4D\u0C2F\u0C30\u0C4D\u0C25\u0C28\u0C32\u0C41, \u0C2A\u0C02\u0C1F \u0C32\u0C3E\u0C1F\u0C4D\u0C32\u0C41, \u0C06\u0C2B\u0C30\u0C4D\u0C32\u0C41" : language === "hi" ? "\u0935\u093F\u0915\u094D\u0930\u092F \u0905\u0928\u0941\u0930\u094B\u0927, \u092B\u0938\u0932 \u0932\u0949\u091F, \u0916\u0930\u0940\u0926\u093E\u0930 \u092C\u094B\u0932\u093F\u092F\u093E\u0902" : "List produce, farm inspection, buyer bids"}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    {
    /* EXISTING PRICES BUTTON */
  }
                    <button
    type="button"
    onClick={() => {
      setShowUserMenu(false);
      onNavigateTab("markets");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
    className="w-full p-2.5 text-left rounded-2xl hover:bg-slate-100 active:bg-slate-200/60 transition-colors cursor-pointer flex items-center justify-between group border border-slate-200/80"
  >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-2xs shrink-0">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                            {language === "te" ? "\u{1F4CA} \u0C2A\u0C4D\u0C30\u0C38\u0C4D\u0C24\u0C41\u0C24 \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C27\u0C30\u0C32\u0C41 (Prices)" : language === "hi" ? "\u{1F4CA} \u0935\u0930\u094D\u0924\u092E\u093E\u0928 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935 (Prices)" : "\u{1F4CA} Existing Market Prices"}
                          </div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            {language === "te" ? "\u0C32\u0C48\u0C35\u0C4D APMC \u0C2E\u0C3E\u0C30\u0C4D\u0C15\u0C46\u0C1F\u0C4D \u0C30\u0C47\u0C1F\u0C4D\u0C32\u0C41, \u0C15\u0C42\u0C30\u0C17\u0C3E\u0C2F\u0C32 \u0C2C\u0C4B\u0C30\u0C4D\u0C21\u0C41" : language === "hi" ? "\u0932\u093E\u0907\u0935 \u090F\u092A\u0940\u090F\u092E\u0938\u0940 \u092E\u0902\u0921\u0940 \u092D\u093E\u0935, \u0938\u092C\u094D\u091C\u0940 \u0930\u0947\u091F \u092C\u094B\u0930\u094D\u0921" : "Live APMC wholesale auction rates & trends"}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
    type="button"
    onClick={() => {
      setShowUserMenu(false);
      onNavigateTab("tracking");
    }}
    className="w-full p-2.5 text-left rounded-2xl hover:bg-emerald-50/70 active:bg-emerald-100/50 transition-colors cursor-pointer flex items-center justify-between group border border-transparent hover:border-emerald-100"
  >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/80 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-2xs shrink-0">
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 transition-colors flex items-center gap-1.5">
                            <span>{language === "te" ? "\u0C30\u0C35\u0C3E\u0C23\u0C3E & \u0C21\u0C4D\u0C30\u0C48\u0C35\u0C30\u0C4D \u0C1F\u0C4D\u0C30\u0C3E\u0C15\u0C3F\u0C02\u0C17\u0C4D" : language === "hi" ? "\u0936\u093F\u092A\u092E\u0947\u0902\u091F \u0935 \u0921\u094D\u0930\u093E\u0907\u0935\u0930 \u091F\u094D\u0930\u0948\u0915\u093F\u0902\u0917" : "Track Shipment & Logistics"}</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <div className="text-[10px] text-slate-500 font-normal">
                            {language === "te" ? "\u0C21\u0C4D\u0C30\u0C48\u0C35\u0C30\u0C4D \u0C1A\u0C3E\u0C1F\u0C4D, \u0C15\u0C3E\u0C32\u0C4D & COD \u0C1A\u0C46\u0C32\u0C4D\u0C32\u0C3F\u0C02\u0C2A\u0C41" : language === "hi" ? "\u0932\u093E\u0907\u0935 \u0921\u094D\u0930\u093E\u0907\u0935\u0930 \u091A\u0948\u091F, \u0915\u0949\u0932 \u0935 \u0938\u0940\u0913\u0921\u0940 \u092D\u0941\u0917\u0924\u093E\u0928" : "Live driver chat, call & COD settlement"}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
    type="button"
    onClick={() => {
      setShowUserMenu(false);
      onNavigateTab("profile");
    }}
    className="w-full p-2.5 text-left rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between group"
  >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-2xs shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-slate-900 transition-colors">
                            {language === "te" ? "\u0C2A\u0C4D\u0C30\u0C4A\u0C2B\u0C48\u0C32\u0C4D & KYC \u0C35\u0C3F\u0C35\u0C30\u0C3E\u0C32\u0C41" : language === "hi" ? "\u092A\u094D\u0930\u094B\u092B\u093C\u093E\u0907\u0932 \u0935 \u0915\u0947\u0935\u093E\u0908\u0938\u0940 \u0935\u093F\u0935\u0930\u0923" : "View Profile & KYC"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {language === "te" ? "\u0C06\u0C27\u0C3E\u0C30\u0C4D, \u0C2C\u0C4D\u0C2F\u0C3E\u0C02\u0C15\u0C4D & \u0C2D\u0C42\u0C2E\u0C3F \u0C30\u0C3F\u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C41\u0C32\u0C41" : language === "hi" ? "\u0906\u0927\u093E\u0930, \u092C\u0948\u0902\u0915 \u0935 \u092D\u0942\u092E\u093F \u0930\u093F\u0915\u0949\u0930\u094D\u0921" : "Aadhaar, bank & land records"}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <button
    type="button"
    onClick={() => {
      setShowUserMenu(false);
      onNavigateTab("profile");
    }}
    className="w-full p-2.5 text-left rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer flex items-center justify-between group"
  >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100/80 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs shrink-0">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-800 group-hover:text-blue-900 transition-colors">
                            {language === "te" ? "\u0C2A\u0C4D\u0C30\u0C4A\u0C2B\u0C48\u0C32\u0C4D \u0C2B\u0C4B\u0C1F\u0C4B \u0C2E\u0C3E\u0C30\u0C4D\u0C1A\u0C02\u0C21\u0C3F" : language === "hi" ? "\u092A\u094D\u0930\u094B\u092B\u093C\u093E\u0907\u0932 \u092B\u093C\u094B\u091F\u094B \u092C\u0926\u0932\u0947\u0902" : "Change Profile Photo"}
                          </div>
                          <div className="text-[10px] text-slate-400 font-normal">
                            {language === "te" ? "\u0C15\u0C46\u0C2E\u0C46\u0C30\u0C3E \u0C32\u0C47\u0C26\u0C3E \u0C17\u0C4D\u0C2F\u0C3E\u0C32\u0C30\u0C40 \u0C26\u0C4D\u0C35\u0C3E\u0C30\u0C3E" : language === "hi" ? "\u0915\u0948\u092E\u0930\u093E \u092F\u093E \u0917\u0948\u0932\u0930\u0940 \u0926\u094D\u0935\u093E\u0930\u093E" : "Update picture via camera or gallery"}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                  </div>

                  {
    /* Sticky Footer: Back Button & Sign Out */
  }
                  <div className="border-t border-slate-200/80 p-2.5 bg-slate-50/95 backdrop-blur-xs shrink-0 flex items-center gap-2">
                    <button
    type="button"
    onClick={() => setShowUserMenu(false)}
    className="flex-1 px-3 py-2 text-center rounded-xl bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs group"
    id="profile-menu-footer-back-btn"
  >
                      <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
                      <span>{language === "te" ? "\u0C35\u0C46\u0C28\u0C41\u0C15\u0C15\u0C41 (Back)" : language === "hi" ? "\u0935\u093E\u092A\u0938 (Back)" : "Back"}</span>
                    </button>

                    {onSignOut && <button
    type="button"
    onClick={() => {
      setShowUserMenu(false);
      onSignOut();
    }}
    className="flex-1 px-3 py-2 text-center rounded-xl bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200/70 text-rose-700 font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
    id="profile-menu-footer-signout-btn"
  >
                        <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span>{language === "te" ? "\u0C32\u0C3E\u0C17\u0C4D \u0C05\u0C35\u0C41\u0C1F\u0C4D" : language === "hi" ? "\u0938\u093E\u0907\u0928 \u0906\u0909\u091F" : "Sign Out"}</span>
                      </button>}
                  </div>
                </div>}
            </div> : <button
    onClick={onOpenLogin}
    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
  >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>}
        </div>
      </div>
    </header>;
};
