'use client';

import { useState, useEffect } from 'react';
import { History, ShieldCheck } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/admin/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLogs(data.data || []);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <History className="w-6 h-6 text-brand-500" />
          <span>Immutable Audit Logs</span>
        </h1>
        <p className="text-xs text-slate-400">Append-only administrative event timeline for security & compliance audits</p>
      </div>

      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No audit logs recorded yet.</div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-brand-400">{log.action}</span>
                  <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-slate-300">
                  By <strong className="text-white">{log.adminUser?.fullName || 'System'}</strong> on {log.targetType} #{log.targetId || 'global'}
                </p>
                <p className="text-[11px] text-slate-400 italic">&quot;Reason: {log.reason}&quot;</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

