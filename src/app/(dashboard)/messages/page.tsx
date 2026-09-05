'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Send, User } from 'lucide-react';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetch('/api/v1/messages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setConversations(data.data);
          if (data.data.length > 0) setActiveConv(data.data[0]);
        }
      });
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv) return;

    const recipient = activeConv.members.find((m: any) => m.userId !== activeConv.currentUserId)?.user;
    if (!recipient) return;

    setSending(true);
    try {
      const res = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: recipient.id, content: messageText }),
      });
      const data = await res.json();
      if (data.success) {
        setMessageText('');
        // Refresh messages list
        fetch('/api/v1/messages')
          .then((res) => res.json())
          .then((d) => setConversations(d.data || []));
      }
    } catch (e) {
      console.error('Send message error:', e);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden">
      {/* Conversations List Sidebar */}
      <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 p-4 space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-500" />
          <span>Messages</span>
        </h2>

        <div className="space-y-1">
          {conversations.length === 0 ? (
            <p className="text-xs text-slate-400 p-4 text-center">No conversations yet.</p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveConv(conv)}
                className={`w-full p-3 rounded-xl text-left transition flex items-center gap-3 ${
                  activeConv?.id === conv.id ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600' : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center">
                  C
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold block truncate text-slate-900 dark:text-white">Conversation</span>
                  <span className="text-[10px] text-slate-400 block truncate">{conv.messages?.[0]?.content || 'Started conversation'}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between p-4 bg-slate-50/50 dark:bg-slate-950/50">
        {activeConv ? (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-2">
              <div className="p-3 rounded-2xl bg-brand-500 text-white text-xs max-w-xs ml-auto">
                Welcome to direct messaging on EarnSpace!
              </div>
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
              <button
                type="submit"
                disabled={sending}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
}

