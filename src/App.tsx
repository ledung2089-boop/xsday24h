import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ResultBoardMB } from './components/ResultBoardMB';
import { ResultBoardMN } from './components/ResultBoardMN';
import { VietlottSection } from './components/VietlottSection';
import { TicketCheckerTab } from './components/TicketCheckerTab';
import { TicketCheckerModal } from './components/TicketCheckerModal';
import { LiveDrawSimulator } from './components/LiveDrawSimulator';
import { StatisticsTab } from './components/StatisticsTab';
import { DreamBookTab } from './components/DreamBookTab';
import { ScheduleTab } from './components/ScheduleTab';
import { XoSoDayLogo } from './components/Logo';
import {
  TODAY_STR,
  YESTERDAY_STR,
  generateMBResult,
  generateMNMTResult,
  VIETLOTT_MEGA_645,
  VIETLOTT_POWER_655,
} from './data/lotteryData';
import {
  Clock,
  Sparkles,
  Ticket,
  ChevronRight,
  ShieldCheck,
  Calendar,
  RefreshCw,
  Key,
  CheckCircle2,
} from 'lucide-react';
import { ApiKeyModal } from './components/ApiKeyModal';
import {
  fetchLiveMBResult,
  fetchLiveMNMTResult,
  getStoredApiKey,
} from './services/xosoApi';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('results');
  const [selectedDate, setSelectedDate] = useState<string>(TODAY_STR);
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'MB' | 'MN' | 'MT' | 'VIETLOTT'>('ALL');
  const [isQuickCheckOpen, setIsQuickCheckOpen] = useState<boolean>(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // Live lottery state
  const [mbResult, setMbResult] = useState(() => generateMBResult(TODAY_STR));
  const [mnResult, setMnResult] = useState(() => generateMNMTResult(TODAY_STR, 'MN'));
  const [mtResult, setMtResult] = useState(() => generateMNMTResult(TODAY_STR, 'MT'));
  const [isLiveApi, setIsLiveApi] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [syncCount, setSyncCount] = useState<number>(0);

  // Fetch real data on date or manual refresh
  React.useEffect(() => {
    let isMounted = true;
    setIsFetching(true);

    const apiKey = getStoredApiKey();

    Promise.all([
      fetchLiveMBResult(selectedDate, apiKey),
      fetchLiveMNMTResult(selectedDate, 'MN', apiKey),
      fetchLiveMNMTResult(selectedDate, 'MT', apiKey),
    ])
      .then(([mbRes, mnRes, mtRes]) => {
        if (!isMounted) return;
        setMbResult(mbRes.result);
        setMnResult(mnRes.result);
        setMtResult(mtRes.result);
        setIsLiveApi(mbRes.isLive || mnRes.isLive || mtRes.isLive);
        setLastSyncTime(new Date().toLocaleTimeString('vi-VN'));
      })
      .catch((err) => {
        console.warn('Error fetching live lottery draws:', err);
      })
      .finally(() => {
        if (isMounted) setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedDate, syncCount]);

  const handleManualRefresh = () => {
    setSyncCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Bar following Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenQuickCheck={() => setIsQuickCheckOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: KẾT QUẢ 3 MIỀN */}
        {activeTab === 'results' && (
          <div className="space-y-8">
            {/* Hero Notification & Fast Actions Banner */}
            <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 rounded-2xl text-white p-6 sm:p-8 shadow-sm relative overflow-hidden">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4 sm:gap-6">
                  {/* Visual Emblem Badge in Hero */}
                  <div className="bg-white/10 backdrop-blur-sm p-2 sm:p-3 rounded-2xl border border-white/20 shadow-inner hidden sm:flex items-center justify-center shrink-0">
                    <XoSoDayLogo size="lg" showText={false} />
                  </div>

                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Xổ Số Đây · Cập nhật trực tiếp kết quả hàng ngày</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                      Kết Quả Xổ Số Kiến Thiết Hôm Nay
                    </h1>
                    <p className="text-xs sm:text-sm text-red-100 leading-relaxed">
                      Cổng <strong>Xổ số đây</strong> tra cứu đầy đủ kết quả xổ số Miền Bắc (18h15), Miền Nam (16h15), Miền Trung (17h15) và Vietlott chuẩn xác, không quảng cáo phiền toái.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto">
                  <button
                    onClick={() => setActiveTab('check')}
                    className="flex-1 sm:flex-initial px-5 py-3 bg-white text-red-700 hover:bg-red-50 active:scale-95 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>Dò Vé Số Tự Động</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="flex-1 sm:flex-initial px-5 py-3 bg-red-900/50 hover:bg-red-900/70 border border-red-400/40 text-white active:scale-95 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Quay Thử Thần Tài</span>
                  </button>
                </div>
              </div>

              {/* Quick schedule indicators */}
              <div className="mt-6 pt-6 border-t border-red-500/30 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs relative z-10">
                <div className="bg-red-950/40 backdrop-blur-xs p-2.5 rounded-lg border border-red-500/20">
                  <span className="text-red-200 block text-[11px]">XSMN (Miền Nam)</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-amber-300" /> 16:15 hàng ngày
                  </span>
                </div>
                <div className="bg-red-950/40 backdrop-blur-xs p-2.5 rounded-lg border border-red-500/20">
                  <span className="text-red-200 block text-[11px]">XSMT (Miền Trung)</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-300" /> 17:15 hàng ngày
                  </span>
                </div>
                <div className="bg-red-950/40 backdrop-blur-xs p-2.5 rounded-lg border border-red-500/20">
                  <span className="text-red-200 block text-[11px]">XSMB (Miền Bắc)</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-red-300" /> 18:15 hàng ngày
                  </span>
                </div>
                <div className="bg-red-950/40 backdrop-blur-xs p-2.5 rounded-lg border border-red-500/20">
                  <span className="text-red-200 block text-[11px]">Vietlott Mega & Power</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-purple-300" /> 18:00 các ngày
                  </span>
                </div>
              </div>
            </div>

            {/* Live API Sync Bar */}
            <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs text-xs">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                      isLiveApi ? 'bg-emerald-400' : 'bg-amber-400'
                    } opacity-75`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                      isLiveApi ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  ></span>
                </span>
                <div>
                  <span className="font-bold text-slate-800">
                    {isLiveApi
                      ? 'Dữ liệu trực tiếp từ XoSoAPI (xosoapi.online)'
                      : 'Chế độ mô phỏng / Đang chờ dữ liệu'}
                  </span>
                  {lastSyncTime && (
                    <span className="text-slate-400 ml-2">· Cập nhật: {lastSyncTime}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleManualRefresh}
                  disabled={isFetching}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Cập nhật kết quả mới nhất từ API"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${
                      isFetching ? 'animate-spin text-red-600' : ''
                    }`}
                  />
                  <span>{isFetching ? 'Đang tải...' : 'Làm Mới'}</span>
                </button>

                <button
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Cấu hình hoặc đổi API Key"
                >
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>API Key</span>
                </button>
              </div>
            </div>

            {/* Sub-bar: Filters & Date selector */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              {/* Region filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
                {[
                  { id: 'ALL', label: 'Tất Cả 3 Miền' },
                  { id: 'MB', label: 'Miền Bắc' },
                  { id: 'MN', label: 'Miền Nam' },
                  { id: 'MT', label: 'Miền Trung' },
                  { id: 'VIETLOTT', label: 'Vietlott' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setRegionFilter(f.id as typeof regionFilter)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      regionFilter === f.id
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Fast Date shortcuts */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs">
                <button
                  onClick={() => setSelectedDate(TODAY_STR)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedDate === TODAY_STR
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Hôm nay
                </button>
                <button
                  onClick={() => setSelectedDate(YESTERDAY_STR)}
                  className={`px-2.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedDate === YESTERDAY_STR
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Hôm qua
                </button>
                <div className="flex items-center bg-slate-100 rounded-lg px-2.5 py-1.5 border border-slate-200 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="bg-transparent text-xs text-slate-800 font-medium focus:outline-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Lottery Results Display */}
            <div className="space-y-10">
              {/* XSMB Section */}
              {(regionFilter === 'ALL' || regionFilter === 'MB') && (
                <section>
                  <ResultBoardMB
                    data={mbResult}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                </section>
              )}

              {/* XSMN Section */}
              {(regionFilter === 'ALL' || regionFilter === 'MN') && (
                <section>
                  <ResultBoardMN
                    data={mnResult}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    title="Xổ Số Kiến Thiết Miền Nam"
                  />
                </section>
              )}

              {/* XSMT Section */}
              {(regionFilter === 'ALL' || regionFilter === 'MT') && (
                <section>
                  <ResultBoardMN
                    data={mtResult}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                    title="Xổ Số Kiến Thiết Miền Trung"
                  />
                </section>
              )}

              {/* Vietlott Section */}
              {(regionFilter === 'ALL' || regionFilter === 'VIETLOTT') && (
                <section>
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Điện Toán Tự Chọn
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      Kết Quả Xổ Số Vietlott
                    </h3>
                  </div>
                  <VietlottSection
                    megaData={VIETLOTT_MEGA_645}
                    powerData={VIETLOTT_POWER_655}
                  />
                </section>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DÒ VÉ SỐ TỰ ĐỘNG */}
        {activeTab === 'check' && <TicketCheckerTab />}

        {/* TAB 3: QUAY THỬ THẦN TÀI */}
        {activeTab === 'simulator' && <LiveDrawSimulator />}

        {/* TAB 4: THỐNG KÊ CẦU LÔ */}
        {activeTab === 'stats' && <StatisticsTab />}

        {/* TAB 5: SỔ MƠ DÂN GIAN */}
        {activeTab === 'dreambook' && <DreamBookTab />}

        {/* TAB 6: LỊCH MỞ THƯỞNG */}
        {activeTab === 'schedule' && <ScheduleTab />}
      </main>

      {/* Quick Check Modal from Header CTA */}
      <TicketCheckerModal
        isOpen={isQuickCheckOpen}
        onClose={() => setIsQuickCheckOpen(false)}
      />

      {/* Api Key Config Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onApiKeyChanged={handleManualRefresh}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
