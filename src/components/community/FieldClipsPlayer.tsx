import React, { useState } from 'react';
import { KisanPost, SavedKnowledgeCategory } from '../../types/community';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  MapPin,
  Sprout,
  UserPlus,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Plus,
} from 'lucide-react';

interface FieldClipsPlayerProps {
  clips: KisanPost[];
  currentUserId: string;
  onLike: (postId: string) => void;
  onHelpful: (postId: string) => void;
  onShare: (post: KisanPost) => void;
  onSave: (postId: string, category: SavedKnowledgeCategory) => void;
  onOpenProfile: (authorId: string) => void;
  onOpenComments: (post: KisanPost) => void;
  onToggleFollow: (authorId: string) => void;
  onCreateClip: () => void;
}

export const FieldClipsPlayer: React.FC<FieldClipsPlayerProps> = ({
  clips,
  currentUserId,
  onLike,
  onHelpful,
  onShare,
  onSave,
  onOpenProfile,
  onOpenComments,
  onToggleFollow,
  onCreateClip,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  if (clips.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <Sprout className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-slate-900 text-lg">No Field Clips Yet</h3>
        <p className="text-slate-600 text-xs max-w-md mx-auto">
          Be the first farmer to record and share a 30-second field clip of your crop progress or innovative technique.
        </p>
        <button
          type="button"
          onClick={onCreateClip}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Field Clip</span>
        </button>
      </div>
    );
  }

  const currentClip = clips[activeIndex] || clips[0];
  const isLiked = currentClip.likes?.includes(currentUserId);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % clips.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + clips.length) % clips.length);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-md mx-auto relative bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 aspect-[9/16] max-h-[720px] flex flex-col justify-between">
      {/* Video / Visual Layer */}
      <div className="absolute inset-0 z-0 bg-black">
        {currentClip.videoUrl ? (
          <video
            key={currentClip.id}
            src={currentClip.videoUrl}
            poster={currentClip.thumbnailUrl || (currentClip.mediaUrls && currentClip.mediaUrls[0])}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
            onClick={() => setIsPlaying(!isPlaying)}
          />
        ) : (
          <img
            src={
              currentClip.mediaUrls?.[0] ||
              currentClip.thumbnailUrl ||
              'https://images.unsplash.com/photo-1594771804886-a933bb2d609b?w=900&auto=format&fit=crop&q=80'
            }
            alt={currentClip.title}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-xs text-xs font-bold flex items-center gap-1">
            <span>🎥 Field Clips</span>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-black/50 text-[11px] font-semibold border border-white/20">
            {activeIndex + 1} / {clips.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-xs text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onCreateClip}
            className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Post Clip</span>
          </button>
        </div>
      </div>

      {/* Center Nav Controls (Prev / Next) */}
      <div className="relative z-10 flex items-center justify-between px-2 pointer-events-none">
        <button
          type="button"
          onClick={handlePrev}
          className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors pointer-events-auto cursor-pointer"
          title="Previous Clip"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors pointer-events-auto cursor-pointer"
          title="Next Clip"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Information & Right Sidebar Actions */}
      <div className="relative z-10 p-5 flex items-end justify-between gap-4 text-white">
        {/* Left: Author & Description */}
        <div className="flex-1 space-y-2.5 text-xs drop-shadow-md">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenProfile(currentClip.authorId)}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center overflow-hidden border border-white/80 shadow-xs cursor-pointer"
            >
              {currentClip.authorAvatar ? (
                <img
                  src={currentClip.authorAvatar}
                  alt={currentClip.authorName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span>{currentClip.authorName.charAt(0)}</span>
              )}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenProfile(currentClip.authorId)}
                  className="font-bold text-white text-sm hover:text-emerald-300 text-left transition-colors"
                >
                  {currentClip.authorName}
                </button>
                <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.2 rounded font-semibold">
                  {currentClip.authorReputation || 'Farmer'}
                </span>
              </div>
              <span className="text-[11px] text-white/80 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{currentClip.location}</span>
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 font-bold text-[11px]">
                🌱 {currentClip.crop}
              </span>
              {currentClip.cropVariety && (
                <span className="px-2 py-0.5 rounded-md bg-black/60 font-semibold text-[11px]">
                  {currentClip.cropVariety}
                </span>
              )}
              {currentClip.cropAgeDays && (
                <span className="px-2 py-0.5 rounded-md bg-teal-800/80 font-semibold text-[11px]">
                  {currentClip.cropAgeDays} Days Old
                </span>
              )}
            </div>

            <h4 className="font-bold text-white text-sm leading-snug">{currentClip.title}</h4>
            <p className="text-white/90 text-xs line-clamp-2 leading-relaxed">
              {currentClip.content}
            </p>
          </div>
        </div>

        {/* Right: Floating Social Actions */}
        <div className="flex flex-col items-center gap-3.5 shrink-0">
          {/* Like */}
          <button
            type="button"
            onClick={() => onLike(currentClip.id)}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div
              className={`p-3 rounded-full backdrop-blur-md transition-transform group-hover:scale-110 ${
                isLiked ? 'bg-rose-600 text-white' : 'bg-black/50 text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-white' : ''}`} />
            </div>
            <span className="text-[10px] font-bold">{currentClip.likes?.length || 0}</span>
          </button>

          {/* Comments Discussion */}
          <button
            type="button"
            onClick={() => onOpenComments(currentClip)}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md transition-transform group-hover:scale-110 text-white">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[10px] font-bold">{currentClip.comments?.length || 0}</span>
          </button>

          {/* Save to Knowledge */}
          <button
            type="button"
            onClick={() => onSave(currentClip.id, 'Farming Tips')}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md transition-transform group-hover:scale-110 text-white">
              <Bookmark className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Save</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={() => onShare(currentClip)}
            className="flex flex-col items-center gap-1 text-white cursor-pointer group"
          >
            <div className="p-3 rounded-full bg-black/50 backdrop-blur-md transition-transform group-hover:scale-110 text-white">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
