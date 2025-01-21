import { ScanResult } from '@/types/scan';

export const formatScanResult = (scanResults: any, fileName: string): ScanResult => {
  return {
    id: crypto.randomUUID(),
    type: 'file',
    target: fileName,
    timestamp: new Date().toISOString(),
    results: {
      status: scanResults.status || 'completed',
      metadata: scanResults.metadata || {},
      file_metadata: {
        md5: scanResults.file_metadata?.md5,
        sha1: scanResults.file_metadata?.sha1,
        sha256: scanResults.file_metadata?.sha256,
      },
      malware_classification: scanResults.malware_classification || [],
      ml_results: scanResults.ml_results?.map((result: any) => ({
        model_name: result.model_name || '',
        detection_type: result.detection_type || '',
        confidence_score: result.confidence_score || 0,
        model_version: result.model_version
      })) || [],
      yara_matches: scanResults.yara_matches?.map((match: any) => ({
        rule_match: match.rule_match || '',
        category: match.category || '',
        detection_details: {
          description: match.detection_details?.description || ''
        }
      })) || [],
      engine_results: scanResults.engine_results?.map((engine: any) => ({
        engine_name: engine.engine_name || '',
        engine_type: engine.engine_type || '',
        malware_type: engine.malware_type,
        engine_version: engine.engine_version,
        engine_update: engine.engine_update,
        category: engine.category,
        description: engine.description
      })) || [],
      scan_stats: scanResults.scan_stats || {
        harmless: 0,
        malicious: 0,
        suspicious: 0,
        undetected: 0
      },
      detection_details: scanResults.detection_details || []
    }
  };
};