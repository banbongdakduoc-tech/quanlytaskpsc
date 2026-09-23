import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Users, 
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { DEPARTMENTS, TASK_COLUMNS, PRIORITIES } from '../../data/departments';
import { deleteTask } from '../../firebase/services';

export default function BcnTasksManager({ 
  tasks, 
  onOpenAssignModal, 
  onNotify 
}) {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  const filteredTasks = tasks.filter((t) => {
    const matchesDept = selectedDeptFilter === 'all' || t.assignedDeptId === selectedDeptFilter;
    const matchesStatus = 
      selectedStatusFilter === 'all' 
        ? true 
        : selectedStatusFilter === 'pending'
        ? t.status === 'pending_acceptance'
        : t.column === selectedStatusFilter;
    return matchesDept && matchesStatus;
  });

  const totalAssigned = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'pending_acceptance').length;
  const inProgressCount = tasks.filter(t => t.status === 'accepted' && t.column === 'in_progress').length;
  const doneCount = tasks.filter(t => t.status === 'accepted' && t.column === 'done').length;

  const handleDelete = async (taskId, title) => {
    if (window.confirm(`Xóa nhiệm vụ "${title}"?`)) {
      try {
        await deleteTask(taskId);
        onNotify('Đã xóa nhiệm vụ khỏi hệ thống.');
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Ban Chủ Nhiệm • Trung Tâm Điều Hành Nhiệm Vụ
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Giao Việc & Giám Sát Tiến Độ 7 Phân Ban
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi trạng thái tiếp nhận task, checklist todo và hiệu suất hoàn thành của các ban
          </p>
        </div>

        <button
          onClick={onOpenAssignModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 self-start sm:self-center active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Giao Task Mới Cho Ban</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-sporty p-5">
          <span className="text-xs font-semibold text-slate-400 uppercase">Tổng Nhiệm Vụ Đã Giao</span>
          <p className="text-3xl font-black text-white mt-1">{totalAssigned}</p>
          <span className="text-[11px] text-slate-500">Toàn bộ 8 ban</span>
        </div>

        <div className="card-sporty p-5 border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase">Chờ Ban Tiếp Nhận</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          </div>
          <p className="text-3xl font-black text-amber-400 mt-1">{pendingCount}</p>
          <span className="text-[11px] text-amber-300/80">Chưa ấn xác nhận</span>
        </div>

        <div className="card-sporty p-5">
          <span className="text-xs font-semibold text-cyan-400 uppercase">Đang Triển Khai</span>
          <p className="text-3xl font-black text-cyan-400 mt-1">{inProgressCount}</p>
          <span className="text-[11px] text-slate-400">Các ban đang làm</span>
        </div>

        <div className="card-sporty p-5 border-emerald-500/30">
          <span className="text-xs font-semibold text-emerald-400 uppercase">Đã Hoàn Thành</span>
          <p className="text-3xl font-black text-emerald-400 mt-1">{doneCount}</p>
          <span className="text-[11px] text-emerald-400/80">Mục tiêu đạt được</span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#141C1E] border border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
        {/* Department filter */}
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

        {/* Status filter */}
        <div className="flex items-center gap-1.5">
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#0E1416] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ ban xác nhận</option>
            <option value="todo">Cần làm</option>
            <option value="in_progress">Đang làm</option>
            <option value="done">Đã xong</option>
            <option value="cancelled">Huỷ</option>
          </select>
        </div>
      </div>

      {/* Tasks Table / List */}
      <div className="card-sporty overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckSquare className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-bold text-slate-300">Chưa có công việc nào trong hệ thống</p>
            <p className="text-xs text-slate-500 mt-1">Bấm nút "Giao Task Mới Cho Ban" ở góc trên để bắt đầu.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredTasks.map((task) => {
              const dept = DEPARTMENTS.find(d => d.id === task.assignedDeptId);
              const priorityObj = PRIORITIES.find(p => p.id === task.priority) || PRIORITIES[2];
              const isPending = task.status === 'pending_acceptance';
              const todos = task.todos || [];
              const doneTodos = todos.filter(t => t.done).length;

              return (
                <div 
                  key={task.id}
                  className="p-5 hover:bg-white/[0.02] transition flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {dept && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5">
                          Ban {dept.name}
                        </span>
                      )}

                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${priorityObj.badge}`}>
                        {priorityObj.label}
                      </span>

                      {isPending ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          Chờ Ban Tiếp Nhận
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                          Cột: {TASK_COLUMNS.find(c => c.id === task.column)?.label || 'Cần làm'}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-extrabold text-white leading-snug">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-2.5 flex items-center gap-4 text-xs text-slate-400">
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          Hạn: {task.dueDate}
                        </span>
                      )}

                      {todos.length > 0 && (
                        <span className="text-emerald-400 font-semibold">
                          {doneTodos}/{todos.length} todo xong
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleDelete(task.id, task.title)}
                      className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition"
                      title="Xóa nhiệm vụ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
