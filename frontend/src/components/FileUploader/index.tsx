import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './FileUploader.module.css';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function FileUploader({ onFileSelected, isLoading }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (isLoading || acceptedFiles.length === 0) return;
    const file = acceptedFiles[0];
    if (file) {
      onFileSelected(file);
    }
  }, [isLoading, onFileSelected]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1,
    disabled: isLoading
  });

  const handleDownloadTemplate = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert('Template download would trigger here.');
  };

  return (
    <div
      {...getRootProps()}
      className={`${styles.uploaderContainer} ${isDragActive ? styles.isDragging : ''} ${isDragReject ? styles.isReject : ''} ${isLoading ? styles.isDisabled : ''}`}
    >
      <input {...getInputProps()} />
      
      <div className={styles.uploadIcon}>
        {isLoading ? (
          <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1"></path></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
        )}
      </div>

      <div className={styles.uploadTitle}>
        {isLoading ? 'Uploading...' : isDragActive ? 'Drop the CSV here' : 'Drop your CSV file here'}
      </div>
      <div className={styles.uploadSubtitle}>
        or click to browse files
      </div>

      <div className={styles.supportedFile}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        Supported file: .csv (max 5MB)
      </div>

      <div className={styles.requirementsText}>
        Required headers: created_at, name, email, country_code, mobile_without_country_code, company, city, state, country, lead_owner, crm_status, crm_note. Template includes default + custom CRM fields to reduce upload errors.
      </div>

      <button className={`btn ${styles.downloadBtn}`} onClick={handleDownloadTemplate} disabled={isLoading}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download Sample CSV Template
      </button>
    </div>
  );
}
