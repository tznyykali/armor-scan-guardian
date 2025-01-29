import { ScanResult } from '@/types/scan';
import { supabase } from '@/integrations/supabase/client';
import { calculateRiskScore } from '../utils/riskCalculationUtils';
import { performSnortAnalysis, performHIDSAnalysis } from '../security/securityAnalysisService';
import { performMlAnalysis } from './mlAnalysisService';
import { extractFileMetadata } from './metadataService';
import { formatScanResults } from './scanResultFormatter';

export async function scanFile(file: File): Promise<ScanResult> {
  console.log('Starting file scan with Supabase client...');
  
  try {
    const formData = new FormData();
    formData.append('file', file);

    console.log('Calling scan-file edge function...');
    
    const { data, error } = await supabase.functions.invoke('scan-file', {
      body: formData,
    });

    if (error) {
      console.error('Error scanning file:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No scan results received');
    }

    console.log('Raw scan results:', data);

    // Determine platform and extract metadata
    const platform = file.name.toLowerCase().endsWith('.aab') || file.name.toLowerCase().endsWith('.apk')
      ? 'android'
      : file.name.toLowerCase().endsWith('.ipa')
        ? 'ios'
        : 'desktop';

    const { appInfo, appPermissions, appComponents } = extractFileMetadata(file, platform);

    // Additional security analysis
    const snortAlerts = await performSnortAnalysis(file.name);
    const hidsFindings = await performHIDSAnalysis(file.name);
    
    const { riskScore, hasHighRiskFactors, hasSuspiciousAlerts, hasSystemFindings } = calculateRiskScore(
      data.metadata || {},
      snortAlerts || [],
      hidsFindings || {}
    );

    // Save scan result to the current_scan_results table
    const { error: saveError } = await supabase
      .from('current_scan_results')
      .insert({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        md5_hash: data.file_metadata?.md5,
        sha1_hash: data.file_metadata?.sha1,
        sha256_hash: data.file_metadata?.sha256,
        threat_category: data.malware_classification?.[0] || 'unknown',
        yara_matches: data.yara_matches || [],
        platform,
        app_bundle_info: appInfo,
        app_permissions: appPermissions,
        app_components: appComponents,
        file_metadata: {
          magic: data.metadata?.magic,
          mime_type: file.type,
          last_modified: new Date(file.lastModified).toISOString(),
          analysis_date: new Date().toISOString()
        }
      });

    if (saveError) {
      console.error('Error saving scan result:', saveError);
      throw saveError;
    }

    // Perform ML analysis
    const mlResults = await performMlAnalysis(file, platform, {
      app_permissions: appPermissions,
      app_components: appComponents
    });

    const scanStats = {
      harmless: riskScore < 40 ? 1 : 0,
      malicious: riskScore >= 70 ? 1 : 0,
      suspicious: riskScore >= 40 && riskScore < 70 ? 1 : 0,
      undetected: 0
    };

    return formatScanResults({
      file,
      riskScore,
      scanStats,
      metadata: data.metadata,
      malwareClassification: data.malware_classification || [],
      mlResults,
      yaraMatches: data.yara_matches || [],
      snortAlerts,
      hidsFindings,
      hasHighRiskFactors
    });

  } catch (error) {
    console.error('File scan error:', error);
    throw error;
  }
}