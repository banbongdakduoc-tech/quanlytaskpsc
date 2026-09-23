import React from 'react';
import { 
  CheckCircle2, 
  Wallet, 
  Package, 
  ShieldCheck, 
  PlusCircle, 
  Clock, 
  Activity,
  Flame
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/initialData';

export default function ActivityFeed({ activities }) {
  const getIcon = (type) => {
    switch (type) {
      case 'task_done':
        return { icon: CheckCircle2, bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' };
      case 'finance':
        return { icon: Wallet, bg: 'bg-lime-500/15 text-lime-400 border-lime-500/30' };
      case 'inventory':
        return { icon: Package, bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' };
      case 'approval':
        return { icon: ShieldCheck, bg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' };
      default:
        return { icon: PlusCircle, bg: 'bg-slate-700/50 text-slate-300 border-white/10' };
    }
  };

  return (
    <div className="card-sporty p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Bảng Tin Hoạt Động</h3>
            <p className="text-[11px] text-slate-400">Nhật ký hoạt động trong CLB</p>
          </div>
        </div>

        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      </div>

      {/* Activity Timeline List */}
      <div className="mt-4 space-y-4 flex-1 overflow-y-auto pr-1">
        {activities.map((item, idx) => {
          const { icon: Icon, bg } = getIcon(item.type);
          const dept = DEPARTMENTS.find(d => d.id === item.departmentId);

          return (
            <div key={item.id || idx} className="flex items-start gap-3 relative group">
              {/* Connecting line */}
              {idx < activities.length - 1 && (
                <div className="absolute left-4 top-8 bottom-0 w-px bg-white/5 -mb-4"></div>
              )}

              {/* Icon */}
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 z-10 ${bg}`}>
                <Icon className="w-4 h-4" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-bold text-white hover:text-emerald-400 transition cursor-pointer">
                    {item.user}
                  </span>
                  <span className="text-slate-400">{item.action}:</span>
                </div>

                <p className="text-xs font-semibold text-slate-200 mt-0.5 leading-snug">
                  "{item.target}"
                </p>

                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                  <Clock className="w-3 h-3 text-slate-500" />
                  <span>{item.time}</span>
                  {dept && (
                    <>
                      <span>•</span>
                      <span className="text-slate-400">{dept.shortName}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
