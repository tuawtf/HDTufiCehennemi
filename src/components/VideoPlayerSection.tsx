import React, { useState, useRef } from 'react';
import { Episode } from '../types';
import { resolveVideoSource } from '../utils/videoHelper';
import { CheckCircle2, ChevronLeft, ChevronRight, Film, Check } from 'lucide-react';

interface VideoPlayerSectionProps {
  currentEpisode: Episode;
  isWatched: boolean;
  onToggleWatch: (episodeId: string) => void;
  onSelectPrevious?: () => void;
  onSelectNext?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const VideoPlayerSection: React.FC<VideoPlayerSectionProps> = ({
  currentEpisode,
  isWatched,
  onToggleWatch,
  onSelectPrevious,
  onSelectNext,
  hasPrevious,
  hasNext,
}) => {
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const resolved = resolveVideoSource(currentEpisode.videoUrl, currentEpisode.videoType);

  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  return (
    <section className="w-full bg-[#1D1B20] rounded-3xl p-4 sm:p-6 border border-[#49454F] shadow-xl transition-colors duration-200">
      {/* Video Container */}
      <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group border border-[#49454F]/50">
        {resolved.type === 'direct' && resolved.directUrl ? (
          <video
            ref={videoRef}
            src={resolved.directUrl}
            controls
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : resolved.embedUrl ? (
          <iframe
            src={resolved.embedUrl}
            title={currentEpisode.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white bg-[#141218]">
            <p className="text-base font-semibold mb-2">Video kaynağı yüklenemedi</p>
            <p className="text-xs text-[#CAC4D0] max-w-md">
              Yönetici panelinden bu bölüme geçerli bir video URL'si (MP4, YouTube veya iframe embed) tanımlayabilirsiniz.
            </p>
          </div>
        )}

        {/* Video floating badge */}
        <div className="absolute top-3 left-3 bg-[#141218]/80 backdrop-blur-md px-3 py-1 rounded-full text-[#EADDFF] border border-[#4F378B]/40 text-xs font-medium flex items-center gap-1.5 pointer-events-none">
          <Film className="w-3.5 h-3.5 text-[#D0BCFF]" />
          <span>HDTufiCehennemi · Sezon {currentEpisode.season} Bölüm {currentEpisode.episodeNumber}</span>
        </div>
      </div>

      {/* Video Controls Bar & Episode Info */}
      <div className="mt-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#CAC4D0] mb-1">
            <span className="text-[#D0BCFF] font-semibold">Sezon {currentEpisode.season}</span>
            <span aria-hidden="true">·</span>
            <span>{currentEpisode.episodeNumber}. Bölüm</span>
            <span aria-hidden="true">·</span>
            <span>{currentEpisode.duration} dakika</span>
            {currentEpisode.airDate && (
              <>
                <span aria-hidden="true">·</span>
                <span>{currentEpisode.airDate}</span>
              </>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#E6E0E9]">
            {currentEpisode.title}
          </h1>
        </div>

        {/* Action Buttons: Mark Watched & Navigation */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Watched Toggle Button */}
          <button
            onClick={() => onToggleWatch(currentEpisode.id)}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm ${
              isWatched
                ? 'bg-[#4F378B] text-[#EADDFF] hover:bg-[#5E43A1]'
                : 'bg-[#D0BCFF] text-[#381E72] hover:bg-[#EADDFF]'
            }`}
          >
            {isWatched ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#D0BCFF]" />
                <span>İzlendi</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>İzlendi Olarak İşaretle</span>
              </>
            )}
          </button>

          {/* Episode Step Controls */}
          <div className="flex items-center gap-1 bg-[#211F26] p-1 rounded-full border border-[#49454F]">
            <button
              onClick={onSelectPrevious}
              disabled={!hasPrevious}
              aria-label="Önceki Bölüm"
              className="p-1.5 rounded-full text-[#CAC4D0] hover:bg-[#2B2930] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-[#E6E0E9]">
              {currentEpisode.episodeNumber}
            </span>
            <button
              onClick={onSelectNext}
              disabled={!hasNext}
              aria-label="Sonraki Bölüm"
              className="p-1.5 rounded-full text-[#CAC4D0] hover:bg-[#2B2930] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Video Speed Selector (If direct video) */}
          {resolved.type === 'direct' && (
            <div className="hidden sm:flex items-center gap-1 bg-[#211F26] px-2 py-1.5 rounded-full border border-[#49454F] text-xs">
              <span className="text-[11px] text-[#CAC4D0]">Hız:</span>
              {[1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                    playbackRate === rate
                      ? 'bg-[#D0BCFF] text-[#381E72] font-bold'
                      : 'text-[#CAC4D0] hover:text-white'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Episode Description */}
      <div className="mt-4 text-sm leading-relaxed text-[#CAC4D0] bg-[#141218]/70 p-4 rounded-2xl border border-[#49454F]/60">
        <p>{currentEpisode.description}</p>
      </div>
    </section>
  );
};
