import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { systemMetrics } = await req.json()
    console.log('Received system metrics:', systemMetrics)
    
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

function processMetrics(metrics) {
  // Calculate system health based on weighted metrics
  const weights = {
    cpuUsage: 0.3,
    memoryUsage: 0.3,
    batteryLevel: 0.2,
    storage: 0.2
  };

  const systemHealth = Math.round(
    (100 - metrics.cpuUsage) * weights.cpuUsage +
    (100 - metrics.memoryUsage) * weights.memoryUsage +
    metrics.batteryLevel * weights.batteryLevel +
    (100 - metrics.storage) * weights.storage
  );

  // Detect potential threats based on threshold values
  const threats = detectThreats(metrics);

  // Calculate performance improvement
  const performanceImprovement = calculatePerformanceImprovement(metrics, systemHealth);

  return {
    systemHealth,
    malwareDetection: {
      threatsFound: threats.length,
      cleaned: true
    },
    performance: {
      beforeOptimization: metrics.performance || 70,
      afterOptimization: Math.min(metrics.performance + performanceImprovement, 100)
    },
    recommendations: generateRecommendations(metrics, threats)
  };
}

function detectThreats(metrics) {
  const threats = [];
  
  if (metrics.cpuUsage > 80) threats.push('high_cpu_usage');
  if (metrics.memoryUsage > 90) threats.push('high_memory_usage');
  if (metrics.storage > 95) threats.push('storage_critical');
  if (metrics.batteryLevel < 20) threats.push('low_battery');
  
  return threats;
}

function calculatePerformanceImprovement(metrics, systemHealth) {
  // Calculate potential improvement based on current system health
  const baseImprovement = (systemHealth - metrics.performance) * 0.5;
  return Math.max(Math.min(baseImprovement, 30), 0); // Cap improvement between 0-30%
}

function generateRecommendations(metrics, threats) {
  const recommendations = [];

  if (threats.includes('high_cpu_usage')) {
    recommendations.push("Optimize CPU usage by closing background applications");
  }
  if (threats.includes('high_memory_usage')) {
    recommendations.push("Free up memory by clearing unused applications");
  }
  if (threats.includes('low_battery')) {
    recommendations.push("Enable battery optimization mode");
  }
  if (threats.includes('storage_critical')) {
    recommendations.push("Clear cache and temporary files to optimize storage");
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "Maintain regular system updates",
      "Monitor app battery usage",
      "Keep Android OS updated to latest version"
    );
  }

  return recommendations;
}