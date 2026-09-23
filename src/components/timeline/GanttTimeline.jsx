import React, { useState } from 'react';
import { 
  GitCommit, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  User, 
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function GanttTimeline({ plans, onSelectPlan }) {
  const [selectedPlanId, setSelectedPlanId] = useState('all');

  const displayedPlans = selectedPlanId === 'all' 
    ? plans 
    : plans.filter(p => p.id === selectedPlanId);

  return (
    <div className="card-sporty p-6">
      {/* Header & Filter by Plan */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-bold text-white tracking-tight">
              Meso Gantt Timeline: Tiến Độ Giai Đoạn Dự Án
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Chuỗi 4 giai đoạn chuẩn: [Chuẩn bị] &rarr; [Truyền thông] &rarr; [Khởi tranh] &rarr; [Bế mạc & Tổng kết]
          </p>
        </div>

        {/* Plan Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedPlanId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedPlanId === 'all'
                ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                : 'bg-[#12181A] text-slate-400 border-white/5 hover:text-white'
            }`}
          >
            Tất cả kế hoạch
          </button>
          {plans.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPlanId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedPlanId === p.id
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-[#12181A] text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              {p.code || p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Gantt Timeline Plans */}
      <div className="mt-6 space-y-6">
        {displayedPlans.map((plan) => {
          // Average stage progress
          const avgProgress = plan.stages?.length 
            ? Math.round(plan.stages.reduce((acc, s) => acc + s.progress, 0) / plan.stages.length) 
            : 0;

          return (
            <div 
              key={plan.id}
              className="rounded-3xl bg-[#101618] border border-white/[0.08] p-5 hover:border-emerald-500/30 transition duration-300"
            >
              {/* Plan Title & Quick Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                      {plan.code}
                    </span>
                    <h4 className="text-base font-bold text-white hover:text-emerald-400 cursor-pointer transition" onClick={() => onSelectPlan(plan)}>
                      {plan.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{plan.timeRange}</span>
                    <span>•</span>
                    <span>Địa điểm: {plan.location}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400">Tiến độ tổng:</span>
                    <span className="text-sm font-black text-emerald-400 ml-1.5">{avgProgress}%</span>
                  </div>
                  <button
                    onClick={() => onSelectPlan(plan)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/10 text-xs font-bold text-slate-300 hover:text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition"
                  >
                    <span>Mở Kanban & Ngân sách</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Meso Stages Progress Bars */}
              <div className="mt-5 space-y-3.5">
                {plan.stages?.map((stage, idx) => {
                  const isDone = stage.progress === 100;
                  const isRunning = stage.progress > 0 && stage.progress < 100;

                  return (
                    <div 
                      key={stage.id || idx}
                      className="p-3.5 rounded-2xl bg-[#141C1E] border border-white/[0.04] hover:bg-[#182326] transition flex flex-col md:flex-row md:items-center justify-between gap-3"
                    >
                      {/* Left: Stage Title & Info */}
                      <div className="w-full md:w-1/3 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            isDone ? 'bg-emerald-400' : isRunning ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
                          }`}></span>
                          <span className="text-xs font-bold text-white truncate">
                            {stage.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {stage.period}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-500" />
                            {stage.lead}
                          </span>
                        </div>
                      </div>

                      {/* Middle: Horizontal Gantt Bar */}
                      <div className="w-full md:w-1/2 flex items-center gap-3">
                        <div className="flex-1 bg-[#0A0E10] h-3.5 rounded-full overflow-hidden p-0.5 border border-white/5 relative">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              isDone
                                ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                                : isRunning
                                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 glow-accent'
                                : 'bg-slate-700'
                            }`}
                            style={{ width: `${stage.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-black text-slate-200 w-10 text-right">
                          {stage.progress}%
                        </span>
                      </div>

                      {/* Right: Stage Badge */}
                      <div className="shrink-0 text-right md:w-28">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Đã xong
                          </span>
                        ) : isRunning ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                            Đang chạy
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                            Sắp tới
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
