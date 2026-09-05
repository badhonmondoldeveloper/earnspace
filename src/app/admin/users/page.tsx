'use client';

import { useState, useEffect } from 'react';
import { Users, Search, ShieldAlert, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = (query = '') => {
    setLoading(true);
    fetch(`/api/v1/admin/users?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUsers(data.data || []);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleUpdateStatus = async (userId: string, newStatus: string) => {
    const reason = prompt(`Enter reason for changing status to ${newStatus}:`);
    if (!reason) return;

    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', userId, status: newStatus, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`User status updated to ${newStatus}`);
        fetchUsers(q);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {}
  };

  const handleFreezeWallet = async (userId: string, currentFreeze: boolean) => {
    const reason = prompt(`Enter reason for ${currentFreeze ? 'unfreezing' : 'freezing'} user wallet:`);
    if (!reason) return;

    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'freeze_wallet', userId, isFrozen: !currentFreeze, reason }),
      });
      const data = await res.json();
      if (data.success) {
        setMsg(`User wallet ${!currentFreeze ? 'frozen' : 'unfrozen'}`);
        fetchUsers(q);
        setTimeout(() => setMsg(''), 3000);
      }
    } catch (e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-500" />
            <span>User Management & Moderation</span>
          </h1>
          <p className="text-xs text-slate-400">Search users, update account status, and toggle wallet freeze states</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search username or email..."
            value={q}
            onChange={(e) => { setQ(e.target.value); fetchUsers(e.target.value); }}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500"
          />
        </div>
      </div>

      {msg && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs font-semibold">
          {msg}
        </div>
      )}

      {/* Users Table */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading users list...</div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">User</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Wallet State</th>
                  <th className="pb-3 font-semibold">Registered</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-850">
                    <td className="py-3">
                      <span className="font-bold text-white block">{u.profile?.fullName || u.username}</span>
                      <span className="text-[10px] text-slate-400 block">@{u.username} • {u.email}</span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === 'active'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {u.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-bold ${u.wallet?.isFrozen ? 'text-rose-400' : 'text-slate-400'}`}>
                        {u.wallet?.isFrozen ? 'FROZEN' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 text-right space-x-2">
                      {u.status === 'active' ? (
                        <button
                          onClick={() => handleUpdateStatus(u.id, 'suspended')}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-rose-950 text-rose-400 border border-rose-800 hover:bg-rose-900 transition"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(u.id, 'active')}
                          className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900 transition"
                        >
                          Activate
                        </button>
                      )}

                      <button
                        onClick={() => handleFreezeWallet(u.id, !!u.wallet?.isFrozen)}
                        className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                      >
                        {u.wallet?.isFrozen ? 'Unfreeze Wallet' : 'Freeze Wallet'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

