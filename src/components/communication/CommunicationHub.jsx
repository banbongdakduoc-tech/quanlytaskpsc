import React from 'react';
import QuickChat from './QuickChat';
import ActivityFeed from './ActivityFeed';

export default function CommunicationHub({
  messages,
  onSendMessage,
  announcement,
  activities
}) {
  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          CLB Thể Thao Dược
        </span>
        <h2 className="text-2xl font-black text-white tracking-tight mt-1">
          Trao Đổi & Bảng Tin Hoạt Động
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Kênh trao đổi nhanh giữa các ban và theo dõi hoạt động mới nhất trong CLB
        </p>
      </div>

      {/* Grid: 8 cols Chat + 4 cols Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <QuickChat
            messages={messages}
            onSendMessage={onSendMessage}
            announcement={announcement}
          />
        </div>

        <div className="lg:col-span-4">
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}
