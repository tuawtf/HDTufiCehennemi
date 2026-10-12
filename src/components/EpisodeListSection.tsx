import React, { useState } from 'react';
import { Episode } from '../types';
import { Play, CheckCircle2, Search, Film } from 'lucide-react';

interface EpisodeListSectionProps {
  episodes: Episode[];
  currentEpisodeId: string;
  watchedEpisodeIds: Set<string>;
  onSelectEpisode: (episode: Episode) => void;
  onToggleWatch: (episodeId: string) => void;
  onOpenAdmin: () => void;
}

export const EpisodeListSection: React.FC<EpisodeListSectionProps> = ({
  episodes,
  currentEpisodeId,
  watchedEpisodeIds,
  onSelectEpisode,
  onToggleWatch,
  onOpenAdmin,
}) => {
  const [selectedSeason, setSelectedSeason] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract available seasons
  const seasons = Array.from(new Set(episodes.map((ep) => ep.season))).sort((a, b) => a - b);

  const filteredEpisodes = episodes.filter((ep) => {
    const matchesSeason = selectedSeason === 'all' || ep.season === selectedSeason;
    const matchesSearch =
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.episodeNumber.toString() === searchQuery.trim();
    return matchesSeason && matchesSearch;
  });

  return (
    <div className="w-full space-y-6">
      {/* Header & Controls Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#E6E0E9]">
            Young Sheldon Bölümleri
          </h2>
          <p className="text-xs sm:text-sm text-[#CAC4D0] mt-0.5">
            İzlemek istediğiniz bölümü seçin veya yeni bölümler ekleyin.
          </p>
        </div>

        {/* Search input & New Episode trigger */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-[#938F99] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Bölüm ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-full bg-[#1D1B20] border border-[#49454F] text-[#E6E0E9] placeholder-[#938F99] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
            />
          </div>

          <button
            onClick={onOpenAdmin}
            className="px-4 py-2 text-xs font-semibold rounded-full bg-[#4F378B] text-[#EADDFF] hover:bg-[#5E43A1] transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>+ Yeni Bölüm Ekle</span>
          </button>
        </div>
      </div>

      {/* Material 3 Filter Tabs / Segmented Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedSeason('all')}
          className={`px-4 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
            selectedSeason === 'all'
              ? 'bg-[#D0BCFF] text-[#381E72] font-bold shadow-sm'
              : 'bg-[#211F26] text-[#CAC4D0] hover:bg-[#2B2930] hover:text-white'
          }`}
        >
          Tüm Bölümler ({episodes.length})
        </button>

        {seasons.map((s) => {
          const count = episodes.filter((ep) => ep.season === s).length;
          return (
            <button
              key={s}
              onClick={() => setSelectedSeason(s)}
              className={`px-4 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                selectedSeason === s
                  ? 'bg-[#D0BCFF] text-[#381E72] font-bold shadow-sm'
                  : 'bg-[#211F26] text-[#CAC4D0] hover:bg-[#2B2930] hover:text-white'
              }`}
            >
              Sezon {s} ({count})
            </button>
          );
        })}
      </div>

      {/* Episodes Grid */}
      {filteredEpisodes.length === 0 ? (
        <div className="p-12 text-center bg-[#1D1B20] rounded-3xl border border-[#49454F]">
          <Film className="w-10 h-10 text-[#938F99] mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-[#E6E0E9]">Aranan kriterlere uygun bölüm bulunamadı</h3>
          <p className="text-xs text-[#CAC4D0] mt-1 max-w-sm mx-auto">
            Arama terimini değiştirebilir veya yönetim panelinden yeni bölüm ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEpisodes.map((episode) => {
            const isCurrent = episode.id === currentEpisodeId;
            const isWatched = watchedEpisodeIds.has(episode.id);

            return (
              <div
                key={episode.id}
                className={`flex flex-col justify-between p-4 rounded-3xl border transition-all duration-200 group ${
                  isCurrent
                    ? 'bg-[#2B2930] border-[#D0BCFF] shadow-lg ring-1 ring-[#D0BCFF]'
                    : 'bg-[#1D1B20] border-[#49454F] hover:border-[#938F99] hover:bg-[#211F26]'
                }`}
              >
                <div>
                  {/* Card Visual / Thumbnail Header */}
                  <div className="relative w-full h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-[#381E72] via-[#2B2930] to-[#141218] mb-3 flex flex-col justify-between p-3 text-white border border-[#49454F]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[#EADDFF]">
                        S{episode.season} · B{episode.episodeNumber}
                      </span>

                      {isWatched && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#4F378B] text-[#EADDFF]">
                          <CheckCircle2 className="w-3 h-3 text-[#D0BCFF]" />
                          <span>İzlendi</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-end justify-between">
                      <span className="text-[11px] text-[#CAC4D0]">
                        {episode.duration} dakika
                      </span>

                      {/* Play Button Overlay */}
                      <button
                        onClick={() => onSelectEpisode(episode)}
                        aria-label={`${episode.title} Oynat`}
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 shadow-md ${
                          isCurrent
                            ? 'bg-[#D0BCFF] text-[#381E72]'
                            : 'bg-white text-[#141218] hover:bg-[#EADDFF]'
                        }`}
                      >
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-sm sm:text-base font-bold text-[#E6E0E9] line-clamp-1 group-hover:text-[#D0BCFF] transition-colors">
                    {episode.title}
                  </h3>

                  <p className="text-xs text-[#CAC4D0] mt-1.5 line-clamp-2 leading-relaxed">
                    {episode.description}
                  </p>
                </div>

                {/* Footer Strip */}
                <div className="mt-4 pt-3 border-t border-[#49454F]/40 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-[#938F99]">
                    {isWatched ? 'İzlendi olarak işaretlendi' : 'Henüz izlenmedi'}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onToggleWatch(episode.id)}
                      title={isWatched ? 'İzlenmedi olarak işaretle' : 'İzlendi olarak işaretle'}
                      className={`p-1.5 rounded-full transition-colors ${
                        isWatched
                          ? 'text-[#D0BCFF] hover:bg-[#4F378B]/40'
                          : 'text-[#938F99] hover:text-[#D0BCFF] hover:bg-[#2B2930]'
                      }`}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isWatched ? 'fill-[#4F378B]' : ''}`} />
                    </button>

                    <button
                      onClick={() => onSelectEpisode(episode)}
                      className="px-3 py-1 text-xs font-semibold rounded-full bg-[#2B2930] hover:bg-[#D0BCFF] hover:text-[#381E72] text-[#E6E0E9] transition-all"
                    >
                      {isCurrent ? 'Oynatılıyor' : 'İzle'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
