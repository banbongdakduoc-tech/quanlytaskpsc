import React from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  Briefcase, 
  MessageCircle,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/initialData';

export default function MemberDetailModal({ 
  member, 
  isOpen, 
  onClose, 
  tasks, 
  onToggleTask, 
  onOpenTaskDetail 
}) {
  if (!isOpen || !member) return null;

  const dept = DEPARTMENTS.find(d => d.id === member.departmentId);
  const memberTasks = tasks.filter(t => t.assigneeId === member.id);
  const doneCount = memberTasks.filter(t => t.column === 'done').length;
  const progressPercent = memberTasks.length > 0 ? Math.round((doneCount / memberTasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="w-full max-w-2xl bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl animate-scaleUp overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/40"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0E1416] ${
                member.status === 'online' ? 'bg-emerald-400' : 'bg-slate-500'
              }`}></span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-xl">{member.name}</h3>
                <span className="text-xs text-slate-400 font-mono">({member.studentId})</span>
              </div>
              <p className="text-xs font-bold text-emerald-400 mt-0.5">{member.role}</p>
              {dept && (
                <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/5">
                  Ban {dept.name}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bio & Contact */}
        <div className="mt-4 p-4 rounded-2xl bg-[#141C1E] border border-white/5 space-y-3">
          <p className="text-xs text-slate-300 leading-relaxed italic">
            "{member.bio || 'Thành viên nòng cốt đóng góp tích cực cho các hoạt động thể thao của trường Dược.'}"
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
            <a
              href={`tel:${member.phone}`}
              className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition"
            >
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{member.phone} (Gọi / Zalo)</span>
            </a>

            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition truncate"
            >
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate">{member.email}</span>
            </a>
          </div>
        </div>

        {/* Performance & Task Assignment */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Công Việc Được Phân Công ({memberTasks.length})
              </h4>
              <p className="text-[11px] text-slate-400">
                Đã hoàn thành {doneCount}/{memberTasks.length} nhiệm vụ ({progressPercent}%)
              </p>
            </div>

            <div className="w-24 bg-[#0B0F11] h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {memberTasks.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#12181A] text-center text-xs text-slate-500">
                Hiện chưa có công việc nào được gán cho thành viên này.
              </div>
            ) : (
              memberTasks.map((task) => {
                const isDone = task.column === 'done';

                return (
                  <div
                    key={task.id}
                    className="p-3 rounded-2xl bg-[#141C1E] border border-white/5 hover:border-emerald-500/30 transition flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
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
                        className="min-w-0 cursor-pointer flex-1"
                        onClick={() => {
                          onClose();
                          onOpenTaskDetail(task);
                        }}
                      >
                        <p className={`text-xs font-semibold ${isDone ? 'line-through text-slate-500' : 'text-white'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {task.shift || task.date}
                          </span>
                          <span>•</span>
                          <span className="uppercase text-amber-400">{task.priority}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 shrink-0">
                      {task.column === 'done' ? 'Đã xong' : task.column === 'in_progress' ? 'Đang làm' : 'Chờ làm'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
