import { supabase } from '@/integrations/supabase/client';
import { ScanResult } from '@/types/scan-types';

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
      stats: {
        harmless: results.stats.harmless,
        malicious: results.stats.malicious,
        suspicious: results.stats.suspicious,
        undetected: results.stats.undetected
      },
      total_engines: results.metadata.engines_used,
      analysis_date: results.metadata.analysis_date,
      file_type: results.metadata.file_info?.type,
      file_size: results.metadata.file_info?.size,
    })
    .select()
    .single();

  if (historyError) throw historyError;

  if (results.detection_details.length > 0) {
    const { error: resultsError } = await supabase
      .from('scan_results')
      .insert(
        results.detection_details.map(detail => {
          const [ruleName, result] = detail.split(': ');
          return {
            scan_id: historyEntry.id,
            rule_name: ruleName,
            category: 'malware',
            detection_details: [detail],
            result_details: {
              method: result || 'pattern match',
            },
          };
        })
      );

    if (resultsError) throw resultsError;
  }

  return historyEntry;
}