import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { DEPARTMENTS } from '../../data/departments';
import { 
  updateMediaPlanStatus, 
  addEventToMediaCalendar, 
  updateMediaCalendarEvent,
  deleteMediaCalendarEvent 
} from '../../firebase/services';
import { triggerConfetti, playChime } from '../../utils/helpers';

export default function MediaHub({ 
  mediaPlans, 
  mediaCalendar, 
  currentDept, 
  onNotify,
  initialTab = 'inbox' 
}) {
  const isMediaDept = currentDept.id === 'truyen-thong';
  const isBCN = currentDept.id === 'bcn';

  const [activeTab, setActiveTab] = useState(initialTab); // 'inbox' | 'calendar'
  const [selectedPlanForSchedule, setSelectedPlanForSchedule] = useState(null);
  const [assigneeName, setAssigneeName] = useState('');
  const [calendarPostDate, setCalendarPostDate] = useState('');
  const [calendarPostTime, setCalendarPostTime] = useState('19:30');

  // New spontaneous calendar event form
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    channel: 'Fanpage CLB',
    deptName: 'Ban Truyền Thông',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    status: 'drafting', // 'drafting' | 'scheduled' | 'published'
  });

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
      onNotify(`Đã update bài đăng "${selectedPlanForSchedule.eventTitle}" lên Lịch Truyền Thông!`);
      setSelectedPlanForSchedule(null);
      setAssigneeName('');
    } catch (err) {
      console.error('Error scheduling media event:', err);
    }
  };

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
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {isMediaDept ? 'Ban Truyền Thông • Hub Điều Phối' : 'Giám Sát & Lịch Truyền Thông CLB'}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
              Kế Hoạch & Lịch Phát Sóng
            </span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            Trung Tâm Truyền Thông & Lịch Phát Sóng CLB
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tiếp nhận yêu cầu truyền thông từ 7 phân ban và lên lịch phát sóng Fanpage / TikTok
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1.5 rounded-2xl bg-[#0A0E10] border border-white/5 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-black shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarDays className="w-4 h-4" />
            <span>Lịch Phát Sóng Của Ban ({mediaCalendar.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: INBOX OF MEDIA PLANS */}
      {activeTab === 'inbox' && (
        <div className="card-sporty overflow-hidden">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base">
              Hộp Thư Tiếp Nhận Kế Hoạch Từ Các Phân Ban
            </h3>
            <span className="text-xs text-slate-400">
              Cả BCN & Ban Truyền Thông đều nhận được
            </span>
          </div>

          {mediaPlans.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Megaphone className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-300">Chưa có kế hoạch truyền thông nào được gửi lên</p>
              <p className="text-xs text-slate-500 mt-1">Các ban thành phần sẽ gửi kế hoạch bài đăng giải đấu tại đây.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {mediaPlans.map((plan) => {
                const isScheduled = plan.status === 'scheduled';

                return (
                  <div key={plan.id} className="p-5 hover:bg-white/[0.02] transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-slate-300">
                          {plan.deptName}
                        </span>

                        {isScheduled ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Đã Lên Lịch Đăng
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                            Mới Gửi Lên
                          </span>
                        )}

                        {plan.channels?.map((ch, idx) => (
                          <span key={idx} className="text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                            {ch}
                          </span>
                        ))}
                      </div>

                      <h4 className="text-base font-extrabold text-white leading-snug">
                        {plan.eventTitle}
                      </h4>

                      {plan.contentSummary && (
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {plan.contentSummary}
                        </p>
                      )}

                      <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-3.5 h-3.5 text-teal-400" />
                          Dự kiến: {plan.scheduledDate} ({plan.scheduledTime})
                        </span>

                        {plan.mediaAssignee && (
                          <span className="flex items-center gap-1 text-emerald-400 font-medium">
                            <User className="w-3.5 h-3.5" />
                            Phụ trách: {plan.mediaAssignee}
                          </span>
                        )}

                        {plan.assetLink && (
                          <a
                            href={plan.assetLink}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-teal-400 hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Drive tư liệu
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Ban Truyền Thông Actions */}
                    {isMediaDept && (
                      <div className="shrink-0">
                        {!isScheduled ? (
                          <button
                            onClick={() => {
                              setSelectedPlanForSchedule(plan);
                              setCalendarPostDate(plan.scheduledDate || '');
                              setCalendarPostTime(plan.scheduledTime || '19:30');
                            }}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-black font-extrabold text-xs hover:brightness-110 transition shadow-lg shadow-teal-500/20 flex items-center gap-1.5"
                          >
                            <CalendarDays className="w-4 h-4" />
                            <span>Update Lên Lịch Ban</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                            <CheckCircle2 className="w-4 h-4" />
                            Đã Trong Lịch Ban
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MEDIA BROADCAST CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base">
              Lịch Phát Sóng Truyền Thông Của Ban
            </h3>

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
                  Chọn "Update Lên Lịch Ban" từ tab Tiếp Nhận hoặc thêm bài đăng mới trực tiếp.
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
                            Xóa
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
          <div className="w-full max-w-md bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl">
            <h3 className="font-black text-white text-base mb-1">
              Update Lên Lịch Truyền Thông Của Ban
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
                  Hủy
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

      {/* Modal: Add Spontaneous Event to Calendar */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#0E1416] border border-white/10 rounded-3xl p-6 shadow-2xl">
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
                  Hủy
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
