import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lotId: {
      type: String,
      default: 'LOT-CUSTOM',
    },
    crop: {
      type: String,
      default: 'Produce',
    },
    quantity: {
      type: Number,
      default: 10,
    },
    unit: {
      type: String,
      default: 'Quintals',
    },
    farmerId: {
      type: String,
      required: true,
      index: true,
    },
    farmerName: {
      type: String,
      default: 'Farmer',
    },
    farmerPhone: {
      type: String,
      default: '',
    },
    buyerId: {
      type: String,
      required: true,
      index: true,
    },
    buyerName: {
      type: String,
      default: 'Buyer',
    },
    buyerCompany: {
      type: String,
      default: '',
    },
    agreedPrice: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      default: 'Offer Accepted',
      index: true,
    },
    transportId: {
      type: String,
      default: 'TRP-101',
    },
    transporterName: {
      type: String,
      default: 'Express Agro Logistics Fleet',
    },
    vehicleNumber: {
      type: String,
      default: 'TS 03 UA 5678',
    },
    vehicleType: {
      type: String,
      default: 'Eicher Pro 14ft (Insulated Crate Carrier)',
    },
    pickupLocation: {
      type: String,
      default: 'Farm Yard',
    },
    deliveryLocation: {
      type: String,
      default: 'Wholesale Processing Hub',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'escrow_locked', 'processing', 'completed', 'disputed'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: 'Direct UPI / Bank Transfer',
    },
    paymentType: {
      type: String,
      default: 'upi',
    },
    itemImageUrl: {
      type: String,
      default: '',
    },
    deliveryAddress: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    driverDetails: {
      name: { type: String, default: 'Ramu Yadav' },
      phone: { type: String, default: '+91 97001 88990' },
      avatar: { type: String, default: '' },
      rating: { type: Number, default: 4.9 },
      vehicleNumber: { type: String, default: 'TS 03 UA 5678' },
      vehicleType: { type: String, default: 'Eicher Pro 14ft' },
      currentLocationName: { type: String, default: 'Transit Corridor (12 km away)' },
      etaMinutes: { type: Number, default: 25 },
      distanceRemainingKm: { type: Number, default: 12.4 },
    },
    blockchainTxHash: {
      type: String,
      default: null,
    },
    blockNumber: {
      type: Number,
      default: null,
    },
    blockchainNetwork: {
      type: String,
      default: null,
    },
    upiUtrNumber: {
      type: String,
      default: null,
    },
    upiApp: {
      type: String,
      default: null,
    },
    bankUtrNumber: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = mongoose.model('Order', orderSchema);
export default Order;
