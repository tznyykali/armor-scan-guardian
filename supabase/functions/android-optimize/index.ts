import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { SystemMetrics, OptimizationResults } from '../_shared/types.ts'
import { analyzeMalwareAndPerformance } from '../_shared/mlAnalysis.ts'
import { generateSecurityRecommendations, generateResourceRecommendations } from '../_shared/recommendations.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Advanced threshold-based analysis
const THRESHOLDS = {
  cpu: { critical: 85, high: 70, moderate: 50, low: 30 },
  memory: { critical: 90, high: 75, moderate: 60, low: 40 },
  battery: { critical: 15, high: 30, moderate: 50, optimal: 80 },
  storage: { critical: 95, high: 85, moderate: 70, low: 50 }
};

function analyzeSystemHealth(metrics: SystemMetrics) {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let healthScore = 100;

  // CPU Analysis
  if (metrics.cpuUsage >= THRESHOLDS.cpu.critical) {
    healthScore -= 30;
    issues.push('Critical CPU usage detected');
    recommendations.push('Identify and terminate CPU-intensive background processes');
  } else if (metrics.cpuUsage >= THRESHOLDS.cpu.high) {
    healthScore -= 20;
    issues.push('High CPU load');
    recommendations.push('Review and optimize running applications');
  }

  // Memory Analysis
  if (metrics.memoryUsage >= THRESHOLDS.memory.critical) {
    healthScore -= 30;
    issues.push('Critical memory pressure');
    recommendations.push('Clear application caches and close unused apps');
  } else if (metrics.memoryUsage >= THRESHOLDS.memory.high) {
    healthScore -= 15;
    issues.push('High memory usage');
    recommendations.push('Consider closing background applications');
  }

  // Battery Analysis
  if (metrics.batteryLevel <= THRESHOLDS.battery.critical) {
    healthScore -= 25;
    issues.push('Critical battery level');
    recommendations.push('Enable battery saver mode immediately');
  } else if (metrics.batteryLevel <= THRESHOLDS.battery.high) {
    healthScore -= 10;
    issues.push('Low battery');
    recommendations.push('Consider enabling power saving features');
  }

  // Storage Analysis
  if (metrics.storage >= THRESHOLDS.storage.critical) {
    healthScore -= 25;
    issues.push('Critical storage space');
    recommendations.push('Clear cache and remove unused applications');
  } else if (metrics.storage >= THRESHOLDS.storage.high) {
    healthScore -= 15;
    issues.push('Low storage space');
    recommendations.push('Review and clean up large files');
  }

  return {
    healthScore: Math.max(0, Math.min(100, healthScore)),
    issues,
    recommendations
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { systemMetrics } = await req.json()
    console.log('Received system metrics:', systemMetrics)

    // Get ML models and perform ML analysis
    const { data: models, error: modelsError } = await supabaseClient
      .from('latest_ml_models')
      .select('*')
    
    if (modelsError) throw modelsError

    // Perform both ML and threshold-based analysis
    const mlPredictions = await analyzeMalwareAndPerformance(systemMetrics, models)
    const thresholdAnalysis = analyzeSystemHealth(systemMetrics)
    
    console.log('ML predictions:', mlPredictions)
    console.log('Threshold analysis:', thresholdAnalysis)

    // Combine and validate results
    const mlHealthScore = Math.round((1 - mlPredictions.malwareDetection.confidence) * 100)
    const thresholdHealthScore = thresholdAnalysis.healthScore
    
    // Use weighted average, giving more weight to ML predictions
    const finalHealthScore = Math.round((mlHealthScore * 0.7) + (thresholdHealthScore * 0.3))

    // Store scan results
    const { data: scanData, error: scanError } = await supabaseClient
      .from('scan_history')
      .insert({
        scan_type: 'system_optimization',
        file_name: 'system_scan',
        scan_status: 'completed',
        stats: {
          malware_confidence: mlPredictions.malwareDetection.confidence,
          optimization_score: mlPredictions.performanceOptimization.confidence,
          threshold_health_score: thresholdHealthScore
        }
      })
      .select()
      .single()

    if (scanError) throw scanError

    // Store ML results
    const mlResults = mlPredictions.predictions.map(pred => ({
      scan_id: scanData.id,
      model_name: pred.modelName,
      confidence_score: pred.confidence,
      detection_type: pred.prediction,
      analysis_metadata: {
        ...pred.metadata,
        threshold_analysis: {
          health_score: thresholdHealthScore,
          issues: thresholdAnalysis.issues
        }
      }
    }))

    const { error: mlError } = await supabaseClient
      .from('ml_scan_results')
      .insert(mlResults)

    if (mlError) throw mlError

    // Combine recommendations from both analyses
    const combinedRecommendations = [
      ...new Set([
        ...mlPredictions.performanceOptimization.metadata.optimization_areas,
        ...generateSecurityRecommendations(mlPredictions.malwareDetection),
        ...generateResourceRecommendations(mlPredictions.resourceUsage),
        ...thresholdAnalysis.recommendations
      ])
    ]

    const optimizationResults: OptimizationResults = {
      systemHealth: finalHealthScore,
      malwareDetection: {
        threatsFound: mlPredictions.malwareDetection.metadata.suspicious_patterns.length,
        cleaned: mlPredictions.malwareDetection.confidence < 0.85,
        riskLevel: mlPredictions.malwareDetection.metadata.risk_level,
        suspiciousPatterns: mlPredictions.malwareDetection.metadata.suspicious_patterns
      },
      performance: {
        beforeOptimization: Math.round(mlPredictions.performanceOptimization.metadata.current_performance * 100),
        afterOptimization: Math.round(Math.min(
          mlPredictions.performanceOptimization.metadata.current_performance * 100 + 20,
          100
        )),
        optimizationAreas: mlPredictions.performanceOptimization.metadata.optimization_areas
      },
      resourceUsage: {
        patterns: mlPredictions.resourceUsage.metadata.resource_usage_patterns,
        efficiencyScore: Math.round(mlPredictions.resourceUsage.metadata.efficiency_score * 100)
      },
      recommendations: combinedRecommendations
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: optimizationResults 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in android-optimize function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})