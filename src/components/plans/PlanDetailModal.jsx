import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Calendar, 
  MapPin, 
  User, 
  ExternalLink, 
  FileText, 
  Kanban, 
  Wallet, 
  Plus, 
  CheckCircle2, 
  Clock,
  Sparkles
} from 'lucide-react';
import KanbanBoard from './KanbanBoard';
import BudgetBreakdown from './BudgetBreakdown';
import { INITIAL_MEMBERS } from '../../data/initialData';

export default function PlanDetailModal({ 
  plan, 
  isOpen, 
  onClose, 
  tasks, 
  onMoveTask, 
  onToggleTask, 
  onOpenTaskDetail, 
  onOpenAddTask,
  onUpdateBudget 
}) {
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'budget'

  if (!isOpen || !plan) return null;

  const lead = INITIAL_MEMBERS.find(m => m.id === plan.leadId);
  const planTasks = tasks.filter(t => t.planId === plan.id);
  const doneTasks = planTasks.filter(t => t.column === 'done').length;
  const progressPercent = planTasks.length > 0 ? Math.round((doneTasks / planTasks.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="w-full max-w-6xl bg-[#0E1416] border border-white/10 rounded-3xl p-5 sm:p-8 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Core Info */}
        <div className="pb-6 border-b border-white/[0.08] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-black shadow-lg shadow-emerald-500/20 shrink-0 mt-1">
                <Trophy className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-emerald-500 text-black">
                    {plan.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-300 bg-white/5 border border-white/10">
                    {plan.badge || 'Kế hoạch hoạt động'}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                  {plan.title}
                </h2>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition shrink-0"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Goal & Meta Info Row */}
          <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
            {plan.objective}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Lead */}
            <div className="p-3 rounded-2xl bg-[#141C1E] border border-white/5 flex items-center gap-2.5">
              {lead && (
                <img
                  src={lead.avatar}
                  alt={lead.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-500/30"
                />
              )}
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">Trưởng ban tổ chức (Lead):</p>
                <p className="font-bold text-white truncate">{lead?.name || 'Ban Chủ Nhiệm'}</p>
              </div>
            </div>

            {/* Time */}
            <div className="p-3 rounded-2xl bg-[#141C1E] border border-white/5 flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">Thời gian triển khai:</p>
                <p className="font-bold text-white truncate">{plan.timeRange}</p>
              </div>
            </div>

            {/* Location */}
            <div className="p-3 rounded-2xl bg-[#141C1E] border border-white/5 flex items-center gap-2.5">
              <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10px] text-slate-400">Địa điểm tổ chức:</p>
                <p className="font-bold text-white truncate">{plan.location}</p>
              </div>
            </div>

            {/* Attachment Link */}
            <a
              href={plan.driveLink}
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded-2xl bg-[#141C1E] hover:bg-emerald-500/10 border border-white/5 hover:border-emerald-500/30 flex items-center justify-between text-slate-300 hover:text-emerald-400 transition group"
            >
              <div className="flex items-center gap-2 truncate">
                <FileText className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold truncate">Hồ sơ kế hoạch (PDF/Drive)</span>
              </div>
              <ExternalLink className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition" />
            </a>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1 bg-[#0A0E10] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700 glow-accent"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="shrink-0 flex items-center gap-2 text-xs">
              <span className="text-slate-400">Tiến độ tổng:</span>
              <span className="font-black text-emerald-400">{progressPercent}%</span>
              <span className="text-slate-500 font-medium">({doneTasks}/{planTasks.length} task)</span>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="py-4 flex items-center justify-between gap-4 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-2 bg-[#12181A] p-1 rounded-2xl border border-white/5">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'kanban'
                  ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Work Breakdown (Kanban 4 Cột)</span>
            </button>

            <button
              onClick={() => setActiveTab('budget')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'budget'
                  ? 'bg-emerald-500 text-black shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Phân Bổ Ngân Sách ({plan.budgetItems?.length || 0} khoản)</span>
            </button>
          </div>

          <button
            onClick={() => onOpenAddTask({ planId: plan.id })}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Task Vào Kế Hoạch</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          {activeTab === 'kanban' && (
            <KanbanBoard
              planId={plan.id}
              tasks={tasks}
              onMoveTask={onMoveTask}
              onToggleTask={onToggleTask}
              onOpenTaskDetail={onOpenTaskDetail}
              onOpenAddTask={onOpenAddTask}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetBreakdown
              plan={plan}
              onUpdateBudget={onUpdateBudget}
            />
          )}
        </div>
      </div>
    </div>
  );
}
