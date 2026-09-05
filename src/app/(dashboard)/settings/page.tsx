'use client';

import { useState, useEffect } from 'react';
import { Settings, User, Shield, Moon, Sun, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setUser(data.data);
          const p = data.data.profile;
          if (p) {
            setFullName(p.fullName || '');
            setBio(p.bio || '');
            setLocation(p.location || '');
            setWebsite(p.website || '');
          }
        }
      });

    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');

    try {
      setMsg('Settings updated!');
      setTimeout(() => setMsg(''), 3000);
    } catch (e) {
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-500" />
          <span>Account & Profile Settings</span>
        </h1>
        <p className="text-xs text-slate-500">Manage your profile, security, and appearance preferences</p>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{msg}</span>
        </div>
      )}

      {/* Appearance Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {isDark ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          <span>Appearance Mode</span>
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400">Toggle between Light and Dark themes</span>
          <button
            type="button"
            onClick={toggleTheme}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
          >
            {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </div>

      {/* Profile Info Section */}
      <form onSubmit={handleSaveProfile} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-brand-500" />
          <span>Profile Information</span>
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Username</label>
            <input
              type="text"
              disabled
              value={user?.username || ''}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition shadow-md shadow-brand-500/20"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}

