import { ScanResult } from '@/types/scan';
import { supabase } from '@/integrations/supabase/client';
import { analyzeMobileApp } from '../mlAnalysisService';

export async function scanFile(file: File): Promise<ScanResult> {
  console.log('Starting file scan with Supabase client...');
  
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append('file', file);

    console.log('Calling scan-file edge function...');
    
    // Call the scan-file edge function with the correct configuration
    const { data, error } = await supabase.functions.invoke('scan-file', {
      body: formData,
      // Remove the manual Content-Type header to let the browser set it with the boundary
    });

    if (error) {
      console.error('Error scanning file:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No scan results received');
    }

    console.log('Raw scan results:', data);

    // Determine platform and extract relevant info
    const platform = file.name.toLowerCase().endsWith('.aab') || file.name.toLowerCase().endsWith('.apk')
      ? 'android'
      : file.name.toLowerCase().endsWith('.ipa')
        ? 'ios'
        : 'desktop';

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

    // Perform ML analysis if it's a mobile app
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

    // Return the scan result in the correct format
    return {
      id: crypto.randomUUID(),
      type: 'file',
      target: file.name,
      timestamp: new Date().toISOString(),
      results: {
        status: data.status,
        metadata: data.metadata,
        file_metadata: data.file_metadata,
        malware_classification: data.malware_classification || [],
        ml_results: mlResults,
        yara_matches: data.yara_matches || [],
        engine_results: data.engine_results || [],
        scan_stats: data.scan_stats || {
          harmless: 0,
          malicious: 0,
          suspicious: 0,
          undetected: 0
        },
        detection_details: data.detection_details || []
      }
    };
  } catch (error) {
    console.error('File scan error:', error);
    throw error;
  }
}