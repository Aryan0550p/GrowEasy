export type CrmStatus =
  | 'GOOD_LEAD_FOLLOW_UP'
  | 'DID_NOT_CONNECT'
  | 'BAD_LEAD'
  | 'SALE_DONE';

export type DataSource =
  | 'leads_on_demand'
  | 'meridian_tower'
  | 'eden_park'
  | 'varah_swamy'
  | 'sarjapur_plots'
  | '';

export interface CrmLead {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: CrmStatus;
  crm_note?: string;
  data_source?: DataSource;
  possession_time?: string;
  description?: string;
}

export interface ImportResult {
  imported: CrmLead[];
  skipped: Array<{
    row: number;
    reason: string;
    rawData: Record<string, unknown>;
  }>;
  totalImported: number;
  totalSkipped: number;
  errors: string[];
}

export interface CsvPreview {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
  filename: string;
  fileSize: number;
}

export interface BatchProgress {
  batchNumber: number;
  totalBatches: number;
  recordsInBatch: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface StreamProgress {
  stage: 'uploading' | 'parsing' | 'ai_processing' | 'completed' | 'error';
  progress: number;
  message: string;
  batchProgress?: BatchProgress;
  result?: ImportResult;
  error?: string;
}
