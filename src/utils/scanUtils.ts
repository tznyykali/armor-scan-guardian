import { ScanResult } from '@/types/scan';

export const createScanResult = (
  type: 'url' | 'file',
  target: string,
  results: any
): ScanResult => {
  return {
    id: crypto.randomUUID(),
    type,
    target,
    timestamp: new Date().toISOString(),
    results: {
      status: results.status,
      metadata: results.metadata,
      file_metadata: results.file_metadata,
      malware_classification: results.malware_classification || []
    }
  };
};

export const handleScanError = (error: unknown): string => {
  console.error('Scan error:', error);
  return error instanceof Error ? error.message : "Failed to perform scan";
};