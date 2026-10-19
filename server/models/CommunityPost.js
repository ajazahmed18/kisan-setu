import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    authorId: {
      type: String,
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorAvatar: {
      type: String,
      default: '',
    },
    authorLocation: {
      type: String,
      default: 'Telangana',
    },
    authorRole: {
      type: String,
      default: 'farmer',
    },
    title: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true,
    },
    cropTag: {
      type: String,
      default: 'General Agriculture',
      index: true,
    },
    postType: {
      type: String,
      enum: ['discussion', 'pest_alert', 'price_intel', 'field_clip', 'success_story', 'question'],
      default: 'discussion',
      index: true,
    },
    isFieldClip: {
      type: Boolean,
      default: false,
    },
    videoUrl: {
      type: String,
      default: null,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: {
      type: [String],
      default: [],
    },
    savedBy: {
      type: [String],
      default: [],
    },
    comments: [
      {
        id: String,
        authorId: String,
        authorName: String,
        authorAvatar: String,
        authorRole: String,
        text: String,
        createdAt: String,
        isVerifiedAnswer: Boolean,
      },
    ],
    verifiedSolutionCount: {
      type: Number,
      default: 0,
    },
    sharesCount: {
      type: Number,
      default: 0,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);
export default CommunityPost;
