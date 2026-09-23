import React from 'react';
import { LayoutDashboard, CalendarRange, Kanban, MessageSquare, Users } from 'lucide-react';

export default function MobileNav({ currentTab, onSelectTab }) {
  const navItems = [
    { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'timeline', label: 'Timeline', icon: CalendarRange },
    { id: 'plans', label: 'Kế hoạch', icon: Kanban },
    { id: 'communication', label: 'Thảo luận', icon: MessageSquare },
    { id: 'directory', label: 'Nhân sự', icon: Users },
  ];

  return (
    <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E1416]/95 backdrop-blur-lg border-t border-white/[0.08] px-3 py-2 flex items-center justify-around shadow-2xl">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition ${
              isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px]">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
