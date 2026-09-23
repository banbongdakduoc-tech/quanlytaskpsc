import React, { useState } from 'react';
import { 
  Sun, 
  Sunset, 
  Moon, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Calendar, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { INITIAL_MEMBERS, DEPARTMENTS } from '../../data/initialData';

export default function DayTaskList({ 
  tasks, 
  onToggleTask, 
  onOpenTaskDetail, 
  onOpenAddTask,
  initialDate = '2026-09-23'
}) {
  const [selectedDate, setSelectedDate] = useState(initialDate);

  // Available dates for quick switching
  const dates = [
    { value: '2026-09-21', label: '21/09', sub: 'Th 2' },
    { value: '2026-09-22', label: '22/09', sub: 'Th 3' },
    { value: '2026-09-23', label: '23/09', sub: 'Hôm nay', isToday: true },
    { value: '2026-09-24', label: '24/09', sub: 'Th 5' },
    { value: '2026-09-25', label: '25/09', sub: 'Khai mạc', isSpecial: true },
    { value: '2026-09-26', label: '26/09', sub: 'Th 7' },
    { value: '2026-09-27', label: '27/09', sub: 'CN' },
  ];

  // Tasks of selected day
  const dayTasks = tasks.filter(t => t.date === selectedDate);

  // Categorize by shift: Sáng, Chiều, Tối
  const morningTasks = dayTasks.filter(t => t.shift?.toLowerCase().includes('sáng') || t.shift?.includes('08:') || t.shift?.includes('09:') || t.shift?.includes('07:'));
  const afternoonTasks = dayTasks.filter(t => t.shift?.toLowerCase().includes('chiều') || t.shift?.includes('14:') || t.shift?.includes('15:') || t.shift?.includes('16:'));
  const eveningTasks = dayTasks.filter(t => t.shift?.toLowerCase().includes('tối') || t.shift?.includes('18:') || t.shift?.includes('19:') || t.shift?.includes('20:') || t.shift?.includes('21:'));
  
  // Any leftover tasks not specifically assigned to morning/afternoon/evening
  const otherTasks = dayTasks.filter(t => 
    !morningTasks.includes(t) && !afternoonTasks.includes(t) && !eveningTasks.includes(t)
  );

  const getAssignee = (id) => INITIAL_MEMBERS.find(m => m.id === id);
  const getDept = (id) => DEPARTMENTS.find(d => d.id === id);

  const renderTaskCard = (task) => {
    const isDone = task.column === 'done';
    const assignee = getAssignee(task.assigneeId);
    const dept = getDept(task.departmentId);

    return (
      <div
        key={task.id}
        className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 group ${
          isDone
            ? 'bg-[#101517] border-white/5 opacity-60'
            : 'bg-[#141C1E] border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#182326]'
        }`}
      >
        {/* Left: Checkbox & Info */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
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

          <div className="min-w-0 cursor-pointer flex-1" onClick={() => onOpenTaskDetail(task)}>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {/* Department Tag */}
              {dept && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5">
                  {dept.shortName || dept.name}
                </span>
              )}

              {/* Priority Tag */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                task.priority === 'urgent'
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : task.priority === 'high'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {task.priority === 'urgent' ? 'Khẩn cấp' : task.priority === 'high' ? 'Ưu tiên cao' : 'Bình thường'}
              </span>

              {/* Column status pill */}
              <span className="text-[10px] font-medium text-slate-500">
                [{task.column === 'done' ? 'Đã hoàn thành' : task.column === 'in_progress' ? 'Đang thực hiện' : task.column === 'review' ? 'Chờ duyệt BCN' : 'Cần làm'}]
              </span>
            </div>

            <p className={`text-sm font-semibold transition ${
              isDone ? 'line-through text-slate-500' : 'text-white group-hover:text-emerald-400'
            }`}>
              {task.title}
            </p>

            {task.description && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3 text-emerald-400/80" />
                {task.shift}
              </span>
              {task.commentsCount > 0 && (
                <>
                  <span>•</span>
                  <span className="text-slate-400">{task.commentsCount} phản hồi</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Assignee Profile */}
        {assignee && (
          <div 
            onClick={() => onOpenTaskDetail(task)}
            className="flex items-center gap-2.5 shrink-0 pl-3 border-l border-white/5 cursor-pointer"
            title={`Phụ trách: ${assignee.name} (${assignee.role})`}
          >
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 transition"
            />
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                {assignee.name}
              </p>
              <p className="text-[10px] text-slate-400">{assignee.role}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="card-sporty p-6">
      {/* Header & Date Switcher Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Clock className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Micro Daily Tasks: Danh Sách Công Việc Theo Ca
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Phân bổ công việc chi tiết theo ca Sáng, Chiều, Tối trong ngày
          </p>
        </div>

        <button
          onClick={() => onOpenAddTask({ date: selectedDate })}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition shadow-lg shadow-emerald-500/20 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Thêm việc cho ngày này</span>
        </button>
      </div>

      {/* Date Switcher Pill Bar */}
      <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {dates.map((d) => {
          const isSelected = selectedDate === d.value;
          return (
            <button
              key={d.value}
              onClick={() => setSelectedDate(d.value)}
              className={`px-4 py-2.5 rounded-2xl text-center shrink-0 transition-all border ${
                isSelected
                  ? 'bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/25 scale-105'
                  : d.isToday
                  ? 'bg-[#182629] text-emerald-400 border-emerald-400/50 font-bold'
                  : 'bg-[#12181A] text-slate-400 border-white/[0.06] hover:text-white hover:border-white/20'
              }`}
            >
              <div className="text-xs">{d.label}</div>
              <div className={`text-[10px] uppercase font-bold mt-0.5 ${isSelected ? 'text-black/80' : 'text-slate-400'}`}>
                {d.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* Shift Sections */}
      <div className="mt-6 space-y-6">
        {/* Morning Shift */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider px-1">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Ca Sáng (07:30 - 11:30)</span>
            <span className="text-[11px] font-normal text-slate-500">
              ({morningTasks.length} công việc)
            </span>
          </div>
          {morningTasks.length > 0 ? (
            <div className="space-y-2.5">{morningTasks.map(renderTaskCard)}</div>
          ) : (
            <div className="p-4 rounded-xl bg-[#101517] border border-white/5 text-xs text-slate-500 italic">
              Không có công việc nào ấn định ca sáng cho ngày này.
            </div>
          )}
        </div>

        {/* Afternoon Shift */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider px-1">
            <Sunset className="w-4 h-4 text-cyan-400" />
            <span>Ca Chiều (13:30 - 17:30)</span>
            <span className="text-[11px] font-normal text-slate-500">
              ({afternoonTasks.length} công việc)
            </span>
          </div>
          {afternoonTasks.length > 0 ? (
            <div className="space-y-2.5">{afternoonTasks.map(renderTaskCard)}</div>
          ) : (
            <div className="p-4 rounded-xl bg-[#101517] border border-white/5 text-xs text-slate-500 italic">
              Không có công việc nào ấn định ca chiều cho ngày này.
            </div>
          )}
        </div>

        {/* Evening Shift */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider px-1">
            <Moon className="w-4 h-4 text-purple-400" />
            <span>Ca Tối (18:00 - 22:00)</span>
            <span className="text-[11px] font-normal text-slate-500">
              ({eveningTasks.length} công việc)
            </span>
          </div>
          {eveningTasks.length > 0 ? (
            <div className="space-y-2.5">{eveningTasks.map(renderTaskCard)}</div>
          ) : (
            <div className="p-4 rounded-xl bg-[#101517] border border-white/5 text-xs text-slate-500 italic">
              Không có công việc nào ấn định ca tối cho ngày này.
            </div>
          )}
        </div>

        {/* Other / Flexible Tasks */}
        {otherTasks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-wider px-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Thời Gian Linh Hoạt / Trong Ngày</span>
              <span className="text-[11px] font-normal text-slate-500">
                ({otherTasks.length} công việc)
              </span>
            </div>
            <div className="space-y-2.5">{otherTasks.map(renderTaskCard)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
