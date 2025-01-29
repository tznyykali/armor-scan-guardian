import { ScanResult } from '@/types/scan';

interface FormatScanResultsParams {
  file: File;
  riskScore: number;
  scanStats: {
    harmless: number;
    malicious: number;
    suspicious: number;
    undetected: number;
  };
  metadata: any;
  malwareClassification: string[];
  mlResults: any[];
  yaraMatches: any[];
  snortAlerts: any[];
  hidsFindings: any;
  hasHighRiskFactors: boolean;
}

export function formatScanResults({
  file,
  riskScore,
  scanStats,
  metadata,
  malwareClassification,
  mlResults,
  yaraMatches,
  snortAlerts,
  hidsFindings,
  hasHighRiskFactors
}: FormatScanResultsParams): ScanResult {
  const status = riskScore >= 70 ? 'malicious' : 
                 riskScore >= 40 ? 'suspicious' : 
                 'clean';

  return {
    id: crypto.randomUUID(),
    type: 'file',
    target: file.name,
    timestamp: new Date().toISOString(),
    results: {
      status,
      metadata: {
        file_info: {
          name: file.name,
          size: file.size,
          type: file.type,
          last_modified: new Date(file.lastModified).toISOString(),
        },
        engines_used: yaraMatches?.length || 0,
        analysis_date: new Date().toISOString(),
        categories: {
          malware: status === 'malicious' ? 'yes' : 'no',
          encryption: hasHighRiskFactors ? 'yes' : 'no',
          obfuscation: snortAlerts.length > 0 ? 'yes' : 'no',
        },
        threat_names: yaraMatches?.map(m => m.rule_match) || [],
        snort_analysis: snortAlerts,
        hids_analysis: hidsFindings
      },
      malware_classification: malwareClassification,
      ml_results: mlResults,
      yara_matches: yaraMatches,
      engine_results: [
        {
          engine_name: 'FileAnalyzer',
          engine_type: 'yaralyze',
          malware_type: malwareClassification?.[0],
          engine_version: '1.0',
          engine_update: new Date().toISOString(),
          category: status,
          description: `File analysis completed with risk score: ${riskScore}`
        },
        ...snortAlerts.map(alert => ({
          engine_name: 'NetworkAnalyzer',
          engine_type: 'snort',
          malware_type: 'network_threat',
          engine_version: '1.0',
          engine_update: new Date().toISOString(),
          category: 'network',
          description: alert.message
        }))
      ],
      scan_stats: scanStats,
      detection_details: [
        ...yaraMatches?.map(match => 
          `YARA Match: ${match.rule_match} (${match.category})`
        ) || [],
        ...snortAlerts.map(alert => 
          `Network Alert: ${alert.message}`
        ),
        hasHighRiskFactors ? 'High risk factors detected in file analysis' : null
      ].filter(Boolean)
    }
  };
}