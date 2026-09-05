'use client';

import { useState, useEffect } from 'react';
import { Settings, Shield, Power, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [maintenanceMsg, setMaintenanceMsg] = useState('');
  const [msg, setMsg] = useState('');

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

  return (
    <div className="space-y-8">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-brand-500" />
          <span>Platform Settings & Maintenance Control</span>
        </h1>
        <p className="text-xs text-slate-400">Configure global platform parameters, registration controls, and maintenance mode</p>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-semibold">
          {msg}
        </div>
      )}

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

