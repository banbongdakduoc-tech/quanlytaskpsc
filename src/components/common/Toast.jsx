import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 right-6 z-50 animate-slideUp">
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#0E1416] border border-emerald-500/40 shadow-2xl shadow-emerald-950/50 text-white min-w-[280px] max-w-sm">
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-white">{toast.title || 'Thông báo'}</p>
          <p className="text-[11px] text-slate-300 mt-0.5 line-clamp-2">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
