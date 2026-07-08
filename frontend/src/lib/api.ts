import type { CsvPreview, ImportResult, StreamProgress } from '../../../shared/src/types';

const BASE_URL =
  typeof window !== 'undefined'
    ? '' // Use Next.js rewrites in browser (relative path)
    : process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}`
    : 'http://localhost:3001';

const API_BASE = `${BASE_URL}/api`;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Types                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

export interface UploadResponse {
  jobId: string;
  preview: CsvPreview;
}

export interface ImportStartResponse {
  jobId: string;
  status: string;
  message: string;
}

export interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: ImportResult;
  batchProgress?: StreamProgress['batchProgress'][];
  error?: string;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Base fetcher                                                                */
/* ─────────────────────────────────────────────────────────────────────────── */

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, options);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error ?? `Request failed with status ${res.status}`);
  }

  return data.data as T;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  API calls                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

/** Upload CSV file — returns preview + jobId */
export async function uploadCsv(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return apiFetch<UploadResponse>('/csv/upload', { method: 'POST', body: formData });
}

/** Trigger AI extraction */
export async function confirmImport(jobId: string): Promise<ImportStartResponse> {
  return apiFetch<ImportStartResponse>('/csv/import', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  });
}

/** Poll for job status */
export async function getJobStatus(jobId: string): Promise<JobStatus> {
  return apiFetch<JobStatus>(`/csv/status/${jobId}`);
}

/** Get SSE stream URL for a job */
export function getStreamUrl(jobId: string): string {
  // Always use relative path in browser (Next.js rewrites handle it)
  return `/api/csv/stream/${jobId}`;
}

/** Health check */
export async function checkHealth(): Promise<{ status: string; aiProvider: string }> {
  return apiFetch('/health');
}
