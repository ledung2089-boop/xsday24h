import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Sparkles, Calendar, AlertCircle, Loader2 } from 'lucide-react';

interface WaitingResultBannerProps {
  regionName: string;
  stationName: string;
  dateStr: string;
  drawTime?: string;
  onRefresh?: () => void;
  onGoToday?: () => void;
}

export const WaitingResultBanner: React.FC<WaitingResultBannerProps> = ({
  regionName,
  stationName,
  dateStr,
  drawTime = '18:15',
  onRefresh,
  onGoToday,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });

  useEffect(() => {
    const calculateTime = () => {
      try {
        const [hourStr, minStr] = drawTime.split(':');
        const targetIso = `${dateStr}T${(hourStr || '18').padStart(2, '0')}:${(minStr || '15').padStart(2, '0')}:00+07:00`;
        const targetTime = new Date(targetIso).getTime();
        const now = Date.now();
        const diff = Math.floor((targetTime - now) / 1000);

        if (diff <= 0) {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        } else {
          const days = Math.floor(diff / 86400);
          const hours = Math.floor((diff % 86400) / 3600);
          const minutes = Math.floor((diff % 3600) / 60);
          const seconds = diff % 60;
          setTimeLeft({ days, hours, minutes, seconds, isPast: false });
        }
      } catch {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [dateStr, drawTime]);

  const formattedDate = React.useMemo(() => {
    try {
      const d = new Date(dateStr);
      const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const dayName = daysOfWeek[d.getDay()] || '';
      const [year, month, day] = dateStr.split('-');
      return `${dayName}, ngày ${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  }, [dateStr]);

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200 p-4 sm:p-5">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Status info */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center justify-center p-1 bg-amber-100 border border-amber-300 rounded-full shadow-2xs">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-2xs">
              <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
              Chế Độ Chờ Cập Nhật Kết Quả
            </span>
            <span className="text-xs text-amber-700 font-semibold flex items-center gap-1 bg-white/80 border border-amber-200 px-2.5 py-0.5 rounded-full">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              Mở thưởng lúc {drawTime}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Kỳ quay: {formattedDate}</span>
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed">
            Kỳ quay số của <strong>{stationName}</strong> chưa diễn ra hoặc đang trong quá trình chuẩn bị mở thưởng. Hệ thống sẽ tự động cập nhật kết quả từng giải ngay khi hội đồng xổ số bắt đầu quay.
          </p>
        </div>

        {/* Right: Countdown Boxes */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          {!timeLeft.isPast ? (
            <div className="flex flex-col gap-1.5 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-800">
                <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
                <span>Đếm ngược đến giờ mở thưởng:</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white p-2 sm:p-2.5 rounded-xl border border-amber-200 shadow-2xs">
              <div className="flex flex-col items-center justify-center bg-amber-50 rounded-lg px-2.5 py-1 min-w-[50px] border border-amber-100">
                <span className="font-mono text-base sm:text-xl font-black text-amber-700 tabular-nums">
                  {String(timeLeft.days).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-amber-800 uppercase">Ngày</span>
              </div>
              <span className="font-bold text-amber-400">:</span>
              <div className="flex flex-col items-center justify-center bg-amber-50 rounded-lg px-2.5 py-1 min-w-[50px] border border-amber-100">
                <span className="font-mono text-base sm:text-xl font-black text-amber-700 tabular-nums">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-amber-800 uppercase">Giờ</span>
              </div>
              <span className="font-bold text-amber-400">:</span>
              <div className="flex flex-col items-center justify-center bg-amber-50 rounded-lg px-2.5 py-1 min-w-[50px] border border-amber-100">
                <span className="font-mono text-base sm:text-xl font-black text-amber-700 tabular-nums">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-amber-800 uppercase">Phút</span>
              </div>
              <span className="font-bold text-amber-400">:</span>
              <div className="flex flex-col items-center justify-center bg-amber-50 rounded-lg px-2.5 py-1 min-w-[50px] border border-amber-100">
                <span className="font-mono text-base sm:text-xl font-black text-amber-700 tabular-nums">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] font-bold text-amber-800 uppercase">Giây</span>
              </div>
            </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl text-emerald-800 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span>Đang trong khung giờ quay thưởng · Đang nhận dữ liệu</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {onGoToday && (
              <button
                onClick={onGoToday}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap shadow-2xs"
              >
                Về hôm nay
              </button>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 bg-white hover:bg-amber-100/60 text-slate-700 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                title="Làm mới kiểm tra kết quả"
              >
                <RefreshCw className="w-4 h-4 text-amber-700" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
