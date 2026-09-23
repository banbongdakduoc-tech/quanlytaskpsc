import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  Plus, 
  Calendar, 
  Clock, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ExternalLink, 
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Send,
  Filter
} from 'lucide-react';
import { 
  deleteMediaPlan, 
  requestDeleteMediaPlan, 
  cancelDeleteMediaPlanRequest 
} from '../../firebase/services';
import { getProgramColor, playChime } from '../../utils/helpers';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';

export default function DeptMediaHub({
  mediaPlans = [],
  programs = [],
  currentDept,
  initialProgramFilter = 'all',
  onOpenSubmitMediaModal,
  onNotify
}) {
  const [selectedProgramFilter, setSelectedProgramFilter] = useState(initialProgramFilter);
  const [planForDeletionRequest, setPlanForDeletionRequest] = useState(null);
  const [deletionReasonInput, setDeletionReasonInput] = useState('');
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);

  useEffect(() => {
    if (initialProgramFilter) {
      setSelectedProgramFilter(initialProgramFilter);
    }
  }, [initialProgramFilter]);

  // Hook for Escape to close reason modal
  useModalKeyboard(!!planForDeletionRequest, () => setPlanForDeletionRequest(null));

  // Filter plans belonging to this department
  const myPlans = mediaPlans.filter(m => m.deptId === currentDept.id);

  // Filter based on active filter
  const displayedPlans = myPlans.filter(p => {
    if (selectedProgramFilter === 'all') return true;
    if (selectedProgramFilter === 'independent') return !p.programId;
    return p.programId === selectedProgramFilter;
  });

  // Programs associated with this department's plans or led by this dept
  const deptPrograms = programs.filter(p => 
    p.leadDeptId === currentDept.id || myPlans.some(m => m.programId === p.id)
  );

  // Group plans by program for grouped view
  const programGroups = [];

  // Add specific programs
  deptPrograms.forEach(p => {
    const plansInProgram = myPlans.filter(m => m.programId === p.id);
    if (plansInProgram.length > 0 || selectedProgramFilter === p.id) {
      programGroups.push({
        id: p.id,
        program: p,
        title: p.title,
        plans: plansInProgram
      });
    }
  });

  // Add independent plans group
  const independentPlans = myPlans.filter(m => !m.programId);
  if (independentPlans.length > 0) {
    programGroups.push({
      id: 'independent',
      program: null,
      title: 'Hoạt Động Thường Nhật & Bài Đăng Ngoài Chương Trình',
      plans: independentPlans
    });
  }

  // Handle direct deletion
  const handleDeletePlan = async (planId, planTitle) => {
    if (window.confirm(`Xóa vĩnh viễn kế hoạch truyền thông "${planTitle}"? Cả Ban Truyền Thông và Ban ${currentDept.name} sẽ không còn thấy bài này.`)) {
      try {
        await deleteMediaPlan(planId);
        playChime('click');
        onNotify('Đã xóa bài truyền thông thành công.');
      } catch (err) {
        console.error('Error deleting plan:', err);
        alert('Lỗi xóa bài: ' + err.message);
      }
    }
  };

  // Submit deletion request with reason
  const handleConfirmDeletionRequest = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!planForDeletionRequest) return;
    if (!deletionReasonInput.trim()) {
      alert('Vui lòng nhập lý do yêu cầu xóa bài!');
      return;
    }

    try {
      setIsSubmittingReason(true);
      await requestDeleteMediaPlan(
        planForDeletionRequest.id,
        currentDept.name,
        currentDept.id,
        deletionReasonInput.trim()
      );
      playChime('success');
      onNotify(`Đã gửi yêu cầu xóa bài "${planForDeletionRequest.eventTitle}" tới Ban Truyền Thông & BCN.`);
      setPlanForDeletionRequest(null);
      setDeletionReasonInput('');
    } catch (err) {
      console.error('Error requesting deletion:', err);
      alert('Lỗi gửi yêu cầu: ' + err.message);
    } finally {
      setIsSubmittingReason(false);
    }
  };

  // Cancel deletion request
  const handleCancelDeletionRequest = async (planId) => {
    try {
      await cancelDeleteMediaPlanRequest(planId);
      playChime('click');
      onNotify('Đã thu hồi yêu cầu xóa bài.');
    } catch (err) {
      console.error('Error canceling deletion request:', err);
    }
  };

  // Open modal with prefilled program
  const handleOpenSubmit = () => {
    const defaultProgId = (selectedProgramFilter !== 'all' && selectedProgramFilter !== 'independent')
      ? selectedProgramFilter
      : '';
    onOpenSubmitMediaModal(defaultProgId);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {currentDept.name} • Quản Lý Truyền Thông
            </span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
              Theo Chương Trình
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Kế Hoạch & Bài Đăng Truyền Thông
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Lập kế hoạch bài đăng theo từng chương trình và theo dõi tiến độ tiếp nhận từ Ban Truyền Thông & BCN
          </p>
        </div>

        <button
          onClick={handleOpenSubmit}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-black font-extrabold text-xs transition shadow-lg shadow-teal-500/20 self-start sm:self-center active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Gửi Bài Truyền Thông Mới</span>
        </button>
      </div>

      {/* Program Filter Bar */}
      {(deptPrograms.length > 0 || independentPlans.length > 0) && (
        <div className="p-3.5 rounded-2xl bg-[#12181A] border border-white/5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-teal-400" />
              <span>Chương trình:</span>
            </span>

            <button
              onClick={() => setSelectedProgramFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                selectedProgramFilter === 'all'
                  ? 'bg-teal-500 text-black border-teal-400 font-bold'
                  : 'bg-[#141C1E] text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              Tất cả ({myPlans.length})
            </button>

            {deptPrograms.map((p) => {
              const pCount = myPlans.filter(m => m.programId === p.id).length;
              const color = getProgramColor(p.id, p.title);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProgramFilter(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                    selectedProgramFilter === p.id
                      ? `${color.badge} font-bold ring-1 ring-white/20`
                      : 'bg-[#141C1E] text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${color.dot}`}></span>
                  <span>{p.title} ({pCount})</span>
                </button>
              );
            })}

            {independentPlans.length > 0 && (
              <button
                onClick={() => setSelectedProgramFilter('independent')}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                  selectedProgramFilter === 'independent'
                    ? 'bg-slate-300 text-black border-white font-bold'
                    : 'bg-[#141C1E] text-slate-400 border-white/5 hover:text-white'
                }`}
              >
                Ngoài chương trình ({independentPlans.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {myPlans.length === 0 ? (
        <div className="card-sporty p-12 text-center text-slate-500">
          <Megaphone className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-base font-bold text-slate-200">
            Ban {currentDept.name} chưa gửi kế hoạch truyền thông nào
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Khi ban chuẩn bị tổ chức giải đấu hoặc hoạt động nội bộ, hãy bấm nút "Gửi Bài Truyền Thông Mới" để Ban Truyền Thông lên lịch phát sóng Fanpage/TikTok.
          </p>
          <button
            onClick={handleOpenSubmit}
            className="mt-5 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs transition shadow-lg shadow-teal-500/20"
          >
            + Gửi Kế Hoạch Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {programGroups
            .filter(grp => selectedProgramFilter === 'all' || selectedProgramFilter === grp.id)
            .map(grp => {
              const color = getProgramColor(grp.program?.id, grp.title);
              const plansInGrp = grp.plans;

              if (plansInGrp.length === 0 && selectedProgramFilter !== grp.id) {
                return null;
              }

              return (
                <div 
                  key={grp.id} 
                  className={`rounded-3xl border bg-[#101517] p-5 sm:p-6 transition ${color.border} ${color.glow}`}
                >
                  {/* Group Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/5">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${color.dot} shrink-0`}></span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-white tracking-tight">
                            {grp.title}
                          </h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${color.badge}`}>
                            {plansInGrp.length} bài đăng
                          </span>
                        </div>
                        {grp.program && (
                          <p className="text-xs text-slate-400 mt-0.5">
                            {grp.program.location && `Địa điểm: ${grp.program.location} • `}
                            Thời gian: {grp.program.startDate || 'Đang cập nhật'}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenSubmitMediaModal(grp.program ? grp.program.id : '')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-teal-500/20 text-slate-300 hover:text-teal-400 border border-white/5 text-xs font-bold transition self-start sm:self-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm bài cho sự kiện này</span>
                    </button>
                  </div>

                  {/* Plans within this group */}
                  {plansInGrp.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-3 text-center">
                      Chưa có bài đăng nào được lên kế hoạch cho sự kiện này.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {plansInGrp.map(plan => {
                        const isScheduled = plan.status === 'scheduled';
                        const isPublished = plan.status === 'published';
                        const isDeletionRequested = plan.deletionRequested;
                        const requestedByMe = plan.deletionRequestedDeptId === currentDept.id;

                        return (
                          <div 
                            key={plan.id}
                            className={`p-4 sm:p-5 rounded-2xl bg-[#141C1E] border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                              isDeletionRequested
                                ? 'border-rose-500/50 bg-rose-950/15'
                                : 'border-white/5 hover:border-white/15'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              {/* Tags */}
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {/* Deletion banner if active */}
                                {isDeletionRequested ? (
                                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                                    <span>
                                      {requestedByMe 
                                        ? 'Ban bạn đã gửi yêu cầu xóa bài' 
                                        : `Yêu cầu xóa từ ${plan.deletionRequestedBy || 'Ban TT'}`}
                                    </span>
                                  </span>
                                ) : isPublished ? (
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    ✓ Đã Đăng Xong
                                  </span>
                                ) : isScheduled ? (
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                    Đã Lên Lịch Phát Sóng
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                    Chờ Ban TT Tiếp Nhận
                                  </span>
                                )}

                                {(plan.channels || []).map((ch, idx) => (
                                  <span key={idx} className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                                    {ch}
                                  </span>
                                ))}
                              </div>

                              {/* Title */}
                              <h4 className="text-base font-extrabold text-white leading-snug">
                                {plan.eventTitle}
                              </h4>

                              {/* Deletion reason highlight */}
                              {isDeletionRequested && plan.deletionReason && (
                                <p className="text-xs text-rose-300 font-medium mt-1 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                  <strong>Lý do xóa:</strong> {plan.deletionReason}
                                </p>
                              )}

                              {/* Summary */}
                              {plan.contentSummary && (
                                <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                                  {plan.contentSummary}
                                </p>
                              )}

                              {/* Meta */}
                              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                                <span className="flex items-center gap-1 text-slate-300">
                                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                                  <span>Dự kiến: {plan.scheduledDate} ({plan.scheduledTime || '19:30'})</span>
                                </span>

                                {plan.mediaAssignee && (
                                  <span className="text-emerald-400 font-medium">
                                    Phụ trách: {plan.mediaAssignee}
                                  </span>
                                )}

                                {plan.assetLink && (
                                  <a
                                    href={plan.assetLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-1 text-cyan-400 hover:underline"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    <span>Tư liệu Google Drive</span>
                                  </a>
                                )}
                              </div>
                            </div>

                            {/* Two-way Deletion Actions */}
                            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
                              {/* If someone requested deletion */}
                              {isDeletionRequested ? (
                                <>
                                  {requestedByMe ? (
                                    <button
                                      onClick={() => handleCancelDeletionRequest(plan.id)}
                                      className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold transition flex items-center gap-1"
                                      title="Rút lại yêu cầu xóa bài"
                                    >
                                      <RotateCcw className="w-3 h-3" />
                                      <span>Hủy Yêu Cầu Xóa</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleDeletePlan(plan.id, plan.eventTitle)}
                                      className="px-3.5 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs transition shadow-lg shadow-rose-500/25 flex items-center gap-1"
                                      title="Xác nhận đồng ý xóa bài này"
                                    >
                                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                                      <span>Xác Nhận Xóa Bỏ</span>
                                    </button>
                                  )}
                                </>
                              ) : (
                                /* Normal state: can request deletion or direct delete */
                                <button
                                  onClick={() => {
                                    setPlanForDeletionRequest(plan);
                                    setDeletionReasonInput('');
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition flex items-center gap-1"
                                  title="Gửi yêu cầu hủy hoặc xóa bài đăng này"
                                >
                                  <AlertTriangle className="w-3 h-3" />
                                  <span>Yêu Cầu Xóa Bài</span>
                                </button>
                              )}

                              <button
                                onClick={() => handleDeletePlan(plan.id, plan.eventTitle)}
                                className="p-2 text-slate-500 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition"
                                title="Xóa bài trực tiếp"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* Modal: Request Deletion Prompt */}
      {planForDeletionRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="w-full max-w-md bg-[#0E1416] border border-rose-500/30 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-sm">
                    Yêu Cầu Xóa Bài Truyền Thông
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Gửi thông báo tới Ban Truyền Thông & BCN cùng nắm bắt
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPlanForDeletionRequest(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <p className="text-xs text-slate-300">
                Bài viết: <strong className="text-white">{planForDeletionRequest.eventTitle}</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                Lý Do Yêu Cầu Xóa / Hủy Bài <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="VD: Trận đấu hoãn lại do thời tiết, hoặc thay đổi thể thức thi đấu..."
                value={deletionReasonInput}
                onChange={(e) => setDeletionReasonInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setPlanForDeletionRequest(null)}
                className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300 hover:bg-white/10 transition"
              >
                Hủy (Esc)
              </button>
              <button
                type="button"
                disabled={isSubmittingReason}
                onClick={handleConfirmDeletionRequest}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white font-extrabold text-xs transition shadow-lg shadow-rose-500/20 flex items-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>{isSubmittingReason ? 'Đang gửi...' : 'Gửi Yêu Cầu Xóa'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
