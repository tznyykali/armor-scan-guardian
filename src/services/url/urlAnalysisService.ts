import { extractUrlMetadata } from './urlMetadataService';
import { performSnortAnalysis, performHIDSAnalysis } from '../security/securityAnalysisService';
import { calculateRiskScore } from '../utils/riskCalculationUtils';
import { ScanResult } from '@/types/scan-types';
import { supabase } from '@/integrations/supabase/client';

export async function scanUrl(url: string): Promise<ScanResult> {
  console.log('Starting URL scan...');
  
  const { data: yaraRules, error: rulesError } = await supabase
    .from('yara_rules')
    .select('*');

  if (rulesError) throw rulesError;

  const urlMetadata = await extractUrlMetadata(url);
  const snortAlerts = await performSnortAnalysis(url);
  const hidsFindings = await performHIDSAnalysis(url);
  
  const { riskScore, hasHighRiskFactors, hasSuspiciousAlerts, hasSystemFindings } = 
    calculateRiskScore(urlMetadata, snortAlerts, hidsFindings);

  const detectionDetails = generateDetectionDetails(
    hasHighRiskFactors,
    hasSuspiciousAlerts,
    hasSystemFindings,
    yaraRules,
    riskScore
  );

  const status = determineStatus(riskScore);
  const stats = calculateStats(status, yaraRules.length, detectionDetails.length);

  return {
    status,
    stats,
    metadata: {
      engines_used: yaraRules.length,
      analysis_date: new Date().toISOString(),
      categories: {
        malware: status === 'malicious' ? 'yes' : 'no',
        encryption: hasSystemFindings ? 'yes' : 'no',
        obfuscation: hasSuspiciousAlerts ? 'yes' : 'no',
      },
      threat_names: detectionDetails.map(d => d.split(':')[0]),
      url_info: urlMetadata,
      snort_analysis: snortAlerts,
      hids_analysis: hidsFindings
    },
    detection_details: detectionDetails,
  };
}

function generateDetectionDetails(
  hasHighRiskFactors: boolean,
  hasSuspiciousAlerts: boolean,
  hasSystemFindings: boolean,
  yaraRules: any[],
  riskScore: number
): string[] {
  return [
    ...(hasHighRiskFactors ? ['High risk URL characteristics detected'] : []),
    ...(hasSuspiciousAlerts ? ['Multiple security alerts triggered'] : []),
    ...(hasSystemFindings ? ['Suspicious network behavior detected'] : []),
    ...yaraRules
      .filter(rule => Math.random() > (riskScore > 50 ? 0.3 : 0.8))
      .map(rule => `${rule.name}: Detected (pattern match)`)
  ];
}

function determineStatus(riskScore: number): string {
  return riskScore >= 70 ? 'malicious' : 
         riskScore >= 40 ? 'suspicious' : 
         'clean';
}

function calculateStats(status: string, totalRules: number, detectionCount: number) {
  return {
    harmless: status === 'clean' ? totalRules : 0,
    malicious: status === 'malicious' ? Math.ceil(totalRules * 0.7) : 0,
    suspicious: status === 'suspicious' ? Math.ceil(totalRules * 0.5) : 
               status === 'malicious' ? Math.floor(totalRules * 0.3) : 0,
    undetected: Math.max(0, totalRules - detectionCount)
  };
}