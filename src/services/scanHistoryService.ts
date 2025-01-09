import { supabase } from '@/integrations/supabase/client';
import { ScanResult } from '@/types/scan-types';

export async function saveScanResult(
  scanType: 'url' | 'file',
  target: string,
  results: ScanResult
) {
  console.log('Saving enhanced scan results...');
  
  const { data: historyEntry, error: historyError } = await supabase
    .from('scan_history')
    .insert({
      scan_type: scanType,
      file_name: target,
      scan_status: results.status,
      stats: results.stats,
      total_engines: results.metadata.engines_used,
      analysis_date: results.metadata.analysis_date,
      file_type: results.metadata.file_info?.type,
      file_size: results.metadata.file_info?.size,
    })
    .select()
    .single();

  if (historyError) throw historyError;

  // Save detailed scan results
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
            result_details: { method: result || 'pattern match' },
            engine_type: 'yaralyze',
            snort_alerts: results.metadata.snort_analysis || [],
            hids_findings: results.metadata.hids_analysis || {},
            droidbox_analysis: results.metadata.droidbox_analysis || {}
          };
        })
      );

    if (resultsError) throw resultsError;
  }

  // Save ML scan results if available
  if (results.metadata.ml_analysis) {
    const { error: mlError } = await supabase
      .from('ml_scan_results')
      .insert({
        scan_id: historyEntry.id,
        model_name: 'AndroidMalwareDetector',
        confidence_score: Math.random(), // In a real implementation, this would come from the ML model
        detection_type: 'malware',
        model_version: '1.0',
        analysis_metadata: results.metadata.ml_analysis
      });

    if (mlError) throw mlError;
  }

  return historyEntry;
}