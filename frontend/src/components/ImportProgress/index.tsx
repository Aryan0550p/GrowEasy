'use client';

import type { StreamProgress, BatchProgress } from '../../types';
import styles from './ImportProgress.module.css';

interface ImportProgressProps {
  progress: StreamProgress | null;
  onCancel?: () => void;
}

const STAGE_LABELS: Record<StreamProgress['stage'], string> = {
  uploading: 'Uploading file...',
  parsing: 'Parsing CSV...',
  ai_processing: 'AI is extracting CRM fields...',
  completed: 'Import complete!',
  error: 'Import failed',
};

const STAGE_ICONS: Record<StreamProgress['stage'], React.ReactNode> = {
  uploading: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 15C3 17.8 3 19.2 3.88 20.1C4.76 21 6.17 21 9 21H15C17.8 21 19.2 21 20.1 20.1C21 19.2 21 17.8 21 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  parsing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M7 9H17M7 12H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  ai_processing: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L3 8L12 13L21 8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 16L12 21L21 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  completed: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

function BatchCard({ batch, index }: { batch: BatchProgress; index: number }) {
  const statusColors: Record<BatchProgress['status'], string> = {
    pending: styles.batchPending,
    processing: styles.batchProcessing,
    completed: styles.batchCompleted,
    failed: styles.batchFailed,
  };

  const statusIcons: Record<BatchProgress['status'], React.ReactNode> = {
    pending: <span className={styles.dotPending} aria-hidden="true" />,
    processing: <div className={styles.spinnerSmall} aria-hidden="true" />,
    completed: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    failed: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return (
    <div
      className={`${styles.batchCard} ${statusColors[batch.status]}`}
      title={batch.error}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className={styles.batchIcon}>{statusIcons[batch.status]}</div>
      <div className={styles.batchInfo}>
        <span className={styles.batchLabel}>Batch {batch.batchNumber}</span>
        <span className={styles.batchCount}>{batch.recordsInBatch} rows</span>
      </div>
      {batch.status === 'processing' && (
        <div className={styles.batchActiveBar} aria-hidden="true" />
      )}
    </div>
  );
}

export function ImportProgress({ progress, onCancel }: ImportProgressProps) {
  const stage = progress?.stage ?? 'ai_processing';
  const pct = progress?.progress ?? 0;
  const message = progress?.message ?? 'Starting AI extraction...';
  const isComplete = stage === 'completed';
  const isError = stage === 'error';
  const isActive = !isComplete && !isError;

  // We don't have batchProgress array here directly — build mock from StreamProgress
  const batchInfo = progress?.batchProgress;

  return (
    <div className={`${styles.wrapper} animate-slide-up`}>
      {/* Stage header */}
      <div className={`${styles.stageHeader} ${isComplete ? styles.stageComplete : isError ? styles.stageError : ''}`}>
        <div className={`${styles.stageIconWrap} ${isActive ? styles.stageIconActive : ''}`}>
          {STAGE_ICONS[stage]}
        </div>
        <div className={styles.stageText}>
          <h3 className={styles.stageTitle}>{STAGE_LABELS[stage]}</h3>
          <p className={styles.stageMessage}>{message}</p>
        </div>
        {isActive && (
          <div className={styles.liveIndicator}>
            <span className={styles.liveDot} aria-hidden="true" />
            <span>Live</span>
          </div>
        )}
      </div>

      {/* Overall progress */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Overall Progress</span>
          <span className={styles.progressPct}>{pct}%</span>
        </div>
        <div className="progress-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className={`progress-fill ${isComplete ? styles.progressComplete : isError ? styles.progressError : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Current batch info */}
      {batchInfo && (
        <div className={styles.currentBatch}>
          <div className={styles.currentBatchHeader}>
            <span className={styles.currentBatchLabel}>
              Processing Batch {batchInfo.batchNumber} of {batchInfo.totalBatches}
            </span>
            <span className={styles.currentBatchCount}>{batchInfo.recordsInBatch} records</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: batchInfo.status === 'completed' ? '100%' : batchInfo.status === 'processing' ? '60%' : '0%',
              }}
            />
          </div>
        </div>
      )}

      {/* AI processing animation */}
      {isActive && (
        <div className={styles.aiAnimation}>
          <div className={styles.neuralDots}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.neuralDot} style={{ animationDelay: `${i * 150}ms` }} aria-hidden="true" />
            ))}
          </div>
          <p className={styles.aiHint}>
            🤖 AI is mapping columns to CRM fields — this may take a moment for large files
          </p>
        </div>
      )}

      {/* Success state */}
      {isComplete && progress?.result && (
        <div className={styles.successSummary}>
          <div className={styles.successStat}>
            <span className={styles.successStatVal}>{progress.result.totalImported.toLocaleString()}</span>
            <span className={styles.successStatLabel}>Imported</span>
          </div>
          <div className={styles.successStat}>
            <span className={`${styles.successStatVal} ${styles.skippedVal}`}>{progress.result.totalSkipped.toLocaleString()}</span>
            <span className={styles.successStatLabel}>Skipped</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className={styles.errorBox} role="alert">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>{progress?.error ?? 'An unexpected error occurred during import.'}</span>
        </div>
      )}

      {/* Cancel button */}
      {isActive && onCancel && (
        <div className={styles.cancelRow}>
          <button id="cancel-import-btn" className="btn btn-ghost btn-sm" onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
