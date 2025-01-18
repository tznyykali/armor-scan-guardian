import { supabase } from '@/integrations/supabase/client';

interface MLAnalysisResult {
  modelName: string;
  confidence: number;
  detectionType: string;
  appCategory?: string;
  safetyScore?: number;
  appSafetyStatus?: string;
}

export async function analyzeMobileApp(fileType: string, metadata: any): Promise<MLAnalysisResult[]> {
  console.log('Starting ML analysis for file type:', fileType);
  
  // Determine platform
  const platform = fileType.includes('android') ? 'android' : 
                  fileType.includes('ios') ? 'ios' : 'unknown';

  // Fetch appropriate ML models for the platform
  const { data: models, error: modelError } = await supabase
    .from('ml_model_metadata')
    .select('*')
    .contains('supported_platforms', [platform]);

  if (modelError) {
    console.error('Error fetching ML models:', modelError);
    throw modelError;
  }

  // Simulate ML analysis for each model
  const results: MLAnalysisResult[] = models.map(model => {
    // Calculate safety score based on metadata
    const safetyScore = calculateSafetyScore(metadata, model.detection_categories);
    
    // Determine app safety status
    const appSafetyStatus = determineAppSafetyStatus(safetyScore);
    
    // Determine app category based on metadata
    const appCategory = determineAppCategory(metadata);

    return {
      modelName: model.model_name,
      confidence: safetyScore,
      detectionType: safetyScore > 0.7 ? 'benign' : 'suspicious',
      appCategory,
      safetyScore,
      appSafetyStatus
    };
  });

  console.log('ML analysis results:', results);
  return results;
}

function calculateSafetyScore(metadata: any, detectionCategories: string[]): number {
  let score = 1.0;
  
  // Check for suspicious permissions
  const permissions = metadata.app_permissions || [];
  const suspiciousPermissions = [
    'android.permission.READ_CONTACTS',
    'android.permission.ACCESS_FINE_LOCATION',
    'android.permission.RECORD_AUDIO',
    'NSContactsUsageDescription',
    'NSLocationWhenInUseUsageDescription',
    'NSMicrophoneUsageDescription'
  ];
  
  const suspiciousPermCount = permissions.filter(
    (perm: string) => suspiciousPermissions.includes(perm)
  ).length;
  
  // Reduce score based on suspicious permissions
  score -= (suspiciousPermCount * 0.1);
  
  // Check for known malware patterns in components
  const components = metadata.app_components || {};
  if (components.services?.some((s: string) => 
    s.toLowerCase().includes('crypto') || 
    s.toLowerCase().includes('miner'))) {
    score -= 0.3;
  }
  
  return Math.max(0, Math.min(1, score));
}

function determineAppSafetyStatus(safetyScore: number): string {
  if (safetyScore >= 0.8) return 'safe';
  if (safetyScore >= 0.6) return 'moderate';
  if (safetyScore >= 0.4) return 'suspicious';
  return 'dangerous';
}

function determineAppCategory(metadata: any): string {
  const components = metadata.app_components || {};
  const permissions = metadata.app_permissions || [];
  
  if (permissions.some((p: string) => p.includes('CAMERA') || p.includes('Camera'))) {
    return 'multimedia';
  }
  if (permissions.some((p: string) => p.includes('LOCATION') || p.includes('Location'))) {
    return 'location-based';
  }
  if (components.services?.some((s: string) => 
    s.toLowerCase().includes('game') || 
    s.toLowerCase().includes('unity'))) {
    return 'gaming';
  }
  
  return 'utility';
}