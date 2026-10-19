import mongoose from 'mongoose';

const vegetableSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    nameHi: {
      type: String,
      default: '',
    },
    nameTe: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Fruit Vegetable',
      index: true,
    },
    unit: {
      type: String,
      default: 'kg',
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    previousPrice: {
      type: Number,
      default: 0,
    },
    minPrice: {
      type: Number,
      default: 0,
    },
    maxPrice: {
      type: Number,
      default: 0,
    },
    market: {
      type: String,
      default: 'Warangal APMC Enamamula Market',
      index: true,
    },
    location: {
      type: String,
      default: 'Warangal, Telangana',
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    priceDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    arrivalVolume: {
      type: Number,
      default: 300,
    },
    grade: {
      type: String,
      default: 'Grade A',
    },
    status: {
      type: String,
      default: 'Active',
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Vegetable = mongoose.model('Vegetable', vegetableSchema);
export default Vegetable;
