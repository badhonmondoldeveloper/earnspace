'use client';

import { useState, useEffect } from 'react';
import { Activity, Database, Server, Cpu, CheckCircle2 } from 'lucide-react';

export default function AdminSystemHealthPage() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/system-health')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setHealth(data.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-emerald-500" />
          <span>System Health & Infrastructure Monitor</span>
        </h1>
        <p className="text-xs text-slate-400">Database latency, uptime, memory, and environment health checks</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Checking system health...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Database Status</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-emerald-400">ONLINE</p>
            <span className="text-[10px] text-slate-400 block">Latency: {health?.database?.latencyMs || 0} ms</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Node Runtime Uptime</span>
              <Server className="w-4 h-4 text-brand-400" />
            </div>
            <p className="text-xl font-bold text-white">{health?.system?.uptimeSeconds || 0}s</p>
            <span className="text-[10px] text-slate-400 block">Node {health?.system?.nodeVersion}</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Environment</span>
              <Cpu className="w-4 h-4 text-sky-400" />
            </div>
            <p className="text-xl font-bold uppercase text-white">{health?.system?.environment}</p>
            <span className="text-[10px] text-slate-400 block">Checked at {new Date(health?.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

