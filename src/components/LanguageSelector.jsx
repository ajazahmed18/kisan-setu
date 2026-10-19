import { useState, useRef, useEffect } from "react";
import { useLanguage, languagesList } from "../context/LanguageContext";
import { Globe, ChevronDown, Check } from "lucide-react";
export const LanguageSelector = ({
  className = "",
  variant = "light"
}) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const activeLang = languagesList.find((l) => l.code === language) || languagesList[0];
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const isGlass = variant === "glass";
  return <div className={`relative inline-block text-left ${className}`} ref={dropdownRef} id="language-selector-wrapper">
      <button
    id="language-selector-btn"
    type="button"
    onClick={() => setIsOpen(!isOpen)}
    className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all focus:outline-none focus:ring-2 cursor-pointer ${isGlass ? "bg-[#07130a]/80 hover:bg-[#07130a]/95 text-white border border-white/20 hover:border-emerald-400/50 backdrop-blur-md shadow-lg focus:ring-emerald-400" : "text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs focus:ring-emerald-500 focus:border-emerald-500"}`}
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
        <Globe className={`w-4 h-4 shrink-0 ${isGlass ? "text-emerald-400" : "text-emerald-600"}`} />
        <span className={`font-semibold ${isGlass ? "text-white" : "text-slate-900"}`}>{activeLang.nativeName}</span>
        <span className={`text-xs hidden sm:inline ${isGlass ? "text-gray-300" : "text-slate-400"}`}>({activeLang.label})</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""} ${isGlass ? "text-gray-300" : "text-slate-500"}`} />
      </button>

      {isOpen && <div
    id="language-dropdown-menu"
    className={`absolute right-0 mt-2 w-48 origin-top-right rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 border ${isGlass ? "bg-[#07130a]/95 backdrop-blur-xl border-emerald-500/30 text-white" : "bg-white border-slate-200 text-slate-800"}`}
  >
          <div className={`px-3 py-1 text-[11px] font-semibold uppercase tracking-wider border-b ${isGlass ? "text-emerald-400/80 border-white/10" : "text-slate-400 border-slate-100"}`}>
            Language / భాష / भाषा
          </div>
          {languagesList.map((lang) => {
    const isSelected = lang.code === language;
    return <button
      key={lang.code}
      id={`lang-select-${lang.code}`}
      type="button"
      onClick={() => {
        setLanguage(lang.code);
        setIsOpen(false);
      }}
      className={`w-full text-left px-3 py-2 text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${isSelected ? isGlass ? "bg-emerald-600/30 text-emerald-300 font-semibold" : "bg-emerald-50 text-emerald-900 font-semibold" : isGlass ? "text-gray-200 hover:bg-white/10 hover:text-white" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"}`}
    >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.nativeName}</span>
                  <span className={`text-[11px] ${isGlass ? "text-gray-400" : "text-slate-500"}`}>{lang.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
              </button>;
  })}
        </div>}
    </div>;
};
