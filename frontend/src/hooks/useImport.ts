'use client';

import { useState, useCallback, useRef } from 'react';
import type { CsvPreview, ImportResult, StreamProgress } from '../../../shared/src/types';
import type { ToastMessage } from '../types';
import { uploadCsv, confirmImport, getStreamUrl } from '../lib/api';
import { useSSE } from './useSSE';

export type ImportStep = 1 | 2 | 3 | 4;

export interface ImportState {
  step: ImportStep;
  file: File | null;
  jobId: string | null;
  preview: CsvPreview | null;
  progress: StreamProgress | null;
  result: ImportResult | null;
  error: string | null;
  isLoading: boolean;
}

const INITIAL_STATE: ImportState = {
  step: 1,
  file: null,
  jobId: null,
  preview: null,
  progress: null,
  result: null,
  error: null,
  isLoading: false,
};

export function useImport() {
  const [state, setState] = useState<ImportState>(INITIAL_STATE);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [sseEnabled, setSseEnabled] = useState(false);
  const toastIdRef = useRef(0);

  /* ─── Toasts ─────────────────────────────────────────────────────────── */

  const addToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = String(++toastIdRef.current);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* ─── SSE ────────────────────────────────────────────────────────────── */

  const handleSSEMessage = useCallback((data: StreamProgress) => {
    setState((prev) => ({
      ...prev,
      progress: data,
      isLoading: data.stage !== 'completed' && data.stage !== 'error',
      result: data.result != null ? (data.result as unknown as ImportResult) : prev.result,
      error: data.error ?? prev.error,
    }));

    if (data.stage === 'completed') {
      setSseEnabled(false);
      const imported = data.result ? (data.result as unknown as ImportResult) : null;
      setState((prev) => ({
        ...prev,
        step: 4,
        isLoading: false,
        result: imported ?? prev.result,
      }));
      addToast('success', `Import complete! ${(data.result as unknown as ImportResult)?.totalImported ?? 0} records imported.`);
    } else if (data.stage === 'error') {
      setSseEnabled(false);
      setState((prev) => ({ ...prev, isLoading: false, error: data.error ?? 'Import failed' }));
      addToast('error', data.error ?? 'Import failed. Please try again.');
    }
  }, [addToast]);

  const handleSSEError = useCallback(() => {
    // SSE disconnected — show a warning but don't break the UI
    addToast('info', 'Lost connection to server. The import may still be running.');
  }, [addToast]);

  useSSE({
    url: streamUrl,
    onMessage: handleSSEMessage,
    onError: handleSSEError,
    enabled: sseEnabled,
  });

  /* ─── Step 1 → 2: Upload file ────────────────────────────────────────── */

  const handleFileSelected = useCallback(async (file: File) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null, file }));

    try {
      const { jobId, preview } = await uploadCsv(file);
      setState((prev) => ({
        ...prev,
        jobId,
        preview,
        step: 2,
        isLoading: false,
      }));
      addToast('info', `${preview.totalRows.toLocaleString()} rows detected. Review the preview below.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setState((prev) => ({ ...prev, isLoading: false, error: message, file: null }));
      addToast('error', message);
    }
  }, [addToast]);

  /* ─── Step 2 → 3: Confirm import ────────────────────────────────────── */

  const handleConfirmImport = useCallback(async () => {
    if (!state.jobId) return;

    setState((prev) => ({
      ...prev,
      step: 3,
      isLoading: true,
      error: null,
      progress: { stage: 'ai_processing', progress: 0, message: 'Starting AI extraction...' },
    }));

    try {
      await confirmImport(state.jobId);
      // Connect SSE stream for live progress
      const url = getStreamUrl(state.jobId);
      setStreamUrl(url);
      setSseEnabled(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start import';
      setState((prev) => ({ ...prev, step: 2, isLoading: false, error: message }));
      addToast('error', message);
    }
  }, [state.jobId, addToast]);

  /* ─── Reset ──────────────────────────────────────────────────────────── */

  const handleReset = useCallback(() => {
    setSseEnabled(false);
    setStreamUrl(null);
    setState(INITIAL_STATE);
    setToasts([]);
  }, []);

  /* ─── Go back ────────────────────────────────────────────────────────── */

  const handleBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      step: prev.step > 1 ? ((prev.step - 1) as ImportStep) : 1,
      error: null,
    }));
  }, []);

  return {
    state,
    toasts,
    dismissToast,
    handleFileSelected,
    handleConfirmImport,
    handleReset,
    handleBack,
  };
}
