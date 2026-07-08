import { Router } from 'express';
import { uploadCsv, confirmImport, getImportStatus, streamImportStatus } from '../controllers/csv.controller';

const router = Router();

/** Step 1 — Upload CSV, get preview + jobId (no AI) */
router.post('/upload', uploadCsv);

/** Step 3 — Trigger AI extraction for a previously uploaded job */
router.post('/import', confirmImport);

/** Polling fallback — get job status */
router.get('/status/:id', getImportStatus);

/** SSE stream — real-time progress events */
router.get('/stream/:id', streamImportStatus);

export default router;
