import React, { useState } from 'react';
import { UserProfile } from '../types';
import {
  Users,
  Search,
  Filter,
  UserPlus,
  UserCheck,
  MapPin,
  CheckCircle,
  Wheat,
  Phone,
  Sparkles,
} from 'lucide-react';

interface FarmerNetworkDirectoryProps {
  users: UserProfile[];
  currentUserId?: string;
  followingIds: string[];
  onToggleFollow: (userId: string, userName?: string) => void;
  onOpenProfile: (userId: string) => void;
}

export const FarmerNetworkDirectory: React.FC<FarmerNetworkDirectoryProps> = ({
  users,
  currentUserId,
  followingIds,
  onToggleFollow,
  onOpenProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter((u) => {
    // Filter out current user from discover list
    if (currentUserId && u.id === currentUserId) return false;

    if (roleFilter !== 'all' && u.role !== roleFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchLoc = u.location.toLowerCase().includes(q);
      const matchBio = u.bio?.toLowerCase().includes(q);
      const matchCrop = u.cropsGrown?.some((c) => c.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchBio && !matchCrop) return false;
    }
    return true;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'farmer':
        return { label: 'Farmer', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'fpo':
        return { label: 'FPO Lead', className: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'admin':
        return { label: 'Agri Scientist', className: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'market_admin':
      case 'market':
        return { label: 'Market Admin', className: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      default:
        return { label: 'Member', className: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farmers, experts, crops, districts..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'All Members' },
            { id: 'farmer', label: 'Farmers' },
            { id: 'fpo', label: 'FPO Officers' },
            { id: 'admin', label: 'Agri Scientists' },
            { id: 'market_admin', label: 'Market Admins' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                roleFilter === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
          <Users className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-800">No members match your search</p>
          <p className="text-xs text-slate-500">Try searching for a different crop, district, or role.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredUsers.map((user) => {
            const isFollowing = followingIds.includes(user.id);
            const roleInfo = getRoleBadge(user.role);

            return (
              <div
                key={user.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <button
                      onClick={() => onOpenProfile(user.id)}
                      className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
                    >
                      <div className="relative">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-base border border-emerald-200">
                            {user.name.charAt(0)}
                          </div>
                        )}
                        {user.isVerified && (
                          <CheckCircle className="w-4 h-4 text-emerald-600 bg-white rounded-full absolute -bottom-1 -right-1" />
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                          {user.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`text-[10px] px-2 py-0.2 rounded-full border ${roleInfo.className}`}>
                            {roleInfo.label}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* 1-Click Follow Button */}
                    <button
                      onClick={() => onToggleFollow(user.id, user.name)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shrink-0 ${
                        isFollowing
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300'
                          : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="line-clamp-1">{user.location}</span>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg">
                      {user.bio}
                    </p>
                  )}

                  {/* Crops Grown */}
                  {user.cropsGrown && user.cropsGrown.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      {user.cropsGrown.slice(0, 3).map((crop) => (
                        <span
                          key={crop}
                          className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-medium"
                        >
                          {crop}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer Metrics & Actions */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 font-mono">
                      {(user.followersCount ?? 0) + (isFollowing ? 1 : 0)}
                    </span>
                    <span>Followers</span>
                  </div>

                  <button
                    onClick={() => onOpenProfile(user.id)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
