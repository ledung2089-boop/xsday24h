import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Region,
  StationInfo,
  CheckTicketResult,
} from '../types/lottery';
import {
  LOTTERY_STATIONS,
  TODAY_STR,
  generateMBResult,
  generateMNMTResult,
} from '../data/lotteryData';
import { checkTicketMB, checkTicketMNMT, formatVND } from '../utils/lotteryChecker';
import { sound } from '../utils/audio';
import { Trophy, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import { fetchLiveMBResult, fetchLiveMNMTResult } from '../services/xosoApi';

export const TicketCheckerTab: React.FC = () => {
  const [region, setRegion] = useState<Region>('MB');
  const [date, setDate] = useState<string>(TODAY_STR);
  const [stationId, setStationId] = useState<string>('mb_hn');
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [result, setResult] = useState<CheckTicketResult | null>(null);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Available stations for selected region
  const availableStations = LOTTERY_STATIONS.filter((s) => s.region === region);

  const handleRegionChange = (newRegion: Region) => {
    setRegion(newRegion);
    setResult(null);
    setHasChecked(false);
    const stations = LOTTERY_STATIONS.filter((s) => s.region === newRegion);
    if (stations.length > 0) {
      setStationId(stations[0].id);
    }
  };

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = ticketNumber.trim().replace(/\D/g, '');
    if (!clean) return;

    setIsLoading(true);
    let res: CheckTicketResult | null = null;

    try {
      if (region === 'MB') {
        const { result: mbData } = await fetchLiveMBResult(date);
        res = checkTicketMB(clean, mbData);
      } else {
        const { result: mnmtData } = await fetchLiveMNMTResult(date, region as 'MN' | 'MT');
        const station =
          mnmtData.stations.find((s) => s.stationId === stationId) ||
          mnmtData.stations[0];
        if (station) {
          res = checkTicketMNMT(clean, station, date, region);
        }
      }
    } catch {
      // Fallback
      if (region === 'MB') {
        res = checkTicketMB(clean, generateMBResult(date));
      } else {
        const mnmtData = generateMNMTResult(date, region as 'MN' | 'MT');
        const station = mnmtData.stations[0];
        if (station) {
          res = checkTicketMNMT(clean, station, date, region);
        }
      }
    } finally {
      setIsLoading(false);
    }

    setResult(res);
    setHasChecked(true);

    if (res && res.isWinner) {
      sound.playWinFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } else {
      sound.playNumberReveal();
    }
  };

  const fillSampleTicket = async () => {
    if (region === 'MB') {
      const { result: mbData } = await fetchLiveMBResult(date);
      const sample = Math.random() > 0.5 ? mbData.prizes.seventh[0] : mbData.prizes.first[0];
      setTicketNumber(sample || '38287');
    } else {
      const { result: mnmtData } = await fetchLiveMNMTResult(date, region as 'MN' | 'MT');
      const station = mnmtData.stations.find((s) => s.stationId === stationId) || mnmtData.stations[0];
      if (station) {
        const sample = station.prizes.eighth[0] || '68';
        setTicketNumber(`8542${sample}`);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Title & Intro */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Dò Vé Số Tự Động 3 Miền
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          So khớp toàn diện vé số của bạn với tất cả các giải từ Giải Tám/Bảy đến Giải Đặc Biệt, phụ đặc biệt và giải khuyến khích.
        </p>
      </div>

      {/* Main Checker Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleCheck} className="space-y-6">
          {/* Region Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Chọn Miền Xổ Số
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'MB', name: 'Miền Bắc (5 số)' },
                { id: 'MN', name: 'Miền Nam (6 số)' },
                { id: 'MT', name: 'Miền Trung (6 số)' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleRegionChange(item.id as Region)}
                  className={`p-3 rounded-lg border text-sm font-semibold transition-all cursor-pointer ${
                    region === item.id
                      ? 'bg-red-50 border-red-500 text-red-700 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Date and Station Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                2. Ngày Mở Thưởng
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                3. Tỉnh / Đài Mở Thưởng
              </label>
              <select
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none cursor-pointer"
              >
                {availableStations.map((station) => (
                  <option key={station.id} value={station.id}>
                    {station.name} ({station.drawTime})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ticket Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                4. Nhập Dãy Số Dự Thưởng ({region === 'MB' ? '5 chữ số' : '6 chữ số'})
              </label>
              <button
                type="button"
                onClick={fillSampleTicket}
                className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Thử vé mẫu có thưởng</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                maxLength={6}
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value.replace(/\D/g, ''))}
                placeholder={region === 'MB' ? 'Ví dụ: 58291' : 'Ví dụ: 492816'}
                className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-300 focus:border-red-600 focus:ring-0 text-slate-900 text-xl sm:text-2xl font-mono font-bold tracking-widest text-center tabular-nums focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!ticketNumber.trim()}
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-700 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            Tra Cứu Kết Quả Dò Vé
          </button>
        </form>

        {/* Result Area */}
        {hasChecked && result && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            {result.isWinner ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Trophy className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    KẾT QUẢ DÒ VÉ CHÍNH XÁC
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1">
                    CHÚC MỪNG BẠN ĐÃ TRÚNG THƯỞNG!
                  </h3>
                  <div className="mt-2 text-3xl sm:text-4xl font-black text-red-600 font-mono tabular-nums">
                    {formatVND(result.totalPrize)}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-emerald-100 max-w-lg mx-auto text-left divide-y divide-slate-100">
                  <div className="flex justify-between py-2 text-xs text-slate-600">
                    <span>Số vé:</span>
                    <span className="font-mono font-bold text-slate-900">{result.ticketNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 text-xs text-slate-600">
                    <span>Đài quay & Ngày:</span>
                    <span className="font-semibold text-slate-900">
                      {result.stationName} ({result.date})
                    </span>
                  </div>
                  <div className="pt-3">
                    <span className="text-xs font-bold text-slate-700 block mb-2">
                      Chi tiết giải thưởng:
                    </span>
                    <div className="space-y-2">
                      {result.winningPrizes.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-emerald-50/50 p-2 rounded border border-emerald-100 text-xs"
                        >
                          <div>
                            <span className="font-bold text-emerald-900 block">{p.prizeName}</span>
                            <span className="text-slate-500 text-[11px]">{p.description}</span>
                          </div>
                          <span className="font-mono font-bold text-emerald-700">
                            {formatVND(p.prizeAmount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  💡 Vui lòng bảo quản vé số nguyên vẹn, không rách rời, không tẩy xóa và đến các đại lý vé số hoặc Công ty XSKT để lĩnh thưởng trong vòng 30 ngày.
                </p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  Rất tiếc! Vé số của bạn chưa trúng giải kỳ này
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Số vé <span className="font-mono font-bold text-slate-900">{result.ticketNumber}</span> chưa trùng khớp với bất kỳ giải thưởng nào của đài {result.stationName} ngày {result.date}. Chúc bạn may mắn ở kỳ quay tiếp theo!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guide & Rules */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 text-xs text-slate-600 space-y-3">
        <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-red-600" />
          <span>Quy Định Trúng Thưởng & Cơ Cấu Đổi Vé</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <p className="font-semibold text-slate-800">• Điều kiện vé số hợp lệ:</p>
            <p>Vé phải còn nguyên hình, nguyên khổ, không rách rời, không chắp vá, không tẩy xóa sửa chữa.</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-semibold text-slate-800">• Thời hạn nhận thưởng:</p>
            <p>30 ngày kể từ ngày công bố kết quả mở thưởng. Quá thời hạn này, vé trúng thưởng không còn giá trị lĩnh giải.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
