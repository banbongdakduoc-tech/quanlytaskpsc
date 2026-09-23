import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  Wallet, 
  ArrowUpRight, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { formatCompactVND } from '../../utils/helpers';

export default function BigMetricCards({ 
  plans, 
  tasks, 
  onNavigateToUrgent,
  onNavigateToBudget 
}) {
  // Compute overall stats
  const activePlansCount = plans.filter(p => p.status === 'active' || p.status === 'planning').length;
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.column === 'done').length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const urgentTasksCount = tasks.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.column !== 'done').length;

  const totalEstimatedBudget = plans.reduce((acc, p) => acc + (p.estimatedBudget || 0), 0);
  const totalActualBudget = plans.reduce((acc, p) => acc + (p.actualBudget || 0), 0);
  const budgetRatio = totalEstimatedBudget > 0 ? Math.round((totalActualBudget / totalEstimatedBudget) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Hoạt động đang chạy */}
      <div className="card-sporty p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-emerald-500/20 transition duration-500"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Hoạt Động Mùa Giải
          </span>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-black text-white tracking-tight">0{activePlansCount}</span>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            Trọng điểm
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Giải bóng đá, Pickleball & Tuyển CTV</span>
        </div>
      </div>

      {/* Metric 2: Tỷ lệ hoàn thành công việc */}
      <div className="card-sporty p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-cyan-500/20 transition duration-500"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tiến Độ Công Việc Tổng
          </span>
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-black text-white tracking-tight">{progressPercent}%</span>
          <span className="text-xs text-slate-400 font-medium">
            ({completedTasks}/{totalTasks} task xong)
          </span>
        </div>
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-[#0B1012] h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div 
            className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-teal-400 h-full rounded-full transition-all duration-700 glow-accent"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Metric 3: Việc gấp cần xử lý / Quá hạn */}
      <div 
        onClick={onNavigateToUrgent}
        className="card-sporty p-5 relative overflow-hidden group cursor-pointer border-rose-500/20 hover:border-rose-500/40"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-rose-500/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-rose-500/20 transition duration-500"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-300/80 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            Cần Xử Lý Gấp
          </span>
          <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-black text-rose-400 tracking-tight">{urgentTasksCount}</span>
          <span className="text-xs text-rose-400 font-semibold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
            Hạn chót hôm nay
          </span>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-slate-400 group-hover:text-rose-300 transition">
          <span>Xem danh sách ưu tiên cao</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Metric 4: Ngân sách đã chi / Dự trù */}
      <div 
        onClick={onNavigateToBudget}
        className="card-sporty p-5 relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-lime-500/10 rounded-full blur-2xl -mr-6 -mt-6 group-hover:bg-lime-500/20 transition duration-500"></div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Giải Ngân / Dự Trù
          </span>
          <div className="w-10 h-10 rounded-2xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:scale-110 transition">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-black text-white tracking-tight">
            {formatCompactVND(totalActualBudget)}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            / {formatCompactVND(totalEstimatedBudget)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-400">Tỷ lệ sử dụng:</span>
          <span className="font-bold text-lime-400 bg-lime-500/10 px-2 py-0.5 rounded-full border border-lime-500/20">
            {budgetRatio}% đã giải ngân
          </span>
        </div>
      </div>
    </div>
  );
}
