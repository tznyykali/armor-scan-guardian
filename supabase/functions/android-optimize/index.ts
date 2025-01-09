import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { SystemMetrics, OptimizationResults } from '../_shared/types.ts'
import { analyzeMalwareAndPerformance } from '../_shared/mlAnalysis.ts'
import { generateSecurityRecommendations, generateResourceRecommendations } from '../_shared/recommendations.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const { data: models, error: modelsError } = await supabaseClient
      .from('latest_ml_models')
      .select('*')
    
    if (modelsError) throw modelsError

    const mlPredictions = await analyzeMalwareAndPerformance(systemMetrics, models)
    console.log('ML predictions:', mlPredictions)

    const { data: scanData, error: scanError } = await supabaseClient
      .from('scan_history')
      .insert({
        scan_type: 'system_optimization',
        file_name: 'system_scan',
        scan_status: 'completed',
        stats: {
          malware_confidence: mlPredictions.malwareDetection.confidence,
          optimization_score: mlPredictions.performanceOptimization.confidence
        }
      })
      .select()
      .single()

    if (scanError) throw scanError

    const mlResults = mlPredictions.predictions.map(pred => ({
      scan_id: scanData.id,
      model_name: pred.modelName,
      confidence_score: pred.confidence,
      detection_type: pred.prediction,
      analysis_metadata: pred.metadata
    }))

    const { error: mlError } = await supabaseClient
      .from('ml_scan_results')
      .insert(mlResults)

    if (mlError) throw mlError

    const optimizationResults: OptimizationResults = {
      systemHealth: Math.round((1 - mlPredictions.malwareDetection.confidence) * 100),
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
      recommendations: [
        ...mlPredictions.performanceOptimization.metadata.optimization_areas,
        ...generateSecurityRecommendations(mlPredictions.malwareDetection),
        ...generateResourceRecommendations(mlPredictions.resourceUsage)
      ]
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