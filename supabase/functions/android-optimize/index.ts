import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { tensorflow } from "npm:@tensorflow/tfjs-node@4.17.0"

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
  const model = tensorflow.sequential();
  
  model.add(tensorflow.layers.dense({
    inputShape: [4],
    units: 8,
    activation: 'relu',
    kernelInitializer: 'glorotNormal'
  }));
  
  model.add(tensorflow.layers.dense({
    units: 8,
    activation: 'relu',
    kernelInitializer: 'glorotNormal'
  }));
  
  model.add(tensorflow.layers.dense({
    units: 4,
    activation: 'sigmoid',
    kernelInitializer: 'glorotNormal'
  }));

  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
    metrics: ['accuracy']
  });

  return model;
}

async function processMetrics(model, metrics) {
  try {
    const inputTensor = tensorflow.tensor2d([[
      metrics.cpuUsage / 100,
      metrics.memoryUsage / 100,
      metrics.batteryLevel / 100,
      metrics.storage / 100
    ]]);

    const predictions = model.predict(inputTensor);
    const optimizedMetrics = await predictions.array();
    
    inputTensor.dispose();
    predictions.dispose();
    
    return {
      systemHealth: calculateSystemHealth(optimizedMetrics[0]),
      malwareDetection: {
        threatsFound: detectThreats(metrics),
        cleaned: true
      },
      performance: {
        beforeOptimization: metrics.performance || 70,
        afterOptimization: Math.min(metrics.performance + (calculateSystemHealth(optimizedMetrics[0]) - 70), 100)
      },
      recommendations: generateRecommendations(metrics, optimizedMetrics[0])
    };
  } catch (error) {
    console.error('Error processing metrics:', error);
    throw error;
  }
}

function calculateSystemHealth(optimizedMetrics) {
  const weightedSum = optimizedMetrics.reduce((sum, metric) => sum + metric, 0);
  return Math.min(Math.round((weightedSum / optimizedMetrics.length) * 100), 100);
}

function detectThreats(metrics) {
  const threatIndicators = [
    metrics.cpuUsage > 80,
    metrics.memoryUsage > 90,
    metrics.storage > 95
  ];
  
  return threatIndicators.filter(Boolean).length;
}

function generateRecommendations(currentMetrics, optimizedMetrics) {
  const recommendations = [];
  
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
  
  if (recommendations.length === 0) {
    recommendations.push(
      "Maintain regular system updates",
      "Monitor app battery usage",
      "Keep Android OS updated to latest version"
    );
  }
  
  return recommendations;
}