// Re-export shared types for frontend use
export type {
  CrmLead,
  CrmStatus,
  DataSource,
  ImportResult,
  CsvPreview,
  BatchProgress,
  StreamProgress,
} from '../../shared/src/types';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Frontend-specific types                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

export type ImportStep = 1 | 2 | 3 | 4;

// Explicitly typed here to avoid circular re-import
export interface ImportState {
  step: ImportStep;
  file: File | null;
  jobId: string | null;
  preview: {
    headers: string[];
    rows: Record<string, string>[];
    totalRows: number;
    filename: string;
    fileSize: number;
  } | null;
  progress: {
    stage: 'uploading' | 'parsing' | 'ai_processing' | 'completed' | 'error';
    progress: number;
    message: string;
    batchProgress?: {
      batchNumber: number;
      totalBatches: number;
      recordsInBatch: number;
      status: 'pending' | 'processing' | 'completed' | 'failed';
      error?: string;
    };
    result?: {
      imported: Record<string, string | undefined>[];
      skipped: { row: number; reason: string; rawData: Record<string, unknown> }[];
      totalImported: number;
      totalSkipped: number;
      errors: string[];
    };
    error?: string;
  } | null;
  result: {
    imported: Record<string, string | undefined>[];
    skipped: { row: number; reason: string; rawData: Record<string, unknown> }[];
    totalImported: number;
    totalSkipped: number;
    errors: string[];
  } | null;
  error: string | null;
  isLoading: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
