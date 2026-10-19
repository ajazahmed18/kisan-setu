import mongoose from 'mongoose';

const communityMessageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    senderId: {
      type: String,
      required: true,
      index: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderAvatar: {
      type: String,
      default: '',
    },
    recipientId: {
      type: String,
      required: true,
      index: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: '',
    },
    photoUrl: {
      type: String,
      default: null,
    },
    cropProblemTag: {
      type: String,
      default: null,
    },
    sharedPost: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
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

export const CommunityMessage = mongoose.model('CommunityMessage', communityMessageSchema);
export default CommunityMessage;
