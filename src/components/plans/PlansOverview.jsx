import React from 'react';
import { 
  Trophy, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Plus, 
  Wallet, 
  Kanban, 
  Clock, 
  User,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { formatCompactVND } from '../../utils/helpers';
import { INITIAL_MEMBERS, DEPARTMENTS } from '../../data/initialData';

export default function PlansOverview({ 
  plans, 
  tasks, 
  onSelectPlan, 
  onOpenAddPlan,
  selectedDepartment 
}) {
  const filteredPlans = selectedDepartment === 'all'
    ? plans
    : plans.filter(p => p.departmentId === selectedDepartment);

  const getLead = (id) => INITIAL_MEMBERS.find(m => m.id === id);
  const getDept = (id) => DEPARTMENTS.find(d => d.id === id);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Phân hệ Quản Trị Dự Án & Kế Hoạch
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Detailed Plans & Work Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi mục tiêu, phân bổ ngân sách và bảng Kanban 4 cột cho từng hoạt động
          </p>
        </div>

        <button
          onClick={onOpenAddPlan}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Lập kế hoạch mới</span>
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPlans.map((plan) => {
          const lead = getLead(plan.leadId);
          const dept = getDept(plan.departmentId);

          const planTasks = tasks.filter(t => t.planId === plan.id);
          const doneTasks = planTasks.filter(t => t.column === 'done').length;
          const progressPercent = planTasks.length > 0 ? Math.round((doneTasks / planTasks.length) * 100) : 0;

          return (
            <div
              key={plan.id}
              className="card-sporty p-6 flex flex-col justify-between hover:border-emerald-500/40 group relative overflow-hidden"
            >
              {/* Top Accent Border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-transparent"></div>

              <div>
                {/* Header Pills */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {plan.code}
                    </span>
                    {dept && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                        {dept.shortName}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-slate-400 bg-[#101517] px-2.5 py-1 rounded-full border border-white/5">
                    {plan.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 
                  onClick={() => onSelectPlan(plan)}
                  className="text-lg font-bold text-white group-hover:text-emerald-400 transition cursor-pointer"
                >
                  {plan.title}
                </h3>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {plan.objective}
                </p>

                {/* Meta details */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#101517] border border-white/5 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate text-slate-300">{plan.timeRange}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#101517] border border-white/5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="truncate text-slate-300">{plan.location}</span>
                  </div>
                </div>

                {/* Budget & Progress */}
                <div className="mt-4 p-3 rounded-2xl bg-[#0E1315] border border-white/5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-lime-400" />
                      Ngân sách đã chi:
                    </span>
                    <span className="font-bold text-white">
                      {formatCompactVND(plan.actualBudget)} / {formatCompactVND(plan.estimatedBudget)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Tiến độ công việc:</span>
                    <span className="font-black text-emerald-400">{progressPercent}% ({doneTasks}/{planTasks.length} task)</span>
                  </div>

                  <div className="w-full bg-[#182022] h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Bottom Lead & CTA */}
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                {lead && (
                  <div className="flex items-center gap-2">
                    <img
                      src={lead.avatar}
                      alt={lead.name}
                      className="w-7 h-7 rounded-xl object-cover ring-1 ring-white/10"
                    />
                    <div className="text-left">
                      <p className="text-[11px] font-bold text-white leading-tight">{lead.name}</p>
                      <p className="text-[9px] text-slate-400">{lead.role}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onSelectPlan(plan)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-emerald-500 text-slate-200 hover:text-black font-bold text-xs transition group/btn"
                >
                  <Kanban className="w-3.5 h-3.5" />
                  <span>Chi tiết & Kanban</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
