import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Calendar, 
  MapPin, 
  CheckSquare, 
  Plus, 
  Trash2,
  Layers,
  Flag
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { createProgram, createTask } from '../../firebase/services';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function AssignProgramModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [leadDeptId, setLeadDeptId] = useState('bong-da');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('planning');
  const [initialTasks, setInitialTasks] = useState([
    { id: '1', text: 'Lập đề án & kế hoạch chi tiết', priority: 'high' }
  ]);
  const [newTaskInput, setNewTaskInput] = useState('');
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

  const handleAddInitialTask = () => {
    if (!newTaskInput.trim()) return;
    setInitialTasks([
      ...initialTasks,
      { id: `init-${Date.now()}`, text: newTaskInput.trim(), priority: 'medium' }
    ]);
    setNewTaskInput('');
  };

  const handleRemoveInitialTask = (id) => {
    setInitialTasks(initialTasks.filter(t => t.id !== id));
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const leadDept = DEPARTMENTS.find(d => d.id === leadDeptId);

      const newProgram = await createProgram({
        title: title.trim(),
        leadDeptId,
        leadDeptName: leadDept?.name || leadDeptId,
        description: description.trim(),
        location: location.trim(),
        startDate: startDate || new Date().toISOString().split('T')[0],
        endDate: endDate || '',
        status,
        createdBy: 'bcn',
      });

      // If BCN entered initial suggested tasks, create them under this program
      if (initialTasks.length > 0) {
        for (const t of initialTasks) {
          await createTask({
            title: t.text,
            description: `Nhiệm vụ định hướng do BCN giao trong khuôn khổ chương trình: ${title.trim()}`,
            assignedDeptId: leadDeptId,
            assignedDeptName: leadDept?.name || leadDeptId,
            programId: newProgram.id,
            programTitle: title.trim(),
            suggestedByBcn: true,
            status: 'accepted', // Program tasks are part of the accepted program
            column: 'todo',
            priority: t.priority || 'medium',
            dueDate: endDate || '',
            todos: [],
            createdBy: 'bcn',
          });
        }
      }

      triggerConfetti();
      playChime('success');
      onSuccess(`Đã giao chương trình "${title.trim()}" cho ${leadDept?.name} tổ chức!`);
      onClose();
    } catch (err) {
      console.error('Error creating program:', err);
      alert('Có lỗi xảy ra: ' + err.message);
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
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg tracking-tight">
                Giao Chương Trình Mới
              </h3>
              <p className="text-xs text-slate-400">
                Giao chương trình để ban phụ trách triển khai kế hoạch và nhiệm vụ
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
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Program Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Tên Chương Trình / Hoạt Động <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Giải Bóng Đá Dược Open 2026, Workshop Cầu Lông Tân Binh..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Target Department */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Ban Chủ Trì / Tổ Chức <span className="text-rose-400">*</span>
              </label>
              <select
                value={leadDeptId}
                onChange={(e) => setLeadDeptId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                {targetDepts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.badge})</option>
                ))}
              </select>
            </div>

            {/* Initial Status */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Giai Đoạn Ban Đầu
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="planning">Lập kế hoạch & Chuẩn bị</option>
                <option value="in_progress">Đang triển khai / Diễn ra</option>
              </select>
            </div>
          </div>

          {/* Location & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Địa Điểm Tổ Chức</span>
              </label>
              <input
                type="text"
                placeholder="VD: Sân vận động, Hội trường A..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Ngày Bắt Đầu</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                <span>Ngày Bế Mạc / Hạn Chót</span>
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          {/* Description & Objective */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Mục Tiêu & Chỉ Đạo Của Ban Chủ Nhiệm
            </label>
            <textarea
              rows={2}
              placeholder="Nêu rõ mục tiêu, quy mô người tham dự, các yêu cầu cần ban tổ chức chú ý..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
            />
          </div>

          {/* Initial Tasks Assigned by BCN */}
          <div className="pt-2 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-300 uppercase flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nhiệm Vụ BCN Đề Xuất Sẵn Cho Ban ({initialTasks.length})</span>
              </label>
              <span className="text-[10px] text-slate-500">Ban tổ chức sẽ tự lên thêm task sau</span>
            </div>

            <div className="space-y-1.5 mb-2.5 max-h-32 overflow-y-auto pr-1">
              {initialTasks.map((t, idx) => (
                <div key={t.id} className="flex items-center justify-between p-2 rounded-xl bg-[#141C1E] border border-white/5 text-xs text-slate-200">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                    <span className="truncate">{t.text}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveInitialTask(t.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Nhập task gợi ý cho ban (VD: Mời trọng tài, Đặt sân bãi)..."
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInitialTask();
                  }
                }}
                className="flex-1 px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
              <button
                type="button"
                onClick={handleAddInitialTask}
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
              Nhấn <strong className="text-slate-400">Enter</strong> để xác nhận giao
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 disabled:opacity-50 text-black font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isSubmitting ? 'Đang giao...' : 'Giao Chương Trình Cho Ban'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
