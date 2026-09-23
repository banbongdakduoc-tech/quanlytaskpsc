import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  Calendar, 
  MapPin, 
  CheckSquare, 
  Megaphone, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Share2,
  Trash2,
  Sparkles,
  Info,
  ChevronRight,
  TrendingUp,
  User,
  Check,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List
} from 'lucide-react';
import { TASK_COLUMNS, PRIORITIES } from '../../data/departments';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { updateTask, updateProgram, deleteTask, toggleTodoInTask, addTodoToTask } from '../../firebase/services';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function ProgramDetailModal({
  isOpen,
  onClose,
  program,
  tasks = [],
  mediaPlans = [],
  currentDept,
  onOpenSuggestTaskModal,
  onOpenCreateDeptTaskModal,
  onOpenSubmitMediaModal,
  onNotify
}) {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'media' | 'info'
  const [taskViewMode, setTaskViewMode] = useState('list'); // 'list' | 'kanban'
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [newSubTodoInput, setNewSubTodoInput] = useState({});
  const [newSubTodoPriority, setNewSubTodoPriority] = useState({});

  // Hook for Escape to close
  useModalKeyboard(isOpen, onClose);

  if (!isOpen || !program) return null;

  const isBCN = currentDept.id === 'bcn';
  const isLeadDept = currentDept.id === program.leadDeptId;

  // Filter tasks belonging to this program
  const programTasks = tasks.filter((t) => t.programId === program.id);
  const doneTasks = programTasks.filter((t) => t.column === 'done');
  const progressPercent = programTasks.length > 0 
    ? Math.round((doneTasks.length / programTasks.length) * 100) 
    : 0;

  // Filter media plans belonging to this program
  const programMediaPlans = mediaPlans.filter((m) => m.programId === program.id);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateProgram(program.id, { status: newStatus });
      onNotify(`Đã chuyển trạng thái chương trình thành "${newStatus}"!`);
      playChime('success');
    } catch (err) {
      console.error('Error updating program:', err);
    }
  };

  const handleQuickMoveTaskColumn = async (task, targetCol) => {
    try {
      await updateTask(task.id, { column: targetCol });
      if (targetCol === 'done') {
        triggerConfetti();
        playChime('success');
        onNotify(`Đã hoàn thành "${task.title}"!`);
      } else {
        playChime('click');
      }
    } catch (err) {
      console.error('Error moving task:', err);
    }
  };

  const handleToggleSubTodo = async (taskId, todos, todoId) => {
    try {
      await toggleTodoInTask(taskId, todos, todoId);
      playChime('click');
    } catch (err) {
      console.error('Error toggling sub-todo:', err);
    }
  };

  const handleAddSubTodo = async (taskId, existingTodos = []) => {
    const text = newSubTodoInput[taskId];
    if (!text || !text.trim()) return;
    const priority = newSubTodoPriority[taskId] || 'medium';

    try {
      await addTodoToTask(taskId, existingTodos, text.trim(), priority);
      setNewSubTodoInput({ ...newSubTodoInput, [taskId]: '' });
      playChime('success');
    } catch (err) {
      console.error('Error adding sub-todo:', err);
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    if (window.confirm(`Xóa task "${taskTitle}" khỏi chương trình?`)) {
      try {
        await deleteTask(taskId);
        onNotify('Đã xóa task thành công.');
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div 
        className="w-full max-w-5xl bg-[#0E1416] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-white/10 shrink-0">
          <div className="space-y-1.5 min-w-0 flex-1 pr-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Chương Trình CLB
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-300">
                Ban tổ chức: <strong className="text-white">{program.leadDeptName}</strong>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                program.status === 'completed'
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  : program.status === 'in_progress'
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}>
                {program.status === 'completed' ? 'Đã hoàn thành' : program.status === 'in_progress' ? 'Đang diễn ra' : 'Lập kế hoạch'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {program.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
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
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline text-[11px] text-slate-500 font-mono bg-white/5 px-2 py-1 rounded-lg">
              Esc để đóng
            </span>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar & Quick Stats */}
        <div className="py-4 border-b border-white/5 bg-[#12181A] px-5 -mx-6 sm:-mx-7 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400 font-medium">Tiến Độ Triển Khai Chương Trình:</span>
                <span className="font-black text-emerald-400 text-sm">
                  {doneTasks.length}/{programTasks.length} Task Xong ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-[#080B0C] h-2.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Quick Action Buttons according to role */}
            <div className="flex items-center gap-2 shrink-0">
              {isBCN && (
                <button
                  onClick={() => onOpenSuggestTaskModal(program)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-300 hover:text-black font-extrabold text-xs transition border border-cyan-500/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Giao Thêm Task Vào Chương Trình</span>
                </button>
              )}

              {(isLeadDept || isBCN) && (
                <button
                  onClick={() => onOpenCreateDeptTaskModal(program)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  <span>+ Tự Lên Task Mới</span>
                </button>
              )}

              <button
                onClick={() => onOpenSubmitMediaModal(program)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-teal-500/20 text-slate-300 hover:text-teal-400 font-bold text-xs transition border border-white/5"
              >
                <Megaphone className="w-3.5 h-3.5 text-teal-400" />
                <span className="hidden sm:inline">Kế Hoạch Truyền Thông</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-3 border-b border-white/5 shrink-0">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'tasks'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Nhiệm Vụ & Bảng Task ({programTasks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'media'
                ? 'bg-teal-500 text-black shadow-md shadow-teal-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Kế Hoạch Truyền Thông ({programMediaPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'info'
                ? 'bg-white/20 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Chi Tiết & Mục Tiêu</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* 1. TASKS TAB */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {/* Toolbar: View mode & Task count */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-300">
                    Nhiệm vụ trong chương trình:
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                    {programTasks.length} task
                  </span>
                  {doneTasks.length > 0 && (
                    <span className="text-[11px] text-slate-400">
                      ({doneTasks.length} hoàn thành)
                    </span>
                  )}
                </div>

                {/* View switcher: List vs Kanban */}
                <div className="flex items-center gap-1 p-1 bg-[#141C1E] border border-white/10 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setTaskViewMode('list')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      taskViewMode === 'list'
                        ? 'bg-emerald-500 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>Danh Sách</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTaskViewMode('kanban')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                      taskViewMode === 'kanban'
                        ? 'bg-emerald-500 text-black shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Bảng 4 Cột Kanban</span>
                  </button>
                </div>
              </div>

              {programTasks.length === 0 ? (
                <div className="p-10 text-center text-slate-500 border-2 border-dashed border-white/5 rounded-3xl">
                  <CheckSquare className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                  <p className="text-sm font-bold text-slate-300">Chưa có nhiệm vụ nào trong chương trình</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {isLeadDept 
                      ? 'Ban tổ chức hãy bấm "+ Tự Lên Task Mới" ở phía trên để bắt đầu lập kế hoạch triển khai.'
                      : 'Ban Chủ Nhiệm có thể bấm "+ Giao Thêm Task Vào Chương Trình" để chỉ đạo các đầu việc.'}
                  </p>
                </div>
              ) : taskViewMode === 'list' ? (
                /* LIST VIEW */
                <div className="space-y-3">
                  {programTasks.map((t) => {
                    const priorityObj = PRIORITIES.find(p => p.id === t.priority) || PRIORITIES[2];
                    const isDone = t.column === 'done';
                    const todos = t.todos || [];
                    const completedTodos = todos.filter(sub => sub.done).length;
                    const isExpanded = expandedTaskId === t.id;

                    return (
                      <div
                        key={t.id}
                        className={`p-4 rounded-2xl border transition group flex flex-col gap-3 ${
                          isDone 
                            ? 'bg-[#101517] border-white/5 opacity-80' 
                            : 'bg-[#141C1E] border-white/10 hover:border-emerald-500/30'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                              {/* Origin badge */}
                              {t.suggestedByBcn ? (
                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                  BCN Giao Thêm
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/5 text-slate-400">
                                  Ban Lên Kế Hoạch
                                </span>
                              )}

                              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border ${priorityObj.badge}`}>
                                {priorityObj.label}
                              </span>

                              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                                Cột: {TASK_COLUMNS.find(c => c.id === t.column)?.label || 'Cần làm'}
                              </span>
                            </div>

                            <h4 className={`text-sm font-extrabold text-white leading-snug ${isDone ? 'line-through text-slate-400' : ''}`}>
                              {t.title}
                            </h4>

                            {t.description && (
                              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                                {t.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                              {t.dueDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-slate-500" />
                                  <span>Hạn: {t.dueDate}</span>
                                </span>
                              )}
                              {todos.length > 0 && (
                                <span className="text-emerald-400 font-semibold">
                                  {completedTodos}/{todos.length} todo con xong
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quick Column Switchers */}
                          <div className="flex items-center gap-1.5 shrink-0 self-start">
                            {t.column !== 'todo' && (
                              <button
                                onClick={() => handleQuickMoveTaskColumn(t, 'todo')}
                                className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] transition"
                              >
                                Cần làm
                              </button>
                            )}
                            {t.column !== 'in_progress' && (
                              <button
                                onClick={() => handleQuickMoveTaskColumn(t, 'in_progress')}
                                className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] transition"
                              >
                                Đang làm
                              </button>
                            )}
                            {t.column !== 'done' && (
                              <button
                                onClick={() => handleQuickMoveTaskColumn(t, 'done')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-black font-bold text-[10px] transition border border-emerald-500/30"
                              >
                                ✓ Xong
                              </button>
                            )}
                            {t.column !== 'cancelled' && (
                              <button
                                onClick={() => handleQuickMoveTaskColumn(t, 'cancelled')}
                                className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] transition"
                              >
                                Huỷ
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteTask(t.id, t.title)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                              title="Xóa task"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Sub-todos Accordion */}
                        <div className="pt-2 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => setExpandedTaskId(isExpanded ? null : t.id)}
                            className="flex items-center justify-between w-full text-xs font-bold text-slate-300 hover:text-emerald-400 transition"
                          >
                            <span className="flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Checklist Todo Con ({todos.length})</span>
                            </span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2.5 space-y-2 animate-fadeIn">
                              {/* Sub-todos list */}
                              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                {todos.length === 0 ? (
                                  <p className="text-[11px] text-slate-500 italic py-1">Chưa có todo con nào. Thêm mục bên dưới:</p>
                                ) : (
                                  todos.map((todo) => {
                                    const todoPriority = PRIORITIES.find(p => p.id === todo.priority) || PRIORITIES[2];
                                    return (
                                      <div
                                        key={todo.id}
                                        onClick={() => handleToggleSubTodo(t.id, todos, todo.id)}
                                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#0A0E10] border border-white/5 hover:border-emerald-500/30 cursor-pointer transition text-xs"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition shrink-0 ${
                                            todo.done
                                              ? 'bg-emerald-500 border-emerald-400 text-black'
                                              : 'border-slate-600 hover:border-emerald-400'
                                          }`}>
                                            {todo.done && <Check className="w-3 h-3 stroke-[3]" />}
                                          </div>
                                          <span className={`truncate ${todo.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                                            {todo.text}
                                          </span>
                                        </div>

                                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase shrink-0 ${todoPriority.badge}`}>
                                          {todoPriority.label}
                                        </span>
                                      </div>
                                    );
                                  })
                                )}
                              </div>

                              {/* Form to add sub-todo */}
                              <div className="flex items-center gap-1.5 pt-1.5">
                                <input
                                  type="text"
                                  placeholder="Thêm việc nhỏ cần làm vào task này..."
                                  value={newSubTodoInput[t.id] || ''}
                                  onChange={(e) => setNewSubTodoInput({ ...newSubTodoInput, [t.id]: e.target.value })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddSubTodo(t.id, todos);
                                    }
                                  }}
                                  className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#0A0E10] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                                />

                                <select
                                  value={newSubTodoPriority[t.id] || 'medium'}
                                  onChange={(e) => setNewSubTodoPriority({ ...newSubTodoPriority, [t.id]: e.target.value })}
                                  className="px-2 py-1.5 rounded-xl bg-[#0A0E10] border border-white/10 text-[10px] text-slate-300 focus:outline-none"
                                >
                                  <option value="urgent">Khẩn</option>
                                  <option value="high">Cao</option>
                                  <option value="medium">TB</option>
                                  <option value="low">Thấp</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => handleAddSubTodo(t.id, todos)}
                                  className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold text-xs transition"
                                  title="Thêm todo"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* KANBAN 4-COLUMN VIEW */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {TASK_COLUMNS.map((col) => {
                    const colTasks = programTasks.filter(t => (t.column || 'todo') === col.id);

                    return (
                      <div
                        key={col.id}
                        className="rounded-2xl bg-[#101517] border border-white/5 p-3 flex flex-col min-h-[420px]"
                      >
                        {/* Column Header */}
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${col.badge}`}>
                            {col.label}
                          </span>
                          <span className="text-xs font-black text-slate-400">
                            {colTasks.length}
                          </span>
                        </div>

                        {/* Column Tasks */}
                        <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                          {colTasks.length === 0 ? (
                            <div className="h-28 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-[11px] text-slate-600 text-center p-2">
                              Trống
                            </div>
                          ) : (
                            colTasks.map((t) => {
                              const priorityObj = PRIORITIES.find(p => p.id === t.priority) || PRIORITIES[2];
                              const todos = t.todos || [];
                              const completedTodos = todos.filter(sub => sub.done).length;
                              const isExpanded = expandedTaskId === t.id;

                              return (
                                <div
                                  key={t.id}
                                  className="p-3 rounded-xl bg-[#141C1E] border border-white/5 hover:border-emerald-500/30 transition flex flex-col justify-between group"
                                >
                                  <div>
                                    <div className="flex items-center justify-between gap-1 mb-1.5">
                                      <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase border ${priorityObj.badge}`}>
                                        {priorityObj.label}
                                      </span>
                                      {t.suggestedByBcn && (
                                        <span className="text-[8px] font-black uppercase text-cyan-400 bg-cyan-500/10 px-1 rounded border border-cyan-500/20">
                                          BCN Giao
                                        </span>
                                      )}
                                    </div>

                                    <h5 className="text-xs font-bold text-white leading-snug">
                                      {t.title}
                                    </h5>

                                    {t.description && (
                                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                                        {t.description}
                                      </p>
                                    )}

                                    {todos.length > 0 && (
                                      <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1">
                                        <CheckSquare className="w-3 h-3" />
                                        <span>{completedTodos}/{todos.length} todo</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Quick Switch Column */}
                                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-1">
                                      {col.id !== 'todo' && (
                                        <button
                                          onClick={() => handleQuickMoveTaskColumn(t, 'todo')}
                                          className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-slate-300 hover:text-white"
                                          title="Chuyển sang Cần làm"
                                        >
                                          Cần làm
                                        </button>
                                      )}
                                      {col.id !== 'in_progress' && (
                                        <button
                                          onClick={() => handleQuickMoveTaskColumn(t, 'in_progress')}
                                          className="px-1.5 py-0.5 rounded bg-cyan-500/10 text-[9px] text-cyan-400 hover:bg-cyan-500/20"
                                          title="Chuyển sang Đang làm"
                                        >
                                          Làm
                                        </button>
                                      )}
                                      {col.id !== 'done' && (
                                        <button
                                          onClick={() => handleQuickMoveTaskColumn(t, 'done')}
                                          className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-[9px] text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold"
                                          title="Chuyển sang Đã xong"
                                        >
                                          Xong
                                        </button>
                                      )}
                                      {col.id !== 'cancelled' && (
                                        <button
                                          onClick={() => handleQuickMoveTaskColumn(t, 'cancelled')}
                                          className="px-1.5 py-0.5 rounded bg-rose-500/10 text-[9px] text-rose-400 hover:bg-rose-500/20"
                                          title="Chuyển sang Huỷ"
                                        >
                                          Huỷ
                                        </button>
                                      )}
                                    </div>

                                    <button
                                      onClick={() => handleDeleteTask(t.id, t.title)}
                                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                                      title="Xóa task"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. MEDIA PLANS TAB */}
          {activeTab === 'media' && (
            <div>
              {programMediaPlans.length === 0 ? (
                <div className="p-10 text-center text-slate-500 border-2 border-dashed border-white/5 rounded-3xl">
                  <Megaphone className="w-10 h-10 mx-auto text-teal-500/50 mb-2" />
                  <p className="text-sm font-bold text-slate-300">Chưa có kế hoạch truyền thông cho chương trình này</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Bấm nút "Kế Hoạch Truyền Thông" ở góc trên để gửi nội dung bài đăng Fanpage/TikTok cho BCN và Ban Truyền Thông.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {programMediaPlans.map((m) => (
                    <div key={m.id} className="p-4 rounded-2xl bg-[#141C1E] border border-white/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            m.status === 'scheduled' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          }`}>
                            {m.status === 'scheduled' ? 'Đã xếp lịch đăng' : 'Đang xử lý'}
                          </span>
                          <span className="text-xs text-slate-400">
                            {m.deptName}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono">
                          {m.scheduledDate} {m.scheduledTime && `• ${m.scheduledTime}`}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white">{m.eventTitle}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{m.contentSummary}</p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <span className="text-slate-500">Kênh:</span>
                        {(m.channels || []).map((ch, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-semibold">
                            {ch}
                          </span>
                        ))}
                        {m.assetLink && (
                          <a
                            href={m.assetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-400 text-[11px] underline ml-2"
                          >
                            Xem Google Drive ảnh/video
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. ABOUT & INFO TAB */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#141C1E] border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Mục Tiêu & Chỉ Đạo</h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {program.description || 'Chưa có mô tả chi tiết.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#141C1E] border border-white/5 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Ban Chủ Trì Tổ Chức</span>
                  <p className="text-sm font-bold text-white">{program.leadDeptName}</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#141C1E] border border-white/5 space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase">Địa Điểm Tổ Chức</span>
                  <p className="text-sm font-bold text-white">{program.location || 'Chưa ấn định'}</p>
                </div>
              </div>

              {isBCN && (
                <div className="p-4 rounded-2xl bg-[#141C1E] border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-slate-400 uppercase">Cập Nhật Trạng Thái Chương Trình</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleUpdateStatus('planning')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        program.status === 'planning' ? 'bg-amber-500 text-black font-bold' : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      Lập Kế Hoạch & Chuẩn Bị
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('in_progress')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        program.status === 'in_progress' ? 'bg-cyan-500 text-black font-bold' : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      Đang Diễn Ra
                    </button>
                    <button
                      onClick={() => handleUpdateStatus('completed')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        program.status === 'completed' ? 'bg-emerald-500 text-black font-bold' : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      Đã Hoàn Thành
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            PharmacySportCLB • Quản lý vận hành theo chương trình
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition"
          >
            Đóng (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}
