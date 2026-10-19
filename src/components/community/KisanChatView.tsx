import React, { useState } from 'react';
import { KisanMessage, FarmerProfile, KisanPost } from '../../types/community';
import {
  Send,
  Image as ImageIcon,
  MapPin,
  Sprout,
  CheckCheck,
  Search,
  MessageSquare,
  Sparkles,
  Phone,
  Paperclip,
  ExternalLink,
} from 'lucide-react';

interface KisanChatViewProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar?: string;
  activePartnerId?: string;
  onSelectPartner: (partnerId: string) => void;
  partnersList: {
    partnerId: string;
    partnerName: string;
    partnerAvatar?: string;
    partnerLocation: string;
    partnerRole: string;
    partnerCrops: string[];
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
  }[];
  messages: KisanMessage[];
  onSendMessage: (text: string, photoUrl?: string, sharedPost?: KisanPost) => void;
  onViewProfile: (farmerId: string) => void;
}

const QUICK_AGRICULTURAL_RESPONSES = [
  'Namaste brother! Did the spray remedy work?',
  'What was the exact chemical dosage per liter?',
  'Which mandi did you sell your lot at?',
  'How many quintals per acre did you harvest?',
  'Can I visit your field this weekend?',
  'We use drip fertigation, happy to share notes.',
];

export const KisanChatView: React.FC<KisanChatViewProps> = ({
  currentUserId,
  currentUserName,
  currentUserAvatar,
  activePartnerId,
  onSelectPartner,
  partnersList,
  messages,
  onSendMessage,
  onViewProfile,
}) => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [showPhotoInput, setShowPhotoInput] = useState(false);

  const activePartner = partnersList.find((p) => p.partnerId === activePartnerId) || partnersList[0];

  const filteredPartners = partnersList.filter(
    (p) =>
      p.partnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partnerLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.partnerCrops.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !photoUrl.trim()) return;
    onSendMessage(inputText.trim(), photoUrl.trim() || undefined);
    setInputText('');
    setPhotoUrl('');
    setShowPhotoInput(false);
  };

  const handleQuickSend = (text: string) => {
    onSendMessage(text);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[580px] max-h-[750px]">
      {/* Conversations List (Left Column) */}
      <div className="md:col-span-4 border-r border-slate-200 bg-slate-50/70 flex flex-col">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>Kisan Direct Chat</span>
            </h3>
            <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
              Farmer-to-Farmer
            </span>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farmer or crop..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Partners Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredPartners.length > 0 ? (
            filteredPartners.map((partner) => {
              const isSelected = partner.partnerId === activePartner?.partnerId;
              return (
                <button
                  key={partner.partnerId}
                  type="button"
                  onClick={() => onSelectPartner(partner.partnerId)}
                  className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-l-4 border-emerald-700'
                      : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-sm overflow-hidden border border-slate-200 shadow-2xs">
                      {partner.partnerAvatar ? (
                        <img
                          src={partner.partnerAvatar}
                          alt={partner.partnerName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span>{partner.partnerName.charAt(0)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <strong className="text-xs font-bold text-slate-900 truncate">
                        {partner.partnerName}
                      </strong>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {partner.lastMessageTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-1">
                      <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span className="truncate">{partner.partnerLocation}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 truncate font-medium">
                      {partner.lastMessage}
                    </p>

                    {partner.partnerCrops && partner.partnerCrops.length > 0 && (
                      <div className="flex items-center gap-1 mt-1 flex-wrap">
                        {partner.partnerCrops.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            className="text-[9px] bg-slate-200/80 text-slate-800 font-semibold px-1.5 py-0.2 rounded"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-slate-500 text-xs italic">
              No matching farmer conversations found.
            </div>
          )}
        </div>
      </div>

      {/* Active Message Thread (Right Column) */}
      <div className="md:col-span-8 flex flex-col bg-white">
        {activePartner ? (
          <>
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-3 bg-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onViewProfile(activePartner.partnerId)}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center text-sm overflow-hidden border border-slate-200 shadow-2xs hover:scale-105 transition-transform"
                >
                  {activePartner.partnerAvatar ? (
                    <img
                      src={activePartner.partnerAvatar}
                      alt={activePartner.partnerName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span>{activePartner.partnerName.charAt(0)}</span>
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onViewProfile(activePartner.partnerId)}
                      className="font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors text-left"
                    >
                      {activePartner.partnerName}
                    </button>
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold">
                      Farmer Peer
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-700" />
                    <span>{activePartner.partnerLocation}</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onViewProfile(activePartner.partnerId)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                View Farm Profile
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-linear-to-b from-slate-50/50 to-white">
              {messages.length > 0 ? (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed space-y-2 shadow-2xs ${
                          isMe
                            ? 'bg-emerald-700 text-white rounded-br-xs'
                            : 'bg-slate-100 text-slate-900 rounded-bl-xs border border-slate-200'
                        }`}
                      >
                        {/* Shared Post Card in Chat */}
                        {msg.sharedPost && (
                          <div className={`p-2.5 rounded-xl border text-xs ${
                            isMe ? 'bg-emerald-800/80 border-emerald-600' : 'bg-white border-slate-200'
                          }`}>
                            <span className="font-bold text-[10px] uppercase tracking-wide opacity-80 block mb-0.5">
                              Shared Field Post
                            </span>
                            <strong className="block truncate font-bold">{msg.sharedPost.title}</strong>
                            <p className="line-clamp-2 opacity-90 text-[11px] mt-0.5">
                              {msg.sharedPost.content}
                            </p>
                          </div>
                        )}

                        {/* Photo in Message */}
                        {msg.photoUrl && (
                          <div className="rounded-xl overflow-hidden max-h-56 bg-black">
                            <img
                              src={msg.photoUrl}
                              alt="Attached photo"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <p className="whitespace-pre-line">{msg.text}</p>
                      </div>

                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                        <span>{msg.createdAt}</span>
                        {isMe && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <strong className="text-slate-800 text-sm">Direct Farmer Communication</strong>
                  <p className="text-xs max-w-xs">
                    Start a conversation with {activePartner.partnerName} about crop management, mandi rates, or remedies.
                  </p>
                </div>
              )}
            </div>

            {/* Quick Response Chips */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-200 overflow-x-auto flex items-center gap-2 text-[11px]">
              <span className="text-slate-400 font-bold shrink-0 text-[10px] uppercase">
                Quick Reply:
              </span>
              {QUICK_AGRICULTURAL_RESPONSES.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickSend(chip)}
                  className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 rounded-lg whitespace-nowrap font-medium transition-colors cursor-pointer shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Message Input Form */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 space-y-2">
              {showPhotoInput && (
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Paste image URL (e.g. crop symptom photo)..."
                    className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPhotoInput(false)}
                    className="px-2.5 py-1 text-slate-600 hover:text-slate-900 font-bold"
                  >
                    Cancel
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPhotoInput(!showPhotoInput)}
                  className="p-2.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                  title="Attach Photo"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Write message to ${activePartner.partnerName}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden text-slate-900"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim() && !photoUrl.trim()}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-slate-500 text-xs">
            Select a fellow farmer to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};
