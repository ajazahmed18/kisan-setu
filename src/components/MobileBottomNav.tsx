import React from 'react';
import {
  Wheat,
  TrendingUp,
  Users,
  LayoutGrid,
  Store,
  Truck,
  Sparkles,
  ClipboardCheck,
  Building2,
  Radio,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';

interface MobileBottomNavProps {
  activeTab: string;
  currentRole?: UserRole;
  onNavigateTab: (tab: string) => void;
  onOpenMobileDrawer: () => void;
  lotsCount?: number;
  offersCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  currentRole = 'farmer',
  onNavigateTab,
  onOpenMobileDrawer,
  lotsCount = 0,
  offersCount = 0,
}) => {
  const { language } = useLanguage();

  const isHome = activeTab === 'home';
  const isDashboard = activeTab === 'dashboard';
  const isSelling = activeTab === 'selling';
  const isPrices = activeTab === 'prices' || activeTab === 'markets';
  const isCommunity = activeTab === 'community';

  // In TRANSPORTER mode: ZERO PRICES, dedicated driver partner items
  if (currentRole === 'transporter') {
    return (
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:hidden"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
        aria-label="Transporter Driver Navigation"
      >
        <div className="max-w-md mx-auto px-2 py-1.5 grid grid-cols-4 gap-1 items-center">
          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isDashboard ? 'text-amber-600 font-bold' : 'text-slate-500'
            }`}
          >
            <Truck className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1 font-medium">Driver Desk</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer text-slate-500"
          >
            <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
            <span className="text-[10px] tracking-tight mt-1 font-medium">Trip Radar</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('community')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isCommunity ? 'text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1 font-medium">Community</span>
          </button>

          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer text-slate-700"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1 font-bold">Options</span>
          </button>
        </div>
      </nav>
    );
  }

  // In FPO mode: Dedicated Quality Assayer items
  if (currentRole === 'fpo') {
    return (
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:hidden"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)' }}
        aria-label="FPO Assayer Navigation"
      >
        <div className="max-w-md mx-auto px-2 py-1.5 grid grid-cols-4 gap-1 items-center">
          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isDashboard ? 'text-blue-700 font-bold' : 'text-slate-500'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1 font-medium">Assayer Desk</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('dashboard')}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer text-slate-500"
          >
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            <span className="text-[10px] tracking-tight mt-1 font-medium">Checkups</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('community')}
            className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
              isCommunity ? 'text-slate-900 font-bold' : 'text-slate-500'
            }`}
          >
            <Users className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1 font-medium">Community</span>
          </button>

          <button
            type="button"
            onClick={onOpenMobileDrawer}
            className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer text-slate-700"
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] tracking-tight mt-1 font-bold">Options</span>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:hidden transition-transform duration-200"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 6px)',
      }}
      aria-label="Mobile Bottom Navigation"
      id="mobile-bottom-navigation-bar"
    >
      <div className="max-w-md mx-auto px-2 py-1.5 grid grid-cols-5 gap-1 items-center">
        {/* 1. HOME */}
        <button
          type="button"
          onClick={() => {
            onNavigateTab('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
            isHome
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-current={isHome ? 'page' : undefined}
        >
          <div className="relative">
            <Store className={`w-5 h-5 transition-transform ${isHome ? 'scale-110 text-emerald-700' : 'text-slate-500'}`} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-emerald-600 rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-full font-medium">
            {language === 'te' ? 'హోమ్' : language === 'hi' ? 'होम' : 'Home'}
          </span>
        </button>

        {/* 2. SELLING DESK */}
        <button
          type="button"
          onClick={() => {
            onNavigateTab('selling');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
            isSelling
              ? 'text-emerald-800 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-current={isSelling ? 'page' : undefined}
          id="mobile-bottom-selling-btn"
        >
          <div className="relative">
            <div className={`p-1 rounded-lg ${isSelling ? 'bg-emerald-100 text-emerald-800' : ''}`}>
              <Wheat className={`w-5 h-5 ${isSelling ? 'text-emerald-800' : 'text-slate-500'}`} />
            </div>
            {(lotsCount > 0 || offersCount > 0) && (
              <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 bg-amber-500 text-slate-950 text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                {lotsCount + offersCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full font-medium">
            {language === 'te' ? 'అమ్మకం' : language === 'hi' ? 'बिक्री' : 'Selling'}
          </span>
        </button>

        {/* 3. MANDI RATES */}
        <button
          type="button"
          onClick={() => {
            onNavigateTab('markets');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
            isPrices
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-current={isPrices ? 'page' : undefined}
          id="mobile-bottom-rates-btn"
        >
          <div className="relative">
            <TrendingUp className={`w-5 h-5 transition-transform ${isPrices ? 'scale-110 text-slate-900' : 'text-slate-500'}`} />
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-emerald-500 text-white text-[8px] font-bold">
              Live
            </span>
          </div>
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-full font-medium">
            {language === 'te' ? 'మండి ధరలు' : language === 'hi' ? 'मंडी भाव' : 'Rates'}
          </span>
        </button>

        {/* 4. COMMUNITY */}
        <button
          type="button"
          onClick={() => {
            onNavigateTab('community');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 ${
            isCommunity
              ? 'text-slate-900 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
          aria-current={isCommunity ? 'page' : undefined}
          id="mobile-bottom-community-btn"
        >
          <div className="relative">
            <Users className={`w-5 h-5 transition-transform ${isCommunity ? 'scale-110 text-slate-900' : 'text-slate-500'}`} />
            {isCommunity && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-900 rounded-full" />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1 truncate max-w-full font-medium">
            {language === 'te' ? 'కమ్యూనిటీ' : language === 'hi' ? 'कम्युनिटी' : 'Community'}
          </span>
        </button>

        {/* 5. ALL OPTIONS (DRAWER OPENER) */}
        <button
          type="button"
          onClick={onOpenMobileDrawer}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer select-none active:scale-95 text-emerald-800 hover:text-emerald-950"
          id="mobile-bottom-all-options-btn"
          aria-label="Open all mobile options and tools"
        >
          <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full font-bold text-emerald-800">
            {language === 'te' ? 'అన్నీ' : language === 'hi' ? 'सभी' : 'Options'}
          </span>
        </button>
      </div>
    </nav>
  );
};
