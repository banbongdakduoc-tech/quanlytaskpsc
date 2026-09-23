import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckSquare, 
  Clock, 
  Users, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Flag,
  Calendar,
  BellRing,
  Layers,
  Sparkles
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { createTask } from '../../firebase/services';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';

export default function AssignTaskModal({ isOpen, onClose, programs = [], onSuccess }) {
  const [taskCategory, setTaskCategory] = useState('reminder'); // 'reminder' | 'regular'
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedDeptId, setAssignedDeptId] = useState('bong-da');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [priority, setPriority] = useState('urgent');
  const [dueDate, setDueDate] = useState('');
  const [todos, setTodos] = useState([
    { id: '1', text: 'Kiểm tra & báo cáo tiến độ cho Ban Chủ Nhiệm', done: false, priority: 'high' }
  ]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook for Escape (close) and Enter (submit)
  useModalKeyboard(isOpen, onClose, () => {
    if (!isSubmitting) {
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent);
    }
  });

  if (!isOpen) return null;

  const targetDepts = DEPARTMENTS.filter(d => d.id !== 'bcn');

  const handleAddTodoItem = () => {
    if (!newTodoText.trim()) return;
    setTodos([
      ...todos,
      { id: `todo-${Date.now()}`, text: newTodoText.trim(), done: false, priority: 'medium' }
    ]);
    setNewTodoText('');
  };

  const handleRemoveTodoItem = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const targetDept = DEPARTMENTS.find(d => d.id === assignedDeptId);
      const matchedProgram = programs.find(p => p.id === selectedProgramId);

      await createTask({
        title: title.trim(),
        description: description.trim(),
        assignedDeptId,
        assignedDeptName: targetDept?.name || assignedDeptId,
        programId: selectedProgramId || '',
        programTitle: matchedProgram?.title || '',
        isReminder: taskCategory === 'reminder',
        status: 'pending_acceptance', // Chờ ban xác nhận nhận task
        column: 'todo', // Mặc định vào Cần làm sau khi nhận
        priority,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        todos: todos,
        createdBy: 'bcn',
      });

      onSuccess(
        taskCategory === 'reminder'
          ? `Đã gửi thông báo nhắc nhở đôn đốc tới ban ${targetDept?.name}!`
          : `Đã giao nhiệm vụ ngoài cho ${targetDept?.name} thành công!`
      );
      onClose();
    } catch (err) {
      console.error('Error assigning task:', err);
      alert('Có lỗi khi giao task: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
              taskCategory === 'reminder'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {taskCategory === 'reminder' ? <BellRing className="w-5 h-5 animate-pulse" /> : <Send className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-white text-lg tracking-tight">
                BCN: Giao Task Ngoài & Nhắc Nhở Ban
              </h3>
              <p className="text-xs text-slate-400">
                Giao việc đôn đốc tiến độ hoặc nhiệm vụ ngoài chương trình cho ban thành phần
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Task Type Switcher */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Phân Loại Nhiệm Vụ BCN Giao
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTaskCategory('reminder');
                  setPriority('urgent');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition ${
                  taskCategory === 'reminder'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-950/40'
                    : 'bg-[#141C1E] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <BellRing className="w-4 h-4 text-amber-400" />
                <span>🔔 Việc Nhắc Nhở / Đôn Đốc</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTaskCategory('regular');
                  setPriority('high');
                }}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border text-xs font-bold transition ${
                  taskCategory === 'regular'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-950/40'
                    : 'bg-[#141C1E] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>📋 Task Ngoài / Thường Nhật</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Tiêu Đề Công Việc <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={taskCategory === 'reminder' ? 'VD: Nhắc nhở nộp dự trù kinh phí giải đấu trước thứ 6...' : 'VD: Chuẩn bị phòng họp, kiểm kê trang thiết bị ban...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Target Department */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Ban Nhận Nhiệm Vụ
              </label>
              <select
                value={assignedDeptId}
                onChange={(e) => setAssignedDeptId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                {targetDepts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            {/* Optional Program Link */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Gắn Vào Chương Trình (Tùy chọn)</span>
              </label>
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="">-- Task Ngoài / Độc Lập --</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    Chương trình: {p.title} ({p.leadDeptName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Priority */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Độ Ưu Tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Ưu tiên cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Hạn Chót BCN Yêu Cầu
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              {taskCategory === 'reminder' ? 'Nội Dung Nhắc Nhở & Chỉ Đạo' : 'Mô Tả Yêu Cầu Cụ Thể'}
            </label>
            <textarea
              rows={2}
              placeholder={taskCategory === 'reminder' ? 'Ghi chú đôn đốc, nhắc nhở ban cần hoàn thiện trước mốc thời gian nào...' : 'Yêu cầu chi tiết, lưu ý thời gian, phối hợp cùng ban nào...'}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
            />
          </div>

          {/* Subtasks / Todo list assigned by BCN */}
          <div className="pt-2 border-t border-white/5">
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 flex items-center justify-between">
              <span>Todo List BCN Giao Kèm ({todos.length} mục)</span>
              <span className="text-[10px] text-slate-500 lowercase">Ban nhận có thể tự bổ sung thêm sau</span>
            </label>

            {/* Todo items list */}
            <div className="space-y-2 mb-3 max-h-36 overflow-y-auto pr-1">
              {todos.map((t, idx) => (
                <div 
                  key={t.id}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#141C1E] border border-white/5 text-xs text-slate-200"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-slate-500 font-bold">{idx + 1}.</span>
                    <span className="truncate">{t.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTodoItem(t.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded-lg transition"
                    title="Xóa mục này"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Todo item row */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập nội dung việc cần làm (VD: Khảo sát sân bãi)..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTodoItem();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={handleAddTodoItem}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 border border-white/5 text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Nhấn <strong className="text-slate-400">Enter</strong> để gửi • <strong className="text-slate-400">Esc</strong> để đóng
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition"
              >
                Hủy (Esc)
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-5 py-2.5 rounded-xl disabled:opacity-50 text-black font-black text-xs transition shadow-lg flex items-center gap-2 ${
                  taskCategory === 'reminder'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 shadow-amber-500/25'
                    : 'bg-emerald-500 hover:bg-emerald-400 shadow-emerald-500/25'
                }`}
              >
                {taskCategory === 'reminder' ? <BellRing className="w-3.5 h-3.5 stroke-[2.5]" /> : <Send className="w-3.5 h-3.5" />}
                <span>
                  {isSubmitting 
                    ? 'Đang gửi...' 
                    : taskCategory === 'reminder' 
                    ? 'Gửi Nhắc Nhở Cho Ban' 
                    : 'Giao Việc Cho Ban'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
