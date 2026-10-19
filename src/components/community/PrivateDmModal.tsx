import React, { useState } from 'react';
import {
  X,
  Send,
  Image as ImageIcon,
  MessageSquare,
  CheckCircle2,
  Phone,
  MapPin,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { FarmerProfile, KisanChatMessage, KisanPost } from '../../types/community';

interface PrivateDmModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: FarmerProfile | null;
  currentUser: FarmerProfile;
  relatedPost?: KisanPost | null;
  existingMessages?: KisanChatMessage[];
  onSendMessage: (messageText: string, photoUrl?: string, relatedPostId?: string) => void;
  onOpenFullChat?: (partnerId: string) => void;
}

export const PrivateDmModal: React.FC<PrivateDmModalProps> = ({
  isOpen,
  onClose,
  recipient,
  currentUser,
  relatedPost,
  existingMessages = [],
  onSendMessage,
  onOpenFullChat,
}) => {
  const [text, setText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isSentSuccess, setIsSentSuccess] = useState(false);

  if (!isOpen || !recipient) return null;

  // Filter existing messages between current user and recipient
  const threadMessages = existingMessages.filter(
    (m) =>
      (m.senderId === currentUser.id && m.recipientId === recipient.id) ||
      (m.senderId === recipient.id && m.recipientId === currentUser.id)
  );

  const quickChips = [
    '🌿 నమస్తే! మీ అనుభవం లేదా మందుల డోస్ వివరాలు చెప్పగలరా? (Namaste! Can you share pesticide/dosage details?)',
    '💧 నీటి పారుదల మరియు ఎరువుల షెడ్యూల్ ఏమిటి? (What irrigation & fertilizer schedule worked?)',
    '📞 దీని గురించి ఫోన్ లో మాట్లాడదామా? (Can we discuss this over phone?)',
    '🛒 ఈ విత్తనాలు / పురుగు మందు ఎక్కడ కొనుగోలు చేశారు? (Where did you buy this seed/input?)',
  ];

  const handleSend = () => {
    if (!text.trim() && !selectedPhoto) return;
    onSendMessage(text.trim(), selectedPhoto || undefined, relatedPost?.id);
    setText('');
    setSelectedPhoto(null);
    setIsSentSuccess(true);
    setTimeout(() => {
      setIsSentSuccess(false);
    }, 2500);
  };

  const sampleFieldPhotos = [
    'https://images.unsplash.com/photo-1598880940371-c756e015fea1?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592417817098-8f3d69106093?w=400&auto=format&fit=crop&q=80',
  ];

  return (
    <div
      id="private-dm-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
    >
      <div
        id="private-dm-modal-card"
        className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-emerald-100 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-4 sm:p-5 relative shrink-0">
          <button
            type="button"
            id="btn-close-dm-modal"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer"
            aria-label="Close message box"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5 pr-8">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/20 text-white font-bold text-xl flex items-center justify-center overflow-hidden border-2 border-white/40 shadow-inner">
                {recipient.avatar ? (
                  <img
                    src={recipient.avatar}
                    alt={recipient.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{recipient.name.charAt(0)}</span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-emerald-900 rounded-full" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base text-white">{recipient.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-100 border border-emerald-400/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-300" />
                  Verified Farmer
                </span>
              </div>

              {/* Profession Display */}
              <p className="text-xs text-emerald-100 font-medium">
                {recipient.profession || `${recipient.farmingType} Farmer • ${recipient.mainCrops?.slice(0, 2).join(', ')}`}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-200">
                <MapPin className="w-3 h-3 text-emerald-300 shrink-0" />
                <span>
                  {recipient.village ? `${recipient.village}, ` : ''}
                  {recipient.district}, {recipient.state}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body / Conversation preview */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {/* Post Reference Banner (if DM was triggered from a post) */}
          {relatedPost && (
            <div
              id="dm-related-post-banner"
              className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-start gap-3 text-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                  <span>Regarding Post:</span>
                  <span className="bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded text-[10px] font-bold">
                    {relatedPost.crop}
                  </span>
                </div>
                <p className="text-slate-700 font-medium truncate mt-0.5">{relatedPost.title}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1">{relatedPost.content}</p>
              </div>
            </div>
          )}

          {/* Quick Message Chips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-700" />
              రైతు సలహా కోసం త్వరగా అడగండి (Quick Ask Suggestions):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  id={`btn-quick-chip-${idx}`}
                  onClick={() => setText(chip)}
                  className="text-[11px] px-2.5 py-1.5 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 border border-slate-200 rounded-xl transition-all text-left shadow-2xs cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Previous Messages Thread Preview */}
          {threadMessages.length > 0 ? (
            <div className="space-y-2.5 pt-2 border-t border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
                మునుపటి సందేశాలు (Recent Messages)
              </div>
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {threadMessages.map((m) => {
                  const isMine = m.senderId === currentUser.id;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs shadow-2xs ${
                          isMine
                            ? 'bg-emerald-700 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                        {m.photoUrl && (
                          <img
                            src={m.photoUrl}
                            alt="Attached crop observation"
                            className="mt-1.5 rounded-lg max-h-32 object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                        <span
                          className={`block text-[10px] mt-1 text-right ${
                            isMine ? 'text-emerald-200' : 'text-slate-400'
                          }`}
                        >
                          {m.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-slate-500 text-xs bg-white rounded-2xl border border-dashed border-slate-200 p-3">
              <p className="font-medium text-slate-700">ఈ రైతుకు మీ మొదటి వ్యక్తిగత సందేశం పంపండి</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Send your first private question or tip directly to {recipient.name}
              </p>
            </div>
          )}

          {/* Success toast */}
          {isSentSuccess && (
            <div className="p-2.5 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-bold">సందేశం పంపబడింది! (Message sent to private inbox)</span>
              </div>
              {onOpenFullChat && (
                <button
                  type="button"
                  id="btn-goto-full-chat"
                  onClick={() => {
                    onClose();
                    onOpenFullChat(recipient.id);
                  }}
                  className="font-bold text-emerald-900 underline text-[11px] cursor-pointer"
                >
                  View in Msgbox
                </button>
              )}
            </div>
          )}

          {/* Selected photo preview */}
          {selectedPhoto && (
            <div className="relative inline-block">
              <img
                src={selectedPhoto}
                alt="Selected attachment"
                className="w-20 h-20 rounded-xl object-cover border-2 border-emerald-500 shadow-sm"
                referrerPolicy="no-referrer"
              />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow-md hover:bg-red-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer / Composer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2.5 shrink-0">
          <div className="flex items-end gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl p-2 focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <textarea
                id="dm-message-input"
                rows={2}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Type private message to ${recipient.name} (సందేశం రాయండి)...`}
                className="w-full bg-transparent border-0 resize-none text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
              />
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-slate-500 text-[11px]">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">రైతు ప్రైవేట్ ఇన్‌బాక్స్ (Private DM)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Attach sample crop photo"
                    onClick={() => {
                      const nextPhoto = sampleFieldPhotos[Math.floor(Math.random() * sampleFieldPhotos.length)];
                      setSelectedPhoto(nextPhoto);
                    }}
                    className="p-1 hover:bg-slate-200 text-slate-600 rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Attach Photo</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              id="btn-send-private-dm"
              onClick={handleSend}
              disabled={!text.trim() && !selectedPhoto}
              className="h-12 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:hover:bg-emerald-700 text-white font-bold rounded-2xl flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Send</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Messages stay 100% private between you and {recipient.name}
            </span>
            {onOpenFullChat && (
              <button
                type="button"
                id="btn-open-full-chat-link"
                onClick={() => {
                  onClose();
                  onOpenFullChat(recipient.id);
                }}
                className="text-emerald-800 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open in Private Msgbox</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
