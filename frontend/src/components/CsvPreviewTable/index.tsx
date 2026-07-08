'use client';

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CsvPreview } from '../../types';
import { formatFileSize } from '../../lib/csvExport';
import styles from './CsvPreviewTable.module.css';

interface CsvPreviewTableProps {
  preview: CsvPreview;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function CsvPreviewTable({ preview, onConfirm, onBack, isLoading }: CsvPreviewTableProps) {
  const { headers, rows, totalRows, filename, fileSize } = preview;
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualized rows — only render visible ones for performance
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44, // row height
    overscan: 10,
  });

  return (
    <div className={`${styles.wrapper} animate-slide-up`}>
      {/* File info bar */}
      <div className={styles.fileInfo}>
        <div className={styles.fileInfoLeft}>
          <div className={styles.fileIcon} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V9L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="13 2 13 9 20 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <p className={styles.filename}>{filename}</p>
            <p className={styles.fileSize}>{formatFileSize(fileSize)}</p>
          </div>
        </div>
        <div className={styles.fileStats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalRows.toLocaleString()}</span>
            <span className={styles.statLabel}>Total Rows</span>
          </div>
          <div className={styles.statDivider} aria-hidden="true" />
          <div className={styles.stat}>
            <span className={styles.statValue}>{headers.length}</span>
            <span className={styles.statLabel}>Columns</span>
          </div>
          {totalRows > rows.length && (
            <>
              <div className={styles.statDivider} aria-hidden="true" />
              <div className={styles.stat}>
                <span className={`${styles.statValue} ${styles.previewNote}`}>
                  Showing {rows.length}
                </span>
                <span className={styles.statLabel}>Preview rows</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Table container */}
      <div className={styles.tableContainer}>
        {/* Sticky horizontal header */}
        <div className={styles.tableHeader}>
          <table className={styles.headerTable}>
            <thead>
              <tr>
                <th className={styles.rowNumTh} aria-label="Row number">#</th>
                {headers.map((h: string) => (
                  <th key={h} className={styles.th} title={h}>
                    <span className="truncate">{h}</span>
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* Virtualized scrollable body */}
        <div
          ref={parentRef}
          className={styles.scrollBody}
          style={{ height: Math.min(rows.length * 44, 400) + 'px' }}
        >
          <div style={{ height: rowVirtualizer.getTotalSize() + 'px', position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index];
              return (
                <div
                  key={virtualRow.key}
                  style={{
                    position: 'absolute',
                    top: virtualRow.start + 'px',
                    left: 0,
                    width: '100%',
                    height: virtualRow.size + 'px',
                  }}
                >
                  <table className={styles.rowTable}>
                    <tbody>
                      <tr className={styles.tr} data-odd={virtualRow.index % 2 === 1 ? 'true' : 'false'}>
                        <td className={styles.rowNumTd}>{virtualRow.index + 1}</td>
                        {headers.map((h: string) => (
                          <td key={h} className={styles.td} title={row[h]}>
                            <span className="truncate">{row[h] || <span className={styles.empty}>—</span>}</span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {totalRows > rows.length && (
        <p className={styles.truncationNote}>
          📋 Showing first {rows.length} of {totalRows.toLocaleString()} rows. All {totalRows.toLocaleString()} rows will be processed by AI.
        </p>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        <button id="back-to-upload-btn" className="btn btn-secondary" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <div className={styles.confirmSection}>
          <div className={styles.confirmInfo}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>AI will process all {totalRows.toLocaleString()} records</span>
          </div>
          <button
            id="confirm-import-btn"
            className="btn btn-primary btn-lg"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className={styles.btnSpinner} aria-hidden="true" />
                Starting...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 3L3 8L12 13L21 8L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 16L12 21L21 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Confirm & Run AI Import
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
