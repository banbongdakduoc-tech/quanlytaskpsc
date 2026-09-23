import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ChevronRight, 
  UserCheck, 
  Filter,
  Plus
} from 'lucide-react';
import { INITIAL_MEMBERS, DEPARTMENTS } from '../../data/initialData';
import MemberDetailModal from './MemberDetailModal';

export default function MemberDirectory({ 
  tasks, 
  onToggleTask, 
  onOpenTaskDetail, 
  selectedDepartment,
  onSelectDepartment 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);

  const getDept = (id) => DEPARTMENTS.find(d => d.id === id);

  // Filter members by search and department
  const filteredMembers = INITIAL_MEMBERS.filter((m) => {
    const matchesDept = selectedDepartment === 'all' || m.departmentId === selectedDepartment;
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.studentId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Phân hệ Danh Bạ & Phân Công Nhân Sự
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1">
              Member Directory & Operations Roster
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Theo dõi phân ban sinh hoạt, chức vụ và danh sách công việc giao phó từng nhân sự
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên, mã SV, chức vụ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0E1416] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
            />
          </div>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMembers.map((member) => {
          const dept = getDept(member.departmentId);
          const memberTasks = tasks.filter(t => t.assigneeId === member.id);
          const doneTasks = memberTasks.filter(t => t.column === 'done').length;

          return (
            <div
              key={member.id}
              className="card-sporty p-5 flex flex-col justify-between hover:border-emerald-500/40 group relative overflow-hidden"
            >
              <div>
                {/* Avatar & Status */}
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-emerald-500/30 group-hover:ring-emerald-400 transition"
                    />
                    <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#141C1E] ${
                      member.status === 'online' ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}></span>
                  </div>

                  {dept && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/5">
                      {dept.shortName}
                    </span>
                  )}
                </div>

                {/* Name & Role */}
                <h3 className="font-extrabold text-white text-base mt-3 group-hover:text-emerald-400 transition">
                  {member.name}
                </h3>
                <p className="text-xs text-emerald-400 font-semibold">{member.role}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{member.studentId}</p>

                {/* Contact quick links */}
                <div className="mt-4 pt-3 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-2 hover:text-white transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                    <span>{member.phone}</span>
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 hover:text-white transition truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition" />
                    <span className="truncate">{member.email}</span>
                  </a>
                </div>
              </div>

              {/* Bottom Assigned Tasks Count & Button */}
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 block">Việc phụ trách:</span>
                  <span className="text-xs font-bold text-white">
                    {doneTasks}/{memberTasks.length} task xong
                  </span>
                </div>

                <button
                  onClick={() => setSelectedMember(member)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black text-slate-300 text-xs font-bold transition group/btn"
                >
                  <span>Hồ sơ & Việc</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
          tasks={tasks}
          onToggleTask={onToggleTask}
          onOpenTaskDetail={onOpenTaskDetail}
        />
      )}
    </div>
  );
}
