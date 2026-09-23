import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Zap } from 'lucide-react';

export default function MiniSchedule({ onSelectEvent, onNavigateTimeline }) {
  const scheduleDays = [
    {
      date: '22/09',
      dayOfWeek: 'Thứ Ba',
      isToday: false,
      isPast: true,
      events: [
        {
          id: 'ev-1',
          title: 'Họp BCN thông qua điều lệ',
          time: '19:30 - 21:00',
          location: 'Phòng Hội đồng A',
          dept: 'Chuyên môn',
          color: 'emerald',
          status: 'Xong',
        }
      ]
    },
    {
      date: '23/09',
      dayOfWeek: 'Thứ Tư',
      isToday: true,
      isPast: false,
      events: [
        {
          id: 'ev-2',
          title: 'Test dàn đèn sân B & Chốt trọng tài',
          time: '14:00 - 17:30',
          location: 'Sân Cỏ Nhân Tạo',
          dept: 'Chuyên môn',
          color: 'emerald',
          status: 'Đang chạy',
        },
        {
          id: 'ev-3',
          title: 'Công bố Poster Khai Mạc Fanpage',
          time: '15:30',
          location: 'Online Fanpage',
          dept: 'Truyền thông',
          color: 'cyan',
          status: 'Hôm nay',
        }
      ]
    },
    {
      date: '24/09',
      dayOfWeek: 'Thứ Năm',
      isToday: false,
      isPast: false,
      events: [
        {
          id: 'ev-4',
          title: 'Lắp đặt Backdrop & Ký duyệt in cẩm nang',
          time: '08:30 - 11:00',
          location: 'Sảnh Sân Vận Động',
          dept: 'Hậu cần',
          color: 'amber',
          status: 'Ngày mai',
        }
      ]
    },
    {
      date: '25/09',
      dayOfWeek: 'Thứ Sáu',
      isToday: false,
      isPast: false,
      events: [
        {
          id: 'ev-5',
          title: 'LỄ KHAI MẠC GIẢI BÓNG ĐÁ DƯỢC OPEN 2026',
          time: '07:30 - 11:30',
          location: 'Sân Vận Động ĐH Dược',
          dept: 'Chuyên môn',
          color: 'emerald',
          isSpecial: true,
          status: 'Trọng điểm',
        }
      ]
    },
    {
      date: '26/09',
      dayOfWeek: 'Thứ Bảy',
      isToday: false,
      isPast: false,
      events: [
        {
          id: 'ev-6',
          title: 'Workshop Pickleball Nhập Môn K26',
          time: '08:00 - 11:00',
          location: 'Cụm Sân KTX',
          dept: 'Chuyên môn',
          color: 'emerald',
          status: 'Sắp tới',
        }
      ]
    },
    {
      date: '27/09',
      dayOfWeek: 'Chủ Nhật',
      isToday: false,
      isPast: false,
      events: [
        {
          id: 'ev-7',
          title: 'Lượt trận 2 Vòng Bảng Giải Bóng Đá',
          time: '15:00 - 19:30',
          location: 'Sân Cỏ Nhân Tạo',
          dept: 'Chuyên môn',
          color: 'emerald',
          status: 'Sắp tới',
        }
      ]
    },
    {
      date: '28/09',
      dayOfWeek: 'Thứ Hai',
      isToday: false,
      isPast: false,
      events: [
        {
          id: 'ev-8',
          title: 'Đóng đơn đợt 1 Tuyển CTV Gen 12',
          time: '23:59',
          location: 'Online Form',
          dept: 'Truyền thông',
          color: 'cyan',
          status: 'Hạn chót',
        }
      ]
    }
  ];

  return (
    <div className="card-sporty p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Lịch Tuần Thu Nhỏ (7 Ngày Tới)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Theo dõi các mốc sự kiện quan trọng của CLB từ 22/09 đến 28/09/2026
          </p>
        </div>

        <button
          onClick={onNavigateTimeline}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12181A] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition"
        >
          <span>Xem Dòng Thời Gian Đầy Đủ</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Days Strip Grid */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {scheduleDays.map((day, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 ${
              day.isToday
                ? 'bg-[#182629] border-2 border-emerald-400 shadow-lg shadow-emerald-500/20'
                : day.isPast
                ? 'bg-[#101517] border border-white/5 opacity-70'
                : 'bg-[#12181A] border border-white/[0.08] hover:border-white/20'
            }`}
          >
            {/* Day Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <div className="text-left">
                <p className="text-[11px] font-medium text-slate-400">{day.dayOfWeek}</p>
                <p className={`text-base font-extrabold ${day.isToday ? 'text-emerald-400' : 'text-white'}`}>
                  {day.date}
                </p>
              </div>
              {day.isToday && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-400 text-black uppercase tracking-wider animate-pulse">
                  HÔM NAY
                </span>
              )}
            </div>

            {/* Events of Day */}
            <div className="mt-2.5 space-y-2 flex-1">
              {day.events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => onSelectEvent(ev)}
                  className={`p-2.5 rounded-xl text-left cursor-pointer transition ${
                    ev.isSpecial
                      ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-400/50 hover:brightness-125'
                      : 'bg-[#162023] hover:bg-[#1C292D] border border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                      {ev.dept}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      ev.status === 'Xong' 
                        ? 'text-slate-400' 
                        : ev.status === 'Hôm nay' || ev.status === 'Đang chạy' || ev.status === 'Trọng điểm'
                        ? 'text-emerald-400' 
                        : 'text-amber-400'
                    }`}>
                      {ev.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
                    {ev.title}
                  </p>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{ev.time}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">{ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
