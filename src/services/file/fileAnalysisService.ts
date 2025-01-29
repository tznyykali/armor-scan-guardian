import { ScanResult } from '@/types/scan';
import { supabase } from '@/integrations/supabase/client';
import { calculateRiskScore } from '../utils/riskCalculationUtils';
import { performSnortAnalysis, performHIDSAnalysis } from '../security/securityAnalysisService';
import { performMlAnalysis } from './mlAnalysisService';
import { extractFileMetadata } from './metadataService';
import { formatScanResults } from './scanResultFormatter';
import { performYaraAnalysis, YaraMatch } from '../yaraService';
import { Json } from '@/types/json';

export async function scanFile(file: File): Promise<ScanResult> {
  console.log('Starting file scan with Supabase client...');
  
  try {
    // Perform YARA analysis first for quick malware detection
    console.log('Starting YARA analysis...');
    const yaraMatches = await performYaraAnalysis(file);
    
    // If high-severity malware is detected, we might want to stop further analysis
    const hasCriticalMalware = yaraMatches.some(
      match => match.detection_details?.severity === 'high'
    );

    if (hasCriticalMalware) {
      console.warn('Critical malware detected, limiting further analysis');
    }

    // Continue with regular scanning process
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
    
    const { riskScore, hasHighRiskFactors } = calculateRiskScore(
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
        threat_category: yaraMatches.length > 0 ? 'malware' : 'clean',
        yara_matches: yaraMatches as Json[],
        platform,
        app_bundle_info: appInfo as Json,
        app_permissions: appPermissions as Json[],
        app_components: appComponents as Json,
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
      app_components: appComponents,
      yara_results: yaraMatches
    });

    const scanStats = {
      harmless: yaraMatches.length === 0 ? 1 : 0,
      malicious: yaraMatches.some(m => m.detection_details?.severity === 'high') ? 1 : 0,
      suspicious: yaraMatches.some(m => m.detection_details?.severity === 'medium') ? 1 : 0,
      undetected: 0
    };

    return formatScanResults({
      file,
      riskScore,
      scanStats,
      metadata: data.metadata,
      malwareClassification: yaraMatches.map(m => m.rule_match),
      mlResults,
      yaraMatches,
      snortAlerts,
      hidsFindings,
      hasHighRiskFactors
    });

  } catch (error) {
    console.error('File scan error:', error);
    throw error;
  }
}