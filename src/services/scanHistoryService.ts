import { supabase } from '@/integrations/supabase/client';
import { ScanResult, DetectionEngineType, MLAnalysis } from '@/types/scan-types';
import { Json } from '@/integrations/supabase/types';

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
      stats: results.stats as Json,
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
    const scanResults = results.detection_details.map(detail => {
      const [ruleName, result] = detail.split(': ');
      return {
        scan_id: historyEntry.id,
        rule_name: ruleName,
        category: 'malware',
        detection_details: [detail],
        result_details: { method: result || 'pattern match' } as Json,
        engine_type: 'yaralyze' as DetectionEngineType,
        snort_alerts: results.metadata.snort_analysis || [] as Json,
        hids_findings: results.metadata.hids_analysis || {} as Json,
        droidbox_analysis: results.metadata.droidbox_analysis || {} as Json
      };
    });

    const { error: resultsError } = await supabase
      .from('scan_results')
      .insert(scanResults);

    if (resultsError) throw resultsError;
  }

  // Save ML scan results if available
  if (results.metadata.ml_analysis) {
    const mlResult = {
      scan_id: historyEntry.id,
      model_name: results.metadata.ml_analysis.model_name,
      confidence_score: results.metadata.ml_analysis.confidence_score,
      detection_type: results.metadata.ml_analysis.detection_type,
      model_version: results.metadata.ml_analysis.model_version,
      analysis_metadata: results.metadata.ml_analysis as Json
    };

    const { error: mlError } = await supabase
      .from('ml_scan_results')
      .insert(mlResult);

    if (mlError) throw mlError;
  }

  return historyEntry;
}