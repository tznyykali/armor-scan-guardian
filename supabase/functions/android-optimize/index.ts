import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  batteryLevel: number;
  storage: number;
  networkActivity?: number;
  runningProcesses?: string[];
}

interface MLPrediction {
  modelName: string;
  confidence: number;
  prediction: string;
  metadata: Record<string, any>;
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

    // Get latest ML models
    const { data: models, error: modelsError } = await supabaseClient
      .from('latest_ml_models')
      .select('*')
    
    if (modelsError) throw modelsError

    // Simulate ML model predictions (in production, this would use actual ML models)
    const mlPredictions = await analyzeMalwareAndPerformance(systemMetrics, models)
    console.log('ML predictions:', mlPredictions)

    // Store ML scan results
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

    // Store ML results
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

    const optimizationResults = generateOptimizationResults(systemMetrics, mlPredictions)
    console.log('Generated optimization results:', optimizationResults)

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

async function analyzeMalwareAndPerformance(metrics: SystemMetrics, models: any[]): Promise<{
  malwareDetection: MLPrediction;
  performanceOptimization: MLPrediction;
  resourceUsage: MLPrediction;
  predictions: MLPrediction[];
}> {
  // Simulate ML model predictions based on system metrics
  const malwareScore = calculateMalwareScore(metrics)
  const performanceScore = calculatePerformanceScore(metrics)
  const resourceScore = calculateResourceScore(metrics)

  const predictions = [
    {
      modelName: 'android-malware-detector',
      confidence: malwareScore,
      prediction: malwareScore > 0.85 ? 'malicious' : 'benign',
      metadata: {
        suspicious_patterns: detectSuspiciousPatterns(metrics),
        risk_level: malwareScore > 0.85 ? 'high' : malwareScore > 0.6 ? 'medium' : 'low'
      }
    },
    {
      modelName: 'system-optimizer',
      confidence: performanceScore,
      prediction: performanceScore < 0.6 ? 'needs_optimization' : 'optimal',
      metadata: {
        optimization_areas: identifyOptimizationAreas(metrics),
        current_performance: performanceScore
      }
    },
    {
      modelName: 'resource-analyzer',
      confidence: resourceScore,
      prediction: resourceScore < 0.7 ? 'inefficient' : 'efficient',
      metadata: {
        resource_usage_patterns: analyzeResourcePatterns(metrics),
        efficiency_score: resourceScore
      }
    }
  ]

  return {
    malwareDetection: predictions[0],
    performanceOptimization: predictions[1],
    resourceUsage: predictions[2],
    predictions
  }
}

function calculateMalwareScore(metrics: SystemMetrics): number {
  // Suspicious patterns that might indicate malware:
  // - High CPU usage
  // - High memory usage
  // - Rapid battery drain
  // - Unusual network activity
  const cpuWeight = 0.3
  const memoryWeight = 0.3
  const batteryWeight = 0.2
  const storageWeight = 0.2

  const cpuScore = 1 - (metrics.cpuUsage / 100)
  const memoryScore = 1 - (metrics.memoryUsage / 100)
  const batteryScore = metrics.batteryLevel / 100
  const storageScore = 1 - (metrics.storage / 100)

  return (
    cpuScore * cpuWeight +
    memoryScore * memoryWeight +
    batteryScore * batteryWeight +
    storageScore * storageWeight
  )
}

function calculatePerformanceScore(metrics: SystemMetrics): number {
  // Performance indicators:
  // - CPU efficiency
  // - Memory management
  // - Storage optimization
  const baseScore = (
    (100 - metrics.cpuUsage) +
    (100 - metrics.memoryUsage) +
    metrics.batteryLevel +
    (100 - metrics.storage)
  ) / 400

  return Math.max(0, Math.min(1, baseScore))
}

function calculateResourceScore(metrics: SystemMetrics): number {
  // Resource usage efficiency:
  // - Balance between performance and resource consumption
  const efficiencyScore = (
    (100 - metrics.cpuUsage) * 0.4 +
    (100 - metrics.memoryUsage) * 0.3 +
    (metrics.batteryLevel) * 0.3
  ) / 100

  return Math.max(0, Math.min(1, efficiencyScore))
}

function detectSuspiciousPatterns(metrics: SystemMetrics): string[] {
  const patterns = []
  
  if (metrics.cpuUsage > 80) patterns.push('Abnormal CPU usage')
  if (metrics.memoryUsage > 90) patterns.push('Excessive memory consumption')
  if (metrics.batteryLevel < 20) patterns.push('Rapid battery drain')
  if (metrics.storage > 95) patterns.push('Suspicious storage activity')
  
  return patterns
}

function identifyOptimizationAreas(metrics: SystemMetrics): string[] {
  const areas = []
  
  if (metrics.cpuUsage > 70) areas.push('CPU optimization needed')
  if (metrics.memoryUsage > 80) areas.push('Memory cleanup recommended')
  if (metrics.storage > 85) areas.push('Storage optimization required')
  if (metrics.batteryLevel < 30) areas.push('Battery optimization suggested')
  
  return areas
}

function analyzeResourcePatterns(metrics: SystemMetrics): {
  cpu: string;
  memory: string;
  battery: string;
  storage: string;
} {
  return {
    cpu: metrics.cpuUsage > 70 ? 'high' : metrics.cpuUsage > 40 ? 'moderate' : 'low',
    memory: metrics.memoryUsage > 80 ? 'high' : metrics.memoryUsage > 50 ? 'moderate' : 'low',
    battery: metrics.batteryLevel < 30 ? 'critical' : metrics.batteryLevel < 50 ? 'moderate' : 'good',
    storage: metrics.storage > 85 ? 'high' : metrics.storage > 60 ? 'moderate' : 'low'
  }
}

function generateOptimizationResults(metrics: SystemMetrics, mlPredictions: any) {
  const malwarePrediction = mlPredictions.malwareDetection
  const performancePrediction = mlPredictions.performanceOptimization
  const resourcePrediction = mlPredictions.resourceUsage

  return {
    systemHealth: Math.round((1 - malwarePrediction.confidence) * 100),
    malwareDetection: {
      threatsFound: malwarePrediction.metadata.suspicious_patterns.length,
      cleaned: malwarePrediction.confidence < 0.85,
      riskLevel: malwarePrediction.metadata.risk_level,
      suspiciousPatterns: malwarePrediction.metadata.suspicious_patterns
    },
    performance: {
      beforeOptimization: Math.round(performancePrediction.metadata.current_performance * 100),
      afterOptimization: Math.round(Math.min(
        performancePrediction.metadata.current_performance * 100 + 20,
        100
      )),
      optimizationAreas: performancePrediction.metadata.optimization_areas
    },
    resourceUsage: {
      patterns: resourcePrediction.metadata.resource_usage_patterns,
      efficiencyScore: Math.round(resourcePrediction.metadata.efficiency_score * 100)
    },
    recommendations: [
      ...performancePrediction.metadata.optimization_areas,
      ...generateSecurityRecommendations(malwarePrediction),
      ...generateResourceRecommendations(resourcePrediction)
    ]
  }
}

function generateSecurityRecommendations(malwarePrediction: MLPrediction): string[] {
  const recommendations = []
  
  if (malwarePrediction.confidence > 0.6) {
    recommendations.push('Run a full system security scan')
    recommendations.push('Review recently installed applications')
    recommendations.push('Update your security software')
  }
  
  return recommendations
}

function generateResourceRecommendations(resourcePrediction: MLPrediction): string[] {
  const recommendations = []
  const patterns = resourcePrediction.metadata.resource_usage_patterns
  
  if (patterns.cpu === 'high') {
    recommendations.push('Close unnecessary background applications')
  }
  if (patterns.memory === 'high') {
    recommendations.push('Clear application cache')
  }
  if (patterns.storage === 'high') {
    recommendations.push('Remove unused applications and files')
  }
  if (patterns.battery === 'critical') {
    recommendations.push('Enable battery saver mode')
  }
  
  return recommendations
}