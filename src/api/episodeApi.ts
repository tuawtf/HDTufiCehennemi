import { Episode } from '../types';
import { INITIAL_EPISODES } from '../data/initialEpisodes';

export async function getEpisodesApi(): Promise<Episode[]> {
  try {
    const res = await fetch('/api/episodes');
    if (!res.ok) throw new Error('API failed');
    const data = await res.json();
    if (data.success && Array.isArray(data.episodes)) {
      return data.episodes;
    }
  } catch (err) {
    console.warn('API fetch failed, falling back to local defaults:', err);
  }
  return INITIAL_EPISODES;
}

export async function addEpisodeApi(newEpisode: Episode): Promise<Episode[] | null> {
  try {
    const res = await fetch('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEpisode),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.episodes)) {
      return data.episodes;
    }
  } catch (err) {
    console.error('Failed to add episode:', err);
  }
  return null;
}

export async function updateEpisodeApi(episode: Episode): Promise<Episode[] | null> {
  try {
    const res = await fetch(`/api/episodes/${encodeURIComponent(episode.id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(episode),
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.episodes)) {
      return data.episodes;
    }
  } catch (err) {
    console.error('Failed to update episode:', err);
  }
  return null;
}

export async function deleteEpisodeApi(episodeId: string): Promise<Episode[] | null> {
  try {
    const res = await fetch(`/api/episodes/${encodeURIComponent(episodeId)}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.episodes)) {
      return data.episodes;
    }
  } catch (err) {
    console.error('Failed to delete episode:', err);
  }
  return null;
}

export async function resetEpisodesApi(): Promise<Episode[] | null> {
  try {
    const res = await fetch('/api/episodes/reset', {
      method: 'POST',
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.episodes)) {
      return data.episodes;
    }
  } catch (err) {
    console.error('Failed to reset episodes:', err);
  }
  return null;
}
