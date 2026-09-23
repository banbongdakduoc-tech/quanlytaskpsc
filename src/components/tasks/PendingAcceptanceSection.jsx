import React, { useState } from 'react';
import { 
  BellRing, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CheckSquare, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { acceptTask } from '../../firebase/services';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function PendingAcceptanceSection({ tasks, currentDept, onTaskAccepted }) {
  const [loadingId, setLoadingId] = useState(null);

  // Filter tasks assigned to currentDept that are pending acceptance
  const pendingTasks = tasks.filter(
    (t) => t.assignedDeptId === currentDept.id && t.status === 'pending_acceptance'
  );

  if (pendingTasks.length === 0) return null;

  const handleAccept = async (task) => {
    try {
      setLoadingId(task.id);
      await acceptTask(task.id, currentDept.id);
      triggerConfetti();
      playChime('success');
      if (onTaskAccepted) {
        onTaskAccepted(`Ban ${currentDept.name} đã xác nhận tiếp nhận "${task.title}"!`);
      }
    } catch (err) {
      console.error('Error accepting task:', err);
      alert('Có lỗi khi nhận task: ' + err.message);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#1F1708] to-[#1C1609] border-2 border-amber-500/40 p-5 shadow-xl shadow-amber-950/30 mb-6 animate-pulse-subtle">
      <div className="flex items-center gap-2.5 pb-3 border-b border-amber-500/20">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
          <BellRing className="w-4 h-4 animate-bounce" />
        </div>
        <div>
          <h3 className="font-black text-amber-300 text-sm tracking-tight flex items-center gap-2">
            Nhiệm Vụ Mới Từ Ban Chủ Nhiệm Cần Xác Nhận Tiếp Nhận ({pendingTasks.length})
          </h3>
          <p className="text-[11px] text-amber-200/70">
            Bấm "Xác nhận nhận task" để chuyển nhiệm vụ vào bảng làm việc riêng của Ban {currentDept.name}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {pendingTasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border transition ${
              task.isReminder
                ? 'bg-rose-950/20 border-rose-500/40 shadow-lg shadow-rose-950/30'
                : 'bg-[#14120A] border-amber-500/30'
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                {task.isReminder ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-rose-500 to-amber-500 text-black flex items-center gap-1 shadow">
                    <BellRing className="w-3 h-3" />
                    <span>BCN Nhắc Nhở & Đôn Đốc</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-black">
                    Chờ Ban Xác Nhận
                  </span>
                )}

                {task.programTitle ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Chương trình: {task.programTitle}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 text-slate-400">
                    Task ngoài chương trình
                  </span>
                )}

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                  task.priority === 'urgent'
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                }`}>
                  Ưu tiên: {task.priority === 'urgent' ? 'Khẩn cấp' : task.priority === 'high' ? 'Cao' : 'Trung bình'}
                </span>

                {task.dueDate && (
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    Hạn: {task.dueDate}
                  </span>
                )}
              </div>

              <h4 className="text-base font-extrabold text-white leading-snug">
                {task.title}
              </h4>

              {task.description && (
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}

              {/* Todos count */}
              {task.todos && task.todos.length > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-300/90 font-medium">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Kèm theo {task.todos.length} mục Todo list BCN giao</span>
                </div>
              )}
            </div>

            <button
              onClick={() => handleAccept(task)}
              disabled={loadingId === task.id}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 disabled:opacity-50 text-black font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>{loadingId === task.id ? 'Đang tiếp nhận...' : 'Xác Nhận Nhận Task'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
