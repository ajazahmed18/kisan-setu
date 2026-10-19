import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import {
  KisanPost,
  FarmerProfile,
  KisanNotification,
  SavedKnowledgeCategory,
} from '../../types/community';
import {
  SEED_POSTS,
  SEED_FARMERS,
  SEED_NOTIFICATIONS,
} from '../../data/communitySeed';
import { KisanPostCard } from './KisanPostCard';
import { CreatePostModal } from './CreatePostModal';
import { NotificationsDrawer } from './NotificationsDrawer';
import { ReportModal } from './ReportModal';
import { SharePostModal } from './SharePostModal';
import {
  Sprout,
  Users,
  MessageSquare,
  Bookmark,
  Bell,
  Search,
  Plus,
  Award,
  MapPin,
  CheckCircle2,
  Globe,
  Image as ImageIcon,
  Send,
  X,
  User,
  Edit3,
  Save,
  ArrowLeft,
  UserPlus,
  UserCheck,
  Layers,
  Trophy,
  Share2,
} from 'lucide-react';

interface KisanCommunityHubProps {
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
    district?: string;
    state?: string;
    role?: string;
  };
}

type Language = 'en' | 'te' | 'hi';

const TRANSLATIONS: Record<
  Language,
  {
    hubTitle: string;
    tagline: string;
    createPostBtn: string;
    searchPlaceholder: string;
    composerPrompt: string;
    myPostsTab: string;
    publicPostsTab: string;
  }
> = {
  en: {
    hubTitle: 'Kisan Community',
    tagline: 'Farmer profiles, field updates, and community discussions',
    createPostBtn: '+ Create Post',
    searchPlaceholder: 'Search posts by crop, topic, or keyword...',
    composerPrompt: "What's happening on your farm today? Share with fellow farmers...",
    myPostsTab: 'My Posts',
    publicPostsTab: 'Public Posts',
  },
  te: {
    hubTitle: 'కిసాన్ కమ్యూనిటీ',
    tagline: 'రైతు ప్రొఫైల్, పంట విశేషాలు మరియు కమ్యూనిటీ చర్చలు',
    createPostBtn: '+ పోస్ట్ చేయండి',
    searchPlaceholder: 'పంట లేదా సమాచారం కోసం వెతకండి...',
    composerPrompt: 'ఈరోజు మీ పొలంలో ఏం జరుగుతోంది? రైతులతో పంచుకోండి...',
    myPostsTab: 'నా పోస్ట్‌లు',
    publicPostsTab: 'ప్రజా పోస్ట్‌లు',
  },
  hi: {
    hubTitle: 'किसान कम्युनिटी',
    tagline: 'किसान प्रोफाइल, खेत की प्रगति और कृषि संवाद',
    createPostBtn: '+ पोस्ट बनाएं',
    searchPlaceholder: 'फसल, समस्या या विषय खोजें...',
    composerPrompt: 'आज आपके खेत में क्या चल रहा है? साथी किसानों के साथ साझा करें...',
    myPostsTab: 'मेरी पोस्ट',
    publicPostsTab: 'सार्वजनिक पोस्ट',
  },
};

export const KisanCommunityHub: React.FC<KisanCommunityHubProps> = ({ currentUser }) => {
  const currentUserId = currentUser?.id || 'usr-farmer-ramesh';
  const currentUserName = currentUser?.name || 'Ramesh Kumar Goud';
  const currentUserAvatar =
    currentUser?.avatar ||
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80';
  const currentUserDistrict = currentUser?.district || 'Warangal';
  const currentUserState = currentUser?.state || 'Telangana';

  // Core Data States
  const [posts, setPosts] = useState<KisanPost[]>(SEED_POSTS);
  const [farmers, setFarmers] = useState<FarmerProfile[]>(SEED_FARMERS);
  const [notifications, setNotifications] = useState<KisanNotification[]>(SEED_NOTIFICATIONS);
  const [savedPosts, setSavedPosts] = useState<{ postId: string; category: SavedKnowledgeCategory }[]>([]);

  // Active Profile & Bottom Posts Tab Selection
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(currentUserId);
  const [activePostsTab, setActivePostsTab] = useState<'my_posts' | 'public_posts'>('my_posts');

  // Inline Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(currentUserName);
  const [editProfession, setEditProfession] = useState('🌾 Cotton & Chilli Cultivator • IPM Specialist');
  const [editVillage, setEditVillage] = useState('Geesugonda');
  const [editDistrict, setEditDistrict] = useState(currentUserDistrict);
  const [editState, setEditState] = useState(currentUserState);
  const [editBio, setEditBio] = useState(
    'Cultivating BT-Cotton, Teja chilli, and BPT-5204 paddy using drip fertigation and IPM techniques.'
  );
  const [editCrops, setEditCrops] = useState('Cotton, Red Chilli, Rice (Paddy)');
  const [editAcres, setEditAcres] = useState('6.5');
  const [editExp, setEditExp] = useState('12');

  // Language, Search & Modals
  const { language: appLanguage, setLanguage: setAppLanguage } = useLanguage();
  const language: Language = (appLanguage === 'te' || appLanguage === 'hi') ? appLanguage : 'en';
  const setLanguage = (lang: Language) => {
    setAppLanguage(lang);
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [reportingPost, setReportingPost] = useState<KisanPost | null>(null);
  const [sharingPost, setSharingPost] = useState<KisanPost | null>(null);

  const t = TRANSLATIONS[language];

  // Fetch initial posts and farmers from backend API
  useEffect(() => {
    const loadCommunityData = async () => {
      try {
        const [postsRes, farmersRes, savedRes] = await Promise.all([
          fetch('/api/community/posts'),
          fetch('/api/community/farmers'),
          fetch(`/api/community/saved?userId=${currentUserId}`),
        ]);

        if (postsRes.ok) {
          const postsData = await postsRes.json();
          if (Array.isArray(postsData) && postsData.length > 0) {
            setPosts(postsData);
          }
        }

        if (farmersRes.ok) {
          const farmersData = await farmersRes.json();
          if (Array.isArray(farmersData) && farmersData.length > 0) {
            setFarmers(farmersData);
          }
        }

        if (savedRes.ok) {
          const savedData = await savedRes.json();
          if (Array.isArray(savedData)) {
            setSavedPosts(savedData.map((item: any) => ({ postId: item.postId, category: item.category })));
          }
        }
      } catch (err) {
        console.warn('Using seed community state:', err);
      }
    };

    loadCommunityData();
  }, [currentUserId]);

  // Determine current active farmer profile
  const isViewingOwnProfile = selectedFarmerId === currentUserId;
  const activeFarmer: FarmerProfile =
    farmers.find((f) => f.id === selectedFarmerId) || {
      id: currentUserId,
      name: currentUserName,
      avatar: currentUserAvatar,
      village: 'Geesugonda',
      district: currentUserDistrict,
      state: currentUserState,
      farmingExperienceYears: 12,
      mainCrops: ['Cotton', 'Red Chilli', 'Rice (Paddy)'],
      farmSizeAcres: 6.5,
      farmingType: 'Drip-Irrigated' as any,
      bio: 'Cultivating BT-Cotton, Teja chilli, and BPT-5204 paddy using drip fertigation and IPM techniques.',
      totalPosts: posts.filter((p) => p.authorId === currentUserId).length,
      followersCount: 142,
      followingCount: 38,
      helpfulAnswersCount: 24,
      bestSolutionsCount: 14,
      reputationScore: 385,
      reputationBadge: '🏆 Farming Helper' as any,
      role: 'farmer' as any,
      profession: '🌾 Cotton & Chilli Cultivator • IPM Specialist',
      joinedDate: 'Jan 2023',
    };

  // Sync edit form with active farmer
  useEffect(() => {
    setEditName(activeFarmer.name);
    setEditProfession(activeFarmer.profession || '🌾 Dedicated Cultivator');
    setEditVillage(activeFarmer.village || '');
    setEditDistrict(activeFarmer.district || currentUserDistrict);
    setEditState(activeFarmer.state || currentUserState);
    setEditBio(activeFarmer.bio || '');
    setEditCrops(activeFarmer.mainCrops?.join(', ') || 'Cotton, Paddy');
    setEditAcres(String(activeFarmer.farmSizeAcres || 5));
    setEditExp(String(activeFarmer.farmingExperienceYears || 10));
  }, [selectedFarmerId, activeFarmer.name]);

  // Handle Save Edited Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cropsArr = editCrops
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const updatedProfile: Partial<FarmerProfile> = {
      name: editName,
      profession: editProfession,
      village: editVillage,
      district: editDistrict,
      state: editState,
      bio: editBio,
      mainCrops: cropsArr.length > 0 ? cropsArr : activeFarmer.mainCrops,
      farmSizeAcres: Number(editAcres) || activeFarmer.farmSizeAcres,
      farmingExperienceYears: Number(editExp) || activeFarmer.farmingExperienceYears,
    };

    setFarmers((prev) =>
      prev.map((f) => (f.id === selectedFarmerId ? { ...f, ...updatedProfile } : f))
    );
    setIsEditingProfile(false);

    try {
      fetch(`/api/community/farmers/${selectedFarmerId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile),
      });
    } catch (e) {}
  };

  // Handle Create Post
  const handleCreatePost = async (newPostData: Partial<KisanPost>) => {
    const postPayload: Partial<KisanPost> = {
      ...newPostData,
      authorId: currentUserId,
      authorName: currentUserName,
      authorAvatar: currentUserAvatar,
      authorDistrict: currentUserDistrict,
      authorState: currentUserState,
      visibility: newPostData.visibility || 'public',
      createdAt: 'Just now',
    };

    try {
      const res = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload),
      });

      if (res.ok) {
        const created = await res.json();
        setPosts((prev) => [created, ...prev]);
      } else {
        throw new Error('API create post error');
      }
    } catch (e) {
      // Local fallback
      const localPost: KisanPost = {
        id: `post-${Date.now()}`,
        authorId: currentUserId,
        authorName: currentUserName,
        authorRole: 'farmer',
        authorAvatar: currentUserAvatar,
        authorVillage: editVillage || 'Geesugonda',
        authorDistrict: currentUserDistrict,
        authorState: currentUserState,
        authorReputation: '🌾 Active Farmer',
        postType: newPostData.postType || 'field_update',
        crop: newPostData.crop || 'General Agriculture',
        visibility: newPostData.visibility || 'public',
        title: newPostData.title || 'Farming Update',
        content: newPostData.content || '',
        mediaUrls: newPostData.mediaUrls || [],
        location: `${currentUserDistrict}, ${currentUserState}`,
        tags: newPostData.tags || [],
        likes: [],
        helpfulCount: 0,
        helpfulUserIds: [],
        savesCount: 0,
        sharesCount: 0,
        commentsCount: 0,
        createdAt: 'Just now',
        comments: [],
      };
      setPosts((prev) => [localPost, ...prev]);
    }

    // Switch to "My Posts" to immediately see the created post
    setActivePostsTab('my_posts');
  };

  // Toggle Like
  const handleLikePost = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const likes = p.likes || [];
        const isLiked = likes.includes(currentUserId);
        const updatedLikes = isLiked
          ? likes.filter((id) => id !== currentUserId)
          : [...likes, currentUserId];
        return { ...p, likes: updatedLikes };
      })
    );

    try {
      await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          userName: currentUserName,
          userAvatar: currentUserAvatar,
        }),
      });
    } catch (e) {}
  };

  // Toggle Helpful Vote
  const handleHelpfulPost = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const users = p.helpfulUserIds || [];
        const isHelpful = users.includes(currentUserId);
        const updated = isHelpful
          ? users.filter((id) => id !== currentUserId)
          : [...users, currentUserId];
        return {
          ...p,
          helpfulUserIds: updated,
          helpfulCount: updated.length,
        };
      })
    );

    try {
      await fetch(`/api/community/posts/${postId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
    } catch (e) {}
  };

  // Add Comment
  const handleAddComment = async (
    postId: string,
    text: string,
    replyToCommentId?: string,
    replyToAuthorName?: string
  ) => {
    const commentPayload = {
      authorId: currentUserId,
      authorName: currentUserName,
      authorAvatar: currentUserAvatar,
      authorLocation: `${currentUserDistrict}, ${currentUserState}`,
      text,
      replyToCommentId,
      replyToAuthorName,
    };

    try {
      const res = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentPayload),
      });

      if (res.ok) {
        const newComm = await res.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [...(p.comments || []), newComm],
                  commentsCount: (p.commentsCount || 0) + 1,
                }
              : p
          )
        );
      }
    } catch (e) {
      const localComment = {
        id: `comm-${Date.now()}`,
        postId,
        ...commentPayload,
        createdAt: 'Just now',
        likes: [],
        helpfulCount: 0,
        helpfulUserIds: [],
      };
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                comments: [...(p.comments || []), localComment as any],
                commentsCount: (p.commentsCount || 0) + 1,
              }
            : p
        )
      );
    }
  };

  // Toggle Comment Helpful
  const handleHelpfulComment = async (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: (p.comments || []).map((c) => {
            if (c.id !== commentId) return c;
            const users = c.helpfulUserIds || [];
            const isHelpful = users.includes(currentUserId);
            const updated = isHelpful
              ? users.filter((id) => id !== currentUserId)
              : [...users, currentUserId];
            return {
              ...c,
              helpfulUserIds: updated,
              helpfulCount: updated.length,
            };
          }),
        };
      })
    );

    try {
      await fetch(`/api/community/posts/${postId}/comments/${commentId}/helpful`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
    } catch (e) {}
  };

  // Mark Best Solution
  const handleMarkBestSolution = async (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          status: 'resolved',
          bestSolutionCommentId: commentId,
          comments: (p.comments || []).map((c) => ({
            ...c,
            isBestSolution: c.id === commentId ? !c.isBestSolution : false,
          })),
        };
      })
    );

    try {
      await fetch(`/api/community/posts/${postId}/comments/${commentId}/best-solution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });
    } catch (e) {}
  };

  // Save Post
  const handleSavePost = async (postId: string, category: SavedKnowledgeCategory) => {
    setSavedPosts((prev) => {
      const exists = prev.some((s) => s.postId === postId);
      if (exists) {
        return prev.filter((s) => s.postId !== postId);
      }
      return [...prev, { postId, category }];
    });

    try {
      await fetch(`/api/community/posts/${postId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, category }),
      });
    } catch (e) {}
  };

  // Toggle Follow
  const handleToggleFollow = async (farmerId: string) => {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id !== farmerId) return f;
        const isFollowing = !f.isFollowing;
        return {
          ...f,
          isFollowing,
          followersCount: (f.followersCount || 0) + (isFollowing ? 1 : -1),
        };
      })
    );

    try {
      await fetch(`/api/community/farmers/${farmerId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: currentUserId }),
      });
    } catch (e) {}
  };

  // Submit Report
  const handleSubmitReport = async (data: any) => {
    try {
      await fetch('/api/community/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, reporterId: currentUserId, reporterName: currentUserName }),
      });
    } catch (e) {}
  };

  // Calculate posts for "My Posts" vs "Public Posts"
  const myPosts = posts.filter((p) => p.authorId === activeFarmer.id);
  const publicPosts = posts.filter(
    (p) => p.visibility !== 'private' || p.authorId === currentUserId
  );

  // Apply search query filter to active posts tab
  const activePostsList = (activePostsTab === 'my_posts' ? myPosts : publicPosts).filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const inTitle = p.title?.toLowerCase().includes(q);
    const inContent = p.content?.toLowerCase().includes(q);
    const inCrop = p.crop?.toLowerCase().includes(q);
    const inAuthor = p.authorName?.toLowerCase().includes(q);
    const inTag = p.tags?.some((t) => t.toLowerCase().includes(q));
    return inTitle || inContent || inCrop || inAuthor || inTag;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16 px-3 sm:px-4">
      {/* Top Header Controls Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          {!isViewingOwnProfile ? (
            <button
              type="button"
              onClick={() => setSelectedFarmerId(currentUserId)}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to My Profile</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Sprout className="w-4 h-4" />
              </span>
              <div>
                <h1 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  {t.hubTitle}
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  {t.tagline}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Header Buttons: Language & Notifications */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(['en', 'te', 'hi'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  language === lang
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'te' ? 'తెలుగు' : 'हिंदी'}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.some((n) => !n.isRead) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* 1. FARMER PROFILE DETAILS (Top Card) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Cover Strip */}
        <div className="h-28 sm:h-32 bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 relative">
          <div className="absolute inset-0 bg-pattern opacity-10" />
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-black/40 backdrop-blur-xs text-white text-[11px] font-bold rounded-lg border border-white/10 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-300" />
              <span>{activeFarmer.district}, {activeFarmer.state}</span>
            </span>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-5 sm:p-6 relative -mt-12 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Avatar & Core Bio */}
            <div className="flex items-end gap-3.5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-md shrink-0 border border-slate-100">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-extrabold flex items-center justify-center text-2xl sm:text-3xl overflow-hidden">
                  {activeFarmer.avatar ? (
                    <img
                      src={activeFarmer.avatar}
                      alt={activeFarmer.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{activeFarmer.name.charAt(0)}</span>
                  )}
                </div>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                    {activeFarmer.name}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    <span>Verified Kisan</span>
                  </span>
                  {activeFarmer.reputationBadge && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 text-[11px] font-bold border border-amber-300">
                      {activeFarmer.reputationBadge}
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-emerald-800 truncate">
                  {activeFarmer.profession || '🌾 Dedicated Farmer & Cultivator'}
                </p>

                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span>{activeFarmer.village ? `${activeFarmer.village}, ` : ''}{activeFarmer.district}, {activeFarmer.state}</span>
                  <span>•</span>
                  <span>Member since {activeFarmer.joinedDate || '2023'}</span>
                </p>
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {isViewingOwnProfile ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditingProfile ? 'Close' : 'Edit Profile'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.createPostBtn}</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => handleToggleFollow(activeFarmer.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                    activeFarmer.isFollowing
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {activeFarmer.isFollowing ? (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>+ Follow Farmer</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Inline Profile Editor Form */}
          {isEditingProfile && (
            <form
              onSubmit={handleSaveProfile}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Edit Farm Profile Details</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Specialty / Title</label>
                  <input
                    type="text"
                    value={editProfession}
                    onChange={(e) => setEditProfession(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Village</label>
                  <input
                    type="text"
                    value={editVillage}
                    onChange={(e) => setEditVillage(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={editDistrict}
                    onChange={(e) => setEditDistrict(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Farm Land Size (Acres)</label>
                  <input
                    type="number"
                    value={editAcres}
                    onChange={(e) => setEditAcres(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    value={editExp}
                    onChange={(e) => setEditExp(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Main Crops (comma separated)</label>
                  <input
                    type="text"
                    value={editCrops}
                    onChange={(e) => setEditCrops(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Bio</label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-3 py-1.5 bg-white text-slate-700 font-bold rounded-lg border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* Bio Description */}
          {activeFarmer.bio && (
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
              "{activeFarmer.bio}"
            </p>
          )}

          {/* Profile Stats Bar (Like Instagram Profile Stats) */}
          <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100">
            <div className="p-2.5 bg-slate-50 rounded-xl text-center">
              <strong className="text-base sm:text-lg font-extrabold text-slate-900 block">
                {myPosts.length}
              </strong>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Posts</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-center">
              <strong className="text-base sm:text-lg font-extrabold text-slate-900 block">
                {activeFarmer.followersCount || 142}
              </strong>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Followers</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-center">
              <strong className="text-base sm:text-lg font-extrabold text-slate-900 block">
                {activeFarmer.followingCount || 38}
              </strong>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500">Following</span>
            </div>

            <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-center">
              <strong className="text-base sm:text-lg font-extrabold text-emerald-800 block">
                {activeFarmer.reputationScore || 385}
              </strong>
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700">Reputation</span>
            </div>
          </div>

          {/* Key Farm Details Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-600">
            <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-medium flex items-center gap-1">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>Crops: <strong>{activeFarmer.mainCrops?.join(', ') || 'Cotton, Chilli'}</strong></span>
            </span>

            <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-teal-700" />
              <span>Land: <strong>{activeFarmer.farmSizeAcres || 5} Acres ({activeFarmer.farmingType || 'Drip-Irrigated'})</strong></span>
            </span>

            <span className="px-2.5 py-1 bg-slate-100 rounded-lg font-medium flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Experience: <strong>{activeFarmer.farmingExperienceYears || 10} Years</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. CREATE POST COMPOSER BAR */}
      <div
        onClick={() => setIsCreateModalOpen(true)}
        className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center overflow-hidden shrink-0 shadow-2xs">
          {currentUserAvatar ? (
            <img
              src={currentUserAvatar}
              alt={currentUserName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span>{currentUserName.charAt(0)}</span>
          )}
        </div>

        <div className="flex-1 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl px-3.5 py-2 border border-slate-200/80 text-xs sm:text-sm text-slate-500 font-medium truncate">
          {t.composerPrompt}
        </div>

        <button
          type="button"
          className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors shrink-0"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>Photo</span>
        </button>

        <button
          type="button"
          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t.createPostBtn}</span>
        </button>
      </div>

      {/* 3. POSTS SECTION AT BOTTOM (Tabs: "My Posts" & "Public Posts") */}
      <div className="space-y-4 pt-1">
        {/* Clean Tabs & Compact Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Tab Selector: My Posts vs Public Posts */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActivePostsTab('my_posts')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activePostsTab === 'my_posts'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>{t.myPostsTab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activePostsTab === 'my_posts' ? 'bg-emerald-900/60 text-emerald-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {myPosts.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActivePostsTab('public_posts')}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activePostsTab === 'public_posts'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{t.publicPostsTab}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activePostsTab === 'public_posts' ? 'bg-emerald-900/60 text-emerald-100' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {publicPosts.length}
              </span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-hidden text-slate-900 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Posts Stream */}
        {activePostsList.length > 0 ? (
          <div className="space-y-4">
            {activePostsList.map((post, idx) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: Math.min(idx * 0.03, 0.15) }}
              >
                <KisanPostCard
                  post={post}
                  currentUserId={currentUserId}
                  currentUserName={currentUserName}
                  currentUserAvatar={currentUserAvatar}
                  onLike={handleLikePost}
                  onHelpful={handleHelpfulPost}
                  onAddComment={handleAddComment}
                  onHelpfulComment={handleHelpfulComment}
                  onMarkBestSolution={handleMarkBestSolution}
                  onSavePost={handleSavePost}
                  onSharePost={(p) => setSharingPost(p)}
                  onReportPost={(p) => setReportingPost(p)}
                  onOpenProfile={(authorId) => {
                    setSelectedFarmerId(authorId);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onTagClick={(tag) => setSearchQuery(tag)}
                  isSaved={savedPosts.some((s) => s.postId === post.id)}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-3">
            <Sprout className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm sm:text-base">
              {activePostsTab === 'my_posts'
                ? isViewingOwnProfile
                  ? 'You have not uploaded any posts yet'
                  : `${activeFarmer.name} has not uploaded any posts yet`
                : 'No posts matching search'}
            </h4>
            <p className="text-slate-500 text-xs max-w-sm mx-auto">
              {activePostsTab === 'my_posts' && isViewingOwnProfile
                ? 'Share what is happening on your farm, post crop problems, or offer farming advice to fellow kisans.'
                : 'Try adjusting your search query or clear the filter.'}
            </p>
            {activePostsTab === 'my_posts' && isViewingOwnProfile && (
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
              >
                + Upload Your First Post
              </button>
            )}
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        currentUserDistrict={currentUserDistrict}
        currentUserState={currentUserState}
        currentUserAvatar={currentUserAvatar}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
          );
          fetch(`/api/community/notifications/${id}/read`, { method: 'PUT' });
        }}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
          fetch('/api/community/notifications/read-all', { method: 'PUT' });
        }}
        onOpenPost={() => {}}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={!!reportingPost}
        onClose={() => setReportingPost(null)}
        post={reportingPost}
        onSubmitReport={handleSubmitReport}
      />

      {/* Share Post Modal */}
      <SharePostModal
        isOpen={!!sharingPost}
        onClose={() => setSharingPost(null)}
        post={sharingPost}
        farmers={farmers}
        onShareInChat={() => {}}
        onRepostToFeed={(p, thoughts) => {
          handleCreatePost({
            title: `Shared: ${p.title}`,
            content: `${thoughts ? `"${thoughts}"\n\n` : ''}${p.content}`,
            crop: p.crop,
            mediaUrls: p.mediaUrls,
            postType: 'field_update',
            tags: p.tags,
            originalPost: {
              id: p.id,
              authorName: p.authorName,
              authorDistrict: p.authorDistrict || 'Local Area',
              title: p.title,
              content: p.content,
            },
          });
        }}
      />
    </div>
  );
};
