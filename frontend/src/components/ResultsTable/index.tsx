'use client';

import { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { ImportResult, CrmLead } from '../../types';
import { exportToCsv } from '../../lib/csvExport';
import styles from './ResultsTable.module.css';

interface ResultsTableProps {
  result: ImportResult;
  onReset: () => void;
}

type Tab = 'imported' | 'skipped';

const CRM_STATUS_COLORS: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: 'badge-success',
  SALE_DONE:           'badge-brand',
  DID_NOT_CONNECT:     'badge-warning',
  BAD_LEAD:            'badge-danger',
};

const CRM_STATUS_LABELS: Record<string, string> = {
  GOOD_LEAD_FOLLOW_UP: 'Follow Up',
  SALE_DONE:           'Sale Done',
  DID_NOT_CONNECT:     'No Connect',
  BAD_LEAD:            'Bad Lead',
};

const LEAD_COLUMNS: { key: keyof CrmLead; label: string; width: number }[] = [
  { key: 'name',                        label: 'Name',        width: 180 },
  { key: 'email',                       label: 'Email',       width: 200 },
  { key: 'mobile_without_country_code', label: 'Mobile',      width: 140 },
  { key: 'country_code',                label: 'CC',          width: 70 },
  { key: 'company',                     label: 'Company',     width: 160 },
  { key: 'city',                        label: 'City',        width: 120 },
  { key: 'state',                       label: 'State',       width: 120 },
  { key: 'country',                     label: 'Country',     width: 110 },
  { key: 'crm_status',                  label: 'Status',      width: 140 },
  { key: 'data_source',                 label: 'Source',      width: 130 },
  { key: 'crm_note',                    label: 'Note',        width: 200 },
  { key: 'lead_owner',                  label: 'Owner',       width: 160 },
  { key: 'created_at',                  label: 'Created At',  width: 170 },
  { key: 'description',                 label: 'Description', width: 200 },
];

function LeadRow({ lead, index }: { lead: CrmLead; index: number }) {
  const formatDate = (v?: string) => {
    if (!v) return '';
    try { return new Date(v).toLocaleString(); } catch { return v; }
  };

  return (
    <div className={`${styles.row} ${index % 2 === 1 ? styles.rowOdd : ''}`}>
      {LEAD_COLUMNS.map(({ key, width }) => (
        <div key={key} className={styles.cell} style={{ width, minWidth: width }}>
          {key === 'crm_status' && lead[key] ? (
            <span className={`badge ${CRM_STATUS_COLORS[lead[key]!] ?? 'badge-neutral'}`}>
              {CRM_STATUS_LABELS[lead[key]!] ?? lead[key]}
            </span>
          ) : key === 'created_at' ? (
            <span className={styles.mono}>{formatDate(lead[key])}</span>
          ) : key === 'email' ? (
            <a href={`mailto:${lead[key]}`} className={styles.emailLink} title={lead[key]}>{lead[key] ?? ''}</a>
          ) : (
            <span className="truncate" title={lead[key] ?? ''}>{lead[key] ?? <span className={styles.empty}>—</span>}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ResultsTable({ result, onReset }: ResultsTableProps) {
  const [activeTab, setActiveTab] = useState<Tab>('imported');
  const importedRef = useRef<HTMLDivElement>(null);
  const skippedRef = useRef<HTMLDivElement>(null);

  const importedVirtualizer = useVirtualizer({
    count: result.imported.length,
    getScrollElement: () => importedRef.current,
    estimateSize: () => 48,
    overscan: 10,
  });

  const skippedVirtualizer = useVirtualizer({
    count: result.skipped.length,
    getScrollElement: () => skippedRef.current,
    estimateSize: () => 56,
    overscan: 10,
  });

  const hasErrors = result.errors.length > 0;

  return (
    <div className={`${styles.wrapper} animate-slide-up`}>
      {/* Summary cards */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.statCardImported}`}>
          <div className={styles.statIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className={styles.statNum}>{result.totalImported.toLocaleString()}</div>
            <div className={styles.statLbl}>Imported</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardSkipped}`}>
          <div className={styles.statIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 17H12.01M10.29 3.86L1.82 18A2 2 0 003.64 21H20.36A2 2 0 0022.18 18L13.71 3.86A2 2 0 0010.29 3.86Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className={styles.statNum}>{result.totalSkipped.toLocaleString()}</div>
            <div className={styles.statLbl}>Skipped</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statCardTotal}`}>
          <div className={styles.statIcon} aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M7 9H17M7 12H13M7 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className={styles.statNum}>{(result.totalImported + result.totalSkipped).toLocaleString()}</div>
            <div className={styles.statLbl}>Total Processed</div>
          </div>
        </div>

        {hasErrors && (
          <div className={`${styles.statCard} ${styles.statCardError}`}>
            <div className={styles.statIcon} aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className={styles.statNum}>{result.errors.length}</div>
              <div className={styles.statLbl}>Batch Errors</div>
            </div>
          </div>
        )}
      </div>

      {/* Error details */}
      {hasErrors && (
        <div className={styles.errorList} role="alert">
          <p className={styles.errorTitle}>⚠️ Some batches had errors:</p>
          {result.errors.map((e, i) => (
            <p key={i} className={styles.errorItem}>{e}</p>
          ))}
        </div>
      )}

      {/* Tab bar */}
      <div className={styles.tabBar} role="tablist">
        <button
          id="tab-imported"
          className={`${styles.tab} ${activeTab === 'imported' ? styles.tabActive : ''}`}
          role="tab"
          aria-selected={activeTab === 'imported'}
          onClick={() => setActiveTab('imported')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Imported Records
          <span className={`badge ${styles.tabBadge} ${activeTab === 'imported' ? 'badge-success' : 'badge-neutral'}`}>
            {result.totalImported.toLocaleString()}
          </span>
        </button>

        <button
          id="tab-skipped"
          className={`${styles.tab} ${activeTab === 'skipped' ? styles.tabActive : ''}`}
          role="tab"
          aria-selected={activeTab === 'skipped'}
          onClick={() => setActiveTab('skipped')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Skipped Records
          <span className={`badge ${styles.tabBadge} ${activeTab === 'skipped' ? 'badge-warning' : 'badge-neutral'}`}>
            {result.totalSkipped.toLocaleString()}
          </span>
        </button>

        <div className={styles.tabActions}>
          {activeTab === 'imported' && result.imported.length > 0 && (
            <button
              id="export-csv-btn"
              className="btn btn-secondary btn-sm"
              onClick={() => exportToCsv(result.imported)}
              title="Export imported records as CSV"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 16L12 8M12 16L9 13M12 16L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 15C3 17.8 3 19.2 3.88 20.1C4.76 21 6.17 21 9 21H15C17.8 21 19.2 21 20.1 20.1C21 19.2 21 17.8 21 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Export CSV
            </button>
          )}
          <button
            id="new-import-btn"
            className="btn btn-primary btn-sm"
            onClick={onReset}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 5V1L7 6L12 11V7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13H4C4 17.42 7.58 21 12 21C16.42 21 20 17.42 20 13C20 8.58 16.42 5 12 5Z" fill="currentColor"/>
            </svg>
            New Import
          </button>
        </div>
      </div>

      {/* Imported records table */}
      {activeTab === 'imported' && (
        <div className={styles.tablePanel} role="tabpanel" aria-labelledby="tab-imported">
          {result.imported.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No records were imported.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              {/* Header */}
              <div className={styles.tableHeader}>
                {LEAD_COLUMNS.map(({ key, label, width }) => (
                  <div key={key} className={styles.headerCell} style={{ width, minWidth: width }}>
                    {label}
                  </div>
                ))}
              </div>
              {/* Virtualized body */}
              <div
                ref={importedRef}
                className={styles.scrollBody}
                style={{ height: Math.min(result.imported.length * 48, 440) + 'px' }}
              >
                <div style={{ height: importedVirtualizer.getTotalSize(), position: 'relative' }}>
                  {importedVirtualizer.getVirtualItems().map((vr) => (
                    <div
                      key={vr.key}
                      style={{ position: 'absolute', top: vr.start, left: 0, width: '100%', height: vr.size }}
                    >
                      <LeadRow lead={result.imported[vr.index]} index={vr.index} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Skipped records */}
      {activeTab === 'skipped' && (
        <div className={styles.tablePanel} role="tabpanel" aria-labelledby="tab-skipped">
          {result.skipped.length === 0 ? (
            <div className={styles.emptyState}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>All records were imported successfully!</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              {/* Header */}
              <div className={styles.tableHeader}>
                <div className={styles.headerCell} style={{ width: 80, minWidth: 80 }}>Row #</div>
                <div className={styles.headerCell} style={{ width: 280, minWidth: 280 }}>Reason Skipped</div>
                <div className={styles.headerCell} style={{ flex: 1, minWidth: 300 }}>Raw Data</div>
              </div>
              {/* Virtualized body */}
              <div
                ref={skippedRef}
                className={styles.scrollBody}
                style={{ height: Math.min(result.skipped.length * 56, 400) + 'px' }}
              >
                <div style={{ height: skippedVirtualizer.getTotalSize(), position: 'relative' }}>
                  {skippedVirtualizer.getVirtualItems().map((vr) => {
                    const s = result.skipped[vr.index];
                    return (
                      <div
                        key={vr.key}
                        style={{ position: 'absolute', top: vr.start, left: 0, width: '100%', height: vr.size }}
                      >
                        <div className={`${styles.skippedRow} ${vr.index % 2 === 1 ? styles.rowOdd : ''}`}>
                          <div className={styles.cell} style={{ width: 80, minWidth: 80 }}>
                            <span className={styles.rowNum}>{s.row}</span>
                          </div>
                          <div className={styles.cell} style={{ width: 280, minWidth: 280 }}>
                            <span className={styles.skippedReason}>{s.reason}</span>
                          </div>
                          <div className={styles.cell} style={{ flex: 1, minWidth: 300 }}>
                            <code className={styles.rawData}>
                              {Object.entries(s.rawData)
                                .filter(([, v]) => v != null && v !== '')
                                .slice(0, 4)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(' | ')}
                            </code>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
