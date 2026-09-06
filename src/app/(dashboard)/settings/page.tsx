'use client';

import { useState, useEffect } from 'react';
import { Settings, User, Shield, Moon, Sun, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDark, setIsDark] = useState(false);

  // Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');

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
    setErrorMsg('');

    try {
      const res = await fetch('/api/v1/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, bio, location, website }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update profile');
      }
      setMsg('Profile settings updated successfully!');
      setTimeout(() => setMsg(''), 4000);
    } catch (e: any) {
      setErrorMsg(e.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPass(true);
    setPassMsg('');
    setPassError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPassError('All password fields are required');
      setChangingPass(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New password and confirmation do not match');
      setChangingPass(false);
      return;
    }

    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long');
      setChangingPass(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setPassMsg('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPassMsg(''), 4000);
      } else {
        setPassError(data.error || 'Failed to change password');
      }
    } catch (e: any) {
      setPassError('Network error while changing password');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-500" />
          <span>Account & Profile Settings</span>
        </h1>
        <p className="text-xs text-slate-500">Manage your profile, security credentials, and appearance preferences</p>
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
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition"
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
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Username</label>
            <input
              type="text"
              disabled
              value={user?.username || ''}
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none focus:outline-none focus:border-brand-500"
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

      {/* Security & Password Change Section */}
      <form onSubmit={handleChangePassword} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span>Security & Change Password</span>
        </h3>
        <p className="text-xs text-slate-500">Update your account login password</p>

        {passMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{passMsg}</span>
          </div>
        )}

        {passError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{passError}</span>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={changingPass}
          className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-md shadow-emerald-600/20"
        >
          {changingPass ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
