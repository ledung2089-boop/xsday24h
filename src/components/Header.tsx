import React from 'react';
import { Ticket } from 'lucide-react';
import { XoSoDayLogo } from './Logo';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenQuickCheck: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenQuickCheck,
}) => {
  const navLinks = [
    { id: 'results', label: 'Kết Quả 3 Miền' },
    { id: 'check', label: 'Dò Vé Số' },
    { id: 'simulator', label: 'Quay Thử Thần Tài' },
    { id: 'schedule', label: 'Lịch Mở Thưởng' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          {/* Zone 1: Single brand wordmark with logo */}
          <button
            onClick={() => onTabChange('results')}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
          >
            <XoSoDayLogo size="sm" showText={true} />
          </button>

          {/* Zone 2: 4-6 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onTabChange(link.id)}
                  className={`whitespace-nowrap shrink-0 py-1 transition-colors relative cursor-pointer ${
                    isActive
                      ? 'text-red-600 font-bold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-[-21px] left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenQuickCheck}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-95 rounded-xl transition-all shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            >
              <Ticket className="w-4 h-4" />
              <span>Dò Vé Nhanh</span>
            </button>
          </div>
        </div>

        {/* Mobile secondary navigation scrollbar */}
        <div className="lg:hidden flex items-center gap-4 overflow-x-auto py-2.5 border-t border-slate-100 no-scrollbar text-xs font-medium text-slate-600">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onTabChange(link.id)}
                className={`whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md transition-colors ${
                  isActive
                    ? 'bg-red-50 text-red-600 font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
