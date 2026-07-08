'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { StreamProgress } from '../types';

interface UseSSEOptions {
  url: string | null;
  onMessage: (data: StreamProgress) => void;
  onError?: (err: Event) => void;
  enabled?: boolean;
}

/**
 * SSE (Server-Sent Events) consumer hook.
 * Automatically connects when url is set and enabled=true.
 * Cleans up the EventSource on unmount or when url changes.
 */
export function useSSE({ url, onMessage, onError, enabled = true }: UseSSEOptions) {
  const esRef = useRef<EventSource | null>(null);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  // Keep refs up to date without re-creating the EventSource
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  const disconnect = useCallback(() => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!url || !enabled) {
      disconnect();
      return;
    }

    disconnect(); // close any existing connection

    const es = new EventSource(url);
    esRef.current = es;

    es.onmessage = (event) => {
      try {
        const data: StreamProgress = JSON.parse(event.data);
        onMessageRef.current(data);
        // Auto-close when done
        if (data.stage === 'completed' || data.stage === 'error') {
          es.close();
        }
      } catch (err) {
        console.error('[SSE] Failed to parse message:', err);
      }
    };

    es.onerror = (err) => {
      console.error('[SSE] Connection error:', err);
      onErrorRef.current?.(err);
      // Don't auto-retry forever — let the parent decide
      es.close();
      esRef.current = null;
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [url, enabled, disconnect]);

  return { disconnect };
}
