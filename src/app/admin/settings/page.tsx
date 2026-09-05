'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, Power, CheckCircle2, Lock, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  // Admin Password Change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    fetch('/api/v1/admin/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSettings(data.data || []);
        }
      });
  }, []);

  const handleSaveSetting = async (key: string, value: string) => {
    const reason = prompt(`Enter audit reason for updating ${key}:`);
    if (!reason) return;

    try {
      const res = await fetch('/api/v1/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value, category: 'general', reason }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`Setting ${key} updated`);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {}
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
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
      const res = await fetch('/api/v1/admin/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setPassMsg('Admin password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPassMsg(''), 4000);
      } else {
        setPassError(data.error || 'Failed to update admin password');
      }
    } catch (e: any) {
      setPassError('Network error while changing admin password');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-500" />
          <span>Platform Settings & Admin Security</span>
        </h1>
        <p className="text-xs text-slate-400">Configure global platform parameters, maintenance mode, and admin account security</p>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* Admin Account Security & Password Change */}
      <form onSubmit={handleChangeAdminPassword} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>Admin Account Password & Security</span>
        </h3>
        <p className="text-xs text-slate-400">Update your Super Admin account password</p>

        {passMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{passMsg}</span>
          </div>
        )}

        {passError && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{passError}</span>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={changingPass}
          className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-md shadow-emerald-600/20"
        >
          {changingPass ? 'Updating Admin Password...' : 'Update Admin Password'}
        </button>
      </form>

      {/* Maintenance Mode Control */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Power className="w-4 h-4 text-rose-500" />
          <span>Maintenance Mode Control</span>
        </h3>
        <p className="text-xs text-slate-400">
          When enabled, public web app routes display a maintenance notice while admin control panel access remains active.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSaveSetting('maintenance_mode', 'enabled')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition"
          >
            Enable Maintenance Mode
          </button>
          <button
            onClick={() => handleSaveSetting('maintenance_mode', 'disabled')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition"
          >
            Disable Maintenance Mode
          </button>
        </div>
      </div>

      {/* Configurable Business Rules */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Dynamic Business Rules</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 text-xs">
            <div>
              <span className="font-bold text-white block">Minimum Payout Withdrawal Limit</span>
              <span className="text-[10px] text-slate-400">Default minimum dollar threshold before withdrawal request</span>
            </div>
            <button
              onClick={() => handleSaveSetting('min_withdrawal_limit', '10.00')}
              className="px-3 py-1.5 font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
            >
              Configure Limit ($10.00)
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 text-xs">
            <div>
              <span className="font-bold text-white block">Referral Qualification Reward</span>
              <span className="text-[10px] text-slate-400">Bonus reward credited to referrer upon qualified invite action</span>
            </div>
            <button
              onClick={() => handleSaveSetting('referral_reward_amount', '5.00')}
              className="px-3 py-1.5 font-semibold rounded-lg bg-slate-700 hover:bg-slate-600 text-white"
            >
              Configure Reward ($5.00)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
