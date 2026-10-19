import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reporterId: {
      type: String,
      required: true,
      index: true,
    },
    reporterName: {
      type: String,
      default: 'Farmer Member',
    },
    targetType: {
      type: String,
      default: 'post',
    },
    targetId: {
      type: String,
      required: true,
    },
    targetTitleOrSnippet: {
      type: String,
      default: '',
    },
    reason: {
      type: String,
      default: 'Misleading farming information',
    },
    details: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending Review', 'Resolved', 'Dismissed'],
      default: 'Pending Review',
    },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model('Report', reportSchema);
export default Report;
