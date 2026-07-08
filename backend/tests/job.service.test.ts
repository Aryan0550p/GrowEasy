import { describe, it, expect } from 'vitest';
import { createJob, getJob, updateJob, deleteJob, cleanupOldJobs } from '../src/services/job.service';

describe('Job Service', () => {
  it('creates a job with default pending status', () => {
    const id = createJob();
    const job = getJob(id);
    expect(job).toBeDefined();
    expect(job?.status).toBe('pending');
    expect(job?.progress).toBe(0);
    expect(job?.batchProgress).toHaveLength(0);
  });

  it('stores buffer when provided', () => {
    const buf = Buffer.from('name,email\nJohn,john@test.com');
    const id = createJob(buf);
    const job = getJob(id);
    expect(job?.buffer).toBeDefined();
    expect(job?.buffer?.toString()).toContain('John');
  });

  it('updates job fields correctly', () => {
    const id = createJob();
    updateJob(id, { status: 'processing', progress: 50, message: 'Halfway' });
    const job = getJob(id);
    expect(job?.status).toBe('processing');
    expect(job?.progress).toBe(50);
    expect(job?.message).toBe('Halfway');
  });

  it('emits progress events via EventEmitter', () => {
    const id = createJob();
    const job = getJob(id);
    const events: unknown[] = [];
    job?.emitter.on('progress', (e) => events.push(e));
    updateJob(id, { progress: 75, message: 'Almost done' });
    expect(events).toHaveLength(1);
  });

  it('deletes a job and removes it from memory', () => {
    const id = createJob();
    expect(getJob(id)).toBeDefined();
    deleteJob(id);
    expect(getJob(id)).toBeUndefined();
  });

  it('cleanupOldJobs removes expired jobs', async () => {
    const id = createJob();
    // Force old createdAt
    const job = getJob(id)!;
    (job as unknown as { createdAt: Date }).createdAt = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const removed = cleanupOldJobs(24 * 60 * 60 * 1000);
    expect(removed).toBeGreaterThanOrEqual(1);
    expect(getJob(id)).toBeUndefined();
  });

  it('returns undefined for unknown job id', () => {
    expect(getJob('non-existent-id')).toBeUndefined();
  });
});
