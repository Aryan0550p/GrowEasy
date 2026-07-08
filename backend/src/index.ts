import 'dotenv/config';
import { ENV } from './config/env';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import csvRoutes from './routes/csv.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app = express();

// Security & logging
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
app.use(morgan(ENV.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/csv', csvRoutes);
app.use('/api/health', healthRoutes);

// 404 and error handlers
app.use(notFoundHandler);
app.use(errorHandler);

const server = app.listen(ENV.PORT, () => {
  console.log(`\n🚀 GrowEasy CSV Importer Backend`);
  console.log(`   Running on: http://localhost:${ENV.PORT}`);
  console.log(`   Environment: ${ENV.NODE_ENV}`);
  console.log(`   AI Provider: ${ENV.AI_PROVIDER} (${ENV.AI_MODEL})\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => process.exit(0));
});

export default app;
