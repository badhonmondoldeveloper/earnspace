'use client';

import { useState, useEffect } from 'react';
import {
  Code,
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Globe,
  Database,
  Layers,
  ShieldCheck,
  Terminal,
  Zap,
  ExternalLink,
  Lock,
} from 'lucide-react';

export default function DeveloperApiPage() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [environment, setEnvironment] = useState<'live' | 'test'>('live');
  const [newRawKey, setNewRawKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/v1/developer/keys');
      const data = await res.json();
      if (data.success) {
        setKeys(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyName.trim()) return;

    try {
      setCreating(true);
      setError(null);
      const res = await fetch('/api/v1/developer/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: keyName.trim(),
          environment,
          scopes: ['read:page', 'read:products', 'write:leads', 'read:stats'],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNewRawKey(data.data.rawKey);
        setKeyName('');
        fetchKeys();
      } else {
        setError(data.error || 'Failed to create API key');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? External integrations using this key will immediately lose access.')) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/developer/keys/${keyId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchKeys();
      } else {
        alert(data.error || 'Failed to revoke API key');
      }
    } catch (err) {
      alert('Error revoking API key');
    }
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    if (identifier === 'key') {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedSnippet(identifier);
      setTimeout(() => setCopiedSnippet(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Code className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
                Developer API & Integrations Hub
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Connect your EarnSpace ready-made website to mobile apps, WordPress, custom domains, and external APIs.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Generate API Key</span>
        </button>
      </div>

      {/* New Key Revealed Modal */}
      {newRawKey && (
        <div className="p-6 bg-emerald-950/40 border border-emerald-500/40 rounded-2xl space-y-4 shadow-xl animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <ShieldCheck className="w-5 h-5" />
              <span>API Key Generated Successfully</span>
            </div>
            <button
              onClick={() => setNewRawKey(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
            >
              Dismiss
            </button>
          </div>
          <p className="text-slate-300 text-xs">
            Save this key now in a secure place. <strong className="text-amber-400">It will not be displayed again!</strong>
          </p>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-3">
            <code className="text-emerald-300 text-sm font-mono flex-1 break-all">{newRawKey}</code>
            <button
              onClick={() => copyToClipboard(newRawKey, 'key')}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg transition"
            >
              {copiedKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Active API Keys List */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold">Your API Keys</h2>
          </div>
          <span className="text-xs text-slate-400">{keys.filter((k) => !k.isRevoked).length} Active Keys</span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-sm">Loading API Keys...</div>
        ) : keys.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm space-y-2">
            <p>No API keys generated yet.</p>
            <p className="text-xs text-slate-500">Create an API key to connect external applications and headless websites.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {keys.map((k) => (
              <div key={k.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{k.name}</span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        k.environment === 'live'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {k.environment}
                    </span>
                    {k.isRevoked && (
                      <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full">
                        Revoked
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                    <span>Key Prefix: {k.keyPrefix}...</span>
                    <span>•</span>
                    <span>Created: {new Date(k.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Last used: {k.lastUsedAt ? new Date(k.lastUsedAt).toLocaleDateString() : 'Never'}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {k.scopes.map((scope: string) => (
                      <span key={scope} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                {!k.isRevoked && (
                  <button
                    onClick={() => handleRevokeKey(k.id)}
                    className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-800/40 px-3 py-1.5 rounded-lg transition self-start md:self-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Revoke</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* API Documentation & Integration Quickstart */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Terminal className="w-5 h-5 text-sky-400" />
          <span>API Connection Endpoints & Code Examples</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Endpoint 1: Headless Page Content API */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2.5 py-1 rounded-lg">
                GET /api/v1/connect/page
              </span>
              <span className="text-xs text-slate-400">Headless Page & Blocks</span>
            </div>
            <p className="text-xs text-slate-300">
              Fetch your custom EarnSpace website page layout, block data, and themes to render on any external web frontend.
            </p>
            <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-slate-300 relative border border-slate-800">
              <pre className="overflow-x-auto">
{`curl -X GET "https://earnspace-chi.vercel.app/api/v1/connect/page" \\
  -H "Authorization: Bearer es_live_YOUR_KEY"`}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(
                    `curl -X GET "https://earnspace-chi.vercel.app/api/v1/connect/page" -H "Authorization: Bearer es_live_YOUR_KEY"`,
                    'snippet1'
                  )
                }
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
              >
                {copiedSnippet === 'snippet1' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Endpoint 2: Contact Leads API */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                POST /api/v1/connect/leads
              </span>
              <span className="text-xs text-slate-400">External Contact Lead Ingestion</span>
            </div>
            <p className="text-xs text-slate-300">
              Submit form entries from WordPress, external sites, or mobile apps directly into your EarnSpace dashboard notifications.
            </p>
            <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-slate-300 relative border border-slate-800">
              <pre className="overflow-x-auto">
{`curl -X POST "https://earnspace-chi.vercel.app/api/v1/connect/leads" \\
  -H "Authorization: Bearer es_live_YOUR_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com","message":"Hello from my WordPress site!"}'`}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(
                    `curl -X POST "https://earnspace-chi.vercel.app/api/v1/connect/leads" -H "Authorization: Bearer es_live_YOUR_KEY" -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","message":"Hello!"}'`,
                    'snippet2'
                  )
                }
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
              >
                {copiedSnippet === 'snippet2' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Endpoint 3: Digital Products API */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                GET /api/v1/connect/products
              </span>
              <span className="text-xs text-slate-400">Digital Store Products Catalog</span>
            </div>
            <p className="text-xs text-slate-300">
              Fetch active digital store products, prices, and direct checkout links to sell anywhere.
            </p>
            <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-slate-300 relative border border-slate-800">
              <pre className="overflow-x-auto">
{`curl -X GET "https://earnspace-chi.vercel.app/api/v1/connect/products" \\
  -H "Authorization: Bearer es_live_YOUR_KEY"`}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(
                    `curl -X GET "https://earnspace-chi.vercel.app/api/v1/connect/products" -H "Authorization: Bearer es_live_YOUR_KEY"`,
                    'snippet3'
                  )
                }
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
              >
                {copiedSnippet === 'snippet3' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Endpoint 4: Traffic & Revenue Stats */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-lg">
                GET /api/v1/connect/stats
              </span>
              <span className="text-xs text-slate-400">Real-Time Traffic & Wallet Balance</span>
            </div>
            <p className="text-xs text-slate-300">
              Retrieve real-time website view count, active products count, and wallet balance in BDT.
            </p>
            <div className="bg-slate-950 rounded-xl p-3 font-mono text-xs text-slate-300 relative border border-slate-800">
              <pre className="overflow-x-auto">
{`curl -X GET "https://earnspace-chi.vercel.app/api/v1/connect/stats" \\
  -H "Authorization: Bearer es_live_YOUR_KEY"`}
              </pre>
              <button
                onClick={() =>
                  copyToClipboard(
                    `curl -X GET "https://earnspace-chi.vercel.app/api/v1/connect/stats" -H "Authorization: Bearer es_live_YOUR_KEY"`,
                    'snippet4'
                  )
                }
                className="absolute top-2 right-2 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition"
              >
                {copiedSnippet === 'snippet4' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Generate New Key */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-lg">Generate New API Key</h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateKey} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Key Name / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. My WordPress Site, Mobile App, Headless Frontend"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Environment
                </label>
                <select
                  value={environment}
                  onChange={(e: any) => setEnvironment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none transition"
                >
                  <option value="live">Live Production (es_live_...)</option>
                  <option value="test">Test Sandbox (es_test_...)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white transition disabled:opacity-50"
                >
                  {creating ? 'Generating...' : 'Create Key'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
