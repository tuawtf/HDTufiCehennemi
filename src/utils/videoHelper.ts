import { VideoSourceType } from '../types';

export function resolveVideoSource(url: string, explicitType?: VideoSourceType): {
  type: VideoSourceType;
  embedUrl?: string;
  directUrl?: string;
  isPlaceholder?: boolean;
} {
  const trimmed = url.trim();

  // YouTube detection
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // Google Drive detection
  const isDrive = explicitType === 'drive' || trimmed.includes('drive.google.com');
  if (isDrive) {
    const isPlaceholder = trimmed.includes('/file/d/.../view') || trimmed.includes('/file/d/.../preview') || trimmed.includes('...');
    
    // Extract file ID
    const driveMatch = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1] && driveMatch[1] !== '...') {
      return {
        type: 'drive',
        embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
        isPlaceholder: false,
      };
    }

    // Direct /preview link check
    if (trimmed.includes('/preview')) {
      return {
        type: 'drive',
        embedUrl: trimmed,
        isPlaceholder,
      };
    }

    // Default replacement for /view
    const converted = trimmed.replace(/\/view(\?.*)?$/, '/preview');
    return {
      type: 'drive',
      embedUrl: converted.includes('/preview') ? converted : (trimmed ? `${trimmed}/preview` : ''),
      isPlaceholder,
    };
  }

  // Direct video
  if (
    explicitType === 'direct' ||
    trimmed.endsWith('.mp4') ||
    trimmed.endsWith('.webm') ||
    trimmed.endsWith('.ogg') ||
    trimmed.includes('commondatastorage.googleapis.com')
  ) {
    return {
      type: 'direct',
      directUrl: trimmed,
    };
  }

  // Generic embed
  if (explicitType === 'embed' || trimmed.startsWith('http')) {
    return {
      type: 'embed',
      embedUrl: trimmed,
    };
  }

  return {
    type: 'direct',
    directUrl: trimmed,
  };
}

export function formatDateTimeTR(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function formatDateOnlyTR(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}
