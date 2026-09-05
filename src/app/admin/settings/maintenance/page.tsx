'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AdminMaintenanceSettingsPage() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/admin/settings/maintenance')
      .then((res) => res.json())
      .then((json) => {
        if (json.data) {
          setEnabled(json.data.maintenanceMode);
          setMessage(json.data.message);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/v1/admin/settings/maintenance', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled, message }),
      });
      const json = await res.json();
      if (res.ok) {
        setFeedback(json.message || 'Maintenance settings updated');
      } else {
        setFeedback(json.error || 'Failed to update maintenance settings');
      }
    } catch (err) {
      setFeedback('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Link href="/admin/settings" className="text-xs text-amber-400 hover:underline flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Settings
          </Link>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" /> Platform Maintenance Mode
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            When enabled, public users will see a maintenance announcement while admins retain full system access.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading settings...</div>
        ) : (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
            {feedback && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {feedback}
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div>
                <div className="text-sm font-bold text-white">Enable Maintenance Mode</div>
                <div className="text-xs text-slate-400 mt-0.5">Restrict public access during system updates</div>
              </div>
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Maintenance Notice Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                placeholder="Custom maintenance announcement message..."
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl transition shadow-md"
            >
              {saving ? 'Saving Changes...' : 'Save Maintenance Settings'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

