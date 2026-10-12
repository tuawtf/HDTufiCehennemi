export type VideoSourceType = 'direct' | 'youtube' | 'embed' | 'drive';

export interface Episode {
  id: string;
  season: number;
  episodeNumber: number;
  title: string;
  duration: number; // in minutes
  description: string;
  videoUrl: string;
  videoType: VideoSourceType;
  thumbnailUrl?: string;
  airDate?: string;
  addedAt: string;
}

export interface WatchRecord {
  episodeId: string;
  watchedAt: string; // ISO string
  note?: string;
}

export interface CoupleProfile {
  partner1: string;
  partner2: string;
  startDate?: string;
  favoriteSeason?: number;
}
