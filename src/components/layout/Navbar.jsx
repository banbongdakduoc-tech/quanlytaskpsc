import React from 'react';
import { 
  Trophy, 
  LayoutDashboard, 
  CheckSquare, 
  Wallet, 
  Megaphone, 
  Users, 
  Plus, 
  LogOut, 
  Layers, 
  BellRing,
  Camera
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';

export default function Navbar({
  currentUser,
  currentDept,
  currentTab,
  onSelectTab,
  pendingAcceptanceCount = 0,
  onOpenAssignProgramModal,
  onOpenAssignTaskModal,
  onOpenCreateTaskModal,
  onOpenChangeLogoModal,
  onLogout
}) {
  const isBCN = currentDept.id === 'bcn';
  const isMedia = currentDept.id === 'truyen-thong';

  // Navigation Items according to role
  const getNavItems = () => {
    if (isBCN) {
      return [
        { id: 'dashboard', label: 'Tổng Quan', icon: LayoutDashboard },
        { id: 'programs', label: 'Chương Trình', icon: Layers },
        { id: 'all-tasks', label: 'Nhiệm Vụ', icon: CheckSquare, badge: pendingAcceptanceCount > 0 ? `${pendingAcceptanceCount} chờ` : null },
        { id: 'budgets', label: 'Dự Trù Kinh Phí', icon: Wallet },
        { id: 'media-hub', label: 'Truyền Thông', icon: Megaphone },
        { id: 'departments', label: 'Tài Khoản', icon: Users },
      ];
    }

    if (isMedia) {
      return [
        { id: 'programs', label: 'Chương Trình', icon: Layers },
        { id: 'my-tasks', label: 'Nhiệm Vụ Ban TT', icon: CheckSquare, badge: pendingAcceptanceCount > 0 ? `${pendingAcceptanceCount} mới` : null },
        { id: 'media-hub', label: 'Truyền Thông', icon: Megaphone },
        { id: 'budgets', label: 'Dự Trù Kinh Phí', icon: Wallet },
      ];
    }

    // Other 6 Specialized Departments
    return [
      { id: 'programs', label: 'Chương Trình', icon: Layers },
      { id: 'my-tasks', label: `Nhiệm Vụ: ${currentDept.shortName}`, icon: CheckSquare, badge: pendingAcceptanceCount > 0 ? `${pendingAcceptanceCount} mới!` : null },
      { id: 'budgets', label: 'Dự Trù Kinh Phí', icon: Wallet },
      { id: 'media-request', label: 'Kế Hoạch Truyền Thông', icon: Megaphone },
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="sticky top-0 z-40 bg-[#080B0C]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand & Department Display */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative group cursor-pointer" onClick={() => onSelectTab(navItems[0].id)}>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
                <Trophy className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#080B0C] animate-pulse"></span>
            </div>

            {/* Brand Title */}
            <div className="hidden xl:block cursor-pointer mr-1" onClick={() => onSelectTab(navItems[0].id)}>
              <span className="font-black text-white text-base tracking-tight hover:text-emerald-400 transition">
                PharmacySportCLB
              </span>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                CLB Thể Thao Dược
              </p>
            </div>

            {/* Current Department Badge (Locked to logged in account) */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#141C1E] border border-white/10">
              <div 
                className="relative group cursor-pointer" 
                onClick={onOpenChangeLogoModal} 
                title="Bấm để đổi logo ban"
              >
                <img
                  src={currentDept.avatar}
                  alt={currentDept.name}
                  className="w-8 h-8 rounded-xl object-cover ring-1 ring-emerald-400/40"
                />
                <span className="absolute -bottom-1 -right-1 bg-black/80 rounded-full p-0.5 text-[9px] text-emerald-400 opacity-0 group-hover:opacity-100 transition shadow">
                  <Camera className="w-2.5 h-2.5" />
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-sm tracking-tight">
                    {currentDept.name}
                  </span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  isBCN 
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-white/5 text-slate-400'
                }`}>
                  {currentDept.badge}
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenChangeLogoModal}
                className="ml-1 p-1 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-white/5 transition"
                title="Đổi logo ban"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
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

          {/* Right Action Icons: Add, Profile, Logout */}
          <div className="flex items-center gap-2.5">
            {isBCN ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAssignProgramModal}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
                  title="Giao chương trình mới cho ban"
                >
                  <Layers className="w-4 h-4 stroke-[2.5]" />
                  <span className="hidden sm:inline">Giao Chương Trình</span>
                </button>

                <button
                  onClick={onOpenAssignTaskModal}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs transition border border-white/5"
                  title="Giao task ngoài & nhắc nhở đôn đốc ban"
                >
                  <BellRing className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline">Giao Task Ngoài</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenCreateTaskModal}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span className="hidden sm:inline">Tạo Việc Cho Ban</span>
              </button>
            )}

            {/* User Session Capsule */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141C1E] border border-white/5 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="font-mono text-emerald-400">@{currentUser?.username || 'user'}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-[#141C1E] border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition"
              title="Đăng xuất khỏi hệ thống"
            >
              <LogOut className="w-4 h-4" />
            </button>
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
