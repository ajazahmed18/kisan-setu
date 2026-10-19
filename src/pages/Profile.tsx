import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, UserProfileData, EcosystemRole } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase/config';
import { ProfilePhotoModal } from '../components/ProfilePhotoModal';
import { BankSettingsSection, BankSettingsData } from '../components/BankSettingsSection';
import { KycSettingsSection, KycSettingsData } from '../components/KycSettingsSection';
import { AppSettingsSection, AppPreferencesData } from '../components/AppSettingsSection';
import { FarmOperationsSection, FarmOperationsData } from '../components/FarmOperationsSection';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Camera,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Shield,
  Sprout,
  Building2,
  ShieldCheck,
  Truck,
  KeyRound,
  ExternalLink,
  RotateCcw,
  Check,
  X,
  Landmark,
  Sliders,
  Sparkles,
  Settings,
  SlidersHorizontal,
  FileText,
  Save,
  Layers,
} from 'lucide-react';

export const Profile: React.FC = () => {
  const {
    currentUser,
    userProfile,
    updateUserProfile,
    updateUserPassword,
    uploadProfilePicture,
    removeProfilePicture,
    sendEmailVerificationLink,
    refreshUser,
    sendPhoneOtp,
    verifyAndChangePhone,
    formatAuthError,
  } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Form states for basic info
  const [displayName, setDisplayName] = useState('');
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bio, setBio] = useState('');
  const [pincode, setPincode] = useState('');

  // Active section tab
  const [activeSection, setActiveSection] = useState<'all' | 'personal' | 'operations' | 'bank' | 'kyc' | 'preferences' | 'security'>('all');

  // Role & Operations states
  const [operationsData, setOperationsData] = useState<FarmOperationsData>({
    farmName: '',
    farmLocation: '',
    farmSize: '',
    primaryCrops: '',
    secondaryCrops: 'Turmeric, Red Chilli, Pulses',
    farmingType: 'Natural Farming (ZBNF)',
    irrigationType: 'Drip Irrigation',
    soilType: 'Black Cotton Soil',
    landOwnership: 'Self-Owned Land',
    experienceYears: '12',
    orgName: '',
    regNumber: '',
    memberCount: '',
    orgLocation: '',
    storageCapacity: '500 Metric Tons',
    keyCommodities: 'Cotton, Soybean, Maize',
    businessName: '',
    gstNumber: '',
    businessType: 'Food Processor / Wholesaler',
    cropPurchase: 'Cotton, Sona Masoori, Chilli',
    paymentTerms: 'Immediate UPI / 24h Escrow Release',
    businessLocation: 'Warangal Industrial Area, Telangana',
    vehicleType: '10-Ton Lorry',
    vehicleNumber: 'TS 03 AB 4590',
    serviceArea: 'Telangana, Andhra Pradesh',
    capacityTons: '12 Tons',
    gpsEnabled: true,
    fleetSize: '4 Vehicles',
    adminId: '',
    adminDepartment: 'Operations & Verification',
    clearanceLevel: 'Tier 1 Root',
  });

  // Bank & Payouts Settings ("Old Settings")
  const [bankData, setBankData] = useState<BankSettingsData>({
    bankName: 'State Bank of India',
    accountHolderName: 'Ramesh Kumar',
    accountNumber: '38492019482',
    confirmAccountNumber: '38492019482',
    ifscCode: 'SBIN0020145',
    upiId: 'ramesh.farmer@sbi',
    paytmNumber: '9848023456',
    payoutMode: 'instant_upi',
  });

  // KYC & Government IDs ("Old Settings")
  const [kycData, setKycData] = useState<KycSettingsData>({
    aadharNumber: 'XXXX-XXXX-4321',
    panCard: 'ABCDE1234F',
    kccNumber: 'KCC-TS-849201',
    soilHealthCardId: 'SHC-2024-WGL-9482',
  });

  // App & Alert Preferences ("Old Settings")
  const [appPreferences, setAppPreferences] = useState<AppPreferencesData>({
    preferredLanguage: (language as any) || 'en',
    smsAlerts: true,
    whatsappUpdates: true,
    mandiPriceAlerts: true,
    weatherWarnings: true,
    voiceGuidance: true,
    audioAssistance: true,
  });

  // Security - Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Sensitive action: Phone number update with OTP modal
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneConfirmation, setPhoneConfirmation] = useState<ConfirmationResult | null>(null);
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhoneOtp, setIsVerifyingPhoneOtp] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneModalError, setPhoneModalError] = useState<string | null>(null);
  const phoneRecaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Status & Feedback
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isSendingEmailLink, setIsSendingEmailLink] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preload form data from userProfile
  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || currentUser?.displayName || '');
      setLocation(userProfile.location || '');
      setAddress(userProfile.address || '');
      setDateOfBirth(userProfile.dateOfBirth || '');
      setBio(userProfile.bio || 'Dedicated farmer cultivating quality long-staple cotton & turmeric with sustainable drip irrigation.');
      setPincode(userProfile.pincode || '506001');

      setOperationsData({
        farmName: userProfile.farmName || '',
        farmLocation: userProfile.farmLocation || '',
        farmSize: userProfile.farmSize || '',
        primaryCrops: userProfile.primaryCrops || '',
        secondaryCrops: userProfile.secondaryCrops || 'Turmeric, Red Chilli, Pulses',
        farmingType: userProfile.farmingType || 'Natural Farming (ZBNF)',
        irrigationType: userProfile.irrigationType || 'Drip Irrigation',
        soilType: userProfile.soilType || 'Black Cotton Soil',
        landOwnership: userProfile.landOwnership || 'Self-Owned Land',
        experienceYears: userProfile.experienceYears || '12',

        orgName: userProfile.orgName || '',
        regNumber: userProfile.regNumber || '',
        memberCount: userProfile.memberCount || '',
        orgLocation: userProfile.orgLocation || '',
        storageCapacity: (userProfile as any).storageCapacity || '500 Metric Tons',
        keyCommodities: (userProfile as any).keyCommodities || 'Cotton, Soybean, Maize',

        businessName: userProfile.businessName || '',
        gstNumber: userProfile.gstNumber || '',
        businessType: userProfile.businessType || 'Food Processor / Wholesaler',
        cropPurchase: (userProfile as any).cropPurchase || 'Cotton, Sona Masoori, Chilli',
        paymentTerms: (userProfile as any).paymentTerms || 'Immediate UPI / 24h Escrow Release',
        businessLocation: (userProfile as any).businessLocation || 'Warangal Industrial Area, Telangana',

        vehicleType: (userProfile as any).vehicleType || '10-Ton Lorry',
        vehicleNumber: (userProfile as any).vehicleNumber || 'TS 03 AB 4590',
        serviceArea: (userProfile as any).serviceArea || 'Telangana, Andhra Pradesh',
        capacityTons: (userProfile as any).capacityTons || '12 Tons',
        gpsEnabled: (userProfile as any).gpsEnabled ?? true,
        fleetSize: (userProfile as any).fleetSize || '4 Vehicles',

        adminId: userProfile.adminId || `ADM-${userProfile.uid?.substring(0, 5).toUpperCase()}`,
        adminDepartment: userProfile.adminDepartment || 'Agriculture Operations',
        clearanceLevel: userProfile.clearanceLevel || 'Tier 1 - Full Access',
      });

      const existingBank = userProfile.bankDetails;
      setBankData({
        bankName: existingBank?.bankName || 'State Bank of India',
        accountHolderName: existingBank?.accountHolderName || userProfile.displayName || currentUser?.displayName || 'Ramesh Kumar',
        accountNumber: existingBank?.accountNumber || '38492019482',
        confirmAccountNumber: existingBank?.accountNumber || '38492019482',
        ifscCode: existingBank?.ifscCode || 'SBIN0020145',
        upiId: existingBank?.upiId || 'ramesh.farmer@sbi',
        paytmNumber: existingBank?.paytmNumber || '9848023456',
        payoutMode: (existingBank as any)?.payoutMode || 'instant_upi',
      });

      setKycData({
        aadharNumber: userProfile.aadharNumber || 'XXXX-XXXX-4321',
        panCard: userProfile.panCard || 'ABCDE1234F',
        kccNumber: userProfile.kccNumber || 'KCC-TS-849201',
        soilHealthCardId: userProfile.soilHealthCardId || 'SHC-2024-WGL-9482',
      });

      const existingSettings = userProfile.settings;
      setAppPreferences({
        preferredLanguage: userProfile.preferredLanguage || (language as any) || 'en',
        smsAlerts: existingSettings?.smsAlerts ?? true,
        whatsappUpdates: existingSettings?.whatsappUpdates ?? true,
        mandiPriceAlerts: existingSettings?.mandiPriceAlerts ?? true,
        weatherWarnings: existingSettings?.weatherWarnings ?? true,
        voiceGuidance: existingSettings?.voiceGuidance ?? true,
        audioAssistance: existingSettings?.audioAssistance ?? true,
      });
    }
  }, [userProfile, currentUser]);

  // Handle Profile Photo Upload
  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size must be less than 5MB.');
      return;
    }

    setIsUploadingPhoto(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await uploadProfilePicture(file);
      const msg = t('photoUpdatedSuccess') || 'Profile picture updated successfully.';
      setSuccessMessage(msg);
      showSuccess(msg, 'Photo Updated');
    } catch (err: any) {
      const errText = formatAuthError(err);
      setErrorMessage(errText);
      showError(errText, 'Photo Update Failed');
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Handle Remove Photo
  const handleRemovePhoto = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) return;
    setIsUploadingPhoto(true);
    try {
      await removeProfilePicture();
      const msg = 'Profile photo removed.';
      setSuccessMessage(msg);
      showSuccess(msg, 'Photo Removed');
    } catch (err: any) {
      const errText = formatAuthError(err);
      setErrorMessage(errText);
      showError(errText, 'Photo Removal Failed');
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  // Handle Send Email Verification
  const handleSendVerificationEmail = async () => {
    setIsSendingEmailLink(true);
    setErrorMessage(null);
    try {
      await sendEmailVerificationLink();
      const msg = t('verificationEmailSent') || 'Verification email sent.';
      setSuccessMessage(msg);
      showSuccess(msg, 'Verification Link Sent');
    } catch (err: any) {
      const errText = formatAuthError(err);
      setErrorMessage(errText);
      showError(errText, 'Verification Request Failed');
    } finally {
      setIsSendingEmailLink(false);
    }
  };

  // Save General Profile Info & All Settings
  const handleSaveProfile = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updateData: Partial<UserProfileData> = {
        displayName: displayName.trim(),
        location: location.trim(),
        address: address.trim(),
        dateOfBirth: dateOfBirth,
        bio: bio.trim(),
        pincode: pincode.trim(),
        preferredLanguage: appPreferences.preferredLanguage,

        // Role & Operations fields
        ...operationsData,

        // Bank details (Old settings editable)
        bankDetails: {
          bankName: bankData.bankName.trim(),
          accountHolderName: bankData.accountHolderName.trim(),
          accountNumber: bankData.accountNumber.trim(),
          ifscCode: bankData.ifscCode.trim(),
          upiId: bankData.upiId.trim(),
          paytmNumber: bankData.paytmNumber ? bankData.paytmNumber.trim() : undefined,
        },

        // KYC & IDs (Old settings editable)
        aadharNumber: kycData.aadharNumber.trim(),
        panCard: kycData.panCard.trim(),
        kccNumber: kycData.kccNumber ? kycData.kccNumber.trim() : undefined,
        soilHealthCardId: kycData.soilHealthCardId ? kycData.soilHealthCardId.trim() : undefined,

        // App & Alert Settings (Old settings editable)
        settings: {
          smsAlerts: appPreferences.smsAlerts,
          whatsappUpdates: appPreferences.whatsappUpdates,
          mandiPriceAlerts: appPreferences.mandiPriceAlerts,
          weatherWarnings: appPreferences.weatherWarnings,
          voiceGuidance: appPreferences.voiceGuidance,
          audioAssistance: appPreferences.audioAssistance,
        },
      };

      await updateUserProfile(updateData);

      // Sync language context if preferred language was changed
      if (appPreferences.preferredLanguage && appPreferences.preferredLanguage !== language) {
        setLanguage(appPreferences.preferredLanguage);
      }

      const msg = t('profileUpdatedSuccess') || 'All profile details and settings saved successfully.';
      setSuccessMessage(msg);
      showSuccess(msg, 'Profile & Settings Saved');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      const errText = formatAuthError(err);
      setErrorMessage(errText);
      showError(errText, 'Profile Save Failed');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset notification and display settings to original defaults
  const handleResetSettingsDefaults = () => {
    setAppPreferences({
      preferredLanguage: 'en',
      smsAlerts: true,
      whatsappUpdates: true,
      mandiPriceAlerts: true,
      weatherWarnings: true,
      voiceGuidance: true,
      audioAssistance: true,
    });
    showSuccess('Notification and app alerts restored to standard defaults. Click Save to persist.', 'Settings Reset');
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      const err = 'Please enter your current password.';
      setPasswordError(err);
      showError(err, 'Password Error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      const err = t('passwordMinLength') || 'Password must be at least 6 characters.';
      setPasswordError(err);
      showError(err, 'Password Error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      const err = t('passwordsDoNotMatch') || 'Passwords do not match.';
      setPasswordError(err);
      showError(err, 'Password Error');
      return;
    }

    setIsChangingPassword(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      const msg = t('passwordChangedSuccess') || 'Password changed successfully.';
      setPasswordSuccess(msg);
      showSuccess(msg, 'Password Changed');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      const errText = formatAuthError(err);
      setPasswordError(errText);
      showError(errText, 'Password Change Failed');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Sensitive Action: Send OTP to new phone number
  const handleSendPhoneChangeOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneModalError(null);
    const formatted = newPhone.trim().replace(/\s+/g, '');
    if (!formatted || !formatted.startsWith('+') || formatted.length < 11) {
      setPhoneModalError(t('invalidPhone'));
      return;
    }

    setIsSendingPhoneOtp(true);
    try {
      if (!phoneRecaptchaVerifierRef.current) {
        phoneRecaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'phone-change-recaptcha', {
          size: 'invisible',
        });
      }
      const confirmation = await sendPhoneOtp(formatted, phoneRecaptchaVerifierRef.current);
      setPhoneConfirmation(confirmation);
      setPhoneOtpSent(true);
    } catch (err: any) {
      setPhoneModalError(formatAuthError(err));
      if (phoneRecaptchaVerifierRef.current) {
        phoneRecaptchaVerifierRef.current.clear();
        phoneRecaptchaVerifierRef.current = null;
      }
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

  // Sensitive Action: Verify OTP and save new phone number
  const handleVerifyPhoneChangeOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneConfirmation) return;
    if (phoneOtp.length !== 6) {
      setPhoneModalError(t('invalidOtpFormat'));
      return;
    }

    setIsVerifyingPhoneOtp(true);
    setPhoneModalError(null);
    try {
      await verifyAndChangePhone(phoneConfirmation, phoneOtp, newPhone.trim());
      setShowPhoneModal(false);
      setPhoneOtpSent(false);
      setNewPhone('');
      setPhoneOtp('');
      const msg = 'Phone number successfully updated and verified!';
      setSuccessMessage(msg);
      showSuccess(msg, 'Phone Number Verified');
    } catch (err: any) {
      const errText = formatAuthError(err);
      setPhoneModalError(errText);
      showError(errText, 'Phone Verification Failed');
    } finally {
      setIsVerifyingPhoneOtp(false);
    }
  };

  const role = userProfile?.role || 'farmer';
  const roleBadgeColor = {
    farmer: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    fpo: 'bg-blue-100 text-blue-800 border-blue-200',
    market_admin: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    market: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    transporter: 'bg-amber-100 text-amber-800 border-amber-200',
    admin: 'bg-slate-800 text-white border-slate-700',
  }[role] || 'bg-emerald-100 text-emerald-800 border-emerald-200';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Invisible container for phone change recaptcha */}
      <div id="phone-change-recaptcha" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm sm:text-base">
                {t('profileTitle')}
              </span>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['en', 'te', 'hi'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-emerald-700 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'te' ? 'తెలుగు' : 'हिन्दी'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6">
        {/* Global Feedback Notifications */}
        {successMessage && (
          <div
            id="profile-success-banner"
            className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in"
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{successMessage}</span>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {errorMessage && (
          <div
            id="profile-error-banner"
            className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between gap-3 shadow-xs animate-in fade-in"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 hover:text-rose-900 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 1. Header Profile Banner & Avatar */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar with Upload and Spinner */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 overflow-hidden shadow-md flex items-center justify-center border-4 border-white">
                {isUploadingPhoto ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt={userProfile.displayName || 'User Avatar'}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-extrabold text-white uppercase">
                    {userProfile?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                  </span>
                )}
              </div>

              {/* Upload button overlay */}
              <button
                type="button"
                onClick={() => setShowPhotoModal(true)}
                disabled={isUploadingPhoto}
                title="Update Profile Photo"
                className="absolute -bottom-2 -right-2 p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-md cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            {/* Profile Meta and Badges */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {userProfile?.displayName || 'Agriculture Partner'}
                </h1>
                <span
                  className={`px-3 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wider ${roleBadgeColor}`}
                >
                  {role}
                </span>
                {userProfile?.isOnline && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-500 mb-3">
                {currentUser?.email || 'No email associated'}
              </p>

              {/* Photo Actions */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  disabled={isUploadingPhoto}
                  className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-xl border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Camera className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Update Profile Photo</span>
                </button>

                {userProfile?.photoURL && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isUploadingPhoto}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{t('removePhoto')}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Verification Status Banner Cards */}
          <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Email Verification Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Email Verification
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {currentUser?.emailVerified
                      ? 'Email address confirmed'
                      : 'Verification required'}
                  </div>
                </div>
              </div>
              {currentUser?.emailVerified ? (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleSendVerificationEmail}
                  disabled={isSendingEmailLink}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  {isSendingEmailLink ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    'Verify Now'
                  )}
                </button>
              )}
            </div>

            {/* Phone Verification Card */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">
                    Phone OTP Security
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {userProfile?.phoneNumber || 'No phone number set'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewPhone(userProfile?.phoneNumber || '+91 ');
                  setPhoneOtpSent(false);
                  setShowPhoneModal(true);
                }}
                className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
              >
                Change Phone
              </button>
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all' as const, label: 'All Details & Settings', icon: Layers },
            { id: 'personal' as const, label: 'Personal Info', icon: UserIcon },
            { id: 'operations' as const, label: role === 'farmer' ? 'Farm Details' : 'Operations', icon: role === 'farmer' ? Sprout : Building2 },
            { id: 'bank' as const, label: 'Bank & Payouts', icon: Landmark, badge: 'Old Settings' },
            { id: 'kyc' as const, label: 'KYC & IDs', icon: ShieldCheck, badge: 'Old Settings' },
            { id: 'preferences' as const, label: 'App Preferences', icon: Sliders, badge: 'Old Settings' },
            { id: 'security' as const, label: 'Security & Password', icon: Lock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSection(tab.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      isActive ? 'bg-emerald-500/30 text-emerald-300' : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 2. Main Profile Form */}
        <form onSubmit={handleSaveProfile} className="space-y-6">
          {/* Section: Personal Information */}
          {(activeSection === 'all' || activeSection === 'personal') && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <UserIcon className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900">
                  {t('personalInfo')}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('email')} (Read-Only)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser?.email || ''}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('phoneNumber')}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={userProfile?.phoneNumber || 'Not provided'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('dateOfBirth')}
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t('location')} (District / State)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Warangal, Telangana"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Postal Pincode
                  </label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="e.g. 506001"
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('address')} (Village / Street / House No.)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. House #4-21, Hasanparthy Village, Near Ramalayam"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Profile Bio &amp; Agronomic Introduction
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Introduce yourself to market admins, FPOs, and fellow farmers..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* Section: Role-Specific / Farm Operations */}
          {(activeSection === 'all' || activeSection === 'operations') && (
            <FarmOperationsSection
              role={role}
              data={operationsData}
              onChange={(updated) => setOperationsData((prev) => ({ ...prev, ...updated }))}
              disabled={isSaving}
            />
          )}

          {/* Section: Bank & Payout Details ("Old Settings") */}
          {(activeSection === 'all' || activeSection === 'bank') && (
            <BankSettingsSection
              data={bankData}
              onChange={(updated) => setBankData((prev) => ({ ...prev, ...updated }))}
              disabled={isSaving}
            />
          )}

          {/* Section: KYC & Government IDs ("Old Settings") */}
          {(activeSection === 'all' || activeSection === 'kyc') && (
            <KycSettingsSection
              data={kycData}
              onChange={(updated) => setKycData((prev) => ({ ...prev, ...updated }))}
              disabled={isSaving}
            />
          )}

          {/* Section: App Preferences & Alerts ("Old Settings") */}
          {(activeSection === 'all' || activeSection === 'preferences') && (
            <AppSettingsSection
              data={appPreferences}
              onChange={(updated) => setAppPreferences((prev) => ({ ...prev, ...updated }))}
              onResetDefaults={handleResetSettingsDefaults}
              disabled={isSaving}
            />
          )}

          {/* Sticky Bottom Action Bar */}
          <div className="sticky bottom-4 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Changes to old settings (KYC, Bank, Alerts) update immediately across your account.
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="py-2.5 px-4 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                Back to Dashboard
              </button>

              <button
                type="submit"
                id="save-profile-btn"
                disabled={isSaving}
                className="py-2.5 px-6 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Saving All Details...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 text-slate-950" />
                    <span>Save All Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* 3. Security & Password Change Section */}
        {(activeSection === 'all' || activeSection === 'security') && (
        <div className="mt-10 bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-slate-800" />
            <h2 className="text-base font-bold text-slate-900">
              {t('securityTitle')}
            </h2>
          </div>

          {passwordSuccess && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('currentPassword')}
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('newPassword')}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('confirmNewPassword')}
                </label>
                <input
                  type="password"
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-slate-700 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="py-2.5 px-5 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{t('changingPassword')}</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{t('changePassword')}</span>
                </>
              )}
            </button>
          </form>
        </div>
        )}
      </main>

      {/* Sensitive Action: Phone Number OTP Change Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Verify & Change Phone Number
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPhoneModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              For security reasons, changing your phone number requires Firebase SMS OTP verification on the new mobile number.
            </p>

            {phoneModalError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{phoneModalError}</span>
              </div>
            )}

            {!phoneOtpSent ? (
              <form onSubmit={handleSendPhoneChangeOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Phone Number (with Country Code)
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    disabled={isSendingPhoneOtp}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    e.g. +91 98765 43210
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPhoneModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSendingPhoneOtp}
                    className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {isSendingPhoneOtp ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Send OTP'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneChangeOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Enter 6-digit OTP sent to {newPhone}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    disabled={isVerifyingPhoneOtp}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-lg font-bold tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setPhoneOtpSent(false)}
                    className="text-xs text-emerald-700 font-semibold hover:underline"
                  >
                    Change Number
                  </button>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPhoneModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isVerifyingPhoneOtp || phoneOtp.length !== 6}
                      className="px-4 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                    >
                      {isVerifyingPhoneOtp ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Confirm & Update'
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Profile Photo Modal with Device Upload, Agri Avatars, and Web URL */}
      <ProfilePhotoModal
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        currentPhotoURL={userProfile?.photoURL}
        userName={userProfile?.displayName || currentUser?.displayName || 'Farmer Partner'}
      />
    </div>
  );
};
