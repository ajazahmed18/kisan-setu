import {
  X,
  MapPin,
  Phone,
  CheckCircle,
  UserPlus,
  UserCheck,
  Wheat,
  MessageSquare
} from "lucide-react";
export const FarmerProfileModal = ({
  user,
  isOpen,
  onClose,
  isFollowing,
  onToggleFollow,
  userPosts,
  currentUserId
}) => {
  if (!isOpen || !user) return null;
  const isSelf = currentUserId === user.id;
  const getRoleBadge = (role) => {
    switch (role) {
      case "farmer":
        return { label: "Verified Farmer", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" };
      case "fpo":
        return { label: "FPO Co-Op Lead", bg: "bg-blue-50 text-blue-800 border-blue-200" };
      case "admin":
        return { label: "Agri Scientist / Officer", bg: "bg-purple-50 text-purple-800 border-purple-200" };
      case "buyer":
        return { label: "Verified Buyer", bg: "bg-amber-50 text-amber-800 border-amber-200" };
      default:
        return { label: "Community Member", bg: "bg-slate-100 text-slate-800 border-slate-200" };
    }
  };
  const roleInfo = getRoleBadge(user.role);
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {
    /* Header Cover */
  }
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 h-28 p-4 relative flex justify-end items-start">
          <button
    onClick={onClose}
    className="p-1.5 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors cursor-pointer"
    aria-label="Close modal"
  >
            <X className="w-5 h-5" />
          </button>
        </div>

        {
    /* Profile Details */
  }
        <div className="px-6 pt-0 pb-6 -mt-12 flex-1 overflow-y-auto space-y-4">
          <div className="flex items-end justify-between gap-3">
            <div className="relative">
              {user.avatar ? <img
    src={user.avatar}
    alt={user.name}
    className="w-22 h-22 rounded-2xl object-cover border-4 border-white shadow-md"
    referrerPolicy="no-referrer"
  /> : <div className="w-22 h-22 rounded-2xl bg-emerald-100 text-emerald-800 border-4 border-white shadow-md flex items-center justify-center font-display font-bold text-2xl">
                  {user.name.charAt(0)}
                </div>}
              {user.isVerified && <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full border-2 border-white shadow-xs">
                  <CheckCircle className="w-3.5 h-3.5" />
                </div>}
            </div>

            {!isSelf && <button
    onClick={() => onToggleFollow(user.id)}
    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${isFollowing ? "bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300" : "bg-emerald-700 hover:bg-emerald-800 text-white"}`}
  >
                {isFollowing ? <>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Following</span>
                  </> : <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow Farmer</span>
                  </>}
              </button>}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {user.name}
              </h3>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${roleInfo.bg}`}>
                {roleInfo.label}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.location}</span>
            </div>
          </div>

          {
    /* Followers & Social Metrics */
  }
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="block text-sm font-bold text-slate-900 font-mono">
                {user.followersCount ?? (isFollowing ? 1 : 0)}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Followers</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="block text-sm font-bold text-slate-900 font-mono">
                {user.followingCount ?? 24}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Following</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl">
              <span className="block text-sm font-bold text-slate-900 font-mono">
                {userPosts.length}
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Queries</span>
            </div>
          </div>

          {
    /* Bio */
  }
          {user.bio && <div>
              <h4 className="text-xs font-semibold text-slate-800 mb-1">About / Farm Profile</h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {user.bio}
              </p>
            </div>}

          {
    /* Crops Cultivated */
  }
          {user.cropsGrown && user.cropsGrown.length > 0 && <div>
              <h4 className="text-xs font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
                <Wheat className="w-3.5 h-3.5 text-emerald-600" />
                <span>Primary Crops Cultivated</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {user.cropsGrown.map((crop) => <span
    key={crop}
    className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-medium"
  >
                    {crop}
                  </span>)}
              </div>
            </div>}

          {
    /* Contact Farmer */
  }
          {user.phone && <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-emerald-800 font-semibold block">Farmer Direct Contact</span>
                <span className="text-xs font-mono text-emerald-950 font-medium">{user.phone}</span>
              </div>
              <a
    href={`tel:${user.phone}`}
    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
  >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Directly</span>
              </a>
            </div>}

          {
    /* Recent Queries Posted By This Farmer */
  }
          <div>
            <h4 className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Questions & Observations ({userPosts.length})</span>
            </h4>
            {userPosts.length === 0 ? <p className="text-xs text-slate-400 italic py-2">No queries posted yet.</p> : <div className="space-y-2">
                {userPosts.slice(0, 3).map((p) => <div
    key={p.id}
    className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-xs"
  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-slate-900 line-clamp-1">{p.title}</span>
                      <span
    className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${p.status === "resolved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
  >
                        {p.status === "resolved" ? "Resolved" : "Active"}
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-2 text-[11px]">{p.question}</p>
                  </div>)}
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
