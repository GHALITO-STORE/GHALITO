// Minimal server to proxy JokeAPI requests.
// Requires Node 18+ (has global fetch) or install node-fetch for older Node versions.
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Example: GET /api/joke -> proxies to JokeAPI
app.get('/api/joke', async (req, res) => {
  const { blacklistFlags, lang } = req.query;
  const params = new URLSearchParams();
  if (blacklistFlags) params.set('blacklistFlags', blacklistFlags);
  if (lang) params.set('lang', lang);

  const url = `https://v2.jokeapi.dev/joke/Any?${params.toString()}`;

  try {
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error('proxy error', err);
    res.status(502).json({ error: 'failed to fetch joke', detail: String(err) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Joke proxy running on http://localhost:${port}`));
