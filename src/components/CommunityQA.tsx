import React, { useState, useEffect, useMemo } from 'react';
import { CommunityPost, UserProfile, ProblemCategory, FollowRelation } from '../types';
import { INITIAL_USERS } from '../data/mockData';
import { CommunityPostCard } from './CommunityPostCard';
import { NewProblemModal } from './NewProblemModal';
import { FarmerProfileModal } from './FarmerProfileModal';
import { FarmerNetworkDirectory } from './FarmerNetworkDirectory';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Users,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  UserCheck,
  Globe,
  Tag,
  ShieldCheck,
  Wheat,
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';

interface CommunityQAProps {
  posts: CommunityPost[];
  onAddPost: (post: Partial<CommunityPost>) => void;
  onAddReply: (postId: string, text: string) => void;
  currentUser?: UserProfile | null;
  usersList?: UserProfile[];
  onToggleLike?: (postId: string) => void;
  onMarkResolved?: (postId: string, replyId?: string) => void;
  onDeletePost?: (postId: string) => void;
}

export const CommunityQA: React.FC<CommunityQAProps> = ({
  posts,
  onAddPost,
  onAddReply,
  currentUser,
  usersList = INITIAL_USERS,
  onToggleLike,
  onMarkResolved,
  onDeletePost,
}) => {
  // Navigation tabs within Community
  const [activeTab, setActiveTab] = useState<'all' | 'following' | 'my_posts' | 'urgent' | 'directory'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showNewModal, setShowNewModal] = useState(false);

  // Profile modal inspection
  const [inspectedUserId, setInspectedUserId] = useState<string | null>(null);

  // Follows state
  const [followingIds, setFollowingIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kisan_following_ids');
      return saved ? JSON.parse(saved) : ['usr-officer-venkat', 'usr-fpo-ramana'];
    } catch {
      return ['usr-officer-venkat', 'usr-fpo-ramana'];
    }
  });

  // Sync follows to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kisan_following_ids', JSON.stringify(followingIds));
    } catch (e) {
      console.warn('Could not save following state', e);
    }
  }, [followingIds]);

  // Firestore real-time listener for follows if user is signed in
  useEffect(() => {
    if (!currentUser?.id) return;

    try {
      const followsCol = collection(db, 'follows');
      const unsubscribe = onSnapshot(
        followsCol,
        (snapshot) => {
          const remoteFollowing: string[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.followerId === currentUser.id && data.followingId) {
              remoteFollowing.push(data.followingId);
            }
          });
          if (remoteFollowing.length > 0) {
            setFollowingIds((prev) => Array.from(new Set([...prev, ...remoteFollowing])));
          }
        },
        (error) => {
          // Non-fatal if offline/unauthenticated
          console.warn('Follows snapshot notice:', error.message);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Follows collection hook notice:', err);
    }
  }, [currentUser?.id]);

  // Handle Follow / Unfollow toggle
  const handleToggleFollow = async (targetUserId: string, targetUserName?: string) => {
    const isCurrentlyFollowing = followingIds.includes(targetUserId);
    const updated = isCurrentlyFollowing
      ? followingIds.filter((id) => id !== targetUserId)
      : [...followingIds, targetUserId];

    setFollowingIds(updated);

    // Persist to Firestore if available
    if (currentUser?.id) {
      const followDocId = `${currentUser.id}_${targetUserId}`;
      const docRef = doc(db, 'follows', followDocId);
      try {
        if (isCurrentlyFollowing) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, {
            id: followDocId,
            followerId: currentUser.id,
            followerName: currentUser.name || 'Farmer',
            followingId: targetUserId,
            followingName: targetUserName || 'Member',
            createdAt: new Date().toISOString(),
          });
        }
      } catch (err) {
        // Non-blocking fallback handled
        console.warn('Firestore follow sync notice:', err);
      }
    }
  };

  // Build combined directory users
  const allCommunityUsers = useMemo(() => {
    const map = new Map<string, UserProfile>();
    // Add default initial users
    INITIAL_USERS.forEach((u) => map.set(u.id, u));
    usersList.forEach((u) => map.set(u.id, u));

    // Also extract distinct authors from posts
    posts.forEach((p) => {
      if (p.farmerId && !map.has(p.farmerId)) {
        map.set(p.farmerId, {
          id: p.farmerId,
          name: p.farmerName,
          role: p.farmerRole || 'farmer',
          phone: p.farmerPhone || '',
          location: p.farmerLocation,
          avatar: p.farmerAvatar,
          cropsGrown: p.crop ? [p.crop] : undefined,
          followersCount: 15,
          followingCount: 6,
          isVerified: true,
        });
      }
    });

    return Array.from(map.values());
  }, [usersList, posts]);

  // Inspected user object for profile modal
  const inspectedUser = useMemo(() => {
    if (!inspectedUserId) return null;
    return allCommunityUsers.find((u) => u.id === inspectedUserId) || null;
  }, [inspectedUserId, allCommunityUsers]);

  // Posts by inspected user
  const inspectedUserPosts = useMemo(() => {
    if (!inspectedUserId) return [];
    return posts.filter((p) => p.farmerId === inspectedUserId);
  }, [inspectedUserId, posts]);

  // Filtered posts logic
  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      // Tab filter
      if (activeTab === 'following') {
        if (!p.farmerId || !followingIds.includes(p.farmerId)) return false;
      } else if (activeTab === 'my_posts') {
        if (!currentUser?.id || p.farmerId !== currentUser.id) return false;
      } else if (activeTab === 'urgent') {
        if (p.urgency !== 'urgent') return false;
      }

      // Crop filter
      if (selectedCrop !== 'all' && p.crop !== selectedCrop) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.problemCategory !== selectedCategory) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchQuestion = p.question.toLowerCase().includes(q);
        const matchAuthor = p.farmerName.toLowerCase().includes(q);
        const matchLoc = p.farmerLocation.toLowerCase().includes(q);
        const matchCrop = p.crop.toLowerCase().includes(q);
        if (!matchTitle && !matchQuestion && !matchAuthor && !matchLoc && !matchCrop) {
          return false;
        }
      }

      return true;
    });
  }, [posts, activeTab, followingIds, currentUser?.id, selectedCrop, selectedCategory, searchQuery]);

  // Metrics
  const urgentCount = useMemo(() => posts.filter((p) => p.urgency === 'urgent').length, [posts]);
  const resolvedCount = useMemo(() => posts.filter((p) => p.status === 'resolved').length, [posts]);
  const myPostsCount = useMemo(
    () => (currentUser?.id ? posts.filter((p) => p.farmerId === currentUser.id).length : 0),
    [posts, currentUser?.id]
  );

  return (
    <div className="space-y-5 py-3 text-left max-w-5xl mx-auto">
      {/* Top Banner & Action Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>Public Farmer Community Feed</span>
                </span>
                <span className="text-xs text-emerald-300/80">• Visible to All App Users</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                Farmer Queries & Crop Clinic
              </h1>
              <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl mt-1 leading-relaxed">
                Upload crop problems, pest attacks, and mandi rate queries. Receive verified advice from
                fellow farmers, FPO agronomists, and follow agricultural specialists across India.
              </p>
            </div>

            {/* Post Problem CTA */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={() => setShowNewModal(true)}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Problem / Ask Query</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
              <span className="text-[11px] text-emerald-200/90 font-medium block">Active Queries</span>
              <span className="text-xl font-bold text-white font-mono mt-0.5 block">{posts.length}</span>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
              <span className="text-[11px] text-rose-300 font-medium block flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                <span>Urgent Crises</span>
              </span>
              <span className="text-xl font-bold text-rose-200 font-mono mt-0.5 block">{urgentCount}</span>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
              <span className="text-[11px] text-emerald-300 font-medium block">Resolved Solutions</span>
              <span className="text-xl font-bold text-emerald-300 font-mono mt-0.5 block">{resolvedCount}</span>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/10">
              <span className="text-[11px] text-emerald-200/90 font-medium block">Following Network</span>
              <span className="text-xl font-bold text-white font-mono mt-0.5 block">{followingIds.length} Farmers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <div className="flex items-center gap-1 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>All Queries & Problems</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {posts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('following')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'following'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Following Feed</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
              {followingIds.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('urgent')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'urgent'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>🚨 Urgent Crop Crises</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-900 font-mono">
              {urgentCount}
            </span>
          </button>

          {currentUser?.id && (
            <button
              onClick={() => setActiveTab('my_posts')}
              className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my_posts'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>My Queries</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
                {myPostsCount}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'directory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Discover Farmers & Experts</span>
          </button>
        </div>
      </div>

      {/* Conditional Content: Member Directory vs Feed */}
      {activeTab === 'directory' ? (
        <FarmerNetworkDirectory
          users={allCommunityUsers}
          currentUserId={currentUser?.id}
          followingIds={followingIds}
          onToggleFollow={handleToggleFollow}
          onOpenProfile={(uid) => setInspectedUserId(uid)}
        />
      ) : (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symptom, disease, crop, or farmer..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Crop & Category Selectors */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto text-xs">
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="all">All Crops</option>
                <option value="Cotton">Cotton</option>
                <option value="Rice (Paddy)">Rice (Paddy)</option>
                <option value="Red Chilli">Red Chilli</option>
                <option value="Tomato">Tomato</option>
                <option value="Maize">Maize</option>
                <option value="Soybean">Soybean</option>
                <option value="Turmeric">Turmeric</option>
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden"
              >
                <option value="all">All Categories</option>
                <option value="pest_disease">Pests & Diseases</option>
                <option value="crop_health">Crop Health & Blight</option>
                <option value="weather_damage">Weather & Waterlogging</option>
                <option value="market_mandi">Mandi & Prices</option>
                <option value="seeds_fertilizer">Seeds & Fertilizers</option>
                <option value="machinery">Machinery & Drip</option>
                <option value="government_scheme">Govt Schemes</option>
              </select>
            </div>
          </div>

          {/* Feed Empty States */}
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                {activeTab === 'following'
                  ? 'No queries from farmers you follow'
                  : activeTab === 'my_posts'
                  ? 'You haven’t posted any crop queries yet'
                  : 'No queries match your search'}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {activeTab === 'following'
                  ? 'Explore the directory to follow agronomists and experienced farmers to see their problems and advice here.'
                  : 'Have a question about fertilizer dosage, pest damage, or mandi prices? Post your query to get instant peer help.'}
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                {activeTab === 'following' ? (
                  <button
                    onClick={() => setActiveTab('directory')}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Discover Farmers to Follow →
                  </button>
                ) : (
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload Problem Now</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Post Cards Feed */
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <CommunityPostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onAddReply={onAddReply}
                  onToggleLike={onToggleLike || (() => {})}
                  onToggleFollow={handleToggleFollow}
                  isFollowingAuthor={post.farmerId ? followingIds.includes(post.farmerId) : false}
                  onOpenProfile={(uid) => setInspectedUserId(uid)}
                  onMarkResolved={onMarkResolved}
                  onDeletePost={onDeletePost}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Problem Modal */}
      <NewProblemModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSubmit={onAddPost}
        currentUser={currentUser}
      />

      {/* Inspect Farmer Profile Modal */}
      <FarmerProfileModal
        user={inspectedUser}
        isOpen={!!inspectedUserId}
        onClose={() => setInspectedUserId(null)}
        isFollowing={inspectedUserId ? followingIds.includes(inspectedUserId) : false}
        onToggleFollow={handleToggleFollow}
        userPosts={inspectedUserPosts}
        currentUserId={currentUser?.id}
      />
    </div>
  );
};

export { CommunityFeed } from './CommunityFeed';
