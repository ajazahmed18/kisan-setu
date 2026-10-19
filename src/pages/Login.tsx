import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, EcosystemRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { FarmerHeroBackdrop } from '../components/FarmerHeroBackdrop';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  Sprout,
  Users,
  Truck,
  ShieldCheck,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Check,
  Phone,
  RotateCcw,
  X,
  Building2,
} from 'lucide-react';

export const Login: React.FC = () => {
  const {
    loginWithEmail,
    loginWithGoogle,
    sendPhoneOtp,
    verifyPhoneOtp,
    formatAuthError,
  } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole: EcosystemRole =
    (location.state as any)?.defaultRole
      ? (location.state as any).defaultRole
      : 'farmer';

  // Form State
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [selectedRole, setSelectedRole] = useState<EcosystemRole>(initialRole);
  const [isPhotoView, setIsPhotoView] = useState(false);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Phone OTP Flow State (used if phone number is detected)
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Load remembered username if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kisansetu_remembered_user');
      if (saved) {
        setEmailOrPhone(saved);
        setRememberMe(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showOtpModal && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal, timerSeconds]);

  // Clean Recaptcha
  const cleanupRecaptcha = () => {
    if (recaptchaVerifierRef.current) {
      try {
        recaptchaVerifierRef.current.clear();
      } catch (err) {
        console.warn('Recaptcha clear error:', err);
      }
      recaptchaVerifierRef.current = null;
    }
  };

  const getOrCreateRecaptcha = (): RecaptchaVerifier => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }
    let container = document.getElementById('recaptcha-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'recaptcha-container';
      document.body.appendChild(container);
    }
    const verifier = new RecaptchaVerifier(auth, container, {
      size: 'invisible',
      callback: () => {},
      'expired-callback': () => {
        setErrorMessage(t('recaptchaFailed') || 'Verification expired. Please try again.');
        cleanupRecaptcha();
      },
    });
    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  // Helper to test if input looks like a phone number
  const isPhoneNumberInput = (val: string): boolean => {
    const cleaned = val.trim().replace(/[\s-]/g, '');
    return /^\+?[0-9]{10,15}$/.test(cleaned);
  };

  // Main Login Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setErrorMessage(null);
    const rawInput = emailOrPhone.trim();

    if (!rawInput) {
      setErrorMessage('Please enter your email or phone number.');
      return;
    }

    // If input looks like phone number without a password, offer Phone OTP flow
    if (isPhoneNumberInput(rawInput) && !password) {
      if (selectedRole === 'admin') {
        setErrorMessage(
          'Phone OTP authentication is disabled for Administrator security. Please sign in using the authorized administrator email (admin@gmail.com) and password.'
        );
        return;
      }
      await handleInitiatePhoneLogin(rawInput);
      return;
    }

    // Otherwise standard email/password authentication
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    // If rawInput doesn't contain '@' and isn't phone, hint or format
    const targetEmail = rawInput.includes('@')
      ? rawInput.toLowerCase()
      : isPhoneNumberInput(rawInput)
        ? `${rawInput.replace(/[^0-9]/g, '')}@kisansetu.in`
        : rawInput;

    // Strict Administrator credentials validation
    if (selectedRole === 'admin') {
      if (targetEmail !== 'admin@gmail.com') {
        setErrorMessage(
          'Access Denied: Invalid Administrator email. Only authorized administrator account (admin@gmail.com) can access the Admin Portal.'
        );
        return;
      }
    }

    setIsLoading(true);
    try {
      if (rememberMe) {
        localStorage.setItem('kisansetu_remembered_user', rawInput);
      } else {
        localStorage.removeItem('kisansetu_remembered_user');
      }

      await loginWithEmail(targetEmail, password, selectedRole);

      if (selectedRole === 'admin' || targetEmail === 'admin@gmail.com') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setErrorMessage(formatAuthError(error, 'email'));
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setErrorMessage(null);

    if (selectedRole === 'admin') {
      setErrorMessage(
        'Google Sign-In is disabled for the Admin Portal. Please use the authorized administrator email (admin@gmail.com) and password.'
      );
      return;
    }

    setIsLoading(true);

    try {
      await loginWithGoogle(selectedRole);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Google login error:', error);
      setErrorMessage(formatAuthError(error, 'google'));
    } finally {
      setIsLoading(false);
    }
  };

  // Phone OTP Flow Handlers
  const handleInitiatePhoneLogin = async (phone: string) => {
    if (selectedRole === 'admin') {
      setErrorMessage(
        'Phone OTP authentication is disabled for Administrator security. Please sign in using the authorized administrator email (admin@gmail.com) and password.'
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    let cleanNumber = phone.trim().replace(/[\s-]/g, '');
    if (/^\d{10}$/.test(cleanNumber)) {
      cleanNumber = `+91${cleanNumber}`;
    } else if (!cleanNumber.startsWith('+')) {
      cleanNumber = `+${cleanNumber}`;
    }

    try {
      const verifier = getOrCreateRecaptcha();
      const confirmation = await sendPhoneOtp(cleanNumber, verifier);
      setConfirmationResult(confirmation);
      setShowOtpModal(true);
      setTimerSeconds(60);
      setCanResend(false);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 250);
    } catch (error: any) {
      console.error('Phone OTP error:', error);
      cleanupRecaptcha();
      setErrorMessage(formatAuthError(error, 'phone'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !confirmationResult) return;

    const fullCode = otpDigits.join('');
    if (fullCode.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code sent to your phone.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      await verifyPhoneOtp(confirmationResult, fullCode, selectedRole);
      setShowOtpModal(false);
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Verify OTP error:', error);
      setErrorMessage(formatAuthError(error, 'phone'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const nextDigits = [...otpDigits];
    nextDigits[index] = val.slice(-1);
    setOtpDigits(nextDigits);
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div
      id="login_page_container"
      className="h-[100dvh] min-h-[100dvh] w-full relative flex flex-col justify-between overflow-x-hidden font-sans select-none"
    >
      {/* Invisible Recaptcha Mount Point */}
      <div id="recaptcha-container" className="hidden" />

      {/* 
        Full-Screen Background with Backside-Only Animation 
        Supports Farmers, Market Admins, FPOs, and Transporters with dedicated images.
      */}
      <FarmerHeroBackdrop selectedRole={selectedRole as any} />

      {/* Main Content Layout matching exact visual specification */}
      <div
        id="login_main_content"
        className="w-full h-full min-h-[100dvh] flex flex-col justify-between p-3 sm:p-6 lg:p-16 z-10 relative overflow-y-auto"
      >
        {/* ========================================================= */}
        {/* DESKTOP TOP BAR (Language Selector & Platform Info)       */}
        {/* ========================================================= */}
        <div className="hidden lg:flex items-center justify-between w-full max-w-6xl mx-auto pb-4 shrink-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#07130a]/80 backdrop-blur-md border border-emerald-500/30 text-white shadow-md">
            <Sprout className="w-4 h-4 text-[#22c55e]" />
            <span className="text-xs font-semibold tracking-wide">KisanSetu • Smart Agriculture Ecosystem</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector variant="glass" />
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE TOP BAR (Phone & Small Tablet Only)                */}
        {/* ========================================================= */}
        <header
          id="mobile_top_header"
          className="w-full flex items-center justify-between gap-2 pt-1 pb-1 lg:hidden shrink-0"
        >
          {/* Left: Ecosystem Pill */}
          <div
            id="mobile_ecosystem_pill"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#07130a]/80 backdrop-blur-md border border-emerald-500/30 text-white shadow-md"
          >
            <Sprout className="w-3.5 h-3.5 text-[#22c55e]" />
            <span className="text-xs font-semibold tracking-wide">KisanSetu</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector in Mobile Header */}
            <LanguageSelector variant="glass" />

            {/* Right: View Photo / Open Login Toggle Button */}
            <button
              id="mobile_toggle_photo_btn"
              type="button"
              onClick={() => setIsPhotoView(!isPhotoView)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-all border cursor-pointer ${
                isPhotoView
                  ? 'bg-[#22c55e] text-black font-semibold border-[#22c55e] shadow-lg shadow-emerald-950/60'
                  : 'bg-[#07130a]/80 text-gray-200 border-white/20 hover:border-emerald-400/60'
              }`}
            >
              {isPhotoView ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Open Login</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Background</span>
                </>
              )}
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* FULL PHOTO VIEW MODE (On Mobile when photo is prioritized)*/}
        {/* ========================================================= */}
        {isPhotoView && (
          <div className="w-full flex-1 flex flex-col justify-end items-center pb-6 lg:hidden">
            {/* 5 Role Switcher in Full Photo Mode */}
            <div className="w-full grid grid-cols-5 gap-1 mb-3 max-w-sm px-1">
              {[
                { role: 'farmer', label: 'Farmer', icon: Sprout },
                { role: 'market', label: 'Market Admin', icon: Building2 },
                { role: 'fpo', label: 'FPO', icon: Users },
                { role: 'transporter', label: 'Logistics', icon: Truck },
                { role: 'admin', label: 'Admin', icon: ShieldCheck },
              ].map(({ role, label, icon: Icon }) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role as any)}
                    className={`flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 rounded-xl backdrop-blur-md transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[#22c55e] border-[#22c55e] text-black font-bold shadow-lg'
                        : 'bg-[#07130a]/80 border-white/20 text-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[10px] truncate">{label}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsPhotoView(false)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#22c55e] hover:bg-[#1eb354] text-black font-bold text-xs sm:text-sm shadow-2xl shadow-black/80 transition-all cursor-pointer active:scale-95"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Tap to Open Login Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top & Middle Grid: On mobile, leaves the top half open so farmer is clearly visible */}
        <div
          className={`w-full flex-1 flex flex-col lg:flex-row items-center justify-end lg:justify-between gap-2 lg:gap-8 ${
            isPhotoView ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* ========================================================= */}
          {/* LEFT SIDE: Branding, Welcome Heading, Subtitle & 5 Roles  */}
          {/* (Visible on Desktop)                                      */}
          {/* ========================================================= */}
          <div
            id="left_hero_section"
            className="hidden lg:flex flex-1 max-w-xl text-left flex-col items-start my-auto"
          >
            {/* Pill Badge: 🌱 KisanSetu Ecosystem */}
            <div
              id="ecosystem_pill_badge"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a180f]/80 backdrop-blur-md border border-emerald-500/30 text-white shadow-lg mb-6"
            >
              <Sprout className="w-4 h-4 text-[#22c55e]" />
              <span className="text-xs sm:text-sm font-medium tracking-wide">
                KisanSetu Ecosystem
              </span>
            </div>

            {/* Main Headline */}
            <h1
              id="main_hero_heading"
              className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] tracking-tight leading-[1.15]"
            >
              Welcome to the <br />
              <span className="text-[#22c55e]">Smart Agriculture Platform</span>
            </h1>

            {/* Subtitle */}
            <p
              id="hero_subtitle"
              className="text-gray-200 text-sm sm:text-base font-normal max-w-lg mt-4 leading-relaxed"
            >
              Connecting Farmers, Market Admins, FPOs, Transporters and Administrators in one trusted ecosystem.
            </p>

            {/* 5 Persona / Category Cards Row */}
            <div
              id="roles_category_row"
              className="grid grid-cols-5 gap-2 sm:gap-3 mt-8 sm:mt-10 max-w-lg w-full"
            >
              {/* 1. For Farmers */}
              <button
                id="role_btn_farmer"
                type="button"
                onClick={() => setSelectedRole('farmer')}
                className={`flex flex-col items-center group cursor-pointer transition-all ${
                  selectedRole === 'farmer' ? 'opacity-100 scale-105' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${
                    selectedRole === 'farmer'
                      ? 'bg-emerald-950/60 border-2 border-[#22c55e] text-[#22c55e] shadow-lg shadow-emerald-950/50'
                      : 'bg-black/40 border border-white/15 text-[#22c55e] hover:border-emerald-400/50 hover:bg-black/60'
                  }`}
                >
                  <Sprout className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-300 font-medium text-center mt-2 whitespace-nowrap">
                  For Farmers
                </span>
              </button>

              {/* 2. For Market Admin */}
              <button
                id="role_btn_market"
                type="button"
                onClick={() => setSelectedRole('market')}
                className={`flex flex-col items-center group cursor-pointer transition-all ${
                  selectedRole === 'market' ? 'opacity-100 scale-105' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${
                    selectedRole === 'market'
                      ? 'bg-emerald-950/60 border-2 border-[#22c55e] text-[#22c55e] shadow-lg shadow-emerald-950/50'
                      : 'bg-black/40 border border-white/15 text-[#22c55e] hover:border-emerald-400/50 hover:bg-black/60'
                  }`}
                >
                  <Building2 className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-300 font-medium text-center mt-2 whitespace-nowrap">
                  Market Admin
                </span>
              </button>

              {/* 3. For FPOs */}
              <button
                id="role_btn_fpo"
                type="button"
                onClick={() => setSelectedRole('fpo')}
                className={`flex flex-col items-center group cursor-pointer transition-all ${
                  selectedRole === 'fpo' ? 'opacity-100 scale-105' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${
                    selectedRole === 'fpo'
                      ? 'bg-emerald-950/60 border-2 border-[#22c55e] text-[#22c55e] shadow-lg shadow-emerald-950/50'
                      : 'bg-black/40 border border-white/15 text-[#22c55e] hover:border-emerald-400/50 hover:bg-black/60'
                  }`}
                >
                  <Users className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-300 font-medium text-center mt-2 whitespace-nowrap">
                  For FPOs
                </span>
              </button>

              {/* 4. For Transporters */}
              <button
                id="role_btn_transporter"
                type="button"
                onClick={() => setSelectedRole('transporter')}
                className={`flex flex-col items-center group cursor-pointer transition-all ${
                  selectedRole === 'transporter' ? 'opacity-100 scale-105' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${
                    selectedRole === 'transporter'
                      ? 'bg-emerald-950/60 border-2 border-[#22c55e] text-[#22c55e] shadow-lg shadow-emerald-950/50'
                      : 'bg-black/40 border border-white/15 text-[#22c55e] hover:border-emerald-400/50 hover:bg-black/60'
                  }`}
                >
                  <Truck className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-300 font-medium text-center mt-2 whitespace-nowrap">
                  For Logistics
                </span>
              </button>

              {/* 5. For Admin */}
              <button
                id="role_btn_admin"
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex flex-col items-center group cursor-pointer transition-all ${
                  selectedRole === 'admin' ? 'opacity-100 scale-105' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-xl flex items-center justify-center backdrop-blur-md transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-emerald-950/60 border-2 border-[#22c55e] text-[#22c55e] shadow-lg shadow-emerald-950/50'
                      : 'bg-black/40 border border-white/15 text-[#22c55e] hover:border-emerald-400/50 hover:bg-black/60'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-300 font-medium text-center mt-2 whitespace-nowrap">
                  For Admin
                </span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT SIDE: Floating Frosted Dark Glass Login Card        */}
          {/* Mobile: Anchored at bottom with roles tabs                */}
          {/* Desktop: Floating centered card                           */}
          {/* ========================================================= */}
          <div
            id="right_login_card_container"
            className="w-full max-w-[420px] lg:max-w-[430px] rounded-2xl bg-black/25 sm:bg-black/35 backdrop-blur-sm sm:backdrop-blur-md border border-white/20 p-3.5 sm:p-6 lg:p-8 shadow-2xl shadow-black/40 flex flex-col text-white mx-auto lg:mx-0 shrink-0 mt-auto lg:my-auto"
          >
            {/* Mobile-Only Persona Switcher Tabs right on top of card */}
            <div
              id="mobile_card_role_tabs"
              className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-black/25 border border-white/15 mb-3 lg:hidden"
            >
              {[
                { role: 'farmer', label: t('roleFarmer') || 'Farmer', icon: Sprout },
                { role: 'market', label: 'Market Admin', icon: Building2 },
                { role: 'fpo', label: t('roleFpo') || 'FPO', icon: Users },
                { role: 'transporter', label: t('roleTransporter') || 'Logistics', icon: Truck },
                { role: 'admin', label: t('roleAdmin') || 'Admin', icon: ShieldCheck },
              ].map(({ role, label, icon: Icon }) => {
                const isSelected = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role as any);
                      setErrorMessage(null);
                    }}
                    className={`flex flex-col items-center justify-center gap-1 py-1.5 px-0.5 rounded-lg text-[9px] sm:text-[10px] font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#22c55e] text-black font-bold shadow-sm'
                        : 'text-gray-200 hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Top Center Role Icon (Desktop) */}
            <div
              id="card_top_icon"
              className="hidden lg:flex items-center justify-center mb-2.5"
            >
              {selectedRole === 'farmer' && <Sprout className="w-8 h-8 text-[#22c55e]" />}
              {selectedRole === 'market' && <Building2 className="w-8 h-8 text-[#22c55e]" />}
              {selectedRole === 'fpo' && <Users className="w-8 h-8 text-[#22c55e]" />}
              {selectedRole === 'transporter' && <Truck className="w-8 h-8 text-[#22c55e]" />}
              {selectedRole === 'admin' && <ShieldCheck className="w-8 h-8 text-[#22c55e]" />}
            </div>

            {/* Card Title & Subtitle */}
            <div className="flex items-center justify-between lg:justify-center mb-2 sm:mb-4">
              <div className="text-left lg:text-center w-full">
                <h2
                  id="card_title"
                  className="text-white font-bold text-base sm:text-xl lg:text-2xl tracking-tight flex items-center justify-between lg:justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  <span>{selectedRole === 'admin' ? 'Administrator Login' : t('login')}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-[#22c55e] border border-emerald-500/40 lg:hidden shadow-sm">
                    {selectedRole}
                  </span>
                </h2>
                <p
                  id="card_subtitle"
                  className="text-gray-200 text-xs sm:text-sm mt-0.5 font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  {selectedRole === 'admin'
                    ? 'Authorized Admin Access Verification'
                    : 'Enter your credentials to continue'}
                </p>
              </div>
            </div>

            {/* Admin Exclusive Access Notice */}
            {selectedRole === 'admin' && (
              <div
                id="admin_credentials_info_box"
                className="mb-3.5 p-3 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-1.5 backdrop-blur-md shadow-md"
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-300 text-xs">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Authorized Platform Administrator Access</span>
                </div>
                <p className="text-[11px] text-gray-200 leading-relaxed">
                  Admin portal access is strictly restricted to the authorized platform administrator (admin@gmail.com).
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailOrPhone('admin@gmail.com');
                      setErrorMessage(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/40 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer active:scale-95"
                  >
                    <span>Autofill admin@gmail.com</span>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMessage && (
              <div
                id="login_error_box"
                className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-500/50 text-red-100 text-xs flex items-start gap-2 leading-relaxed backdrop-blur-sm"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">{errorMessage}</div>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-red-300 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Credentials Form */}
            <form id="credentials_login_form" onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Field 1: Email or Phone Number */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="email_or_phone_input"
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'admin@gmail.com' : 'Email or Phone Number'}
                  autoComplete="username"
                  required
                  className="w-full bg-black/25 focus:bg-black/45 border border-white/25 focus:border-[#22c55e] rounded-lg py-2.5 sm:py-3 pl-10 pr-4 text-white placeholder-gray-300 text-sm focus:outline-none transition-colors backdrop-blur-[2px]"
                />
              </div>

              {/* Field 2: Password */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password_input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={selectedRole === 'admin' ? 'Administrator Password' : 'Password'}
                  autoComplete="current-password"
                  className="w-full bg-black/25 focus:bg-black/45 border border-white/25 focus:border-[#22c55e] rounded-lg py-2.5 sm:py-3 pl-10 pr-10 text-white placeholder-gray-300 text-sm focus:outline-none transition-colors backdrop-blur-[2px]"
                />
                <button
                  id="toggle_password_visibility"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Options Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5 sm:pt-1">
                {/* Remember Me Checkbox */}
                <label
                  id="remember_me_label"
                  className="flex items-center gap-2 text-gray-200 cursor-pointer select-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  <input
                    id="remember_me_checkbox"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                      rememberMe
                        ? 'bg-[#22c55e] border border-[#22c55e] text-white'
                        : 'bg-black/30 border border-white/30'
                    }`}
                  >
                    {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>{t('rememberMe')}</span>
                </label>

                {/* Forgot Password Link */}
                <Link
                  id="forgot_password_link"
                  to="/forgot-password"
                  className="text-[#22c55e] hover:text-emerald-400 font-semibold transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  {t('forgotPassword')}
                </Link>
              </div>

              {/* Primary Green Submit Button: Login -> */}
              <button
                id="submit_login_button"
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#22c55e] hover:bg-[#1eb354] disabled:opacity-70 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-[0.99] mt-1 sm:mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>{t('loggingIn')}</span>
                  </>
                ) : (
                  <>
                    <span>{selectedRole === 'admin' ? 'Login as Administrator' : t('login')}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Divider: or continue with */}
            <div
              id="divider_or"
              className="text-xs text-gray-400 flex items-center gap-3 my-3 sm:my-5 before:flex-1 before:h-px before:bg-white/10 after:flex-1 after:h-px after:bg-white/10"
            >
              or continue with
            </div>

            {/* Google Sign-In Button or Admin Security Notice */}
            {selectedRole === 'admin' ? (
              <div className="w-full py-2.5 px-3 bg-black/40 border border-white/15 rounded-lg text-center text-xs text-gray-300 font-medium">
                Google Sign-In is disabled for Admin Portal security
              </div>
            ) : (
              <button
                id="google_signin_button"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-white hover:bg-gray-100 disabled:opacity-70 text-gray-800 font-medium py-2 sm:py-2.5 px-4 rounded-lg flex items-center justify-center gap-2.5 text-xs sm:text-sm transition-all shadow-sm cursor-pointer active:scale-[0.99]"
              >
                {/* Official Google G Logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>{t('continueWithGoogle')}</span>
              </button>
            )}

            {/* Footer Link: Don't have an account? Sign Up */}
            <div
              id="signup_footer_link"
              className="text-xs text-gray-300 text-center mt-3 sm:mt-6"
            >
              {selectedRole === 'admin' ? (
                <span className="text-amber-300/90 font-medium">
                  {t('adminSelfRegisterDisabled')}
                </span>
              ) : (
                <>
                  {t('dontHaveAccount')}{' '}
                  <Link
                    to="/signup"
                    state={{ defaultRole: selectedRole }}
                    className="text-[#22c55e] hover:text-emerald-400 font-semibold transition-colors cursor-pointer ml-1"
                  >
                    {t('signUp')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PHONE OTP POPUP MODAL (When signing in with Phone)        */}
      {/* ========================================================= */}
      {showOtpModal && (
        <div
          id="phone_otp_modal_overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
        >
          <div
            id="phone_otp_modal_card"
            className="w-full max-w-md bg-[#0e1d13] border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Phone className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Enter SMS Verification Code</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300 mb-5 leading-relaxed">
              We have sent a 6-digit verification OTP code to <strong className="text-white">{emailOrPhone}</strong>.
            </p>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="flex justify-between gap-2">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-11 h-12 text-center text-lg font-bold bg-[#07130a] border border-white/20 focus:border-[#22c55e] rounded-lg text-white focus:outline-none"
                  />
                ))}
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#22c55e] hover:bg-[#1eb354] disabled:opacity-70 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-all"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify & Continue'}
              </button>

              <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                {timerSeconds > 0 ? (
                  <span>Resend code in {timerSeconds}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleInitiatePhoneLogin(emailOrPhone)}
                    disabled={!canResend || isLoading}
                    className="text-[#22c55e] hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Resend OTP Code
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
