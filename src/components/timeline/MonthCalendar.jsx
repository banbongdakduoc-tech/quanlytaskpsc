import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Sparkles } from 'lucide-react';
import { INITIAL_PLANS } from '../../data/initialData';

export default function MonthCalendar({ tasks, plans, onSelectDate, onSelectPlan }) {
  // Focus on September 2026
  const [currentMonth, setCurrentMonth] = useState({ month: 8, year: 2026 }); // 8 = September in 0-indexed

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const daysOfWeek = ['Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'CN'];

  // Days in Sept 2026: Sept 1, 2026 is Tuesday (day 2 in Mon-start, offset 1)
  const daysInMonth = 30;
  const startDayOffset = 1; // Tuesday

  const prevMonth = () => {
    if (currentMonth.month === 8) {
      setCurrentMonth({ month: 7, year: 2026 });
    } else {
      setCurrentMonth({ month: 8, year: 2026 });
    }
  };

  const nextMonth = () => {
    if (currentMonth.month === 8) {
      setCurrentMonth({ month: 9, year: 2026 }); // October
    } else {
      setCurrentMonth({ month: 8, year: 2026 });
    }
  };

  // Color mapping for plans
  const planColors = {
    p1: { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400' },
    p2: { bg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', dot: 'bg-cyan-400' },
    p3: { bg: 'bg-lime-500/20 text-lime-300 border-lime-500/40', dot: 'bg-lime-400' },
    p4: { bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40', dot: 'bg-purple-400' },
  };

  // Check which plans are active on day
  const getEventsForDay = (dayNum) => {
    const dateStr = `2026-09-${String(dayNum).padStart(2, '0')}`;
    const dayPlans = plans.filter(p => {
      return dateStr >= p.startDate && dateStr <= p.endDate;
    });

    const dayTasks = tasks.filter(t => t.date === dateStr);
    return { plans: dayPlans, tasks: dayTasks, dateStr };
  };

  return (
    <div className="card-sporty p-6">
      {/* Month Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Macro Calendar: {monthNames[currentMonth.month]}, {currentMonth.year}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tổng quan các dải sự kiện và chiến dịch của CLB trong tháng
          </p>
        </div>

        {/* Legend & Month Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-[#101517] p-1.5 rounded-xl border border-white/5 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Giải bóng đá
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Tuyển CTV
            </span>
            <span className="flex items-center gap-1 text-lime-400">
              <span className="w-2 h-2 rounded-full bg-lime-400"></span> Pickleball
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-[#141C1E] border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-white transition"
              title="Tháng trước"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentMonth({ month: 8, year: 2026 })}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition"
            >
              Tháng 9/2026
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-[#141C1E] border border-white/10 hover:border-emerald-500/30 text-slate-300 hover:text-white transition"
              title="Tháng sau"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="mt-5 grid grid-cols-7 gap-2 text-center">
        {daysOfWeek.map((day, i) => (
          <div key={i} className="py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells before month start */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[110px] rounded-2xl bg-[#0B0F11]/50 border border-white/[0.02]"></div>
        ))}

        {/* Days of September */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const { plans: dayPlans, tasks: dayTasks, dateStr } = getEventsForDay(dayNum);
          const isToday = dayNum === 23; // Today is Sept 23, 2026

          return (
            <div
              key={dayNum}
              onClick={() => onSelectDate(dateStr, dayTasks, dayPlans)}
              className={`min-h-[110px] p-2 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                isToday
                  ? 'bg-[#182629] border-2 border-emerald-400 shadow-lg shadow-emerald-500/20'
                  : 'bg-[#12181A] border-white/[0.06] hover:border-emerald-500/40 hover:bg-[#162124]'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center ${
                  isToday 
                    ? 'bg-emerald-400 text-black shadow-md' 
                    : 'text-slate-300 group-hover:text-emerald-400'
                }`}>
                  {dayNum}
                </span>

                {isToday && (
                  <span className="text-[9px] font-black uppercase text-emerald-400 tracking-wider">
                    Hôm nay
                  </span>
                )}

                {dayTasks.length > 0 && !isToday && (
                  <span className="text-[10px] font-semibold text-slate-400 px-1 rounded bg-white/5">
                    {dayTasks.length} task
                  </span>
                )}
              </div>

              {/* Event Ribbons in Day */}
              <div className="mt-1.5 space-y-1 overflow-hidden">
                {dayPlans.slice(0, 2).map((p) => {
                  const color = planColors[p.id] || { bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dot: 'bg-emerald-400' };
                  return (
                    <div
                      key={p.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlan(p);
                      }}
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-lg border truncate flex items-center gap-1 ${color.bg} hover:brightness-125 transition`}
                      title={p.title}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`}></span>
                      <span className="truncate">{p.title}</span>
                    </div>
                  );
                })}

                {dayPlans.length > 2 && (
                  <div className="text-[9px] text-slate-400 font-medium px-1">
                    +{dayPlans.length - 2} sự kiện khác
                  </div>
                )}
              </div>

              {/* Bottom hint */}
              <div className="text-[10px] text-slate-500 group-hover:text-slate-300 transition text-right mt-1">
                Xem ngày &rarr;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
