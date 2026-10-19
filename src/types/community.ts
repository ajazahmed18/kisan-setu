import { UserRole } from '../types';

export type KisanPostType =
  | 'field_update'
  | 'crop_problem'
  | 'farming_tip'
  | 'harvest_update'
  | 'field_clip'
  | 'machinery'
  | 'general';

export type ProblemSeverity = 'low' | 'medium' | 'high' | 'critical';
export type CropProblemSeverity = ProblemSeverity;
export type ProblemCategory = string;
export type KisanMessage = KisanChatMessage;

export type FarmingType =
  | 'Organic Farming'
  | 'Natural Farming (ZBNF)'
  | 'Commercial / Modern'
  | 'Drip-Irrigated'
  | 'Rainfed Traditional'
  | 'Mixed Farming';

export type ReputationBadge =
  | '🌱 New Farmer'
  | '🌾 Active Farmer'
  | '🚜 Experienced Farmer'
  | '🏆 Farming Helper'
  | '🌟 Community Expert';

export interface FarmerProfile {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  village: string;
  district: string;
  state: string;
  farmingExperienceYears: number;
  mainCrops: string[];
  farmSizeAcres: number;
  farmingType: FarmingType;
  bio: string;
  totalPosts: number;
  followersCount: number;
  followingCount: number;
  helpfulAnswersCount: number;
  bestSolutionsCount: number;
  reputationScore: number;
  reputationBadge: ReputationBadge;
  isVerified?: boolean;
  isFollowing?: boolean;
  role: UserRole;
  profession?: string;
  joinedDate: string;
}

export interface KisanComment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  authorLocation: string;
  authorProfession?: string;
  authorReputation?: ReputationBadge;
  text: string;
  photoUrl?: string;
  createdAt: string;
  helpfulCount: number;
  helpfulUserIds: string[];
  isBestSolution?: boolean;
  replyToCommentId?: string;
  replyToAuthorName?: string;
}

export interface KisanPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorAvatar?: string;
  authorVillage?: string;
  authorDistrict: string;
  authorState: string;
  authorProfession?: string;
  authorReputation?: ReputationBadge;
  postType: KisanPostType;
  crop: string;
  cropVariety?: string;
  cropAgeDays?: number;
  fieldStatus?: string;
  irrigationCondition?: string;
  problemCategory?: string;
  severity?: ProblemSeverity;
  visibility?: 'public' | 'private';
  title: string;
  content: string;
  mediaUrls: string[];
  videoUrl?: string;
  thumbnailUrl?: string;
  isFieldClip?: boolean;
  location: string;
  tags: string[];
  likes: string[]; // user IDs
  helpfulCount: number;
  helpfulUserIds: string[];
  savesCount: number;
  sharesCount: number;
  commentsCount: number;
  status?: 'open' | 'resolved';
  bestSolutionCommentId?: string;
  createdAt: string;
  comments: KisanComment[];
  originalPost?: {
    id: string;
    authorName: string;
    authorDistrict?: string;
    title: string;
    content: string;
    mediaUrl?: string;
  };
}

export interface KisanChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderProfession?: string;
  recipientId: string;
  recipientName: string;
  recipientProfession?: string;
  text: string;
  photoUrl?: string;
  cropProblemTag?: string;
  sharedPost?: {
    id: string;
    title: string;
    crop: string;
    authorName: string;
    imageUrl?: string;
  };
  createdAt: string;
  isRead: boolean;
}

export interface KisanConversation {
  partnerId: string;
  partnerName: string;
  partnerAvatar?: string;
  partnerLocation: string;
  partnerProfession?: string;
  partnerRole: UserRole;
  partnerCrops: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface KisanNotification {
  id: string;
  userId: string;
  actorId: string;
  actorName: string;
  actorAvatar?: string;
  type:
    | 'comment'
    | 'helpful'
    | 'follow'
    | 'problem_solution'
    | 'best_solution'
    | 'share'
    | 'district_joined';
  title: string;
  message: string;
  targetPostId?: string;
  isRead: boolean;
  createdAt: string;
}

export type SavedKnowledgeCategory =
  | 'Crop Solutions'
  | 'Farming Tips'
  | 'Pest Solutions'
  | 'Machinery'
  | 'Irrigation'
  | 'Other';

export interface SavedKnowledgeItem {
  id: string;
  userId: string;
  postId: string;
  category: SavedKnowledgeCategory;
  savedAt: string;
  post: KisanPost;
  personalNotes?: string;
}

export interface ReportPayload {
  id?: string;
  reporterId: string;
  reporterName: string;
  targetType: 'post' | 'user' | 'comment';
  targetId: string;
  targetTitleOrSnippet: string;
  reason:
    | 'Spam'
    | 'Fake information'
    | 'Harassment'
    | 'Scam'
    | 'Inappropriate content'
    | 'Misleading farming information';
  details?: string;
  createdAt?: string;
}
