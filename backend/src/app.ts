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
const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

allowedOrigins.push('http://localhost:3000');

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no Origin (Postman, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.options('*', cors());
app.use(express.json());
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1', v1Router);

app.use(errorHandler);

export default app;
