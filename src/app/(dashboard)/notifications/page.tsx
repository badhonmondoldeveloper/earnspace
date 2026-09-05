'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCheck, User, Heart, MessageSquare, BookOpen } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch('/api/v1/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setNotifications(data.data.items || []);
          setUnreadCount(data.data.unreadCount || 0);
        }
      });
  }, []);

  const handleMarkAllRead = async () => {
    await fetch('/api/v1/notifications', { method: 'PATCH' });
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-brand-500" />
            <span>Notification Center</span>
          </h1>
          <p className="text-xs text-slate-500">Stay updated with interactions across your Space</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-brand-500" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400">
            You have no notifications right now.
          </div>
        ) : (
          notifications.map((n) => (
            <a
              key={n.id}
              href={n.link || '#'}
              className={`p-4 rounded-xl border transition flex items-center gap-3 block ${
                n.isRead
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                {n.type === 'like' ? <Heart className="w-4 h-4 text-rose-500" /> : <Bell className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                <p className="text-xs text-slate-500">{n.body}</p>
                <span className="text-[10px] text-slate-400 block mt-1">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}

