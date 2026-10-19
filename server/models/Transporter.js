import mongoose from 'mongoose';

const transporterSchema = new mongoose.Schema(
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
    contact: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    completedTrips: {
      type: Number,
      default: 100,
    },
    vehicleType: {
      type: String,
      default: 'Eicher 14ft',
    },
    capacityTons: {
      type: Number,
      default: 5,
    },
    ratePerKm: {
      type: Number,
      default: 25,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    currentLocation: {
      type: String,
      default: 'Warangal',
    },
    liveGps: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const Transporter = mongoose.model('Transporter', transporterSchema);
export default Transporter;
