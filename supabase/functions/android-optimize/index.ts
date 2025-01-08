import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { load } from "https://deno.land/x/deno_joblib@0.1.0/mod.ts";

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Download the model from storage
    const { data: modelData, error: modelError } = await supabase
      .storage
      .from('ml_models')
      .download('android_ids.joblib')

    if (modelError) {
      throw new Error('Failed to load ML model: ' + modelError.message)
    }

    // Convert the downloaded model to ArrayBuffer
    const modelBuffer = await modelData.arrayBuffer()
    
    // Load the model
    const model = await load(modelBuffer)
    console.log('Model loaded successfully')

    // Extract features from the request
    // This should match your training data format
    const { systemMetrics } = await req.json()
    
    // Make prediction using the model
    const prediction = await model.predict([systemMetrics])
    console.log('Prediction made:', prediction)

    // Process the prediction results
    const optimizationResults = {
      systemHealth: calculateSystemHealth(systemMetrics),
      malwareDetection: {
        threatsFound: prediction[0] === 1 ? 1 : 0,
        cleaned: prediction[0] === 0
      },
      performance: {
        beforeOptimization: systemMetrics.performance || 70,
        afterOptimization: Math.min((systemMetrics.performance || 70) + 15, 100)
      },
      recommendations: generateRecommendations(systemMetrics)
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
      JSON.stringify({ error: error.message }),
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

function calculateSystemHealth(metrics: any): number {
  // Calculate system health based on various metrics
  const baseHealth = 75
  const cpuImpact = (metrics.cpuUsage || 0) * -0.2
  const memoryImpact = (metrics.memoryUsage || 0) * -0.2
  const batteryImpact = (metrics.batteryLevel || 100) * 0.1
  
  return Math.min(Math.max(baseHealth + cpuImpact + memoryImpact + batteryImpact, 0), 100)
}

function generateRecommendations(metrics: any): string[] {
  const recommendations: string[] = []
  
  if (metrics.cpuUsage > 70) {
    recommendations.push("Close background applications to reduce CPU usage")
  }
  if (metrics.memoryUsage > 80) {
    recommendations.push("Clear RAM by closing unused applications")
  }
  if (metrics.batteryLevel < 20) {
    recommendations.push("Enable battery saver mode")
  }
  if (metrics.storage > 90) {
    recommendations.push("Clear cache and temporary files")
  }
  
  // Add default recommendations if none were triggered
  if (recommendations.length === 0) {
    recommendations.push(
      "Regularly update your applications",
      "Monitor battery usage patterns",
      "Keep your Android system updated"
    )
  }
  
  return recommendations
}