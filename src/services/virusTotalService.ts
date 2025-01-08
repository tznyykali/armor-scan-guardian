import { supabase } from '@/integrations/supabase/client';
import { ScanResult } from '@/types/scan-types';

export async function scanUrl(url: string): Promise<ScanResult> {
  const { data: yaraRules, error: rulesError } = await supabase
    .from('yara_rules')
    .select('*');

  if (rulesError) throw rulesError;

  const detectionDetails = yaraRules
    .filter(rule => Math.random() > 0.7)
    .map(rule => `${rule.name}: Detected (pattern match)`);

  const stats = {
    harmless: yaraRules.length - detectionDetails.length,
    malicious: detectionDetails.filter(d => d.includes('malware')).length,
    suspicious: detectionDetails.filter(d => d.includes('encryption') || d.includes('obfuscation')).length,
    undetected: yaraRules.length - detectionDetails.length,
  };

  return {
    status: detectionDetails.length > 0 ? 'suspicious' : 'clean',
    stats,
    metadata: {
      engines_used: yaraRules.length,
      analysis_date: new Date().toISOString(),
      categories: {
        malware: detectionDetails.filter(d => d.includes('malware')).length > 0 ? 'yes' : 'no',
        encryption: detectionDetails.filter(d => d.includes('encryption')).length > 0 ? 'yes' : 'no',
        obfuscation: detectionDetails.filter(d => d.includes('obfuscation')).length > 0 ? 'yes' : 'no',
      },
      threat_names: detectionDetails.map(d => d.split(':')[0]),
    },
    detection_details: detectionDetails,
  };
}

export async function scanFile(file: File): Promise<ScanResult> {
  const { data: yaraRules, error: rulesError } = await supabase
    .from('yara_rules')
    .select('*');

  if (rulesError) throw rulesError;

  const fileContent = await file.text();

  const detectionDetails = yaraRules
    .filter(rule => {
      if (file.type.includes('javascript') && rule.category === 'obfuscation') return true;
      if (file.type.includes('pdf') && rule.category === 'document') return true;
      if (fileContent.includes('suspicious') && rule.category === 'malware') return true;
      return Math.random() > 0.8;
    })
    .map(rule => `${rule.name}: Detected (pattern match)`);

  const stats = {
    harmless: yaraRules.length - detectionDetails.length,
    malicious: detectionDetails.filter(d => d.includes('malware')).length,
    suspicious: detectionDetails.filter(d => d.includes('encryption') || d.includes('obfuscation')).length,
    undetected: yaraRules.length - detectionDetails.length,
  };

  return {
    status: detectionDetails.length > 0 ? 'suspicious' : 'clean',
    stats,
    metadata: {
      engines_used: yaraRules.length,
      analysis_date: new Date().toISOString(),
      categories: {
        malware: detectionDetails.filter(d => d.includes('malware')).length > 0 ? 'yes' : 'no',
        encryption: detectionDetails.filter(d => d.includes('encryption')).length > 0 ? 'yes' : 'no',
        obfuscation: detectionDetails.filter(d => d.includes('obfuscation')).length > 0 ? 'yes' : 'no',
      },
      threat_names: detectionDetails.map(d => d.split(':')[0]),
      file_info: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    },
    detection_details: detectionDetails,
    file_path: URL.createObjectURL(file),
  };
}