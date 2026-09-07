'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CreditCard, Plus, Edit3, Trash2, Power, CheckCircle2, RefreshCw,
  Phone, Shield, AlertCircle, Sparkles, Building2, Wallet
} from 'lucide-react';

export default function AdminPaymentAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Edit Mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [provider, setProvider] = useState('BKASH');
  const [accountType, setAccountType] = useState('PERSONAL');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [status, setStatus] = useState('active');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/admin/payment-accounts');
      const json = await res.json();
      if (json.data) setAccounts(json.data);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!provider || !phoneNumber) return;

    setSaving(true);
    setMsg('');

    try {
      const isEditing = !!editingId;
      const url = '/api/v1/admin/payment-accounts';
      const method = isEditing ? 'PUT' : 'POST';

      const payload: any = {
        provider,
        accountType,
        phoneNumber,
        displayName: displayName || `${provider} Account`,
        instructions,
        status,
      };

      if (isEditing) {
        payload.id = editingId;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.ok && json.success) {
        setMsg(`🎉 Gateway account ${isEditing ? 'updated' : 'added'} successfully!`);
        resetForm();
        fetchAccounts();
        setTimeout(() => setMsg(''), 4000);
      } else {
        setMsg(`Error: ${json.error || json.message || 'Failed to save account'}`);
      }
    } catch (err: any) {
      setMsg(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (acc: any) => {
    setEditingId(acc.id);
    setProvider(acc.provider || 'BKASH');
    setAccountType(acc.accountType || 'PERSONAL');
    setPhoneNumber(acc.phoneNumber || '');
    setDisplayName(acc.displayName || '');
    setInstructions(acc.instructions || '');
    setStatus(acc.status || 'active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setProvider('BKASH');
    setAccountType('PERSONAL');
    setPhoneNumber('');
    setDisplayName('');
    setInstructions('');
    setStatus('active');
  };

  const toggleAccountStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/admin/payment-accounts?id=${id}`, {
        method: 'PATCH',
      });
      const json = await res.json();
      if (json.success) {
        fetchAccounts();
      } else {
        alert(json.message || 'Failed to toggle account status');
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment account number?')) return;

    try {
      const res = await fetch(`/api/v1/admin/payment-accounts?id=${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        if (editingId === id) resetForm();
        fetchAccounts();
      } else {
        alert(json.message || 'Failed to delete account');
      }
    } catch (err) {
      alert('Error deleting account');
    }
  };

  const getProviderBadgeColor = (prov: string) => {
    switch (prov.toUpperCase()) {
      case 'BKASH':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30';
      case 'NAGAD':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'ROCKET':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'UPAY':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'BANK':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'CRYPTO':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">EarnSpace Admin Control Desk</div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-indigo-400" /> Payment Gateway & Account Manager
            </h1>
            <p className="text-xs text-slate-400">
              Manage bKash, Nagad, Rocket, Upay, Bank & Crypto numbers with live On/Off status for user payment checkouts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/finance" className="px-3 py-2 bg-slate-900 border border-slate-800 text-xs font-semibold rounded-xl hover:border-slate-700 transition text-slate-300">
              Finance Dashboard
            </Link>
            <Link href="/admin/withdrawals" className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition shadow-md shadow-indigo-600/20">
              User Withdrawals
            </Link>
          </div>
        </div>

        {msg && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: ADD / EDIT PAYMENT ACCOUNT FORM (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleSaveAccount} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  {editingId ? <Edit3 className="w-5 h-5 text-amber-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                  <span>{editingId ? 'Edit Gateway Number' : 'Add New Gateway Number'}</span>
                </h3>
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-lg transition"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="space-y-4 pt-1">
                {/* Gateway Provider */}
                <div>
                  <label className="text-xs font-bold text-slate-300">Gateway Provider *</label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-bold"
                  >
                    <option value="BKASH">bKash (Mobile Financial Service)</option>
                    <option value="NAGAD">Nagad (Post Office Digital Financial Service)</option>
                    <option value="ROCKET">DBBL Rocket</option>
                    <option value="UPAY">Upay</option>
                    <option value="BANK">Bank Account Transfer</option>
                    <option value="CRYPTO">Crypto Wallet (USDT / Binance Pay)</option>
                  </select>
                </div>

                {/* Account Type */}
                <div>
                  <label className="text-xs font-bold text-slate-300">Account Type *</label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="PERSONAL">PERSONAL (Send Money / Cash Out)</option>
                    <option value="MERCHANT">MERCHANT (Merchant Payment)</option>
                    <option value="AGENT">AGENT (Cash In / Agent Pay)</option>
                  </select>
                </div>

                {/* Phone / Account Number */}
                <div>
                  <label className="text-xs font-bold text-slate-300">Phone / Account Number *</label>
                  <input
                    type="text"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 01700000000 or Bank AC Number"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Display Name */}
                <div>
                  <label className="text-xs font-bold text-slate-300">Account Title / Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. EarnSpace Official bKash Personal"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                {/* On/Off Initial Status */}
                <div>
                  <label className="text-xs font-bold text-slate-300">Initial Gateway Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="active">ON (Active for Checkout)</option>
                    <option value="inactive">OFF (Disabled / Maintenance)</option>
                  </select>
                </div>

                {/* Instructions */}
                <div>
                  <label className="text-xs font-bold text-slate-300">Customer Instructions (Optional)</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Send Money to this personal bKash number and paste the 10-character Transaction ID (TrxID) in the checkout form."
                    className="w-full p-3 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 text-xs font-bold rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-lg shadow-indigo-600/30 disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{saving ? 'Saving...' : editingId ? 'Update Gateway Account' : 'Save & Publish Gateway Number'}</span>
              </button>
            </form>
          </div>

          {/* RIGHT: LIST OF GATEWAY NUMBERS WITH LIVE ON/OFF TOGGLE (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-white">Active & Inactive Payment Numbers ({accounts.length})</h3>
                  <p className="text-xs text-slate-400">Toggle On/Off to enable or disable any gateway number instantly.</p>
                </div>
                <button
                  onClick={fetchAccounts}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
                  title="Refresh Accounts"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {loading ? (
                <div className="p-8 text-center text-xs text-slate-500">Loading gateway accounts...</div>
              ) : accounts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl space-y-2">
                  <CreditCard className="w-8 h-8 mx-auto text-indigo-400" />
                  <p className="font-bold text-white">No payment gateway numbers added yet.</p>
                  <p>Add your first bKash or Nagad number using the form on the left.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
                  {accounts.map((acc) => {
                    const isActive = acc.status === 'active';
                    return (
                      <div
                        key={acc.id}
                        className={`p-4 rounded-2xl border space-y-3 transition-all ${
                          isActive
                            ? 'bg-slate-950 border-slate-800 shadow-md'
                            : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${getProviderBadgeColor(acc.provider)}`}>
                              {acc.provider}
                            </span>
                            <span className="text-xs font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded text-[10px]">
                              {acc.accountType}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Live Status Badge */}
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isActive
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              }`}
                            >
                              {isActive ? 'ON (ACTIVE)' : 'OFF (DISABLED)'}
                            </span>

                            {/* One-click On/Off Switch */}
                            <button
                              onClick={() => toggleAccountStatus(acc.id)}
                              className={`p-1.5 rounded-xl border transition flex items-center gap-1 text-xs font-bold ${
                                isActive
                                  ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30'
                                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                              }`}
                              title={isActive ? 'Click to Turn OFF Gateway' : 'Click to Turn ON Gateway'}
                            >
                              <Power className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                          <div>
                            <p className="text-xs text-slate-400">{acc.displayName || `${acc.provider} Account`}</p>
                            <p className="text-base font-mono font-bold text-white tracking-wider flex items-center gap-1.5">
                              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                              <span>{acc.phoneNumber}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-center">
                            <button
                              onClick={() => startEdit(acc)}
                              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold rounded-lg border border-amber-500/20 transition flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(acc.id)}
                              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-lg border border-red-500/20 transition flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
