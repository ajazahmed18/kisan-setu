import React, { ReactNode } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Sprout, Users, ShieldCheck, Truck, Building2 } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  const { t, language } = useLanguage();

  const getTranslatedTitle = () => {
    if (language === 'te') return 'స్మార్ట్ వ్యవసాయ ప్లాట్‌ఫారమ్‌కు స్వాగతం';
    if (language === 'hi') return 'स्मार्ट कृषि मंच में आपका स्वागत है';
    return 'Welcome to the Smart Agriculture Platform';
  };

  const getTranslatedSubtitle = () => {
    if (language === 'te') return 'రైతులు, కొనుగోలుదారులు, FPOలు మరియు రవాణాదారులను ఒకే విశ్వసనీయ వేదికపై కలుపుతోంది.';
    if (language === 'hi') return 'किसानों, खरीदारों, एफपीओ और ट्रांसपोर्टरों को एक भरोसेमंद पारिस्थितिकी तंत्र में जोड़ना।';
    return 'Connecting Farmers, Buyers, FPOs and Transporters in one trusted ecosystem.';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative overflow-x-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl block leading-tight">
              {t('appName')}
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 tracking-wide block">
              {language === 'te' ? 'స్మార్ట్ వ్యవసాయ వేదిక' : language === 'hi' ? 'स्मार्ट कृषि मंच' : 'Smart Agriculture Platform'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
        </div>
      </header>

      {/* Main Authentic Agriculture Authentication Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-5 z-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-slate-300/60 border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
          {/* Left Side: Realistic Indian Farmer Agriculture Visual Banner */}
          <div className="lg:col-span-5 relative flex flex-col justify-between min-h-[220px] sm:min-h-[260px] lg:min-h-[640px] overflow-hidden bg-slate-900">
            {/* Real Agriculture Photography */}
            <img
              src="/farmer_hero.jpg"
              alt="Indian Farmer in Green Agriculture Field"
              className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
              loading="eager"
            />

            {/* Gradient Overlays for optimal typography legibility and warm natural agricultural feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-emerald-950/40" />
            <div className="absolute inset-0 bg-radial from-transparent via-slate-950/20 to-slate-950/80" />

            {/* Content overlaid on image */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full text-white">
              {/* Top badge */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 text-xs font-semibold backdrop-blur-md shadow-sm">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KisanSetu Ecosystem</span>
                </div>
              </div>

              {/* Bottom text block with clear, trustworthy message */}
              <div className="mt-8 lg:mt-auto pt-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                  {getTranslatedTitle()}
                </h1>

                <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed mt-2.5 drop-shadow font-medium max-w-md">
                  {getTranslatedSubtitle()}
                </p>

                {/* Ecosystem Participant Highlights */}
                <div className="hidden sm:grid grid-cols-2 gap-2 mt-6 pt-5 border-t border-white/20">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-100 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
                    <span className="text-base">🌱</span>
                    <span>Farmers & FPOs</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-100 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
                    <span className="text-base">🛡️</span>
                    <span>Verified Buyers</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-100 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
                    <span className="text-base">🚚</span>
                    <span>Transporters</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-100 bg-white/10 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-white/10">
                    <span className="text-base">🛡️</span>
                    <span>Admin Security</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Role Selection & Authentication Card */}
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
            {children}
          </div>
        </div>
      </main>

      {/* Trust & Copyright Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-xs text-slate-500">
        <p>
          © {new Date().getFullYear()} {t('appName')} • Smart Agriculture Platform. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
