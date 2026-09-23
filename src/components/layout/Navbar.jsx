import React, { useState } from 'react';
import { 
  Trophy, 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Megaphone, 
  Calendar, 
  Users, 
  Plus, 
  ChevronDown, 
  Bell, 
  ShieldCheck, 
  ArrowRightLeft,
  Sparkles,
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';

export default function Navbar({
  currentDept,
  onSelectDept,
  currentTab,
  onSelectTab,
  pendingAcceptanceCount = 0,
  onOpenAssignTaskModal,
  onOpenCreateTaskModal
}) {
  const [showDeptMenu, setShowDeptMenu] = useState(false);

  const isBCN = currentDept.id === 'bcn';
  const isMedia = currentDept.id === 'truyen-thong';

  // Navigation Items according to role
  const getNavItems = () => {
    if (isBCN) {
      return [
        { id: 'dashboard', label: 'Bàn Điều Hành BCN', icon: LayoutDashboard },
        { id: 'all-tasks', label: 'Giao & Giám Sát Task', icon: CheckSquare, badge: pendingAcceptanceCount > 0 ? `${pendingAcceptanceCount} chờ` : null },
        { id: 'budgets', label: 'Duyệt Dự Trù Kinh Phí', icon: Wallet },
        { id: 'media-monitor', label: 'Giám Sát Truyền Thông', icon: Megaphone },
        { id: 'departments', label: '8 Phân Ban & Tài Khoản', icon: Users },
      ];
    }

    if (isMedia) {
      return [
        { id: 'my-tasks', label: 'Mục Task Riêng Ban TT', icon: CheckSquare, badge: pendingAcceptanceCount > 0 ? `${pendingAcceptanceCount} việc mới` : null },
        { id: 'media-inbox', label: 'Tiếp Nhận Kế Hoạch TT', icon: Megaphone },
        { id: 'media-calendar', label: 'Lịch Phát Sóng Truyền Thông', icon: CalendarDays },
        { id: 'budgets', label: 'Dự Trù Ngân Sách Ban', icon: Wallet },
      ];
    }

    // Other 6 Specialized Departments (Cầu lông, Bóng đá, Bóng chuyền, Cheerleading, Tập sự, Pickleball)
    return [
      { id: 'my-tasks', label: `Task Riêng: ${currentDept.shortName}`, icon: CheckSquare, badge: pendingAcceptanceCount > 0 ? `${pendingAcceptanceCount} việc mới!` : null },
      { id: 'budgets', label: 'Lập Dự Trù Ngân Sách', icon: Wallet },
      { id: 'media-request', label: 'Kế Hoạch Truyền Thông', icon: Megaphone },
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-40 bg-[#080B0C]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand & Department Selector */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group cursor-pointer" onClick={() => onSelectTab(navItems[0].id)}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
                <Trophy className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#080B0C] animate-pulse"></span>
            </div>

            {/* Department Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDeptMenu(!showDeptMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#141C1E] border border-white/10 hover:border-emerald-500/40 transition group text-left"
              >
                <img
                  src={currentDept.avatar}
                  alt={currentDept.name}
                  className="w-7 h-7 rounded-xl object-cover ring-1 ring-white/10"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-sm tracking-tight group-hover:text-emerald-400 transition">
                      {currentDept.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isBCN 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                      : 'bg-white/5 text-slate-400'
                  }`}>
                    {currentDept.badge}
                  </span>
                </div>
              </button>

              {/* Dropdown Menu of 8 Departments */}
              {showDeptMenu && (
                <div 
                  className="absolute left-0 mt-2 w-72 rounded-3xl bg-[#0E1416] border border-white/10 shadow-2xl p-2.5 z-50 animate-fadeIn"
                  onClick={() => setShowDeptMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-white/5 mb-1.5 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Chọn Ban Điều Hành
                    </span>
                    <span className="text-[10px] text-emerald-400 font-semibold">8 Phân Ban</span>
                  </div>

                  <div className="space-y-1 max-h-80 overflow-y-auto pr-1">
                    {DEPARTMENTS.map((dept) => {
                      const isSelected = dept.id === currentDept.id;
                      return (
                        <button
                          key={dept.id}
                          onClick={() => onSelectDept(dept)}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-2xl transition text-left ${
                            isSelected
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold'
                              : 'hover:bg-white/5 text-slate-300'
                          }`}
                        >
                          <img
                            src={dept.avatar}
                            alt={dept.name}
                            className="w-7 h-7 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold truncate text-white">{dept.name}</p>
                            <p className="text-[10px] text-slate-400">{dept.badge}</p>
                          </div>
                          {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation Switcher */}
          <nav className="hidden lg:flex items-center p-1.5 rounded-2xl bg-[#12181A] border border-white/[0.08]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-md shadow-emerald-500/25 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black stroke-[2.5]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>

                  {item.badge && (
                    <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce ${
                      isActive ? 'bg-black text-emerald-400' : 'bg-rose-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {isBCN ? (
              <button
                onClick={onOpenAssignTaskModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Giao Task Cho Ban</span>
              </button>
            ) : (
              <button
                onClick={onOpenCreateTaskModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Tạo Việc Cho Ban</span>
              </button>
            )}

            {/* Quick Status Pill */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141C1E] border border-white/5 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Firebase RTDB Live</span>
            </div>
          </div>
        </div>

        {/* Mobile Sub Navigation bar */}
        <div className="lg:hidden py-2 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold'
                    : 'bg-[#141C1E] text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] px-1 bg-rose-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
