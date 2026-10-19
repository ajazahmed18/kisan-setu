import mongoose from 'mongoose';

const cropLotSchema = new mongoose.Schema(
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
      default: 'Farmer',
    },
    farmerPhone: {
      type: String,
      default: '',
    },
    crop: {
      type: String,
      required: true,
      index: true,
    },
    variety: {
      type: String,
      default: 'Hybrid',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unit: {
      type: String,
      default: 'Quintals',
    },
    grade: {
      type: String,
      default: 'A',
    },
    moisture: {
      type: Number,
      default: 10,
    },
    harvestDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    expectedPrice: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      default: 'Telangana',
    },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
    },
    availabilityDate: {
      type: String,
      default: 'Immediate',
    },
    status: {
      type: String,
      enum: ['available', 'negotiating', 'sold', 'archived'],
      default: 'available',
      index: true,
    },
    physicalQualityCheckedByFPO: {
      type: Boolean,
      default: false,
    },
    isBulkLot: {
      type: Boolean,
      default: false,
    },
    aggregatedFrom: {
      type: [String],
      default: [],
    },
    bankDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const CropLot = mongoose.model('CropLot', cropLotSchema);
export default CropLot;
