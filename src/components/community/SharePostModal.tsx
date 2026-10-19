import React, { useState } from 'react';
import { KisanPost, FarmerProfile } from '../../types/community';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  ExternalLink,
} from 'lucide-react';

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: KisanPost | null;
  farmers: FarmerProfile[];
  onShareInChat: (partnerId: string, text: string, post: KisanPost) => void;
  onRepostToFeed: (post: KisanPost, thoughts: string) => void;
}

export const SharePostModal: React.FC<SharePostModalProps> = ({
  isOpen,
  onClose,
  post,
  farmers,
  onShareInChat,
  onRepostToFeed,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(farmers[0]?.id || '');
  const [chatComment, setChatComment] = useState('');
  const [repostThoughts, setRepostThoughts] = useState('');
  const [shareTab, setShareTab] = useState<'chat' | 'repost' | 'external'>('chat');

  if (!isOpen || !post) return null;

  const postUrl = `${window.location.origin}/#community-post-${post.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${post.title}\n\n${post.content}\n\nRead more on Kisan Community: ${postUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartnerId) return;
    onShareInChat(selectedPartnerId, chatComment.trim() || 'Shared a helpful agricultural post with you', post);
    onClose();
  };

  const handleRepost = (e: React.FormEvent) => {
    e.preventDefault();
    onRepostToFeed(post, repostThoughts.trim());
    onClose();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `🌾 *${post.title}* (${post.crop})\n\n${post.content}\n\nShared via Kisan Community App.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="px-5 py-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-emerald-300" />
            <h3 className="font-bold text-sm">Share Kisan Post</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-3 border-b border-slate-200 text-xs font-bold text-slate-600 bg-slate-50">
          <button
            type="button"
            onClick={() => setShareTab('chat')}
            className={`py-2.5 border-b-2 cursor-pointer transition-colors ${
              shareTab === 'chat'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            💬 Kisan Chat
          </button>
          <button
            type="button"
            onClick={() => setShareTab('repost')}
            className={`py-2.5 border-b-2 cursor-pointer transition-colors ${
              shareTab === 'repost'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            🔄 Repost to Feed
          </button>
          <button
            type="button"
            onClick={() => setShareTab('external')}
            className={`py-2.5 border-b-2 cursor-pointer transition-colors ${
              shareTab === 'external'
                ? 'border-emerald-700 text-emerald-800 bg-white'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            📲 WhatsApp &amp; Link
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Post Snippet */}
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
              {post.crop} • {post.postType.replace('_', ' ')}
            </span>
            <h4 className="font-bold text-slate-900 truncate text-xs">{post.title}</h4>
            <p className="text-slate-600 text-[11px] line-clamp-2">{post.content}</p>
          </div>

          {shareTab === 'chat' && (
            <form onSubmit={handleSendToChat} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Select Farmer to Send To
                </label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                >
                  {farmers.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.district})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Message (Optional)
                </label>
                <input
                  type="text"
                  value={chatComment}
                  onChange={(e) => setChatComment(e.target.value)}
                  placeholder="Check out this crop remedy..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send via Direct Kisan Chat</span>
              </button>
            </form>
          )}

          {shareTab === 'repost' && (
            <form onSubmit={handleRepost} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Add Your Farming Perspective / Experience
                </label>
                <textarea
                  rows={3}
                  value={repostThoughts}
                  onChange={(e) => setRepostThoughts(e.target.value)}
                  placeholder="Why are you sharing this with your farmer followers? (e.g. Tried this in my cotton field and saw 20% higher yield)..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Repost to Kisan Feed</span>
              </button>
            </form>
          )}

          {shareTab === 'external' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <span>Share to WhatsApp Farmer Groups</span>
              </button>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  readOnly
                  value={postUrl}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
