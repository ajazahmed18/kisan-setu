import React, { useState } from 'react';
import { FarmerProfile, KisanPost } from '../../types/community';
import {
  X,
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
  ExternalLink,
} from 'lucide-react';

interface FarmerProfileModalProps {
  farmer: FarmerProfile;
  posts: KisanPost[];
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
  onToggleFollow: (farmerId: string) => void;
  onOpenChat: (farmerId: string, farmerName: string) => void;
  onUpdateProfile?: (updated: Partial<FarmerProfile>) => void;
  onOpenPost?: (postId: string) => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  farmer,
  posts,
  isOpen,
  onClose,
  currentUserId,
  onToggleFollow,
  onOpenChat,
  onUpdateProfile,
  onOpenPost,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'crops' | 'about'>('posts');
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
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
  const [avatar, setAvatar] = useState(farmer.avatar || '');
  const [phone, setPhone] = useState(farmer.phone || '');
  const [profession, setProfession] = useState(farmer.profession || '');

  if (!isOpen) return null;

  const isOwnProfile = farmer.id === currentUserId;
  const isFollowing = farmer.isFollowing;

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
      farmingType,
      bio,
      mainCrops: crops.length > 0 ? crops : farmer.mainCrops,
      avatar,
      phone,
    });
    setIsEditing(false);
  };

  const getReputationBadgeColor = (badge: string) => {
    if (badge.includes('Expert')) return 'bg-amber-100 text-amber-900 border-amber-300';
    if (badge.includes('Helper')) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (badge.includes('Experienced')) return 'bg-teal-100 text-teal-900 border-teal-300';
    return 'bg-slate-100 text-slate-800 border-slate-300';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Cover Banner */}
        <div className="h-32 bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Details Container */}
        <div className="px-6 pb-6 pt-0 relative -mt-14 space-y-5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Avatar & Name */}
            <div className="flex items-end gap-3.5">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold text-3xl flex items-center justify-center overflow-hidden border-4 border-white shadow-md shrink-0">
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
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900">{farmer.name}</h2>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getReputationBadgeColor(
                      farmer.reputationBadge
                    )}`}
                  >
                    {farmer.reputationBadge}
                  </span>
                </div>

                {/* Farmer Profession Display */}
                {farmer.profession && (
                  <div className="text-xs text-emerald-950 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 inline-flex items-center gap-1.5">
                    <span className="font-bold text-emerald-700">🌾 Profession:</span>
                    <span>{farmer.profession}</span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-slate-600 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>
                    {farmer.village ? `${farmer.village}, ` : ''}
                    {farmer.district}, {farmer.state}
                  </span>
                </div>
              </div>
            </div>

            {/* Interaction Buttons */}
            <div className="flex items-center gap-2">
              {isOwnProfile ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-emerald-700" />
                  <span>{isEditing ? 'Cancel Editing' : 'Edit Farm Profile'}</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onToggleFollow(farmer.id)}
                    className={`px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isFollowing
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
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
                        <span>Follow Farmer</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenChat(farmer.id, farmer.name)}
                    className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-teal-700" />
                    <span>Message</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Total Posts</span>
              <strong className="text-base text-slate-900 font-bold">{farmer.totalPosts || posts.length}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Followers</span>
              <strong className="text-base text-emerald-800 font-bold">{farmer.followersCount || 0}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Following</span>
              <strong className="text-base text-slate-900 font-bold">{farmer.followingCount || 0}</strong>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Helpful Answers</span>
              <strong className="text-base text-teal-800 font-bold">{farmer.helpfulAnswersCount || 0}</strong>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 font-medium block">Best Solutions</span>
              <strong className="text-base text-amber-700 font-bold flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>{farmer.bestSolutionsCount || 0}</span>
              </strong>
            </div>
          </div>

          {/* Reputation Progress */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Farmer Reputation Score: {farmer.reputationScore} Points</span>
              </span>
              <span className="text-[11px] text-emerald-800 font-semibold">
                Badge: {farmer.reputationBadge}
              </span>
            </div>
            <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full"
                style={{ width: `${Math.min(100, (farmer.reputationScore / 500) * 100)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600">
              💡 Earn points by sharing helpful field advice, resolving neighbor crop problems, and posting field clips.
            </p>
          </div>

          {/* Edit Profile Form (Shown when isEditing = true) */}
          {isEditing && (
            <form onSubmit={handleSaveEdit} className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-emerald-700" />
                  <span>Edit Farmer Details &amp; Old Settings</span>
                </h4>
                <span className="text-slate-500 text-[11px]">Keep your farm info accurate</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">
                    🌾 Profession / Farm Specialty (వృత్తి / వ్యవసాయ ప్రత్యేకత)
                  </label>
                  <input
                    type="text"
                    required
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="e.g., Cotton & Chilli Cultivator • Organic Expert"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Village</label>
                  <input
                    type="text"
                    required
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Farming Experience (Years)</label>
                  <input
                    type="number"
                    value={farmingExperienceYears}
                    onChange={(e) => setFarmingExperienceYears(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Farm Land Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={farmSizeAcres}
                    onChange={(e) => setFarmSizeAcres(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Farming Type</label>
                  <select
                    value={farmingType}
                    onChange={(e) => setFarmingType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option>Commercial / Modern</option>
                    <option>Organic Farming</option>
                    <option>Zero Budget Natural Farming (ZBNF)</option>
                    <option>Drip Irrigated Cash Crops</option>
                    <option>Traditional Farming</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Main Crops Grown (Comma separated)
                </label>
                <input
                  type="text"
                  value={mainCropsStr}
                  onChange={(e) => setMainCropsStr(e.target.value)}
                  placeholder="Cotton, Rice (Paddy), Chilli, Maize"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Bio / Farming Philosophy</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share a few words about your farm, techniques, or what you enjoy growing..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Avatar Photo URL</label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* Bio & Agricultural Profile Overview */}
          {!isEditing && (
            <div className="space-y-3">
              {farmer.bio && (
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
                  {farmer.bio}
                </p>
              )}

              {/* Farm Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Experience</span>
                  <strong className="text-slate-900 font-semibold">{farmer.farmingExperienceYears} Years</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Farm Size</span>
                  <strong className="text-slate-900 font-semibold">{farmer.farmSizeAcres} Acres</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Farming Type</span>
                  <strong className="text-slate-900 font-semibold truncate block">{farmer.farmingType}</strong>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-500 font-medium block">Member Since</span>
                  <strong className="text-slate-900 font-semibold">{farmer.joinedDate}</strong>
                </div>
              </div>

              {/* Main Crops Chips */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">Main Crops Grown</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {farmer.mainCrops.map((crop) => (
                    <span
                      key={crop}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{crop}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Farmer's Posts List */}
          <div className="space-y-3 pt-2 border-t border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
              <span>Posts by {farmer.name} ({posts.length})</span>
              <span className="text-[11px] text-slate-500 font-normal">Field updates &amp; problem queries</span>
            </h4>

            {posts.length > 0 ? (
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                {posts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onOpenPost && onOpenPost(p.id)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                          {p.crop}
                        </span>
                        <span className="text-[11px] text-slate-500">{p.createdAt}</span>
                      </div>
                      <h5 className="font-bold text-slate-900 truncate text-xs">{p.title}</h5>
                      <p className="text-slate-600 truncate text-[11px] mt-0.5">{p.content}</p>
                    </div>
                    {p.mediaUrls && p.mediaUrls[0] && (
                      <img
                        src={p.mediaUrls[0]}
                        alt={p.title}
                        className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-100"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-center py-4">
                No public posts created yet by this farmer.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
