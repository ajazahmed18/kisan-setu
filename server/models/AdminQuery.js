import mongoose from 'mongoose';

const adminQuerySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Sender name is required'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Sender email is required'],
      lowercase: true,
      trim: true,
      maxlength: 150,
      index: true,
    },
    phone: {
      type: String,
      default: '',
      trim: true,
      maxlength: 25,
    },
    role: {
      type: String,
      default: 'farmer',
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'General Inquiry',
        'Crop & Quality Query',
        'Price & Mandi Dispute',
        'Account & Verification',
        'Transport & Logistics',
        'Technical Support',
        'Other',
      ],
      default: 'General Inquiry',
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: 3000,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending',
      index: true,
    },
    adminNotes: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const AdminQuery = mongoose.model('AdminQuery', adminQuerySchema);
export default AdminQuery;
