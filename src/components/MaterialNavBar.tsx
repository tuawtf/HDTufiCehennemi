import React from 'react';
import { Tv, ShieldCheck } from 'lucide-react';

interface MaterialNavBarProps {
  currentTab: 'episodes' | 'admin';
  onTabChange: (tab: 'episodes' | 'admin') => void;
}

export const MaterialNavBar: React.FC<MaterialNavBarProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1D1B20] border-t border-[#49454F] px-4 py-2 shadow-xl">
      <div className="grid grid-cols-2 items-center max-w-sm mx-auto">
        {/* Tab 1: Bölümler */}
        <button
          onClick={() => onTabChange('episodes')}
          className="flex flex-col items-center justify-center py-1 group"
        >
          <span
            className={`w-14 h-7 rounded-full flex items-center justify-center transition-all ${
              currentTab === 'episodes'
                ? 'bg-[#4F378B] text-[#EADDFF]'
                : 'text-[#CAC4D0]'
            }`}
          >
            <Tv className="w-4 h-4" />
          </span>
          <span
            className={`text-[11px] font-medium tracking-tight mt-1 ${
              currentTab === 'episodes'
                ? 'text-[#D0BCFF] font-semibold'
                : 'text-[#CAC4D0]'
            }`}
          >
            Bölümler
          </span>
        </button>

        {/* Tab 2: Yönetici Paneli */}
        <button
          onClick={() => onTabChange('admin')}
          className="flex flex-col items-center justify-center py-1 group"
        >
          <span
            className={`w-14 h-7 rounded-full flex items-center justify-center transition-all ${
              currentTab === 'admin'
                ? 'bg-[#4F378B] text-[#EADDFF]'
                : 'text-[#CAC4D0]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
          </span>
          <span
            className={`text-[11px] font-medium tracking-tight mt-1 ${
              currentTab === 'admin'
                ? 'text-[#D0BCFF] font-semibold'
                : 'text-[#CAC4D0]'
            }`}
          >
            Yönetici Paneli
          </span>
        </button>
      </div>
    </nav>
  );
};
