import React, { useState } from 'react';
import { 
  Layers, 
  Plus, 
  Filter, 
  Calendar, 
  MapPin, 
  CheckSquare, 
  Megaphone, 
  ArrowRight, 
  Sparkles, 
  Trash2, 
  Clock, 
  TrendingUp,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { deleteProgram } from '../../firebase/services';

export default function ProgramsHub({
  programs = [],
  tasks = [],
  mediaPlans = [],
  currentDept,
  onOpenAssignProgramModal,
  onOpenSuggestTaskModal,
  onSelectProgram,
  onNotify
}) {
  const isBCN = currentDept.id === 'bcn';

  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Filter programs
  const displayedPrograms = programs.filter((p) => {
    // If not BCN, show only programs where this dept is lead
    if (!isBCN && p.leadDeptId !== currentDept.id) {
      return false;
    }
    // If BCN and filter selected
    if (isBCN && selectedDeptFilter !== 'all' && p.leadDeptId !== selectedDeptFilter) {
      return false;
    }
    // Status filter
    if (selectedStatusFilter !== 'all' && p.status !== selectedStatusFilter) {
      return false;
    }
    return true;
  });

  const handleDeleteProgram = async (pId, pTitle) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa chương trình "${pTitle}" không?`)) {
      try {
        await deleteProgram(pId);
        onNotify(`Đã xóa chương trình "${pTitle}".`);
      } catch (err) {
        console.error('Error deleting program:', err);
      }
    }
  };

  const totalPrograms = programs.length;
  const inProgressCount = programs.filter(p => p.status === 'in_progress').length;
  const completedCount = programs.filter(p => p.status === 'completed').length;
  const planningCount = programs.filter(p => p.status === 'planning').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isBCN ? 'Cấp 1 • Điều Hành Hoạt Động' : `Cấp 2 • ${currentDept.name}`}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              Quản Lý Theo Chương Trình
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            {isBCN 
              ? 'Giao Chương Trình & Giám Sát Tiến Độ 8 Phân Ban' 
              : `Chương Trình Do ${currentDept.name} Phụ Trách Tổ Chức`}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isBCN
              ? 'BCN giao chương trình cho từng ban chủ trì, theo dõi tiến độ và đề xuất task chỉ đạo'
              : 'Ban nhận chương trình từ BCN, tự chủ động lên task triển khai và đăng ký kế hoạch truyền thông'}
          </p>
        </div>

        {isBCN && (
          <button
            onClick={onOpenAssignProgramModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 self-start sm:self-center active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Giao Chương Trình Mới</span>
          </button>
        )}
      </div>

      {/* Stats Summary for BCN */}
      {isBCN && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card-sporty p-5">
            <span className="text-xs font-semibold text-slate-400 uppercase">Tổng Chương Trình</span>
            <p className="text-3xl font-black text-white mt-1">{totalPrograms}</p>
            <span className="text-[11px] text-slate-500">Toàn bộ 8 phân ban</span>
          </div>

          <div className="card-sporty p-5 border-cyan-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-400 uppercase">Đang Diễn Ra</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            </div>
            <p className="text-3xl font-black text-cyan-400 mt-1">{inProgressCount}</p>
            <span className="text-[11px] text-cyan-300/80">Các ban đang triển khai</span>
          </div>

          <div className="card-sporty p-5 border-amber-500/30">
            <span className="text-xs font-semibold text-amber-400 uppercase">Lập Kế Hoạch / Chuẩn Bị</span>
            <p className="text-3xl font-black text-amber-400 mt-1">{planningCount}</p>
            <span className="text-[11px] text-amber-300/80">Giai đoạn tiền kỳ</span>
          </div>

          <div className="card-sporty p-5 border-emerald-500/30">
            <span className="text-xs font-semibold text-emerald-400 uppercase">Đã Hoàn Thành</span>
            <p className="text-3xl font-black text-emerald-400 mt-1">{completedCount}</p>
            <span className="text-[11px] text-emerald-400/80">Sự kiện thành công</span>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#141C1E] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        {/* Department Filter (Only for BCN) */}
        {isBCN ? (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              Ban:
            </span>
            <button
              onClick={() => setSelectedDeptFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                selectedDeptFilter === 'all'
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                  : 'bg-[#101517] text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              Tất cả
            </button>
            {DEPARTMENTS.filter(d => d.id !== 'bcn').map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDeptFilter(d.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                  selectedDeptFilter === d.id
                    ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                    : 'bg-[#101517] text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                {d.shortName}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 font-medium">
            Danh sách chương trình ban được phân công ({displayedPrograms.length})
          </div>
        )}

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0E1416] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="all">Tất cả giai đoạn</option>
            <option value="planning">Lập kế hoạch & Chuẩn bị</option>
            <option value="in_progress">Đang diễn ra</option>
            <option value="completed">Đã hoàn thành</option>
          </select>
        </div>
      </div>

      {/* Programs Grid */}
      {displayedPrograms.length === 0 ? (
        <div className="card-sporty p-12 text-center text-slate-500">
          <Layers className="w-12 h-12 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-bold text-slate-300">
            {isBCN 
              ? 'Chưa có chương trình nào được giao' 
              : 'Ban chưa có chương trình nào được phân công'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {isBCN 
              ? 'Bấm nút "Giao Chương Trình Mới" ở góc trên để bắt đầu giao cho một ban.' 
              : 'Khi Ban Chủ Nhiệm giao chương trình cho ban, sự kiện sẽ xuất hiện ở đây để ban tự lên task.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {displayedPrograms.map((program) => {
            const pTasks = tasks.filter(t => t.programId === program.id);
            const pDoneTasks = pTasks.filter(t => t.column === 'done');
            const progress = pTasks.length > 0 
              ? Math.round((pDoneTasks.length / pTasks.length) * 100) 
              : 0;

            const pMedia = mediaPlans.filter(m => m.programId === program.id);
            const dept = DEPARTMENTS.find(d => d.id === program.leadDeptId);

            return (
              <div
                key={program.id}
                className="card-sporty p-6 hover:border-emerald-500/40 transition flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar: Dept Badge & Status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {dept && (
                        <img 
                          src={dept.avatar} 
                          alt={dept.name} 
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10" 
                        />
                      )}
                      <div>
                        <span className="text-xs font-black text-white block">
                          {program.leadDeptName}
                        </span>
                        <span className="text-[10px] text-slate-400">Ban tổ chức chính</span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                      program.status === 'completed'
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : program.status === 'in_progress'
                        ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    }`}>
                      {program.status === 'completed' ? 'Đã hoàn thành' : program.status === 'in_progress' ? 'Đang diễn ra' : 'Lập kế hoạch'}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 
                    onClick={() => onSelectProgram(program)}
                    className="text-lg font-black text-white group-hover:text-emerald-400 transition cursor-pointer"
                  >
                    {program.title}
                  </h3>

                  {/* Description */}
                  {program.description && (
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {program.description}
                    </p>
                  )}

                  {/* Meta: Location & Time */}
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-400">
                    {program.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{program.location}</span>
                      </span>
                    )}
                    {program.startDate && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{program.startDate} {program.endDate ? `→ ${program.endDate}` : ''}</span>
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 p-3 rounded-2xl bg-[#0E1416] border border-white/5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">Tiến độ nhiệm vụ:</span>
                      <span className="font-extrabold text-emerald-400">
                        {pDoneTasks.length}/{pTasks.length} task ({progress}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#182022] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
                      <span>{pMedia.length} bài truyền thông</span>
                      {pTasks.filter(t => t.suggestedByBcn).length > 0 && (
                        <span className="text-cyan-400 font-semibold">
                          {pTasks.filter(t => t.suggestedByBcn).length} task BCN chỉ đạo
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="mt-5 pt-3.5 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectProgram(program)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Xem Chi Tiết & Bảng Task</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {isBCN && (
                    <button
                      onClick={() => onOpenSuggestTaskModal(program)}
                      className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold transition border border-cyan-500/20 flex items-center gap-1"
                      title="BCN giao thêm task chỉ đạo vào chương trình"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">+ Giao Thêm Task</span>
                    </button>
                  )}

                  {isBCN && (
                    <button
                      onClick={() => handleDeleteProgram(program.id, program.title)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition"
                      title="Xóa chương trình"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
