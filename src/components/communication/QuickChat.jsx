import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  AtSign, 
  Smile, 
  Pin, 
  Image, 
  CheckCheck,
  Sparkles
} from 'lucide-react';
import { INITIAL_MEMBERS } from '../../data/initialData';

export default function QuickChat({ messages, onSendMessage, announcement }) {
  const [inputText, setInputText] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage({
      id: `msg-${Date.now()}`,
      authorId: 'm1',
      authorName: 'Nguyễn Đăng Khoa',
      authorRole: 'Chủ nhiệm CLB',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      date: 'Hôm nay',
      departmentId: 'sports',
      text: inputText.trim(),
      isPinned: false,
    });

    setInputText('');
  };

  const handleInsertMention = (name) => {
    setInputText((prev) => `${prev}@${name} `);
    setShowMentionMenu(false);
  };

  // Helper to format @mentions in text
  const formatMessageText = (text) => {
    const parts = text.split(/(@[\w\sĐđÀ-ỹ]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="card-sporty p-5 flex flex-col h-[650px] relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#141C1E]"></span>
          </div>

          <div>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Phòng Thảo Luận Điều Hành Toàn CLB
            </h3>
            <p className="text-xs text-slate-400">
              Kênh trao đổi chính thức giữa BCN, Trưởng ban & CTV
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            8 Đang online
          </span>
        </div>
      </div>

      {/* Pinned Announcement in Chat */}
      {announcement && (
        <div className="mt-3 p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Pin className="w-4 h-4 text-emerald-400 shrink-0 fill-emerald-400/20" />
            <p className="text-xs text-slate-200 truncate">
              <strong className="text-emerald-400 font-bold">Ghim: </strong>
              {announcement.content}
            </p>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0">19:30 tối nay</span>
        </div>
      )}

      {/* Messages Stream */}
      <div className="mt-4 flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isCurrentUser = msg.authorId === 'm1';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
            >
              <img
                src={msg.avatar}
                alt={msg.authorName}
                className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10 shrink-0 mt-0.5"
              />

              <div className={`max-w-[75%] ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                {/* Author Info */}
                <div className={`flex items-center gap-2 mb-1 text-[11px] ${isCurrentUser ? 'justify-end' : ''}`}>
                  <span className="font-bold text-white">{msg.authorName}</span>
                  <span className="text-slate-500">• {msg.authorRole}</span>
                  <span className="text-slate-500">• {msg.time}</span>
                </div>

                {/* Bubble */}
                <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed transition ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-tr-none shadow-md shadow-emerald-900/30'
                    : 'bg-[#182326] text-slate-200 border border-white/5 rounded-tl-none hover:border-white/10'
                }`}>
                  {formatMessageText(msg.text)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Mention Popper Dropdown */}
      {showMentionMenu && (
        <div className="absolute bottom-20 left-6 z-20 w-64 rounded-2xl bg-[#0E1416] border border-white/10 shadow-2xl p-2 animate-fadeIn">
          <p className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">Tag thành viên (@mention)</p>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {INITIAL_MEMBERS.map((m) => (
              <button
                key={m.id}
                onClick={() => handleInsertMention(m.name)}
                className="w-full flex items-center gap-2 p-2 rounded-xl hover:bg-emerald-500/10 text-left transition"
              >
                <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{m.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{m.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSend} className="mt-3 pt-3 border-t border-white/5 flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setShowMentionMenu(!showMentionMenu)}
          className="p-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition"
          title="Tag thành viên (@)"
        >
          <AtSign className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => alert('Đã mở công cụ đính kèm ảnh & file tài liệu kế hoạch.')}
          className="p-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-slate-400 hover:text-emerald-400 hover:border-emerald-500/30 transition hidden sm:block"
          title="Đính kèm file"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          placeholder="Nhập tin nhắn trao đổi, dùng @ để tag đồng đội..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl bg-[#0E1416] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-extrabold transition shadow-lg shadow-emerald-500/20 shrink-0"
        >
          <Send className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>
    </div>
  );
}
