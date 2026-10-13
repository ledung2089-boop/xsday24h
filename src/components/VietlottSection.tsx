import React, { useState, useEffect } from 'react';
import { VietlottDraw } from '../types/lottery';
import { formatVND } from '../utils/lotteryChecker';
import { Sparkles, Dices, Copy, Check, Maximize2, Minimize2, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface VietlottSectionProps {
  megaData: VietlottDraw;
  powerData: VietlottDraw;
}

export const VietlottSection: React.FC<VietlottSectionProps> = ({
  megaData,
  powerData,
}) => {
  const [luckyMega, setLuckyMega] = useState<number[]>([]);
  const [luckyPower, setLuckyPower] = useState<{ main: number[]; special: number } | null>(null);
  const [copiedMega, setCopiedMega] = useState(false);
  const [copiedPower, setCopiedPower] = useState(false);
  const [fullscreenCard, setFullscreenCard] = useState<'power' | 'mega' | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreenCard) {
        setFullscreenCard(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenCard]);

  const generateLuckyMega = () => {
    sound.playBallTick();
    const set = new Set<number>();
    while (set.size < 6) {
      set.add(Math.floor(Math.random() * 45) + 1);
    }
    const sorted = Array.from(set).sort((a, b) => a - b);
    setLuckyMega(sorted);
    sound.playNumberReveal();
  };

  const generateLuckyPower = () => {
    sound.playBallTick();
    const set = new Set<number>();
    while (set.size < 6) {
      set.add(Math.floor(Math.random() * 55) + 1);
    }
    const main = Array.from(set).sort((a, b) => a - b);
    let special = Math.floor(Math.random() * 55) + 1;
    while (set.has(special)) {
      special = Math.floor(Math.random() * 55) + 1;
    }
    setLuckyPower({ main, special });
    sound.playNumberReveal();
  };

  const copyNumbers = (nums: number[], isPower: boolean) => {
    const text = nums.map((n) => n.toString().padStart(2, '0')).join(' - ');
    navigator.clipboard.writeText(text);
    if (isPower) {
      setCopiedPower(true);
      setTimeout(() => setCopiedPower(false), 2000);
    } else {
      setCopiedMega(true);
      setTimeout(() => setCopiedMega(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* 2 Featured Vietlott Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Power 6/55 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-red-700 to-rose-900 text-white p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600">
                  Power 6/55
                </span>
                <span className="text-xs text-red-100">
                  Kỳ quay {powerData.drawNumber} · {powerData.date}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">Xổ Số Điện Toán Power 6/55</h3>
            </div>

            <div className="p-5 space-y-6">
              {/* Ball display */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  Bộ Số Trúng Thưởng
                </p>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {powerData.winningNumbers.map((num, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-red-600 text-white font-mono font-black text-base flex items-center justify-center shadow-md shadow-red-200"
                    >
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                  {powerData.specialNumber && (
                    <div className="flex items-center gap-1.5 ml-1">
                      <span className="text-slate-300 font-bold">|</span>
                      <div
                        className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-500 text-slate-900 font-mono font-black text-base flex items-center justify-center shadow-md shadow-amber-200"
                        title="Số đặc biệt Jackpot 2"
                      >
                        {powerData.specialNumber.toString().padStart(2, '0')}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Jackpots info */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                  <span className="text-[11px] font-semibold text-red-700 block uppercase">
                    Jackpot 1
                  </span>
                  <span className="font-mono text-base sm:text-lg font-black text-red-700 tabular-nums">
                    {formatVND(powerData.jackpot1Value)}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {powerData.jackpot1Winners > 0
                      ? `${powerData.jackpot1Winners} người trúng!`
                      : 'Chưa có người trúng'}
                  </span>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="text-[11px] font-semibold text-amber-800 block uppercase">
                    Jackpot 2
                  </span>
                  <span className="font-mono text-base sm:text-lg font-black text-amber-800 tabular-nums">
                    {formatVND(powerData.jackpot2Value || 0)}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {powerData.jackpot2Winners && powerData.jackpot2Winners > 0
                      ? `${powerData.jackpot2Winners} người trúng!`
                      : 'Chưa có người trúng'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lucky generator footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-200">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Chọn số may mắn Power:
              </span>
              <button
                onClick={generateLuckyPower}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Quay Số Thần Tài</span>
              </button>
            </div>
            {luckyPower && (
              <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {luckyPower.main.map((n, idx) => (
                    <span
                      key={idx}
                      className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 font-mono font-bold text-xs flex items-center justify-center border border-slate-200"
                    >
                      {n.toString().padStart(2, '0')}
                    </span>
                  ))}
                  <span className="text-slate-300">|</span>
                  <span className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-mono font-bold text-xs flex items-center justify-center">
                    {luckyPower.special.toString().padStart(2, '0')}
                  </span>
                </div>
                <button
                  onClick={() => copyNumbers([...luckyPower.main, luckyPower.special], true)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Sao chép"
                >
                  {copiedPower ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            {/* Bottom-right Fullscreen Button for Power 6/55 */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 mt-3">
              <span className="text-[11px] text-slate-400">Vietlott Power 6/55</span>
              <button
                onClick={() => setFullscreenCard(fullscreenCard === 'power' ? null : 'power')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-red-600 border border-slate-300 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title={fullscreenCard === 'power' ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
              >
                {fullscreenCard === 'power' ? (
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
        </div>

        {/* Card 2: Mega 6/45 */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between">
          <div>
            <div className="bg-gradient-to-r from-orange-600 to-amber-700 text-white p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-200 bg-black/30 px-2 py-0.5 rounded border border-amber-300/40">
                  Mega 6/45
                </span>
                <span className="text-xs text-orange-100">
                  Kỳ quay {megaData.drawNumber} · {megaData.date}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight">Xổ Số Điện Toán Mega 6/45</h3>
            </div>

            <div className="p-5 space-y-6">
              {/* Ball display */}
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                  Bộ Số Trúng Thưởng
                </p>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  {megaData.winningNumbers.map((num, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-orange-600 text-white font-mono font-black text-base flex items-center justify-center shadow-md shadow-orange-200"
                    >
                      {num.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
              </div>

              {/* Jackpot info */}
              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <span className="text-[11px] font-semibold text-orange-700 block uppercase">
                    Jackpot Tích Lũy
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-black text-orange-700 tabular-nums">
                    {formatVND(megaData.jackpot1Value)}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {megaData.jackpot1Winners > 0
                      ? `${megaData.jackpot1Winners} người trúng Jackpot!`
                      : 'Chưa có người trúng (Tích lũy tiếp)'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lucky generator footer */}
          <div className="bg-slate-50 p-4 border-t border-slate-200">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Chọn số may mắn Mega:
              </span>
              <button
                onClick={generateLuckyMega}
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 active:scale-95 transition-all cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-1"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Quay Số Thần Tài</span>
              </button>
            </div>
            {luckyMega.length > 0 && (
              <div className="flex items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {luckyMega.map((n, idx) => (
                    <span
                      key={idx}
                      className="w-7 h-7 rounded-full bg-slate-100 text-slate-900 font-mono font-bold text-xs flex items-center justify-center border border-slate-200"
                    >
                      {n.toString().padStart(2, '0')}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => copyNumbers(luckyMega, false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Sao chép"
                >
                  {copiedMega ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}

            {/* Bottom-right Fullscreen Button for Mega 6/45 */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-200 mt-3">
              <span className="text-[11px] text-slate-400">Vietlott Mega 6/45</span>
              <button
                onClick={() => setFullscreenCard(fullscreenCard === 'mega' ? null : 'mega')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 hover:text-red-600 border border-slate-300 rounded-lg shadow-2xs transition-all cursor-pointer whitespace-nowrap"
                title={fullscreenCard === 'mega' ? 'Thu nhỏ cửa sổ' : 'Phóng to toàn màn hình'}
              >
                {fullscreenCard === 'mega' ? (
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
        </div>
      </div>

      {/* Fullscreen Modal View if active */}
      {fullscreenCard && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 overflow-y-auto flex items-center justify-center animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-700 relative">
            <button
              onClick={() => setFullscreenCard(null)}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-lg transition-colors cursor-pointer z-10"
              title="Đóng (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
            {fullscreenCard === 'power' ? (
              <div>
                <div className="bg-gradient-to-r from-red-700 to-rose-900 text-white p-6">
                  <span className="text-xs font-bold uppercase text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600">
                    Power 6/55
                  </span>
                  <h3 className="text-2xl font-black mt-1">Xổ Số Điện Toán Power 6/55</h3>
                  <p className="text-xs text-red-200 mt-1">
                    Kỳ quay {powerData.drawNumber} · Ngày {powerData.date}
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Bộ Số Trúng Thưởng Toàn Màn Hình
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {powerData.winningNumbers.map((num, i) => (
                        <div
                          key={i}
                          className="w-14 h-14 rounded-full bg-red-600 text-white font-mono font-black text-2xl flex items-center justify-center shadow-lg shadow-red-200"
                        >
                          {num.toString().padStart(2, '0')}
                        </div>
                      ))}
                      {powerData.specialNumber && (
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-slate-300 text-2xl font-bold">|</span>
                          <div
                            className="w-14 h-14 rounded-full bg-amber-500 text-slate-900 font-mono font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-200"
                            title="Số đặc biệt"
                          >
                            {powerData.specialNumber.toString().padStart(2, '0')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <span className="text-xs font-bold text-red-700 block uppercase">
                        Jackpot 1
                      </span>
                      <span className="font-mono text-2xl font-black text-red-700 tabular-nums">
                        {formatVND(powerData.jackpot1Value)}
                      </span>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <span className="text-xs font-bold text-amber-800 block uppercase">
                        Jackpot 2
                      </span>
                      <span className="font-mono text-2xl font-black text-amber-800 tabular-nums">
                        {formatVND(powerData.jackpot2Value || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-gradient-to-r from-orange-600 to-amber-700 text-white p-6">
                  <span className="text-xs font-bold uppercase text-amber-200 bg-black/30 px-2 py-0.5 rounded border border-amber-300/40">
                    Mega 6/45
                  </span>
                  <h3 className="text-2xl font-black mt-1">Xổ Số Điện Toán Mega 6/45</h3>
                  <p className="text-xs text-orange-200 mt-1">
                    Kỳ quay {megaData.drawNumber} · Ngày {megaData.date}
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                      Bộ Số Trúng Thưởng Toàn Màn Hình
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {megaData.winningNumbers.map((num, i) => (
                        <div
                          key={i}
                          className="w-14 h-14 rounded-full bg-orange-600 text-white font-mono font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-200"
                        >
                          {num.toString().padStart(2, '0')}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                    <span className="text-xs font-bold text-orange-700 block uppercase">
                      Jackpot Tích Lũy
                    </span>
                    <span className="font-mono text-2xl font-black text-orange-700 tabular-nums">
                      {formatVND(megaData.jackpot1Value)}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setFullscreenCard(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Minimize2 className="w-4 h-4" />
                <span>Thu Nhỏ Cửa Sổ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
