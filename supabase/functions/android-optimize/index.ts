import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

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

    // Get the request body
    const { systemMetrics } = await req.json()
    console.log('Received system metrics:', systemMetrics)

    // Process the metrics and generate optimization results
    // This is where we'll implement the actual model logic in the next iteration
    const optimizationResults = processMetrics(systemMetrics)
    console.log('Generated optimization results:', optimizationResults)

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

function processMetrics(metrics: any) {
  // Implement basic optimization logic
  // This will be replaced with actual ML model predictions
  const baseHealth = 75
  const cpuImpact = (metrics.cpuUsage || 0) * -0.2
  const memoryImpact = (metrics.memoryUsage || 0) * -0.2
  const batteryImpact = (metrics.batteryLevel || 100) * 0.1
  
  const systemHealth = Math.min(Math.max(baseHealth + cpuImpact + memoryImpact + batteryImpact, 0), 100)
  
  return {
    systemHealth,
    malwareDetection: {
      threatsFound: metrics.cpuUsage > 80 ? 1 : 0,
      cleaned: true
    },
    performance: {
      beforeOptimization: metrics.performance || 70,
      afterOptimization: Math.min((metrics.performance || 70) + 15, 100)
    },
    recommendations: generateRecommendations(metrics)
  }
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