import React, { useState, useEffect } from 'react';
import { LotteryResultMB } from '../types/lottery';
import {
  Printer,
  Copy,
  Check,
  Calendar,
  MapPin,
  Maximize2,
  Minimize2,
  X,
  Clock,
} from 'lucide-react';
import { WaitingResultBanner } from './WaitingResultBanner';
import { TODAY_STR } from '../data/lotteryData';

interface ResultBoardMBProps {
  data: LotteryResultMB;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export const ResultBoardMB: React.FC<ResultBoardMBProps> = ({
  data,
  selectedDate,
  onDateChange,
}) => {
  const [displayMode, setDisplayMode] = useState<'full' | '2digits' | '3digits'>('full');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const formatNumber = (numStr: string) => {
    if (data.isPending) return numStr;
    if (displayMode === '2digits') return numStr.slice(-2);
    if (displayMode === '3digits') return numStr.slice(-3);
    return numStr;
  };

  const handleCopy = () => {
    const textToCopy = `[KẾT QUẢ XSMB NGÀY ${data.date}]
Đài: ${data.stationName}
${
  data.isPending
    ? 'Tình trạng: ĐANG CHỜ MỞ THƯỞNG (18h15)'
    : `Đặc Biệt: ${data.prizes.special.join(' - ')} (Mã: ${data.specialCodes.join(', ')})
Giải Nhất: ${data.prizes.first.join(' - ')}
Giải Nhì: ${data.prizes.second.join(' - ')}
Giải Ba: ${data.prizes.third.join(' - ')}
Giải Tư: ${data.prizes.fourth.join(' - ')}
Giải Năm: ${data.prizes.fifth.join(' - ')}
Giải Sáu: ${data.prizes.sixth.join(' - ')}
Giải Bảy: ${data.prizes.seventh.join(' - ')}`
}
Nguồn: Xổ số đây (xosoday.vn)`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const boardContent = (
    <div
      className={`bg-white ${
        isFullscreen
          ? 'rounded-2xl max-w-6xl w-full my-auto shadow-2xl border border-slate-700'
          : 'rounded-xl border border-slate-200 shadow-sm'
      } overflow-hidden`}
    >
      {/* Top Banner Header */}
      <div className="bg-slate-900 text-white px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
              Miền Bắc
            </span>
            <span className="text-slate-400 text-xs flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {data.stationName}
            </span>
            {data.isPending && (
              <span className="text-amber-400 text-xs font-semibold bg-amber-950/70 border border-amber-800 px-2 py-0.5 rounded flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Chờ quay 18:15
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            Xổ Số Kiến Thiết Miền Bắc (XSMB)
          </h2>
        </div>

        {/* Action Controls & Date picker */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 border border-slate-700">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleCopy}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            title="Sao chép kết quả"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={handlePrint}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            title="In kết quả"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Fullscreen icon button in header */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 cursor-pointer"
            title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-amber-400" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>

          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-2 text-slate-300 hover:text-white bg-red-900/60 hover:bg-red-800 rounded-lg transition-colors border border-red-700 cursor-pointer ml-1"
              title="Đóng toàn màn hình (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Waiting for Results Banner if date is pending / in the future */}
      {data.isPending && (
        <WaitingResultBanner
          regionName="Miền Bắc"
          stationName={data.stationName}
          dateStr={selectedDate}
          drawTime={data.drawTime || '18:15'}
          onGoToday={() => onDateChange(TODAY_STR)}
        />
      )}

      {/* Sub-bar: Display options and Special Codes */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">Mã ĐB trúng phụ:</span>
          {data.isPending ? (
            <span className="text-amber-800 bg-amber-100/90 border border-amber-300 px-2.5 py-0.5 rounded text-xs font-bold">
              Chờ mở thưởng lúc 18:15
            </span>
          ) : (
            <div className="flex gap-1.5 font-mono font-bold text-red-600">
              {data.specialCodes.map((code, idx) => (
                <span key={idx} className="bg-red-50 border border-red-200 px-2 py-0.5 rounded text-sm sm:text-base font-extrabold">
                  {code}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-200/80 p-0.5 rounded-lg">
          <button
            onClick={() => setDisplayMode('full')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              displayMode === 'full'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đầy đủ
          </button>
          <button
            onClick={() => setDisplayMode('2digits')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              displayMode === '2digits'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2 số cuối
          </button>
          <button
            onClick={() => setDisplayMode('3digits')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
              displayMode === '3digits'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3 số cuối
          </button>
        </div>
      </div>

      {/* Main Grid: Left is Prize Table, Right is Head/Tail Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
        {/* Left: Prize Table (8 cols on large screens) */}
        <div className="lg:col-span-8 overflow-x-auto">
          <table className="w-full text-center border-collapse">
            <tbody>
              {/* Giải Đặc Biệt */}
              <tr className="border-b border-slate-200 bg-red-50/50">
                <td className="w-24 sm:w-28 py-4 px-3 text-xs sm:text-sm font-bold text-red-700 bg-red-100/50 border-r border-slate-200">
                  Đặc Biệt
                </td>
                <td className="py-4 px-3">
                  {data.isPending ? (
                    <div className="flex items-center justify-center gap-3">
                      <span className="font-mono text-4xl sm:text-6xl font-black text-red-400/60 tracking-widest tabular-nums animate-pulse">
                        {data.prizes.special[0]}
                      </span>
                      <span className="text-xs px-2.5 py-1 bg-amber-100 text-amber-800 font-bold border border-amber-300 rounded-full shrink-0">
                        Chờ quay 18:15
                      </span>
                    </div>
                  ) : (
                    <span className="font-mono text-4xl sm:text-6xl font-black text-red-600 tracking-wider tabular-nums">
                      {formatNumber(data.prizes.special[0])}
                    </span>
                  )}
                </td>
              </tr>

              {/* Giải Nhất */}
              <tr className="border-b border-slate-100">
                <td className="py-3.5 px-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Giải Nhất
                </td>
                <td className="py-3.5 px-3">
                  <span className="font-mono text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-wide tabular-nums">
                    {formatNumber(data.prizes.first[0])}
                  </span>
                </td>
              </tr>

              {/* Giải Nhì */}
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <td className="py-3.5 px-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Giải Nhì
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center justify-around flex-wrap gap-3">
                    {data.prizes.second.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tracking-wide tabular-nums"
                      >
                        {formatNumber(num)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Giải Ba */}
              <tr className="border-b border-slate-100">
                <td className="py-3.5 px-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Giải Ba
                </td>
                <td className="py-3.5 px-3">
                  <div className="grid grid-cols-3 gap-y-2.5 gap-x-4">
                    {data.prizes.third.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-lg sm:text-2xl font-bold text-slate-800 tracking-wide tabular-nums"
                      >
                        {formatNumber(num)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Giải Tư */}
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <td className="py-3.5 px-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Giải Tư
                </td>
                <td className="py-3.5 px-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {data.prizes.fourth.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-lg sm:text-2xl font-bold text-slate-800 tracking-wide tabular-nums"
                      >
                        {formatNumber(num)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Giải Năm */}
              <tr className="border-b border-slate-100">
                <td className="py-3.5 px-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Giải Năm
                </td>
                <td className="py-3.5 px-3">
                  <div className="grid grid-cols-3 gap-y-2.5 gap-x-4">
                    {data.prizes.fifth.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-lg sm:text-2xl font-bold text-slate-800 tracking-wide tabular-nums"
                      >
                        {formatNumber(num)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Giải Sáu */}
              <tr className="border-b border-slate-100 bg-slate-50/30">
                <td className="py-3.5 px-3 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                  Giải Sáu
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center justify-around flex-wrap gap-3">
                    {data.prizes.sixth.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-xl sm:text-3xl font-extrabold text-slate-900 tracking-wide tabular-nums"
                      >
                        {formatNumber(num)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Giải Bảy */}
              <tr>
                <td className="py-3.5 px-3 text-xs sm:text-sm font-bold text-red-700 bg-red-50/60 border-r border-slate-200">
                  Giải Bảy
                </td>
                <td className="py-3.5 px-3 bg-red-50/20">
                  <div className="grid grid-cols-4 gap-2.5">
                    {data.prizes.seventh.map((num, i) => (
                      <span
                        key={i}
                        className="font-mono text-xl sm:text-3xl font-black text-red-600 tracking-wide tabular-nums"
                      >
                        {formatNumber(num)}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Right: Bảng Đầu - Đuôi Lô Tô (4 cols) */}
        <div className="lg:col-span-4 p-4 bg-slate-50/60">
          <div className="mb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
              Bảng Đầu - Đuôi Lô Tô
            </h3>
            <p className="text-[11px] text-slate-500">2 số cuối các giải thưởng</p>
          </div>

          {data.isPending && (
            <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-center text-xs text-amber-800 font-semibold">
              Đang chờ quay thưởng · Bảng sẽ tự động cập nhật khi có kết quả
            </div>
          )}

          <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden bg-white">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                <th className="py-1.5 px-2 w-14 text-center border-r border-slate-200">Đầu</th>
                <th className="py-1.5 px-2 text-left">Đuôi (2 số)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
                const tails = data.headTail.heads[digit] || [];
                return (
                  <tr key={digit} className="hover:bg-slate-50">
                    <td className="py-2 px-2 font-mono text-sm sm:text-base font-bold text-center text-slate-800 bg-slate-50 border-r border-slate-200">
                      {digit}
                    </td>
                    <td className="py-2 px-2 font-mono font-medium text-slate-700 tabular-nums">
                      {tails.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {tails.map((t, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-900 font-bold text-sm sm:text-base"
                            >
                              {digit}
                              <span className="text-red-600">{t}</span>
                            </span>
                          ))}
                        </div>
                      ) : data.isPending ? (
                        <span className="text-slate-400 font-mono text-xs">...</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Bar: Fullscreen / Minimize button at the bottom-right corner */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
        <span className="text-[11px] text-slate-500 font-medium">
          {isFullscreen
            ? '💡 Đang ở chế độ toàn màn hình · Nhấn ESC hoặc nút bên phải để thu nhỏ'
            : data.isPending
            ? `⏳ Đang ở chế độ chờ cập nhật kết quả kỳ quay ${data.date} (18h15)`
            : 'Xổ số kiến thiết Miền Bắc'}
        </span>

        {/* Nút phóng to / thu nhỏ ở góc dưới cùng bên phải */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-red-600 border border-slate-300 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
          title={isFullscreen ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-red-600" />
              <span>Thu nhỏ</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Phóng to toàn màn hình</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto flex items-start sm:items-center justify-center animate-in fade-in duration-150">
        {boardContent}
      </div>
    );
  }

  return boardContent;
};
