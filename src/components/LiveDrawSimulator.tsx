import React, { useState, useEffect, useRef } from 'react';
import { Region, StationInfo } from '../types/lottery';
import { LOTTERY_STATIONS, computeHeadTail } from '../data/lotteryData';
import { sound } from '../utils/audio';
import { Play, RotateCcw, FastForward, Sparkles, Volume2, VolumeX, Maximize2, Minimize2, X, Loader2 } from 'lucide-react';

export const LiveDrawSimulator: React.FC = () => {
  const [region, setRegion] = useState<Region>('MB');
  const [selectedStationId, setSelectedStationId] = useState<string>('mb_hn');
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Prizes state
  const [drawnPrizes, setDrawnPrizes] = useState<Record<string, string[]>>({});
  const intervalRef = useRef<number | null>(null);

  const availableStations = LOTTERY_STATIONS.filter((s) => s.region === region);
  const selectedStation = LOTTERY_STATIONS.find((s) => s.id === selectedStationId) || availableStations[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Helper to generate a random n-digit string
  const getRandomNumber = (digits: number) => {
    let str = '';
    for (let i = 0; i < digits; i++) {
      str += Math.floor(Math.random() * 10).toString();
    }
    return str;
  };

  const renderSimNumber = (num: string | undefined, colorClass: string = 'text-slate-900') => {
    if (!num || /^[-–—\s]+$/.test(num)) {
      return (
        <span className="inline-flex items-center justify-center text-amber-500 py-1" title="Đang chờ quay thưởng">
          <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-amber-500 shrink-0" />
        </span>
      );
    }
    return <span className={`font-mono text-3xl sm:text-5xl font-black tabular-nums tracking-wide ${colorClass}`}>{num}</span>;
  };

  const handleRegionChange = (newReg: Region) => {
    stopDraw();
    setRegion(newReg);
    const stations = LOTTERY_STATIONS.filter((s) => s.region === newReg);
    if (stations.length > 0) setSelectedStationId(stations[0].id);
    resetBoard();
  };

  const resetBoard = () => {
    setDrawnPrizes({});
    setIsDrawing(false);
    setIsFinished(false);
    setCurrentStep(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const stopDraw = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDrawing(false);
  };

  const startDraw = () => {
    resetBoard();
    setIsDrawing(true);

    if (region === 'MB') {
      // MB draw sequence: 7th (4x2), 6th (3x3), 5th (6x4), 4th (4x4), 3rd (6x5), 2nd (2x5), 1st (1x5), Special (1x5)
      const sequence: { prizeKey: string; count: number; digits: number }[] = [
        { prizeKey: 'seventh', count: 4, digits: 2 },
        { prizeKey: 'sixth', count: 3, digits: 3 },
        { prizeKey: 'fifth', count: 6, digits: 4 },
        { prizeKey: 'fourth', count: 4, digits: 4 },
        { prizeKey: 'third', count: 6, digits: 5 },
        { prizeKey: 'second', count: 2, digits: 5 },
        { prizeKey: 'first', count: 1, digits: 5 },
        { prizeKey: 'special', count: 1, digits: 5 },
      ];

      runSequence(sequence);
    } else {
      // MN / MT draw sequence: 8th (1x2), 7th (1x3), 6th (3x4), 5th (1x4), 4th (7x5), 3rd (2x5), 2nd (1x5), 1st (1x5), Special (1x6)
      const sequence: { prizeKey: string; count: number; digits: number }[] = [
        { prizeKey: 'eighth', count: 1, digits: 2 },
        { prizeKey: 'seventh', count: 1, digits: 3 },
        { prizeKey: 'sixth', count: 3, digits: 4 },
        { prizeKey: 'fifth', count: 1, digits: 4 },
        { prizeKey: 'fourth', count: 7, digits: 5 },
        { prizeKey: 'third', count: 2, digits: 5 },
        { prizeKey: 'second', count: 1, digits: 5 },
        { prizeKey: 'first', count: 1, digits: 5 },
        { prizeKey: 'special', count: 1, digits: 6 },
      ];

      runSequence(sequence);
    }
  };

  const runSequence = (sequence: { prizeKey: string; count: number; digits: number }[]) => {
    let stepIndex = 0;
    const totalSteps = sequence.reduce((acc, curr) => acc + curr.count, 0);

    // Flatten sequence steps
    const flatSteps: { prizeKey: string; digits: number }[] = [];
    sequence.forEach((group) => {
      for (let i = 0; i < group.count; i++) {
        flatSteps.push({ prizeKey: group.prizeKey, digits: group.digits });
      }
    });

    const newPrizes: Record<string, string[]> = {};
    sequence.forEach((g) => (newPrizes[g.prizeKey] = []));

    intervalRef.current = window.setInterval(() => {
      if (stepIndex >= flatSteps.length) {
        stopDraw();
        setIsFinished(true);
        if (soundEnabled) sound.playWinFanfare();
        return;
      }

      const current = flatSteps[stepIndex];
      const drawnNum = getRandomNumber(current.digits);

      newPrizes[current.prizeKey].push(drawnNum);
      setDrawnPrizes({ ...newPrizes });
      setCurrentStep(stepIndex + 1);

      if (soundEnabled) {
        sound.playBallTick();
        if (current.prizeKey === 'special') sound.playNumberReveal();
      }

      stepIndex++;
    }, 250);
  };

  const instantComplete = () => {
    stopDraw();
    const finalPrizes: Record<string, string[]> = {};

    if (region === 'MB') {
      finalPrizes.seventh = [getRandomNumber(2), getRandomNumber(2), getRandomNumber(2), getRandomNumber(2)];
      finalPrizes.sixth = [getRandomNumber(3), getRandomNumber(3), getRandomNumber(3)];
      finalPrizes.fifth = Array.from({ length: 6 }, () => getRandomNumber(4));
      finalPrizes.fourth = Array.from({ length: 4 }, () => getRandomNumber(4));
      finalPrizes.third = Array.from({ length: 6 }, () => getRandomNumber(5));
      finalPrizes.second = [getRandomNumber(5), getRandomNumber(5)];
      finalPrizes.first = [getRandomNumber(5)];
      finalPrizes.special = [getRandomNumber(5)];
    } else {
      finalPrizes.eighth = [getRandomNumber(2)];
      finalPrizes.seventh = [getRandomNumber(3)];
      finalPrizes.sixth = [getRandomNumber(4), getRandomNumber(4), getRandomNumber(4)];
      finalPrizes.fifth = [getRandomNumber(4)];
      finalPrizes.fourth = Array.from({ length: 7 }, () => getRandomNumber(5));
      finalPrizes.third = [getRandomNumber(5), getRandomNumber(5)];
      finalPrizes.second = [getRandomNumber(5)];
      finalPrizes.first = [getRandomNumber(5)];
      finalPrizes.special = [getRandomNumber(6)];
    }

    setDrawnPrizes(finalPrizes);
    setIsFinished(true);
    if (soundEnabled) sound.playNumberReveal();
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Compute Head Tail for simulator if finished
  const allDrawnList = Object.values(drawnPrizes).flat();
  const headTail = computeHeadTail(allDrawnList);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Mô Phỏng Lồng Cầu Thần Tài Lấy May</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Quay Thử Xổ Số Trực Tiếp
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Lồng cầu ảo quay số mô phỏng chính xác thuật toán quay thưởng của Hội Đồng Xổ Số Kiến Thiết, mang lại may mắn trước giờ quay thật!
        </p>
      </div>

      {/* Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Chọn Miền
            </label>
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
              {(['MB', 'MN', 'MT'] as Region[]).map((r) => (
                <button
                  key={r}
                  disabled={isDrawing}
                  onClick={() => handleRegionChange(r)}
                  className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer disabled:opacity-50 ${
                    region === r ? 'bg-white text-red-600 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {r === 'MB' ? 'Miền Bắc' : r === 'MN' ? 'Miền Nam' : 'Miền Trung'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Đài Mở Thưởng
            </label>
            <select
              disabled={isDrawing}
              value={selectedStationId}
              onChange={(e) => {
                setSelectedStationId(e.target.value);
                resetBoard();
              }}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
            >
              {availableStations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Âm Thanh Lồng Cầu
            </label>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-slate-50 border-slate-300 text-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Bật hiệu ứng âm thanh</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Tắt âm thanh</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-slate-100">
          {!isDrawing && !isFinished && (
            <button
              onClick={startDraw}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt Đầu Quay Thử</span>
            </button>
          )}

          {isDrawing && (
            <button
              onClick={instantComplete}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <FastForward className="w-4 h-4" />
              <span>Quay Nhanh Xem Ngay</span>
            </button>
          )}

          {isFinished && (
            <button
              onClick={startDraw}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Quay Lại Lần Khác</span>
            </button>
          )}
        </div>
      </div>

      {/* Virtual Lottery Board */}
      <div
        className={`bg-white ${
          isFullscreen
            ? 'fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 flex items-start sm:items-center justify-center animate-in fade-in duration-150'
            : 'rounded-xl border border-slate-200 shadow-sm overflow-hidden'
        }`}
      >
        <div
          className={`${
            isFullscreen
              ? 'bg-white rounded-2xl max-w-5xl w-full my-auto shadow-2xl border border-slate-700 overflow-hidden'
              : 'w-full'
          }`}
        >
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
          <div>
            <span className="text-xs text-red-400 font-bold uppercase tracking-wider block">
              Kết Quả Quay Thử
            </span>
            <span className="text-base font-bold">
              {selectedStation ? selectedStation.name : 'Xổ Số'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {isDrawing && (
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                <span>Đang quay bóng... ({currentStep} giải)</span>
              </div>
            )}
            {isFinished && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
                Hoàn tất quay thử!
              </span>
            )}
            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                title="Đóng toàn màn hình (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Board content */}
        <div className="p-4 overflow-x-auto">
          {region === 'MB' ? (
            <table className="w-full text-center border-collapse text-xs sm:text-sm">
              <tbody className="divide-y divide-slate-100">
                {/* Đặc Biệt */}
                <tr className="bg-red-50/60">
                  <td className="w-28 py-4 px-3 font-bold text-red-700 bg-red-100/50 border-r border-slate-200">
                    Đặc Biệt
                  </td>
                  <td className="py-4 px-3">
                    {renderSimNumber(drawnPrizes.special ? drawnPrizes.special[0] : undefined, 'text-red-600')}
                  </td>
                </tr>

                {/* Giải Nhất */}
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Nhất
                  </td>
                  <td className="py-3.5 px-3">
                    {renderSimNumber(drawnPrizes.first ? drawnPrizes.first[0] : undefined, 'text-slate-900')}
                  </td>
                </tr>

                {/* Giải Nhì */}
                <tr className="bg-slate-50/40">
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Nhì
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex justify-around items-center">
                      <span>{renderSimNumber(drawnPrizes.second ? drawnPrizes.second[0] : undefined, 'text-slate-900')}</span>
                      <span>{renderSimNumber(drawnPrizes.second ? drawnPrizes.second[1] : undefined, 'text-slate-900')}</span>
                    </div>
                  </td>
                </tr>

                {/* Giải Ba */}
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Ba
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 items-center">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <span key={i}>
                          {renderSimNumber(drawnPrizes.third ? drawnPrizes.third[i] : undefined, 'text-slate-900')}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>

                {/* Giải Tư */}
                <tr className="bg-slate-50/40">
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Tư
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-center">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i}>
                          {renderSimNumber(drawnPrizes.fourth ? drawnPrizes.fourth[i] : undefined, 'text-slate-900')}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>

                {/* Giải Năm */}
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Năm
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 items-center">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <span key={i}>
                          {renderSimNumber(drawnPrizes.fifth ? drawnPrizes.fifth[i] : undefined, 'text-slate-900')}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>

                {/* Giải Sáu */}
                <tr className="bg-slate-50/40">
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Sáu
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex justify-around items-center">
                      {[0, 1, 2].map((i) => (
                        <span key={i}>
                          {renderSimNumber(drawnPrizes.sixth ? drawnPrizes.sixth[i] : undefined, 'text-slate-900')}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>

                {/* Giải Bảy */}
                <tr className="bg-red-50/30">
                  <td className="py-3.5 px-3 font-bold text-red-700 bg-red-50/60 border-r border-slate-200">
                    Giải Bảy
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 items-center">
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i}>
                          {renderSimNumber(drawnPrizes.seventh ? drawnPrizes.seventh[i] : undefined, 'text-red-600')}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            /* MN / MT Table */
            <table className="w-full text-center border-collapse text-xs sm:text-sm">
              <tbody className="divide-y divide-slate-100">
                <tr className="bg-red-50/60">
                  <td className="w-28 py-4 px-3 font-bold text-red-700 bg-red-100/50 border-r border-slate-200">
                    Đặc Biệt
                  </td>
                  <td className="py-4 px-3">
                    {renderSimNumber(drawnPrizes.special ? drawnPrizes.special[0] : undefined, 'text-red-600')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Nhất
                  </td>
                  <td className="py-3.5 px-3">
                    {renderSimNumber(drawnPrizes.first ? drawnPrizes.first[0] : undefined, 'text-slate-900')}
                  </td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Nhì
                  </td>
                  <td className="py-3.5 px-3">
                    {renderSimNumber(drawnPrizes.second ? drawnPrizes.second[0] : undefined, 'text-slate-900')}
                  </td>
                </tr>
                <tr>
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Ba
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex justify-around items-center">
                      <span>{renderSimNumber(drawnPrizes.third ? drawnPrizes.third[0] : undefined, 'text-slate-900')}</span>
                      <span>{renderSimNumber(drawnPrizes.third ? drawnPrizes.third[1] : undefined, 'text-slate-900')}</span>
                    </div>
                  </td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="py-4 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Tư
                  </td>
                  <td className="py-4 px-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
                      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <span key={i}>
                          {renderSimNumber(drawnPrizes.fourth ? drawnPrizes.fourth[i] : undefined, 'text-slate-900')}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Năm
                  </td>
                  <td className="py-3 px-3">
                    {renderSimNumber(drawnPrizes.fifth ? drawnPrizes.fifth[0] : undefined, 'text-slate-900')}
                  </td>
                </tr>
                <tr className="bg-slate-50/40">
                  <td className="py-3.5 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Sáu
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex justify-around items-center">
                      {[0, 1, 2].map((i) => (
                        <span key={i}>
                          {renderSimNumber(drawnPrizes.sixth ? drawnPrizes.sixth[i] : undefined, 'text-slate-900')}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-slate-700 bg-slate-50 border-r border-slate-200">
                    Giải Bảy
                  </td>
                  <td className="py-3 px-3">
                    {renderSimNumber(drawnPrizes.seventh ? drawnPrizes.seventh[0] : undefined, 'text-slate-900')}
                  </td>
                </tr>
                <tr className="bg-red-50/30">
                  <td className="py-3 px-3 font-bold text-red-700 bg-red-50/60 border-r border-slate-200">
                    Giải Tám
                  </td>
                  <td className="py-3 px-3">
                    {renderSimNumber(drawnPrizes.eighth ? drawnPrizes.eighth[0] : undefined, 'text-red-600')}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        {/* Head-Tail for simulator if numbers exist */}
        {allDrawnList.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-2">
              Đầu - Đuôi Lô Tô Đã Quay ({allDrawnList.length} giải)
            </h4>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 text-xs">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
                const tails = headTail.heads[digit] || [];
                return (
                  <div key={digit} className="bg-white p-2 rounded border border-slate-200 text-center">
                    <div className="font-bold text-slate-900 mb-1 border-b border-slate-100 pb-0.5">
                      Đầu {digit}
                    </div>
                    <div className="font-mono text-slate-600 text-[11px] tabular-nums min-h-[20px]">
                      {tails.length > 0 ? tails.join(', ') : '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Bar: Fullscreen / Minimize button at the bottom-right corner */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200">
          <span className="text-[11px] text-slate-500 font-medium">
            {isFullscreen
              ? '💡 Đang ở chế độ toàn màn hình · Nhấn ESC hoặc nút bên phải để thu nhỏ'
              : `Bảng kết quả quay thử ${selectedStation ? selectedStation.name : ''}`}
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
    </div>
  </div>
);
};
