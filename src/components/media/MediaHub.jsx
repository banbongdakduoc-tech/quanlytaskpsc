import React, { useState, useEffect } from 'react';
import { 
  Megaphone, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Share2, 
  ExternalLink, 
  User, 
  Sparkles, 
  ArrowRight, 
  Filter, 
  Check, 
  Layers, 
  X,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Send,
  Zap,
  Radio,
  Eye
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { 
  updateMediaPlanStatus, 
  addEventToMediaCalendar, 
  updateMediaCalendarEvent, 
  deleteMediaCalendarEvent,
  deleteMediaPlan,
  requestDeleteMediaPlan,
  cancelDeleteMediaPlanRequest
} from '../../firebase/services';
import { getProgramColor, triggerConfetti, playChime } from '../../utils/helpers';
import { useModalKeyboard } from '../../hooks/useModalKeyboard';

export default function MediaHub({ 
  mediaPlans = [], 
  mediaCalendar = [], 
  programs = [],
  currentDept, 
  onNotify,
  initialTab = 'realtime',
  initialProgramFilter = 'all'
}) {
  const isMediaDept = currentDept.id === 'truyen-thong';
  const isBCN = currentDept.id === 'bcn';

  // 2 Phần chính: 'inbox' (Tiếp nhận kế hoạch) | 'calendar' (Lịch phát sóng)
  const [activeTab, setActiveTab] = useState(
    initialTab === 'calendar' ? 'calendar' : 'inbox'
  );

  // Chế độ xem trong phần Tiếp nhận kế hoạch: 'realtime' (Thời gian thực) | 'by_program' (Theo chương trình)
  const [inboxViewMode, setInboxViewMode] = useState(
    initialTab === 'by_program' ? 'by_program' : 'realtime'
  );

  const [selectedProgramFilter, setSelectedProgramFilter] = useState(initialProgramFilter);

  useEffect(() => {
    if (initialProgramFilter) {
      setSelectedProgramFilter(initialProgramFilter);
    }
  }, [initialProgramFilter]);

  // Schedule plan modal
  const [selectedPlanForSchedule, setSelectedPlanForSchedule] = useState(null);
  const [assigneeName, setAssigneeName] = useState('');
  const [calendarPostDate, setCalendarPostDate] = useState('');
  const [calendarPostTime, setCalendarPostTime] = useState('19:30');

  // Spontaneous calendar event modal
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    channel: 'Fanpage CLB',
    deptName: 'Ban Truyền Thông',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    status: 'drafting', // 'drafting' | 'scheduled' | 'published'
  });

  // Deletion request modal
  const [planForDeletionRequest, setPlanForDeletionRequest] = useState(null);
  const [deletionReasonInput, setDeletionReasonInput] = useState('');
  const [isSubmittingReason, setIsSubmittingReason] = useState(false);

  useModalKeyboard(!!selectedPlanForSchedule, () => setSelectedPlanForSchedule(null), () => {
    handleSchedulePlan();
  });
  useModalKeyboard(showAddEventModal, () => setShowAddEventModal(false));
  useModalKeyboard(!!planForDeletionRequest, () => setPlanForDeletionRequest(null));

  // Count items with pending deletion requests
  const deletionRequestedPlans = mediaPlans.filter(p => p.deletionRequested);

  // Group plans by program
  const programGroups = [];
  programs.forEach(p => {
    const plansInProgram = mediaPlans.filter(m => m.programId === p.id);
    if (plansInProgram.length > 0 || selectedProgramFilter === p.id) {
      programGroups.push({
        id: p.id,
        program: p,
        title: p.title,
        plans: plansInProgram
      });
    }
  });

  // Independent plans
  const independentPlans = mediaPlans.filter(m => !m.programId);
  if (independentPlans.length > 0) {
    programGroups.push({
      id: 'independent',
      program: null,
      title: 'Hoạt Động Thường Nhật & Bài Đăng Ngoài Chương Trình',
      plans: independentPlans
    });
  }

  // Filter plans for the Real-time tab
  const realtimePlans = mediaPlans.filter(p => {
    if (selectedProgramFilter === 'all') return true;
    if (selectedProgramFilter === 'independent') return !p.programId;
    return p.programId === selectedProgramFilter;
  });

  // 1. Schedule Plan Action
  const handleSchedulePlan = async () => {
    if (!selectedPlanForSchedule) return;

    try {
      const scheduledEvent = {
        title: selectedPlanForSchedule.eventTitle,
        planId: selectedPlanForSchedule.id,
        deptName: selectedPlanForSchedule.deptName,
        channel: selectedPlanForSchedule.channels?.[0] || 'Fanpage CLB',
        date: calendarPostDate || selectedPlanForSchedule.scheduledDate || new Date().toISOString().split('T')[0],
        time: calendarPostTime || selectedPlanForSchedule.scheduledTime || '19:30',
        assignee: assigneeName.trim() || 'Ban Truyền Thông',
        status: 'scheduled',
      };

      await addEventToMediaCalendar(scheduledEvent);
      await updateMediaPlanStatus(selectedPlanForSchedule.id, {
        status: 'scheduled',
        mediaAssignee: assigneeName.trim() || 'Ban Truyền Thông',
        scheduledDate: scheduledEvent.date,
        scheduledTime: scheduledEvent.time,
      });

      triggerConfetti();
      playChime('success');
      onNotify(`Đã tiếp nhận và lên lịch bài đăng "${selectedPlanForSchedule.eventTitle}"!`);
      setSelectedPlanForSchedule(null);
      setAssigneeName('');
    } catch (err) {
      console.error('Error scheduling media event:', err);
    }
  };

  // 2. Direct Deletion Action (Two-way)
  const handleDeletePlan = async (planId, planTitle) => {
    if (window.confirm(`Xóa vĩnh viễn kế hoạch truyền thông "${planTitle}"? Cả ban gửi và Ban Truyền Thông sẽ không còn thấy bài này.`)) {
      try {
        await deleteMediaPlan(planId);
        playChime('click');
        onNotify('Đã xóa bài truyền thông khỏi hệ thống.');
      } catch (err) {
        console.error('Error deleting media plan:', err);
        alert('Lỗi xóa bài: ' + err.message);
      }
    }
  };

  // 3. Request Deletion Action (Two-way)
  const handleConfirmDeletionRequest = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!planForDeletionRequest) return;
    if (!deletionReasonInput.trim()) {
      alert('Vui lòng nhập lý do xóa / hủy bài!');
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
      onNotify(`Đã gửi yêu cầu xóa bài "${planForDeletionRequest.eventTitle}"!`);
      setPlanForDeletionRequest(null);
      setDeletionReasonInput('');
    } catch (err) {
      console.error('Error requesting deletion:', err);
      alert('Lỗi gửi yêu cầu: ' + err.message);
    } finally {
      setIsSubmittingReason(false);
    }
  };

  // 4. Cancel Deletion Request
  const handleCancelDeletionRequest = async (planId) => {
    try {
      await cancelDeleteMediaPlanRequest(planId);
      playChime('click');
      onNotify('Đã thu hồi yêu cầu xóa bài.');
    } catch (err) {
      console.error('Error canceling deletion request:', err);
    }
  };

  // 5. Spontaneous Event Creation in Calendar
  const handleCreateSpontaneousEvent = async (e) => {
    e.preventDefault();
    if (!eventFormData.title.trim()) return;

    try {
      await addEventToMediaCalendar(eventFormData);
      triggerConfetti();
      playChime('success');
      onNotify('Đã thêm bài đăng mới vào Lịch Truyền Thông!');
      setShowAddEventModal(false);
      setEventFormData({
        title: '',
        channel: 'Fanpage CLB',
        deptName: 'Ban Truyền Thông',
        date: new Date().toISOString().split('T')[0],
        time: '19:30',
        status: 'drafting',
      });
    } catch (err) {
      console.error('Error adding calendar event:', err);
    }
  };

  // 6. Update Calendar Event Status
  const handleUpdateEventStatus = async (eventId, newStatus) => {
    try {
      await updateMediaCalendarEvent(eventId, { status: newStatus });
      playChime('click');
      if (newStatus === 'published') {
        triggerConfetti();
        onNotify('Bài viết đã được đăng tải thành công!');
      }
    } catch (err) {
      console.error('Error updating event status:', err);
    }
  };

  // 7. Delete Calendar Event
  const handleDeleteCalendarEvent = async (eventId) => {
    if (window.confirm('Xóa lịch đăng này?')) {
      try {
        await deleteMediaCalendarEvent(eventId);
        onNotify('Đã xóa khỏi lịch truyền thông.');
      } catch (err) {
        console.error('Error deleting calendar event:', err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#141C1E] border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
              {isMediaDept ? 'Ban Truyền Thông' : 'Truyền Thông CLB'}
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Kế Hoạch & Lịch Phát Sóng Truyền Thông
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tiếp nhận bài đăng từ các ban và quản lý lịch đăng Fanpage, TikTok.
          </p>
        </div>

        {/* 2 Main Section Tabs */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#0A0E10] border border-white/5 self-start sm:self-center overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'inbox'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Tiếp Nhận Kế Hoạch ({mediaPlans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Lịch Phát Sóng ({mediaCalendar.length})</span>
          </button>
        </div>
      </div>

      {/* Alert Banner: Deletion Requests Alert */}
      {deletionRequestedPlans.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#1F0C10] to-[#17090C] border-2 border-rose-500/40 flex items-center justify-between gap-3 animate-pulse-subtle">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black text-rose-300">
                Có {deletionRequestedPlans.length} bài đăng đang có yêu cầu xóa / hủy cần xử lý
              </p>
              <p className="text-[11px] text-rose-200/70">
                Xem chi tiết bên dưới để xác nhận xóa bỏ hoặc từ chối giữ lại bài
              </p>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 shrink-0">
            Cần lưu ý
          </span>
        </div>
      )}

      {/* Program Filter Bar & View Mode Toggle (for Inbox Section) */}
      {activeTab === 'inbox' && (
        <div className="p-3.5 rounded-2xl bg-[#12181A] border border-white/5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-teal-400" />
              <span>Sự kiện:</span>
            </span>

            <button
              onClick={() => setSelectedProgramFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition border ${
                selectedProgramFilter === 'all'
                  ? 'bg-teal-500 text-black border-teal-400 font-bold'
                  : 'bg-[#141C1E] text-slate-400 border-white/5 hover:text-white'
              }`}
            >
              Tất cả ({mediaPlans.length})
            </button>

            {programs.map((p) => {
              const pCount = mediaPlans.filter(m => m.programId === p.id).length;
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

          {/* Sub-view mode switcher: Realtime Stream vs By Program */}
          <div className="flex items-center gap-1 p-1 bg-[#0A0E10] border border-white/5 rounded-xl">
            <button
              type="button"
              onClick={() => setInboxViewMode('realtime')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                inboxViewMode === 'realtime'
                  ? 'bg-teal-500 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Thời Gian Thực</span>
            </button>
            <button
              type="button"
              onClick={() => setInboxViewMode('by_program')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                inboxViewMode === 'by_program'
                  ? 'bg-teal-500 text-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Theo Chương Trình</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1A: REAL-TIME OVERVIEW STREAM                                             */}
      {/* ========================================================================= */}
      {activeTab === 'inbox' && inboxViewMode === 'realtime' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Danh Sách Bài Đăng Theo Thời Gian Thực</span>
              </h3>
              <p className="text-xs text-slate-400">
                Mỗi sự kiện có mã màu riêng biệt để phân biệt rõ ràng.
              </p>
            </div>

            <span className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-xl">
              {realtimePlans.length} bài đăng
            </span>
          </div>

          {realtimePlans.length === 0 ? (
            <div className="card-sporty p-12 text-center text-slate-500">
              <Megaphone className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-300">Không có bài đăng nào trong bộ lọc này</p>
              <p className="text-xs text-slate-500 mt-1">Các bài đăng từ các phân ban sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {realtimePlans.map((plan) => {
                const color = getProgramColor(plan.programId, plan.programTitle);
                const isScheduled = plan.status === 'scheduled';
                const isPublished = plan.status === 'published';
                const isDeletionRequested = plan.deletionRequested;
                const requestedByMe = plan.deletionRequestedDeptId === currentDept.id;

                return (
                  <div
                    key={plan.id}
                    className={`rounded-2xl border bg-[#141C1E] p-5 flex flex-col justify-between transition group shadow-lg ${color.border} ${color.glow} ${
                      isDeletionRequested ? 'border-rose-500/60 bg-rose-950/20' : ''
                    }`}
                  >
                    <div>
                      {/* Top Badges: Program Color Tag & Source Dept */}
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-2.5">
                        {/* Event Distinct Color Tag */}
                        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${color.badge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${color.dot}`}></span>
                          <span className="truncate max-w-[170px]">
                            {plan.programTitle || 'Ngoài Chương Trình'}
                          </span>
                        </div>

                        {/* Source Department */}
                        <span className="text-[11px] font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded">
                          {plan.deptName}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-base font-extrabold text-white leading-snug group-hover:text-teal-300 transition">
                        {plan.eventTitle}
                      </h4>

                      {/* Deletion Warning if Requested */}
                      {isDeletionRequested && (
                        <div className="mt-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300">
                          <p className="font-bold flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                            <span>Yêu cầu xóa từ: {plan.deletionRequestedBy || plan.deptName}</span>
                          </p>
                          {plan.deletionReason && (
                            <p className="text-[11px] text-rose-200 mt-0.5">
                              Lý do: "{plan.deletionReason}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Summary */}
                      {plan.contentSummary && (
                        <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {plan.contentSummary}
                        </p>
                      )}

                      {/* Schedule Meta & Channels */}
                      <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1.5 text-xs text-slate-400">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1 text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-teal-400" />
                            <span>{plan.scheduledDate} ({plan.scheduledTime || '19:30'})</span>
                          </span>

                          {/* Status Pill */}
                          {isDeletionRequested ? (
                            <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                              Đang Yêu Cầu Xóa
                            </span>
                          ) : isPublished ? (
                            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                              Đã Đăng
                            </span>
                          ) : isScheduled ? (
                            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                              Đã Lên Lịch
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                              Chờ Tiếp Nhận
                            </span>
                          )}
                        </div>

                        {/* Channels */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {(plan.channels || []).map((ch, idx) => (
                            <span key={idx} className="text-[9px] text-teal-400 bg-teal-500/10 px-1.5 py-0.2 rounded border border-teal-500/20">
                              {ch}
                            </span>
                          ))}
                        </div>

                        {/* Drive asset link */}
                        {plan.assetLink && (
                          <div className="pt-1">
                            <a
                              href={plan.assetLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:underline text-[11px] flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>Link Drive tư liệu</span>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      {/* Left: Schedule button if Media Dept */}
                      {isMediaDept && (
                        <div>
                          {!isScheduled ? (
                            <button
                              onClick={() => {
                                setSelectedPlanForSchedule(plan);
                                setCalendarPostDate(plan.scheduledDate || '');
                                setCalendarPostTime(plan.scheduledTime || '19:30');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-extrabold text-[11px] hover:brightness-110 transition shadow flex items-center gap-1"
                            >
                              <CalendarDays className="w-3.5 h-3.5" />
                              <span>Lên Lịch Ban</span>
                            </button>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Đã Lên Lịch</span>
                            </span>
                          )}
                        </div>
                      )}

                      {/* Right: Deletion or Request Deletion (Two-way) */}
                      <div className="flex items-center gap-1.5 ml-auto">
                        {isDeletionRequested ? (
                          <>
                            {requestedByMe ? (
                              <button
                                onClick={() => handleCancelDeletionRequest(plan.id)}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-semibold transition"
                                title="Rút lại yêu cầu xóa bài"
                              >
                                Hủy Yêu Cầu
                              </button>
                            ) : (
                              <button
                                onClick={() => handleDeletePlan(plan.id, plan.eventTitle)}
                                className="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-[10px] transition shadow flex items-center gap-1"
                                title="Xác nhận đồng ý xóa bài này"
                              >
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>Xác Nhận Xóa</span>
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => {
                              setPlanForDeletionRequest(plan);
                              setDeletionReasonInput('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-semibold transition border border-rose-500/20"
                            title="Yêu cầu xóa bài gửi tới hai bên"
                          >
                            Yêu Cầu Xóa
                          </button>
                        )}

                        <button
                          onClick={() => handleDeletePlan(plan.id, plan.eventTitle)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                          title="Xóa bài trực tiếp"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1B: GROUPED BY PROGRAM                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'inbox' && inboxViewMode === 'by_program' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <span>Kế Hoạch Gom Theo Chương Trình</span>
              </h3>
              <p className="text-xs text-slate-400">
                Theo dõi bài viết đã tiếp nhận và bài đang chờ xử lý theo từng sự kiện.
              </p>
            </div>
          </div>

          {programGroups.length === 0 ? (
            <div className="card-sporty p-12 text-center text-slate-500">
              <Layers className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-300">Chưa có chương trình nào có bài truyền thông</p>
            </div>
          ) : (
            programGroups
              .filter(grp => selectedProgramFilter === 'all' || selectedProgramFilter === grp.id)
              .map(grp => {
                const color = getProgramColor(grp.program?.id, grp.title);
                const plansInGrp = grp.plans;
                const acceptedPlans = plansInGrp.filter(p => p.status === 'scheduled' || p.status === 'published');
                const pendingPlans = plansInGrp.filter(p => p.status !== 'scheduled' && p.status !== 'published');

                return (
                  <div
                    key={grp.id}
                    className={`rounded-3xl border bg-[#101517] p-5 sm:p-6 transition ${color.border} ${color.glow}`}
                  >
                    {/* Program Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-white/5">
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3.5 h-3.5 rounded-full ${color.dot} shrink-0`}></span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-black text-white tracking-tight">
                              {grp.title}
                            </h3>
                            <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${color.badge}`}>
                              {acceptedPlans.length} Đã tiếp nhận • {pendingPlans.length} Chờ xử lý
                            </span>
                          </div>
                          {grp.program && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              Ban chủ trì: <strong className="text-emerald-400">{grp.program.leadDeptName}</strong>
                              {grp.program.location && ` • ${grp.program.location}`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Plans in program */}
                    {plansInGrp.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2 text-center">
                        Chưa có bài truyền thông nào cho chương trình này.
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
                              className={`p-4 rounded-2xl bg-[#141C1E] border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                isDeletionRequested
                                  ? 'border-rose-500/50 bg-rose-950/15'
                                  : 'border-white/5 hover:border-white/15'
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                                    {plan.deptName}
                                  </span>

                                  {isDeletionRequested ? (
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                      ⚠️ Yêu Cầu Xóa: {plan.deletionRequestedBy || plan.deptName}
                                    </span>
                                  ) : isPublished ? (
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                      ✓ Đã Đăng
                                    </span>
                                  ) : isScheduled ? (
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                                      Đã Lên Lịch Ban
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                      Mới Gửi Lên
                                    </span>
                                  )}

                                  {(plan.channels || []).map((ch, idx) => (
                                    <span key={idx} className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                                      {ch}
                                    </span>
                                  ))}
                                </div>

                                <h4 className="text-base font-extrabold text-white leading-snug">
                                  {plan.eventTitle}
                                </h4>

                                {isDeletionRequested && plan.deletionReason && (
                                  <p className="text-xs text-rose-300 font-medium mt-1 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                    <strong>Lý do xóa:</strong> {plan.deletionReason}
                                  </p>
                                )}

                                {plan.contentSummary && (
                                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                                    {plan.contentSummary}
                                  </p>
                                )}

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
                                      className="text-cyan-400 hover:underline flex items-center gap-1"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Drive tư liệu</span>
                                    </a>
                                  )}
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-wrap items-center gap-2 shrink-0 self-start md:self-center">
                                {isMediaDept && !isScheduled && (
                                  <button
                                    onClick={() => {
                                      setSelectedPlanForSchedule(plan);
                                      setCalendarPostDate(plan.scheduledDate || '');
                                      setCalendarPostTime(plan.scheduledTime || '19:30');
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-extrabold text-xs hover:brightness-110 transition shadow flex items-center gap-1"
                                  >
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    <span>Tiếp Nhận & Lên Lịch</span>
                                  </button>
                                )}

                                {isDeletionRequested ? (
                                  <>
                                    {requestedByMe ? (
                                      <button
                                        onClick={() => handleCancelDeletionRequest(plan.id)}
                                        className="px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 text-xs font-semibold"
                                      >
                                        Hủy Yêu Cầu
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => handleDeletePlan(plan.id, plan.eventTitle)}
                                        className="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-extrabold text-xs shadow flex items-center gap-1"
                                      >
                                        <Check className="w-3 h-3 stroke-[3]" />
                                        <span>Xác Nhận Xóa</span>
                                      </button>
                                    )}
                                  </>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setPlanForDeletionRequest(plan);
                                      setDeletionReasonInput('');
                                    }}
                                    className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold"
                                  >
                                    Yêu Cầu Xóa
                                  </button>
                                )}

                                <button
                                  onClick={() => handleDeletePlan(plan.id, plan.eventTitle)}
                                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg"
                                  title="Xóa bài"
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
              })
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2: MEDIA BROADCAST CALENDAR                                               */}
      {/* ========================================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">
                Lịch Phát Sóng Truyền Thông
              </h3>
              <p className="text-xs text-slate-400">
                Timeline các bài viết đã hẹn giờ và phát sóng lên Fanpage, TikTok.
              </p>
            </div>

            {isMediaDept && (
              <button
                onClick={() => setShowAddEventModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-bold text-xs transition shadow-lg shadow-teal-500/20"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Bài Đăng Mới</span>
              </button>
            )}
          </div>

          <div className="card-sporty overflow-hidden">
            {mediaCalendar.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <CalendarDays className="w-12 h-12 mx-auto text-slate-600 mb-2" />
                <p className="text-sm font-bold text-slate-300">Lịch truyền thông hiện đang trống</p>
                <p className="text-xs text-slate-500 mt-1">
                  Chọn "Tiếp Nhận & Lên Lịch" từ tab bài đăng hoặc thêm bài mới trực tiếp.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {mediaCalendar.map((ev) => {
                  const isPublished = ev.status === 'published';
                  const isScheduled = ev.status === 'scheduled';

                  return (
                    <div key={ev.id} className="p-5 hover:bg-white/[0.02] transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-xs font-black text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                            {ev.channel}
                          </span>

                          <span className="text-xs font-semibold text-slate-400">
                            Nguồn: {ev.deptName}
                          </span>

                          {isPublished ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Đã Đăng Xong
                            </span>
                          ) : isScheduled ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                              Đã Lên Lịch Hẹn Giờ
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              Đang Chuẩn Bị Content
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-extrabold text-white">
                          {ev.title}
                        </h4>

                        <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1.5 text-slate-200">
                            <Clock className="w-3.5 h-3.5 text-teal-400" />
                            {ev.date} lúc {ev.time}
                          </span>

                          {ev.assignee && (
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-slate-500" />
                              Phụ trách: {ev.assignee}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status changer buttons */}
                      {isMediaDept && (
                        <div className="flex items-center gap-2 shrink-0">
                          {ev.status !== 'published' ? (
                            <button
                              onClick={() => handleUpdateEventStatus(ev.id, 'published')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Đánh dấu Đã Đăng</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateEventStatus(ev.id, 'scheduled')}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs transition"
                            >
                              Hẹn giờ lại
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteCalendarEvent(ev.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition"
                            title="Xóa khỏi lịch"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Schedule a Media Plan onto the Calendar */}
      {selectedPlanForSchedule && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="w-full max-w-md bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-black text-white text-base mb-1">
              Tiếp Nhận & Lên Lịch Truyền Thông
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Chiến dịch: <strong>{selectedPlanForSchedule.eventTitle}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Nhân Sự Ban Truyền Thông Phụ Trách
                </label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn A (Content Lead)..."
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Ngày Phát Sóng Chính Thức
                </label>
                <input
                  type="date"
                  value={calendarPostDate}
                  onChange={(e) => setCalendarPostDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Khung Giờ Đăng Bài
                </label>
                <input
                  type="text"
                  placeholder="VD: 19:30"
                  value={calendarPostTime}
                  onChange={(e) => setCalendarPostTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlanForSchedule(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300"
                >
                  Hủy (Esc)
                </button>
                <button
                  type="button"
                  onClick={handleSchedulePlan}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs transition"
                >
                  Xác Nhận Lên Lịch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Request Deletion Prompt (Two-way) */}
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
                    Yêu Cầu Xóa / Hủy Bài Truyền Thông
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Gửi thông báo tới Ban {planForDeletionRequest.deptName} cùng nắm bắt
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
                Lý Do Yêu Cầu Xóa <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="VD: Trùng lịch phát sóng, bài đăng không đúng format ảnh, ban chủ trì xin hoãn..."
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

      {/* Modal: Add Spontaneous Event to Calendar */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div 
            className="w-full max-w-md bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-black text-white text-base mb-1">
              Thêm Bài Đăng Mới Vào Lịch Truyền Thông
            </h3>
            <p className="text-xs text-slate-400 mb-4">Lịch phát sóng nội bộ của Ban Truyền Thông</p>

            <form onSubmit={handleCreateSpontaneousEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase mb-1">
                  Tiêu Đề Bài Viết
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Recap hình ảnh trận chung kết Pickleball..."
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Kênh Đăng
                  </label>
                  <select
                    value={eventFormData.channel}
                    onChange={(e) => setEventFormData({ ...eventFormData, channel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="Fanpage CLB">Fanpage CLB</option>
                    <option value="TikTok Thể Thao">TikTok Thể Thao</option>
                    <option value="Story Instagram">Story Instagram</option>
                    <option value="Bàn Sảnh A">Bàn Sảnh A</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Trạng Thái
                  </label>
                  <select
                    value={eventFormData.status}
                    onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none"
                  >
                    <option value="drafting">Đang soạn content</option>
                    <option value="scheduled">Đã hẹn giờ</option>
                    <option value="published">Đã đăng</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Ngày Đăng
                  </label>
                  <input
                    type="date"
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase mb-1">
                    Giờ Đăng
                  </label>
                  <input
                    type="text"
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#141C1E] border border-white/10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-slate-300"
                >
                  Hủy (Esc)
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-black font-extrabold text-xs transition"
                >
                  Lưu Vào Lịch Ban
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
