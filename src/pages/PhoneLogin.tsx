import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { AuthLayout } from '../components/AuthLayout';
import { Phone, ArrowLeft, Loader2, AlertCircle, CheckCircle2, ShieldCheck, RefreshCw, Mail } from 'lucide-react';

export const PhoneLogin: React.FC = () => {
  const { sendPhoneOtp, verifyPhoneOtp, formatAuthError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Step 1: 'phone' or Step 2: 'otp'
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPhoneProviderDisabled, setIsPhoneProviderDisabled] = useState(false);
  const [isPhoneRegionBlocked, setIsPhoneRegionBlocked] = useState(false);
  const [isBillingNotEnabled, setIsBillingNotEnabled] = useState(false);

  // Timer for OTP resend
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Confirmation result from Firebase
  const confirmationResultRef = useRef<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Countdown effect
  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  // Clean up reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch {
          // ignore cleanup errors
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const getFullPhoneNumber = () => {
    const cleanDigits = phoneDigits.replace(/\D/g, '');
    return `${countryCode}${cleanDigits}`;
  };

  // Clean up Recaptcha
  const cleanupRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch {
        // ignore
      }
      recaptchaVerifierRef.current = null;
    }
    const container = document.getElementById('recaptcha-container');
    if (container) {
      container.innerHTML = '';
      const clone = container.cloneNode(false) as HTMLElement;
      container.parentNode?.replaceChild(clone, container);
    }
  };

  useEffect(() => {
    return () => {
      cleanupRecaptcha();
    };
  }, []);

  // Initialize or reset reCAPTCHA
  const initRecaptcha = (): RecaptchaVerifier => {
    cleanupRecaptcha();

    let container = document.getElementById('recaptcha-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'recaptcha-container';
      document.body.appendChild(container);
    }

    try {
      const verifier = new RecaptchaVerifier(auth, container, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          setErrorMessage(t('recaptchaFailed'));
          cleanupRecaptcha();
        },
      });
      recaptchaVerifierRef.current = verifier;
      return verifier;
    } catch (err) {
      console.warn('Fallback recaptcha in PhoneLogin:', err);
      const uniqueId = `recaptcha-${Date.now()}`;
      const freshDiv = document.createElement('div');
      freshDiv.id = uniqueId;
      document.body.appendChild(freshDiv);

      const verifier = new RecaptchaVerifier(auth, freshDiv, {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {
          setErrorMessage(t('recaptchaFailed'));
          cleanupRecaptcha();
        },
      });
      recaptchaVerifierRef.current = verifier;
      return verifier;
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanDigits = phoneDigits.replace(/\D/g, '');
    if (!cleanDigits) {
      setErrorMessage(t('phoneRequired'));
      return;
    }
    if (cleanDigits.length < 8 || cleanDigits.length > 15) {
      setErrorMessage(t('invalidPhone'));
      return;
    }

    setIsLoading(true);
    try {
      const fullPhone = getFullPhoneNumber();
      const appVerifier = initRecaptcha();
      const confirmation = await sendPhoneOtp(fullPhone, appVerifier);
      confirmationResultRef.current = confirmation;
      setStep('otp');
      setCountdown(60);
      setCanResend(false);
      setSuccessMessage(t('otpSentSuccess'));
    } catch (error: any) {
      console.error('Phone OTP Error:', error);
      cleanupRecaptcha();
      const msg = (error?.message || '').toLowerCase();
      if (
        error?.code === 'auth/billing-not-enabled' ||
        msg.includes('billing-not-enabled')
      ) {
        setIsBillingNotEnabled(true);
        setIsPhoneRegionBlocked(false);
        setIsPhoneProviderDisabled(false);
      } else if (msg.includes('region enabled') || msg.includes('region') || msg.includes('sms unable to be sent until this region')) {
        setIsPhoneRegionBlocked(true);
        setIsPhoneProviderDisabled(false);
        setIsBillingNotEnabled(false);
      } else if (
        error?.code === 'auth/operation-not-allowed' ||
        error?.message?.includes('operation-not-allowed')
      ) {
        setIsPhoneProviderDisabled(true);
        setIsPhoneRegionBlocked(false);
        setIsBillingNotEnabled(false);
      }
      setErrorMessage(formatAuthError(error, 'phone'));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanOtp = otpCode.replace(/\D/g, '');
    if (!cleanOtp) {
      setErrorMessage(t('otpRequired'));
      return;
    }
    if (cleanOtp.length !== 6) {
      setErrorMessage(t('invalidOtpFormat'));
      return;
    }

    if (!confirmationResultRef.current) {
      setErrorMessage(t('otpExpired'));
      setStep('phone');
      return;
    }

    setIsLoading(true);
    try {
      await verifyPhoneOtp(confirmationResultRef.current, cleanOtp);
      setSuccessMessage(t('otpVerifiedSuccess'));
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } catch (error: any) {
      console.error('OTP Verification Error:', error);
      setErrorMessage(formatAuthError(error, 'phone'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto" id="phone-login-container">
        {/* Invisible reCAPTCHA Anchor */}
        <div id="recaptcha-container" />

        {/* Back Link */}
        <Link
          to="/login"
          id="phone-back-to-login-link"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors mb-6 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('backToLogin')}</span>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
            <Phone className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {step === 'phone' ? t('continueWithPhone') : t('verifyOtp')}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {step === 'phone' ? t('phoneHelper') : `${t('enterOtpMessage')} (${getFullPhoneNumber()})`}
          </p>
        </div>

        {/* Feedback Alerts */}
        {isBillingNotEnabled && (
          <div
            id="phone-billing-not-enabled-guide"
            className="mb-5 p-4 rounded-2xl bg-amber-50/95 border border-amber-300 text-amber-950 text-xs sm:text-sm space-y-3 animate-in fade-in slide-in-from-top-1"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 text-sm">
                  Firebase SMS Billing Notice (auth/billing-not-enabled)
                </div>
                <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
                  Firebase requires Cloud Billing (Blaze pay-as-you-go) to deliver real SMS text messages to cellular devices. However, you can continue immediately without billing using any of these options:
                </p>
              </div>
            </div>

            <div className="bg-white/95 p-3.5 rounded-xl border border-amber-200 text-xs space-y-2.5 text-slate-700">
              <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <span>⚡</span> Option 1: Free Test Phone Number (Zero Cost, No Billing Required)
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Firebase allows testing Phone Authentication on the <strong>free plan without adding a credit card</strong>:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                <li>
                  Open{' '}
                  <a
                    href="https://console.firebase.google.com/project/gen-lang-client-0003046836/authentication/providers"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold underline inline-flex items-center gap-0.5"
                  >
                    Firebase Auth &gt; Sign-in Providers ↗
                  </a>
                </li>
                <li>Click <strong>Phone</strong> and expand <strong>"Phone numbers for testing (optional)"</strong></li>
                <li>
                  Add a number, e.g. <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-900">+919876543210</code> with test verification code <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-900">123456</code>
                </li>
                <li>Click <strong>Save</strong>, then enter that number here and verify with code <strong>123456</strong>!</li>
              </ol>

              <div className="border-t border-amber-100 pt-2 font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <span>💳</span> Option 2: Enable Firebase Billing for Live SMS
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                To send live cellular SMS messages to actual Indian mobile numbers, upgrade your Firebase project to Blaze at the{' '}
                <a
                  href="https://console.firebase.google.com/project/gen-lang-client-0003046836/usage/details"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold underline inline-flex items-center gap-0.5"
                >
                  Firebase Usage &amp; Billing Page ↗
                </a>.
              </p>
            </div>

            <div className="pt-1">
              <div className="text-[11px] font-semibold text-amber-800 mb-1.5">
                Or sign in immediately without SMS:
              </div>
              <Link
                to="/login"
                id="btn-return-login-billing"
                className="inline-flex items-center justify-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl gap-1.5 shadow-2xs transition-all"
              >
                <span>Return to Login (Email / Google)</span>
              </Link>
            </div>
          </div>
        )}

        {isPhoneRegionBlocked && (
          <div
            id="phone-region-blocked-guide"
            className="mb-5 p-4 rounded-2xl bg-amber-50/95 border border-amber-300 text-amber-950 text-xs sm:text-sm space-y-3 animate-in fade-in slide-in-from-top-1"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 text-sm">
                  Firebase SMS Region Policy: India (+91) Restricted
                </div>
                <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
                  Firebase returned: <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 text-[11px] font-semibold">SMS unable to be sent until this region enabled by the app developer (auth/operation-not-allowed)</code>.
                </p>
              </div>
            </div>

            <div className="bg-white/95 p-3.5 rounded-xl border border-amber-200 text-xs space-y-2.5 text-slate-700">
              <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                <span>⚡</span> Solution 1 (Fastest — 10 seconds, instant login without SMS):
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Add your phone number as a <strong>Test Number</strong> in Firebase Console. This bypasses carrier SMS regional blocks and daily limits:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                <li>
                  Open{' '}
                  <a
                    href="https://console.firebase.google.com/project/gen-lang-client-0003046836/authentication/providers"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold underline inline-flex items-center gap-0.5"
                  >
                    Firebase Auth &gt; Sign-in Providers ↗
                  </a>
                </li>
                <li>Click <strong>Phone</strong></li>
                <li>Expand <strong>"Phone numbers for testing (optional)"</strong></li>
                <li>Add your number: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-900">+918125235267</code> and Code: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-900">123456</code></li>
                <li>Click <strong>Save</strong></li>
              </ol>

              <div className="border-t border-amber-100 pt-2 font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <span>🌐</span> Solution 2 (For Real Carrier SMS):
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Allow India in your project's SMS policy:{' '}
                <a
                  href="https://console.firebase.google.com/project/gen-lang-client-0003046836/authentication/settings"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:text-emerald-800 font-bold underline inline-flex items-center gap-0.5"
                >
                  Firebase Auth &gt; Settings &gt; SMS Regions policy ↗
                </a>{' '}
                and enable <strong>India (+91)</strong>.
              </p>
            </div>

            <div className="pt-1">
              <div className="text-[11px] font-semibold text-amber-800 mb-1.5">
                Or sign in immediately with Email or Google:
              </div>
              <Link
                to="/login"
                id="btn-return-login-region"
                className="inline-flex items-center justify-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl gap-1.5 shadow-2xs transition-all"
              >
                <span>Return to Login (Email / Google)</span>
              </Link>
            </div>
          </div>
        )}

        {isPhoneProviderDisabled && !isPhoneRegionBlocked && (
          <div
            id="phone-provider-disabled-guide"
            className="mb-5 p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs sm:text-sm space-y-3 animate-in fade-in slide-in-from-top-1"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-amber-900 text-sm">
                  Phone Sign-In is Disabled in Firebase Console
                </div>
                <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
                  Firebase Authentication returned <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-amber-900 text-[11px] font-semibold">auth/operation-not-allowed</code>. The Phone provider must be enabled in the Firebase Console before SMS OTPs can be sent.
                </p>
              </div>
            </div>

            <div className="bg-white/90 p-3.5 rounded-xl border border-amber-200 text-xs space-y-2 text-slate-700">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <span>⚙️</span> How to enable Phone Auth in Firebase:
              </div>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
                <li>
                  Open your{' '}
                  <a
                    href="https://console.firebase.google.com/project/gen-lang-client-0003046836/authentication/providers"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-800 font-bold underline inline-flex items-center gap-0.5"
                  >
                    Firebase Auth Sign-in Methods ↗
                  </a>
                </li>
                <li>Under <strong>Sign-in providers</strong>, click <strong>Phone</strong></li>
                <li>Toggle <strong>Enable</strong> and click <strong>Save</strong></li>
                <li>
                  <em>Tip for instant testing:</em> In the same Phone dialog, expand <strong>"Phone numbers for testing"</strong>, add your phone number (e.g. <code className="font-mono bg-slate-100 px-1">+918125235267</code>) with code <code className="font-mono bg-slate-100 px-1">123456</code>.
                </li>
              </ol>
            </div>

            <div className="pt-1">
              <div className="text-[11px] font-semibold text-amber-800 mb-1.5">
                Or sign in immediately with Email or Google:
              </div>
              <Link
                to="/login"
                id="btn-return-login-email"
                className="inline-flex items-center justify-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl gap-1.5 shadow-2xs transition-all"
              >
                <span>Return to Login (Email / Google)</span>
              </Link>
            </div>
          </div>
        )}

        {errorMessage && !isPhoneProviderDisabled && !isBillingNotEnabled && (
          <div
            id="phone-login-error-alert"
            className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="font-medium">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div
            id="phone-login-success-alert"
            className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        {/* Step 1: Phone Number Input */}
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4" id="phone-entry-form">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1" htmlFor="phone-number-input">
                {t('phoneNumber')}
              </label>
              <div className="flex gap-2">
                {/* Country code prefix selector */}
                <select
                  id="country-code-select"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  disabled={isLoading}
                  className="w-24 px-2 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 text-sm font-semibold rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+61">🇦🇺 +61</option>
                </select>

                {/* Phone digits input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone-number-input"
                    type="tel"
                    value={phoneDigits}
                    onChange={(e) => setPhoneDigits(e.target.value)}
                    placeholder="98765 43210"
                    disabled={isLoading}
                    autoComplete="tel-national"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none disabled:opacity-60"
                    required
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Firebase phone verification with Google reCAPTCHA
              </p>
            </div>

            <button
              id="send-otp-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('sendingOtp')}</span>
                </>
              ) : (
                <span>{t('sendOtp')}</span>
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification Input */
          <form onSubmit={handleVerifyOtp} className="space-y-4" id="otp-verify-form">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs sm:text-sm font-medium text-slate-700" htmlFor="otp-code-input">
                  {t('otpCode')}
                </label>
                <button
                  type="button"
                  id="change-phone-btn"
                  onClick={() => {
                    setStep('phone');
                    setOtpCode('');
                    setErrorMessage(null);
                  }}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  Change Number
                </button>
              </div>

              <input
                id="otp-code-input"
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="• • • • • •"
                disabled={isLoading}
                autoFocus
                className="w-full text-center tracking-[0.6em] text-xl font-mono py-3 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none disabled:opacity-60"
                required
              />
            </div>

            {/* Resend Timer */}
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>
                {countdown > 0 ? (
                  <>Resend OTP in <span className="font-semibold text-emerald-600 font-mono">{countdown}s</span></>
                ) : (
                  'Did not receive OTP?'
                )}
              </span>

              <button
                type="button"
                id="resend-otp-btn"
                disabled={!canResend || isLoading}
                onClick={() => handleSendOtp()}
                className="font-semibold text-emerald-600 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                {t('resendOtp')}
              </button>
            </div>

            <button
              id="verify-otp-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('verifying')}</span>
                </>
              ) : (
                <span>{t('verifyOtp')}</span>
              )}
            </button>
          </form>
        )}

        {/* Alternate login with Email */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-center">
          <Link
            to="/login"
            id="email-login-alt-link"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>{t('continueWithEmail')}</span>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
