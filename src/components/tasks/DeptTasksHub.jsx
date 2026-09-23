import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  XCircle, 
  ChevronDown, 
  ChevronUp,
  Tag,
  Sparkles,
  Check,
  Layers,
  Filter,
  BellRing
} from 'lucide-react';
import { TASK_COLUMNS, PRIORITIES } from '../../data/departments';
import { updateTask, addTodoToTask, toggleTodoInTask, deleteTask } from '../../firebase/services';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function DeptTasksHub({ 
  tasks = [], 
  programs = [],
  currentDept, 
  onOpenCreateTaskModal,
  onNotify 
}) {
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [selectedProgramFilter, setSelectedProgramFilter] = useState('all');
  const [newTodoInput, setNewTodoInput] = useState({});
  const [newTodoPriority, setNewTodoPriority] = useState({});

  // Dept's programs
  const deptPrograms = programs.filter(p => p.leadDeptId === currentDept.id);

  // All accepted tasks for this department
  const allDeptAcceptedTasks = tasks.filter(
    (t) => t.assignedDeptId === currentDept.id && t.status === 'accepted'
  );

  const reminderTasks = allDeptAcceptedTasks.filter((t) => !t.programId || t.isReminder);

  // Filter tasks based on selected filter
  const deptTasks = allDeptAcceptedTasks.filter((t) => {
    if (selectedProgramFilter === 'all') return true;
    if (selectedProgramFilter === 'reminders') return !t.programId || t.isReminder;
    return t.programId === selectedProgramFilter;
  });

  const handleOpenCreateModal = () => {
    const defaultProgId = (selectedProgramFilter !== 'all' && selectedProgramFilter !== 'reminders')
      ? selectedProgramFilter
      : '';
    onOpenCreateTaskModal(defaultProgId);
  };

  const handleMoveColumn = async (task, targetCol) => {
    try {
      await updateTask(task.id, { column: targetCol });
      if (targetCol === 'done') {
        triggerConfetti();
        playChime('success');
        onNotify(`Đã hoàn thành công việc "${task.title}"!`);
      } else {
        playChime('click');
      }
    } catch (err) {
      console.error('Error updating task column:', err);
    }
  };

  const handleToggleTodo = async (taskId, todos, todoId) => {
    try {
      await toggleTodoInTask(taskId, todos, todoId);
      playChime('click');
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  const handleAddSubTodo = async (taskId, existingTodos = []) => {
    const text = newTodoInput[taskId];
    if (!text || !text.trim()) return;
    const priority = newTodoPriority[taskId] || 'medium';

    try {
      await addTodoToTask(taskId, existingTodos, text.trim(), priority);
      setNewTodoInput({ ...newTodoInput, [taskId]: '' });
      playChime('success');
    } catch (err) {
      console.error('Error adding sub todo:', err);
    }
  };

  const handleDeleteTask = async (taskId, title) => {
    if (window.confirm(`Bạn có chắc muốn xóa công việc "${title}" không?`)) {
      try {
        await deleteTask(taskId);
        onNotify('Đã xóa công việc khỏi bảng.');
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
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {currentDept.name}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Công Việc Của Ban
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi tiến độ, quản lý danh sách việc cần làm theo chương trình
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 self-start sm:self-center active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Tạo Việc Mới</span>
        </button>
      </div>

      {/* Filter Bar: All, Reminders & Programs */}
      {(deptPrograms.length > 0 || reminderTasks.length > 0) && (
        <div className="p-3.5 rounded-2xl bg-[#12181A] border border-white/5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phân loại:</span>
            </span>
            <button
              onClick={() => setSelectedProgramFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                selectedProgramFilter === 'all'
                  ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                  : 'bg-[#141C1E] text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              Tất cả ({allDeptAcceptedTasks.length})
            </button>

            {reminderTasks.length > 0 && (
              <button
                onClick={() => setSelectedProgramFilter('reminders')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                  selectedProgramFilter === 'reminders'
                    ? 'bg-amber-400 text-black border-amber-300 font-black shadow-md shadow-amber-950/40'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                <BellRing className="w-3 h-3" />
                <span>🔔 BCN Nhắc Nhở & Task Ngoài ({reminderTasks.length})</span>
              </button>
            )}

            {deptPrograms.map((p) => {
              const pCount = allDeptAcceptedTasks.filter(t => t.programId === p.id).length;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProgramFilter(p.id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                    selectedProgramFilter === p.id
                      ? 'bg-emerald-500 text-black border-emerald-400 font-bold'
                      : 'bg-[#141C1E] text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{p.title} ({pCount})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4 Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {TASK_COLUMNS.map((col) => {
          const colTasks = deptTasks.filter((t) => (t.column || 'todo') === col.id);

          return (
            <div
              key={col.id}
              className="rounded-3xl bg-[#101618] border border-white/[0.06] p-4 flex flex-col min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${col.badge}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-black text-slate-400">
                    {colTasks.length}
                  </span>
                </div>

                <button
                  onClick={onOpenCreateTaskModal}
                  className="p-1 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 transition"
                  title="Thêm task"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-32 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-xs text-slate-500 p-4 text-center">
                    <span>Chưa có mục {col.label.toLowerCase()}</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const isExpanded = expandedTaskId === task.id;
                    const todos = task.todos || [];
                    const completedTodos = todos.filter((t) => t.done).length;
                    const progressPercent = todos.length > 0 ? Math.round((completedTodos / todos.length) * 100) : 0;
                    const priorityObj = PRIORITIES.find((p) => p.id === task.priority) || PRIORITIES[2];

                    return (
                      <div
                        key={task.id}
                        className="p-4 rounded-2xl bg-[#141C1E] border border-white/[0.08] hover:border-emerald-500/40 hover:bg-[#182326] transition duration-200 group flex flex-col justify-between"
                      >
                        {/* Top: Priority & Creator */}
                        <div>
                          {/* Reminder Banner or Program Tag */}
                          {task.isReminder ? (
                            <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full mb-2 w-fit shadow">
                              <BellRing className="w-3 h-3 text-amber-400 animate-pulse" />
                              <span>BCN Nhắc Nhở & Đôn Đốc</span>
                            </div>
                          ) : task.programTitle ? (
                            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 mb-2 w-fit">
                              <Layers className="w-3 h-3 shrink-0" />
                              <span className="truncate max-w-[180px]">{task.programTitle}</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded mb-2 w-fit">
                              Task ngoài chương trình
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${priorityObj.badge}`}>
                              {priorityObj.label}
                            </span>

                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                              {task.suggestedByBcn ? (
                                <span className="text-cyan-400 font-bold bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                                  ✨ BCN Giao Thêm
                                </span>
                              ) : task.createdBy === 'bcn' ? (
                                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                  BCN Giao
                                </span>
                              ) : (
                                <span className="text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">
                                  Ban Tạo
                                </span>
                              )}
                              <button
                                onClick={() => handleDeleteTask(task.id, task.title)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition"
                                title="Xóa task"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className={`text-sm font-extrabold text-white leading-snug ${
                            task.column === 'done' ? 'line-through text-slate-400' : ''
                          }`}>
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          {/* Due date */}
                          {task.dueDate && (
                            <div className="flex items-center gap-1 mt-2 text-[11px] text-slate-400">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>Hạn: {task.dueDate}</span>
                            </div>
                          )}

                          {/* Todo Progress Bar */}
                          {todos.length > 0 && (
                            <div className="mt-3 p-2.5 rounded-xl bg-[#0E1416] border border-white/5">
                              <div className="flex items-center justify-between text-[11px] mb-1">
                                <span className="text-slate-400">Checklist Todo:</span>
                                <span className="font-bold text-emerald-400">
                                  {completedTodos}/{todos.length} ({progressPercent}%)
                                </span>
                              </div>
                              <div className="w-full bg-[#182022] h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${progressPercent}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Collapsible Sub-todos Checklist */}
                        <div className="mt-3 pt-2.5 border-t border-white/5">
                          <button
                            onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                            className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-emerald-400 transition py-1"
                          >
                            <span className="flex items-center gap-1.5">
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Danh sách Todo con ({todos.length})</span>
                            </span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2.5 space-y-2 animate-fadeIn">
                              {/* Sub todos items */}
                              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                {todos.map((todo) => {
                                  const todoPriority = PRIORITIES.find(p => p.id === todo.priority) || PRIORITIES[2];
                                  return (
                                    <div
                                      key={todo.id}
                                      onClick={() => handleToggleTodo(task.id, todos, todo.id)}
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
                                })}
                              </div>

                              {/* Form to add more todos by the department */}
                              <div className="flex items-center gap-1.5 pt-1.5">
                                <input
                                  type="text"
                                  placeholder="Thêm todo mới..."
                                  value={newTodoInput[task.id] || ''}
                                  onChange={(e) => setNewTodoInput({ ...newTodoInput, [task.id]: e.target.value })}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddSubTodo(task.id, todos);
                                    }
                                  }}
                                  className="flex-1 px-2.5 py-1.5 rounded-xl bg-[#0A0E10] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                                />

                                <select
                                  value={newTodoPriority[task.id] || 'medium'}
                                  onChange={(e) => setNewTodoPriority({ ...newTodoPriority, [task.id]: e.target.value })}
                                  className="px-1.5 py-1.5 rounded-xl bg-[#0A0E10] border border-white/10 text-[10px] text-slate-300 focus:outline-none"
                                >
                                  <option value="urgent">Khẩn</option>
                                  <option value="high">Cao</option>
                                  <option value="medium">TB</option>
                                  <option value="low">Thấp</option>
                                </select>

                                <button
                                  type="button"
                                  onClick={() => handleAddSubTodo(task.id, todos)}
                                  className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black font-bold text-xs transition"
                                  title="Thêm todo"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Column Switcher Actions */}
                        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
                          <span className="text-[10px] text-slate-500">Chuyển:</span>
                          <div className="flex items-center gap-1">
                            {col.id !== 'todo' && (
                              <button
                                onClick={() => handleMoveColumn(task, 'todo')}
                                className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white text-[10px] transition"
                              >
                                Cần làm
                              </button>
                            )}
                            {col.id !== 'in_progress' && (
                              <button
                                onClick={() => handleMoveColumn(task, 'in_progress')}
                                className="px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[10px] transition"
                              >
                                Đang làm
                              </button>
                            )}
                            {col.id !== 'done' && (
                              <button
                                onClick={() => handleMoveColumn(task, 'done')}
                                className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-[10px] transition"
                              >
                                Xong
                              </button>
                            )}
                            {col.id !== 'cancelled' && (
                              <button
                                onClick={() => handleMoveColumn(task, 'cancelled')}
                                className="px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] transition"
                              >
                                Huỷ
                              </button>
                            )}
                          </div>
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
    </div>
  );
}
