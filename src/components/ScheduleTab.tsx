import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

export const ScheduleTab: React.FC = () => {
  const [activeDay, setActiveDay] = useState<number>(new Date().getDay()); // 0: CN, 1: T2, ..., 6: T7

  const days = [
    { dayIndex: 1, label: 'Thứ Hai', short: 'T2' },
    { dayIndex: 2, label: 'Thứ Ba', short: 'T3' },
    { dayIndex: 3, label: 'Thứ Tư', short: 'T4' },
    { dayIndex: 4, label: 'Thứ Năm', short: 'T5' },
    { dayIndex: 5, label: 'Thứ Sáu', short: 'T6' },
    { dayIndex: 6, label: 'Thứ Bảy', short: 'T7' },
    { dayIndex: 0, label: 'Chủ Nhật', short: 'CN' },
  ];

  const scheduleData: Record<
    number,
    {
      mb: string;
      mn: string[];
      mt: string[];
      vietlott: string[];
    }
  > = {
    1: {
      mb: 'Hà Nội (Thủ Đô)',
      mn: ['TP. Hồ Chí Minh', 'Đồng Tháp', 'Cà Mau'],
      mt: ['Thừa Thiên Huế', 'Phú Yên'],
      vietlott: ['Keno (10 phút/kỳ)', 'Max 3D Pro'],
    },
    2: {
      mb: 'Quảng Ninh',
      mn: ['Bến Tre', 'Vũng Tàu', 'Bạc Liêu'],
      mt: ['Đắk Lắk', 'Quảng Nam'],
      vietlott: ['Power 6/55 (18h00)', 'Max 3D'],
    },
    3: {
      mb: 'Bắc Ninh',
      mn: ['Đồng Nai', 'Cần Thơ', 'Sóc Trăng'],
      mt: ['Đà Nẵng', 'Khánh Hòa'],
      vietlott: ['Mega 6/45 (18h00)', 'Max 3D Pro'],
    },
    4: {
      mb: 'Hà Nội (Thủ Đô)',
      mn: ['Tây Ninh', 'An Giang', 'Bình Thuận'],
      mt: ['Bình Định', 'Quảng Trị', 'Quảng Bình'],
      vietlott: ['Power 6/55 (18h00)', 'Max 3D'],
    },
    5: {
      mb: 'Hải Phòng',
      mn: ['Vĩnh Long', 'Bình Dương', 'Trà Vinh'],
      mt: ['Gia Lai', 'Ninh Thuận'],
      vietlott: ['Mega 6/45 (18h00)', 'Max 3D Pro'],
    },
    6: {
      mb: 'Nam Định',
      mn: ['TP. Hồ Chí Minh', 'Long An', 'Bình Phước', 'Hậu Giang'],
      mt: ['Đà Nẵng', 'Quảng Ngãi', 'Đắk Nông'],
      vietlott: ['Power 6/55 (18h00)', 'Max 3D'],
    },
    0: {
      mb: 'Thái Bình',
      mn: ['Tiền Giang', 'Kiên Giang', 'Đà Lạt (Lâm Đồng)'],
      mt: ['Khánh Hòa', 'Kon Tum', 'Thừa Thiên Huế'],
      vietlott: ['Mega 6/45 (18h00)', 'Max 3D Pro'],
    },
  };

  const currentSchedule = scheduleData[activeDay];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Lịch Mở Thưởng Xổ Số Toàn Quốc
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Thời gian và lịch quay số mở thưởng hàng tuần của 41 công ty XSKT 3 Miền và Xổ số điện toán Vietlott.
        </p>
      </div>

      {/* Day Selector Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs">
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((d) => (
            <button
              key={d.dayIndex}
              onClick={() => setActiveDay(d.dayIndex)}
              className={`py-2.5 sm:py-3 px-1 rounded-lg text-center transition-all cursor-pointer ${
                activeDay === d.dayIndex
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span className="block text-xs sm:text-sm">{d.label}</span>
              {new Date().getDay() === d.dayIndex && (
                <span className="inline-block mt-0.5 text-[9px] uppercase tracking-wider font-semibold opacity-90">
                  Hôm nay
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Detail for Selected Day */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Miền Nam */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">XSMN (Miền Nam)</span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                16:15
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {currentSchedule.mn.map((st, i) => (
                <li key={i} className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="font-medium">{st}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Cơ cấu 18 giải · ĐB 2 tỷ đồng
          </div>
        </div>

        {/* Miền Trung */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">XSMT (Miền Trung)</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                17:15
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {currentSchedule.mt.map((st, i) => (
                <li key={i} className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="font-medium">{st}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Cơ cấu 18 giải · ĐB 2 tỷ đồng
          </div>
        </div>

        {/* Miền Bắc */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">XSMB (Miền Bắc)</span>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                18:15
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span className="font-bold text-slate-900">{currentSchedule.mb}</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Quay thưởng tại Cung Văn Hóa TT Thanh Niên, số 1 Tăng Bạt Hổ, Hà Nội.
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Cơ cấu 27 giải · ĐB 1 tỷ/vé (3-4 tỷ)
          </div>
        </div>

        {/* Vietlott */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">Vietlott</span>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                18:00
              </span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              {currentSchedule.vietlott.map((vt, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span className="font-semibold">{vt}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Jackpot khởi điểm từ 12 tỷ - 30 tỷ VNĐ
          </div>
        </div>
      </div>
    </div>
  );
};
