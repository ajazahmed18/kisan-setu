import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    lotId: {
      type: String,
      required: true,
      index: true,
    },
    crop: {
      type: String,
      default: 'Produce',
    },
    quantity: {
      type: Number,
      default: 1,
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
      default: 'Seller',
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
      default: 'Verified Agro Traders',
    },
    buyerVerified: {
      type: Boolean,
      default: true,
    },
    offerPricePerQuintal: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    counterPrice: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'counter_made'],
      default: 'pending',
      index: true,
    },
    note: {
      type: String,
      default: 'Direct purchase offer via KisanSetu payment.',
    },
  },
  {
    timestamps: true,
  }
);

export const Offer = mongoose.model('Offer', offerSchema);
export default Offer;
