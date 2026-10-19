import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    uid: {
      type: String,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    displayName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      select: false,
    },
    phone: {
      type: String,
      default: '',
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['farmer', 'fpo', 'buyer', 'transporter', 'market', 'market_admin', 'admin'],
      default: 'farmer',
      index: true,
    },
    photoUrl: {
      type: String,
      default: null,
    },
    photoURL: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: 'Warangal, Telangana',
    },
    address: {
      type: String,
      default: '',
    },
    pincode: {
      type: String,
      default: '',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['online', 'offline'],
      default: 'online',
    },
    lastActive: {
      type: String,
      default: () => new Date().toISOString(),
    },
    lastLoginAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
    // Farmer specific
    farmName: { type: String, default: '' },
    farmLocation: { type: String, default: '' },
    farmSize: { type: String, default: '' },
    primaryCrops: { type: String, default: '' },
    secondaryCrops: { type: String, default: '' },
    farmingType: { type: String, default: '' },
    irrigationType: { type: String, default: '' },
    soilType: { type: String, default: '' },
    experienceYears: { type: String, default: '' },
    // FPO specific
    orgName: { type: String, default: '' },
    orgLocation: { type: String, default: '' },
    memberCount: { type: String, default: '' },
    regNumber: { type: String, default: '' },
    storageCapacity: { type: String, default: '' },
    keyCommodities: { type: String, default: '' },
    // Buyer specific
    businessName: { type: String, default: '' },
    businessLocation: { type: String, default: '' },
    businessType: { type: String, default: '' },
    gstNumber: { type: String, default: '' },
    cropPurchase: { type: String, default: '' },
    paymentTerms: { type: String, default: '' },
    // Transporter specific
    companyName: { type: String, default: '' },
    serviceLocation: { type: String, default: '' },
    fleetSize: { type: String, default: '' },
    vehicleType: { type: String, default: '' },
    vehicleNumber: { type: String, default: '' },
    serviceArea: { type: String, default: '' },
    capacityTons: { type: String, default: '' },
    // Admin specific
    adminId: { type: String, default: '' },
    adminDepartment: { type: String, default: '' },
    clearanceLevel: { type: String, default: '' },
    // KYC and Bank Details
    panCard: { type: String, default: '' },
    aadharNumber: { type: String, default: '' },
    kccNumber: { type: String, default: '' },
    soilHealthCardId: { type: String, default: '' },
    bankDetails: {
      bankName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      accountHolderName: { type: String, default: '' },
      upiId: { type: String, default: '' },
      paytmNumber: { type: String, default: '' },
    },
    // Settings & Preferences
    preferredLanguage: {
      type: String,
      enum: ['en', 'te', 'hi'],
      default: 'en',
    },
    settings: {
      smsAlerts: { type: Boolean, default: true },
      whatsappUpdates: { type: Boolean, default: true },
      mandiPriceAlerts: { type: Boolean, default: true },
      weatherWarnings: { type: Boolean, default: true },
      voiceGuidance: { type: Boolean, default: true },
      audioAssistance: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Sync uid with id
userSchema.pre('validate', function () {
  if (!this.id && this.uid) this.id = this.uid;
  if (!this.uid && this.id) this.uid = this.id;
  if (!this.displayName && this.name) this.displayName = this.name;
  if (!this.name && this.displayName) this.name = this.displayName;
  if (!this.photoURL && this.photoUrl) this.photoURL = this.photoUrl;
  if (!this.photoUrl && this.photoURL) this.photoUrl = this.photoURL;
  if (!this.phoneNumber && this.phone) this.phoneNumber = this.phone;
  if (!this.phone && this.phoneNumber) this.phone = this.phoneNumber;
});

export const User = mongoose.model('User', userSchema);
export default User;
