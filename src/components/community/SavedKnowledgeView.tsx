import React, { useState } from 'react';
import { KisanPost, SavedKnowledgeCategory } from '../../types/community';
import {
  BookmarkCheck,
  Search,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
  Sparkles,
  FolderOpen,
  Sprout,
  Edit2,
  Check,
} from 'lucide-react';

interface SavedItem {
  id: string;
  userId: string;
  postId: string;
  category: SavedKnowledgeCategory;
  savedAt: string;
  post: KisanPost;
  personalNotes?: string;
}

interface SavedKnowledgeViewProps {
  savedItems: SavedItem[];
  onRemoveSaved: (postId: string) => void;
  onOpenPost: (postId: string) => void;
  onOpenProfile: (authorId: string) => void;
}

const CATEGORIES: { label: SavedKnowledgeCategory; icon: string }[] = [
  { label: 'Crop Solutions', icon: '🌾' },
  { label: 'Farming Tips', icon: '💡' },
  { label: 'Pest Solutions', icon: '🐛' },
  { label: 'Machinery', icon: '🚜' },
  { label: 'Irrigation', icon: '💧' },
  { label: 'Other', icon: '📁' },
];

export const SavedKnowledgeView: React.FC<SavedKnowledgeViewProps> = ({
  savedItems,
  onRemoveSaved,
  onOpenPost,
  onOpenProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const filtered = savedItems.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.post.title.toLowerCase().includes(q) ||
        item.post.content.toLowerCase().includes(q) ||
        item.post.crop.toLowerCase().includes(q) ||
        (item.personalNotes && item.personalNotes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-emerald-300" />
              <span>My Saved Krishi Knowledge</span>
            </h3>
            <p className="text-xs text-emerald-100 max-w-xl">
              Your personalized reference library of verified crop solutions, spray formulas, and farming practices.
            </p>
          </div>
          <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-xs text-center shrink-0">
            <span className="text-[11px] uppercase tracking-wide opacity-80 block">Saved Guides</span>
            <strong className="text-xl font-bold">{savedItems.length}</strong>
          </div>
        </div>
      </div>

      {/* Category Folders Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl font-bold transition-colors shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Knowledge Folders ({savedItems.length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = savedItems.filter((i) => i.category === cat.label).length;
          const isSelected = selectedCategory === cat.label;
          return (
            <button
              key={cat.label}
              type="button"
              onClick={() => setSelectedCategory(cat.label)}
              className={`px-3.5 py-2 rounded-xl font-semibold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span className="opacity-70 font-mono text-[11px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search saved solutions, crops, symptoms, or personal notes..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-slate-900"
        />
      </div>

      {/* Saved Items Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{item.post.crop}</span>
                  </span>

                  <span className="px-2 py-0.5 rounded-md font-semibold bg-amber-50 text-amber-800 border border-amber-200 text-[11px]">
                    📁 {item.category}
                  </span>
                </div>

                <h4
                  onClick={() => onOpenPost(item.post.id)}
                  className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors cursor-pointer line-clamp-2"
                >
                  {item.post.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {item.post.content}
                </p>

                {item.post.mediaUrls && item.post.mediaUrls[0] && (
                  <div
                    onClick={() => onOpenPost(item.post.id)}
                    className="h-32 rounded-xl overflow-hidden bg-black cursor-pointer group"
                  >
                    <img
                      src={item.post.mediaUrls[0]}
                      alt={item.post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Personal Notes Box */}
                {item.personalNotes ? (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold block text-[10px] uppercase tracking-wide text-amber-800">
                      My Personal Field Note:
                    </span>
                    <p className="font-medium text-[11px]">{item.personalNotes}</p>
                  </div>
                ) : null}
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => onOpenProfile(item.post.authorId)}
                  className="text-slate-600 hover:text-emerald-800 font-semibold truncate text-[11px]"
                >
                  By {item.post.authorName}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onOpenPost(item.post.id)}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>View Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveSaved(item.post.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-base">No Saved Items in this Category</h4>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            Click the bookmark icon on any helpful field post or crop problem to save it to your library.
          </p>
        </div>
      )}
    </div>
  );
};
