import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Eye, EyeOff, FileText, Award, HelpCircle } from 'lucide-react';

export interface KycSettingsData {
  aadharNumber: string;
  panCard: string;
  kccNumber?: string;
  soilHealthCardId?: string;
}

interface KycSettingsSectionProps {
  data: KycSettingsData;
  onChange: (updated: Partial<KycSettingsData>) => void;
  disabled?: boolean;
}

export const KycSettingsSection: React.FC<KycSettingsSectionProps> = ({
  data,
  onChange,
  disabled = false,
}) => {
  const [showAadhaar, setShowAadhaar] = useState(false);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>KYC & Government ID Verification</span>
              <span className="text-[11px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                Old Settings Editable
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Government verification credentials ensure authenticity, biometric validation, and zero escrow disputes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Government Certified Identity</span>
        </div>
      </div>

      {/* Verification Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">UIDAI Biometric</span>
            <span className="text-[11px] text-emerald-700 font-medium">Aadhaar Linked</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">IT Department</span>
            <span className="text-[11px] text-blue-700 font-medium">PAN Verified</span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">Rythu Bandhu / PM-Kisan</span>
            <span className="text-[11px] text-purple-700 font-medium">Active Beneficiary</span>
          </div>
        </div>
      </div>

      {/* KYC Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Aadhaar Number */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Aadhaar Card Number *
            </label>
            <button
              type="button"
              onClick={() => setShowAadhaar(!showAadhaar)}
              className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer font-medium"
            >
              {showAadhaar ? (
                <>
                  <EyeOff className="w-3 h-3" /> Hide
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3" /> Show
                </>
              )}
            </button>
          </div>
          <input
            type={showAadhaar ? 'text' : 'password'}
            required
            disabled={disabled}
            value={data.aadharNumber}
            onChange={(e) => onChange({ aadharNumber: e.target.value.trim() })}
            placeholder="XXXX-XXXX-4321"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Masked in public views. Only last 4 digits visible to buyers.
          </p>
        </div>

        {/* PAN Card */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            PAN / Tax Identifier *
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            value={data.panCard}
            onChange={(e) => onChange({ panCard: e.target.value.toUpperCase().replace(/\s+/g, '') })}
            placeholder="ABCDE1234F"
            maxLength={10}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Required for bank settlements over ₹50,000 as per RBI guidelines.
          </p>
        </div>

        {/* Kisan Credit Card / PM-Kisan ID */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Kisan Credit Card (KCC) / PM-Kisan Reg ID
          </label>
          <input
            type="text"
            disabled={disabled}
            value={data.kccNumber || ''}
            onChange={(e) => onChange({ kccNumber: e.target.value.trim().toUpperCase() })}
            placeholder="e.g. KCC-TS-849201"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* Soil Health Card Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Soil Health Card ID (Optional)
          </label>
          <input
            type="text"
            disabled={disabled}
            value={data.soilHealthCardId || ''}
            onChange={(e) => onChange({ soilHealthCardId: e.target.value.trim().toUpperCase() })}
            placeholder="e.g. SHC-2024-WGL-9482"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
      </div>
    </div>
  );
};
