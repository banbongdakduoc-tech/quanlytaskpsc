import React from 'react';
import { 
  Trophy, 
  CheckSquare, 
  Wallet, 
  Megaphone, 
  Users, 
  ArrowRight, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  TrendingUp, 
  Plus,
  Layers
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { formatVND } from '../../utils/helpers';

export default function BcnOverviewDashboard({
  programs = [],
  tasks,
  budgets,
  mediaPlans,
  onNavigateTab,
  onOpenAssignProgramModal,
  onOpenAssignModal
}) {
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.column === 'done').length;
  const progressPercent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const pendingAcceptanceCount = tasks.filter(t => t.status === 'pending_acceptance').length;

  const totalBudgetApproved = budgets.filter(b => b.status === 'approved').reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const pendingBudgetsCount = budgets.filter(b => b.status === 'pending_approval').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#102022] to-[#122A26] border border-emerald-500/30">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            CẤP 1 • ĐIỀU HÀNH TỐI CAO
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1.5">
            Bàn Điều Hành Ban Chủ Nhiệm • PharmacySportCLB
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Giao chương trình & nhiệm vụ cho 7 phân ban, giám sát tiến độ và thẩm định ngân sách toàn câu lạc bộ
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onOpenAssignProgramModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-black text-xs transition shadow-lg shadow-emerald-500/25 active:scale-95"
          >
            <Layers className="w-4 h-4 stroke-[2.5]" />
            <span>Giao Chương Trình Mới</span>
          </button>

          <button
            onClick={onOpenAssignModal}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs transition border border-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Giao Task</span>
          </button>
        </div>
      </div>

      {/* 4 Big Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Programs */}
        <div 
          onClick={() => onNavigateTab('programs')}
          className="card-sporty p-5 cursor-pointer group hover:border-emerald-500/40 transition"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase">Chương Trình CLB</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{programs.length}</span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Sự Kiện
            </span>
          </div>
          <p className="mt-3 text-xs text-slate-400 group-hover:text-emerald-400 transition flex items-center justify-between">
            <span>{programs.filter(p => p.status === 'in_progress').length} đang diễn ra</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigateTab('all-tasks')}
          className="card-sporty p-5 cursor-pointer group"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase">Tiến Độ Task Toàn CLB</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{progressPercent}%</span>
            <span className="text-xs text-slate-400">({doneTasks}/{totalTasks} việc)</span>
          </div>
          <div className="mt-3 w-full bg-[#0B1012] h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigateTab('budgets')}
          className="card-sporty p-5 cursor-pointer group"
        >
          <span className="text-xs font-semibold text-slate-400 uppercase">Kinh Phí Đã Duyệt</span>
          <div className="mt-2">
            <span className="text-2xl font-black text-emerald-400">{formatVND(totalBudgetApproved)}</span>
          </div>
          <p className="mt-3 text-xs text-slate-400 flex items-center justify-between">
            <span>{pendingBudgetsCount} tờ trình chờ duyệt</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigateTab('media-monitor')}
          className="card-sporty p-5 cursor-pointer group"
        >
          <span className="text-xs font-semibold text-teal-400 uppercase">Chiến Dịch Truyền Thông</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-teal-300">{mediaPlans.length}</span>
            <span className="text-xs text-slate-400">kế hoạch bài đăng</span>
          </div>
          <p className="mt-3 text-xs text-slate-400 group-hover:text-teal-300 transition flex items-center justify-between">
            <span>Fanpage & TikTok CLB</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </p>
        </div>
      </div>

      {/* Two columns: Pending alerts & 8 departments status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Pending Actions for BCN */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card-sporty p-5">
            <h3 className="font-extrabold text-white text-base mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Nhiệm Vụ Đang Chờ Ban Tiếp Nhận ({pendingAcceptanceCount})</span>
            </h3>

            {pendingAcceptanceCount === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 rounded-2xl bg-[#0E1416] text-center">
                Tất cả các task đã được các ban thành phần bấm "Xác nhận nhận task".
              </p>
            ) : (
              <div className="space-y-2.5">
                {tasks.filter(t => t.status === 'pending_acceptance').map((t) => (
                  <div key={t.id} className="p-3.5 rounded-2xl bg-[#101517] border border-amber-500/20 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 mr-1.5">
                        {t.assignedDeptName}
                      </span>
                      <p className="text-xs font-bold text-white truncate mt-1">{t.title}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">Chờ xác nhận</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Dept Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="card-sporty p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-extrabold text-white text-base">
                Tình Hình Hoạt Động 7 Ban Thành Phần
              </h3>
              <button
                onClick={() => onNavigateTab('departments')}
                className="text-xs text-emerald-400 font-bold hover:underline"
              >
                Xem chi tiết &rarr;
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEPARTMENTS.filter(d => d.id !== 'bcn').map((d) => {
                const count = tasks.filter(t => t.assignedDeptId === d.id).length;
                const done = tasks.filter(t => t.assignedDeptId === d.id && t.column === 'done').length;

                return (
                  <div key={d.id} className="p-3 rounded-2xl bg-[#12181A] border border-white/5 flex items-center gap-3">
                    <img src={d.avatar} alt={d.name} className="w-8 h-8 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">{d.name}</p>
                      <p className="text-[10px] text-slate-400">{done}/{count} task xong</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
