import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast, ToastItem } from '../context/ToastContext';

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration ?? 4500;

  useEffect(() => {
    if (duration <= 0 || isPaused) return;

    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, isPaused, onDismiss]);

  const config = {
    success: {
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      progressBg: 'bg-emerald-500',
      icon: CheckCircle2,
      accentText: 'text-emerald-900',
    },
    error: {
      border: 'border-rose-200',
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      progressBg: 'bg-rose-500',
      icon: AlertCircle,
      accentText: 'text-rose-900',
    },
    warning: {
      border: 'border-amber-200',
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      progressBg: 'bg-amber-500',
      icon: AlertTriangle,
      accentText: 'text-amber-900',
    },
    info: {
      border: 'border-slate-200',
      iconBg: 'bg-slate-50 text-blue-600 border border-slate-100',
      progressBg: 'bg-blue-500',
      icon: Info,
      accentText: 'text-slate-900',
    },
  }[toast.type];

  const IconComponent = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="status"
      aria-live="polite"
      id={`toast-${toast.id}`}
      className={`pointer-events-auto relative w-full max-w-sm sm:max-w-md bg-white rounded-2xl border ${config.border} shadow-lg shadow-slate-900/5 p-4 overflow-hidden select-none`}
    >
      <div className="flex items-start gap-3">
        {/* Semantic Icon Badge */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${config.iconBg}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 pt-0.5">
          {toast.title && (
            <h4 className={`text-xs font-bold font-heading tracking-tight ${config.accentText} leading-snug`}>
              {toast.title}
            </h4>
          )}
          <p className="text-xs text-slate-600 font-normal leading-relaxed mt-0.5 break-words">
            {toast.message}
          </p>

          {toast.action && (
            <div className="mt-2.5">
              <button
                type="button"
                onClick={() => {
                  toast.action?.onClick();
                  onDismiss(toast.id);
                }}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-[11px] font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          type="button"
          onClick={() => onDismiss(toast.id)}
          aria-label="Close notification"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Countdown Progress Bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: isPaused ? '100%' : '0%' }}
            transition={{
              duration: isPaused ? 0 : duration / 1000,
              ease: 'linear',
            }}
            className={`h-full ${config.progressBg}`}
          />
        </div>
      )}
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div
      id="global-toast-container"
      aria-label="Notifications"
      className="fixed top-4 right-4 z-[9999] pointer-events-none flex flex-col items-end gap-2.5 max-w-[calc(100vw-2rem)] w-full sm:w-auto"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastCard key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};
