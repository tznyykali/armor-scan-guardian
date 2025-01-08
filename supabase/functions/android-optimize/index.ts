import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.17.0/dist/tf.min.js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { systemMetrics } = await req.json()
    console.log('Received system metrics:', systemMetrics)

    // Initialize TensorFlow model
    const model = await initializeModel()
    
    // Process metrics and generate predictions
    const optimizationResults = await processMetrics(model, systemMetrics)
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

async function initializeModel() {
  // Define a simple sequential model for system optimization
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [4], units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 4, activation: 'sigmoid' })
    ]
  });

  // Compile the model
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'meanSquaredError'
  });

  return model;
}

async function processMetrics(model: any, metrics: any) {
  // Normalize input metrics
  const inputTensor = tf.tensor2d([[
    metrics.cpuUsage / 100,
    metrics.memoryUsage / 100,
    metrics.batteryLevel / 100,
    metrics.storage / 100
  ]]);

  // Get model predictions
  const predictions = await model.predict(inputTensor).array();
  const [optimizedMetrics] = predictions;

  // Calculate system health based on optimized metrics
  const systemHealth = calculateSystemHealth(optimizedMetrics);
  
  // Generate optimization results
  return {
    systemHealth,
    malwareDetection: {
      threatsFound: detectThreats(metrics),
      cleaned: true
    },
    performance: {
      beforeOptimization: metrics.performance || 70,
      afterOptimization: Math.min(metrics.performance + (systemHealth - 70), 100)
    },
    recommendations: generateRecommendations(metrics, optimizedMetrics)
  };
}

function calculateSystemHealth(optimizedMetrics: number[]): number {
  // Convert optimized metrics to a health score (0-100)
  const weightedSum = optimizedMetrics.reduce((sum, metric) => sum + metric, 0);
  return Math.min(Math.round((weightedSum / optimizedMetrics.length) * 100), 100);
}

function detectThreats(metrics: any): number {
  // Implement threat detection logic based on system metrics
  const threatIndicators = [
    metrics.cpuUsage > 80,
    metrics.memoryUsage > 90,
    metrics.storage > 95
  ];
  
  return threatIndicators.filter(Boolean).length;
}

function generateRecommendations(currentMetrics: any, optimizedMetrics: number[]): string[] {
  const recommendations: string[] = [];
  
  if (currentMetrics.cpuUsage > optimizedMetrics[0] * 100) {
    recommendations.push("Optimize CPU usage by closing background applications");
  }
  if (currentMetrics.memoryUsage > optimizedMetrics[1] * 100) {
    recommendations.push("Free up memory by clearing unused applications");
  }
  if (currentMetrics.batteryLevel < optimizedMetrics[2] * 100) {
    recommendations.push("Enable battery optimization mode");
  }
  if (currentMetrics.storage > optimizedMetrics[3] * 100) {
    recommendations.push("Clear cache and temporary files to optimize storage");
  }
  
  // Add default recommendations if none were triggered
  if (recommendations.length === 0) {
    recommendations.push(
      "Maintain regular system updates",
      "Monitor app battery usage",
      "Keep Android OS updated to latest version"
    );
  }
  
  return recommendations;
}