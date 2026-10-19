import React, { useState } from 'react';
import { FarmerProfile } from '../../types/community';
import {
  Users,
  Search,
  MapPin,
  Sprout,
  UserPlus,
  UserCheck,
  MessageSquare,
  Award,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface FarmersDirectoryViewProps {
  farmers: FarmerProfile[];
  currentUserId: string;
  currentUserDistrict?: string;
  onToggleFollow: (farmerId: string) => void;
  onOpenProfile: (farmerId: string) => void;
  onOpenChat: (farmerId: string, farmerName: string) => void;
}

const DISTRICT_FILTERS = [
  'All Districts',
  'Warangal',
  'Nizamabad',
  'Guntur',
  'Karimnagar',
  'Khammam',
  'Kurnool',
  'Nalgonda',
];

const CROP_FILTERS = [
  'All Crops',
  'Cotton',
  'Rice (Paddy)',
  'Chilli (Mirchi)',
  'Soybean',
  'Maize',
  'Turmeric',
  'Groundnut',
];

export const FarmersDirectoryView: React.FC<FarmersDirectoryViewProps> = ({
  farmers,
  currentUserId,
  currentUserDistrict = 'Warangal',
  onToggleFollow,
  onOpenProfile,
  onOpenChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedCrop, setSelectedCrop] = useState('All Crops');

  const filteredFarmers = farmers.filter((f) => {
    if (selectedDistrict !== 'All Districts' && f.district !== selectedDistrict) return false;
    if (
      selectedCrop !== 'All Crops' &&
      !f.mainCrops.some((c) => c.toLowerCase().includes(selectedCrop.toLowerCase()))
    ) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.district.toLowerCase().includes(q) ||
        f.village.toLowerCase().includes(q) ||
        f.mainCrops.some((c) => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Suggested farmers (e.g. from same district or high reputation)
  const suggestedFarmers = farmers.filter(
    (f) => f.id !== currentUserId && (f.district === currentUserDistrict || f.reputationScore > 200)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-300" />
              <span>Rythu Sangham (Kisan Directory)</span>
            </h3>
            <p className="text-xs text-emerald-100 max-w-xl">
              Connect with experienced farmers, seed selectors, and regional growers across Telangana and Andhra Pradesh.
            </p>
          </div>
          <div className="px-4 py-2 bg-white/10 rounded-2xl backdrop-blur-xs text-center shrink-0">
            <span className="text-[11px] uppercase tracking-wide opacity-80 block">Active Farmers</span>
            <strong className="text-xl font-bold">{farmers.length}</strong>
          </div>
        </div>
      </div>

      {/* Suggested Farmers Section */}
      {suggestedFarmers.length > 0 && selectedDistrict === 'All Districts' && !searchQuery && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Suggested Farmers in Your Region ({currentUserDistrict})</span>
            </h4>
            <span className="text-xs text-emerald-700 font-semibold">Farmers growing similar crops</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {suggestedFarmers.slice(0, 3).map((farmer) => (
              <div
                key={farmer.id}
                className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-4 space-y-3 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenProfile(farmer.id)}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold flex items-center justify-center overflow-hidden border border-emerald-300 shrink-0 cursor-pointer"
                  >
                    {farmer.avatar ? (
                      <img
                        src={farmer.avatar}
                        alt={farmer.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span>{farmer.name.charAt(0)}</span>
                    )}
                  </button>

                  <div className="min-w-0">
                    <button
                      type="button"
                      onClick={() => onOpenProfile(farmer.id)}
                      className="font-bold text-slate-900 hover:text-emerald-800 transition-colors text-xs truncate block text-left"
                    >
                      {farmer.name}
                    </button>
                    {farmer.profession && (
                      <span className="text-[11px] text-emerald-900 font-semibold block truncate">
                        {farmer.profession}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-emerald-700 shrink-0" />
                      <span>{farmer.district}, {farmer.state}</span>
                    </span>
                    <span className="inline-block text-[10px] font-bold text-emerald-800 bg-white px-1.5 py-0.2 rounded border border-emerald-200 mt-1">
                      {farmer.reputationBadge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60 text-xs">
                  <button
                    type="button"
                    onClick={() => onToggleFollow(farmer.id)}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                      farmer.isFollowing
                        ? 'bg-white text-slate-700 border border-slate-300'
                        : 'bg-emerald-700 text-white shadow-2xs hover:bg-emerald-800'
                    }`}
                  >
                    {farmer.isFollowing ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Following</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Follow</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenChat(farmer.id, farmer.name)}
                    className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                    title="Send Private DM to Farmer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>DM</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, crop, village..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
            >
              {DISTRICT_FILTERS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
            >
              {CROP_FILTERS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* All Farmers Grid */}
      {filteredFarmers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFarmers.map((farmer) => {
            const isMe = farmer.id === currentUserId;
            return (
              <div
                key={farmer.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onOpenProfile(farmer.id)}
                        className="w-13 h-13 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white font-bold text-base flex items-center justify-center overflow-hidden border-2 border-slate-100 shadow-2xs hover:scale-105 transition-transform cursor-pointer"
                      >
                        {farmer.avatar ? (
                          <img
                            src={farmer.avatar}
                            alt={farmer.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span>{farmer.name.charAt(0)}</span>
                        )}
                      </button>

                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onOpenProfile(farmer.id)}
                          className="font-bold text-slate-900 hover:text-emerald-800 transition-colors text-sm truncate block text-left"
                        >
                          {farmer.name}
                        </button>
                        {farmer.profession && (
                          <span className="text-xs text-emerald-900 font-semibold block truncate">
                            {farmer.profession}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>
                            {farmer.village ? `${farmer.village}, ` : ''}
                            {farmer.district}
                          </span>
                        </span>
                        <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mt-1">
                          {farmer.reputationBadge}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Agricultural Specs */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Experience</span>
                      <strong className="text-slate-900">{farmer.farmingExperienceYears} Years</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Farm Land</span>
                      <strong className="text-slate-900">{farmer.farmSizeAcres} Acres</strong>
                    </div>
                  </div>

                  {/* Main Crops */}
                  <div className="mt-2.5">
                    <span className="text-[10px] text-slate-400 font-medium block mb-1">Crops</span>
                    <div className="flex items-center gap-1 flex-wrap">
                      {farmer.mainCrops.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 bg-slate-100 text-slate-800 font-semibold rounded text-[11px]"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => onOpenProfile(farmer.id)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-colors cursor-pointer text-center"
                  >
                    View Profile
                  </button>

                  {!isMe && (
                    <>
                      <button
                        type="button"
                        onClick={() => onToggleFollow(farmer.id)}
                        className={`px-3.5 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                          farmer.isFollowing
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
                        }`}
                      >
                        {farmer.isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenChat(farmer.id, farmer.name)}
                        className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Send Private DM to farmer"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-100" />
                        <span>DM</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-slate-800 text-base">No Farmers Found</h4>
          <p className="text-slate-500 text-xs">Try selecting a different district or crop filter.</p>
        </div>
      )}
    </div>
  );
};
