import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Lock, 
  User, 
  Shield, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { createAccountByBCN } from '../../firebase/services';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function CreateAccountModal({ isOpen, onClose, onSuccess }) {
  const [selectedDeptId, setSelectedDeptId] = useState('bong-da');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }

    const dept = DEPARTMENTS.find(d => d.id === selectedDeptId);

    try {
      setIsSubmitting(true);
      setError('');

      await createAccountByBCN({
        username: username.trim(),
        password: password.trim(),
        deptId: selectedDeptId,
        deptName: dept?.name || selectedDeptId,
        name: name.trim() || `Đại diện ${dept?.name}`,
        role: 'department',
      });

      triggerConfetti();
      playChime('success');
      onSuccess(`Đã tạo tài khoản "${username.trim().toLowerCase()}" cho ${dept?.name} trên Firebase!`);
      onClose();
    } catch (err) {
      console.error('Error creating account:', err);
      setError(err.message || 'Lỗi khi tạo tài khoản');
      playChime('click');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectDept = (deptId) => {
    setSelectedDeptId(deptId);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg tracking-tight">
                Tạo Tài Khoản Cho Ban
              </h3>
              <p className="text-xs text-slate-400">
                Cấp tài khoản đăng nhập cho các ban trong CLB
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Chọn Ban Được Cấp Tài Khoản
            </label>
            <select
              value={selectedDeptId}
              onChange={(e) => handleSelectDept(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-400"
            >
              {targetDepts.map((d) => (
                <option key={d.id} value={d.id}>{d.name} ({d.badge})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Tên Đăng Nhập (Username)
              </label>
              <input
                type="text"
                required
                placeholder="VD: banbongda..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Mật Khẩu Ban Đầu
              </label>
              <input
                type="text"
                required
                placeholder="VD: 123456"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Tên Người Đại Diện Ban / Chức Vụ
            </label>
            <input
              type="text"
              placeholder="VD: Nguyễn Văn A (Trưởng ban Cầu Lông)..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#12181A] border border-white/5 text-xs text-slate-400">
            <span className="text-emerald-400 font-bold block mb-0.5">Phân quyền:</span>
            Tài khoản có quyền quản lý công việc, dự trù ngân sách và gửi kế hoạch truyền thông của ban.
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 text-xs text-slate-300"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-black text-xs transition shadow-lg shadow-emerald-500/25 flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang tạo...' : 'Tạo Tài Khoản & Lưu Lên Firebase'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
