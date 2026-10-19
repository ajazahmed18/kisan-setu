import React from 'react';
import { Wheat, TrendingUp, ArrowRight, Sparkles, Building2, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type PageMode = 'selling' | 'prices';

interface PageModeSwitcherProps {
  activeMode: PageMode;
  onModeChange: (mode: PageMode) => void;
  lotsCount?: number;
  offersCount?: number;
  sellRequestsCount?: number;
}

export const PageModeSwitcher: React.FC<PageModeSwitcherProps> = ({
  activeMode,
  onModeChange,
  lotsCount = 0,
  offersCount = 0,
  sellRequestsCount = 0,
}) => {
  const { language } = useLanguage();

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4 mb-6 transition-all text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Two-Button Toggle Segment */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl border border-slate-200/60 w-full md:w-auto">
          {/* Selling Page Tab */}
          <button
            type="button"
            id="page-mode-selling-tab"
            onClick={() => onModeChange('selling')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-1.5 sm:gap-2.5 px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeMode === 'selling'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
              activeMode === 'selling' ? 'bg-emerald-800 text-amber-300' : 'bg-slate-200 text-slate-600'
            }`}>
              <Wheat className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">
              {language === 'te'
                ? 'పంట అమ్మకం డెస్క్'
                : language === 'hi'
                ? 'फसल बिक्री केंद्र'
                : 'Selling Desk'}
            </span>
            {(lotsCount > 0 || sellRequestsCount > 0) && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-medium shrink-0 ${
                activeMode === 'selling' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {lotsCount + sellRequestsCount}
              </span>
            )}
          </button>

          {/* Existing Prices Page Tab */}
          <button
            type="button"
            id="page-mode-prices-tab"
            onClick={() => onModeChange('prices')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 px-2.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeMode === 'prices'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
            }`}
          >
            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
              activeMode === 'prices' ? 'bg-slate-800 text-emerald-400' : 'bg-slate-200 text-slate-600'
            }`}>
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <span className="truncate">
              {language === 'te'
                ? 'మార్కెట్ ధరలు'
                : language === 'hi'
                ? 'मंडी भाव व रुझान'
                : 'Market Rates'}
            </span>
            <span className={`text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold shrink-0 ${
              activeMode === 'prices' ? 'bg-emerald-950 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
            }`}>
              Live APMC
            </span>
          </button>
        </div>

        {/* Dynamic Contextual Helper Banner */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
          {activeMode === 'selling' ? (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 hidden lg:inline">Want to check rates before selling?</span>
              <button
                type="button"
                onClick={() => onModeChange('prices')}
                className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Check Mandi Prices</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 hidden lg:inline">Ready to sell at current rates?</span>
              <button
                type="button"
                onClick={() => onModeChange('selling')}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Go to Selling Desk</span>
                <ArrowRight className="w-3 h-3 text-emerald-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
