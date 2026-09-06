'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCheck, User, Heart, MessageSquare, DollarSign, Sparkles, Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    fetch('/api/v1/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setNotifications(data.data.items || []);
          setUnreadCount(data.data.unreadCount || 0);
        }
      })
      .catch(() => {});
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch('/api/v1/notifications', { method: 'PATCH' });
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
      case 'reaction':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'follow':
        return <User className="w-4 h-4 text-emerald-500" />;
      case 'earning':
      case 'payout':
        return <DollarSign className="w-4 h-4 text-amber-500" />;
      case 'system':
      case 'admin':
        return <Shield className="w-4 h-4 text-sky-500" />;
      default:
        return <Bell className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-500 text-white">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Stay updated with likes, comments, followers, and earnings alerts on EarnSpace.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 transition flex items-center gap-1.5 shrink-0"
          >
            <CheckCheck className="w-4 h-4 text-indigo-600" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <Bell className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
            <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">You have no notifications yet.</p>
            <p className="text-[11px] text-slate-400">Interactions on your posts, videos, and wallet will appear here!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <Link
              key={n.id}
              href={n.link || '#'}
              className={`p-4 rounded-2xl border transition flex items-center justify-between gap-3 block shadow-sm ${
                n.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/60'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                  {getNotificationIcon(n.type)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{n.title}</span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                    )}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 truncate mt-0.5">{n.body}</p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
