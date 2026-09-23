import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  User, 
  Plus, 
  Flame, 
  CheckSquare, 
  Square 
} from 'lucide-react';
import { INITIAL_MEMBERS } from '../../data/initialData';

export default function UrgentTaskList({ 
  tasks, 
  onToggleTask, 
  onOpenTaskDetail, 
  onOpenAddTask 
}) {
  // Urgent & high tasks
  const urgentTasks = tasks
    .filter(t => t.priority === 'urgent' || t.priority === 'high')
    .sort((a, b) => {
      // Done tasks to bottom
      if (a.column === 'done' && b.column !== 'done') return 1;
      if (a.column !== 'done' && b.column === 'done') return -1;
      return 0;
    })
    .slice(0, 6);

  const getAssignee = (id) => INITIAL_MEMBERS.find(m => m.id === id);

  return (
    <div className="card-sporty p-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Flame className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Hôm Nay Cần Xử Lý Gấp
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                {tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.column !== 'done').length} việc
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Công việc có độ ưu tiên cao nhất cần BCN và các ban giải quyết
            </p>
          </div>
        </div>

        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-bold text-emerald-400 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm việc mới</span>
        </button>
      </div>

      <div className="mt-4 space-y-2.5">
        {urgentTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400/50 mb-2" />
            <p className="text-sm font-semibold text-slate-300">Tuyệt vời! Không còn việc gấp tồn đọng</p>
            <p className="text-xs mt-1">Tất cả các đầu việc ưu tiên đã được xử lý xong.</p>
          </div>
        ) : (
          urgentTasks.map((task) => {
            const assignee = getAssignee(task.assigneeId);
            const isDone = task.column === 'done';

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 group ${
                  isDone
                    ? 'bg-[#101517] border-white/5 opacity-60'
                    : 'bg-[#141C1E] border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#182326]'
                }`}
              >
                {/* Checkbox & Title */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 text-slate-500 hover:text-emerald-400 transition shrink-0"
                    title={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <div className="w-5 h-5 rounded-lg border-2 border-slate-600 hover:border-emerald-400 flex items-center justify-center transition"></div>
                    )}
                  </button>

                  <div className="min-w-0 cursor-pointer" onClick={() => onOpenTaskDetail(task)}>
                    <p className={`text-sm font-semibold transition ${
                      isDone ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-emerald-400'
                    }`}>
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {task.shift || task.date}
                      </span>
                      <span>•</span>
                      <span className={`font-bold uppercase text-[10px] px-1.5 py-0.2 rounded border ${
                        task.priority === 'urgent'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {task.priority === 'urgent' ? 'Khẩn cấp' : 'Ưu tiên cao'}
                      </span>
                      {task.commentsCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">{task.commentsCount} thảo luận</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assignee Avatar Capsule */}
                {assignee && (
                  <div 
                    className="flex items-center gap-2 shrink-0 pl-2 cursor-pointer"
                    onClick={() => onOpenTaskDetail(task)}
                    title={`Phụ trách: ${assignee.name} (${assignee.role})`}
                  >
                    <img
                      src={assignee.avatar}
                      alt={assignee.name}
                      className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-emerald-400 transition"
                    />
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-bold text-slate-200">{assignee.name}</p>
                      <p className="text-[10px] text-slate-500">{assignee.role}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
