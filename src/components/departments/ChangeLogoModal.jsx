import React, { useState } from 'react';
import { X, Image, Upload, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';
import { updateDepartmentLogo, resetDepartmentLogo } from '../../firebase/services';
import { DEFAULT_DEPT_LOGOS } from '../../data/defaultLogos';
import { playChime, triggerConfetti } from '../../utils/helpers';

export default function ChangeLogoModal({
  isOpen,
  onClose,
  dept,
  currentLogo,
  onSuccess
}) {
  const [logoMode, setLogoMode] = useState('upload'); // 'upload' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const [previewLogo, setPreviewLogo] = useState(currentLogo || DEFAULT_DEPT_LOGOS[dept?.id] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useModalKeyboard(isOpen, onClose);

  if (!isOpen || !dept) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Vui lòng chọn ảnh có kích thước dưới 2MB để đảm bảo tải nhanh.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        setPreviewLogo(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlChange = (val) => {
    setUrlInput(val);
    if (val.trim()) {
      setPreviewLogo(val.trim());
    } else {
      setPreviewLogo(DEFAULT_DEPT_LOGOS[dept.id]);
    }
  };

  const handleResetDefault = async () => {
    if (window.confirm('Khôi phục về logo thể thao mặc định của ban?')) {
      try {
        setIsSubmitting(true);
        await resetDepartmentLogo(dept.id);
        playChime('success');
        if (onSuccess) onSuccess(`Đã khôi phục logo mặc định cho ${dept.name}!`);
        onClose();
      } catch (err) {
        console.error('Error resetting logo:', err);
        alert('Lỗi: ' + err.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSave = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!previewLogo) return;

    try {
      setIsSubmitting(true);
      await updateDepartmentLogo(dept.id, previewLogo);
      triggerConfetti();
      playChime('success');
      if (onSuccess) onSuccess(`Cập nhật logo cho ${dept.name} thành công!`);
      onClose();
    } catch (err) {
      console.error('Error updating logo:', err);
      alert('Lỗi cập nhật logo: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <Image className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Đổi Logo / Avatar Ban</h3>
              <p className="text-xs text-slate-400">{dept.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Preview */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#141C1E] border border-white/5 space-y-2">
          <div className="relative group">
            <img
              src={previewLogo}
              alt={dept.name}
              className="w-24 h-24 rounded-2xl object-cover ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/10"
              onError={(e) => {
                e.currentTarget.src = DEFAULT_DEPT_LOGOS[dept.id] || DEFAULT_DEPT_LOGOS['bcn'];
              }}
            />
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Xem trước ảnh đại diện</span>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#141C1E] rounded-xl border border-white/5">
          <button
            type="button"
            onClick={() => setLogoMode('upload')}
            className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              logoMode === 'upload'
                ? 'bg-emerald-500 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Tải ảnh từ máy</span>
          </button>
          <button
            type="button"
            onClick={() => setLogoMode('url')}
            className={`py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              logoMode === 'url'
                ? 'bg-emerald-500 text-black shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5" />
            <span>Nhập link ảnh (URL)</span>
          </button>
        </div>

        {/* Input Area */}
        {logoMode === 'upload' ? (
          <div>
            <label className="block p-4 border-2 border-dashed border-white/10 hover:border-emerald-500/40 rounded-2xl cursor-pointer text-center transition group">
              <Upload className="w-6 h-6 mx-auto text-slate-400 group-hover:text-emerald-400 mb-1.5 transition" />
              <span className="text-xs text-slate-300 font-bold block">
                Bấm để chọn file ảnh từ thiết bị
              </span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                Định dạng JPG, PNG, WEBP (tối đa 2MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Đường dẫn link ảnh trực tiếp
            </label>
            <input
              type="url"
              placeholder="https://example.com/logo.png"
              value={urlInput}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <button
            type="button"
            onClick={handleResetDefault}
            disabled={isSubmitting}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
            title="Dùng lại logo thể thao ban đầu"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Khôi phục mặc định</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{isSubmitting ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
