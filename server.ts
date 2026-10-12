import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const EPISODES_FILE = path.join(DATA_DIR, 'episodes.json');

app.use(express.json());

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Default episodes template
const DEFAULT_EPISODES = [
  {
    id: 's1-e01',
    season: 1,
    episodeNumber: 1,
    title: '1. Bölüm',
    duration: 45,
    description: 'Sezon 1, 1. Bölüm',
    videoUrl: 'https://drive.google.com/file/d/.../view',
    videoType: 'drive',
    addedAt: '2026-10-12T00:00:00.000Z',
  },
  {
    id: 's1-e02',
    season: 1,
    episodeNumber: 2,
    title: '2. Bölüm',
    duration: 45,
    description: 'Sezon 1, 2. Bölüm',
    videoUrl: 'https://drive.google.com/file/d/.../view',
    videoType: 'drive',
    addedAt: '2026-10-12T00:00:00.000Z',
  },
];

// Helper to read episodes from JSON file
function readEpisodes(): any[] {
  try {
    if (!fs.existsSync(EPISODES_FILE)) {
      fs.writeFileSync(EPISODES_FILE, JSON.stringify(DEFAULT_EPISODES, null, 2), 'utf-8');
      return DEFAULT_EPISODES;
    }
    const data = fs.readFileSync(EPISODES_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : DEFAULT_EPISODES;
  } catch (err) {
    console.error('Error reading episodes.json:', err);
    return DEFAULT_EPISODES;
  }
}

// Helper to write episodes to JSON file
function writeEpisodes(episodes: any[]): boolean {
  try {
    fs.writeFileSync(EPISODES_FILE, JSON.stringify(episodes, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing episodes.json:', err);
    return false;
  }
}

// Ensure file exists on boot
readEpisodes();

// --- REST API Endpoints for episodes.json ---

// 1. Get all episodes from episodes.json
app.get('/api/episodes', (req: Request, res: Response) => {
  const episodes = readEpisodes();
  res.json({ success: true, episodes });
});

// 2. Add new episode to episodes.json
app.post('/api/episodes', (req: Request, res: Response) => {
  const newEpisode = req.body;
  if (!newEpisode || !newEpisode.title || !newEpisode.videoUrl) {
    res.status(400).json({ success: false, error: 'Başlık ve video URL gereklidir.' });
    return;
  }

  const episodes = readEpisodes();
  episodes.push(newEpisode);
  const ok = writeEpisodes(episodes);

  if (ok) {
    res.json({ success: true, episode: newEpisode, episodes });
  } else {
    res.status(500).json({ success: false, error: 'episodes.json dosyasına yazılamadı.' });
  }
});

// 3. Update existing episode in episodes.json
app.put('/api/episodes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedData = req.body;

  const episodes = readEpisodes();
  const index = episodes.findIndex((ep) => ep.id === id);

  if (index === -1) {
    res.status(404).json({ success: false, error: 'Bölüm bulunamadı.' });
    return;
  }

  episodes[index] = { ...episodes[index], ...updatedData };
  const ok = writeEpisodes(episodes);

  if (ok) {
    res.json({ success: true, episode: episodes[index], episodes });
  } else {
    res.status(500).json({ success: false, error: 'Dosyaya yazılamadı.' });
  }
});

// 4. Delete episode from episodes.json
app.delete('/api/episodes/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const episodes = readEpisodes();
  const filtered = episodes.filter((ep) => ep.id !== id);

  const ok = writeEpisodes(filtered);
  if (ok) {
    res.json({ success: true, episodes: filtered });
  } else {
    res.status(500).json({ success: false, error: 'Dosyaya yazılamadı.' });
  }
});

// 5. Reset episodes.json to default
app.post('/api/episodes/reset', (req: Request, res: Response) => {
  const ok = writeEpisodes(DEFAULT_EPISODES);
  if (ok) {
    res.json({ success: true, episodes: DEFAULT_EPISODES });
  } else {
    res.status(500).json({ success: false, error: 'Sıfırlanamadı.' });
  }
});

// 6. Direct JSON raw file download
app.get('/api/episodes/raw', (req: Request, res: Response) => {
  res.download(EPISODES_FILE, 'episodes.json');
});

// --- Vite Dev & Production Static Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HDTufiCehennemi server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
