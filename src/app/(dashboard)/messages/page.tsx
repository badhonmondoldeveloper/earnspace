'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Search, Sparkles, Phone, Video, Info, Circle } from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/v1/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCurrentUser(data.data);
      });

    fetchConversations();

    // Auto-polling for new messages every 4 seconds
    const interval = setInterval(fetchConversations, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = () => {
    fetch('/api/v1/messages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setConversations(data.data);
          if (!activeConv && data.data.length > 0) {
            setActiveConv(data.data[0]);
          }
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (activeConv) {
      fetchMessages(activeConv.id);
    }
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = (conversationId: string) => {
    fetch(`/api/v1/messages?conversationId=${conversationId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setMessages(data.data);
        } else if (activeConv?.messages) {
          setMessages(activeConv.messages);
        }
      })
      .catch(() => {
        if (activeConv?.messages) setMessages(activeConv.messages);
      });
  };

  const getPartner = (conv: any) => {
    if (!conv?.members || !currentUser) return null;
    const partnerMember = conv.members.find((m: any) => m.userId !== currentUser.id);
    return partnerMember?.user || conv.partner || null;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv || sending) return;

    const partner = getPartner(activeConv);
    const content = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      const res = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: partner?.id,
          conversationId: activeConv.id,
          content,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          data.data || { id: Date.now().toString(), senderId: currentUser.id, content, createdAt: new Date().toISOString() },
        ]);
        fetchConversations();
      }
    } catch (e) {
      console.error('Send message error:', e);
    } finally {
      setSending(false);
    }
  };

  const filteredConvs = conversations.filter((c) => {
    const partner = getPartner(c);
    const name = partner?.profile?.fullName || partner?.username || 'Conversation';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const activePartner = getPartner(activeConv);

  return (
    <div className="h-[calc(100vh-6rem)] flex rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* 1. Messenger Left Conversation List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>Chats</span>
            </h2>
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search Messenger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none ml-2"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConvs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-1">
              <p className="font-semibold">No chats found.</p>
              <p className="text-[10px]">Start messaging creators from their profile pages!</p>
            </div>
          ) : (
            filteredConvs.map((conv) => {
              const partner = getPartner(conv);
              const isSelected = activeConv?.id === conv.id;
              const lastMsg = conv.messages?.[conv.messages.length - 1] || conv.lastMessage;

              return (
                <button
                  key={conv.id}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full p-3 rounded-2xl text-left transition flex items-center gap-3 ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="relative w-10 h-10 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-500 overflow-hidden">
                    {partner?.profile?.avatar ? (
                      <img src={partner.profile.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      partner?.username?.[0]?.toUpperCase() || 'C'
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {partner?.profile?.fullName || partner?.username || 'Chat'}
                      </p>
                      {lastMsg?.createdAt && (
                        <span className="text-[9px] text-slate-400">
                          {new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lastMsg?.content || 'Click to view conversation'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Messenger Main Active Chat Panel */}
      <div className="flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
        {activeConv ? (
          <>
            {/* Top Chat Header */}
            <div className="p-3.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden shrink-0 border border-indigo-500">
                  {activePartner?.profile?.avatar ? (
                    <img src={activePartner.profile.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    activePartner?.username?.[0]?.toUpperCase() || 'C'
                  )}
                </div>
                <div>
                  <Link
                    href={`/@${activePartner?.username}`}
                    className="text-xs font-bold text-slate-900 dark:text-white hover:underline flex items-center gap-1"
                  >
                    <span>{activePartner?.profile?.fullName || activePartner?.username || 'Creator'}</span>
                    {activePartner?.profile?.isVerified && (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    )}
                  </Link>
                  <p className="text-[10px] text-emerald-500 font-medium flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-emerald-500" /> Active Now
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-500">
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Phone className="w-4 h-4 text-indigo-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Video className="w-4 h-4 text-indigo-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Info className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Thread */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-500 dark:text-slate-300">No messages in this chat yet.</p>
                  <p className="text-[11px]">Send a friendly greeting to start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs sm:max-w-md px-4 py-2.5 rounded-2xl text-xs space-y-1 shadow-sm ${
                          isMine
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        <span className={`text-[9px] block text-right ${isMine ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                type="submit"
                disabled={sending || !messageText.trim()}
                className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition shadow-md shadow-indigo-600/30"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 space-y-2">
            <MessageSquare className="w-12 h-12 text-indigo-500 opacity-60" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Your Messages</p>
            <p className="text-xs text-center max-w-xs text-slate-400">
              Select an existing chat or visit any creator profile to start a new private conversation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
