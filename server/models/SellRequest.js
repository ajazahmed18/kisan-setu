import mongoose from 'mongoose';

const sellRequestSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    farmerId: {
      type: String,
      required: true,
      index: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    farmerPhone: {
      type: String,
      default: '',
    },
    farmerLocation: {
      type: String,
      default: '',
    },
    cropName: {
      type: String,
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      default: 'Quintals',
    },
    grade: {
      type: String,
      default: 'A',
    },
    expectedPricePerQuintal: {
      type: Number,
      required: true,
    },
    totalExpectedAmount: {
      type: Number,
      required: true,
    },
    fpoCommissionPct: {
      type: Number,
      default: 1.5,
    },
    fpoCommissionAmount: {
      type: Number,
      default: 0,
    },
    kisanSetuFeeAmount: {
      type: Number,
      default: 0,
    },
    netFarmerPayable: {
      type: Number,
      default: 0,
    },
    fpoOfficerId: {
      type: String,
      default: 'FPO-WAR-01',
      index: true,
    },
    fpoOfficerName: {
      type: String,
      default: 'Sri Krishna Rao',
    },
    fpoName: {
      type: String,
      default: 'Warangal Progressive Farmers Producer Co.',
    },
    status: {
      type: String,
      enum: ['pending_review', 'quality_approved', 'aggregated', 'buyer_matched', 'payout_settled', 'rejected'],
      default: 'pending_review',
      index: true,
    },
    qualityNotes: {
      type: String,
      default: '',
    },
    assignedLotId: {
      type: String,
      default: null,
    },
    assignedOrderId: {
      type: String,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'escrow_funded', 'payout_released'],
      default: 'unpaid',
    },
    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true,
  }
);

export const SellRequest = mongoose.model('SellRequest', sellRequestSchema);
export default SellRequest;
