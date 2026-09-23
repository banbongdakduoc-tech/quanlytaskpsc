import React, { useState, useEffect } from 'react';
import { 
  X, 
  Megaphone, 
  Send, 
  Calendar, 
  Clock, 
  Link, 
  FileText, 
  Sparkles,
  Share2,
  Layers
} from 'lucide-react';
import { createMediaPlan } from '../../firebase/services';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function SubmitMediaPlanModal({ 
  isOpen, 
  onClose, 
  currentDept, 
  programs = [],
  defaultProgramId = '',
  onSuccess 
}) {
  const [eventTitle, setEventTitle] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState(defaultProgramId || '');
  const [channels, setChannels] = useState(['Fanpage CLB']);
  const [contentSummary, setContentSummary] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('19:30');
  const [assetLink, setAssetLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (defaultProgramId) {
      setSelectedProgramId(defaultProgramId);
      const matched = programs.find(p => p.id === defaultProgramId);
      if (matched && !eventTitle) {
        setEventTitle(`Truyền thông: ${matched.title}`);
      }
    }
  }, [defaultProgramId, programs]);

  // Hook for Escape (close) and Enter (submit)
  useModalKeyboard(isOpen, onClose, () => {
    if (!isSubmitting) {
      const fakeEvent = { preventDefault: () => {} };
      handleSubmit(fakeEvent);
    }
  });

  if (!isOpen) return null;

  const channelOptions = ['Fanpage CLB', 'TikTok Thể Thao', 'Bàn Trực Sảnh Giảng Đường', 'Story Instagram', 'Nhóm Zalo Trưởng Ban'];

  const toggleChannel = (ch) => {
    if (channels.includes(ch)) {
      setChannels(channels.filter(c => c !== ch));
    } else {
      setChannels([...channels, ch]);
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!eventTitle.trim()) return;

    try {
      setIsSubmitting(true);
      const matchedProgram = programs.find(p => p.id === selectedProgramId);

      await createMediaPlan({
        eventTitle: eventTitle.trim(),
        deptId: currentDept.id,
        deptName: currentDept.name,
        programId: selectedProgramId || '',
        programTitle: matchedProgram?.title || '',
        channels,
        contentSummary: contentSummary.trim(),
        scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
        scheduledTime,
        assetLink: assetLink.trim(),
        status: 'submitted', // submitted -> accepted_by_media -> scheduled -> published
      });

      triggerConfetti();
      playChime('success');
      onSuccess(`Đã gửi kế hoạch truyền thông cho Ban Chủ Nhiệm & Ban Truyền Thông!`);
      onClose();
    } catch (err) {
      console.error('Error submitting media plan:', err);
      alert('Lỗi gửi kế hoạch truyền thông: ' + err.message);
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
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-lg tracking-tight">
                Lập Kế Hoạch Truyền Thông: {currentDept.name}
              </h3>
              <p className="text-xs text-slate-400">
                Gửi đồng thời lên Ban Chủ Nhiệm và Ban Truyền Thông tiếp nhận
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[11px] text-slate-500 font-mono bg-white/5 px-2 py-1 rounded-lg">
              Esc để đóng
            </span>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Program Link Selection */}
          {programs.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                <span>Chiến Dịch / Chương Trình Liên Quan</span>
              </label>
              <select
                value={selectedProgramId}
                onChange={(e) => setSelectedProgramId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-400"
              >
                <option value="">-- Bài truyền thông độc lập / Hoạt động thường nhật --</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    Chương trình: {p.title} ({p.leadDeptName})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Tiêu Đề Bài Viết / Sự Kiện Truyền Thông <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Khai mạc Giải Bóng Đá Dược Open 2026..."
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          {/* Channels Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Kênh Phát Sóng Mong Muốn
            </label>
            <div className="flex flex-wrap gap-2">
              {channelOptions.map((ch) => {
                const isSelected = channels.includes(ch);
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => toggleChannel(ch)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                      isSelected
                        ? 'bg-teal-500 text-black border-teal-400 font-bold shadow-md shadow-teal-500/20'
                        : 'bg-[#141C1E] text-slate-400 border-white/5 hover:text-white'
                    }`}
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Ngày Đăng Dự Kiến
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Khung Giờ Đăng (Giờ Vàng)
              </label>
              <input
                type="text"
                placeholder="VD: 19:30 (Tối) hoặc 11:30 (Trưa)"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Nội Dung & Thông Điệp Bài Viết
            </label>
            <textarea
              rows={3}
              placeholder="Tóm tắt thông điệp chính, đối tượng kêu gọi, thời gian địa điểm diễn ra..."
              value={contentSummary}
              onChange={(e) => setContentSummary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Link Tệp Đính Kèm / Google Drive Ảnh & Video
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/drive/folders/..."
              value={assetLink}
              onChange={(e) => setAssetLink(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Nhấn <strong className="text-slate-400">Enter</strong> để gửi
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Hủy (Esc)
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-black font-black text-xs transition shadow-lg shadow-teal-500/25 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi Kế Hoạch Truyền Thông'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
