import React from 'react';
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  MoreVertical,
  ChevronRight,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { INITIAL_MEMBERS, DEPARTMENTS } from '../../data/initialData';

export default function KanbanBoard({ 
  tasks, 
  planId, 
  onMoveTask, 
  onToggleTask, 
  onOpenTaskDetail, 
  onOpenAddTask 
}) {
  const planTasks = tasks.filter(t => t.planId === planId);

  const columns = [
    { id: 'todo', title: 'Cần làm', color: 'slate', badge: 'bg-slate-800 text-slate-300' },
    { id: 'in_progress', title: 'Đang làm', color: 'cyan', badge: 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' },
    { id: 'review', title: 'Chờ duyệt BCN', color: 'amber', badge: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'done', title: 'Hoàn thành', color: 'emerald', badge: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' },
  ];

  const getAssignee = (id) => INITIAL_MEMBERS.find(m => m.id === id);
  const getDept = (id) => DEPARTMENTS.find(d => d.id === id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {columns.map((col, colIdx) => {
        const colTasks = planTasks.filter(t => t.column === col.id);

        return (
          <div 
            key={col.id}
            className="rounded-3xl bg-[#101618] border border-white/[0.06] p-4 flex flex-col min-h-[480px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${col.badge}`}>
                  {col.title}
                </span>
                <span className="text-xs font-black text-slate-400">
                  {colTasks.length}
                </span>
              </div>

              <button
                onClick={() => onOpenAddTask({ planId, column: col.id })}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition"
                title={`Thêm task vào cột ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Task Cards in Column */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1">
              {colTasks.length === 0 ? (
                <div className="h-32 border-2 border-dashed border-white/5 rounded-2xl flex items-center justify-center text-xs text-slate-500">
                  Chưa có công việc
                </div>
              ) : (
                colTasks.map((task) => {
                  const assignee = getAssignee(task.assigneeId);
                  const dept = getDept(task.departmentId);

                  return (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-2xl bg-[#141C1E] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#182326] transition duration-200 group flex flex-col justify-between"
                    >
                      {/* Priority & Department Pills */}
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                            task.priority === 'urgent'
                              ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                              : task.priority === 'high'
                              ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                              : 'bg-slate-800 text-slate-400 border-white/5'
                          }`}>
                            {task.priority === 'urgent' ? 'Khẩn' : task.priority === 'high' ? 'Cao' : 'Thường'}
                          </span>

                          {dept && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              {dept.shortName}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <p 
                          onClick={() => onOpenTaskDetail(task)}
                          className="text-xs font-bold text-white group-hover:text-emerald-400 transition cursor-pointer leading-snug"
                        >
                          {task.title}
                        </p>

                        <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{task.shift || task.date}</span>
                        </div>
                      </div>

                      {/* Bottom: Assignee & Move column controls */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between">
                        {/* Assignee Avatar */}
                        {assignee && (
                          <div 
                            className="flex items-center gap-1.5"
                            title={`${assignee.name} (${assignee.role})`}
                          >
                            <img
                              src={assignee.avatar}
                              alt={assignee.name}
                              className="w-6 h-6 rounded-lg object-cover ring-1 ring-white/10"
                            />
                            <span className="text-[11px] text-slate-400 font-medium truncate max-w-[80px]">
                              {assignee.name.split(' ').slice(-1)[0]}
                            </span>
                          </div>
                        )}

                        {/* Fast Move Buttons between columns */}
                        <div className="flex items-center gap-1">
                          {colIdx > 0 && (
                            <button
                              onClick={() => onMoveTask(task.id, columns[colIdx - 1].id)}
                              className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition"
                              title={`Chuyển về ${columns[colIdx - 1].title}`}
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {colIdx < columns.length - 1 && (
                            <button
                              onClick={() => onMoveTask(task.id, columns[colIdx + 1].id)}
                              className="p-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition"
                              title={`Chuyển sang ${columns[colIdx + 1].title}`}
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick Add at bottom */}
            <button
              onClick={() => onOpenAddTask({ planId, column: col.id })}
              className="mt-3 w-full py-2 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 border border-white/5 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm việc</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
