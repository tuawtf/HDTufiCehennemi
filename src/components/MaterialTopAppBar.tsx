import React from 'react';
import { Film, ShieldCheck } from 'lucide-react';

interface TopAppBarProps {
  currentTab: 'episodes' | 'admin';
  onTabChange: (tab: 'episodes' | 'admin') => void;
}

export const MaterialTopAppBar: React.FC<TopAppBarProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#141218] border-b border-[#49454F] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (HDTufiCehennemi) */}
        <button
          onClick={() => onTabChange('episodes')}
          className="flex items-center gap-2.5 text-left text-lg font-bold tracking-tight text-[#E6E0E9] whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <span className="w-8 h-8 rounded-xl bg-[#4F378B] flex items-center justify-center text-[#D0BCFF] shadow-sm">
            <Film className="w-4 h-4" />
          </span>
          <span className="font-extrabold text-base sm:text-lg tracking-tight">
            HDTufiCehennemi
          </span>
        </button>

        {/* Zone 2: Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#CAC4D0]">
          <button
            onClick={() => onTabChange('episodes')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
              currentTab === 'episodes'
                ? 'text-[#D0BCFF] font-semibold'
                : 'hover:text-white'
            }`}
          >
            Bölümler
            {currentTab === 'episodes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D0BCFF] rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action (Yönetici Paneli) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onTabChange(currentTab === 'admin' ? 'episodes' : 'admin')}
            className={`px-4 py-2 text-xs font-semibold rounded-full flex items-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-sm ${
              currentTab === 'admin'
                ? 'bg-[#D0BCFF] text-[#381E72]'
                : 'bg-[#4F378B] text-[#EADDFF] hover:bg-[#5E43A1]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{currentTab === 'admin' ? 'İzleme Ekranı' : 'Yönetici Paneli'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
