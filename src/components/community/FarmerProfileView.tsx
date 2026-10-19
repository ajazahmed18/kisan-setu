import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FarmerProfile, KisanPost, SavedKnowledgeCategory } from '../../types/community';
import { KisanPostCard } from './KisanPostCard';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Award,
  Sprout,
  Users,
  CheckCircle2,
  Trophy,
  MessageSquare,
  UserPlus,
  UserCheck,
  Edit3,
  Save,
  Phone,
  Layers,
  Sparkles,
  Plus,
  HelpCircle,
  Share2,
  TrendingUp,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface FarmerProfileViewProps {
  farmer: FarmerProfile;
  allFarmers?: FarmerProfile[];
  posts: KisanPost[];
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  onBackToFeed: () => void;
  onSelectFarmer: (farmerId: string) => void;
  onToggleFollow: (farmerId: string) => void;
  onLikePost: (postId: string) => void;
  onHelpfulPost: (postId: string) => void;
  onAddComment: (
    postId: string,
    text: string,
    replyToCommentId?: string,
    replyToAuthorName?: string
  ) => void;
  onHelpfulComment: (postId: string, commentId: string) => void;
  onMarkBestSolution: (postId: string, commentId: string) => void;
  onSavePost: (postId: string, category: SavedKnowledgeCategory) => void;
  onSharePost: (post: KisanPost) => void;
  onReportPost: (post: KisanPost) => void;
  onUpdateProfile?: (updated: Partial<FarmerProfile>) => void;
  onCreatePost: () => void;
  savedPosts?: { postId: string; category: SavedKnowledgeCategory }[];
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  farmer,
  allFarmers = [],
  posts,
  currentUserId,
  currentUserName,
  currentUserAvatar,
  onBackToFeed,
  onSelectFarmer,
  onToggleFollow,
  onLikePost,
  onHelpfulPost,
  onAddComment,
  onHelpfulComment,
  onMarkBestSolution,
  onSavePost,
  onSharePost,
  onReportPost,
  onUpdateProfile,
  onCreatePost,
  savedPosts = [],
}) => {
  const isOwnProfile = farmer.id === currentUserId;
  const isFollowing = farmer.isFollowing;

  // Inline profile edit state
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(farmer.name);
  const [village, setVillage] = useState(farmer.village);
  const [district, setDistrict] = useState(farmer.district);
  const [state, setState] = useState(farmer.state);
  const [farmingExperienceYears, setFarmingExperienceYears] = useState(
    String(farmer.farmingExperienceYears || 10)
  );
  const [farmSizeAcres, setFarmSizeAcres] = useState(String(farmer.farmSizeAcres || 5));
  const [farmingType, setFarmingType] = useState(farmer.farmingType || 'Commercial / Modern');
  const [bio, setBio] = useState(farmer.bio || '');
  const [mainCropsStr, setMainCropsStr] = useState(farmer.mainCrops.join(', '));
  const [profession, setProfession] = useState(farmer.profession || '');

  // Filter posts uploaded by this specific farmer
  const farmerPosts = posts.filter((p) => p.authorId === farmer.id);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateProfile) return;

    const crops = mainCropsStr
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    onUpdateProfile({
      name,
      profession,
      village,
      district,
      state,
      farmingExperienceYears: Number(farmingExperienceYears) || 5,
      farmSizeAcres: Number(farmSizeAcres) || 4,
      farmingType: farmingType as any,
      bio,
      mainCrops: crops.length > 0 ? crops : farmer.mainCrops,
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      {/* Top Navigation & Farmer Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <button
          type="button"
          onClick={onBackToFeed}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-xl transition-all cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Community Feed</span>
        </button>

        {/* Quick Farmer Profile Switcher */}
        {allFarmers.length > 1 && (
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold pb-1 sm:pb-0 no-scrollbar">
            <span className="text-slate-400 font-bold text-[11px] whitespace-nowrap pl-1">
              Profiles:
            </span>
            {allFarmers.slice(0, 5).map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => onSelectFarmer(f.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  f.id === farmer.id
                    ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{f.name.split(' ')[0]}</span>
                {f.id === currentUserId && (
                  <span className="text-[10px] opacity-80">(You)</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Farmer Profile Card (Top) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Header Banner */}
        <div className="h-32 sm:h-36 bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 relative">
          <div className="absolute inset-0 bg-pattern opacity-15" />
          <div className="absolute bottom-3 right-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-black/40 backdrop-blur-xs text-white text-[11px] font-bold rounded-xl border border-white/10 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{farmer.district}, {farmer.state}</span>
            </span>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-5 sm:p-7 relative -mt-14 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Avatar & Identifiers */}
            <div className="flex items-end gap-4">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white p-1.5 shadow-md shrink-0 border border-slate-100">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-extrabold flex items-center justify-center text-3xl overflow-hidden">
                  {farmer.avatar ? (
                    <img
                      src={farmer.avatar}
                      alt={farmer.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{farmer.name.charAt(0)}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {farmer.name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Verified Kisan</span>
                  </span>
                  {farmer.reputationBadge && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-300">
                      {farmer.reputationBadge}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-emerald-800">
                  {farmer.profession || '🌾 Dedicated Farmer & Cultivator'}
                </p>

                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <span>{farmer.village ? `${farmer.village}, ` : ''}{farmer.district}, {farmer.state}</span>
                  <span>•</span>
                  <span>Member since {farmer.joinedDate || '2023'}</span>
                </p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              {isOwnProfile ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(!isEditing)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={onCreatePost}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Upload Post</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => onToggleFollow(farmer.id)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    isFollowing
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>+ Follow Farmer</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Inline Edit Form (If editing) */}
          {isEditing && (
            <form
              onSubmit={handleSaveEdit}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4"
            >
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-700" />
                <span>Edit Farm Profile Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Specialty / Title</label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g. Cotton & Chilli Cultivator"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Village</label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Farming Experience (Years)</label>
                  <input
                    type="number"
                    value={farmingExperienceYears}
                    onChange={(e) => setFarmingExperienceYears(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Farm Land Size (Acres)</label>
                  <input
                    type="number"
                    value={farmSizeAcres}
                    onChange={(e) => setFarmSizeAcres(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">
                    Main Crops (comma separated)
                  </label>
                  <input
                    type="text"
                    value={mainCropsStr}
                    onChange={(e) => setMainCropsStr(e.target.value)}
                    placeholder="Cotton, Red Chilli, Rice (Paddy)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">About / Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl text-xs border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          )}

          {/* Bio statement */}
          {farmer.bio && (
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              "{farmer.bio}"
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
              <span className="text-[11px] font-bold text-emerald-800 block">Uploaded Posts</span>
              <strong className="text-xl font-extrabold text-slate-900">{farmerPosts.length}</strong>
            </div>

            <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-100 text-center">
              <span className="text-[11px] font-bold text-teal-800 block">Helpful Solutions</span>
              <strong className="text-xl font-extrabold text-slate-900">
                {farmer.bestSolutionsCount || 14}
              </strong>
            </div>

            <div className="p-3.5 bg-amber-50/60 rounded-2xl border border-amber-100 text-center">
              <span className="text-[11px] font-bold text-amber-800 block">Reputation Points</span>
              <strong className="text-xl font-extrabold text-amber-700">
                {farmer.reputationScore || 385} pts
              </strong>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-center">
              <span className="text-[11px] font-bold text-slate-600 block">Followers</span>
              <strong className="text-xl font-extrabold text-slate-900">
                {farmer.followersCount || 142}
              </strong>
            </div>
          </div>

          {/* Farm Specs Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Main Crops</span>
                <span className="font-bold text-slate-900 truncate block">
                  {farmer.mainCrops.join(', ')}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Land Size &amp; Type</span>
                <span className="font-bold text-slate-900 truncate block">
                  {farmer.farmSizeAcres} Acres • {farmer.farmingType || 'Drip-Irrigated'}
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-slate-200/90 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Farming Practice</span>
                <span className="font-bold text-slate-900 truncate block">
                  {farmer.farmingExperienceYears} Years Experience
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* "WHERE DOWN SIDE THE PROFILE HIS UPLOADED POSTS" */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-700" />
              <span>Uploaded Posts by {farmer.name}</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              {farmerPosts.length} {farmerPosts.length === 1 ? 'Post' : 'Posts'}
            </span>
          </div>

          {isOwnProfile && (
            <button
              type="button"
              onClick={onCreatePost}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Post</span>
            </button>
          )}
        </div>

        {/* Uploaded Posts List */}
        {farmerPosts.length > 0 ? (
          <div className="space-y-4">
            {farmerPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.05, 0.2) }}
              >
                <KisanPostCard
                  post={post}
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                  currentUserAvatar={currentUserAvatar}
                  onLike={onLikePost}
                  onHelpful={onHelpfulPost}
                  onAddComment={onAddComment}
                  onHelpfulComment={onHelpfulComment}
                  onMarkBestSolution={onMarkBestSolution}
                  onSavePost={onSavePost}
                  onSharePost={onSharePost}
                  onReportPost={onReportPost}
                  onOpenProfile={onSelectFarmer}
                  isSaved={savedPosts.some((s) => s.postId === post.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
            <Sprout className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-base">
              No Posts Uploaded Yet
            </h4>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              {isOwnProfile
                ? 'You have not uploaded any community posts yet. Share your crop updates, experiences, or questions!'
                : `${farmer.name} has not shared any public updates yet.`}
            </p>
            {isOwnProfile && (
              <button
                type="button"
                onClick={onCreatePost}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer transition-colors"
              >
                + Upload Your First Post
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
