'use client';

import { useState } from 'react';
import { useImport } from '@/hooks/useImport';
import { Modal } from '@/components/Modal';
import { FileUploader } from '@/components/FileUploader';
import { CsvPreviewTable } from '@/components/CsvPreviewTable';
import { ImportProgress } from '@/components/ImportProgress';
import { ResultsTable } from '@/components/ResultsTable';
import styles from './page.module.css';

export default function LeadSourcesDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    state,
    toasts,
    dismissToast,
    handleFileSelected,
    handleConfirmImport,
    handleReset,
    handleBack,
  } = useImport();

  const { step, preview, progress, result, error, isLoading } = state;

  const handleCloseModal = () => {
    // Only allow closing if not actively processing
    if (step === 3 && progress?.stage !== 'completed' && progress?.stage !== 'error') {
      return;
    }
    setIsModalOpen(false);
    // Reset state after a delay to allow exit animation
    setTimeout(handleReset, 300);
  };

  const renderModalFooter = () => {
    if (step === 1) {
      return (
        <>
          <button className="btn btn-ghost" onClick={handleCloseModal}>Cancel</button>
          <button className="btn btn-primary" disabled style={{ width: '140px' }}>Upload File</button>
        </>
      );
    }
    
    if (step === 2) {
      return (
        <>
          <button className="btn btn-ghost" onClick={handleBack} disabled={isLoading}>Back</button>
          <button className="btn btn-primary" onClick={handleConfirmImport} disabled={isLoading} style={{ width: '140px' }}>
            {isLoading ? 'Starting...' : 'Confirm Import'}
          </button>
        </>
      );
    }

    if (step === 3) {
      return (
        <button className="btn btn-primary" disabled style={{ width: '100%' }}>
          Processing...
        </button>
      );
    }

    if (step === 4) {
      return (
        <button className="btn btn-primary" onClick={handleCloseModal} style={{ width: '100%' }}>
          Done
        </button>
      );
    }

    return null;
  };

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>Lead Sources</h1>
        <p className={styles.subtitle}>Connect, manage, and control all your lead channels from one dashboard.</p>
      </header>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Active Lead Sources
            <span className={styles.badge}>2</span>
          </h2>

          <div className={styles.grid}>
            {/* Google Leads Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle}>Google Lead</div>
                  <div className={styles.cardDesc}>Automatically add a new lead</div>
                </div>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Accounts</span>
                  <span className={styles.statValue}>124</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Status</span>
                  <span className={styles.statValue} style={{ color: 'var(--brand-success)' }}>● Active</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button className="btn btn-secondary">Manage</button>
              </div>
            </div>

            {/* Facebook Ads Card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.cardTitle}>Facebook Ads</div>
                  <div className={styles.cardDesc}>Lead Ad integration</div>
                </div>
              </div>
              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Not Connected</span>
                  <span className={styles.statusInactive}>Inactive</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button className="btn btn-outline" style={{ width: '100%' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  Connect
                </button>
              </div>
            </div>

            {/* CSV Importer Card */}
            <div className={`${styles.card} ${styles.csvCard}`} onClick={() => setIsModalOpen(true)}>
              <div className={styles.csvIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <h3 className={styles.csvTitle}>Import Leads via CSV</h3>
              <p className={styles.csvDesc}>Upload a CSV file to bulk import leads into your system.</p>
            </div>
          </div>
        </section>
      </div>

      {/* ── Importer Modal ─────────────────────────────────────────────── */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title="Import Leads via CSV"
        description="Upload a CSV file to bulk import leads into your system."
        maxWidth={step === 1 ? '600px' : '900px'}
        footer={renderModalFooter()}
      >
        <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
          
          {error && step !== 1 && (
            <div style={{ padding: '12px', background: '#fee2e2', color: '#b91c1c', borderRadius: '6px', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          {step === 1 && (
            <FileUploader onFileSelected={handleFileSelected} isLoading={isLoading} error={error} />
          )}

          {step === 2 && preview && (
            <CsvPreviewTable 
              preview={preview} 
              onConfirm={handleConfirmImport} 
              onBack={handleBack} 
              isLoading={isLoading} 
            />
          )}

          {step === 3 && progress && (
            <ImportProgress progress={progress} />
          )}

          {step === 4 && result && (
            <ResultsTable 
              result={result} 
              onReset={handleReset} 
            />
          )}
        </div>
      </Modal>

      {/* ── Toasts ─────────────────────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? '#10b981' : '#3b82f6',
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minWidth: '250px'
            }}
          >
            {toast.message}
            <button onClick={() => dismissToast(toast.id)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '4px' }}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}
