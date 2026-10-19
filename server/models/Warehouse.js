import mongoose from 'mongoose';

const warehouseSchema = new mongoose.Schema(
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
    },
    location: {
      type: String,
      default: 'Warangal',
    },
    capacityQuintals: {
      type: Number,
      default: 5000,
    },
    availableSpaceQuintals: {
      type: Number,
      default: 2500,
    },
    ratePerQuintalMonth: {
      type: Number,
      default: 45,
    },
    coldStorage: {
      type: Boolean,
      default: false,
    },
    wdraAccredited: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      default: '+91 98480 12345',
    },
  },
  {
    timestamps: true,
  }
);

export const Warehouse = mongoose.model('Warehouse', warehouseSchema);
export default Warehouse;
