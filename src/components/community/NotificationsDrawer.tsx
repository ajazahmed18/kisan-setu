import React from 'react';
import { KisanNotification } from '../../types/community';
import {
  X,
  Bell,
  CheckCircle2,
  Award,
  MessageSquare,
  UserPlus,
  Heart,
  CheckCheck,
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: KisanNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
  onOpenPost: (postId: string) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllRead,
  onOpenPost,
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: KisanNotification['type']) => {
    switch (type) {
      case 'best_solution':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'problem_solution':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'follow':
        return <UserPlus className="w-4 h-4 text-teal-600" />;
      case 'helpful':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-emerald-700" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-sm">Community Notifications</h3>
              <span className="text-[11px] text-emerald-100">
                {unreadCount} unread updates
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={onMarkAllRead}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Read</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  onMarkAsRead(notif.id);
                  if (notif.targetPostId) {
                    onOpenPost(notif.targetPostId);
                    onClose();
                  }
                }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-start gap-3 ${
                  !notif.isRead
                    ? 'bg-emerald-50/70 border border-emerald-200/80 shadow-2xs'
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 text-xs">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <strong className="text-slate-900 font-bold truncate">
                      {notif.title}
                    </strong>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {notif.createdAt}
                    </span>
                  </div>

                  <p className="text-slate-600 leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px]">
                    <span className="font-semibold text-emerald-800">
                      From {notif.actorName}
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No notifications yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
