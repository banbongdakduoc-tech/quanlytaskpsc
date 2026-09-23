import React, { useState } from 'react';
import { Calendar, Layers, Clock, Filter } from 'lucide-react';
import MonthCalendar from './MonthCalendar';
import GanttTimeline from './GanttTimeline';
import DayTaskList from './DayTaskList';
import DayDetailModal from './DayDetailModal';

export default function TimelineView({
  tasks,
  plans,
  onToggleTask,
  onOpenTaskDetail,
  onOpenAddTask,
  onSelectPlan,
  selectedDepartment
}) {
  const [timelineMode, setTimelineMode] = useState('month'); // 'month' | 'gantt' | 'day'
  const [selectedDayInfo, setSelectedDayInfo] = useState(null); // { dateStr, tasks, plans }

  // Filter tasks & plans based on selected department if not 'all'
  const filteredTasks = selectedDepartment === 'all'
    ? tasks
    : tasks.filter(t => t.departmentId === selectedDepartment);

  const filteredPlans = selectedDepartment === 'all'
    ? plans
    : plans.filter(p => p.departmentId === selectedDepartment);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 3-Tier Switcher Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            CLB Thể Thao Dược
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">
            Lịch Hoạt Động & Tiến Độ
          </h2>
        </div>

        {/* 3 Buttons Switcher */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#0A0E10] border border-white/5">
          <button
            onClick={() => setTimelineMode('month')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timelineMode === 'month'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Lịch Tháng</span>
          </button>

          <button
            onClick={() => setTimelineMode('gantt')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timelineMode === 'gantt'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Tiến Độ Tuần</span>
          </button>

          <button
            onClick={() => setTimelineMode('day')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timelineMode === 'day'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-md shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Lịch Ngày</span>
          </button>
        </div>
      </div>

      {/* Render Active View */}
      {timelineMode === 'month' && (
        <MonthCalendar
          tasks={filteredTasks}
          plans={filteredPlans}
          onSelectDate={(dateStr, dayTasks, dayPlans) => {
            setSelectedDayInfo({ dateStr, tasks: dayTasks, plans: dayPlans });
          }}
          onSelectPlan={onSelectPlan}
        />
      )}

      {timelineMode === 'gantt' && (
        <GanttTimeline
          plans={filteredPlans}
          onSelectPlan={onSelectPlan}
        />
      )}

      {timelineMode === 'day' && (
        <DayTaskList
          tasks={filteredTasks}
          onToggleTask={onToggleTask}
          onOpenTaskDetail={onOpenTaskDetail}
          onOpenAddTask={onOpenAddTask}
        />
      )}

      {/* Day Detail Modal for Month View */}
      {selectedDayInfo && (
        <DayDetailModal
          isOpen={!!selectedDayInfo}
          dateStr={selectedDayInfo.dateStr}
          tasks={selectedDayInfo.tasks}
          plans={selectedDayInfo.plans}
          onClose={() => setSelectedDayInfo(null)}
          onToggleTask={onToggleTask}
          onOpenTaskDetail={onOpenTaskDetail}
          onOpenAddTask={onOpenAddTask}
          onSelectPlan={onSelectPlan}
        />
      )}
    </div>
  );
}
