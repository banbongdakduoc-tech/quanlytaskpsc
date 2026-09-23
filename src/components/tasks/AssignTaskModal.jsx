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
  Calendar
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { createTask } from '../../firebase/services';

export default function AssignTaskModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedDeptId, setAssignedDeptId] = useState('bong-da');
  const [priority, setPriority] = useState('high');
  const [dueDate, setDueDate] = useState('');
  const [todos, setTodos] = useState([
    { id: '1', text: 'Lập kế hoạch triển khai chi tiết', done: false, priority: 'high' }
  ]);
  const [newTodoText, setNewTodoText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      await createTask({
        title: title.trim(),
        description: description.trim(),
        assignedDeptId,
        assignedDeptName: targetDept?.name || assignedDeptId,
        status: 'pending_acceptance', // Chờ ban xác nhận nhận task
        column: 'todo', // Mặc định vào Cần làm sau khi nhận
        priority,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        todos: todos,
        createdBy: 'bcn',
      });

      onSuccess(`Đã giao nhiệm vụ cho ${targetDept?.name} thành công!`);
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
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg tracking-tight">
                Ban Chủ Nhiệm: Giao Task Cho Ban
              </h3>
              <p className="text-xs text-slate-400">
                Chỉ định ban thành phần phụ trách và thiết lập danh mục Todo list cần làm
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
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Tiêu Đề Nhiệm Vụ / Công Việc
            </label>
            <input
              type="text"
              required
              placeholder="VD: Tổ chức Giải Bóng Đá Dược Open 2026..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                Hạn Chót Hoàn Thành
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
              Mô Tả Yêu Cầu Cụ Thể
            </label>
            <textarea
              rows={2}
              placeholder="Yêu cầu chi tiết, lưu ý thời gian, phối hợp cùng ban nào..."
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
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang gửi...' : 'Giao Việc Cho Ban'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
