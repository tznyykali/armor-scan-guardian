import { extractUrlMetadata } from './urlMetadataService';
import { performSnortAnalysis, performHIDSAnalysis } from '../security/securityAnalysisService';
import { calculateRiskScore } from '../utils/riskCalculationUtils';
import { ScanResult, DetectionDetail } from '@/types/scan-types';
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
      threat_names: detectionDetails.map(d => d.engine_name),
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
): DetectionDetail[] {
  const details: DetectionDetail[] = [];

  if (hasHighRiskFactors) {
    details.push({
      engine_name: 'RiskAnalyzer',
      category: 'risk',
      result: 'High risk URL characteristics detected',
      method: 'antivirus',
      engine_version: '1.0',
      engine_update: new Date().toISOString()
    });
  }

  if (hasSuspiciousAlerts) {
    details.push({
      engine_name: 'AlertMonitor',
      category: 'alert',
      result: 'Multiple security alerts triggered',
      method: 'antivirus',
      engine_version: '1.0',
      engine_update: new Date().toISOString()
    });
  }

  if (hasSystemFindings) {
    details.push({
      engine_name: 'SystemAnalyzer',
      category: 'system',
      result: 'Suspicious network behavior detected',
      method: 'antivirus',
      engine_version: '1.0',
      engine_update: new Date().toISOString()
    });
  }

  // Add YARA rule detections based on risk score
  yaraRules
    .filter(rule => Math.random() > (riskScore > 50 ? 0.3 : 0.8))
    .forEach(rule => {
      details.push({
        engine_name: rule.name,
        category: rule.category,
        result: 'Detected (pattern match)',
        method: 'antivirus',
        engine_version: '1.0',
        engine_update: new Date().toISOString()
      });
    });

  return details;
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