import { useLanguage } from "../context/LanguageContext";
import { LanguageSelector } from "./LanguageSelector";
import { Sprout } from "lucide-react";
export const AuthLayout = ({ children }) => {
  const { t, language } = useLanguage();
  const getTranslatedTitle = () => {
    if (language === "te") return "\u0C38\u0C4D\u0C2E\u0C3E\u0C30\u0C4D\u0C1F\u0C4D \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C3E\u0C2F \u0C2A\u0C4D\u0C32\u0C3E\u0C1F\u0C4D\u200C\u0C2B\u0C3E\u0C30\u0C2E\u0C4D\u200C\u0C15\u0C41 \u0C38\u0C4D\u0C35\u0C3E\u0C17\u0C24\u0C02";
    if (language === "hi") return "\u0938\u094D\u092E\u093E\u0930\u094D\u091F \u0915\u0943\u0937\u093F \u092E\u0902\u091A \u092E\u0947\u0902 \u0906\u092A\u0915\u093E \u0938\u094D\u0935\u093E\u0917\u0924 \u0939\u0948";
    return "Welcome to the Smart Agriculture Platform";
  };
  const getTranslatedSubtitle = () => {
    if (language === "te") return "\u0C30\u0C48\u0C24\u0C41\u0C32\u0C41, \u0C15\u0C4A\u0C28\u0C41\u0C17\u0C4B\u0C32\u0C41\u0C26\u0C3E\u0C30\u0C41\u0C32\u0C41, FPO\u0C32\u0C41 \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C30\u0C35\u0C3E\u0C23\u0C3E\u0C26\u0C3E\u0C30\u0C41\u0C32\u0C28\u0C41 \u0C12\u0C15\u0C47 \u0C35\u0C3F\u0C36\u0C4D\u0C35\u0C38\u0C28\u0C40\u0C2F \u0C35\u0C47\u0C26\u0C3F\u0C15\u0C2A\u0C48 \u0C15\u0C32\u0C41\u0C2A\u0C41\u0C24\u0C4B\u0C02\u0C26\u0C3F.";
    if (language === "hi") return "\u0915\u093F\u0938\u093E\u0928\u094B\u0902, \u0916\u0930\u0940\u0926\u093E\u0930\u094B\u0902, \u090F\u092B\u092A\u0940\u0913 \u0914\u0930 \u091F\u094D\u0930\u093E\u0902\u0938\u092A\u094B\u0930\u094D\u091F\u0930\u094B\u0902 \u0915\u094B \u090F\u0915 \u092D\u0930\u094B\u0938\u0947\u092E\u0902\u0926 \u092A\u093E\u0930\u093F\u0938\u094D\u0925\u093F\u0924\u093F\u0915\u0940 \u0924\u0902\u0924\u094D\u0930 \u092E\u0947\u0902 \u091C\u094B\u0921\u093C\u0928\u093E\u0964";
    return "Connecting Farmers, Buyers, FPOs and Transporters in one trusted ecosystem.";
  };
  return <div className="min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white relative overflow-x-hidden font-sans">
      {
    /* Top Navigation Bar */
  }
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex items-center justify-between z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
            <Sprout className="w-5 h-5 text-emerald-100" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl block leading-tight">
              {t("appName")}
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 tracking-wide block">
              {language === "te" ? "\u0C38\u0C4D\u0C2E\u0C3E\u0C30\u0C4D\u0C1F\u0C4D \u0C35\u0C4D\u0C2F\u0C35\u0C38\u0C3E\u0C2F \u0C35\u0C47\u0C26\u0C3F\u0C15" : language === "hi" ? "\u0938\u094D\u092E\u093E\u0930\u094D\u091F \u0915\u0943\u0937\u093F \u092E\u0902\u091A" : "Smart Agriculture Platform"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSelector />
        </div>
      </header>

      {
    /* Main Authentic Agriculture Authentication Container */
  }
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-5 z-10">
        <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-slate-300/60 border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all">
          {
    /* Left Side: Realistic Indian Farmer Agriculture Visual Banner */
  }
          <div className="lg:col-span-5 relative flex flex-col justify-between min-h-[220px] sm:min-h-[260px] lg:min-h-[640px] overflow-hidden bg-slate-900">
            {
    /* Real Agriculture Photography */
  }
            <img
    src="/farmer_hero.jpg"
    alt="Indian Farmer in Green Agriculture Field"
    className="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
    loading="eager"
  />

            {
    /* Gradient Overlays for optimal typography legibility and warm natural agricultural feel */
  }
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-emerald-950/40" />
            <div className="absolute inset-0 bg-radial from-transparent via-slate-950/20 to-slate-950/80" />

            {
    /* Content overlaid on image */
  }
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between h-full text-white">
              {
    /* Top badge */
  }
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-200 text-xs font-semibold backdrop-blur-md shadow-sm">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  <span>KisanSetu Ecosystem</span>
                </div>
              </div>

              {
    /* Bottom text block with clear, trustworthy message */
  }
              <div className="mt-8 lg:mt-auto pt-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug drop-shadow-md">
                  {getTranslatedTitle()}
                </h1>

                <p className="text-emerald-50 text-xs sm:text-sm leading-relaxed mt-2.5 drop-shadow font-medium max-w-md">
                  {getTranslatedSubtitle()}
                </p>

                {
    /* Ecosystem Participant Highlights */
  }
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

          {
    /* Right Side: Role Selection & Authentication Card */
  }
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 flex flex-col justify-center bg-white">
            {children}
          </div>
        </div>
      </main>

      {
    /* Trust & Copyright Footer */
  }
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-xs text-slate-500">
        <p>
          © {(/* @__PURE__ */ new Date()).getFullYear()} {t("appName")} • Smart Agriculture Platform. All rights reserved.
        </p>
      </footer>
    </div>;
};
