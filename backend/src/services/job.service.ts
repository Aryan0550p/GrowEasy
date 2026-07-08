import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import { ImportResult, BatchProgress, StreamProgress } from '../../../shared/src/types';

interface ImportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: ImportResult;
  batchProgress: BatchProgress[];
  error?: string;
  /** Stored CSV buffer so the client doesn't need to re-send the file on confirm */
  buffer?: Buffer;
  /** EventEmitter for SSE real-time streaming */
  emitter: EventEmitter;
  createdAt: Date;
  updatedAt: Date;
}

const jobs = new Map<string, ImportJob>();

export function createJob(buffer?: Buffer): string {
  const id = uuidv4();
  const emitter = new EventEmitter();
  emitter.setMaxListeners(25);

  const job: ImportJob = {
    id,
    status: 'pending',
    progress: 0,
    message: 'Initializing...',
    batchProgress: [],
    buffer,
    emitter,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  jobs.set(id, job);
  return id;
}

export function getJob(id: string): ImportJob | undefined {
  return jobs.get(id);
}

export function updateJob(
  id: string,
  updates: Partial<Omit<ImportJob, 'id' | 'createdAt' | 'emitter' | 'buffer'>>
): ImportJob | undefined {
  const job = jobs.get(id);
  if (!job) return undefined;

  const updated: ImportJob = { ...job, ...updates, updatedAt: new Date() };
  jobs.set(id, updated);

  // Emit progress event for all SSE listeners
  const currentBatch = updated.batchProgress.find((b) => b.status === 'processing');
  const stage: StreamProgress['stage'] =
    updated.status === 'completed'
      ? 'completed'
      : updated.status === 'failed'
      ? 'error'
      : updated.status === 'processing'
      ? 'ai_processing'
      : 'parsing';

  const event: StreamProgress = {
    stage,
    progress: updated.progress,
    message: updated.message,
    batchProgress: currentBatch,
    result: updated.result,
    error: updated.error,
  };

  job.emitter.emit('progress', event);
  return updated;
}

export function deleteJob(id: string): boolean {
  const job = jobs.get(id);
  if (job) {
    job.emitter.removeAllListeners();
    jobs.delete(id);
    return true;
  }
  return false;
}

export function cleanupOldJobs(maxAgeMs: number = 24 * 60 * 60 * 1000): number {
  const now = Date.now();
  let count = 0;
  for (const [id, job] of jobs.entries()) {
    if (now - job.createdAt.getTime() > maxAgeMs) {
      job.emitter.removeAllListeners();
      jobs.delete(id);
      count++;
    }
  }
  return count;
}

export type { ImportJob };
