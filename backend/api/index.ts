import app from '../src/app';

// Vercel serverless entry. The Express app is itself a (req, res) handler, so we
// export it directly. vercel.json rewrites every path to this function, and Express
// does its own internal routing (/health, /api/v1/...).
export default app;
