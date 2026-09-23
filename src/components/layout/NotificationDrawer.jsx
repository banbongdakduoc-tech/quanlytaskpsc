import React from 'react';
import { Bell, AlertTriangle, Clock, CheckCircle2, X, ChevronRight } from 'lucide-react';

export default function NotificationDrawer({ isOpen, onClose, onSelectTask, onNavigateTab }) {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      title: 'Họp khẩn Ban Chủ Nhiệm',
      desc: '19:30 tối nay tại P.Hội trường A duyệt điều lệ giải bóng đá',
      time: '15 phút trước',
      type: 'urgent',
      tab: 'overview',
    },
    {
      id: 'notif-2',
      title: 'Hạn duyệt dự trù in ấn',
      desc: 'Bảng kê in ấn 1.500 cẩm nang tuyển CTV K26 chờ ký',
      time: '1 giờ trước',
      type: 'warning',
      tab: 'plans',
    },
    {
      id: 'notif-3',
      title: 'Tiếp nhận tài trợ Revive',
      desc: '50 thùng nước đã chuyển về sảnh nhà thể thao',
      time: '2 giờ trước',
      type: 'info',
      tab: 'communication',
    },
    {
      id: 'notif-4',
      title: 'Hoàn thành lắp đặt dàn đèn',
      desc: 'Đèn sân bóng đá A & B đạt chuẩn thi đấu buổi tối',
      time: '4 giờ trước',
      type: 'success',
      tab: 'timeline',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#0E1416] border-l border-white/10 h-full p-6 flex flex-col shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Thông báo & Nhắc nhở</h3>
              <p className="text-xs text-slate-400">4 cập nhật quan trọng hôm nay</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3 flex-1">
          {notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                onNavigateTab(item.tab);
                onClose();
              }}
              className="p-4 rounded-2xl bg-[#141C1E] border border-white/5 hover:border-emerald-500/40 hover:bg-[#182326] transition cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                {item.type === 'urgent' && (
                  <span className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </span>
                )}
                {item.type === 'warning' && (
                  <span className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                    <Clock className="w-4 h-4" />
                  </span>
                )}
                {item.type === 'info' && (
                  <span className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0">
                    <Bell className="w-4 h-4" />
                  </span>
                )}
                {item.type === 'success' && (
                  <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition truncate">
                      {item.title}
                    </h4>
                    <span className="text-[11px] text-slate-500 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/10 mt-4">
          <button 
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-sm font-medium transition flex items-center justify-center gap-2"
          >
            Đánh dấu đã đọc tất cả
          </button>
        </div>
      </div>
    </div>
  );
}
