import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  KisanPost,
  KisanComment,
  FarmerProfile,
  SavedKnowledgeCategory,
} from '../../types/community';
import {
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Calendar,
  Clock,
  Send,
  MoreHorizontal,
  Flag,
  Award,
  ExternalLink,
  Phone,
  ShieldCheck,
  Check,
  HelpCircle,
  Play,
  Volume2,
  VolumeX,
  Droplets,
  Sprout,
  ChevronDown,
  ChevronUp,
  Globe,
  Lock,
} from 'lucide-react';

interface KisanPostCardProps {
  post: KisanPost;
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  onLike: (postId: string) => void;
  onHelpful: (postId: string) => void;
  onAddComment: (postId: string, text: string, replyToCommentId?: string, replyToAuthorName?: string) => void;
  onHelpfulComment: (postId: string, commentId: string) => void;
  onMarkBestSolution: (postId: string, commentId: string) => void;
  onSavePost: (postId: string, category: SavedKnowledgeCategory) => void;
  onSharePost: (post: KisanPost) => void;
  onReportPost: (post: KisanPost) => void;
  onOpenProfile: (authorId: string) => void;
  onOpenChatWithFarmer?: (farmerId: string, farmerName: string, relatedPost?: KisanPost) => void;
  onTagClick?: (tag: string) => void;
  isSaved?: boolean;
}

export const KisanPostCard: React.FC<KisanPostCardProps> = ({
  post,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onLike,
  onHelpful,
  onAddComment,
  onHelpfulComment,
  onMarkBestSolution,
  onSavePost,
  onSharePost,
  onReportPost,
  onOpenProfile,
  onOpenChatWithFarmer,
  onTagClick,
  isSaved = false,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string } | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [showSaveMenu, setShowSaveMenu] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const isAuthor = post.authorId === currentUserId;
  const isLiked = post.likes?.includes(currentUserId);
  const isMarkedHelpful = post.helpfulUserIds?.includes(currentUserId);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(post.id, commentText.trim(), replyingTo?.id, replyingTo?.name);
    setCommentText('');
    setReplyingTo(null);
    setShowComments(true);
  };

  const getSeverityBadge = () => {
    switch (post.severity) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>Critical Alert (Urgent Help)</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>High Severity</span>
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">
            <span>Moderate Severity</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span>Low Severity</span>
          </span>
        );
    }
  };

  return (
    <article
      id={`post-${post.id}`}
      className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden ${
        post.postType === 'crop_problem'
          ? 'border-amber-200/80 bg-linear-to-b from-amber-50/20 to-white'
          : post.postType === 'field_update'
          ? 'border-emerald-200/80 bg-linear-to-b from-emerald-50/20 to-white'
          : 'border-slate-200'
      }`}
    >
      {/* Post Type Header Strip */}
      <div className="px-5 pt-3.5 pb-2 flex items-center justify-between gap-2 border-b border-slate-100/80 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {post.postType === 'crop_problem' && (
            <>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold bg-amber-600 text-white shadow-2xs">
                🐛 Crop Problem
              </span>
              {getSeverityBadge()}
              {post.status === 'resolved' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-bold bg-emerald-700 text-white shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Problem Resolved</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                  Needs Farmer Solutions
                </span>
              )}
            </>
          )}

          {post.postType === 'field_update' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold bg-emerald-700 text-white shadow-2xs">
              🌾 Field Update
            </span>
          )}

          {post.postType === 'farming_tip' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold bg-teal-700 text-white shadow-2xs">
              💡 Krishi Tip &amp; Technique
            </span>
          )}

          {post.postType === 'field_clip' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold bg-indigo-700 text-white shadow-2xs">
              🎥 Field Clip
            </span>
          )}

          {post.postType === 'harvest_update' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-bold bg-amber-700 text-white shadow-2xs">
              🚜 Harvest Update
            </span>
          )}

          {/* Visibility Badge */}
          {post.visibility === 'private' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200 text-[11px]">
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Private Note</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px]">
              <Globe className="w-3 h-3 text-emerald-600" />
              <span>Public</span>
            </span>
          )}

          {/* Crop Badge */}
          {post.crop && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-800 border border-slate-200">
              🌱 {post.crop}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">{post.createdAt}</span>
        </div>
      </div>

      {/* Author Header */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpenProfile(post.authorId)}
              className="relative shrink-0 group focus:outline-hidden"
              title="View Farmer Profile"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-lg overflow-hidden border-2 border-slate-100 shadow-xs group-hover:scale-105 transition-transform">
                {post.authorAvatar ? (
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{post.authorName.charAt(0)}</span>
                )}
              </div>
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => onOpenProfile(post.authorId)}
                  className="font-bold text-slate-900 hover:text-emerald-800 transition-colors text-base text-left"
                >
                  {post.authorName}
                </button>
                {post.authorReputation && (
                  <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                    {post.authorReputation}
                  </span>
                )}
              </div>

              {/* Profession Display on Post */}
              {post.authorProfession && (
                <p className="text-xs text-emerald-900 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-200/80">
                    {post.authorProfession}
                  </span>
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-700" />
                  <span>
                    {post.authorVillage ? `${post.authorVillage}, ` : ''}
                    {post.authorDistrict}, {post.authorState}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Chat & Options Actions */}
          <div className="flex items-center gap-1.5">
            {onOpenChatWithFarmer && post.authorId !== currentUserId && (
              <button
                type="button"
                id={`btn-post-dm-${post.id}`}
                onClick={() => onOpenChatWithFarmer(post.authorId, post.authorName, post)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer"
                title="Send Private Message / DM to this Farmer"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-100" />
                <span>DM / Msg</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onReportPost(post)}
              className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Report Post"
            >
              <Flag className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Agricultural Field Parameters (For Field Updates and Crop Problems) */}
        {(post.cropVariety || post.cropAgeDays || post.fieldStatus || post.irrigationCondition) && (
          <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            {post.cropVariety && (
              <div>
                <span className="text-[11px] text-slate-700 font-medium block">Variety</span>
                <strong className="text-slate-900 font-semibold truncate block">{post.cropVariety}</strong>
              </div>
            )}
            {post.cropAgeDays !== undefined && (
              <div>
                <span className="text-[11px] text-slate-700 font-medium block">Crop Age</span>
                <strong className="text-emerald-800 font-semibold">{post.cropAgeDays} Days Old</strong>
              </div>
            )}
            {post.fieldStatus && (
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-700 font-medium block">Field Stage</span>
                <strong className="text-slate-900 font-semibold truncate block">{post.fieldStatus}</strong>
              </div>
            )}
            {post.irrigationCondition && (
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-700 font-medium block">Irrigation</span>
                <strong className="text-teal-800 font-semibold truncate block">{post.irrigationCondition}</strong>
              </div>
            )}
          </div>
        )}

        {/* Post Title */}
        <h3 className="mt-3 text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {post.title}
        </h3>

        {/* Post Description / Content */}
        <p className="mt-2 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>

        {/* Hashtags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 flex-wrap">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onTagClick && onTagClick(tag)}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer bg-emerald-50/70 px-2 py-0.5 rounded-md"
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Media: Photos or Video Clips */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <div className="px-5 pb-3">
          {post.mediaUrls.length === 1 ? (
            <div
              className="relative rounded-xl overflow-hidden max-h-96 bg-slate-900 cursor-pointer group"
              onClick={() => setZoomedImage(post.mediaUrls[0])}
            >
              <img
                src={post.mediaUrls[0]}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300 max-h-96"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-[11px] rounded-md font-medium backdrop-blur-xs flex items-center gap-1">
                <span>Click to expand</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
              {post.mediaUrls.map((url, i) => (
                <div
                  key={i}
                  className="relative h-48 bg-slate-900 cursor-pointer group overflow-hidden rounded-lg"
                  onClick={() => setZoomedImage(url)}
                >
                  <img
                    src={url}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Video Player for Field Clips */}
      {post.videoUrl && (
        <div className="px-5 pb-3">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video max-h-96 flex items-center justify-center">
            <video
              src={post.videoUrl}
              controls
              poster={post.thumbnailUrl || (post.mediaUrls && post.mediaUrls[0])}
              className="w-full h-full object-contain max-h-96"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}

      {/* Best Solution Highlight Box (If Resolved) */}
      {post.status === 'resolved' && post.comments && (
        <div className="mx-5 mb-4 p-4 rounded-xl bg-emerald-50/90 border-2 border-emerald-300 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 font-bold text-emerald-950 text-sm">
              <Award className="w-4 h-4 text-amber-600" />
              <span>🏆 Best Solution Marked by Farmer Author</span>
            </span>
            <span className="bg-emerald-200/60 text-emerald-900 font-bold px-2 py-0.5 rounded text-[10px]">
              Verified by Community
            </span>
          </div>
          {(() => {
            const bestComment = post.comments.find(
              (c) => c.isBestSolution || c.id === post.bestSolutionCommentId
            ) || post.comments[0];
            return bestComment ? (
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <strong className="text-slate-900 font-bold">{bestComment.authorName}</strong>
                  <span className="text-slate-500 text-[11px]">{bestComment.authorLocation}</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium bg-white/70 p-2.5 rounded-lg border border-emerald-200">
                  {bestComment.text}
                </p>
              </div>
            ) : null;
          })()}
        </div>
      )}

      {/* Action Bar */}
      <div className="px-5 py-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Appreciate / Like with Bouncy Heart Animation */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.04 }}
            type="button"
            onClick={() => onLike(post.id)}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLiked
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Appreciate Post"
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.35, 0.95, 1] } : { scale: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-600 text-rose-600' : ''}`} />
            </motion.div>
            <span>{isLiked ? 'Appreciated' : 'Appreciate'}</span>
            <span className="ml-0.5 font-mono text-[11px]">({post.likes?.length || 0})</span>
          </motion.button>

          {/* Helpful Vote with Subtle Spring */}
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.03 }}
            type="button"
            onClick={() => onHelpful(post.id)}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isMarkedHelpful
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="Mark as Helpful Farming Experience"
          >
            <CheckCircle2 className={`w-4 h-4 ${isMarkedHelpful ? 'text-emerald-700' : ''}`} />
            <span className="hidden sm:inline">{isMarkedHelpful ? 'Helpful' : 'Mark Helpful'}</span>
            <span className="sm:hidden">Helpful</span>
            <span className="font-mono text-[11px]">({post.helpfulCount || 0})</span>
          </motion.button>

          {/* Comments Discussion Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.03 }}
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showComments
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline">Discussions</span>
            <span className="sm:hidden">Reply</span>
            <span className="font-mono text-[11px]">({post.comments?.length || 0})</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-1 relative">
          {/* Share */}
          <button
            type="button"
            onClick={() => onSharePost(post)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            title="Share to Kisan Community or WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline font-semibold text-xs">Share</span>
          </button>

          {/* Save to Knowledge Library */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSaveMenu(!showSaveMenu)}
              className={`p-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 ${
                isSaved
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Save to My Saved Knowledge"
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 text-amber-700 fill-amber-700" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
              <span className="hidden md:inline font-semibold text-xs">
                {isSaved ? 'Saved' : 'Save'}
              </span>
            </button>

            {/* Folder Selection Menu */}
            {showSaveMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-30 text-xs">
                <p className="font-bold text-slate-900 px-2.5 py-1 text-[11px] uppercase tracking-wide border-b border-slate-100 mb-1">
                  Save to Knowledge Folder
                </p>
                {(
                  [
                    'Crop Solutions',
                    'Farming Tips',
                    'Pest Solutions',
                    'Machinery',
                    'Irrigation',
                    'Other',
                  ] as SavedKnowledgeCategory[]
                ).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      onSavePost(post.id, cat);
                      setShowSaveMenu(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 font-medium transition-colors flex items-center justify-between"
                  >
                    <span>{cat}</span>
                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discussion & Solution Comments Section */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-5 bg-slate-50/90 border-t border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Farming Discussions &amp; Peer Solutions ({post.comments?.length || 0})</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Only verified farmers &amp; officers contribute
                </span>
              </div>

          {/* Comments List */}
          {post.comments && post.comments.length > 0 ? (
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div
                  key={comment.id}
                  id={`comment-${comment.id}`}
                  className={`p-3.5 rounded-xl border transition-colors ${
                    comment.isBestSolution
                      ? 'bg-emerald-50/90 border-emerald-300 shadow-2xs'
                      : 'bg-white border-slate-200/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center text-xs overflow-hidden shrink-0">
                        {comment.authorAvatar ? (
                          <img
                            src={comment.authorAvatar}
                            alt={comment.authorName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span>{comment.authorName.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <strong className="text-xs font-bold text-slate-900">
                            {comment.authorName}
                          </strong>
                          {comment.authorReputation && (
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                              {comment.authorReputation}
                            </span>
                          )}
                          {comment.isBestSolution && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.2 rounded-full">
                              <Award className="w-3 h-3 text-amber-600" />
                              <span>🏆 Best Solution</span>
                            </span>
                          )}
                        </div>
                        {comment.authorProfession && (
                          <div className="text-[10px] text-emerald-800 font-medium">
                            {comment.authorProfession}
                          </div>
                        )}
                        <span className="text-[11px] text-slate-500 block">
                          {comment.authorLocation} • {comment.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {onOpenChatWithFarmer && comment.authorId !== currentUserId && (
                        <button
                          type="button"
                          onClick={() => onOpenChatWithFarmer(comment.authorId, comment.authorName, post)}
                          className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg text-[10px] font-semibold flex items-center gap-0.5 cursor-pointer"
                          title={`Send Private DM to ${comment.authorName}`}
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-700" />
                          <span>DM</span>
                        </button>
                      )}

                      {/* Best Solution Action (Only author can mark) */}
                      {isAuthor && post.postType === 'crop_problem' && (
                        <button
                          type="button"
                          onClick={() => onMarkBestSolution(post.id, comment.id)}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                            comment.isBestSolution
                              ? 'bg-amber-500 text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200'
                          }`}
                          title={comment.isBestSolution ? 'Unmark Best Solution' : 'Mark as Best Solution'}
                        >
                          <Award className="w-3 h-3" />
                          <span>{comment.isBestSolution ? 'Best Solution' : 'Select as Best'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {comment.replyToAuthorName && (
                    <div className="mt-1 text-[11px] text-emerald-800 font-semibold">
                      Replying to @{comment.replyToAuthorName}
                    </div>
                  )}

                  {/* Comment Body */}
                  <p className="mt-2 text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {comment.text}
                  </p>

                  {/* Comment Helpful Vote and Reply trigger */}
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <button
                      type="button"
                      onClick={() => onHelpfulComment(post.id, comment.id)}
                      className={`font-semibold hover:text-emerald-700 flex items-center gap-1 cursor-pointer ${
                        comment.helpfulUserIds?.includes(currentUserId)
                          ? 'text-emerald-700 font-bold'
                          : ''
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Helpful ({comment.helpfulCount || 0})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo({ id: comment.id, name: comment.authorName });
                      }}
                      className="font-semibold text-emerald-700 hover:underline cursor-pointer"
                    >
                      Reply to this farmer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2 text-center">
              No replies yet. Be the first fellow farmer to share advice or experience!
            </p>
          )}

          {/* Add Comment Input Form */}
          <form onSubmit={handleCommentSubmit} className="mt-3 pt-3 border-t border-slate-200">
            {replyingTo && (
              <div className="flex items-center justify-between bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-lg text-xs mb-2 border border-emerald-200">
                <span>Replying to <strong>@{replyingTo.name}</strong></span>
                <button
                  type="button"
                  onClick={() => setReplyingTo(null)}
                  className="text-emerald-700 hover:text-emerald-900 font-bold"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white font-bold flex items-center justify-center text-xs overflow-hidden shrink-0 mt-1">
                {currentUserAvatar ? (
                  <img src={currentUserAvatar} alt={currentUserName} className="w-full h-full object-cover" />
                ) : (
                  <span>{currentUserName.charAt(0)}</span>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={
                    post.postType === 'crop_problem'
                      ? 'Share your agricultural remedy, spray dosage, or experience...'
                      : 'Share your feedback, question, or tips...'
                  }
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    💡 Tip: Mention exact dosage (e.g. 2ml/L) and timing.
                  </span>
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Solution</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

      {/* Lightbox / Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-black rounded-2xl overflow-hidden">
            <img
              src={zoomedImage}
              alt="Zoomed field view"
              className="w-full h-full object-contain max-h-[85vh]"
              referrerPolicy="no-referrer"
            />
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute top-3 right-3 px-3 py-1.5 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
