import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckSquare, 
  Clock, 
  Plus, 
  Trash2, 
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { createTask } from '../../firebase/services';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function SuggestTaskModal({ isOpen, onClose, program, onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('high');
  const [dueDate, setDueDate] = useState('');
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keyboard shortcut: Esc to close, Enter to submit
  useModalKeyboard(isOpen, onClose, () => {
    if (!isSubmitting) {
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent);
    }
  });

  if (!isOpen || !program) return null;

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
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      await createTask({
        title: title.trim(),
        description: description.trim(),
        assignedDeptId: program.leadDeptId,
        assignedDeptName: program.leadDeptName,
        programId: program.id,
        programTitle: program.title,
        suggestedByBcn: true, // Marked as BCN suggested
        status: 'accepted',
        column: 'todo',
        priority,
        dueDate: dueDate || program.endDate || new Date().toISOString().split('T')[0],
        todos,
        createdBy: 'bcn',
      });

      triggerConfetti();
      playChime('success');
      onSuccess(`Đã đề xuất nhiệm vụ "${title.trim()}" cho ${program.leadDeptName}!`);
      onClose();
    } catch (err) {
      console.error('Error suggesting task:', err);
      alert('Có lỗi khi đề xuất task: ' + err.message);
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
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-white text-lg tracking-tight">
                  BCN: Đề Xuất Task Cho Ban
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Theo dõi tiến độ
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chương trình: <strong className="text-white">{program.title}</strong> • Phụ trách: <strong className="text-emerald-400">{program.leadDeptName}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-slate-500 font-mono bg-white/5 px-2 py-1 rounded-lg">
              Esc để đóng
            </span>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Tiêu Đề Task BCN Đề Xuất <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Chuẩn bị kịch bản MC & Âm thanh khai mạc..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Mức Độ Ưu Tiên
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Ưu tiên cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Hạn Chót BCN Yêu Cầu
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Mô Tả Chỉ Đạo / Lưu Ý Cho Ban
            </label>
            <textarea
              rows={2}
              placeholder="Ghi chú chi tiết yêu cầu, ban cần phối hợp cùng ai..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Sub-todos Checklist */}
          <div className="pt-2 border-t border-white/5">
            <label className="block text-xs font-bold text-slate-300 uppercase mb-2 flex items-center justify-between">
              <span>Todo Con Gợi Ý Kèm Theo ({todos.length})</span>
              <span className="text-[10px] text-slate-500">Ban có thể bổ sung thêm khi làm</span>
            </label>

            <div className="space-y-1.5 mb-2.5 max-h-32 overflow-y-auto pr-1">
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
                className="flex-1 px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleAddTodo}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-400 text-xs font-bold transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm</span>
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Nhấn <strong className="text-slate-400">Enter</strong> để đề xuất
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:brightness-110 disabled:opacity-50 text-black font-black text-xs transition shadow-lg shadow-cyan-500/25 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Đề Xuất Vào Chương Trình'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
