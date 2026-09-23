import React, { useState } from 'react';
import { X, Plus, Trash2, CheckCircle2, Clock, CheckSquare } from 'lucide-react';
import { createTask } from '../../firebase/services';

export default function CreateDeptTaskModal({ isOpen, onClose, currentDept, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [column, setColumn] = useState('todo');
  const [dueDate, setDueDate] = useState('');
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddTodo = () => {
    if (!todoInput.trim()) return;
    setTodos([
      ...todos,
      { id: `todo-${Date.now()}`, text: todoInput.trim(), done: false, priority: 'medium' }
    ]);
    setTodoInput('');
  };

  const handleRemoveTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await createTask({
        title: title.trim(),
        description: description.trim(),
        assignedDeptId: currentDept.id,
        assignedDeptName: currentDept.name,
        status: 'accepted', // Ban tự tạo nên tự động accepted
        column,
        priority,
        dueDate: dueDate || new Date().toISOString().split('T')[0],
        todos,
        createdBy: currentDept.id,
      });

      onSuccess(`Đã tạo công việc "${title}" cho ${currentDept.name}!`);
      onClose();
    } catch (err) {
      console.error('Error creating dept task:', err);
      alert('Lỗi tạo task: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-xl bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg tracking-tight">
                Tạo Công Việc Mới Cho {currentDept.name}
              </h3>
              <p className="text-xs text-slate-400">
                Thêm đầu việc nội bộ vào bảng làm việc riêng của ban
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
              Tiêu Đề Công Việc
            </label>
            <input
              type="text"
              required
              placeholder="VD: Kiểm tra và bọc lại vợt cầu lông..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Trạng Thái Ban Đầu
              </label>
              <select
                value={column}
                onChange={(e) => setColumn(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="todo">Cần làm</option>
                <option value="in_progress">Đang làm</option>
                <option value="done">Đã xong</option>
                <option value="cancelled">Huỷ</option>
              </select>
            </div>

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

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Hạn Chót
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Mô Tả Chi Tiết
            </label>
            <textarea
              rows={2}
              placeholder="Ghi chú thêm về nội dung, nhân sự phụ trách..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
            />
          </div>

          {/* Todo List */}
          <div className="pt-2 border-t border-white/5">
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
              Danh Sách Todo Con ({todos.length})
            </label>

            <div className="space-y-2 mb-3 max-h-32 overflow-y-auto pr-1">
              {todos.map((t, idx) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-xl bg-[#141C1E] border border-white/5 text-xs text-slate-200">
                  <span>{idx + 1}. {t.text}</span>
                  <button type="button" onClick={() => handleRemoveTodo(t.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập việc nhỏ cần làm..."
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTodo();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={handleAddTodo}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black text-xs transition shadow-lg shadow-emerald-500/25"
            >
              {isSubmitting ? 'Đang tạo...' : 'Lưu Công Việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
