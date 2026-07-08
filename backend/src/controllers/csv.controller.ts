import { Request, Response } from 'express';
import multer from 'multer';
import { parseCsvPreviewData, processImport } from '../services/csv.service';
import { createJob, getJob } from '../services/job.service';
import { StreamProgress } from '../../../shared/src/types';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Multer configuration                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const isCSV =
      file.mimetype === 'text/csv' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/csv' ||
      file.originalname.toLowerCase().endsWith('.csv');

    if (isCSV) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed. Please upload a .csv file.'));
    }
  },
});

/* ─────────────────────────────────────────────────────────────────────────── */
/*  POST /api/csv/upload                                                        */
/*  Accepts the CSV file, returns preview + jobId (no AI yet)                  */
/* ─────────────────────────────────────────────────────────────────────────── */

export const uploadCsv = [
  upload.single('file'),
  (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No file provided. Please select a CSV file.' });
      }

      const preview = parseCsvPreviewData(req.file.buffer, req.file.originalname);

      // Store buffer in the job so the client doesn't re-send it at confirm time
      const jobId = createJob(req.file.buffer);

      return res.status(200).json({
        success: true,
        data: { jobId, preview },
      });
    } catch (err) {
      console.error('CSV upload error:', err);
      return res.status(400).json({
        success: false,
        error: err instanceof Error ? err.message : 'Failed to process CSV file',
      });
    }
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  POST /api/csv/import                                                        */
/*  Triggers AI extraction for a previously uploaded file                      */
/* ─────────────────────────────────────────────────────────────────────────── */

export const confirmImport = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.body as { jobId?: string };

    if (!jobId) {
      return res.status(400).json({ success: false, error: 'Missing jobId in request body' });
    }

    const job = getJob(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found. The session may have expired — please re-upload your file.',
      });
    }

    if (!job.buffer) {
      return res.status(400).json({ success: false, error: 'No CSV data associated with this job.' });
    }

    if (job.status !== 'pending') {
      return res.status(409).json({
        success: false,
        error: `Import is already ${job.status}. Refresh the page to start a new import.`,
      });
    }

    // Respond immediately — client subscribes to SSE stream for progress
    res.status(202).json({
      success: true,
      data: { jobId, status: 'processing', message: 'Import started. Connect to /api/csv/stream/:id for live progress.' },
    });

    // Process asynchronously (non-blocking)
    processImport(job.buffer, jobId).catch((err) => {
      console.error(`[Job ${jobId}] Unhandled processing error:`, err);
    });
  } catch (err) {
    console.error('Confirm import error:', err);
    return res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to start import',
    });
  }
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  GET /api/csv/status/:id                                                     */
/*  Polling fallback for job status                                             */
/* ─────────────────────────────────────────────────────────────────────────── */

export const getImportStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const job = getJob(id);

  if (!job) {
    return res.status(404).json({ success: false, error: 'Job not found' });
  }

  return res.json({
    success: true,
    data: {
      id: job.id,
      status: job.status,
      progress: job.progress,
      message: job.message,
      result: job.result,
      batchProgress: job.batchProgress,
      error: job.error,
    },
  });
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  GET /api/csv/stream/:id                                                     */
/*  Server-Sent Events stream for real-time progress                           */
/* ─────────────────────────────────────────────────────────────────────────── */

export const streamImportStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const job = getJob(id);

  if (!job) {
    res.status(404).end();
    return;
  }

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const writeEvent = (data: StreamProgress) => {
    try {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      // Flush buffered data to client immediately
      if (typeof (res as unknown as { flush?: () => void }).flush === 'function') {
        (res as unknown as { flush: () => void }).flush();
      }
    } catch {
      // Client disconnected
    }
  };

  // Send current state immediately
  const mapStage = (status: string): StreamProgress['stage'] => {
    switch (status) {
      case 'completed': return 'completed';
      case 'failed': return 'error';
      case 'processing': return 'ai_processing';
      default: return 'parsing';
    }
  };

  writeEvent({
    stage: mapStage(job.status),
    progress: job.progress,
    message: job.message,
    batchProgress: job.batchProgress.find((b) => b.status === 'processing'),
    result: job.result,
    error: job.error,
  });

  // If already complete, close immediately
  if (job.status === 'completed' || job.status === 'failed') {
    res.end();
    return;
  }

  // Subscribe to live progress events
  const handler = (data: StreamProgress) => {
    writeEvent(data);
    if (data.stage === 'completed' || data.stage === 'error') {
      cleanup();
    }
  };

  job.emitter.on('progress', handler);

  // Heartbeat every 20s to keep the connection alive through proxies
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      cleanup();
    }
  }, 20_000);

  const cleanup = () => {
    clearInterval(heartbeat);
    job.emitter.off('progress', handler);
    try { res.end(); } catch { /* already closed */ }
  };

  req.on('close', cleanup);
  req.on('error', cleanup);
};
