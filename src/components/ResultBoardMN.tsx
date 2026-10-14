import React, { useState, useEffect } from 'react';
import { LotteryResultMNMT } from '../types/lottery';
import {
  Calendar,
  Printer,
  Copy,
  Check,
  MapPin,
  Maximize2,
  Minimize2,
  X,
  Clock,
  Loader2,
} from 'lucide-react';
import { WaitingResultBanner } from './WaitingResultBanner';
import { TODAY_STR } from '../data/lotteryData';

interface ResultBoardMNProps {
  data: LotteryResultMNMT;
  selectedDate: string;
  onDateChange: (date: string) => void;
  title: string;
}

export const ResultBoardMN: React.FC<ResultBoardMNProps> = ({
  data,
  selectedDate,
  onDateChange,
  title,
}) => {
  const [copied, setCopied] = useState(false);
  const [displayMode, setDisplayMode] = useState<'full' | '2digits'>('full');
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
    return numStr;
  };

  const renderPrizeNumber = (
    num: string,
    isStationPending?: boolean,
    customColor: string = 'text-slate-900'
  ) => {
    const isPending = Boolean(data.isPending || isStationPending || !num || /^[-–—\s]+$/.test(num));
    if (isPending) {
      return (
        <span className="inline-flex items-center justify-center text-amber-500 py-1" title="Đang chờ quay & cập nhật">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-amber-500 shrink-0" />
        </span>
      );
    }
    return (
      <span
        className={`font-mono text-3xl sm:text-5xl font-black tracking-wide tabular-nums ${customColor}`}
      >
        {formatNumber(num)}
      </span>
    );
  };

  const handleCopy = () => {
    const textToCopy = `[KẾT QUẢ ${title.toUpperCase()} NGÀY ${data.date}]
Các đài: ${data.stations.map((s) => s.stationName).join(', ')}
${
  data.isPending
    ? `Tình trạng: ĐANG CHỜ MỞ THƯỞNG (${data.drawTime || (data.region === 'MN' ? '16:15' : '17:15')})`
    : data.stations
        .map(
          (s) =>
            `--- ${s.stationName} ---
Đặc Biệt: ${s.prizes.special.join(' - ')}
Giải Nhất: ${s.prizes.first.join(' - ')}
Giải Nhì: ${s.prizes.second.join(' - ')}
Giải Tám: ${s.prizes.eighth.join(' - ')}`
        )
        .join('\n')
}
Nguồn: Xổ số đây (xosoday.vn)`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const defaultDrawTime = data.drawTime || (data.region === 'MN' ? '16:15' : '17:15');

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
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                data.region === 'MN'
                  ? 'text-amber-400 bg-amber-950/60 border-amber-800'
                  : 'text-emerald-400 bg-emerald-950/60 border-emerald-800'
              }`}
            >
              {data.region === 'MN' ? 'Miền Nam (16h15)' : 'Miền Trung (17h15)'}
            </span>
            <span className="text-slate-400 text-xs">
              {data.stations.length} đài mở thưởng
            </span>
            {data.isPending && (
              <span className="text-amber-400 text-xs font-semibold bg-amber-950/70 border border-amber-800 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                Chờ quay {defaultDrawTime}
              </span>
            )}
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {title} ({data.region === 'MN' ? 'XSMN' : 'XSMT'})
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
          regionName={data.region === 'MN' ? 'Miền Nam' : 'Miền Trung'}
          stationName={data.stations.map((s) => s.stationName).join(', ')}
          dateStr={selectedDate}
          drawTime={defaultDrawTime}
          onGoToday={() => onDateChange(TODAY_STR)}
        />
      )}

      {/* Sub-bar options */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>Đài quay: {data.stations.map((s) => s.stationName).join(' · ')}</span>
        </div>

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
        </div>
      </div>

      {/* Main Table: Multi-station columns */}
      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-slate-100/80 text-slate-800 border-b border-slate-200 text-xs sm:text-sm font-bold">
              <th className="w-20 sm:w-28 py-3 px-2 border-r border-slate-200">Giải</th>
              {data.stations.map((station) => (
                <th
                  key={station.stationId}
                  className="py-3 px-3 border-r border-slate-200 last:border-r-0 text-red-700 font-bold"
                >
                  {station.stationName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {/* Giải Tám */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-2 font-bold text-red-600 bg-red-50/40 border-r border-slate-200">
                Giải Tám
              </td>
              {data.stations.map((station) => (
                <td
                  key={station.stationId}
                  className="py-3 px-2 border-r border-slate-200 last:border-r-0"
                >
                  {renderPrizeNumber(station.prizes.eighth[0], station.isPending, 'text-red-600')}
                </td>
              ))}
            </tr>

            {/* Giải Bảy */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-2 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                Giải Bảy
              </td>
              {data.stations.map((station) => (
                <td
                  key={station.stationId}
                  className="py-3 px-2 border-r border-slate-200 last:border-r-0"
                >
                  {renderPrizeNumber(station.prizes.seventh[0], station.isPending, 'text-slate-900')}
                </td>
              ))}
            </tr>

            {/* Giải Sáu */}
            <tr className="hover:bg-slate-50/50 bg-slate-50/30">
              <td className="py-3.5 px-2 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                Giải Sáu
              </td>
              {data.stations.map((station) => (
                <td
                  key={station.stationId}
                  className="py-3.5 px-2 border-r border-slate-200 last:border-r-0"
                >
                  <div className="flex flex-col gap-2 items-center justify-center">
                    {station.prizes.sixth.map((num, i) => (
                      <React.Fragment key={i}>
                        {renderPrizeNumber(num, station.isPending, 'text-slate-800')}
                      </React.Fragment>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Giải Năm */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3 px-2 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                Giải Năm
              </td>
              {data.stations.map((station) => (
                <td
                  key={station.stationId}
                  className="py-3 px-2 border-r border-slate-200 last:border-r-0"
                >
                  {renderPrizeNumber(station.prizes.fifth[0], station.isPending, 'text-slate-900')}
                </td>
              ))}
            </tr>

            {/* Giải Tư */}
            <tr className="hover:bg-slate-50/50 bg-slate-50/30">
              <td className="py-4 px-2 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                Giải Tư
              </td>
              {data.stations.map((station) => (
                <td
                  key={station.stationId}
                  className="py-4 px-2 border-r border-slate-200 last:border-r-0"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 justify-items-center">
                    {station.prizes.fourth.map((num, i) => (
                      <React.Fragment key={i}>
                        {renderPrizeNumber(num, station.isPending, 'text-slate-800')}
                      </React.Fragment>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Giải Ba */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3.5 px-2 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                Giải Ba
              </td>
              {data.stations.map((station) => (
                <td
                  key={station.stationId}
                  className="py-3.5 px-2 border-r border-slate-200 last:border-r-0"
                >
                  <div className="flex flex-col gap-2 items-center justify-center">
                    {station.prizes.third.map((num, i) => (
                      <React.Fragment key={i}>
                        {renderPrizeNumber(num, station.isPending, 'text-slate-900')}
                      </React.Fragment>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Giải Nhì */}
            <tr className="hover:bg-slate-50/50 bg-slate-50/30">
              <td className="py-3 px-2 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                Giải Nhì
              </td>
              {data.stations.map((station) => (
                <td
                  key={station.stationId}
                  className="py-3 px-2 border-r border-slate-200 last:border-r-0"
                >
                  {renderPrizeNumber(station.prizes.second[0], station.isPending, 'text-slate-900')}
                </td>
              ))}
            </tr>

            {/* Giải Nhất */}
            <tr className="hover:bg-slate-50/50">
              <td className="py-3.5 px-2 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                Giải Nhất
              </td>
              {data.stations.map((station) => (
                <td
                  key={station.stationId}
                  className="py-3.5 px-2 border-r border-slate-200 last:border-r-0"
                >
                  {renderPrizeNumber(station.prizes.first[0], station.isPending, 'text-slate-900')}
                </td>
              ))}
            </tr>

            {/* Giải Đặc Biệt */}
            <tr className="bg-red-50/60 border-t-2 border-red-200">
              <td className="py-5 px-2 font-extrabold text-red-700 bg-red-100/50 border-r border-slate-200">
                Đặc Biệt
              </td>
              {data.stations.map((station) => {
                const isPending = data.isPending || station.isPending;
                return (
                  <td
                    key={station.stationId}
                    className="py-5 px-2 border-r border-slate-200 last:border-r-0"
                  >
                    {isPending ? (
                      <div className="inline-flex items-center justify-center gap-2.5 text-amber-600 font-mono text-3xl sm:text-5xl font-black tabular-nums">
                        <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-amber-500 animate-spin shrink-0" />
                        <span>{station.prizes.special[0]}</span>
                      </div>
                    ) : (
                      <span className="font-mono text-3xl sm:text-5xl font-black text-red-600 tracking-wider tabular-nums drop-shadow-xs">
                        {formatNumber(station.prizes.special[0])}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Bottom: Bảng Đầu - Đuôi Lô Tô cho các đài */}
      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
          Bảng Đầu - Đuôi Lô Tô Các Đài ({data.stations.map((s) => s.stationName).join(' · ')})
        </h4>

        {data.isPending && (
          <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-center text-xs text-amber-800 font-semibold flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin shrink-0" />
            <span>Đang chờ mở thưởng · Bảng đầu đuôi các đài sẽ tự động cập nhật khi có kết quả</span>
          </div>
        )}

        <div className={`grid grid-cols-1 ${data.stations.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
          {data.stations.map((station) => (
            <div
              key={station.stationId}
              className="bg-white rounded-lg border border-slate-200 p-3 shadow-xs"
            >
              <div className="text-xs font-bold text-slate-800 pb-2 mb-2 border-b border-slate-100 flex items-center justify-between">
                <span>{station.stationName}</span>
                {(data.isPending || station.isPending) && (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                    <Loader2 className="w-3 h-3 text-amber-600 animate-spin shrink-0" />
                    Chờ quay
                  </span>
                )}
              </div>
              <div className="space-y-1 text-xs">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
                  const tails = station.headTail.heads[digit] || [];
                  return (
                    <div key={digit} className="flex items-center gap-2 py-0.5">
                      <span className="w-6 h-6 font-mono font-bold text-slate-900 bg-slate-100 text-center rounded flex items-center justify-center text-sm">
                        {digit}
                      </span>
                      <span className="font-mono text-slate-600 tabular-nums">
                        {tails.length > 0 ? (
                          tails.map((t, idx) => (
                            <span key={idx} className="mr-2 font-medium text-slate-800 text-sm sm:text-base">
                              {digit}
                              <span className="text-red-600 font-bold">{t}</span>
                            </span>
                          ))
                        ) : data.isPending || station.isPending ? (
                          <span className="text-amber-500 flex items-center justify-center py-0.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-amber-500" />
                          </span>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar: Fullscreen / Minimize button at the bottom-right corner */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5">
          {isFullscreen ? (
            '💡 Đang ở chế độ toàn màn hình · Nhấn ESC hoặc nút bên phải để thu nhỏ'
          ) : data.isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin shrink-0" />
              <span className="text-amber-800 font-semibold">
                Đang ở chế độ chờ cập nhật kết quả kỳ quay {data.date} ({defaultDrawTime})
              </span>
            </>
          ) : (
            `${title} (${data.region === 'MN' ? 'XSMN' : 'XSMT'})`
          )}
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
