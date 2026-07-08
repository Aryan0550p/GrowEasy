import { parse } from 'csv-parse/sync';
import { ImportResult, CsvPreview } from '../../../shared/src/types';
import { extractWithAI, BatchResult } from './ai.service';
import { createJob, updateJob, getJob } from './job.service';
import { ENV } from '../config/env';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  CSV Preview (no AI)                                                         */
/* ─────────────────────────────────────────────────────────────────────────── */

export function parseCsvPreviewData(buffer: Buffer, filename: string): CsvPreview {
  const records = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_quotes: true,
    relax_column_count: true,
    skip_records_with_error: true,
  });

  if (!Array.isArray(records) || records.length === 0) {
    throw new Error('CSV file is empty or has no data rows. Please check the file and try again.');
  }

  const headers = Object.keys(records[0]);
  if (headers.length === 0) {
    throw new Error('CSV has no columns. Please ensure the first row contains headers.');
  }

  // Return up to 100 rows for preview
  const rows = records.slice(0, 100).map((record: Record<string, string>) => {
    const clean: Record<string, string> = {};
    for (const key of headers) {
      clean[key] = record[key] != null ? String(record[key]) : '';
    }
    return clean;
  });

  return {
    headers,
    rows,
    totalRows: records.length,
    filename,
    fileSize: buffer.length,
  };
}

export function parseCsvRecords(buffer: Buffer): Record<string, unknown>[] {
  return parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_quotes: true,
    relax_column_count: true,
    skip_records_with_error: true,
  }) as Record<string, unknown>[];
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  AI Import Processing                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */

export async function processImport(buffer: Buffer, jobId: string): Promise<ImportResult> {
  const { Readable } = require('stream');
  const { parse: parseStream } = require('csv-parse');

  const parser = Readable.from(buffer).pipe(parseStream({
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true,
    relax_quotes: true,
    relax_column_count: true,
    skip_records_with_error: true,
  }));

  updateJob(jobId, {
    status: 'processing',
    progress: 5,
    message: `Initializing incremental CSV parsing...`,
    batchProgress: [],
  });

  const allExtracted: ImportResult['imported'] = [];
  const allSkipped: ImportResult['skipped'] = [];
  const errors: string[] = [];

  const batchSize = Math.min(ENV.MAX_BATCH_SIZE || 50, 50);
  let currentBatch: Record<string, unknown>[] = [];
  let batchNum = 0;
  let totalProcessedRows = 0;

  const processBatch = async (batch: Record<string, unknown>[], start: number, batchIndex: number) => {
    // Add batch progress entry if not exists
    const currentJob = getJob(jobId);
    const batchProgress = [...(currentJob?.batchProgress ?? [])];
    
    // We don't know total batches yet, so we just append
    batchProgress[batchIndex - 1] = { 
      batchNumber: batchIndex, 
      totalBatches: batchIndex, // Estimated
      recordsInBatch: batch.length, 
      status: 'processing' 
    };

    updateJob(jobId, {
      progress: Math.min(95, 5 + batchIndex * 2), // Fake progress since total is unknown
      message: `AI processing batch ${batchIndex} (${batch.length} records)...`,
      batchProgress,
    });

    let retries = 0;
    let success = false;
    let result: BatchResult = { extracted: [], skipped: [] };

    while (!success && retries <= (ENV.MAX_RETRIES || 3)) {
      try {
        result = await extractWithAI(batch, start);
        success = true;
      } catch (err) {
        retries++;
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        if (retries > (ENV.MAX_RETRIES || 3)) {
          const msg = `Batch ${batchIndex} failed after retries: ${errMsg}`;
          errors.push(msg);
          console.error(msg);
          break;
        }
        const waitMs = (ENV.RETRY_DELAY_MS || 2000) * retries;
        console.warn(`Batch ${batchIndex} attempt ${retries} failed, retrying in ${waitMs}ms...`);
        await delay(waitMs);
      }
    }

    const finalBatchProgress = [...(getJob(jobId)?.batchProgress ?? [])];
    if (success) {
      allExtracted.push(...result.extracted);
      allSkipped.push(...result.skipped.map((s) => ({
        row: typeof s.row === 'number' ? s.row : start + 1,
        reason: s.reason,
        rawData: s.rawData,
      })));
      finalBatchProgress[batchIndex - 1] = { batchNumber: batchIndex, totalBatches: batchIndex, recordsInBatch: batch.length, status: 'completed' };
    } else {
      finalBatchProgress[batchIndex - 1] = {
        batchNumber: batchIndex,
        totalBatches: batchIndex,
        recordsInBatch: batch.length,
        status: 'failed',
        error: errors[errors.length - 1],
      };
    }

    updateJob(jobId, { batchProgress: finalBatchProgress });
  };

  try {
    for await (const record of parser) {
      currentBatch.push(record);
      if (currentBatch.length >= batchSize) {
        batchNum++;
        const start = totalProcessedRows;
        await processBatch(currentBatch, start, batchNum);
        totalProcessedRows += currentBatch.length;
        currentBatch = [];
      }
    }
    
    // Process remaining
    if (currentBatch.length > 0) {
      batchNum++;
      const start = totalProcessedRows;
      await processBatch(currentBatch, start, batchNum);
      totalProcessedRows += currentBatch.length;
    }
  } catch (err) {
    const message = `Stream parsing failed: ${err instanceof Error ? err.message : 'Unknown error'}`;
    updateJob(jobId, { status: 'failed', message, error: message, progress: 0 });
    throw err;
  }

  if (totalProcessedRows === 0) {
    const message = 'No records found in CSV file.';
    updateJob(jobId, { status: 'failed', message, error: message, progress: 0 });
    throw new Error(message);
  }

  const importResult: ImportResult = {
    imported: allExtracted,
    skipped: allSkipped,
    totalImported: allExtracted.length,
    totalSkipped: allSkipped.length,
    errors,
  };

  const allFailed = errors.length > 0 && allExtracted.length === 0;
  
  // Fix total batches visually
  const finalJob = getJob(jobId);
  if (finalJob && finalJob.batchProgress) {
    const fixedProgress = finalJob.batchProgress.map(bp => ({...bp, totalBatches: batchNum}));
    updateJob(jobId, { batchProgress: fixedProgress });
  }

  updateJob(jobId, {
    status: allFailed ? 'failed' : 'completed',
    progress: 100,
    message: allFailed
      ? `Import failed. ${errors.length} batch error(s).`
      : `Import complete. ${allExtracted.length} imported, ${allSkipped.length} skipped.`,
    result: importResult,
  });

  return importResult;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Helpers                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { getJob };
