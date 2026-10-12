import React, { useState } from 'react';
import { Episode, VideoSourceType } from '../types';
import { ShieldCheck, Plus, Trash2, Edit3, Download, Upload, RotateCcw, Check, AlertCircle, Copy, Code2 } from 'lucide-react';

interface AdminPanelSectionProps {
  episodes: Episode[];
  onAddEpisode: (episode: Episode) => void;
  onUpdateEpisode: (episode: Episode) => void;
  onDeleteEpisode: (episodeId: string) => void;
  onResetToDefault: () => void;
  watchedEpisodeIds: Set<string>;
  onImportData: (data: { episodes: Episode[]; watchedIds?: string[] }) => void;
}

export const AdminPanelSection: React.FC<AdminPanelSectionProps> = ({
  episodes,
  onAddEpisode,
  onUpdateEpisode,
  onDeleteEpisode,
  onResetToDefault,
  watchedEpisodeIds,
  onImportData,
}) => {
  const [editingEpisodeId, setEditingEpisodeId] = useState<string | null>(null);

  // Form states (Default to Drive)
  const [season, setSeason] = useState<number>(1);
  const [episodeNumber, setEpisodeNumber] = useState<number>(episodes.length + 1);
  const [title, setTitle] = useState<string>('');
  const [duration, setDuration] = useState<number>(45);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoType, setVideoType] = useState<VideoSourceType>('drive');
  const [description, setDescription] = useState<string>('');
  const [airDate, setAirDate] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCodeExport, setShowCodeExport] = useState<boolean>(false);

  const startEdit = (episode: Episode) => {
    setEditingEpisodeId(episode.id);
    setSeason(episode.season);
    setEpisodeNumber(episode.episodeNumber);
    setTitle(episode.title);
    setDuration(episode.duration);
    setVideoUrl(episode.videoUrl);
    setVideoType(episode.videoType);
    setDescription(episode.description);
    setAirDate(episode.airDate || '');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingEpisodeId(null);
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setAirDate('');
    setVideoType('drive');
    setEpisodeNumber(episodes.length + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage('Lütfen bölüm başlığını giriniz.');
      return;
    }

    if (!videoUrl.trim()) {
      setErrorMessage('Lütfen Google Drive veya video linkini giriniz.');
      return;
    }

    if (editingEpisodeId) {
      // Update
      const updated: Episode = {
        id: editingEpisodeId,
        season,
        episodeNumber,
        title: title.trim(),
        duration: Number(duration) || 45,
        videoUrl: videoUrl.trim(),
        videoType,
        description: description.trim() || `Sezon ${season}, ${episodeNumber}. Bölüm`,
        airDate: airDate.trim() || undefined,
        addedAt: new Date().toISOString(),
      };
      onUpdateEpisode(updated);
      setSuccessMessage('Bölüm başarıyla güncellendi!');
      cancelEdit();
    } else {
      // Add new
      const newEp: Episode = {
        id: `s${season}-e${episodeNumber}-${Date.now()}`,
        season,
        episodeNumber,
        title: title.trim(),
        duration: Number(duration) || 45,
        videoUrl: videoUrl.trim(),
        videoType,
        description: description.trim() || `Sezon ${season}, ${episodeNumber}. Bölüm`,
        airDate: airDate.trim() || undefined,
        addedAt: new Date().toISOString(),
      };
      onAddEpisode(newEp);
      setSuccessMessage(`Sezon ${season} Bölüm ${episodeNumber} başarıyla eklendi!`);
      cancelEdit();
    }

    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const fillSampleDriveLink = () => {
    setVideoUrl('https://drive.google.com/file/d/1exampleDriveFileId/view');
    setVideoType('drive');
    if (!title) setTitle(`${season}. Sezon ${episodeNumber}. Bölüm`);
    if (!description) setDescription(`${season}. Sezon ${episodeNumber}. Bölüm Google Drive videosu.`);
  };

  const exportBackupJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      episodes,
      watchedIds: Array.from(watchedEpisodeIds),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hdtuficehennemi-yedek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyInitialEpisodesCode = () => {
    const code = `import { Episode } from '../types';\n\nexport const SHOW_TITLE = 'Dizi';\n\nexport const INITIAL_EPISODES: Episode[] = ${JSON.stringify(
      episodes,
      null,
      2
    )};\n`;
    navigator.clipboard.writeText(code).then(() => {
      setSuccessMessage('src/data/initialEpisodes.ts kod içeriği panoya kopyalandı!');
      setTimeout(() => setSuccessMessage(null), 4000);
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed.episodes)) {
          onImportData({
            episodes: parsed.episodes,
            watchedIds: Array.isArray(parsed.watchedIds) ? parsed.watchedIds : undefined,
          });
          setSuccessMessage('Yedek başarıyla yüklendi!');
          setTimeout(() => setSuccessMessage(null), 4000);
        } else {
          setErrorMessage('Geçersiz yedek dosyası formatı.');
        }
      } catch {
        setErrorMessage('Yedek dosyası okunurken hata oluştu.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full space-y-8">
      {/* Admin Welcome Banner */}
      <div className="bg-[#1D1B20] p-6 rounded-3xl border border-[#49454F] shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#4F378B] flex items-center justify-center text-[#D0BCFF] shrink-0 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#E6E0E9]">
                HDTufiCehennemi Yönetici Paneli
              </h2>
              <p className="text-xs sm:text-sm text-[#CAC4D0]">
                Bölüm listesi doğrudan <code className="text-[#D0BCFF]">src/data/initialEpisodes.ts</code> dosyasından okunur ve tüm cihazlarda aynı görünür.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={copyInitialEpisodesCode}
              title="Tüm cihazlarda kalıcı olması için dosya kodunu kopyalar"
              className="px-3.5 py-2 text-xs font-semibold rounded-full bg-[#4F378B] hover:bg-[#5E43A1] text-[#EADDFF] flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Copy className="w-3.5 h-3.5 text-[#D0BCFF]" />
              <span>initialEpisodes.ts Kodunu Kopyala</span>
            </button>

            <button
              onClick={exportBackupJSON}
              className="px-3.5 py-2 text-xs font-semibold rounded-full bg-[#211F26] border border-[#49454F] hover:bg-[#2B2930] text-[#E6E0E9] flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#D0BCFF]" />
              <span>Yedek İndir (JSON)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success / Error Notification */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-[#4F378B] text-[#EADDFF] flex items-center gap-2 text-sm font-medium border border-[#D0BCFF]/30">
          <Check className="w-4 h-4 shrink-0 text-[#D0BCFF]" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-950/70 text-rose-200 border border-rose-800 flex items-center gap-2 text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Episode Creation & Edit Form */}
      <div className="bg-[#1D1B20] p-6 sm:p-8 rounded-3xl border border-[#49454F] shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-[#E6E0E9] flex items-center gap-2">
            {editingEpisodeId ? (
              <>
                <Edit3 className="w-5 h-5 text-[#D0BCFF]" />
                <span>Bölümü Düzenle</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 text-[#D0BCFF]" />
                <span>Yeni Google Drive Bölümü Ekle</span>
              </>
            )}
          </h3>

          {editingEpisodeId && (
            <button
              onClick={cancelEdit}
              className="text-xs text-[#CAC4D0] hover:text-[#D0BCFF] underline"
            >
              Düzenlemeyi İptal Et
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#CAC4D0] mb-1.5">
                Sezon Numarası
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={season}
                onChange={(e) => setSeason(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141218] border border-[#49454F] text-sm text-[#E6E0E9] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CAC4D0] mb-1.5">
                Bölüm Numarası
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141218] border border-[#49454F] text-sm text-[#E6E0E9] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CAC4D0] mb-1.5">
                Bölüm Süresi (Dakika)
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 45)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141218] border border-[#49454F] text-sm text-[#E6E0E9] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#CAC4D0] mb-1.5">
              Bölüm Başlığı
            </label>
            <input
              type="text"
              placeholder="Örn: 1. Bölüm veya Pilot..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141218] border border-[#49454F] text-sm text-[#E6E0E9] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
              required
            />
          </div>

          {/* Video URL & Video Type */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-[#CAC4D0]">
                Google Drive Video Linki
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillSampleDriveLink}
                  className="text-[11px] text-[#D0BCFF] hover:underline"
                >
                  + Örnek Drive Linki
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/FILE_ID/view"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#141218] border border-[#49454F] text-sm text-[#E6E0E9] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
                required
              />

              <select
                value={videoType}
                onChange={(e) => setVideoType(e.target.value as VideoSourceType)}
                className="px-3.5 py-2.5 rounded-xl bg-[#141218] border border-[#49454F] text-xs font-medium text-[#E6E0E9] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
              >
                <option value="drive">Google Drive</option>
                <option value="direct">Doğrudan Video (MP4)</option>
                <option value="youtube">YouTube</option>
                <option value="embed">Gömülü (Embed)</option>
              </select>
            </div>
            <p className="text-[11px] text-[#938F99]">
              Google Drive bağlantıları (<code className="text-[#D0BCFF]">/view</code> veya <code className="text-[#D0BCFF]">/preview</code>) otomatik olarak gömülü tam ekran oynatıcıya çevrilir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#CAC4D0] mb-1.5">
                Bölüm Özeti
              </label>
              <textarea
                rows={3}
                placeholder="Bölüm özeti..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141218] border border-[#49454F] text-sm text-[#E6E0E9] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#CAC4D0] mb-1.5">
                Yayın Tarihi (İsteğe Bağlı)
              </label>
              <input
                type="text"
                placeholder="Örn: 12 Ekim 2026"
                value={airDate}
                onChange={(e) => setAirDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#141218] border border-[#49454F] text-sm text-[#E6E0E9] focus:outline-none focus:ring-2 focus:ring-[#D0BCFF]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            {editingEpisodeId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-[#49454F] text-[#CAC4D0] hover:bg-[#211F26]"
              >
                Vazgeç
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold rounded-full bg-[#D0BCFF] text-[#381E72] hover:bg-[#EADDFF] transition-all shadow-md flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editingEpisodeId ? 'Değişiklikleri Kaydet' : 'Bölümü Listeye Ekle'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Episodes Management Table */}
      <div className="bg-[#1D1B20] p-6 rounded-3xl border border-[#49454F] shadow-lg">
        <h3 className="text-base font-bold text-[#E6E0E9] mb-4">
          Mevcut Bölümler ({episodes.length})
        </h3>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {episodes.map((ep) => (
            <div
              key={ep.id}
              className="p-3.5 rounded-2xl bg-[#141218] border border-[#49454F]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-12 h-8 rounded-lg bg-[#4F378B] text-[#EADDFF] font-bold text-xs flex items-center justify-center shrink-0">
                  S{ep.season} B{ep.episodeNumber}
                </span>

                <div>
                  <h4 className="font-bold text-[#E6E0E9] text-sm">
                    {ep.title}
                  </h4>
                  <p className="text-[11px] text-[#938F99] truncate max-w-md font-mono">
                    {ep.videoUrl}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                <button
                  onClick={() => startEdit(ep)}
                  title="Düzenle"
                  className="p-2 rounded-full text-[#CAC4D0] hover:bg-[#2B2930] hover:text-white transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`"${ep.title}" bölümünü silmek istediğinizden emin misiniz?`)) {
                      onDeleteEpisode(ep.id);
                    }
                  }}
                  title="Sil"
                  className="p-2 rounded-full text-rose-400 hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Data Recovery & Default Reset */}
      <div className="p-6 rounded-3xl bg-[#1D1B20] border border-[#49454F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#E6E0E9]">
            initialEpisodes.ts Dosyasına Sıfırlama
          </h4>
          <p className="text-xs text-[#CAC4D0] mt-0.5">
            Bölümleri her zaman <code className="text-[#D0BCFF]">src/data/initialEpisodes.ts</code> dosyasındaki haline döndürebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="px-4 py-2 text-xs font-semibold rounded-full bg-[#211F26] border border-[#49454F] hover:bg-[#2B2930] text-[#E6E0E9] cursor-pointer flex items-center gap-1.5 transition-all">
            <Upload className="w-3.5 h-3.5 text-[#D0BCFF]" />
            <span>Yedek Dosyası Yükle</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (window.confirm('Tüm bölümleri src/data/initialEpisodes.ts dosyasındaki orijinal haline getirmek istiyor musunuz?')) {
                onResetToDefault();
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-full bg-[#211F26] border border-[#49454F] hover:bg-rose-950/40 text-rose-400 flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Dosyadaki Listeye Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
};
