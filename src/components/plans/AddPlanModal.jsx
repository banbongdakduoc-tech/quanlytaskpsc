import React, { useState } from 'react';
import { X, Calendar, Plus, Trophy, Wallet, MapPin, Target, Sparkles } from 'lucide-react';
import { DEPARTMENTS, INITIAL_MEMBERS } from '../../data/initialData';

export default function AddPlanModal({ isOpen, onClose, onAddPlan }) {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    departmentId: 'sports',
    leadId: 'm2',
    objective: '',
    timeRange: '01/10/2026 - 30/10/2026',
    startDate: '2026-10-01',
    endDate: '2026-10-30',
    location: 'Sân Thể Thao ĐH Dược',
    driveLink: 'https://drive.google.com/drive/folders/plan-docs',
    badge: 'Kế hoạch mới',
    estimatedBudget: 15000000,
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const newPlan = {
      ...formData,
      id: `p-${Date.now()}`,
      status: 'active',
      actualBudget: 0,
      budgetItems: [
        { id: `b-${Date.now()}-1`, name: 'Dự trù kinh phí cơ sở ban đầu', estimated: Number(formData.estimatedBudget), actual: 0, status: 'pending' }
      ],
      stages: [
        { id: 's1', name: 'GĐ 1: Chuẩn bị & Ban hành điều lệ', period: 'Tuần 1', progress: 0, lead: 'Ban Chủ Nhiệm', status: 'upcoming' },
        { id: 's2', name: 'GĐ 2: Mở đơn đăng ký & Truyền thông', period: 'Tuần 2', progress: 0, lead: 'Ban Truyền thông', status: 'upcoming' },
        { id: 's3', name: 'GĐ 3: Khởi tranh & Thi đấu', period: 'Tuần 3', progress: 0, lead: 'Ban Chuyên môn', status: 'upcoming' },
        { id: 's4', name: 'GĐ 4: Bế mạc & Tổng kết', period: 'Tuần 4', progress: 0, lead: 'Ban Chủ Nhiệm', status: 'upcoming' },
      ]
    };

    onAddPlan(newPlan);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div 
        className="w-full max-w-xl bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Khởi Tạo Kế Hoạch / Sự Kiện Mới
              </h3>
              <p className="text-xs text-slate-400">
                Thêm dự án hoạt động mới vào hệ thống điều hành CLB
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
              Tên Kế Hoạch / Giải Đấu
            </label>
            <input
              type="text"
              required
              placeholder="VD: Giải Bóng Rổ Tân Sinh Viên 2026..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Mã Hoạt Động (Code)
              </label>
              <input
                type="text"
                placeholder="VD: BASKETBALL-2026"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Phân Ban Chủ Trì
              </label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-400"
              >
                {DEPARTMENTS.filter(d => d.id !== 'all').map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Trưởng Ban Tổ Chức (Lead)
              </label>
              <select
                value={formData.leadId}
                onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-400"
              >
                {INITIAL_MEMBERS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} - {m.role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Ngân Sách Dự Trù (VNĐ)
              </label>
              <input
                type="number"
                value={formData.estimatedBudget}
                onChange={(e) => setFormData({ ...formData, estimatedBudget: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Thời Gian Triển Khai
              </label>
              <input
                type="text"
                placeholder="VD: 01/10/2026 - 25/10/2026"
                value={formData.timeRange}
                onChange={(e) => setFormData({ ...formData, timeRange: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Địa Điểm Tổ Chức
              </label>
              <input
                type="text"
                placeholder="VD: Sân Nhà Thi Đấu ĐH Dược"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Mục Tiêu & Ý Nghĩa Hoạt Động
            </label>
            <textarea
              rows={3}
              placeholder="Mô tả mục tiêu của giải đấu hoặc hoạt động..."
              value={formData.objective}
              onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 transition"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/25"
            >
              Lưu & Phát Hành Kế Hoạch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
