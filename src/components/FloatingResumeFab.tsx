import React from 'react';
import { Play } from 'lucide-react';
import { Episode } from '../types';

interface FloatingResumeFabProps {
  nextEpisode?: Episode;
  onResume: (episode: Episode) => void;
  visible: boolean;
}

export const FloatingResumeFab: React.FC<FloatingResumeFabProps> = ({
  nextEpisode,
  onResume,
  visible,
}) => {
  if (!visible || !nextEpisode) return null;

  return (
    <div className="fixed bottom-20 md:bottom-8 right-5 sm:right-8 z-30">
      <button
        onClick={() => onResume(nextEpisode)}
        aria-label="Kaldığımız yerden izlemeye devam et"
        className="group px-5 py-3 rounded-full bg-[#D0BCFF] text-[#381E72] shadow-2xl hover:bg-[#EADDFF] hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
      >
        <span className="w-7 h-7 rounded-full bg-[#381E72]/15 flex items-center justify-center">
          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
        </span>
        <div className="text-left">
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-85 leading-none">
            Kaldığımız Yerden
          </div>
          <div className="text-xs font-semibold leading-tight mt-0.5 truncate max-w-[140px] sm:max-w-[200px]">
            S{nextEpisode.season}·B{nextEpisode.episodeNumber} {nextEpisode.title}
          </div>
        </div>
      </button>
    </div>
  );
};
