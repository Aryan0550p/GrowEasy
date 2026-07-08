import { Router } from 'express';
import { ENV } from '../config/env';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
    aiProvider: ENV.AI_PROVIDER,
  });
});

export default router;
