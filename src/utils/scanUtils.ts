import { ScanResult } from '@/types/scan';

export const createScanResult = (
  type: 'url' | 'file',
  target: string,
  results: any
): ScanResult => {
  // Ensure we have valid results object
  if (!results || typeof results !== 'object') {
    throw new Error('Invalid scan results');
  }

  return {
    id: crypto.randomUUID(),
    type,
    target,
    timestamp: new Date().toISOString(),
    results: {
      status: results.status || 'unknown',
      metadata: results.metadata || {},
      file_metadata: results.file_metadata || {},
      malware_classification: Array.isArray(results.malware_classification) 
        ? results.malware_classification 
        : [],
      ml_results: Array.isArray(results.ml_results) 
        ? results.ml_results 
        : [],
      yara_matches: Array.isArray(results.yara_matches) 
        ? results.yara_matches 
        : [],
      engine_results: Array.isArray(results.engine_results) 
        ? results.engine_results 
        : [],
      scan_stats: results.scan_stats || {
        harmless: 0,
        malicious: 0,
        suspicious: 0,
        undetected: 0
      },
      detection_details: Array.isArray(results.detection_details) 
        ? results.detection_details 
        : []
    }
  };
};

export const handleScanError = (error: unknown): string => {
  console.error('Scan error:', error);
  return error instanceof Error ? error.message : "Failed to perform scan";
};