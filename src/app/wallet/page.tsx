'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  CreditCard,
  ShieldCheck,
  Send,
  QrCode,
  Smartphone,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

import { ManualPaymentModal } from '@/components/payment/ManualPaymentModal';

export default function WalletPage() {
  const [overview, setOverview] = useState<any>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [intents, setIntents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual Deposit Modal State
  const [showManualDepositModal, setShowManualDepositModal] = useState(false);

  // Transfer Modal State
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [transfering, setTransfering] = useState(false);

  // Payment Intent Modal State
  const [showIntentModal, setShowIntentModal] = useState(false);
  const [intentAmount, setIntentAmount] = useState('500');
  const [intentDesc, setIntentDesc] = useState('');
  const [createdIntent, setCreatedIntent] = useState<any>(null);
  const [creatingIntent, setCreatingIntent] = useState(false);

  // Add Account Modal State
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accProvider, setAccProvider] = useState('BKASH');
  const [accPhone, setAccPhone] = useState('');
  const [addingAcc, setAddingAcc] = useState(false);

  const [message, setMessage] = useState('');

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [ovRes, accRes, devRes, intRes] = await Promise.all([
        fetch('/api/v1/wallet/overview').then((r) => r.json()),
        fetch('/api/v1/wallet/accounts').then((r) => r.json()),
        fetch('/api/v1/wallet/devices').then((r) => r.json()),
        fetch('/api/v1/wallet/intents').then((r) => r.json()),
      ]);

      if (ovRes.success) setOverview(ovRes.data);
      if (accRes.success) setAccounts(accRes.data || []);
      if (devRes.success) setDevices(devRes.data || []);
      if (intRes.success) setIntents(intRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !transferAmount) return;
    setTransfering(true);
    setMessage('');

    try {
      const res = await fetch('/api/v1/wallet/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientUsernameOrEmail: recipient,
          amount: parseFloat(transferAmount),
          note: transferNote,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage(`Transfer of ৳${transferAmount} to @${json.data.recipientUsername} completed successfully!`);
        setShowTransferModal(false);
        setRecipient('');
        setTransferAmount('');
        setTransferNote('');
        fetchWalletData();
      } else {
        setMessage(`Error: ${json.message}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setTransfering(false);
    }
  };

  const handleCreateIntent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intentAmount) return;
    setCreatingIntent(true);
    setCreatedIntent(null);

    try {
      const res = await fetch('/api/v1/wallet/intents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(intentAmount),
          description: intentDesc,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setCreatedIntent(json.data);
        fetchWalletData();
      } else {
        setMessage(`Error: ${json.message}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setCreatingIntent(false);
    }
  };

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accPhone) return;
    setAddingAcc(true);

    try {
      const res = await fetch('/api/v1/wallet/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: accProvider,
          phoneNumber: accPhone,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMessage(`External ${accProvider} account added successfully!`);
        setShowAccountModal(false);
        setAccPhone('');
        fetchWalletData();
      } else {
        setMessage(`Error: ${json.message}`);
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setAddingAcc(false);
    }
  };

  const wallet = overview?.wallet || { availableBalance: 0, pendingBalance: 0, lifetimeEarned: 0, lifetimeWithdrawn: 0, isFrozen: false };
  const transactions = overview?.transactions || [];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 text-white">
              <WalletIcon className="w-7 h-7 text-indigo-400" />
              <span>EarnSpace Multi-User Wallet Engine</span>
            </h1>
            <p className="text-xs text-slate-400">Isolated user ledger, payment intent matching, and multi-provider reconciliation</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowManualDepositModal(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-pink-600 via-indigo-600 to-cyan-600 hover:from-pink-500 hover:to-cyan-500 text-white transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Add Money (bKash / MFS)</span>
            </button>
            <button
              onClick={() => setShowTransferModal(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Money</span>
            </button>
            <button
              onClick={() => setShowIntentModal(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 shadow-md shadow-emerald-600/30"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Receive (Intent)</span>
            </button>
            <Link
              href="/withdrawals"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700 flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Withdraw</span>
            </Link>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {wallet.isFrozen && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold text-xs flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            <span>Your wallet is currently frozen by administration. Outgoing transfers and withdrawals are restricted.</span>
          </div>
        )}

        {/* 1. BALANCE CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 space-y-2 shadow-lg relative overflow-hidden">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Available Balance</span>
            <div className="text-3xl font-black text-white">৳{wallet.availableBalance.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 font-medium">Ready for withdrawals, store purchases & transfers</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Pending Balance</span>
            <div className="text-3xl font-black text-amber-400">৳{wallet.pendingBalance.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 font-medium">Verification / policy hold period</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-2 shadow-lg">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Lifetime Earned</span>
            <div className="text-3xl font-black text-emerald-400">৳{wallet.lifetimeEarned.toLocaleString()}</div>
            <p className="text-[11px] text-slate-400 font-medium">Total gross platform revenue credited</p>
          </div>
        </div>

        {/* 2. PAYMENT ACCOUNTS & PAIRED DEVICES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* External Payment Accounts */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <span>External Payment Accounts</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{accounts.length} Accounts</span>
                </h3>
                <p className="text-xs text-slate-400">bKash, Nagad, Rocket, Upay & Bank destinations</p>
              </div>

              <button
                onClick={() => setShowAccountModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 text-xs font-bold transition flex items-center gap-1 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-2">
              {accounts.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No external payment accounts configured yet.</p>
              ) : (
                accounts.map((acc) => (
                  <div key={acc.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{acc.provider}</span>
                        <span className="text-[9px] px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-400 font-bold">{acc.accountType}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] font-mono">{acc.maskedPhone}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${acc.verificationStatus === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {acc.verificationStatus}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Paired Companion Android Devices */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-400" />
                  <span>Paired Ingestion Devices</span>
                </h3>
                <p className="text-xs text-slate-400">Android SMS companion pairing with HMAC SHA256 security</p>
              </div>

              <span className="text-[10px] bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-full font-bold">HMAC Encrypted</span>
            </div>

            <div className="space-y-2">
              {devices.length === 0 ? (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 text-center">
                  <p className="font-bold text-slate-300">No Android companion devices paired</p>
                  <p className="text-[11px] text-slate-500">Pair your Android device to enable automated transaction SMS detection.</p>
                </div>
              ) : (
                devices.map((dev) => (
                  <div key={dev.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{dev.deviceName}</span>
                        <span className="text-[9px] text-slate-500">v{dev.appVersion}</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Last Active: {new Date(dev.lastSeenAt).toLocaleString()}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                      {dev.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 3. TRANSACTION LEDGER LOG */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              <span>Immutable Ledger History ({transactions.length})</span>
            </h3>
            <button onClick={fetchWalletData} className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-indigo-400 transition">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Balance Change</th>
                  <th className="py-3 px-4 text-right">Balance After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">No ledger transactions recorded yet.</td>
                  </tr>
                ) : (
                  transactions.map((tx: any) => {
                    const isCredit = ['EARNING', 'PAYMENT_RECEIVED', 'TRANSFER_IN', 'REFUND', 'BONUS', 'earning', 'referral', 'bonus', 'refund', 'fan_support', 'product_sale', 'fan_subscription', 'affiliate_commission', 'deposit'].includes(tx.type);
                    return (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{new Date(tx.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isCredit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-200">{tx.description}</td>
                        <td className={`py-3 px-4 font-bold ${isCredit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isCredit ? '+' : '-'}৳{tx.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">৳{tx.balanceAfter.toLocaleString()}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL 1: TRANSFER MONEY */}
        {showTransferModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h2 className="text-base font-extrabold text-white">Send Money (Internal Transfer)</h2>
              <form onSubmit={handleTransfer} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Recipient Username or Email *</label>
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="e.g. rahim_dev"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Amount (BDT ৳) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="500"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Note (Optional)</label>
                  <input
                    type="text"
                    value={transferNote}
                    onChange={(e) => setTransferNote(e.target.value)}
                    placeholder="Payment for design services"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={transfering}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                  >
                    {transfering ? 'Sending...' : 'Confirm Transfer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: RECEIVE MONEY INTENT */}
        {showIntentModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h2 className="text-base font-extrabold text-white">Generate Payment Intent Reference</h2>
              
              {createdIntent ? (
                <div className="space-y-4 text-center py-2">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Payment Reference Code</span>
                    <div className="text-2xl font-black font-mono text-white tracking-widest">{createdIntent.reference}</div>
                    <p className="text-xs text-slate-300">Amount: ৳{createdIntent.amount}</p>
                    <p className="text-[10px] text-slate-400">Instruct customer to use this reference code when making bKash / Nagad payment!</p>
                  </div>
                  <button
                    onClick={() => { setShowIntentModal(false); setCreatedIntent(null); }}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCreateIntent} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Expected Amount (BDT ৳) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={intentAmount}
                      onChange={(e) => setIntentAmount(e.target.value)}
                      placeholder="500"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">Description</label>
                    <input
                      type="text"
                      value={intentDesc}
                      onChange={(e) => setIntentDesc(e.target.value)}
                      placeholder="Order payment #108"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowIntentModal(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingIntent}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                    >
                      {creatingIntent ? 'Generating...' : 'Generate Reference Code'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MODAL 3: ADD PAYMENT ACCOUNT */}
        {showAccountModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <h2 className="text-base font-extrabold text-white">Add External Payment Account</h2>
              <form onSubmit={handleAddAccount} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Provider *</label>
                  <select
                    value={accProvider}
                    onChange={(e) => setAccProvider(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="BKASH">bKash</option>
                    <option value="NAGAD">Nagad</option>
                    <option value="ROCKET">Rocket</option>
                    <option value="UPAY">Upay</option>
                    <option value="BANK">Bank Account</option>
                    <option value="CRYPTO">Crypto Wallet</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Phone Number / Account ID *</label>
                  <input
                    type="text"
                    required
                    value={accPhone}
                    onChange={(e) => setAccPhone(e.target.value)}
                    placeholder="01712345678"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAccountModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingAcc}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                  >
                    {addingAcc ? 'Saving...' : 'Add Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* MANUAL PAYMENT DEPOSIT MODAL */}
        <ManualPaymentModal
          isOpen={showManualDepositModal}
          onClose={() => setShowManualDepositModal(false)}
          onSuccess={() => fetchWalletData()}
        />
      </main>

      <Footer />
    </div>
  );
}
