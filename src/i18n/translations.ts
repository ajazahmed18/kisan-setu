export type Language = 'en' | 'te' | 'hi';

export interface TranslationStrings {
  // Brand & Platform
  appName: string;
  appTagline: string;
  welcomeToPlatform: string;
  platformSubtitle: string;
  howAreYouUsing: string;

  // Roles & Descriptions
  roleFarmer: string;
  roleFarmerDesc: string;
  roleFpo: string;
  roleFpoDesc: string;
  roleMarketAdmin: string;
  roleMarketAdminDesc: string;
  roleBuyer?: string;
  roleBuyerDesc?: string;
  roleTransporter: string;
  roleTransporterDesc: string;
  roleAdmin: string;
  roleAdminDesc: string;

  // Auth Flow & Methods
  continueAs: string;
  chooseLoginMethod: string;
  methodEmailPassword: string;
  methodGoogle: string;
  methodPhoneOtp: string;
  changeRole: string;

  // Navigation & Actions
  login: string;
  signUp: string;
  logout: string;
  createAccount: string;
  forgotPassword: string;
  backToLogin: string;
  continueWithGoogle: string;
  continueWithPhone: string;
  continueWithEmail: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  signInHere: string;
  signUpHere: string;

  // App Navigation
  navHome: string;
  navSelling: string;
  navExistingPrices: string;
  navMarkets: string;
  navPortal: string;
  navCommunity: string;
  navScanCrop: string;
  navVoiceAssistant: string;
  navIvr: string;

  // Market & Mandi Rates
  marketTitle: string;
  marketSubtitle: string;
  filterCrop: string;
  allCrops: string;
  todaysRate: string;
  yesterdaysRate: string;
  perQuintal: string;
  increasedBy: string;
  decreasedBy: string;
  stableRate: string;
  todaysRange: string;
  arrivalVolume: string;
  compareMandis: string;

  // Farmer Portal Tabs & Actions
  tabCropLots: string;
  tabBuyerOffers: string;
  tabActiveOrders: string;
  tabBankAccount: string;
  tabSupplyDemand: string;
  addCropLotBtn: string;
  lotsAvailableTitle: string;
  pendingNegotiationsTitle: string;
  acceptOfferBtn: string;
  rejectOfferBtn: string;
  counterOfferBtn: string;

  // Form Fields & Labels
  fullName: string;
  fullNamePlaceholder: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  confirmPasswordPlaceholder: string;
  phoneNumber: string;
  phoneNumberPlaceholder: string;
  phoneHelper: string;
  optional: string;
  showPassword: string;
  hidePassword: string;
  location: string;
  address: string;
  dateOfBirth: string;
  rememberMe: string;
  adminOnlyNote: string;
  adminSelfRegisterDisabled: string;

  // OTP Strings
  otpCode: string;
  otpPlaceholder: string;
  enterOtpMessage: string;
  sendOtp: string;
  resendOtp: string;
  verifyOtp: string;
  didntReceiveCode: string;

  // Buttons & States
  resetPasswordButton: string;
  processing: string;
  submitting: string;
  loggingIn: string;
  signingUp: string;
  sendingOtp: string;
  verifying: string;
  sendingResetLink: string;
  orDivider: string;
  termsNotice: string;
  termsLink: string;
  privacyLink: string;

  // Validation Messages
  pleaseSelectRole: string;
  nameRequired: string;
  emailRequired: string;
  invalidEmail: string;
  passwordRequired: string;
  passwordMinLength: string;
  passwordsDoNotMatch: string;
  phoneRequired: string;
  invalidPhone: string;
  otpRequired: string;
  invalidOtpFormat: string;

  // Success Messages
  loginSuccess: string;
  signupSuccess: string;
  otpSentSuccess: string;
  otpVerifiedSuccess: string;
  passwordResetSent: string;
  passwordResetInstructions: string;

  // Error Messages
  roleMismatchError: string;
  wrongPassword: string;
  userNotFound: string;
  emailAlreadyInUse: string;
  tooManyRequests: string;
  networkError: string;
  invalidOtp: string;
  otpExpired: string;
  recaptchaFailed: string;
  popupClosed: string;
  genericAuthError: string;

  // Dashboard & Profile
  dashboardTitle: string;
  welcomeBack: string;
  profileOverview: string;
  accountDetails: string;
  securityOverview: string;
  authProvider: string;
  userIdLabel: string;
  phoneVerified: string;
  emailVerified: string;
  notProvided: string;
  createdAt: string;
  lastLogin: string;
  connectedAccount: string;
  activeSession: string;
  sessionSecure: string;
  quickActions: string;

  // Complete Profile & Security Page
  profileTitle: string;
  personalInfo: string;
  roleSpecificInfo: string;
  accountInfo: string;
  securityTitle: string;
  profilePhoto: string;
  changePhoto: string;
  removePhoto: string;
  uploadingPhoto: string;
  photoUpdatedSuccess: string;
  saveChanges: string;
  cancel: string;
  savingProfile: string;
  profileUpdatedSuccess: string;
  emailVerifiedBadge: string;
  emailNotVerifiedBadge: string;
  yourEmailNotVerified: string;
  sendVerificationEmail: string;
  verificationEmailSent: string;
  refreshStatus: string;
  phoneVerifiedBadge: string;
  phoneNotVerifiedBadge: string;
  changePhoneWithOtp: string;
  changePassword: string;
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  changingPassword: string;
  passwordChangedSuccess: string;
  passwordStrength: string;
  weak: string;
  medium: string;
  strong: string;
  reauthRequired: string;
  adminUsersMgmt: string;

  // Role Specific Fields
  farmName: string;
  farmLocation: string;
  farmSize: string;
  primaryCrops: string;
  orgName: string;
  orgLocation: string;
  memberCount: string;
  regNumber: string;
  businessName: string;
  businessLocation: string;
  businessType: string;
  gstNumber: string;
  companyName: string;
  serviceLocation: string;
  fleetSize: string;
  vehicleTypes: string;
  adminId: string;
  adminDepartment: string;
  clearanceLevel: string;
}

export const translations: Record<Language, TranslationStrings> = {
  en: {
    // Brand & Platform
    appName: 'KisanSetu',
    appTagline: 'Smart Agriculture Platform',
    welcomeToPlatform: 'Welcome to the Smart Agriculture Platform',
    platformSubtitle: 'Connecting Farmers, Market Admins, FPOs and Transporters in one trusted ecosystem.',
    howAreYouUsing: 'How are you using the platform?',

    // Roles & Descriptions
    roleFarmer: '🌱 Farmer',
    roleFarmerDesc: 'Manage your farm and agricultural activities',
    roleFpo: '🏢 FPO Co-Op',
    roleFpoDesc: 'Manage your farmer organization',
    roleMarketAdmin: '🏛️ Market Admin',
    roleMarketAdminDesc: 'Manage daily vegetable prices and APMC market arrivals',
    roleBuyer: '🏛️ Market Admin',
    roleBuyerDesc: 'Manage daily vegetable prices and APMC market arrivals',
    roleTransporter: '🚚 Transporter',
    roleTransporterDesc: 'Manage agricultural transportation',
    roleAdmin: '🛡️ Admin Portal',
    roleAdminDesc: 'Manage and monitor the platform',

    // Auth Flow & Methods
    continueAs: 'Continue as',
    chooseLoginMethod: 'Choose login method',
    methodEmailPassword: 'Email + Password',
    methodGoogle: 'Continue with Google',
    methodPhoneOtp: 'Phone + OTP',
    changeRole: 'Change Role',

    // Navigation & Actions
    login: 'Login',
    signUp: 'Sign Up',
    logout: 'Logout',
    createAccount: 'Create Account',
    forgotPassword: 'Forgot Password?',
    backToLogin: 'Back to Login',
    continueWithGoogle: 'Continue with Google',
    continueWithPhone: 'Sign in with Phone Number',
    continueWithEmail: 'Sign in with Email',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    signInHere: 'Login here',
    signUpHere: 'Sign up here',

    // App Navigation
    navHome: 'Home',
    navSelling: 'Selling Desk',
    navExistingPrices: 'Market Rates',
    navMarkets: 'Mandi Prices & Trends',
    navPortal: 'My Portal',
    navCommunity: 'Kisan Community',
    navScanCrop: 'Scan & Sell Crop',
    navVoiceAssistant: 'Voice Assistant',
    navIvr: '1800 IVR',

    // Market & Mandi Rates
    marketTitle: 'Commodity Market Rates by City',
    marketSubtitle: 'Real-time quintal rates across major APMC mandis. Compare today\'s actual auction price with yesterday\'s closing rate.',
    filterCrop: 'Filter Crop:',
    allCrops: 'All Crops',
    todaysRate: "Today's Rate",
    yesterdaysRate: 'Yesterday',
    perQuintal: '/ Qtl',
    increasedBy: 'Increased by',
    decreasedBy: 'Decreased by',
    stableRate: 'Stable — Same as yesterday',
    todaysRange: "Today's Range",
    arrivalVolume: 'Arrival Volume',
    compareMandis: 'Compare All Regional Mandis',

    // Farmer Portal Tabs & Actions
    tabCropLots: 'My Crop Lots',
    tabBuyerOffers: 'Market Offers',
    tabActiveOrders: 'Active Orders',
    tabBankAccount: 'Bank Account',
    tabSupplyDemand: 'Supply & Demand',
    addCropLotBtn: '+ Add Crop Lot',
    lotsAvailableTitle: 'Lots Available For Sale',
    pendingNegotiationsTitle: 'Pending Market Negotiations',
    acceptOfferBtn: 'Accept Offer',
    rejectOfferBtn: 'Reject Offer',
    counterOfferBtn: 'Counter Offer',

    // Form Fields & Labels
    fullName: 'Full Name',
    fullNamePlaceholder: 'e.g. Ramesh Kumar',
    email: 'Email Address',
    emailPlaceholder: 'name@example.com',
    password: 'Password',
    passwordPlaceholder: 'Enter your password (min 6 characters)',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Re-enter your password',
    phoneNumber: 'Phone Number',
    phoneNumberPlaceholder: '+91 98765 43210',
    phoneHelper: 'Include country code (+91 for India)',
    optional: 'Optional',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    location: 'Location (State / District)',
    address: 'Detailed Address',
    dateOfBirth: 'Date of Birth',
    rememberMe: 'Remember me',
    adminOnlyNote: 'Authorized Administrator: Access strictly restricted to admin@gmail.com',
    adminSelfRegisterDisabled: 'Self-registration as Admin is restricted. Please sign in directly with the designated administrator credentials.',

    // OTP Strings
    otpCode: '6-digit OTP Code',
    otpPlaceholder: 'Enter 6-digit code',
    enterOtpMessage: 'A 6-digit verification code has been sent to your phone.',
    sendOtp: 'Send OTP',
    resendOtp: 'Resend OTP',
    verifyOtp: 'Verify OTP & Continue',
    didntReceiveCode: "Didn't receive the code?",

    // Buttons & States
    resetPasswordButton: 'Send Reset Link',
    processing: 'Processing...',
    submitting: 'Submitting...',
    loggingIn: 'Signing in...',
    signingUp: 'Creating account...',
    sendingOtp: 'Sending OTP...',
    verifying: 'Verifying OTP...',
    sendingResetLink: 'Sending reset link...',
    orDivider: 'or',
    termsNotice: 'By continuing, you agree to our',
    termsLink: 'Terms of Service',
    privacyLink: 'Privacy Policy',

    // Validation Messages
    pleaseSelectRole: 'Please select your role before continuing.',
    nameRequired: 'Please enter your full name.',
    emailRequired: 'Please enter your email address.',
    invalidEmail: 'Please enter a valid email address.',
    passwordRequired: 'Please enter your password.',
    passwordMinLength: 'Password must be at least 6 characters.',
    passwordsDoNotMatch: 'Passwords do not match.',
    phoneRequired: 'Please enter your phone number.',
    invalidPhone: 'Please enter a valid phone number with country code (e.g. +91).',
    otpRequired: 'Please enter the 6-digit OTP code.',
    invalidOtpFormat: 'OTP must be exactly 6 digits.',

    // Success Messages
    loginSuccess: 'Logged in successfully! Welcome back.',
    signupSuccess: 'Account created successfully! Redirecting...',
    otpSentSuccess: 'OTP sent successfully to your mobile number.',
    otpVerifiedSuccess: 'Phone verified successfully!',
    passwordResetSent: 'Password reset link sent! Check your inbox.',
    passwordResetInstructions: 'We have sent password reset instructions to your registered email.',

    // Error Messages
    roleMismatchError: 'Your account is not registered under this role.',
    wrongPassword: 'Incorrect password. Please try again.',
    userNotFound: 'No account found with this email.',
    emailAlreadyInUse: 'This email is already registered.',
    tooManyRequests: 'Too many attempts. Please wait a moment and retry.',
    networkError: 'Network error. Please check your internet connection.',
    invalidOtp: 'Invalid OTP. Please check the code and try again.',
    otpExpired: 'OTP expired. Please request a new code.',
    recaptchaFailed: 'reCAPTCHA verification failed. Please try again.',
    popupClosed: 'Sign-in popup closed before completion.',
    genericAuthError: 'Authentication failed. Please try again.',

    // Dashboard & Profile
    dashboardTitle: 'Ecosystem Dashboard',
    welcomeBack: 'Welcome back',
    profileOverview: 'Profile Overview',
    accountDetails: 'Account Credentials',
    securityOverview: 'Security & Verification',
    authProvider: 'Sign-in Provider',
    userIdLabel: 'Firebase UID',
    phoneVerified: 'Phone Verified',
    emailVerified: 'Email Verified',
    notProvided: 'Not provided',
    createdAt: 'Registered On',
    lastLogin: 'Last Active',
    connectedAccount: 'Active Identity Provider',
    activeSession: 'Active Secure Session',
    sessionSecure: 'Protected with Firebase Auth token',
    quickActions: 'Quick Navigation',

    // Complete Profile & Security Page
    profileTitle: 'User Profile & Settings',
    personalInfo: 'Personal Information',
    roleSpecificInfo: 'Role-Specific Information',
    accountInfo: 'Account Information',
    securityTitle: 'Security & Access',
    profilePhoto: 'Profile Photo',
    changePhoto: 'Change Photo',
    removePhoto: 'Remove Photo',
    uploadingPhoto: 'Uploading photo to Storage...',
    photoUpdatedSuccess: 'Profile photo updated successfully.',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    savingProfile: 'Saving profile...',
    profileUpdatedSuccess: 'Profile updated successfully.',
    emailVerifiedBadge: '✓ Email Verified',
    emailNotVerifiedBadge: '⚠ Email Not Verified',
    yourEmailNotVerified: 'Your email is not verified.',
    sendVerificationEmail: 'Send Verification Email',
    verificationEmailSent: 'Verification email sent! Please check your inbox.',
    refreshStatus: 'Refresh Status',
    phoneVerifiedBadge: '✓ Phone Verified',
    phoneNotVerifiedBadge: '⚠ Phone Not Verified',
    changePhoneWithOtp: 'Change Phone via OTP',
    changePassword: 'Change Password',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmNewPassword: 'Confirm New Password',
    changingPassword: 'Changing password...',
    passwordChangedSuccess: 'Password changed successfully!',
    passwordStrength: 'Password Strength',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
    reauthRequired: 'Please re-authenticate before performing this sensitive action.',
    adminUsersMgmt: 'Admin Users Management',

    // Role Specific Fields
    farmName: 'Farm / Land Name',
    farmLocation: 'Farm Location / Village',
    farmSize: 'Farm Size (Acres)',
    primaryCrops: 'Primary Crops Grown',
    orgName: 'Organization Name',
    orgLocation: 'Operational Headquarters',
    memberCount: 'Member Farmers Count',
    regNumber: 'FPO Registration Number',
    businessName: 'Business / Firm Name',
    businessLocation: 'Market / Mandi Location',
    businessType: 'Business Type (Wholesaler/Processor)',
    gstNumber: 'GST / Trade License',
    companyName: 'Transport / Fleet Name',
    serviceLocation: 'Operating Region',
    fleetSize: 'Fleet Size (Vehicles)',
    vehicleTypes: 'Vehicle Types (Mini-truck/Lorry/Container)',
    adminId: 'System Administrator ID',
    adminDepartment: 'Admin Department',
    clearanceLevel: 'Clearance Level',
  },

  te: {
    // Brand & Platform
    appName: 'కిసాన్‌సేతు',
    appTagline: 'స్మార్ట్ వ్యవసాయ ప్లాట్‌ఫారమ్',
    welcomeToPlatform: 'స్మార్ట్ వ్యవసాయ ప్లాట్‌ఫారమ్‌కు స్వాగతం',
    platformSubtitle: 'రైతులు, మార్కెట్ అడ్మిన్లు, FPOలు మరియు రవాణాదారులను ఒకే విశ్వసనీయ వేదికపై కలుపుతోంది.',
    howAreYouUsing: 'మీరు ప్లాట్‌ఫారమ్‌ను ఎలా ఉపయోగిస్తున్నారు?',

    // Roles & Descriptions
    roleFarmer: '🌱 రైతు (Farmer)',
    roleFarmerDesc: 'మీ వ్యవసాయ కార్యకలాపాలు మరియు పంటలను నిర్వహించండి',
    roleFpo: '🏢 FPO కో-ఆపరేటివ్',
    roleFpoDesc: 'మీ రైతు ఉత్పత్తిదారుల సంస్థను నిర్వహించండి',
    roleMarketAdmin: '🏛️ మార్కెట్ అడ్మిన్ (Market Admin)',
    roleMarketAdminDesc: 'రోజువారీ కూరగాయల మార్కెట్ ధరలు మరియు మండి సమాచారాన్ని నిర్వహించండి',
    roleBuyer: '🏛️ మార్కెట్ అడ్మిన్ (Market Admin)',
    roleBuyerDesc: 'రోజువారీ కూరగాయల మార్కెట్ ధరలు మరియు మండి సమాచారాన్ని నిర్వహించండి',
    roleTransporter: '🚚 రవాణాదారు (Transporter)',
    roleTransporterDesc: 'వ్యవసాయ ఉత్పత్తుల రవాణా సేవలను నిర్వహించండి',
    roleAdmin: '🛡️ అడ్మిన్ పోర్టల్',
    roleAdminDesc: 'మొత్తం ప్లాట్‌ఫారమ్‌ను పర్యవేక్షించండి మరియు నిర్వహించండి',

    // Auth Flow & Methods
    continueAs: 'కొనసాగించండి:',
    chooseLoginMethod: 'లాగిన్ విధానాన్ని ఎంచుకోండి',
    methodEmailPassword: 'ఈమెయిల్ + పాస్‌వర్డ్',
    methodGoogle: 'గూగుల్‌తో కొనసాగండి',
    methodPhoneOtp: 'ఫోన్ + ఓటీపీ',
    changeRole: 'పాత్ర మార్చుకోండి',

    // Navigation & Actions
    login: 'లాగిన్ చేయండి',
    signUp: 'నమోదు చేసుకోండి',
    logout: 'లాగౌట్',
    createAccount: 'ఖాతా సృష్టించండి',
    forgotPassword: 'పాస్‌వర్డ్ మర్చిపోయారా?',
    backToLogin: 'లాగిన్‌కు తిరిగి వెళ్ళండి',
    continueWithGoogle: 'గూగుల్‌తో కొనసాగండి',
    continueWithPhone: 'ఫోన్ నంబర్‌తో లాగిన్ చేయండి',
    continueWithEmail: 'ఈమెయిల్‌తో లాగిన్ చేయండి',
    alreadyHaveAccount: 'ఇప్పటికే ఖాతా ఉందా?',
    dontHaveAccount: 'ఖాతా లేదా?',
    signInHere: 'ఇక్కడ లాగిన్ అవ్వండి',
    signUpHere: 'ఇక్కడ నమోదు చేసుకోండి',

    // App Navigation
    navHome: 'హోమ్',
    navSelling: 'అమ్మకం డెస్క్ (Selling Desk)',
    navExistingPrices: 'మార్కెట్ ధరలు (Market Rates)',
    navMarkets: 'మార్కెట్ ధరలు & ధోరణులు',
    navPortal: 'నా పోర్టల్',
    navCommunity: 'కిసాన్ కమ్యూనిటీ',
    navScanCrop: 'పంట స్కానింగ్ & అమ్మకం',
    navVoiceAssistant: 'వాయిస్ అసిస్టెంట్',
    navIvr: '1800 ఉచిత కాల్',

    // Market & Mandi Rates
    marketTitle: 'నగరాల వారీగా వ్యవసాయ మార్కెట్ ధరలు',
    marketSubtitle: 'ప్రధాన వ్యవసాయ మార్కెట్లలో క్వింటాల్ ధరలు. నిన్నటితో పోల్చి నేటి నిజమైన ధరలను తెలుసుకోండి.',
    filterCrop: 'పంట ఎంచుకోండి:',
    allCrops: 'అన్ని పంటలు',
    todaysRate: 'నేటి ధర',
    yesterdaysRate: 'నిన్నటి ధర',
    perQuintal: '/ క్వింటాల్',
    increasedBy: 'పెరిగింది',
    decreasedBy: 'తగ్గింది',
    stableRate: 'స్థిరమైన ధర — నిన్నటి మాదిరిగానే',
    todaysRange: 'నేటి పరిధి',
    arrivalVolume: 'రాబడి పరిమాణం',
    compareMandis: 'అన్ని మార్కెట్లను పోల్చండి',

    // Farmer Portal Tabs & Actions
    tabCropLots: 'నా పంట నిల్వలు',
    tabBuyerOffers: 'మార్కెట్ ఆఫర్లు',
    tabActiveOrders: 'ప్రస్తుత ఆర్డర్లు',
    tabBankAccount: 'బ్యాంక్ ఖాతా',
    tabSupplyDemand: 'సరఫరా & డిమాండ్',
    addCropLotBtn: '+ కొత్త పంట జోడించండి',
    lotsAvailableTitle: 'అమ్మకానికి ఉన్న పంట నిల్వలు',
    pendingNegotiationsTitle: 'పెండింగ్‌లో ఉన్న మార్కెట్ ఆఫర్లు',
    acceptOfferBtn: 'ఆఫర్ అంగీకరించు',
    rejectOfferBtn: 'తిరస్కరించు',
    counterOfferBtn: 'కౌంటర్ ఆఫర్',

    // Form Fields & Labels
    fullName: 'పూర్తి పేరు',
    fullNamePlaceholder: 'ఉదా: రమేష్ కుమార్',
    email: 'ఈమెయిల్ చిరునామా',
    emailPlaceholder: 'name@example.com',
    password: 'పాస్‌వర్డ్',
    passwordPlaceholder: 'మీ పాస్‌వర్డ్ నమోదు చేయండి (కనీసం 6 అక్షరాలు)',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    confirmPasswordPlaceholder: 'పాస్‌వర్డ్‌ను మళ్లీ నమోదు చేయండి',
    phoneNumber: 'ఫోన్ నంబర్',
    phoneNumberPlaceholder: '+91 98765 43210',
    phoneHelper: 'దేశం కోడ్‌ను చేర్చండి (+91)',
    optional: 'ఐచ్ఛికం',
    showPassword: 'పాస్‌వర్డ్ చూపించు',
    hidePassword: 'పాస్‌వర్డ్ దాచు',
    location: 'ప్రాంతం (రాష్ట్రం / జిల్లా)',
    address: 'పూర్తి చిరునామా',
    dateOfBirth: 'పుట్టిన తేదీ',
    rememberMe: 'నన్ను గుర్తుంచుకో',
    adminOnlyNote: 'అధికృత అడ్మినిస్ట్రేటర్: యాక్సెస్ కేవలం admin@gmail.com కి మాత్రమే పరిమితం',
    adminSelfRegisterDisabled: 'అడ్మిన్ నమోదు పరిమితం చేయబడింది. దయచేసి నిర్దేశిత అడ్మిన్ వివరాలతో నేరుగా లాగిన్ అవ్వండి.',

    // OTP Strings
    otpCode: '6-అంకెల OTP కోడ్',
    otpPlaceholder: '6-అంకెల ఓటీపీని నమోదు చేయండి',
    enterOtpMessage: 'మీ మొబైల్ నంబర్‌కు 6-అంకెల ధృవీకరణ కోడ్ పంపబడింది.',
    sendOtp: 'ఓటీపీ పంపండి',
    resendOtp: 'మళ్లీ ఓటీపీ పంపండి',
    verifyOtp: 'ఓటీపీని ధృవీకరించి కొనసాగండి',
    didntReceiveCode: 'కోడ్ రాలేదా?',

    // Buttons & States
    resetPasswordButton: 'రీసెట్ లింక్ పంపండి',
    processing: 'ప్రాసెస్ అవుతోంది...',
    submitting: 'సమర్పిస్తోంది...',
    loggingIn: 'లాగిన్ అవుతోంది...',
    signingUp: 'ఖాతా సృష్టించబడుతోంది...',
    sendingOtp: 'ఓటీపీ పంపుతోంది...',
    verifying: 'ధృవీకరిస్తోంది...',
    sendingResetLink: 'రీసెట్ ఈమెయిల్ పంపుతోంది...',
    orDivider: 'లేదా',
    termsNotice: 'కొనసాగడం ద్వారా మీరు మా నిబంధనలను అంగీకరిస్తున్నారు',
    termsLink: 'సేవా నిబంధనలు',
    privacyLink: 'గోప్యతా విధానం',

    // Validation Messages
    pleaseSelectRole: 'దయచేసి మొదట మీ పాత్రను ఎంచుకోండి.',
    nameRequired: 'దయచేసి మీ పూర్తి పేరును నమోదు చేయండి.',
    emailRequired: 'దయచేసి మీ ఈమెయిల్ చిరునామాను నమోదు చేయండి.',
    invalidEmail: 'దయచేసి సరైన ఈమెయిల్ చిరునామాను నమోదు చేయండి.',
    passwordRequired: 'దయచేసి మీ పాస్‌వర్డ్‌ను నమోదు చేయండి.',
    passwordMinLength: 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.',
    passwordsDoNotMatch: 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు.',
    phoneRequired: 'దయచేసి మీ ఫోన్ నంబర్‌ను నమోదు చేయండి.',
    invalidPhone: 'దయచేసి సరైన ఫోన్ నంబర్‌ను నమోదు చేయండి (+91).',
    otpRequired: 'దయచేసి 6-అంకెల ఓటీపీ కోడ్‌ను నమోదు చేయండి.',
    invalidOtpFormat: 'ఓటీపీ 6 అంకెలు మాత్రమే ఉండాలి.',

    // Success Messages
    loginSuccess: 'విజయవంతంగా లాగిన్ అయ్యారు!',
    signupSuccess: 'ఖాతా విజయవంతంగా సృష్టించబడింది!',
    otpSentSuccess: 'మీ మొబైల్‌కు ఓటీపీ కోడ్ పంపబడింది.',
    otpVerifiedSuccess: 'ఫోన్ నంబర్ విజయవంతంగా ధృవీకరించబడింది!',
    passwordResetSent: 'పాస్‌వర్డ్ రీసెట్ ఈమెయిల్ పంపబడింది.',
    passwordResetInstructions: 'మీ ఈమెయిల్‌కు రీసెట్ లింక్ పంపబడింది.',

    // Error Messages
    roleMismatchError: 'మీ ఖాతా ఈ పాత్ర క్రింద నమోదు చేయబడలేదు.',
    wrongPassword: 'తప్పు పాస్‌వర్డ్. దయచేసి మళ్లీ ప్రయత్నించండి.',
    userNotFound: 'ఈ ఈమెయిల్‌తో ఏ ఖాతా కనుగొనబడలేదు.',
    emailAlreadyInUse: 'ఈ ఈమెయిల్ ఇప్పటికే నమోదు చేయబడింది.',
    tooManyRequests: 'చాలా ప్రయత్నాలు జరిగాయి. దయచేసి కాసేపటి తర్వాత ప్రయత్నించండి.',
    networkError: 'నెట్‌వర్క్ సమస్య. ఇంటర్నెట్ కనెక్షన్ తనిఖీ చేయండి.',
    invalidOtp: 'తప్పు ఓటీపీ. దయచేసి మళ్లీ ప్రయత్నించండి.',
    otpExpired: 'ఓటీపీ గడువు ముగిసింది. కొత్త కోడ్ అభ్యర్థించండి.',
    recaptchaFailed: 'రీక్యాప్చా ధృవీకరణ విఫలమైంది.',
    popupClosed: 'విండో మూసివేయబడింది.',
    genericAuthError: 'ప్రామాణీకరణ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',

    // Dashboard & Profile
    dashboardTitle: 'ఎకోసిస్టమ్ డ్యాష్‌బోర్డ్',
    welcomeBack: 'స్వాగతం',
    profileOverview: 'ప్రొఫైల్ వివరాలు',
    accountDetails: 'ఖాతా ఆధారాలు',
    securityOverview: 'భద్రత & ధృవీకరణ',
    authProvider: 'లాగిన్ విధానం',
    userIdLabel: 'యూజర్ ID (UID)',
    phoneVerified: 'ఫోన్ ధృవీకరించబడింది',
    emailVerified: 'ఈమెయిల్ ధృవీకరించబడింది',
    notProvided: 'అందించబడలేదు',
    createdAt: 'సభ్యత్వం ప్రారంభం',
    lastLogin: 'చివరి లాగిన్',
    connectedAccount: 'గుర్తింపు ప్రొవైడర్',
    activeSession: 'యాక్టివ్ సెషన్',
    sessionSecure: 'సురక్షిత ఫైర్‌బేస్ టోకెన్',
    quickActions: 'త్వరిత నావిగేషన్',

    // Complete Profile & Security Page
    profileTitle: 'యూజర్ ప్రొఫైల్ & సెట్టింగ్స్',
    personalInfo: 'వ్యక్తిగత సమాచారం',
    roleSpecificInfo: 'పాత్ర ఆధారిత సమాచారం',
    accountInfo: 'ఖాతా వివరాలు',
    securityTitle: 'భద్రత & ప్రాప్యత',
    profilePhoto: 'ప్రొఫైల్ ఫోటో',
    changePhoto: 'ఫోటో మార్చండి',
    removePhoto: 'ఫోటో తొలగించండి',
    uploadingPhoto: 'ఫోటో నిల్వ చేయబడుతోంది...',
    photoUpdatedSuccess: 'ప్రొఫైల్ ఫోటో విజయవంతంగా అప్‌డేట్ చేయబడింది.',
    saveChanges: 'మార్పులను భద్రపరచండి',
    cancel: 'రద్దు చేయండి',
    savingProfile: 'ప్రొఫైల్ భద్రపరచబడుతోంది...',
    profileUpdatedSuccess: 'ప్రొఫైల్ వివరాలు విజయవంతంగా అప్‌డేట్ అయ్యాయి.',
    emailVerifiedBadge: '✓ ఈమెయిల్ ధృవీకరించబడింది',
    emailNotVerifiedBadge: '⚠ ఈమెయిల్ ధృవీకరించబడలేదు',
    yourEmailNotVerified: 'మీ ఈమెయిల్ ధృవీకరించబడలేదు.',
    sendVerificationEmail: 'ధృవీకరణ ఈమెయిల్ పంపండి',
    verificationEmailSent: 'ధృవీకరణ లింక్ పంపబడింది! మీ ఇన్‌బాక్స్ చూడండి.',
    refreshStatus: 'స్థితిని పునరుద్ధరించండి',
    phoneVerifiedBadge: '✓ ఫోన్ ధృవీకరించబడింది',
    phoneNotVerifiedBadge: '⚠ ఫోన్ ధృవీకరించబడలేదు',
    changePhoneWithOtp: 'OTP తో ఫోన్ నంబర్ మార్చండి',
    changePassword: 'పాస్‌వర్డ్ మార్చండి',
    currentPassword: 'ప్రస్తుత పాస్‌వర్డ్',
    newPassword: 'కొత్త పాస్‌వర్డ్',
    confirmNewPassword: 'కొత్త పాస్‌వర్డ్ నిర్ధారించండి',
    changingPassword: 'పాస్‌వర్డ్ మార్చబడుతోంది...',
    passwordChangedSuccess: 'పాస్‌వర్డ్ విజయవంతంగా మార్చబడింది!',
    passwordStrength: 'పాస్‌వర్డ్ బలం',
    weak: 'బలహీనం',
    medium: 'మధ్యస్థం',
    strong: 'బలమైనది',
    reauthRequired: 'దయచేసి కొనసాగడానికి ముందు మళ్లీ లాగిన్ చేయండి.',
    adminUsersMgmt: 'అడ్మిన్ యూజర్స్ నిర్వహణ',

    // Role Specific Fields
    farmName: 'వ్యవసాయ క్షేత్రం పేరు',
    farmLocation: 'పొలం ఉన్న ప్రదేశం / గ్రామం',
    farmSize: 'భూమి విస్తీర్ణం (ఎకరాలు)',
    primaryCrops: 'ప్రధాన పంటలు',
    orgName: 'సంస్థ / FPO పేరు',
    orgLocation: 'ప్రధాన కార్యాలయం',
    memberCount: 'రైతు సభ్యుల సంఖ్య',
    regNumber: 'FPO రిజిస్ట్రేషన్ సంఖ్య',
    businessName: 'వ్యాపార సంస్థ పేరు',
    businessLocation: 'మార్కెట్ యార్డ్ / మండీ ప్రాంతం',
    businessType: 'వ్యాపార రకం',
    gstNumber: 'GST / ట్రేడ్ లైసెన్స్ సంఖ్య',
    companyName: 'రవాణా సంస్థ పేరు',
    serviceLocation: 'సేవలు అందించే ప్రాంతం',
    fleetSize: 'వాహనాల సంఖ్య',
    vehicleTypes: 'వాహన రకాలు',
    adminId: 'అడ్మినిస్ట్రేటర్ గుర్తింపు',
    adminDepartment: 'విభాగం',
    clearanceLevel: 'సెక్యూరిటీ స్థాయి',
  },

  hi: {
    // Brand & Platform
    appName: 'किसानसेतु',
    appTagline: 'स्मार्ट कृषि मंच',
    welcomeToPlatform: 'स्मार्ट कृषि मंच में आपका स्वागत है',
    platformSubtitle: 'किसानों, मंडी व्यवस्थापकों, एफपीओ और ट्रांसपोर्टरों को एक भरोसेमंद पारिस्थितिकी तंत्र में जोड़ना।',
    howAreYouUsing: 'आप मंच का उपयोग कैसे कर रहे हैं?',

    // Roles & Descriptions
    roleFarmer: '🌱 किसान (Farmer)',
    roleFarmerDesc: 'अपने खेत और कृषि गतिविधियों का प्रबंधन करें',
    roleFpo: '🏢 एफपीओ सहकारी (FPO)',
    roleFpoDesc: 'अपने किसान उत्पादक संगठन का प्रबंधन करें',
    roleMarketAdmin: '🏛️ मंडी व्यवस्थापक (Market Admin)',
    roleMarketAdminDesc: 'दैनिक सब्जी बाजार मूल्य और मंडी आवक प्रबंधित करें',
    roleBuyer: '🏛️ मंडी व्यवस्थापक (Market Admin)',
    roleBuyerDesc: 'दैनिक सब्जी बाजार मूल्य और मंडी आवक प्रबंधित करें',
    roleTransporter: '🚚 ट्रांसपोर्टर (Transporter)',
    roleTransporterDesc: 'कृषि उपज परिवहन लॉजिस्टिक्स प्रबंधित करें',
    roleAdmin: '🛡️ एडमिन पोर्टल',
    roleAdminDesc: 'मंच की सुरक्षा और उपयोगकर्ताओं की निगरानी करें',

    // Auth Flow & Methods
    continueAs: 'जारी रखें:',
    chooseLoginMethod: 'लॉगिन विधि चुनें',
    methodEmailPassword: 'ईमेल + पासवर्ड',
    methodGoogle: 'गूगल के साथ जारी रखें',
    methodPhoneOtp: 'फोन + ओटीपी',
    changeRole: 'भूमिका बदलें',

    // Navigation & Actions
    login: 'लॉगिन करें',
    signUp: 'साइन अप करें',
    logout: 'लॉगआउट',
    createAccount: 'खाता बनाएं',
    forgotPassword: 'पासवर्ड भूल गए?',
    backToLogin: 'लॉगिन पर वापस जाएं',
    continueWithGoogle: 'गूगल से जारी रखें',
    continueWithPhone: 'फोन नंबर से लॉगिन करें',
    continueWithEmail: 'ईमेल से लॉगिन करें',
    alreadyHaveAccount: 'क्या आपके पास पहले से खाता है?',
    dontHaveAccount: 'खाता नहीं है?',
    signInHere: 'यहाँ लॉगिन करें',
    signUpHere: 'यहाँ पंजीकरण करें',

    // App Navigation
    navHome: 'होम',
    navSelling: 'फसल बिक्री (Selling Desk)',
    navExistingPrices: 'मंडी भाव (Market Rates)',
    navMarkets: 'मंडी भाव और रुझान',
    navPortal: 'मेरा पोर्टल',
    navCommunity: 'किसान कम्युनिटी',
    navScanCrop: 'फसल स्कैन और बिक्री',
    navVoiceAssistant: 'वॉयस असिस्टेंट',
    navIvr: '1800 टोल-फ्री',

    // Market & Mandi Rates
    marketTitle: 'शहरों के अनुसार कृषि मंडी भाव',
    marketSubtitle: 'प्रमुख मंडियों में प्रति क्विंटल भाव। कल के मुकाबले आज के वास्तविक मंडी भाव देखें।',
    filterCrop: 'फसल चुनें:',
    allCrops: 'सभी फसलें',
    todaysRate: 'आज का भाव',
    yesterdaysRate: 'कल का भाव',
    perQuintal: '/ क्विंटल',
    increasedBy: 'बढ़ा',
    decreasedBy: 'घटा',
    stableRate: 'स्थिर भाव — कल के समान',
    todaysRange: 'आज का दायरा',
    arrivalVolume: 'कुल आवक',
    compareMandis: 'सभी क्षेत्रीय मंडियों की तुलना करें',

    // Farmer Portal Tabs & Actions
    tabCropLots: 'मेरी फसल लॉट्स',
    tabBuyerOffers: 'मंडी ऑफर',
    tabActiveOrders: 'सक्रिय ऑर्डर',
    tabBankAccount: 'बैंक खाता',
    tabSupplyDemand: 'आपूर्ति और मांग',
    addCropLotBtn: '+ फसल लॉट जोड़ें',
    lotsAvailableTitle: 'बिक्री के लिए उपलब्ध लॉट्स',
    pendingNegotiationsTitle: 'लंबित खरीदार बातचीत',
    acceptOfferBtn: 'ऑफर स्वीकारें',
    rejectOfferBtn: 'अस्वीकार करें',
    counterOfferBtn: 'काउंटर ऑफर',

    // Form Fields & Labels
    fullName: 'पूरा नाम',
    fullNamePlaceholder: 'उदा. रमेश कुमार',
    email: 'ईमेल पता',
    emailPlaceholder: 'name@example.com',
    password: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड दर्ज करें (कम से कम 6 अक्षर)',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    confirmPasswordPlaceholder: 'पासवर्ड पुनः दर्ज करें',
    phoneNumber: 'फ़ोन नंबर',
    phoneNumberPlaceholder: '+91 98765 43210',
    phoneHelper: 'देश कोड शामिल करें (+91)',
    optional: 'वैकल्पिक',
    showPassword: 'पासवर्ड दिखाएं',
    hidePassword: 'पासवर्ड छुपाएं',
    location: 'स्थान (राज्य / जिला)',
    address: 'विस्तृत पता',
    dateOfBirth: 'जन्म तिथि',
    rememberMe: 'मुझे याद रखें',
    adminOnlyNote: 'अधिकृत प्रशासक: एक्सेस केवल admin@gmail.com तक ही सीमित है',
    adminSelfRegisterDisabled: 'एडमिन स्व-पंजीकरण प्रतिबंधित है। कृपया निर्दिष्ट एडमिन क्रेडेंशियल्स के साथ सीधे लॉगिन करें।',

    // OTP Strings
    otpCode: '6-अंकीय ओटीपी कोड',
    otpPlaceholder: '6-अंकीय कोड दर्ज करें',
    enterOtpMessage: 'आपके मोबाइल नंबर पर 6-अंकीय सत्यापन कोड भेजा गया है।',
    sendOtp: 'ओटीपी भेजें',
    resendOtp: 'पुनः ओटीपी भेजें',
    verifyOtp: 'ओटीपी सत्यापित कर जारी रखें',
    didntReceiveCode: 'कोड प्राप्त नहीं हुआ?',

    // Buttons & States
    resetPasswordButton: 'रीसेट लिंक भेजें',
    processing: 'प्रक्रिया जारी है...',
    submitting: 'जमा किया जा रहा है...',
    loggingIn: 'लॉगिन हो रहा है...',
    signingUp: 'खाता बनाया जा रहा है...',
    sendingOtp: 'ओटीपी भेजा जा रहा है...',
    verifying: 'सत्यापित किया जा रहा है...',
    sendingResetLink: 'रीसेट ईमेल भेजा जा रहा है...',
    orDivider: 'या',
    termsNotice: 'जारी रखकर आप हमारी शर्तों से सहमत होते हैं',
    termsLink: 'सेवा की शर्तें',
    privacyLink: 'गोपनीयता नीति',

    // Validation Messages
    pleaseSelectRole: 'कृपया जारी रखने से पहले अपनी भूमिका चुनें।',
    nameRequired: 'कृपया अपना पूरा नाम दर्ज करें।',
    emailRequired: 'कृपया अपना ईमेल पता दर्ज करें।',
    invalidEmail: 'कृपया एक मान्य ईमेल पता दर्ज करें।',
    passwordRequired: 'कृपया अपना पासवर्ड दर्ज करें।',
    passwordMinLength: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए।',
    passwordsDoNotMatch: 'पासवर्ड मेल नहीं खाते।',
    phoneRequired: 'कृपया अपना फ़ोन नंबर दर्ज करें।',
    invalidPhone: 'कृपया देश कोड (+91) के साथ मान्य नंबर दर्ज करें।',
    otpRequired: 'कृपया 6-अंकीय ओटीपी कोड दर्ज करें।',
    invalidOtpFormat: 'ओटीपी ठीक 6 अंकों का होना चाहिए।',

    // Success Messages
    loginSuccess: 'सफलतापूर्वक लॉगिन हो गया! स्वागत है।',
    signupSuccess: 'खाता सफलतापूर्वक बनाया गया!',
    otpSentSuccess: 'आपके मोबाइल नंबर पर ओटीपी कोड भेज दिया गया है।',
    otpVerifiedSuccess: 'फ़ोन नंबर सफलतापूर्वक सत्यापित हुआ!',
    passwordResetSent: 'पासवर्ड रीसेट लिंक भेजा गया! अपना इनबॉक्स जांचें।',
    passwordResetInstructions: 'हमने पासवर्ड रीसेट निर्देश आपके ईमेल पर भेज दिए हैं।',

    // Error Messages
    roleMismatchError: 'आपका खाता इस भूमिका के अंतर्गत पंजीकृत नहीं है।',
    wrongPassword: 'गलत पासवर्ड। कृपया पुनः प्रयास करें।',
    userNotFound: 'इस ईमेल से कोई खाता नहीं मिला।',
    emailAlreadyInUse: 'यह ईमेल पहले से पंजीकृत है।',
    tooManyRequests: 'अत्यधिक प्रयास। कृपया थोड़ी देर बाद प्रयास करें।',
    networkError: 'नेटवर्क त्रुटि। इंटरनेट कनेक्शन जांचें।',
    invalidOtp: 'अमान्य ओटीपी कोड। कृपया जांचें और पुनः प्रयास करें।',
    otpExpired: 'ओटीपी समाप्त हो गया है। कृपया नया कोड प्राप्त करें।',
    recaptchaFailed: 'reCAPTCHA सत्यापन विफल हुआ।',
    popupClosed: 'पॉपअप खिड़की बंद कर दी गई।',
    genericAuthError: 'प्रमाणीकरण विफल रहा। कृपया पुनः प्रयास करें।',

    // Dashboard & Profile
    dashboardTitle: 'इकोसिस्टम डैशबोर्ड',
    welcomeBack: 'स्वागत है',
    profileOverview: 'प्रोफ़ाइल विवरण',
    accountDetails: 'खाता साख',
    securityOverview: 'सुरक्षा और सत्यापन',
    authProvider: 'लॉगिन विधि',
    userIdLabel: 'यूजर आईडी (UID)',
    phoneVerified: 'फ़ोन सत्यापित',
    emailVerified: 'ईमेल सत्यापित',
    notProvided: 'प्रदान नहीं किया गया',
    createdAt: 'पंजीकरण तिथि',
    lastLogin: 'अंतिम सक्रियता',
    connectedAccount: 'सक्रिय पहचान प्रदाता',
    activeSession: 'सक्रिय सुरक्षित सत्र',
    sessionSecure: 'फायरबेस टोकन द्वारा सुरक्षित',
    quickActions: 'त्वरित नेविगेशन',

    // Complete Profile & Security Page
    profileTitle: 'उपयोगकर्ता प्रोफ़ाइल और सेटिंग्स',
    personalInfo: 'व्यक्तिगत जानकारी',
    roleSpecificInfo: 'भूमिका-विशिष्ट जानकारी',
    accountInfo: 'खाता जानकारी',
    securityTitle: 'सुरक्षा और पहुंच',
    profilePhoto: 'प्रोफ़ाइल फोटो',
    changePhoto: 'फोटो बदलें',
    removePhoto: 'फोटो हटाएं',
    uploadingPhoto: 'फोटो अपलोड हो रही है...',
    photoUpdatedSuccess: 'प्रोफ़ाइल फोटो सफलतापूर्वक अपडेट हो गई।',
    saveChanges: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',
    savingProfile: 'प्रोफ़ाइल सहेजी जा रही है...',
    profileUpdatedSuccess: 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई।',
    emailVerifiedBadge: '✓ ईमेल सत्यापित',
    emailNotVerifiedBadge: '⚠ ईमेल असत्यापित',
    yourEmailNotVerified: 'आपका ईमेल सत्यापित नहीं है।',
    sendVerificationEmail: 'सत्यापन ईमेल भेजें',
    verificationEmailSent: 'सत्यापन ईमेल भेजा गया! अपना इनबॉक्स जांचें।',
    refreshStatus: 'स्थिति ताज़ा करें',
    phoneVerifiedBadge: '✓ फ़ोन सत्यापित',
    phoneNotVerifiedBadge: '⚠ फ़ोन असत्यापित',
    changePhoneWithOtp: 'ओटीपी द्वारा फ़ोन नंबर बदलें',
    changePassword: 'पासवर्ड बदलें',
    currentPassword: 'वर्तमान पासवर्ड',
    newPassword: 'नया पासवर्ड',
    confirmNewPassword: 'नए पासवर्ड की पुष्टि करें',
    changingPassword: 'पासवर्ड बदला जा रहा है...',
    passwordChangedSuccess: 'पासवर्ड सफलतापूर्वक बदल दिया गया!',
    passwordStrength: 'पासवर्ड मजबूती',
    weak: 'कमजोर',
    medium: 'मध्यम',
    strong: 'मजबूत',
    reauthRequired: 'कृपया संवेदनशील कार्य से पहले पुनः प्रमाणीकरण करें।',
    adminUsersMgmt: 'व्यवस्थापक उपयोगकर्ता प्रबंधन',

    // Role Specific Fields
    farmName: 'खेत / भूमि का नाम',
    farmLocation: 'खेत का स्थान / गाँव',
    farmSize: 'खेत का आकार (एकड़)',
    primaryCrops: 'मुख्य फसलें',
    orgName: 'संगठन / एफपीओ नाम',
    orgLocation: 'मुख्यालय स्थान',
    memberCount: 'किसान सदस्यों की संख्या',
    regNumber: 'एफपीओ पंजीकरण संख्या',
    businessName: 'व्यवसाय / फर्म का नाम',
    businessLocation: 'मंडी / बाज़ार स्थान',
    businessType: 'व्यापार का प्रकार',
    gstNumber: 'जीएसटी / व्यापार लाइसेंस',
    companyName: 'परिवहन / कंपनी का नाम',
    serviceLocation: 'परिचालन क्षेत्र',
    fleetSize: 'वाहनों की संख्या',
    vehicleTypes: 'वाहन के प्रकार',
    adminId: 'व्यवस्थापक पहचान',
    adminDepartment: 'विभाग',
    clearanceLevel: 'सुरक्षा स्तर',
  },
};
