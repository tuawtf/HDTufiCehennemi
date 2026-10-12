import React, { useState } from 'react';
import { Episode, VideoSourceType } from '../types';
import { ShieldCheck, Plus, Trash2, Edit3, Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';

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

  // Form states
  const [season, setSeason] = useState<number>(1);
  const [episodeNumber, setEpisodeNumber] = useState<number>(episodes.length + 1);
  const [title, setTitle] = useState<string>('');
  const [duration, setDuration] = useState<number>(21);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoType, setVideoType] = useState<VideoSourceType>('direct');
  const [description, setDescription] = useState<string>('');
  const [airDate, setAirDate] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
      setErrorMessage('Lütfen bir video linki (MP4, YouTube, Drive veya Embed) giriniz.');
      return;
    }

    if (editingEpisodeId) {
      // Update
      const updated: Episode = {
        id: editingEpisodeId,
        season,
        episodeNumber,
        title: title.trim(),
        duration: Number(duration) || 20,
        videoUrl: videoUrl.trim(),
        videoType,
        description: description.trim() || 'Açıklama belirtilmedi.',
        airDate: airDate.trim() || undefined,
        addedAt: new Date().toISOString(),
      };
      onUpdateEpisode(updated);
      setSuccessMessage('Bölüm başarıyla güncellendi!');
      cancelEdit();
    } else {
      // Add new
      const newEp: Episode = {
        id: `ys-s${season}-e${episodeNumber}-${Date.now()}`,
        season,
        episodeNumber,
        title: title.trim(),
        duration: Number(duration) || 20,
        videoUrl: videoUrl.trim(),
        videoType,
        description: description.trim() || 'Açıklama belirtilmedi.',
        airDate: airDate.trim() || undefined,
        addedAt: new Date().toISOString(),
      };
      onAddEpisode(newEp);
      setSuccessMessage(`Sezon ${season} Bölüm ${episodeNumber} başarıyla eklendi!`);
      cancelEdit();
    }

    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const fillSampleDirectLink = () => {
    setVideoUrl('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setVideoType('direct');
    if (!title) setTitle('Örnek Young Sheldon Bölümü');
    if (!description) setDescription('Sheldon ve Cooper ailesinin maceraları.');
  };

  const fillSampleYoutubeLink = () => {
    setVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    setVideoType('youtube');
    if (!title) setTitle('YouTube Video Bağlantılı Bölüm');
    if (!description) setDescription('YouTube üzerinden izlenecek bölüm video linki.');
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
                Buradan yeni dizi bölümleri ekleyebilir, video linklerini güncelleyebilir ve içerikleri yönetebilirsiniz.
              </p>
            </div>
          </div>

          {/* Quick backup button */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportBackupJSON}
              className="px-4 py-2 text-xs font-semibold rounded-full bg-[#211F26] border border-[#49454F] hover:bg-[#2B2930] text-[#E6E0E9] flex items-center gap-1.5 transition-all shadow-sm"
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
                <span>Yeni Bölüm Ekle</span>
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
                onChange={(e) => setDuration(parseInt(e.target.value) || 20)}
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
              placeholder="Örn: A Solar Calculator, a Game Ball..."
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
                Video Kaynağı (URL / Embed Linki)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fillSampleDirectLink}
                  className="text-[11px] text-[#D0BCFF] hover:underline"
                >
                  + Örnek MP4
                </button>
                <span className="text-[#49454F]">·</span>
                <button
                  type="button"
                  onClick={fillSampleYoutubeLink}
                  className="text-[11px] text-[#D0BCFF] hover:underline"
                >
                  + Örnek YouTube
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="url"
                placeholder="https://.../video.mp4 veya YouTube/Drive linki"
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
                <option value="direct">Doğrudan Video (MP4 / WebM)</option>
                <option value="youtube">YouTube Bağlantısı</option>
                <option value="drive">Google Drive Video</option>
                <option value="embed">Gömülü Oyuncu (Iframe Embed)</option>
              </select>
            </div>
            <p className="text-[11px] text-[#938F99]">
              İpucu: Doğrudan video URL'leri (MP4), YouTube linkleri ve Drive önizleme bağlantıları otomatik olarak optimize edilir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#CAC4D0] mb-1.5">
                Bölüm Özeti
              </label>
              <textarea
                rows={3}
                placeholder="Bölümde neler yaşanıyor?"
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
                  <p className="text-[11px] text-[#938F99] truncate max-w-md">
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
            Yedekleme ve Sıfırlama
          </h4>
          <p className="text-xs text-[#CAC4D0] mt-0.5">
            Bölüm listenizi JSON olarak indirebilir veya varsayılan listeye sıfırlayabilirsiniz.
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
              if (window.confirm('Tüm bölümleri varsayılan Young Sheldon listesine sıfırlamak istiyor musunuz?')) {
                onResetToDefault();
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-full bg-[#211F26] border border-[#49454F] hover:bg-rose-950/40 text-rose-400 flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Varsayılana Sıfırla</span>
          </button>
        </div>
      </div>
    </div>
  );
};
