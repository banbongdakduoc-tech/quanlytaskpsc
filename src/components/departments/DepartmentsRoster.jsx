import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  ArrowRightLeft, 
  CheckSquare, 
  Wallet, 
  Megaphone,
  CheckCircle2
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';

export default function DepartmentsRoster({ 
  tasks, 
  budgets, 
  mediaPlans, 
  currentDept, 
  onSelectDept 
}) {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Phân Cấp & Danh Mục Tài Khoản
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight mt-1">
          Hệ Thống 8 Phân Ban CLB Thể Thao
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Phân cấp 2 tầng: Cấp 1 (Ban Chủ Nhiệm) & Cấp 2 (7 Ban Thành Phần). Bấm "Chuyển Sang Ban Này" để trải nghiệm quyền tương ứng.
        </p>
      </div>

      {/* Grid of 8 Departments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DEPARTMENTS.map((dept) => {
          const isCurrent = dept.id === currentDept.id;
          const isBCN = dept.id === 'bcn';

          const deptTasks = tasks.filter(t => t.assignedDeptId === dept.id);
          const pendingAcceptance = deptTasks.filter(t => t.status === 'pending_acceptance').length;
          const doneTasks = deptTasks.filter(t => t.column === 'done').length;

          const deptBudgets = budgets.filter(b => b.deptId === dept.id);
          const deptMedia = mediaPlans.filter(m => m.deptId === dept.id);

          return (
            <div
              key={dept.id}
              className={`rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between group ${
                isCurrent
                  ? 'bg-[#182629] border-2 border-emerald-400 shadow-xl shadow-emerald-500/15'
                  : 'bg-[#141C1E] border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#182326]'
              }`}
            >
              <div>
                {/* Header & Avatar */}
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <img
                      src={dept.avatar}
                      alt={dept.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 transition"
                    />
                    {isCurrent && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#141C1E] flex items-center justify-center text-[9px] text-black font-black">
                        ✓
                      </span>
                    )}
                  </div>

                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    isBCN
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-white/5 text-slate-300 border-white/10'
                  }`}>
                    {dept.badge}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-base font-extrabold text-white mt-3 group-hover:text-emerald-400 transition">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>

                {/* Operations Counters */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                      Công việc:
                    </span>
                    <span className="font-bold text-white">
                      {isBCN ? `${tasks.length} toàn CLB` : `${doneTasks}/${deptTasks.length} xong`}
                    </span>
                  </div>

                  {!isBCN && pendingAcceptance > 0 && (
                    <div className="flex items-center justify-between text-amber-400 font-semibold">
                      <span>Chờ nhận task:</span>
                      <span className="bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 font-bold">
                        {pendingAcceptance} việc mới
                      </span>
                    </div>
                  )}

                  {!isBCN && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-lime-400" />
                        Dự trù ngân sách:
                      </span>
                      <span className="font-bold text-white">
                        {deptBudgets.length} tờ trình
                      </span>
                    </div>
                  )}

                  {!isBCN && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Megaphone className="w-3.5 h-3.5 text-teal-400" />
                        Chiến dịch truyền thông:
                      </span>
                      <span className="font-bold text-white">
                        {deptMedia.length} bài
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Switch button */}
              <div className="mt-5 pt-3 border-t border-white/5">
                {isCurrent ? (
                  <div className="w-full py-2 text-center text-xs font-black text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    Đang Trực Ban Này
                  </div>
                ) : (
                  <button
                    onClick={() => onSelectDept(dept)}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black text-slate-200 text-xs font-extrabold transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Chuyển Sang Ban Này</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
