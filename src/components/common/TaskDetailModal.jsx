import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  User, 
  MessageSquare, 
  Send, 
  AtSign, 
  AlertTriangle,
  Flag,
  Share2
} from 'lucide-react';
import { INITIAL_MEMBERS, DEPARTMENTS, INITIAL_PLANS } from '../../data/initialData';

export default function TaskDetailModal({ 
  task, 
  isOpen, 
  onClose, 
  onToggleTask,
  onAddComment,
  onMoveColumn 
}) {
  const [newComment, setNewComment] = useState('');

  if (!isOpen || !task) return null;

  const assignee = INITIAL_MEMBERS.find(m => m.id === task.assigneeId);
  const dept = DEPARTMENTS.find(d => d.id === task.departmentId);
  const plan = INITIAL_PLANS.find(p => p.id === task.planId);
  const isDone = task.column === 'done';

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(task.id, {
      id: `c-${Date.now()}`,
      authorName: 'Nguyễn Đăng Khoa',
      authorRole: 'Chủ nhiệm CLB',
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      text: newComment.trim(),
    });

    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggleTask(task.id)}
              className="mt-1 text-slate-500 hover:text-emerald-400 transition"
              title={isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
            >
              {isDone ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <div className="w-6 h-6 rounded-xl border-2 border-slate-600 hover:border-emerald-400 transition"></div>
              )}
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                {plan && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {plan.code}
                  </span>
                )}
                {dept && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-300">
                    {dept.name}
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                  task.priority === 'urgent'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}>
                  {task.priority === 'urgent' ? 'Khẩn cấp' : task.priority === 'high' ? 'Ưu tiên cao' : 'Bình thường'}
                </span>
              </div>

              <h3 className={`text-lg font-bold text-white leading-snug ${isDone ? 'line-through text-slate-400' : ''}`}>
                {task.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Details */}
        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {task.description && (
            <div className="p-3.5 rounded-2xl bg-[#141C1E] border border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {task.description}
            </div>
          )}

          {/* Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-[#141C1E] border border-white/5 flex items-center gap-2.5">
              {assignee && (
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10"
                />
              )}
              <div className="min-w-0">
                <span className="text-[10px] text-slate-500 block">Người phụ trách:</span>
                <span className="font-bold text-white truncate">{assignee?.name || 'Chưa gán'}</span>
                <span className="text-[10px] text-slate-400 block">{assignee?.role}</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#141C1E] border border-white/5 flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block">Thời gian & Ca trực:</span>
                <span className="font-bold text-white">{task.shift || 'Linh hoạt'}</span>
                <span className="text-[10px] text-slate-400 block">Ngày: {task.date}</span>
              </div>
            </div>
          </div>

          {/* Status Changer */}
          <div className="p-3 rounded-2xl bg-[#141C1E] border border-white/5 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Trạng thái công việc:</span>
            <div className="flex items-center gap-1.5">
              {['todo', 'in_progress', 'review', 'done'].map((col) => (
                <button
                  key={col}
                  onClick={() => onMoveColumn(task.id, col)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    task.column === col
                      ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {col === 'todo' ? 'Cần làm' : col === 'in_progress' ? 'Đang làm' : col === 'review' ? 'Chờ duyệt' : 'Xong'}
                </button>
              ))}
            </div>
          </div>

          {/* Contextual Comments Section */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Bình luận & Báo cáo tiến độ ({task.comments?.length || 0})</span>
            </h4>

            {/* Comment list */}
            <div className="space-y-2 mb-3">
              {(!task.comments || task.comments.length === 0) ? (
                <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-[#12181A]">
                  Chưa có trao đổi nào dưới công việc này.
                </p>
              ) : (
                task.comments.map((cm) => (
                  <div key={cm.id} className="p-3 rounded-xl bg-[#141C1E] border border-white/5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-bold text-emerald-400">{cm.authorName}</span>
                      <span className="text-slate-500">{cm.time}</span>
                    </div>
                    <p className="text-xs text-slate-200">{cm.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment input form */}
            <form onSubmit={handlePostComment} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Viết phản hồi tiến độ, tag @ten..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-bold text-xs transition"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
