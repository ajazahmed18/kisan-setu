import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth, UserProfileData, EcosystemRole, handleFirestoreError, OperationType } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import {
  Shield,
  ShieldCheck,
  Users,
  Search,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Circle,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  ChevronDown,
  UserCheck,
  ExternalLink,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle,
  Radio,
} from 'lucide-react';

interface RoleMeta {
  id: EcosystemRole;
  label: string;
  emoji: string;
  tagline: string;
  accent: string;
  badgeBg: string;
  textColor: string;
  borderActive: string;
  cardBg: string;
}

const ECOSYSTEM_ROLES: RoleMeta[] = [
  {
    id: 'farmer',
    label: 'Farmer',
    emoji: '🌱',
    tagline: 'Agricultural Growers & Cultivators',
    accent: 'from-emerald-500 to-green-600',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textColor: 'text-emerald-700',
    borderActive: 'border-emerald-500 ring-emerald-500/20',
    cardBg: 'hover:border-emerald-300',
  },
  {
    id: 'fpo',
    label: 'FPO Co-Op',
    emoji: '🏢',
    tagline: 'Farmer Producer Organizations',
    accent: 'from-teal-500 to-cyan-600',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    textColor: 'text-teal-700',
    borderActive: 'border-teal-500 ring-teal-500/20',
    cardBg: 'hover:border-teal-300',
  },
  {
    id: 'market',
    label: 'Market Admin',
    emoji: '🏢',
    tagline: 'Market Committee & Mandi Pricing Board',
    accent: 'from-emerald-500 to-teal-600',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    textColor: 'text-emerald-700',
    borderActive: 'border-emerald-500 ring-emerald-500/20',
    cardBg: 'hover:border-emerald-300',
  },
  {
    id: 'transporter',
    label: 'Transporter',
    emoji: '🚚',
    tagline: 'Rural Logistics & Heavy Haulers',
    accent: 'from-amber-500 to-orange-600',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    textColor: 'text-amber-700',
    borderActive: 'border-amber-500 ring-amber-500/20',
    cardBg: 'hover:border-amber-300',
  },
  {
    id: 'admin',
    label: 'Admin Portal',
    emoji: '🛡️',
    tagline: 'Platform Custodians & Operators',
    accent: 'from-purple-500 to-violet-600',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    textColor: 'text-purple-700',
    borderActive: 'border-purple-500 ring-purple-500/20',
    cardBg: 'hover:border-purple-300',
  },
];

export const AdminUsers: React.FC = () => {
  const { currentUser, userProfile, isAdminUser, logout, updateUserRole, updateUserStatus } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Firestore real users state
  const [users, setUsers] = useState<UserProfileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | EcosystemRole>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [copiedUid, setCopiedUid] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time Firestore subscription to users collection (Admin Only)
  useEffect(() => {
    const isDesignatedAdmin =
      currentUser?.email === 'admin@gmail.com';

    if (!isAdminUser || !isDesignatedAdmin) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const usersCollection = collection(db, 'users');

    const unsubscribe = onSnapshot(
      usersCollection,
      (snapshot) => {
        const fetchedUsers: UserProfileData[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as any;
          // Normalization fallback
          fetchedUsers.push({
            uid: data.uid || docSnap.id,
            displayName: data.displayName || data.name || 'User ' + docSnap.id.substring(0, 5),
            email: data.email || null,
            phoneNumber: data.phoneNumber || data.phone || null,
            photoURL: data.photoURL || data.avatar || null,
            provider: data.provider || 'password',
            role: (data.role as EcosystemRole) || 'farmer',
            isOnline: Boolean(data.isOnline ?? data.status === 'online'),
            status: (data.status as 'online' | 'offline') || (data.isOnline ? 'online' : 'offline'),
            lastActive: data.lastActive || data.lastLoginAt || data.createdAt || new Date().toISOString(),
            createdAt: data.createdAt || new Date().toISOString(),
            lastLoginAt: data.lastLoginAt || data.createdAt || new Date().toISOString(),
          });
        });

        setUsers(fetchedUsers);
        setIsLoading(false);
      },
      (error) => {
        console.error('Real-time users fetch error:', error);
        handleFirestoreError(error, OperationType.LIST, 'users');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdminUser, currentUser]);

  // Compute real-time role counts
  const roleStats = useMemo(() => {
    const stats: Record<EcosystemRole, { total: number; online: number }> = {
      farmer: { total: 0, online: 0 },
      fpo: { total: 0, online: 0 },
      market: { total: 0, online: 0 },
      market_admin: { total: 0, online: 0 },
      transporter: { total: 0, online: 0 },
      admin: { total: 0, online: 0 },
    };

    users.forEach((u) => {
      const role = u.role || 'farmer';
      if (stats[role]) {
        stats[role].total += 1;
        if (u.isOnline || u.status === 'online') {
          stats[role].online += 1;
        }
      }
    });

    return stats;
  }, [users]);

  const totalOnlineCount = useMemo(() => {
    return users.filter((u) => u.isOnline || u.status === 'online').length;
  }, [users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      // Role match
      if (activeTab !== 'all' && u.role !== activeTab) {
        return false;
      }

      // Online status match
      const isOnline = u.isOnline || u.status === 'online';
      if (statusFilter === 'online' && !isOnline) return false;
      if (statusFilter === 'offline' && isOnline) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = u.displayName?.toLowerCase().includes(q);
        const emailMatch = u.email?.toLowerCase().includes(q);
        const phoneMatch = u.phoneNumber?.includes(q);
        const uidMatch = u.uid.toLowerCase().includes(q);
        return Boolean(nameMatch || emailMatch || phoneMatch || uidMatch);
      }

      return true;
    });
  }, [users, activeTab, statusFilter, searchQuery]);

  const copyToClipboard = (uid: string) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  const handleRoleChange = async (userId: string, newRole: EcosystemRole) => {
    try {
      await updateUserRole(userId, newRole);
      setActionMessage(`User role successfully updated to ${newRole.toUpperCase()}`);
      setTimeout(() => setActionMessage(null), 3500);
    } catch (error: any) {
      console.error('Role update error:', error);
      setActionMessage(`Failed to update role: ${error.message}`);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: boolean) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      setActionMessage(`User presence toggled to ${!currentStatus ? 'ONLINE' : 'OFFLINE'}`);
      setTimeout(() => setActionMessage(null), 3500);
    } catch (error: any) {
      console.error('Status toggle error:', error);
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return 'N/A';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return d.toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const formatRelativeTime = (isoString?: string, isOnline?: boolean) => {
    if (isOnline) return 'Active now';
    if (!isoString) return 'Offline';
    try {
      const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    } catch {
      return 'Offline';
    }
  };

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Admin Authorization Required</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            You do not have administrative privileges to access this portal. Your current verified role is:
            <span className="font-bold text-slate-900 uppercase ml-1 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">{userProfile?.role || 'Guest'}</span>.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white" id="admin-users-management">
      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Return to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-sm ring-2 ring-purple-600/20">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg leading-none">
                    Admin Users Management
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                    Firebase Live
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Real-time Firebase Authentication & Firestore User Directory
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live indicator badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>{totalOnlineCount} Online Now</span>
            </div>

            <LanguageSelector />

            <button
              onClick={() => logout().then(() => navigate('/login'))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('logout')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Action feedback notification */}
        {actionMessage && (
          <div
            id="admin-action-message"
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-medium flex items-center justify-between shadow-xs animate-in fade-in"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionMessage}</span>
            </div>
            <button
              onClick={() => setActionMessage(null)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Section Header: Role-based Overview Cards */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Ecosystem Role Directory</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {users.length} Registered Accounts
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Click any role card or tab below to inspect members, online status, contact info, and timestamps.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => {
                  setIsRefreshing(true);
                  setTimeout(() => setIsRefreshing(false), 500);
                }}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Sync Firestore</span>
              </button>
            </div>
          </div>

          {/* 5 Role Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5" id="ecosystem-role-cards">
            {ECOSYSTEM_ROLES.map((role) => {
              const stat = roleStats[role.id];
              const isSelected = activeTab === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  id={`role-card-${role.id}`}
                  onClick={() => setActiveTab(isSelected ? 'all' : role.id)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `bg-white border-2 ${role.borderActive} shadow-sm ring-2`
                      : `bg-white border-slate-200 ${role.cardBg} hover:shadow-2xs`
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-2xl" role="img" aria-label={role.label}>
                      {role.emoji}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${role.badgeBg}`}
                    >
                      {stat.online > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      {stat.online} Online
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm tracking-tight flex items-center justify-between">
                      <span>{role.label}</span>
                      <span className="text-base font-extrabold text-slate-900">{stat.total}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{role.tagline}</p>
                  </div>

                  {/* Active bottom bar accent */}
                  {isSelected && (
                    <div className={`absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r ${role.accent}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filters & Tabs Navigation Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs scrollbar-none">
              <button
                type="button"
                id="filter-tab-all"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Ecosystem ({users.length})
              </button>

              {ECOSYSTEM_ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  id={`filter-tab-${r.id}`}
                  onClick={() => setActiveTab(r.id)}
                  className={`px-3 py-2 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === r.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span>{r.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      activeTab === r.id ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {roleStats[r.id].total}
                  </span>
                </button>
              ))}
            </div>

            {/* Status Filter Pill Toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({users.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('online')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer ${
                  statusFilter === 'online'
                    ? 'bg-white text-emerald-800 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Online ({totalOnlineCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('offline')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                  statusFilter === 'offline'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Offline ({users.length - totalOnlineCount})
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              id="admin-users-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by User Name, Email, Phone number, or Firebase UID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Users Table / List Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Table Header Bar */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-600" />
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {activeTab === 'all'
                  ? 'All Registered Users'
                  : `${ECOSYSTEM_ROLES.find((r) => r.id === activeTab)?.emoji} ${
                      ECOSYSTEM_ROLES.find((r) => r.id === activeTab)?.label
                    } List`}
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                ({filteredUsers.length} matching {activeTab === 'all' ? 'total' : 'in role'})
              </span>
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline">
              Real-time Firestore sync &bull; `users` collection
            </span>
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-emerald-600" />
              <p className="text-sm font-medium">Connecting to Firestore User Directory...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="py-16 px-4 text-center max-w-md mx-auto space-y-3" id="admin-empty-state">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {searchQuery
                  ? 'No users match your search'
                  : `No users registered in this role yet`}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {searchQuery
                  ? `No accounts found matching "${searchQuery}". Try searching by another name, phone number, or UID.`
                  : `Users who register with the "${
                      ECOSYSTEM_ROLES.find((r) => r.id === activeTab)?.label || activeTab
                    }" role or are assigned by an administrator will automatically appear here live.`}
              </p>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            /* Responsive Users Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm" id="admin-users-table">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4 sm:px-6">User / Ecosystem Role</th>
                    <th className="py-3 px-4 sm:px-6">Contact Details</th>
                    <th className="py-3 px-4 sm:px-6">Online Status</th>
                    <th className="py-3 px-4 sm:px-6">Last Login</th>
                    <th className="py-3 px-4 sm:px-6">Account Created</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Role Assignment</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((user) => {
                    const roleMeta =
                      ECOSYSTEM_ROLES.find((r) => r.id === user.role) || ECOSYSTEM_ROLES[0];
                    const isOnline = Boolean(user.isOnline || user.status === 'online');
                    const isCurrentUser = user.uid === currentUser?.uid;

                    return (
                      <tr
                        key={user.uid}
                        id={`user-row-${user.uid}`}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* 1. User Name & Role */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            {/* Avatar with presence ring */}
                            <div className="relative shrink-0">
                              {user.photoURL ? (
                                <img
                                  src={user.photoURL}
                                  alt={user.displayName || 'User'}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                                </div>
                              )}

                              {/* Presence dot on avatar */}
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                                  isOnline ? 'bg-emerald-500 ring-2 ring-emerald-500/20' : 'bg-slate-300'
                                }`}
                                title={isOnline ? 'Online now' : 'Offline'}
                              />
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 truncate block text-sm">
                                  {user.displayName || 'Unnamed User'}
                                </span>
                                {isCurrentUser && (
                                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white shrink-0">
                                    You
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${roleMeta.badgeBg}`}
                                >
                                  <span>{roleMeta.emoji}</span>
                                  <span>{roleMeta.label}</span>
                                </span>

                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(user.uid)}
                                  className="text-[10px] font-mono text-slate-400 hover:text-slate-700 flex items-center gap-0.5 cursor-pointer"
                                  title="Copy Firebase UID"
                                >
                                  <span>{user.uid.substring(0, 7)}...</span>
                                  {copiedUid === user.uid ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 2. Email & Phone Number */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-1.5 text-slate-800">
                              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate max-w-[200px] font-medium">
                                {user.email || 'No email provided'}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span>{user.phoneNumber || 'No phone provided'}</span>
                            </div>
                          </div>
                        </td>

                        {/* 3. Online/Offline Status */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              {isOnline ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                  </span>
                                  <span>Online</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                                  <span>Offline</span>
                                </span>
                              )}

                              {/* Presence toggle button for testing */}
                              <button
                                type="button"
                                onClick={() => handleStatusToggle(user.uid, isOnline)}
                                className="text-[10px] text-slate-400 hover:text-slate-700 underline opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                title="Toggle presence status in Firestore"
                              >
                                Toggle
                              </button>
                            </div>

                            <p className="text-[11px] text-slate-400 font-medium">
                              {formatRelativeTime(user.lastActive, isOnline)}
                            </p>
                          </div>
                        </td>

                        {/* 4. Last Login */}
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium">{formatDate(user.lastLoginAt)}</span>
                          </div>
                        </td>

                        {/* 5. Account Creation Date */}
                        <td className="py-3.5 px-4 sm:px-6 text-xs text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="font-medium">{formatDate(user.createdAt)}</span>
                          </div>
                        </td>

                        {/* 6. Role Switcher Dropdown / Protected Admin Badge */}
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <div className="inline-flex items-center justify-end">
                            {(user.email === 'admin@gmail.com') ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-100 text-purple-900 border border-purple-200">
                                <Shield className="w-3.5 h-3.5 text-purple-700" />
                                <span>Sole Administrator (Locked)</span>
                              </span>
                            ) : (
                              <select
                                id={`role-select-${user.uid}`}
                                value={user.role || 'farmer'}
                                onChange={(e) =>
                                  handleRoleChange(user.uid, e.target.value as EcosystemRole)
                                }
                                className="text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-slate-800 transition-all outline-none cursor-pointer focus:border-purple-500 focus:ring-1 focus:ring-purple-500/20"
                              >
                                <option value="farmer">🌱 Farmer</option>
                                <option value="fpo">🏢 FPO Co-Op</option>
                                <option value="market">🏢 Market Admin</option>
                                <option value="transporter">🚚 Transporter</option>
                              </select>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Informational Guidance Box */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-900 block">
                Live Firestore Real-Time Synchronization Active
              </span>
              <span className="text-slate-500">
                User presence updates whenever users log in, change tabs, disconnect, or are updated by Administrators.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 font-mono text-[11px] shrink-0">
            <span>Collection: `users`</span>
            <span>&bull;</span>
            <span>Auth: Firebase Auth</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
