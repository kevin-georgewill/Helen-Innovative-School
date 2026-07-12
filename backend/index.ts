import app from './src/app';

// Local / long-lived server entry point (Railway/Render or `npm run dev`).
// On Vercel the app runs as a serverless function instead — see api/index.ts.
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`API running on port ${PORT}`));
