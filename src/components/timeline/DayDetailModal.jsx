import React from 'react';
import { X, Calendar, CheckCircle2, Clock, Plus, ArrowRight } from 'lucide-react';
import { INITIAL_MEMBERS } from '../../data/initialData';

export default function DayDetailModal({ 
  dateStr, 
  tasks, 
  plans, 
  isOpen, 
  onClose, 
  onToggleTask, 
  onOpenTaskDetail, 
  onOpenAddTask,
  onSelectPlan 
}) {
  if (!isOpen) return null;

  const getAssignee = (id) => INITIAL_MEMBERS.find(m => m.id === id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl animate-scaleUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Chi Tiết Hoạt Động Ngày: {dateStr}
              </h3>
              <p className="text-xs text-slate-400">
                {plans.length} sự kiện đang diễn ra • {tasks.length} đầu việc ấn định
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          {/* Active Plans */}
          {plans.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Chiến Dịch & Giải Đấu Trong Ngày
              </h4>
              <div className="space-y-2">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      onSelectPlan(p);
                    }}
                    className="p-3 rounded-2xl bg-[#141C1E] border border-emerald-500/30 hover:border-emerald-400 transition cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {p.code}
                        </span>
                        <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                          {p.title}
                        </p>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{p.location}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tasks of Day */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Công Việc Cần Thực Hiện ({tasks.length})
              </h4>
              <button
                onClick={() => {
                  onClose();
                  onOpenAddTask({ date: dateStr });
                }}
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Thêm việc ngày này
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="p-6 rounded-2xl bg-[#12181A] border border-white/5 text-center text-xs text-slate-500">
                Chưa có công việc nào được lên lịch vào ngày {dateStr}.
              </div>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((task) => {
                  const isDone = task.column === 'done';
                  const assignee = getAssignee(task.assigneeId);

                  return (
                    <div
                      key={task.id}
                      className="p-3 rounded-2xl bg-[#141C1E] border border-white/5 hover:border-white/20 transition flex items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className="mt-0.5 text-slate-500 hover:text-emerald-400 transition shrink-0"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <div className="w-5 h-5 rounded-lg border-2 border-slate-600 hover:border-emerald-400 transition"></div>
                          )}
                        </button>
                        <div 
                          className="min-w-0 cursor-pointer"
                          onClick={() => {
                            onClose();
                            onOpenTaskDetail(task);
                          }}
                        >
                          <p className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                            <span>{task.shift}</span>
                            <span>•</span>
                            <span className="uppercase text-amber-400">{task.priority}</span>
                          </div>
                        </div>
                      </div>

                      {assignee && (
                        <img
                          src={assignee.avatar}
                          alt={assignee.name}
                          className="w-7 h-7 rounded-xl object-cover ring-1 ring-white/10 shrink-0"
                          title={assignee.name}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
