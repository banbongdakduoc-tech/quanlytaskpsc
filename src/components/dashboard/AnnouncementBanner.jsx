import React, { useState } from 'react';
import { Megaphone, AlertCircle, Pin, ArrowRight, X } from 'lucide-react';

export default function AnnouncementBanner({ announcement, onOpenAction }) {
  const [dismissed, setDismissed] = useState(false);

  if (!announcement || dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#102022] to-[#122A26] border border-emerald-500/30 p-5 shadow-xl shadow-emerald-950/30">
      {/* Decorative Glow */}
      <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
            <Pin className="w-5 h-5 fill-emerald-400/20" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500 text-black shadow-sm">
                THÔNG BÁO BCN
              </span>
              <span className="text-xs text-slate-400">• {announcement.author}</span>
              <span className="text-xs text-slate-500">• {announcement.time}</span>
            </div>

            <p className="text-sm font-medium text-slate-200 mt-1.5 leading-relaxed max-w-3xl">
              {announcement.content}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={onOpenAction}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold tracking-wide transition shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            <span>Tham gia họp / Chi tiết</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
          
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition"
            title="Đóng thông báo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
