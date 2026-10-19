import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AuthLayout } from '../components/AuthLayout';
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const { resetPassword, formatAuthError } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrorMessage(t('emailRequired'));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage(t('invalidEmail'));
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccessMessage(t('passwordResetSent'));
    } catch (error: any) {
      setErrorMessage(formatAuthError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto" id="forgot-password-container">
        {/* Back Link */}
        <Link
          to="/login"
          id="back-to-login-link"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('backToLogin')}</span>
        </Link>

        {/* Icon Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {t('forgotPassword')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {t('passwordResetInstructions')}
          </p>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div
            id="forgot-password-error-alert"
            className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            id="forgot-password-success-alert"
            className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">{successMessage}</p>
              <p className="text-xs text-emerald-700">{t('passwordResetInstructions')}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="forgot-password-form">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1" htmlFor="forgot-email">
              {t('email')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                disabled={isLoading}
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none disabled:opacity-60"
                required
              />
            </div>
          </div>

          <button
            id="reset-password-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t('sendingResetLink')}</span>
              </>
            ) : (
              <span>{t('resetPasswordButton')}</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          <span>{t('alreadyHaveAccount')} </span>
          <Link
            to="/login"
            id="return-to-login-link"
            className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
          >
            {t('signInHere')}
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
