import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, EcosystemRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { FarmerHeroBackdrop } from '../components/FarmerHeroBackdrop';
import {
  Sprout,
  ShoppingCart,
  Users,
  Truck,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Check,
  CheckCircle2,
  X,
  Building2,
} from 'lucide-react';

export const Signup: React.FC = () => {
  const { signupWithEmail, loginWithGoogle, formatAuthError } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole: EcosystemRole =
    (location.state as any)?.defaultRole
      ? (location.state as any).defaultRole
      : 'farmer';

  // Form State
  const [selectedRole, setSelectedRole] = useState<EcosystemRole>(initialRole);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isPhotoView, setIsPhotoView] = useState(false);

  // UI States
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEmailProviderDisabled, setIsEmailProviderDisabled] = useState(false);

  // Password strength meter
  const getPasswordStrength = () => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Weak', color: 'bg-rose-500', width: 'w-1/3' };
    if (score <= 3) return { label: 'Medium', color: 'bg-amber-500', width: 'w-2/3' };
    return { label: 'Strong', color: 'bg-[#22c55e]', width: 'w-full' };
  };

  const strength = getPasswordStrength();

  // Role display names
  const roleDisplayNames: Record<EcosystemRole, string> = {
    farmer: 'Farmer',
    market: 'Market Admin',
    market_admin: 'Market Administrator',
    fpo: 'FPO Member',
    transporter: 'Transporter',
    admin: 'Administrator',
  };

  // 1. Email & Password Registration Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isGoogleLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // Strict administrator access control
    if (selectedRole === 'admin') {
      setErrorMessage(
        'Public registration for Administrator accounts is disabled. Platform administration is strictly reserved for authorized platform administrators. Please navigate to the Admin Login page.'
      );
      return;
    }

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!trimmedEmail) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please create a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms and Conditions to proceed.');
      return;
    }

    setIsLoading(true);
    try {
      await signupWithEmail(
        trimmedName,
        trimmedEmail,
        password,
        trimmedPhone,
        selectedRole,
        {
          displayName: trimmedName,
          location: 'Telangana, India',
          phoneNumber: trimmedPhone || null,
        }
      );

      setSuccessMessage('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 700);
    } catch (error: any) {
      console.error('Signup error:', error);
      if (
        error?.code === 'auth/operation-not-allowed' ||
        (error?.message && error.message.toLowerCase().includes('operation-not-allowed'))
      ) {
        setIsEmailProviderDisabled(true);
      }
      setErrorMessage(formatAuthError(error, 'email'));
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Google Authentication Signup Handler
  const handleGoogleSignup = async () => {
    if (isLoading || isGoogleLoading) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    if (selectedRole === 'admin') {
      setErrorMessage(
        'Google registration is disabled for Administrator security. Please sign in via the Admin Login page using admin@gmail.com and password.'
      );
      return;
    }

    setIsGoogleLoading(true);

    try {
      await loginWithGoogle(selectedRole);
      setSuccessMessage('Signed in with Google! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 700);
    } catch (error: any) {
      console.error('Google signup error:', error);
      setErrorMessage(formatAuthError(error, 'google'));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div
      id="signup_page_container"
      className="h-[100dvh] min-h-[100dvh] w-full relative flex flex-col justify-between overflow-x-hidden font-sans select-none"
    >
      {/* 
        Full-Screen Background with Backside-Only Animation 
        Supports Farmers, Buyers, FPOs, and Transporters with dedicated images.
      */}
      <FarmerHeroBackdrop selectedRole={selectedRole as any} />

      {/* Main Content Layout matching exact visual specification */}
      <div
        id="signup_main_content"
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

            {/* Right: View Photo / Open Signup Toggle Button */}
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
                  <User className="w-3.5 h-3.5" />
                  <span>Open Signup</span>
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
              <User className="w-3.5 h-3.5" />
              <span>Tap to Open Signup Form</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Top & Middle Grid: On mobile, leaves top open or anchors form */}
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
              id="main_signup_hero_heading"
              className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-[52px] tracking-tight leading-[1.15]"
            >
              Join the <br />
              <span className="text-[#22c55e]">Smart Agriculture Platform</span>
            </h1>

            {/* Subtitle */}
            <p
              id="hero_subtitle"
              className="text-gray-200 text-sm sm:text-base font-normal max-w-lg mt-4 leading-relaxed"
            >
              Register as a Farmer, Buyer, FPO, Transporter, or Administrator to unlock direct market access, fair pricing, and verified contracts.
            </p>

            {/* 5 Persona / Category Cards Row */}
            <div
              id="roles_category_row"
              className="grid grid-cols-5 gap-2 sm:gap-3 mt-8 sm:mt-10 max-w-lg w-full"
            >
              {/* 1. For Farmers */}
              <button
                id="signup_role_btn_farmer"
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
                id="signup_role_btn_market"
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
                id="signup_role_btn_fpo"
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
                id="signup_role_btn_transporter"
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
                id="signup_role_btn_admin"
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
          {/* RIGHT SIDE: Floating Frosted Dark Glass Signup Card       */}
          {/* Mobile: Anchored at bottom with roles tabs                */}
          {/* Desktop: Floating centered card                           */}
          {/* ========================================================= */}
          <div
            id="right_signup_card_container"
            className="w-full max-w-[420px] lg:max-w-[440px] rounded-2xl bg-black/25 sm:bg-black/35 backdrop-blur-sm sm:backdrop-blur-md border border-white/20 p-3.5 sm:p-5 lg:p-7 shadow-2xl shadow-black/40 flex flex-col text-white mx-auto lg:mx-0 shrink-0 mt-auto lg:my-auto max-h-[96vh] overflow-y-auto"
          >
            {/* Mobile-Only Persona Switcher Tabs right on top of card */}
            <div
              id="mobile_signup_role_tabs"
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
              className="hidden lg:flex items-center justify-center mb-2"
            >
              {selectedRole === 'farmer' && <Sprout className="w-8 h-8 text-[#22c55e]" />}
              {selectedRole === 'market' && <Building2 className="w-8 h-8 text-[#22c55e]" />}
              {selectedRole === 'fpo' && <Users className="w-8 h-8 text-[#22c55e]" />}
              {selectedRole === 'transporter' && <Truck className="w-8 h-8 text-[#22c55e]" />}
              {selectedRole === 'admin' && <ShieldCheck className="w-8 h-8 text-[#22c55e]" />}
            </div>

            {/* Card Title & Subtitle */}
            <div className="flex items-center justify-between lg:justify-center mb-2 sm:mb-3">
              <div className="text-left lg:text-center w-full">
                <h2
                  id="card_title"
                  className="text-white font-bold text-base sm:text-xl lg:text-2xl tracking-tight flex items-center justify-between lg:justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                >
                  <span>{selectedRole === 'admin' ? 'Administrator Portal' : 'Create Your Account'}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-[#22c55e] border border-emerald-500/40 lg:hidden shadow-sm">
                    {selectedRole}
                  </span>
                </h2>
                <p
                  id="card_subtitle"
                  className="text-gray-200 text-xs sm:text-sm mt-0.5 font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  {selectedRole === 'admin'
                    ? 'Root administrative access and security verification'
                    : `Join as a ${roleDisplayNames[selectedRole]} to get started`}
                </p>
              </div>
            </div>

            {/* Admin Role Notice: Pre-configured Account with direct Login button */}
            {selectedRole === 'admin' ? (
              <div className="space-y-4 my-2">
                <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs flex flex-col gap-2.5 backdrop-blur-md shadow-lg">
                  <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                    <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                    <span>Administrator Pre-configured Credentials</span>
                  </div>
                  <p className="text-gray-200 leading-relaxed text-xs">
                    Public registration for Administrator role is disabled. System governance is exclusively assigned to the pre-configured root administrator:
                  </p>
                  <div className="p-3 bg-black/40 rounded-lg border border-amber-500/30 font-mono text-xs space-y-1">
                    <div>Authorized: <strong className="text-white">admin@gmail.com</strong></div>
                    <div>Status: <span className="text-emerald-400 font-semibold">Active & Secured</span></div>
                  </div>
                  <p className="text-[11px] text-amber-300/90 italic">
                    Please use the Login portal with your administrator password to access the full admin suite.
                  </p>
                </div>

                <button
                  id="go_to_admin_login_btn"
                  type="button"
                  onClick={() => navigate('/login', { state: { defaultRole: 'admin' } })}
                  className="w-full bg-[#22c55e] hover:bg-[#1eb354] text-black font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-all shadow-lg shadow-emerald-950/50 cursor-pointer active:scale-[0.99]"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Go to Administrator Login</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                {/* Error Message Alert */}
                {errorMessage && (
              <div
                id="signup_error_box"
                className="mb-3 p-3 rounded-lg bg-red-950/70 border border-red-500/50 text-red-100 text-xs flex flex-col gap-2 leading-relaxed backdrop-blur-sm"
              >
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">{errorMessage}</div>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-red-300 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isEmailProviderDisabled && (
                  <div className="pt-2 border-t border-red-500/30 space-y-2">
                    <div className="text-[11px] font-semibold text-emerald-300 flex items-center gap-1">
                      <span>⚡</span> 1-Click Instant Sign-In:
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogleSignup}
                      disabled={isGoogleLoading || isLoading}
                      className="w-full py-1.5 px-2.5 bg-white text-gray-800 font-semibold text-xs rounded-md flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:bg-gray-100"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google as {roleDisplayNames[selectedRole]}</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div
                id="signup_success_box"
                className="mb-3 p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-100 text-xs flex items-center gap-2 leading-relaxed backdrop-blur-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0" />
                <div className="flex-1 font-medium">{successMessage}</div>
              </div>
            )}

            {/* Registration Form */}
            <form id="credentials_signup_form" onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
              {/* Field 1: Full Name */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="signup_full_name_input"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name (e.g. Ramesh Patel)"
                  autoComplete="name"
                  required
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-black/25 focus:bg-black/45 border border-white/25 focus:border-[#22c55e] rounded-lg py-2 sm:py-2.5 pl-10 pr-4 text-white placeholder-gray-300 text-sm focus:outline-none transition-colors backdrop-blur-[2px] disabled:opacity-60"
                />
              </div>

              {/* Field 2: Email Address */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="signup_email_input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address (e.g. name@gmail.com)"
                  autoComplete="email"
                  required
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-black/25 focus:bg-black/45 border border-white/25 focus:border-[#22c55e] rounded-lg py-2 sm:py-2.5 pl-10 pr-4 text-white placeholder-gray-300 text-sm focus:outline-none transition-colors backdrop-blur-[2px] disabled:opacity-60"
                />
              </div>

              {/* Field 3: Phone Number (Optional) */}
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="signup_phone_input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Mobile Number (Optional, e.g. 9876543210)"
                  autoComplete="tel"
                  disabled={isLoading || isGoogleLoading}
                  className="w-full bg-black/25 focus:bg-black/45 border border-white/25 focus:border-[#22c55e] rounded-lg py-2 sm:py-2.5 pl-10 pr-4 text-white placeholder-gray-300 text-sm focus:outline-none transition-colors backdrop-blur-[2px] disabled:opacity-60"
                />
              </div>

              {/* Field 4: Password */}
              <div className="space-y-1.5">
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="signup_password_input"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create Password (min 6 characters)"
                    autoComplete="new-password"
                    required
                    disabled={isLoading || isGoogleLoading}
                    className="w-full bg-black/25 focus:bg-black/45 border border-white/25 focus:border-[#22c55e] rounded-lg py-2 sm:py-2.5 pl-10 pr-10 text-white placeholder-gray-300 text-sm focus:outline-none transition-colors backdrop-blur-[2px] disabled:opacity-60"
                  />
                  <button
                    id="signup_toggle_password_visibility"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {strength && (
                  <div className="px-1">
                    <div className="flex items-center justify-between text-[11px] text-gray-300 mb-0.5">
                      <span>Password strength:</span>
                      <span className="font-semibold text-white">{strength.label}</span>
                    </div>
                    <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
                      <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                    </div>
                  </div>
                )}
              </div>

              {/* Terms & Agreement Checkbox */}
              <div className="pt-0.5">
                <label
                  id="signup_terms_label"
                  className="flex items-start gap-2 text-gray-200 cursor-pointer select-none text-xs leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                >
                  <input
                    id="signup_terms_checkbox"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                      agreeTerms
                        ? 'bg-[#22c55e] border border-[#22c55e] text-white'
                        : 'bg-black/30 border border-white/30'
                    }`}
                  >
                    {agreeTerms && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span>
                    I agree to KisanSetu's Terms of Service, Fair Trade & Community Guidelines.
                  </span>
                </label>
              </div>

              {/* Primary Green Submit Button: Create Account -> */}
              <button
                id="submit_signup_button"
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full bg-[#22c55e] hover:bg-[#1eb354] disabled:opacity-70 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base transition-all shadow-lg shadow-emerald-950/40 cursor-pointer active:scale-[0.99] mt-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>
            </form>

            {/* Divider: or continue with */}
            <div
              id="divider_or"
              className="text-xs text-gray-400 flex items-center gap-3 my-2.5 sm:my-3.5 before:flex-1 before:h-px before:bg-white/10 after:flex-1 after:h-px after:bg-white/10"
            >
              or continue with
            </div>

            {/* Google Sign-In / Sign-Up Button */}
            <button
              id="signup_google_button"
              type="button"
              onClick={handleGoogleSignup}
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-white hover:bg-gray-100 disabled:opacity-70 text-gray-800 font-medium py-2 sm:py-2.5 px-4 rounded-lg flex items-center justify-center gap-2.5 text-xs sm:text-sm transition-all shadow-sm cursor-pointer active:scale-[0.99]"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-gray-700" />
                  <span>Connecting with Google...</span>
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
          </>
        )}

            {/* Footer Link: Already have an account? Login */}
            <div
              id="login_footer_link"
              className="text-xs text-gray-300 text-center mt-3 sm:mt-4"
            >
              {t('alreadyHaveAccount')}{' '}
              <Link
                to="/login"
                state={{ defaultRole: selectedRole }}
                className="text-[#22c55e] hover:text-emerald-400 font-semibold transition-colors cursor-pointer ml-1"
              >
                {t('login')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

