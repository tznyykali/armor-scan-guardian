import { ScanResult } from '@/types/scan';
import { supabase } from '@/integrations/supabase/client';
import { analyzeMobileApp } from '../mlAnalysisService';
import { calculateRiskScore } from '../utils/riskCalculationUtils';
import { performSnortAnalysis, performHIDSAnalysis } from '../security/securityAnalysisService';

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

    // Determine platform
    const platform = file.name.toLowerCase().endsWith('.aab') || file.name.toLowerCase().endsWith('.apk')
      ? 'android'
      : file.name.toLowerCase().endsWith('.ipa')
        ? 'ios'
        : 'desktop';

    // Additional security analysis
    const snortAlerts = await performSnortAnalysis(file.name);
    const hidsFindings = await performHIDSAnalysis(file.name);
    
    const { riskScore, hasHighRiskFactors } = calculateRiskScore(
      data.metadata,
      snortAlerts,
      hidsFindings
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
        app_bundle_info: data.app_bundle_info || {},
        app_permissions: data.app_permissions || [],
        app_components: data.app_components || {},
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

    // Perform ML analysis for mobile apps
    let mlResults = [];
    if (platform === 'android' || platform === 'ios') {
      console.log('Starting ML analysis for file type:', file.type);
      mlResults = await analyzeMobileApp(file.type, {
        app_permissions: data.app_permissions,
        app_components: data.app_components
      });
      console.log('ML analysis results:', mlResults);

      // Save ML scan results
      if (mlResults.length > 0) {
        const { error: mlError } = await supabase
          .from('ml_scan_results')
          .insert(
            mlResults.map(result => ({
              model_name: result.modelName,
              confidence_score: result.confidence,
              detection_type: result.detectionType,
              app_category: result.appCategory,
              safety_score: result.safetyScore,
              app_safety_status: result.appSafetyStatus,
              analysis_metadata: {
                platform,
                scan_timestamp: new Date().toISOString()
              }
            }))
          );

        if (mlError) {
          console.error('Error saving ML results:', mlError);
        }
      }
    }

    // Format the scan results to match URL scan format
    const status = riskScore >= 70 ? 'malicious' : 
                   riskScore >= 40 ? 'suspicious' : 
                   'clean';

    const scanStats = {
      harmless: status === 'clean' ? 1 : 0,
      malicious: status === 'malicious' ? 1 : 0,
      suspicious: status === 'suspicious' ? 1 : 0,
      undetected: 0
    };

    // Return the scan result in the format matching URL scans
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
          engines_used: data.yara_matches?.length || 0,
          analysis_date: new Date().toISOString(),
          categories: {
            malware: status === 'malicious' ? 'yes' : 'no',
            encryption: hasHighRiskFactors ? 'yes' : 'no',
            obfuscation: data.yara_matches?.some(m => m.category === 'obfuscation') ? 'yes' : 'no',
          },
          threat_names: data.yara_matches?.map(m => m.rule_match) || [],
          snort_analysis: snortAlerts,
          hids_analysis: hidsFindings
        },
        malware_classification: data.malware_classification || [],
        ml_results: mlResults.map(result => ({
          model_name: result.modelName,
          detection_type: result.detectionType,
          confidence_score: result.confidence,
          model_version: '1.0'
        })),
        yara_matches: data.yara_matches || [],
        engine_results: [
          {
            engine_name: 'FileAnalyzer',
            engine_type: 'yaralyze',
            malware_type: data.malware_classification?.[0],
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
          ...data.yara_matches?.map(match => 
            `YARA Match: ${match.rule_match} (${match.category})`
          ) || [],
          ...snortAlerts.map(alert => 
            `Network Alert: ${alert.message}`
          ),
          hasHighRiskFactors ? 'High risk factors detected in file analysis' : null
        ].filter(Boolean)
      }
    };
  } catch (error) {
    console.error('File scan error:', error);
    throw error;
  }
}