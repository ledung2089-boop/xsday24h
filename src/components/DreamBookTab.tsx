import React, { useState, useMemo } from 'react';
import { DREAM_BOOK_DATA } from '../data/lotteryData';
import { DreamBookEntry } from '../types/lottery';
import { Search, Sparkles, BookOpen, Copy, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface DreamBookTabProps {
  onSelectNumberForCheck?: (num: string) => void;
}

export const DreamBookTab: React.FC<DreamBookTabProps> = ({
  onSelectNumberForCheck,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tất Cả' },
    { id: 'dong_vat', label: 'Động Vật' },
    { id: 'tai_loc', label: 'Tài Lộc & Vàng Bạc' },
    { id: 'thien_nhien', label: 'Thiên Nhiên & Trời Đất' },
    { id: 'doi_song', label: 'Đời Sống & Gia Đạo' },
    { id: 'con_nguoi', label: 'Con Người & Tâm Linh' },
  ];

  const filteredEntries = useMemo(() => {
    return DREAM_BOOK_DATA.filter((entry) => {
      const matchCategory = selectedCategory === 'all' || entry.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.meaning.toLowerCase().includes(q) ||
        entry.luckyNumbers.some((n) => n.includes(q));
      return matchCategory && matchQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyNumbers = (entry: DreamBookEntry) => {
    navigator.clipboard.writeText(entry.luckyNumbers.join(' - '));
    setCopiedId(entry.id);
    sound.playBallTick();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Intro Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold border border-red-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Kho Tàng Phong Thủy Dân Gian Việt Nam</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Sổ Mơ Toàn Tập & Giải Mã Điềm Báo
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Tra cứu ý nghĩa giấc mộng chiêm bao và các bộ số may mắn tương ứng theo kinh nghiệm dân gian đúc kết qua nhiều thế hệ.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm giấc mơ (ví dụ: rắn, tiền, vàng, cá chép, đám cưới...)"
            className="w-full pl-11 pr-4 py-3 rounded-lg border border-slate-300 focus:border-red-600 text-sm text-slate-900 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Xóa
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Results */}
      {filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs"
            >
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.meaning}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Bộ Số Dân Gian
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.luckyNumbers.map((num, i) => (
                      <span
                        key={i}
                        className="w-7 h-7 rounded-md bg-red-50 text-red-700 font-mono font-black text-xs flex items-center justify-center border border-red-200 shadow-2xs"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyNumbers(item)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Sao chép bộ số"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="text-base font-semibold text-slate-800">Không tìm thấy giấc mơ phù hợp</p>
          <p className="text-xs mt-1">
            Hãy thử tìm bằng từ khóa ngắn gọn hơn như "tiền", "nước", "chó", hoặc "xe".
          </p>
        </div>
      )}
    </div>
  );
};
