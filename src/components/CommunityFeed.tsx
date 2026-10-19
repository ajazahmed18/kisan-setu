import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  CommunityPost,
  CommunityReply,
  UserProfile,
  ProblemCategory,
  ProblemUrgency,
} from '../types';
import { INITIAL_COMMUNITY_POSTS } from '../data/mockData';
import {
  MessageSquare,
  Heart,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Image as ImageIcon,
  UploadCloud,
  X,
  Send,
  Award,
  ExternalLink,
  Phone,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  Check,
  Wheat,
  Tag,
  RefreshCw,
  Camera,
  Layers,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';

interface CommunityFeedProps {
  currentUser?: UserProfile | null;
  initialPosts?: CommunityPost[];
  onOpenProfile?: (userId: string) => void;
}

const POPULAR_CROPS = [
  'All Crops',
  'Cotton',
  'Rice (Paddy)',
  'Red Chilli',
  'Maize',
  'Soybean',
  'Turmeric',
  'Groundnut',
  'Tomato',
  'Onion',
  'Wheat',
];

const PROBLEM_CATEGORIES: { id: ProblemCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All Topics' },
  { id: 'pest_disease', label: 'Pest & Disease Attack' },
  { id: 'crop_health', label: 'Crop & Leaf Health' },
  { id: 'weather_damage', label: 'Weather & Flood Damage' },
  { id: 'market_mandi', label: 'Mandi & Price Query' },
  { id: 'seeds_fertilizer', label: 'Seed, Fertilizer & Soil' },
  { id: 'machinery', label: 'Machinery & Irrigation' },
  { id: 'government_scheme', label: 'Govt Schemes & Subsidies' },
  { id: 'general', label: 'General Advice' },
];

const PRESET_PHOTOS = [
  {
    label: 'Whitefly on Cotton',
    url: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=800&auto=format&fit=crop&q=80',
    crop: 'Cotton',
    category: 'pest_disease' as ProblemCategory,
  },
  {
    label: 'Waterlogged Paddy',
    url: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop&q=80',
    crop: 'Rice (Paddy)',
    category: 'weather_damage' as ProblemCategory,
  },
  {
    label: 'Chilli Black Thrips',
    url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80',
    crop: 'Red Chilli',
    category: 'pest_disease' as ProblemCategory,
  },
  {
    label: 'Tomato Early Blight',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69106093?w=800&auto=format&fit=crop&q=80',
    crop: 'Tomato',
    category: 'crop_health' as ProblemCategory,
  },
];

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  currentUser,
  initialPosts,
  onOpenProfile,
}) => {
  // Primary posts collection state
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    return initialPosts && initialPosts.length > 0 ? initialPosts : INITIAL_COMMUNITY_POSTS;
  });

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('All Crops');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [feedFilter, setFeedFilter] = useState<'all' | 'urgent' | 'unresolved' | 'resolved' | 'my_posts'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'most_helpful' | 'most_replies'>('newest');

  // New Post Form State
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCrop, setNewCrop] = useState('Cotton');
  const [newCategory, setNewCategory] = useState<ProblemCategory>('pest_disease');
  const [newUrgency, setNewUrgency] = useState<ProblemUrgency>('urgent');
  const [newQuestion, setNewQuestion] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [includePhone, setIncludePhone] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Active Zoom Image for Lightbox
  const [zoomedImage, setZoomedImage] = useState<{ url: string; title: string } | null>(null);

  // New Reply text map by postId
  const [replyInputMap, setReplyInputMap] = useState<{ [postId: string]: string }>({});
  const [expandedRepliesMap, setExpandedRepliesMap] = useState<{ [postId: string]: boolean }>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initialPosts if updated from outside
  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts((prev) => {
        // Merge without losing freshly created client items
        const existingIds = new Set(initialPosts.map((p) => p.id));
        const customLocal = prev.filter((p) => !existingIds.has(p.id));
        return [...customLocal, ...initialPosts];
      });
    }
  }, [initialPosts]);

  // Real-time Firestore sync with fallback
  useEffect(() => {
    let unsubscribe = () => {};

    try {
      const postsCol = collection(db, 'community_posts');
      unsubscribe = onSnapshot(
        postsCol,
        (snapshot) => {
          if (!snapshot.empty) {
            const remotePosts: CommunityPost[] = [];
            snapshot.forEach((docSnap) => {
              const data = docSnap.data() as CommunityPost;
              remotePosts.push({
                ...data,
                id: docSnap.id,
                likes: Array.isArray(data.likes) ? data.likes : [],
                replies: Array.isArray(data.replies) ? data.replies : [],
              });
            });

            // Sort newest first
            remotePosts.sort((a, b) => {
              const tA = new Date(a.createdAt).getTime() || 0;
              const tB = new Date(b.createdAt).getTime() || 0;
              return tB - tA;
            });

            if (remotePosts.length > 0) {
              setPosts(remotePosts);
            }
          }
        },
        (error) => {
          // Log and gracefully fallback to server API or initial mock data
          console.warn('Firestore community_posts snapshot listener note:', error.message);
        }
      );
    } catch (err) {
      console.warn('Firestore initialization notice for community_posts:', err);
    }

    return () => unsubscribe();
  }, []);

  // Fetch from server endpoint if Firestore is not populated
  useEffect(() => {
    const loadFromApi = async () => {
      try {
        const res = await fetch('/api/community/posts');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPosts((prev) => {
              // Combine and deduplicate
              const map = new Map<string, CommunityPost>();
              prev.forEach((p) => map.set(p.id, p));
              data.forEach((p: CommunityPost) => map.set(p.id, p));
              return Array.from(map.values());
            });
          }
        }
      } catch (e) {
        // Quiet fallback to mock data
      }
    };
    loadFromApi();
  }, []);

  // File Upload Handlers (Drag & Drop + File Picker)
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Submit New Problem / Query Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newQuestion.trim()) return;

    setIsSubmitting(true);

    const postAuthorId = currentUser?.id || `farmer-${Date.now()}`;
    const postAuthorName = currentUser?.name || 'Verified Farmer';
    const postAuthorRole = currentUser?.role || 'farmer';
    const postAuthorLocation = currentUser?.location || 'Warangal District, Telangana';
    const postAuthorPhone = includePhone
      ? currentUser?.phone || '+91 98480 23456'
      : undefined;

    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      farmerId: postAuthorId,
      farmerName: postAuthorName,
      farmerRole: postAuthorRole,
      farmerAvatar: currentUser?.avatar,
      farmerLocation: postAuthorLocation,
      farmerPhone: postAuthorPhone,
      crop: newCrop,
      problemCategory: newCategory,
      urgency: newUrgency,
      title: newTitle.trim(),
      question: newQuestion.trim(),
      imageUrl: newImageUrl || undefined,
      status: 'open',
      likes: [],
      createdAt: 'Just now',
      replies: [],
    };

    // Optimistically update UI
    setPosts((prev) => [newPost, ...prev]);

    // Reset Form
    setNewTitle('');
    setNewQuestion('');
    setNewImageUrl('');
    setIsComposerOpen(false);
    setIsSubmitting(false);

    // Sync to Server API
    try {
      await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
    } catch (err) {
      console.warn('API post creation error:', err);
    }

    // Sync to Firestore if authenticated
    try {
      if (currentUser?.id) {
        await setDoc(doc(db, 'community_posts', newPost.id), newPost);
      }
    } catch (err) {
      // Non-fatal if offline or rules deny
      console.warn('Firestore post creation notice:', err);
    }
  };

  // Like / Helpful Toggle
  const handleToggleLike = async (postId: string) => {
    const currentUid = currentUser?.id || 'guest-user';

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const currentLikes = p.likes || [];
        const isLiked = currentLikes.includes(currentUid);
        const updatedLikes = isLiked
          ? currentLikes.filter((id) => id !== currentUid)
          : [...currentLikes, currentUid];
        return { ...p, likes: updatedLikes };
      })
    );

    // Sync to Server API
    try {
      await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUid }),
      });
    } catch (e) {
      console.warn('Like toggle API error:', e);
    }

    // Sync to Firestore
    try {
      const targetPost = posts.find((p) => p.id === postId);
      if (targetPost) {
        const currentLikes = targetPost.likes || [];
        const isLiked = currentLikes.includes(currentUid);
        const updatedLikes = isLiked
          ? currentLikes.filter((id) => id !== currentUid)
          : [...currentLikes, currentUid];
        await updateDoc(doc(db, 'community_posts', postId), { likes: updatedLikes });
      }
    } catch (e) {
      // Handled silently
    }
  };

  // Add Reply / Solution
  const handleAddReply = async (postId: string) => {
    const text = replyInputMap[postId]?.trim();
    if (!text) return;

    const newReply: CommunityReply = {
      id: `rep-${Date.now()}`,
      authorId: currentUser?.id,
      authorName: currentUser?.name || 'Fellow Agronomist',
      authorRole: currentUser?.role || 'farmer',
      authorAvatar: currentUser?.avatar,
      authorLocation: currentUser?.location || 'Telangana',
      text,
      createdAt: 'Just now',
      isHelpful: false,
      upvotes: [],
    };

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          replies: [...(p.replies || []), newReply],
        };
      })
    );

    // Clear input and ensure replies are open
    setReplyInputMap((prev) => ({ ...prev, [postId]: '' }));
    setExpandedRepliesMap((prev) => ({ ...prev, [postId]: true }));

    // Sync to Server API
    try {
      await fetch(`/api/community/posts/${postId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReply),
      });
    } catch (e) {
      console.warn('API reply post error:', e);
    }

    // Sync to Firestore
    try {
      const target = posts.find((p) => p.id === postId);
      if (target) {
        const updatedReplies = [...(target.replies || []), newReply];
        await updateDoc(doc(db, 'community_posts', postId), { replies: updatedReplies });
      }
    } catch (e) {
      // Handled gracefully
    }
  };

  // Mark Resolved / Accept Solution
  const handleMarkResolved = async (postId: string, replyId?: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newStatus = p.status === 'resolved' && !replyId ? 'open' : 'resolved';
        return {
          ...p,
          status: newStatus,
          resolvedReplyId: replyId || p.resolvedReplyId,
        };
      })
    );

    try {
      await fetch(`/api/community/posts/${postId}/resolve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'resolved',
          resolvedReplyId: replyId,
        }),
      });
    } catch (e) {
      console.warn('Resolve API error:', e);
    }

    try {
      await updateDoc(doc(db, 'community_posts', postId), {
        status: 'resolved',
        resolvedReplyId: replyId || null,
      });
    } catch (e) {
      // Silent catch
    }
  };

  // Delete Post (Author or Admin)
  const handleDeletePost = async (postId: string) => {
    if (!window.confirm('Are you sure you want to delete this community post?')) return;

    setPosts((prev) => prev.filter((p) => p.id !== postId));

    try {
      await fetch(`/api/community/posts/${postId}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Delete API error:', e);
    }

    try {
      await deleteDoc(doc(db, 'community_posts', postId));
    } catch (e) {
      // Silent catch
    }
  };

  // Copy shareable link
  const handleShare = (postId: string) => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedPostId(postId);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  // Badges & Labels Helpers
  const getUrgencyBadge = (urgency?: ProblemUrgency) => {
    switch (urgency) {
      case 'urgent':
        return {
          label: '🚨 Urgent Issue',
          className: 'bg-rose-50 text-rose-800 border-rose-200 font-semibold',
        };
      case 'moderate':
        return {
          label: '⚠️ Moderate Advice',
          className: 'bg-amber-50 text-amber-800 border-amber-200 font-medium',
        };
      default:
        return {
          label: 'ℹ️ General Query',
          className: 'bg-blue-50 text-blue-800 border-blue-200 font-medium',
        };
    }
  };

  const getCategoryBadge = (category?: ProblemCategory) => {
    const item = PROBLEM_CATEGORIES.find((c) => c.id === category);
    return item ? `${item.icon} ${item.label}` : '💡 General Farming';
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'farmer':
        return { label: 'Farmer', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'fpo':
        return { label: 'FPO Co-Op', className: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'admin':
        return { label: 'Agri Scientist (KVK)', className: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'buyer':
        return { label: 'Verified Buyer', className: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'transporter':
        return { label: 'Transporter', className: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      default:
        return { label: 'Member', className: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  // Filtered and sorted posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // Feed filter tabs
      if (feedFilter === 'urgent' && post.urgency !== 'urgent') return false;
      if (feedFilter === 'unresolved' && post.status === 'resolved') return false;
      if (feedFilter === 'resolved' && post.status !== 'resolved') return false;
      if (feedFilter === 'my_posts') {
        if (!currentUser?.id) return false;
        if (post.farmerId !== currentUser.id) return false;
      }

      // Crop filter
      if (selectedCrop !== 'All Crops' && post.crop.toLowerCase() !== selectedCrop.toLowerCase()) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && post.problemCategory !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(q);
        const matchesQuestion = post.question.toLowerCase().includes(q);
        const matchesCrop = post.crop.toLowerCase().includes(q);
        const matchesAuthor = post.farmerName.toLowerCase().includes(q);
        const matchesLocation = post.farmerLocation.toLowerCase().includes(q);
        return matchesTitle || matchesQuestion || matchesCrop || matchesAuthor || matchesLocation;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'most_helpful') {
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      }
      if (sortBy === 'most_replies') {
        return (b.replies?.length || 0) - (a.replies?.length || 0);
      }
      // default newest
      return 0;
    });
  }, [posts, feedFilter, selectedCrop, selectedCategory, searchQuery, sortBy, currentUser?.id]);

  const urgentCount = posts.filter((p) => p.urgency === 'urgent').length;
  const resolvedCount = posts.filter((p) => p.status === 'resolved').length;

  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto" id="community-feed-container">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KisanSetu Peer-to-Peer Agronomic Community</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display">
            Farmer Problem & Query Feed
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Direct farmer-to-farmer knowledge exchange, pest identification, emergency crop salvage advice, and mandi price discussions. Connect directly with agricultural officers, FPO agronomists, and experienced farmers.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-slate-400 block text-[11px]">Total Queries</span>
              <span className="text-white font-bold text-lg">{posts.length}</span>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-rose-300 block text-[11px]">🚨 Urgent Issues</span>
              <span className="text-rose-400 font-bold text-lg">{urgentCount}</span>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-emerald-300 block text-[11px]">✅ Resolved Cases</span>
              <span className="text-emerald-400 font-bold text-lg">{resolvedCount}</span>
            </div>
            <div className="p-3 bg-white/5 backdrop-blur-xs rounded-xl border border-white/10">
              <span className="text-teal-300 block text-[11px]">Active Advisory</span>
              <span className="text-white font-bold text-xs flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>KVK Scientists Live</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE NEW QUERY / PROBLEM POST CARD (INLINE COMPOSER) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
        {!isComposerOpen ? (
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3.5 flex-1 min-w-[240px]">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-200">
                {currentUser?.name ? currentUser.name.charAt(0) : '🌾'}
              </div>
              <button
                type="button"
                onClick={() => setIsComposerOpen(true)}
                className="flex-1 text-left px-4 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500 transition-colors cursor-pointer"
              >
                Having a crop disease, pest attack, or mandi price query? Ask the community...
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer shrink-0"
              id="btn-ask-query"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Query / Problem</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreatePost} className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4 text-emerald-700" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base font-display">
                  Post Agricultural Problem or Query
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Select Urgency */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Urgency Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'urgent', label: '🚨 Urgent (Crop at risk)', desc: 'Needs rapid pesticide/salvage response' },
                  { id: 'moderate', label: '⚠️ Moderate Advice', desc: 'Seeking recommendations in 24-48 hrs' },
                  { id: 'inquiry', label: 'ℹ️ General Query', desc: 'Price, variety, or scheme question' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setNewUrgency(u.id as ProblemUrgency)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      newUrgency === u.id
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600 text-emerald-950 font-semibold'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-semibold">{u.label}</div>
                    <div className="text-[10px] text-slate-500 font-normal mt-0.5">{u.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Problem Title / Subject <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g., Severe leaf curling & yellowing on 40-day BT Cotton crop"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                id="input-post-title"
              />
            </div>

            {/* Crop & Category Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Affected Crop <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  id="select-post-crop"
                >
                  {POPULAR_CROPS.filter((c) => c !== 'All Crops').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Problem Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProblemCategory)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  id="select-post-category"
                >
                  {PROBLEM_CATEGORIES.filter((cat) => cat.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Detailed Symptoms & Farm Situation <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Describe: When did it start? What symptoms do you see on leaves/roots? Have you sprayed any chemicals or insecticides? Crop stage, acre size..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 leading-relaxed"
                id="textarea-post-question"
              />
            </div>

            {/* IMAGE ATTACHMENT SECTION */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Attach Crop Photo (High Resolution)
              </label>

              {/* Upload Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-4 sm:p-5 text-center transition-colors ${
                  dragActive
                    ? 'border-emerald-500 bg-emerald-50/60'
                    : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                  className="hidden"
                  id="feed-file-upload"
                />

                {!newImageUrl ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      Drag and drop crop photograph here, or{' '}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-emerald-700 underline font-bold cursor-pointer"
                      >
                        browse files
                      </button>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports JPG, PNG, WEBP (Photos of pest underside, leaves, or waterlogging)
                    </p>
                  </div>
                ) : (
                  <div className="relative inline-block max-w-sm">
                    <img
                      src={newImageUrl}
                      alt="Crop Attachment Preview"
                      className="max-h-48 rounded-xl object-cover border border-slate-200 shadow-xs"
                      referrerPolicy="no-referrer"
                    />
                    <button
                      type="button"
                      onClick={() => setNewImageUrl('')}
                      className="absolute -top-2 -right-2 p-1.5 bg-rose-600 text-white rounded-full shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Sample Photo Presets for Quick Testing */}
              <div className="pt-1">
                <span className="text-[11px] text-slate-500 block mb-1.5">
                  Or select realistic field sample photo:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_PHOTOS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setNewImageUrl(preset.url);
                        setNewCrop(preset.crop);
                        setNewCategory(preset.category);
                      }}
                      className="text-[11px] px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3 h-3 text-slate-400" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Phone Assistance Option */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Share phone number (<strong>{currentUser?.phone || '+91 98480 23456'}</strong>) so agronomists and farmers can call directly for urgent solutions
                </span>
              </div>
              <input
                type="checkbox"
                checked={includePhone}
                onChange={(e) => setIncludePhone(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !newTitle.trim() || !newQuestion.trim()}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                id="btn-submit-post"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish to Community</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Top Filters & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
            {[
              { id: 'all', label: 'All Queries' },
              { id: 'urgent', label: '🚨 Urgent' },
              { id: 'unresolved', label: '⏳ Needs Solution' },
              { id: 'resolved', label: '✅ Resolved' },
              { id: 'my_posts', label: '👤 My Queries' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFeedFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  feedFilter === tab.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symptom, pesticide, crop, farmer name..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
              id="input-feed-search"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Secondary Filters Bar (Crop, Category, Sort) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Filter:</span>
            </span>

            {/* Crop Dropdown */}
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden cursor-pointer"
            >
              {POPULAR_CROPS.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden cursor-pointer"
            >
              {PROBLEM_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-hidden cursor-pointer font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="most_helpful">Most Helpful (Likes)</option>
              <option value="most_replies">Most Solutions</option>
            </select>
          </div>
        </div>
      </div>

      {/* COMMUNITY POSTS LIST */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Community Queries Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No agricultural queries match your current filters. Try changing your crop or category selection, or post a new problem directly.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCrop('All Crops');
                setSelectedCategory('all');
                setSearchQuery('');
                setFeedFilter('all');
              }}
              className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isLiked = currentUser?.id ? (post.likes || []).includes(currentUser.id) : false;
            const isAuthor = currentUser?.id && post.farmerId === currentUser.id;
            const isAdmin = currentUser?.role === 'admin';
            const isRepliesOpen = expandedRepliesMap[post.id] ?? (post.replies && post.replies.length > 0);
            const urgencyInfo = getUrgencyBadge(post.urgency);
            const roleInfo = getRoleBadge(post.farmerRole);

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                id={`post-card-${post.id}`}
              >
                {/* Post Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100">
                  <div className="flex items-start justify-between gap-3">
                    {/* Farmer details */}
                    <div className="flex items-center gap-3">
                      <div
                        onClick={() => post.farmerId && onOpenProfile?.(post.farmerId)}
                        className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm shrink-0 border border-emerald-200 cursor-pointer overflow-hidden"
                        title={`View ${post.farmerName}'s profile`}
                      >
                        {post.farmerAvatar ? (
                          <img
                            src={post.farmerAvatar}
                            alt={post.farmerName}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          post.farmerName.charAt(0)
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            onClick={() => post.farmerId && onOpenProfile?.(post.farmerId)}
                            className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors cursor-pointer"
                          >
                            {post.farmerName}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${roleInfo.className}`}>
                            {roleInfo.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{post.farmerLocation}</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{post.createdAt}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Urgency Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <span className={`text-[11px] px-2.5 py-1 rounded-lg border ${urgencyInfo.className}`}>
                        {urgencyInfo.label}
                      </span>
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border ${
                          post.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {post.status === 'resolved' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Resolved</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Needs Solution</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Post Body */}
                <div className="p-4 sm:p-5 space-y-3">
                  {/* Category & Crop Pills */}
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
                      <Wheat className="w-3 h-3" />
                      <span>{post.crop}</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                      {getCategoryBadge(post.problemCategory)}
                    </span>
                  </div>

                  {/* Post Title */}
                  <h3 className="text-base font-bold text-slate-900 font-display leading-snug">
                    {post.title}
                  </h3>

                  {/* Detailed Description */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {post.question}
                  </p>

                  {/* Attached Image Thumbnail */}
                  {post.imageUrl && (
                    <div className="pt-2">
                      <div
                        onClick={() => setZoomedImage({ url: post.imageUrl!, title: post.title })}
                        className="relative max-w-md max-h-72 rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group shadow-xs"
                      >
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                          <ExternalLink className="w-4 h-4" />
                          <span>Click to expand high-res photo</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Direct Phone Call Banner if Shared */}
                  {post.farmerPhone && (
                    <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200 flex items-center justify-between text-xs mt-2">
                      <div className="flex items-center gap-2 text-emerald-900">
                        <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>
                          <strong>Direct Farmer Assistance:</strong> Farmer is open to telephone consultation.
                        </span>
                      </div>
                      <a
                        href={`tel:${post.farmerPhone}`}
                        className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shrink-0 transition-colors flex items-center gap-1.5 text-[11px]"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Farmer</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Post Action Toolbar */}
                <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Like / Helpful Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleLike(post.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-2xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                      id={`like-btn-${post.id}`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-transform ${
                          isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-400'
                        }`}
                      />
                      <span>{(post.likes || []).length} Helpful</span>
                    </button>

                    {/* Replies / Solutions Accordion Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRepliesMap((prev) => ({
                          ...prev,
                          [post.id]: !isRepliesOpen,
                        }))
                      }
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
                      id={`replies-toggle-${post.id}`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>{(post.replies || []).length} Solutions & Advice</span>
                      {isRepliesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={() => handleShare(post.id)}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
                      title="Share link"
                    >
                      {copiedPostId === post.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Resolution & Management Toolbar */}
                  <div className="flex items-center gap-2">
                    {(isAuthor || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => handleMarkResolved(post.id)}
                        className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                          post.status === 'resolved'
                            ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white border-transparent'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{post.status === 'resolved' ? 'Reopen Query' : 'Mark Resolved'}</span>
                      </button>
                    )}

                    {(isAuthor || isAdmin) && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Solutions / Comments Discussion Thread */}
                {isRepliesOpen && (
                  <div className="px-4 sm:px-5 py-4 border-t border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Peer Advice & Agronomic Solutions ({(post.replies || []).length})
                      </h4>
                      {post.status === 'resolved' && (
                        <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Solution Accepted
                        </span>
                      )}
                    </div>

                    {(post.replies || []).length === 0 ? (
                      <p className="text-xs text-slate-500 py-2 italic">
                        No solutions suggested yet. Be the first farmer or agricultural expert to reply!
                      </p>
                    ) : (
                      <div className="space-y-2.5">
                        {post.replies.map((reply) => {
                          const isResolvedAnswer = post.resolvedReplyId === reply.id;
                          const replierRole = getRoleBadge(reply.authorRole);

                          return (
                            <div
                              key={reply.id}
                              className={`p-3.5 rounded-xl border text-xs transition-colors ${
                                isResolvedAnswer
                                  ? 'bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-300'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              {isResolvedAnswer && (
                                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] mb-2 pb-1.5 border-b border-emerald-200">
                                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>🏆 Accepted Working Solution by Post Author</span>
                                </div>
                              )}

                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] overflow-hidden">
                                    {reply.authorAvatar ? (
                                      <img
                                        src={reply.authorAvatar}
                                        alt={reply.authorName}
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                      />
                                    ) : (
                                      reply.authorName.charAt(0)
                                    )}
                                  </div>
                                  <span className="font-semibold text-slate-900">{reply.authorName}</span>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${replierRole.className}`}>
                                    {replierRole.label}
                                  </span>
                                  <span className="text-[10px] text-slate-400">• {reply.createdAt}</span>
                                </div>

                                {/* Author Accept Solution Button */}
                                {isAuthor && post.status !== 'resolved' && (
                                  <button
                                    type="button"
                                    onClick={() => handleMarkResolved(post.id, reply.id)}
                                    className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold transition-colors cursor-pointer flex items-center gap-1"
                                  >
                                    <Check className="w-3 h-3" />
                                    <span>Accept Solution</span>
                                  </button>
                                )}
                              </div>

                              <p className="text-slate-700 leading-relaxed whitespace-pre-line pl-8">
                                {reply.text}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* New Reply Box */}
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={replyInputMap[post.id] || ''}
                        onChange={(e) =>
                          setReplyInputMap((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddReply(post.id);
                          }
                        }}
                        placeholder="Suggest pesticide dosage, remedy, or experience..."
                        className="flex-1 px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                        id={`input-reply-${post.id}`}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddReply(post.id)}
                        disabled={!replyInputMap[post.id]?.trim()}
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-40 shrink-0"
                        id={`btn-reply-${post.id}`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* LIGHTBOX MODAL FOR ZOOMED ATTACHMENT */}
      {zoomedImage && (
        <div
          onClick={() => setZoomedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-zoom-out animate-in fade-in duration-150"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={zoomedImage.url}
              alt={zoomedImage.title}
              className="w-auto h-auto max-w-full max-h-[82vh] rounded-2xl object-contain shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-center mt-3 text-white text-xs font-medium bg-black/50 py-1.5 px-4 rounded-full max-w-lg mx-auto">
              {zoomedImage.title} — Click anywhere to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
