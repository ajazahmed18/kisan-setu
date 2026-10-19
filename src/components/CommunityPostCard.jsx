import { useState } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Phone,
  UserPlus,
  UserCheck,
  Send,
  Award,
  ChevronDown,
  ChevronUp,
  Trash2,
  ExternalLink,
  Check
} from "lucide-react";
export const CommunityPostCard = ({
  post,
  currentUser,
  onAddReply,
  onToggleLike,
  onToggleFollow,
  isFollowingAuthor,
  onOpenProfile,
  onMarkResolved,
  onDeletePost
}) => {
  const [showReplies, setShowReplies] = useState(post.replies.length > 0);
  const [newReplyText, setNewReplyText] = useState("");
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [copied, setCopied] = useState(false);
  const isLiked = currentUser?.id ? post.likes?.includes(currentUser.id) : false;
  const isAuthor = currentUser?.id && post.farmerId === currentUser.id;
  const isAdmin = currentUser?.role === "admin";
  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case "urgent":
        return {
          label: "\u{1F6A8} Urgent Crop Issue",
          className: "bg-rose-50 text-rose-800 border-rose-200 font-semibold"
        };
      case "moderate":
        return {
          label: "\u26A0\uFE0F Moderate Advice Needed",
          className: "bg-amber-50 text-amber-800 border-amber-200 font-medium"
        };
      default:
        return {
          label: "\u2139\uFE0F General Inquiry",
          className: "bg-blue-50 text-blue-800 border-blue-200 font-medium"
        };
    }
  };
  const getCategoryLabel = (category) => {
    switch (category) {
      case "pest_disease":
        return "\u{1F41B} Pest & Disease Attack";
      case "crop_health":
        return "\u{1F342} Leaf & Crop Health";
      case "weather_damage":
        return "\u{1F327}\uFE0F Weather & Flood Damage";
      case "market_mandi":
        return "\u{1F4C8} Mandi & Price Query";
      case "seeds_fertilizer":
        return "\u{1F9EA} Seed & Fertilizer";
      case "machinery":
        return "\u{1F69C} Machinery & Drip";
      case "government_scheme":
        return "\u{1F3DB}\uFE0F Govt Schemes & PM-Kisan";
      default:
        return "\u{1F4A1} General Advice";
    }
  };
  const getRoleBadge = (role) => {
    switch (role) {
      case "farmer":
        return { label: "Farmer", className: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "fpo":
        return { label: "FPO Co-Op", className: "bg-blue-50 text-blue-800 border-blue-200" };
      case "admin":
        return { label: "Agri Scientist", className: "bg-purple-50 text-purple-800 border-purple-200" };
      case "market_admin":
      case "market":
        return { label: "Market Admin", className: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      default:
        return { label: "Member", className: "bg-slate-100 text-slate-700 border-slate-200" };
    }
  };
  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!newReplyText.trim()) return;
    onAddReply(post.id, newReplyText.trim());
    setNewReplyText("");
    setShowReplies(true);
  };
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2e3);
  };
  const urgencyInfo = getUrgencyBadge(post.urgency);
  const authorRoleInfo = getRoleBadge(post.farmerRole);
  return <article className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden text-left">
      {
    /* Top Meta Bar */
  }
      <div className="p-4 sm:p-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          {
    /* Author info */
  }
          <div className="flex items-center gap-3">
            <button
    onClick={() => post.farmerId && onOpenProfile(post.farmerId)}
    className="relative shrink-0 cursor-pointer focus:outline-hidden"
    title={`View ${post.farmerName}'s profile`}
  >
              {post.farmerAvatar ? <img
    src={post.farmerAvatar}
    alt={post.farmerName}
    className="w-11 h-11 rounded-xl object-cover border border-slate-200"
    referrerPolicy="no-referrer"
  /> : <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200">
                  {post.farmerName.charAt(0)}
                </div>}
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <button
    onClick={() => post.farmerId && onOpenProfile(post.farmerId)}
    className="font-semibold text-slate-900 text-sm hover:text-emerald-700 transition-colors cursor-pointer text-left"
  >
                  {post.farmerName}
                </button>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${authorRoleInfo.className}`}>
                  {authorRoleInfo.label}
                </span>

                {
    /* Follow Author Button (if not self) */
  }
                {post.farmerId && currentUser?.id !== post.farmerId && <button
    onClick={() => onToggleFollow(post.farmerId, post.farmerName)}
    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition-all cursor-pointer flex items-center gap-1 ${isFollowingAuthor ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300" : "bg-slate-900 text-white border-transparent hover:bg-slate-800"}`}
  >
                    {isFollowingAuthor ? <>
                        <UserCheck className="w-3 h-3" />
                        <span>Following</span>
                      </> : <>
                        <UserPlus className="w-3 h-3" />
                        <span>Follow</span>
                      </>}
                  </button>}
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

          {
    /* Status and Urgency Badges */
  }
          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            <span className={`text-[11px] px-2.5 py-1 rounded-lg border ${urgencyInfo.className}`}>
              {urgencyInfo.label}
            </span>
            <span
    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 border ${post.status === "resolved" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"}`}
  >
              {post.status === "resolved" ? <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resolved</span>
                </> : <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Needs Solution</span>
                </>}
            </span>
          </div>
        </div>
      </div>

      {
    /* Main Content */
  }
      <div className="p-4 sm:p-5 space-y-3">
        {
    /* Tags */
  }
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold flex items-center gap-1">
            <span>Crop:</span>
            <span>{post.crop}</span>
          </span>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
            {getCategoryLabel(post.problemCategory)}
          </span>
        </div>

        {
    /* Title */
  }
        <h3 className="text-base font-bold text-slate-900 font-display leading-snug">
          {post.title}
        </h3>

        {
    /* Detailed Question Body */
  }
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {post.question}
        </p>

        {
    /* Attached Photo */
  }
        {post.imageUrl && <div className="pt-2">
            <div
    onClick={() => setShowImageZoom(true)}
    className="relative max-w-md max-h-72 rounded-xl overflow-hidden border border-slate-200 cursor-pointer group shadow-xs"
  >
              <img
    src={post.imageUrl}
    alt={post.title}
    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
    referrerPolicy="no-referrer"
  />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                <ExternalLink className="w-4 h-4" />
                <span>Click to expand image</span>
              </div>
            </div>
          </div>}

        {
    /* Farmer Direct Call Banner if provided */
  }
        {post.farmerPhone && <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between text-xs mt-2">
            <div className="flex items-center gap-2 text-emerald-900">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Urgent Advice Needed:</strong> Farmer has enabled direct phone assistance.
              </span>
            </div>
            <a
    href={`tel:${post.farmerPhone}`}
    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shrink-0 transition-colors flex items-center gap-1 text-[11px]"
  >
              <Phone className="w-3 h-3" />
              <span>Call Farmer</span>
            </a>
          </div>}
      </div>

      {
    /* Action Toolbar */
  }
      <div className="px-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 sm:gap-3">
          {
    /* Like / Upvote Button */
  }
          <button
    onClick={() => onToggleLike(post.id)}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${isLiked ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"}`}
  >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
            <span>{post.likes?.length || 0} Helpful</span>
          </button>

          {
    /* Replies Toggle Button */
  }
          <button
    onClick={() => setShowReplies(!showReplies)}
    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors cursor-pointer"
  >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>{post.replies.length} Solutions & Advice</span>
            {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {
    /* Share Link */
  }
          <button
    onClick={handleShare}
    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors cursor-pointer"
    title="Share post"
  >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {
    /* Author / Admin Resolution Control */
  }
        <div className="flex items-center gap-1.5">
          {(isAuthor || isAdmin) && onMarkResolved && <button
    onClick={() => onMarkResolved(post.id)}
    className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold border transition-colors cursor-pointer flex items-center gap-1 ${post.status === "resolved" ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-100" : "bg-emerald-700 hover:bg-emerald-800 text-white border-transparent"}`}
  >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{post.status === "resolved" ? "Reopen Issue" : "Mark Resolved"}</span>
            </button>}

          {(isAuthor || isAdmin) && onDeletePost && <button
    onClick={() => {
      if (window.confirm("Delete this community post?")) {
        onDeletePost(post.id);
      }
    }}
    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
    title="Delete post"
  >
              <Trash2 className="w-3.5 h-3.5" />
            </button>}
        </div>
      </div>

      {
    /* Answers / Replies Accordion */
  }
      {showReplies && <div className="px-4 sm:px-5 py-4 border-t border-slate-200 bg-slate-50/50 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Expert Answers & Peer Advice ({post.replies.length})
          </h4>

          {post.replies.length === 0 ? <p className="text-xs text-slate-500 py-2 italic">
              No solutions suggested yet. Be the first farmer or agricultural expert to reply!
            </p> : <div className="space-y-2.5">
              {post.replies.map((reply) => {
    const isResolvedAnswer = post.resolvedReplyId === reply.id;
    const replierRole = getRoleBadge(reply.authorRole);
    return <div
      key={reply.id}
      className={`p-3 rounded-xl border text-xs transition-colors ${isResolvedAnswer ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-300" : "bg-white border-slate-200"}`}
    >
                    {isResolvedAnswer && <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] mb-2 pb-1.5 border-b border-emerald-200">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        <span>🏆 Accepted Working Solution by Farmer</span>
                      </div>}

                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {reply.authorAvatar ? <img
      src={reply.authorAvatar}
      alt={reply.authorName}
      className="w-6 h-6 rounded-md object-cover"
      referrerPolicy="no-referrer"
    /> : <div className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                            {reply.authorName.charAt(0)}
                          </div>}
                        <span className="font-semibold text-slate-900">{reply.authorName}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded border ${replierRole.className}`}>
                          {replierRole.label}
                        </span>
                        <span className="text-[10px] text-slate-400">• {reply.createdAt}</span>
                      </div>

                      {
      /* Accept as Solution Button (Author only) */
    }
                      {isAuthor && post.status !== "resolved" && onMarkResolved && <button
      onClick={() => onMarkResolved(post.id, reply.id)}
      className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold transition-colors cursor-pointer flex items-center gap-1"
    >
                          <Check className="w-3 h-3" />
                          <span>Accept Solution</span>
                        </button>}
                    </div>

                    <p className="text-slate-700 leading-relaxed whitespace-pre-line pl-8">
                      {reply.text}
                    </p>
                  </div>;
  })}
            </div>}

          {
    /* Quick Reply Form */
  }
          <form onSubmit={handleReplySubmit} className="pt-2 flex items-center gap-2">
            <input
    type="text"
    value={newReplyText}
    onChange={(e) => setNewReplyText(e.target.value)}
    placeholder="Write agronomic advice, pesticide dosage, or solution..."
    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
  />
            <button
    type="submit"
    disabled={!newReplyText.trim()}
    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer disabled:opacity-40"
  >
              <Send className="w-3.5 h-3.5" />
              <span>Reply</span>
            </button>
          </form>
        </div>}

      {
    /* Image Zoom Modal */
  }
      {showImageZoom && post.imageUrl && <div
    onClick={() => setShowImageZoom(false)}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs cursor-zoom-out"
  >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
    src={post.imageUrl}
    alt={post.title}
    className="w-auto h-auto max-w-full max-h-[85vh] rounded-2xl object-contain"
    referrerPolicy="no-referrer"
  />
            <p className="text-white text-xs text-center mt-2 font-medium">
              {post.title} (Click anywhere to close)
            </p>
          </div>
        </div>}
    </article>;
};
