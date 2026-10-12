/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Episode } from './types';
import { INITIAL_EPISODES } from './data/initialEpisodes';
import { MaterialTopAppBar } from './components/MaterialTopAppBar';
import { MaterialNavBar } from './components/MaterialNavBar';
import { VideoPlayerSection } from './components/VideoPlayerSection';
import { EpisodeListSection } from './components/EpisodeListSection';
import { AdminPanelSection } from './components/AdminPanelSection';
import { FloatingResumeFab } from './components/FloatingResumeFab';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Always dark mode per user request
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  // Episodes state with localStorage
  const [episodes, setEpisodes] = useState<Episode[]>(() => {
    try {
      const saved = localStorage.getItem('hdtufi_episodes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_EPISODES;
  });

  // Simple watched episode IDs
  const [watchedEpisodeIds, setWatchedEpisodeIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('hdtufi_watched');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return new Set(parsed);
      }
    } catch {
      // Fallback
    }
    return new Set(['ys-s1-e01']);
  });

  // Current playing episode
  const [currentEpisodeId, setCurrentEpisodeId] = useState<string>(() => {
    return episodes[0]?.id || 'ys-s1-e01';
  });

  // Active navigation tab ('episodes' | 'admin')
  const [activeTab, setActiveTab] = useState<'episodes' | 'admin'>('episodes');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync episodes to localStorage
  useEffect(() => {
    localStorage.setItem('hdtufi_episodes', JSON.stringify(episodes));
  }, [episodes]);

  // Sync watched state to localStorage
  useEffect(() => {
    localStorage.setItem('hdtufi_watched', JSON.stringify(Array.from(watchedEpisodeIds)));
  }, [watchedEpisodeIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Find active episode object
  const currentEpisode = episodes.find((ep) => ep.id === currentEpisodeId) || episodes[0];

  // Episode indices for prev / next
  const currentIndex = episodes.findIndex((ep) => ep.id === currentEpisode?.id);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < episodes.length - 1;

  const handleSelectPrevious = () => {
    if (hasPrevious) {
      setCurrentEpisodeId(episodes[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectNext = () => {
    if (hasNext) {
      setCurrentEpisodeId(episodes[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectEpisode = (ep: Episode) => {
    setCurrentEpisodeId(ep.id);
    setActiveTab('episodes');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle watched status
  const handleToggleWatch = (episodeId: string) => {
    setWatchedEpisodeIds((prev) => {
      const next = new Set(prev);
      const ep = episodes.find((e) => e.id === episodeId);
      if (next.has(episodeId)) {
        next.delete(episodeId);
        showToast(`"${ep?.title}" izlenmedi olarak işaretlendi.`);
      } else {
        next.add(episodeId);
        showToast(`"${ep?.title}" izlendi olarak işaretlendi.`);
      }
      return next;
    });
  };

  // Admin actions
  const handleAddEpisode = (newEpisode: Episode) => {
    setEpisodes((prev) => [...prev, newEpisode]);
    setCurrentEpisodeId(newEpisode.id);
    setActiveTab('episodes');
  };

  const handleUpdateEpisode = (updated: Episode) => {
    setEpisodes((prev) => prev.map((ep) => (ep.id === updated.id ? updated : ep)));
  };

  const handleDeleteEpisode = (id: string) => {
    setEpisodes((prev) => prev.filter((ep) => ep.id !== id));
    setWatchedEpisodeIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    if (currentEpisodeId === id && episodes.length > 1) {
      const remaining = episodes.filter((ep) => ep.id !== id);
      setCurrentEpisodeId(remaining[0].id);
    }
    showToast('Bölüm başarıyla silindi.');
  };

  const handleResetToDefault = () => {
    setEpisodes(INITIAL_EPISODES);
    setWatchedEpisodeIds(new Set(['ys-s1-e01']));
    setCurrentEpisodeId(INITIAL_EPISODES[0].id);
    showToast('Bölümler varsayılan listeye sıfırlandı.');
  };

  const handleImportData = (data: { episodes: Episode[]; watchedIds?: string[] }) => {
    setEpisodes(data.episodes);
    if (data.watchedIds) {
      setWatchedEpisodeIds(new Set(data.watchedIds));
    }
    if (data.episodes.length > 0) {
      setCurrentEpisodeId(data.episodes[0].id);
    }
    showToast('Yedek başarıyla içe aktarıldı.');
  };

  // Find next unwatched episode for FAB
  const nextUnwatchedEpisode = episodes.find((ep) => !watchedEpisodeIds.has(ep.id));

  return (
    <div className="min-h-screen bg-[#141218] text-[#E6E0E9] flex flex-col transition-colors duration-200 pb-20 md:pb-12">
      {/* Material 3 Top App Bar */}
      <MaterialTopAppBar
        currentTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Tab 1: Episodes & Video Player */}
        {activeTab === 'episodes' && (
          <div className="space-y-8">
            {/* Embedded Video Stage */}
            {currentEpisode && (
              <VideoPlayerSection
                currentEpisode={currentEpisode}
                isWatched={watchedEpisodeIds.has(currentEpisode.id)}
                onToggleWatch={handleToggleWatch}
                onSelectPrevious={handleSelectPrevious}
                onSelectNext={handleSelectNext}
                hasPrevious={hasPrevious}
                hasNext={hasNext}
              />
            )}

            {/* Episode Grid & Filters */}
            <EpisodeListSection
              episodes={episodes}
              currentEpisodeId={currentEpisode?.id || ''}
              watchedEpisodeIds={watchedEpisodeIds}
              onSelectEpisode={handleSelectEpisode}
              onToggleWatch={handleToggleWatch}
              onOpenAdmin={() => setActiveTab('admin')}
            />
          </div>
        )}

        {/* Tab 2: Admin & Episode Management */}
        {activeTab === 'admin' && (
          <AdminPanelSection
            episodes={episodes}
            onAddEpisode={handleAddEpisode}
            onUpdateEpisode={handleUpdateEpisode}
            onDeleteEpisode={handleDeleteEpisode}
            onResetToDefault={handleResetToDefault}
            watchedEpisodeIds={watchedEpisodeIds}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Floating Resume Action Button (FAB) */}
      <FloatingResumeFab
        nextEpisode={nextUnwatchedEpisode}
        onResume={handleSelectEpisode}
        visible={!!nextUnwatchedEpisode && activeTab === 'episodes' && currentEpisodeId !== nextUnwatchedEpisode.id}
      />

      {/* Material 3 Bottom Navigation Bar for Mobile */}
      <MaterialNavBar
        currentTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Material 3 Snackbar / Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full bg-[#4F378B] text-[#EADDFF] border border-[#D0BCFF]/30 shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 shrink-0 text-[#D0BCFF]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
