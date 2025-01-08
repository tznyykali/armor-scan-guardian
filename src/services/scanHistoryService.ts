import { supabase } from '@/integrations/supabase/client';
import { ScanResult } from '@/types/scan-types';
import { performYaraAnalysis } from './yaraService';

export async function saveScanResult(
  scanType: 'url' | 'file',
  target: string,
  results: ScanResult
) {
  const { data: historyEntry, error: historyError } = await supabase
    .from('scan_history')
    .insert({
      scan_type: scanType,
      file_name: target,
      scan_status: results.status,
      stats: results.stats as any,
      total_engines: results.metadata.engines_used,
      analysis_date: results.metadata.analysis_date,
      permalink: results.permalink,
      file_type: results.metadata.file_info?.type,
      file_size: results.metadata.file_info?.size,
    })
    .select()
    .single();

  if (historyError) throw historyError;

  // Perform YARA analysis
  await performYaraAnalysis(historyEntry.id, target, scanType);

  // Save detailed results for each detection
  if (results.detection_details.length > 0) {
    const { error: resultsError } = await supabase
      .from('scan_results')
      .insert(
        results.detection_details.map(detail => {
          const [engine, result] = detail.split(': ');
          const [detection, method] = result.split(' (');
          return {
            scan_id: historyEntry.id,
            rule_name: detection,
            engine_name: engine,
            category: 'malware',
            detection_details: [detail],
            result_details: {
              method: method?.replace(')', '') || 'unknown',
            },
          };
        })
      );

    if (resultsError) throw resultsError;
  }

  return historyEntry;
}