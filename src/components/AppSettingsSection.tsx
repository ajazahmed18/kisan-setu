import React from 'react';
import { Sliders, Bell, MessageSquare, CloudRain, Volume2, Globe, RotateCcw, Smartphone, Check } from 'lucide-react';

export interface AppPreferencesData {
  preferredLanguage: 'en' | 'te' | 'hi';
  smsAlerts: boolean;
  whatsappUpdates: boolean;
  mandiPriceAlerts: boolean;
  weatherWarnings: boolean;
  voiceGuidance: boolean;
  audioAssistance: boolean;
}

interface AppSettingsSectionProps {
  data: AppPreferencesData;
  onChange: (updated: Partial<AppPreferencesData>) => void;
  onResetDefaults: () => void;
  disabled?: boolean;
}

export const AppSettingsSection: React.FC<AppSettingsSectionProps> = ({
  data,
  onChange,
  onResetDefaults,
  disabled = false,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200 shadow-2xs">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>App Preferences & Notification Settings</span>
              <span className="text-[11px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                Old Settings Editable
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Customize how Rythu Mitra communicates mandi alerts, weather warnings, and transaction notices.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onResetDefaults}
          disabled={disabled}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer self-start sm:self-center"
          title="Reset notification and display settings to original defaults"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Language Preference */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-bold text-slate-900">Default App Interface Language</span>
        </div>
        <div className="grid grid-cols-3 gap-3 max-w-md">
          {[
            { code: 'en' as const, label: 'English', sub: 'Standard' },
            { code: 'te' as const, label: 'తెలుగు', sub: 'Telugu' },
            { code: 'hi' as const, label: 'हिन्दी', sub: 'Hindi' },
          ].map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => onChange({ preferredLanguage: item.code })}
              disabled={disabled}
              className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                data.preferredLanguage === item.code
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="block text-sm font-semibold">{item.label}</span>
              <span
                className={`text-[10px] block mt-0.5 ${
                  data.preferredLanguage === item.code ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {item.sub}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggle Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Mandi Price SMS Alert */}
        <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors bg-white flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Daily Mandi Price SMS</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Receive morning APMC price updates for your primary crops directly via SMS.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              disabled={disabled}
              checked={data.mandiPriceAlerts}
              onChange={(e) => onChange({ mandiPriceAlerts: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* WhatsApp Offer Notifications */}
        <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors bg-white flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">WhatsApp Bid &amp; Offer Alerts</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Instant WhatsApp message whenever an institutional buyer bids on your lot.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              disabled={disabled}
              checked={data.whatsappUpdates}
              onChange={(e) => onChange({ whatsappUpdates: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Weather Warnings */}
        <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors bg-white flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Severe Weather &amp; Pest Alerts</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Urgent storm, unseasonal rainfall, and pest infestation notices in your district.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              disabled={disabled}
              checked={data.weatherWarnings}
              onChange={(e) => onChange({ weatherWarnings: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>

        {/* Regional Voice AI Guidance */}
        <div className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors bg-white flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Voice Guidance &amp; Audio Prompts</span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Read aloud mandi insights and offer summaries in Telugu and Hindi dialects.
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              disabled={disabled}
              checked={data.voiceGuidance}
              onChange={(e) => onChange({ voiceGuidance: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
