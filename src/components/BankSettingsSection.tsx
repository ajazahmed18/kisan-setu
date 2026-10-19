import React, { useState } from 'react';
import { Landmark, CreditCard, ShieldCheck, Check, AlertCircle, Copy, Sparkles, ArrowRight } from 'lucide-react';

export interface BankSettingsData {
  bankName: string;
  accountNumber: string;
  confirmAccountNumber?: string;
  ifscCode: string;
  accountHolderName: string;
  upiId: string;
  paytmNumber?: string;
  payoutMode?: 'instant_upi' | 'imps_neft';
}

interface BankSettingsSectionProps {
  data: BankSettingsData;
  onChange: (updated: Partial<BankSettingsData>) => void;
  disabled?: boolean;
}

const POPULAR_BANKS = [
  'State Bank of India',
  'Telangana Grameena Bank',
  'Andhra Pradesh Grameena Vikas Bank',
  'HDFC Bank',
  'ICICI Bank',
  'Punjab National Bank',
  'Canara Bank',
  'Bank of Baroda',
  'Union Bank of India',
  'Axis Bank',
];

export const BankSettingsSection: React.FC<BankSettingsSectionProps> = ({
  data,
  onChange,
  disabled = false,
}) => {
  const [showFullAccount, setShowFullAccount] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const isAccountMatch =
    !data.confirmAccountNumber || data.accountNumber === data.confirmAccountNumber;

  const handleCopyUpi = () => {
    if (!data.upiId) return;
    navigator.clipboard.writeText(data.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const maskedAccount =
    data.accountNumber.length > 4
      ? `•••• •••• ${data.accountNumber.slice(-4)}`
      : data.accountNumber || '•••• •••• ••••';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200 shadow-2xs">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Direct Bank & Payout Settings</span>
              <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                Old Settings Editable
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Escrow crop sale proceeds and logistics payouts are directly disbursed to this destination (0% fee).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Account Data</span>
        </div>
      </div>

      {/* Visual RuPay Kisan Debit Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-1">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-emerald-900 via-teal-800 to-emerald-700 text-white p-5 shadow-lg border border-emerald-600/40">
            {/* Background pattern */}
            <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/20 blur-xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full pointer-events-none" />

            <div className="relative z-10 flex flex-col justify-between h-44">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-200 uppercase block">
                    Kisan Direct Payout Card
                  </span>
                  <span className="text-xs font-bold text-white tracking-wide truncate max-w-[150px] block">
                    {data.bankName || 'State Bank of India'}
                  </span>
                </div>
                <div className="px-2 py-0.5 rounded bg-emerald-500/30 text-[10px] font-mono font-bold text-emerald-200 border border-emerald-400/30">
                  RuPay
                </div>
              </div>

              {/* EMV Chip Visual */}
              <div className="w-9 h-7 rounded bg-amber-300/80 border border-amber-400/60 flex items-center justify-center shadow-inner my-1">
                <div className="w-5 h-4 border border-amber-600/40 rounded-xs" />
              </div>

              {/* Account Number */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono tracking-widest text-white">
                    {showFullAccount ? data.accountNumber || '•••• •••• ••••' : maskedAccount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowFullAccount(!showFullAccount)}
                    className="text-[10px] text-emerald-300 hover:text-white underline cursor-pointer"
                  >
                    {showFullAccount ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="flex items-end justify-between mt-2 pt-2 border-t border-emerald-600/50">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-emerald-300/80 block">
                      Account Holder
                    </span>
                    <span className="text-xs font-semibold text-white tracking-wide truncate max-w-[140px] block">
                      {data.accountHolderName || 'Account Holder Name'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase tracking-wider text-emerald-300/80 block">
                      IFSC
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-100">
                      {data.ifscCode || 'SBIN0020145'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Bank Selection Chips */}
        <div className="lg:col-span-2 space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Quick Select Common Agri Banks
          </label>
          <div className="flex flex-wrap gap-2">
            {POPULAR_BANKS.map((bName) => (
              <button
                key={bName}
                type="button"
                onClick={() => onChange({ bankName: bName })}
                disabled={disabled}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
                  data.bankName === bName
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs font-semibold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {bName}
              </button>
            ))}
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900 mt-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Smart Payout Guarantee:</strong> When a buyer accepts your lot on Rythu Mitra, the payment is held in escrow and released directly to these bank coordinates within 15 minutes of crop inspection.
            </span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Bank Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bank Name *
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            value={data.bankName}
            onChange={(e) => onChange({ bankName: e.target.value })}
            placeholder="e.g. State Bank of India"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        {/* Account Holder Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Account Holder Name (As per Bank Records) *
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            value={data.accountHolderName}
            onChange={(e) => onChange({ accountHolderName: e.target.value })}
            placeholder="e.g. Ramesh Kumar"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        {/* Account Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bank Account Number *
          </label>
          <input
            type="text"
            required
            disabled={disabled}
            value={data.accountNumber}
            onChange={(e) => onChange({ accountNumber: e.target.value.replace(/\s+/g, '') })}
            placeholder="e.g. 38492019482"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        {/* Confirm Account Number */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Confirm Account Number *
            </label>
            {data.confirmAccountNumber && (
              <span
                className={`text-[11px] font-semibold flex items-center gap-1 ${
                  isAccountMatch ? 'text-emerald-700' : 'text-rose-600'
                }`}
              >
                {isAccountMatch ? (
                  <>
                    <Check className="w-3 h-3" /> Matches
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" /> Doesn't match
                  </>
                )}
              </span>
            )}
          </div>
          <input
            type="text"
            disabled={disabled}
            value={data.confirmAccountNumber || ''}
            onChange={(e) => onChange({ confirmAccountNumber: e.target.value.replace(/\s+/g, '') })}
            placeholder="Re-enter bank account number"
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 bg-white ${
              !isAccountMatch
                ? 'border-rose-400 focus:ring-rose-400'
                : 'border-slate-300 focus:ring-emerald-500'
            }`}
          />
        </div>

        {/* IFSC Code */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            IFSC Code *
          </label>
          <div className="relative">
            <input
              type="text"
              required
              disabled={disabled}
              value={data.ifscCode}
              onChange={(e) => onChange({ ifscCode: e.target.value.toUpperCase().replace(/\s+/g, '') })}
              placeholder="e.g. SBIN0020145"
              maxLength={11}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            {data.ifscCode.length === 11 && (
              <span className="absolute right-3 top-2.5 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-md">
                VALID 11-DIGIT
              </span>
            )}
          </div>
        </div>

        {/* Primary UPI ID */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700">
              Primary UPI ID (For Instant Mobile Settlement)
            </label>
            {data.upiId && (
              <button
                type="button"
                onClick={handleCopyUpi}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                {copiedUpi ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <input
            type="text"
            disabled={disabled}
            value={data.upiId}
            onChange={(e) => onChange({ upiId: e.target.value.trim().toLowerCase() })}
            placeholder="e.g. ramesh.farmer@sbi or 9848023456@upi"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        {/* Paytm / GPay Linked Mobile */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Paytm / PhonePe Linked Number
          </label>
          <input
            type="text"
            disabled={disabled}
            value={data.paytmNumber || ''}
            onChange={(e) => onChange({ paytmNumber: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            placeholder="e.g. 9848023456"
            maxLength={10}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          />
        </div>

        {/* Preferred Payout Speed */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Preferred Disbursement Route
          </label>
          <select
            disabled={disabled}
            value={data.payoutMode || 'instant_upi'}
            onChange={(e) => onChange({ payoutMode: e.target.value as any })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="instant_upi">Instant UPI Transfer (Real-time &lt; 5 mins)</option>
            <option value="imps_neft">Direct Bank IMPS / NEFT Transfer</option>
          </select>
        </div>
      </div>
    </div>
  );
};
