import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Trophy, Sparkles } from 'lucide-react';
import { Region, CheckTicketResult } from '../types/lottery';
import { LOTTERY_STATIONS, TODAY_STR, generateMBResult, generateMNMTResult } from '../data/lotteryData';
import { checkTicketMB, checkTicketMNMT, formatVND } from '../utils/lotteryChecker';
import { sound } from '../utils/audio';
import { XoSoDayLogo } from './Logo';
import { fetchLiveMBResult, fetchLiveMNMTResult } from '../services/xosoApi';

interface TicketCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TicketCheckerModal: React.FC<TicketCheckerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [region, setRegion] = useState<Region>('MB');
  const [date, setDate] = useState<string>(TODAY_STR);
  const [stationId, setStationId] = useState<string>('mb_hn');
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [result, setResult] = useState<CheckTicketResult | null>(null);
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const availableStations = LOTTERY_STATIONS.filter((s) => s.region === region);

  const handleRegionChange = (newReg: Region) => {
    setRegion(newReg);
    setResult(null);
    setChecked(false);
    const stations = LOTTERY_STATIONS.filter((s) => s.region === newReg);
    if (stations.length > 0) setStationId(stations[0].id);
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
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
        const station = mnmtData.stations.find((s) => s.stationId === stationId) || mnmtData.stations[0];
        if (station) {
          res = checkTicketMNMT(clean, station, date, region);
        }
      }
    } catch {
      if (region === 'MB') {
        res = checkTicketMB(clean, generateMBResult(date));
      } else {
        const mnmtData = generateMNMTResult(date, region as 'MN' | 'MT');
        if (mnmtData.stations[0]) {
          res = checkTicketMNMT(clean, mnmtData.stations[0], date, region);
        }
      }
    } finally {
      setIsLoading(false);
    }

    setResult(res);
    setChecked(true);

    if (res && res.isWinner) {
      sound.playWinFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      sound.playNumberReveal();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <XoSoDayLogo size="sm" showText={false} />
          <div>
            <h3 className="text-lg font-bold text-slate-900">Dò Vé Nhanh - Xổ số đây</h3>
            <p className="text-xs text-slate-500">Tra cứu kết quả tự động chính xác</p>
          </div>
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          {/* Region Tabs */}
          <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
            {(['MB', 'MN', 'MT'] as Region[]).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => handleRegionChange(r)}
                className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
                  region === r ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600'
                }`}
              >
                {r === 'MB' ? 'Miền Bắc' : r === 'MN' ? 'Miền Nam' : 'Miền Trung'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Ngày mở thưởng</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">Đài quay</label>
              <select
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-red-500"
              >
                {availableStations.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 font-medium mb-1">
              <span>Số vé ({region === 'MB' ? '5 số' : '6 số'})</span>
              <button
                type="button"
                onClick={() => {
                  if (region === 'MB') {
                    const mbData = generateMBResult(date);
                    setTicketNumber(mbData.prizes.seventh[0]);
                  } else {
                    const mnmtData = generateMNMTResult(date, region as 'MN' | 'MT');
                    const station = mnmtData.stations[0];
                    if (station) setTicketNumber(`9384${station.prizes.eighth[0]}`);
                  }
                }}
                className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
              >
                Số mẫu trúng
              </button>
            </div>
            <input
              type="text"
              maxLength={6}
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value.replace(/\D/g, ''))}
              placeholder={region === 'MB' ? 'Ví dụ: 12345' : 'Ví dụ: 123456'}
              className="w-full px-3 py-2.5 rounded-lg border-2 border-slate-300 focus:border-red-600 text-xl font-mono font-bold tracking-widest text-center tabular-nums focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!ticketNumber.trim()}
            className="w-full py-2.5 bg-red-600 hover:bg-red-700 active:scale-98 disabled:opacity-50 text-white font-bold text-sm rounded-lg transition-all cursor-pointer whitespace-nowrap"
          >
            Dò Vé Ngay
          </button>
        </form>

        {checked && result && (
          <div className="mt-4 pt-4 border-t border-slate-200 text-center">
            {result.isWinner ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <Trophy className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                <h4 className="font-extrabold text-emerald-900 text-base">CHÚC MỪNG TRÚNG THƯỞNG!</h4>
                <div className="font-mono text-2xl font-black text-red-600 my-1 tabular-nums">
                  {formatVND(result.totalPrize)}
                </div>
                <div className="text-xs text-slate-700 mt-2 space-y-1">
                  {result.winningPrizes.map((p, idx) => (
                    <div key={idx} className="flex justify-between font-semibold">
                      <span>{p.prizeName}</span>
                      <span className="font-mono text-emerald-700">{formatVND(p.prizeAmount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-800 block mb-0.5">Vé chưa trúng thưởng</span>
                Vé số {result.ticketNumber} chưa trùng khớp giải nào của đài {result.stationName}.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
