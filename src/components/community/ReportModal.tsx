import React, { useState } from 'react';
import { KisanPost } from '../../types/community';
import { X, Flag, AlertTriangle, ShieldCheck, Check } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: KisanPost | null;
  onSubmitReport: (data: {
    targetType: 'post' | 'comment' | 'user';
    targetId: string;
    targetTitleOrSnippet: string;
    reason: string;
    details: string;
  }) => void;
}

const REPORT_REASONS = [
  'Misleading farming remedy or unverified chemical advice',
  'Fake mandi prices or scam buyer information',
  'Commercial spam or unrelated promotion',
  'Stolen field photo / Impersonating another farmer',
  'Abusive, harmful, or offensive content',
  'Other issue',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  post,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState(REPORT_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !post) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      targetType: 'post',
      targetId: post.id,
      targetTitleOrSnippet: post.title,
      reason: selectedReason,
      details: details.trim(),
    });
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-4 h-4 text-rose-400" />
            <h3 className="font-bold text-sm">Report Content to Community Moderators</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Report Submitted</h4>
            <p className="text-xs text-slate-500">
              Thank you for keeping Kisan Community safe and truthful. Our agricultural moderation team will review this promptly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div>
              <span className="text-[11px] text-slate-500 block mb-1">Reported Post:</span>
              <p className="font-bold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200 truncate">
                {post.title}
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1.5">Select Reason</label>
              <div className="space-y-1.5">
                {REPORT_REASONS.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      selectedReason === r
                        ? 'bg-rose-50 border-rose-300 text-rose-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={selectedReason === r}
                      onChange={() => setSelectedReason(r)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe why this advice is harmful or incorrect..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-hidden resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
