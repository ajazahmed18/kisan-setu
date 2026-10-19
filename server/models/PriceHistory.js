import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    vegetableId: {
      type: String,
      required: true,
      index: true,
    },
    vegetableName: {
      type: String,
      required: true,
    },
    oldPrice: {
      type: Number,
      default: 0,
    },
    newPrice: {
      type: Number,
      required: true,
    },
    oldMinPrice: {
      type: Number,
      default: 0,
    },
    newMinPrice: {
      type: Number,
      default: 0,
    },
    oldMaxPrice: {
      type: Number,
      default: 0,
    },
    newMaxPrice: {
      type: Number,
      default: 0,
    },
    arrivalVolume: {
      type: Number,
      default: 0,
    },
    market: {
      type: String,
      default: 'Warangal APMC Enamamula Market',
    },
    changedBy: {
      type: String,
      default: 'Market Admin',
    },
    role: {
      type: String,
      default: 'market_admin',
    },
    notes: {
      type: String,
      default: '',
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString(),
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);
export default PriceHistory;
