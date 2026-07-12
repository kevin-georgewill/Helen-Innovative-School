import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import v1Router from './routes';
import errorHandler from './middleware/error';

// Express app factory. Exported (without app.listen) so it can run both as a
// long-lived server (local dev — see ../index.ts) and as a Vercel serverless
// function (see ../api/index.ts). An Express app is itself a (req, res) handler.
const app = express();

app.use(helmet());

// FRONTEND_URL may be a single origin or a comma-separated list (e.g. multiple dev ports).
const allowedOrigins = (process.env.FRONTEND_URL ?? '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1', v1Router);

app.use(errorHandler);

export default app;
