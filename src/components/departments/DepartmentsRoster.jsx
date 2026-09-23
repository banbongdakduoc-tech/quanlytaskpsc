import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  ArrowRightLeft, 
  CheckSquare, 
  Wallet, 
  Megaphone,
  UserPlus,
  Trash2,
  KeyRound,
  Lock
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { deleteAccount } from '../../firebase/services';

export default function DepartmentsRoster({ 
  tasks, 
  budgets, 
  mediaPlans, 
  accounts,
  currentDept, 
  onSelectDept,
  onOpenCreateAccountModal,
  onNotify
}) {
  const isBCN = currentDept.id === 'bcn';

  const accountList = Object.keys(accounts || {}).map((k) => ({
    username: k,
    ...accounts[k],
  }));

  const handleDeleteAccount = async (username) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa tài khoản "${username}" không?`)) {
      try {
        await deleteAccount(username);
        onNotify(`Đã xóa tài khoản "${username}" khỏi Firebase.`);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Phân Cấp & Quản Trị Tài Khoản Firebase
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Hệ Thống 8 Phân Ban & Danh Mục Tài Khoản
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Ban Chủ Nhiệm có toàn quyền cấp tài khoản, mật khẩu cho 7 ban thành phần trên Firebase
          </p>
        </div>

        {isBCN && (
          <button
            onClick={onOpenCreateAccountModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 self-start sm:self-center active:scale-95"
          >
            <UserPlus className="w-4 h-4 stroke-[3]" />
            <span>Tạo Tài Khoản Cho Ban</span>
          </button>
        )}
      </div>

      {/* Firebase Accounts Table (For BCN) */}
      <div className="card-sporty p-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                Tài Khoản Đang Lưu Trên Firebase Realtime ({accountList.length})
              </h3>
              <p className="text-[11px] text-slate-400">
                Lưu tại nhánh /accounts trên Firebase RTDB
              </p>
            </div>
          </div>

          {isBCN && (
            <button
              onClick={onOpenCreateAccountModal}
              className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Thêm tài khoản mới</span>
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0F11] text-slate-400 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Tên đăng nhập (Username)</th>
                <th className="py-3 px-4">Phân ban</th>
                <th className="py-3 px-4">Cấp bậc</th>
                <th className="py-3 px-4">Mật khẩu</th>
                <th className="py-3 px-4">Đại diện</th>
                {isBCN && <th className="py-3 px-4 text-center">Thao tác</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {accountList.map((acc) => (
                <tr key={acc.username} className="hover:bg-white/[0.02] transition">
                  <td className="py-3 px-4 font-mono font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{acc.username}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-semibold">{acc.deptName}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      acc.level === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'
                    }`}>
                      {acc.level === 1 ? 'Cấp 1 • BCN' : 'Cấp 2 • Ban'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{acc.password}</td>
                  <td className="py-3 px-4 text-slate-400">{acc.name || '-'}</td>
                  {isBCN && (
                    <td className="py-3 px-4 text-center">
                      {acc.username !== 'bcnpsc' ? (
                        <button
                          onClick={() => handleDeleteAccount(acc.username)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-600 font-semibold italic">Mặc định</span>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid of 8 Departments */}
      <div>
        <h3 className="text-base font-extrabold text-white mb-4">
          Tổng Thể 8 Phân Ban CLB Thể Thao
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEPARTMENTS.map((dept) => {
            const isCurrent = dept.id === currentDept.id;
            const isDeptBCN = dept.id === 'bcn';

            const deptTasks = tasks.filter(t => t.assignedDeptId === dept.id);
            const pendingAcceptance = deptTasks.filter(t => t.status === 'pending_acceptance').length;
            const doneTasks = deptTasks.filter(t => t.column === 'done').length;

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
                      isDeptBCN
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-white/5 text-slate-300 border-white/10'
                    }`}>
                      {dept.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white mt-3 group-hover:text-emerald-400 transition">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Nhiệm vụ:</span>
                      <span className="font-bold text-white">
                        {isDeptBCN ? `${tasks.length} toàn CLB` : `${doneTasks}/${deptTasks.length} xong`}
                      </span>
                    </div>

                    {!isDeptBCN && pendingAcceptance > 0 && (
                      <div className="flex items-center justify-between text-amber-400 font-semibold">
                        <span>Chờ nhận task:</span>
                        <span className="bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 font-bold">
                          {pendingAcceptance} việc mới
                        </span>
                      </div>
                    )}
                  </div>
                </div>

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
    </div>
  );
}
