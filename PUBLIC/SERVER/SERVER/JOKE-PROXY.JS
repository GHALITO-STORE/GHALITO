// Minimal Express proxy for JokeAPI. Put in server/ or api/ if you want a backend endpoint.
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/joke', async (req, res) => {
  const { blacklistFlags, lang } = req.query;
  const params = new URLSearchParams();
  if (blacklistFlags) params.set('blacklistFlags', blacklistFlags);
  if (lang) params.set('lang', lang);

  const url = `https://v2.jokeapi.dev/joke/Any?${params.toString()}`;
  try {
    const r = await fetch(url);
    if (!r.ok) return res.status(502).json({ error: 'upstream failure', status: r.status });
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error('proxy error', err);
    res.status(502).json({ error: 'failed to fetch joke', detail: String(err) });
  }
});

export default app;
