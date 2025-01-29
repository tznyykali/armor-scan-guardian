import { supabase } from '@/integrations/supabase/client';
import { analyzeMobileApp } from '../mlAnalysisService';

export async function performMlAnalysis(file: File, platform: string, appData: {
  app_permissions: string[];
  app_components: Record<string, any>;
}) {
  if (platform !== 'android' && platform !== 'ios') {
    return [];
  }

  console.log('Starting ML analysis for file type:', file.type);
  const mlResults = await analyzeMobileApp(file.type, {
    app_permissions: appData.app_permissions || [],
    app_components: appData.app_components || {}
  });
  console.log('ML analysis results:', mlResults);

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

  return mlResults.map(result => ({
    model_name: result.modelName,
    detection_type: result.detectionType,
    confidence_score: result.confidence,
    model_version: '1.0'
  }));
}