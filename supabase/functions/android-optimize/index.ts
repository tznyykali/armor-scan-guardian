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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the request body
    const { systemMetrics } = await req.json()
    console.log('Received system metrics:', systemMetrics)

    // Get ML models
    const { data: models, error: modelsError } = await supabaseClient
      .from('latest_ml_models')
      .select('*')
    
    if (modelsError) {
      console.error('Error fetching ML models:', modelsError)
      throw modelsError
    }

    // Perform ML analysis
    const mlPredictions = analyzeMalwareAndPerformance(systemMetrics, models || [])
    console.log('ML predictions:', mlPredictions)

    // Store system metrics
    const { error: metricsError } = await supabaseClient
      .from('system_metrics')
      .insert([{
        cpu_usage: systemMetrics.cpuUsage,
        memory_usage: systemMetrics.memoryUsage,
        battery_level: systemMetrics.batteryLevel,
        storage: systemMetrics.storage,
        network_activity: systemMetrics.networkActivity,
        running_processes: systemMetrics.runningProcesses
      }])

    if (metricsError) {
      console.error('Error storing system metrics:', metricsError)
      throw metricsError
    }

    // Store ML results
    const { data: scanData, error: scanError } = await supabaseClient
      .from('ml_scan_results')
      .insert(mlPredictions.predictions.map(pred => ({
        model_name: pred.modelName,
        confidence_score: pred.confidence,
        detection_type: pred.prediction,
        analysis_metadata: pred.metadata
      })))
      .select()

    if (scanError) {
      console.error('Error storing ML results:', scanError)
      throw scanError
    }

    // Generate recommendations
    const securityRecommendations = generateSecurityRecommendations(mlPredictions.malwareDetection)
    const resourceRecommendations = generateResourceRecommendations(mlPredictions.resourceUsage)

    const optimizationResults: OptimizationResults = {
      systemHealth: Math.round((1 - mlPredictions.malwareDetection.confidence) * 100),
      malwareDetection: {
        threatsFound: mlPredictions.malwareDetection.metadata.suspicious_patterns.length,
        cleaned: mlPredictions.malwareDetection.confidence < 0.3,
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
      recommendations: [...securityRecommendations, ...resourceRecommendations]
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: optimizationResults 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error in android-optimize function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})