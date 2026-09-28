import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Send, Building2, Flag, ArrowLeft, MessageSquare,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { demoConversations } from '../../data/demoConversations';

function Messages() {
  const toast = useToast();

  const [conversations, setConversations] = useState(demoConversations);
  const [activeId, setActiveId] = useState(demoConversations[0]?.id ?? null);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState('');
  const [mobileView, setMobileView] = useState('list');

  const messagesEndRef = useRef(null);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId]
  );

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeId, activeConversation?.messages.length]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.hostel.toLowerCase().includes(q) ||
        c.messages[c.messages.length - 1]?.text.toLowerCase().includes(q)
    );
  }, [conversations, search]);

  const openConversation = (id) => {
    setActiveId(id);
    setMobileView('chat');
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeConversation) return;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConversation.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                { id: c.messages.length + 1, from: 'me', text, time },
              ],
              lastMessageAt: time,
            }
          : c
      )
    );
    setDraft('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleReport = () => {
    toast.warning('Report submitted. Our team will review this conversation.');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6 p-6 overflow-hidden">
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-3xl font-bold" style={{ color: '#E9A23B' }}>Messages</h1>
        <p className="mt-1" style={{ color: '#4B5563' }}>
          Chat directly with tenants
        </p>
      </div>

      <div
        className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[360px_1fr] rounded-xl overflow-hidden"
        style={{ backgroundColor: '#F4F6F8', border: '1px solid #E5E7EB' }}
      >
        {/* ── Conversation List ── */}
        <aside
          className={`flex-col min-h-0 border-r ${
            mobileView === 'list' ? 'flex' : 'hidden lg:flex'
          }`}
          style={{ borderColor: '#E5E7EB' }}
        >
          {/* Search */}
          <div className="p-4 border-b flex-shrink-0" style={{ borderColor: '#E5E7EB' }}>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B]"
              />
            </div>
          </div>

          {/* List — scrollable */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500">
                No conversations match your search.
              </div>
            ) : (
              filtered.map((c) => {
                const last = c.messages[c.messages.length - 1];
                const isActive = c.id === activeId;
                return (
                  <button
                    key={c.id}
                    onClick={() => openConversation(c.id)}
                    className="w-full text-left p-4 transition-colors"
                    style={{
                      backgroundColor: isActive ? 'rgba(233,162,59,0.1)' : 'transparent',
                      borderLeft: isActive ? '3px solid #E9A23B' : '3px solid transparent',
                      borderBottom: '1px solid #E5E7EB',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={c.avatar}
                          alt={c.name}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                        {c.online && (
                          <span
                            className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                            style={{ backgroundColor: '#10B981', borderColor: '#F4F6F8' }}
                          ></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-sm truncate" style={{ color: '#14213D' }}>
                            {c.name}
                          </p>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {c.lastMessageAt}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 truncate mt-0.5">
                          {last?.from === 'me' && <span className="text-gray-400">You: </span>}
                          {last?.text || 'No messages yet'}
                        </p>
                      </div>
                      {c.unread > 0 && (
                        <span
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                          style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
                        >
                          {c.unread}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* ── Chat Window ── */}
        <section
          className={`flex-col min-h-0 bg-white ${
            mobileView === 'chat' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {!activeConversation ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: 'rgba(233,162,59,0.15)' }}
              >
                <MessageSquare size={28} style={{ color: '#E9A23B' }} />
              </div>
              <h3 className="text-lg font-semibold" style={{ color: '#14213D' }}>
                Select a conversation
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Choose a chat from the list to start messaging.
              </p>
            </div>
          ) : (
            <>
              {/* Chat header — fixed */}
              <div
                className="flex items-center justify-between p-4 border-b flex-shrink-0"
                style={{ borderColor: '#E5E7EB', backgroundColor: '#F4F6F8' }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => setMobileView('list')}
                    className="lg:hidden p-2 rounded-lg hover:bg-white transition-colors"
                  >
                    <ArrowLeft size={18} style={{ color: '#14213D' }} />
                  </button>
                  <img
                    src={activeConversation.avatar}
                    alt={activeConversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate" style={{ color: '#14213D' }}>
                      {activeConversation.name}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {activeConversation.online ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#10B981' }}></span>
                          Online
                        </>
                      ) : (
                        'Offline'
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/landlord/hostels/${activeConversation.hostelId}`}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: 'rgba(74,144,217,0.12)', color: '#4A90D9' }}
                  >
                    <Building2 size={13} />
                    View Hostel
                  </Link>
                  <button
                    onClick={handleReport}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#DC2626' }}
                  >
                    <Flag size={13} />
                    Report
                  </button>
                </div>
              </div>

              {/* Messages — scrollable */}
              <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-3">
                {activeConversation.messages.map((m, i) => {
                  const isMine = m.from === 'me';
                  const showTime =
                    i === 0 ||
                    activeConversation.messages[i - 1].from !== m.from;

                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                        {showTime && (
                          <span className="text-[10px] text-gray-400 mb-1 px-1">
                            {m.time}
                          </span>
                        )}
                        <div
                          className="px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm"
                          style={
                            isMine
                              ? { backgroundColor: '#E9A23B', color: '#14213D', borderBottomRightRadius: 4 }
                              : { backgroundColor: '#F4F6F8', color: '#1B1F27', borderBottomLeftRadius: 4, border: '1px solid #E5E7EB' }
                          }
                        >
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input — fixed */}
              <div
                className="p-4 border-t flex-shrink-0"
                style={{ borderColor: '#E5E7EB', backgroundColor: '#F4F6F8' }}
              >
                <div className="flex items-end gap-2">
                  <textarea
                    rows={1}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="flex-1 resize-none px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E9A23B] max-h-32"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!draft.trim()}
                    className="p-2.5 rounded-lg transition-colors flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#E9A23B', color: '#14213D' }}
                    onMouseOver={(e) => draft.trim() && (e.currentTarget.style.backgroundColor = '#C8862A')}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#E9A23B')}
                  >
                    <Send size={18} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1.5 px-1">
                  Press Enter to send · Shift+Enter for new line
                </p>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default Messages;