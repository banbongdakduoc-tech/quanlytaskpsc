import React from 'react';
import { Trophy, Megaphone, Package, Handshake, ChevronRight } from 'lucide-react';
import { DEPARTMENTS, INITIAL_MEMBERS } from '../../data/initialData';

export default function DepartmentStats({ tasks, onSelectDepartment }) {
  const depts = DEPARTMENTS.filter(d => d.id !== 'all');

  const getDeptIcon = (id) => {
    switch (id) {
      case 'sports': return Trophy;
      case 'media': return Megaphone;
      case 'logistics': return Package;
      case 'finance': return Handshake;
      default: return Trophy;
    }
  };

  return (
    <div className="card-sporty p-6">
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Hiệu Suất Theo Phân Ban
          </h3>
          <p className="text-xs text-slate-400">
            Tỷ lệ hoàn thành công việc và lực lượng nhân sự từng ban
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {depts.map((dept) => {
          const Icon = getDeptIcon(dept.id);
          const deptTasks = tasks.filter(t => t.departmentId === dept.id);
          const totalTasks = deptTasks.length;
          const doneTasks = deptTasks.filter(t => t.column === 'done').length;
          const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
          const memberCount = INITIAL_MEMBERS.filter(m => m.departmentId === dept.id).length;

          return (
            <div
              key={dept.id}
              onClick={() => onSelectDepartment(dept.id)}
              className="p-4 rounded-2xl bg-[#12181A] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#162225] transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-white/5 text-slate-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {memberCount} nhân sự
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm mt-3 group-hover:text-emerald-400 transition">
                  {dept.name}
                </h4>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-400">Tiến độ</span>
                  <span className="font-black text-emerald-400">{percent}%</span>
                </div>
                <div className="w-full bg-[#080B0C] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                  <span>{doneTasks}/{totalTasks} công việc</span>
                  <span className="group-hover:translate-x-0.5 transition flex items-center text-slate-400 group-hover:text-emerald-400">
                    Chi tiết &rarr;
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
