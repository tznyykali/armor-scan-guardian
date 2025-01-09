import { SystemMetrics, MLPrediction } from './types.ts';

export function calculateMalwareScore(metrics: SystemMetrics): number {
  const cpuWeight = 0.3;
  const memoryWeight = 0.3;
  const batteryWeight = 0.2;
  const storageWeight = 0.2;

  const cpuScore = 1 - (metrics.cpuUsage / 100);
  const memoryScore = 1 - (metrics.memoryUsage / 100);
  const batteryScore = metrics.batteryLevel / 100;
  const storageScore = 1 - (metrics.storage / 100);

  return (
    cpuScore * cpuWeight +
    memoryScore * memoryWeight +
    batteryScore * batteryWeight +
    storageScore * storageWeight
  );
}

export function calculatePerformanceScore(metrics: SystemMetrics): number {
  const baseScore = (
    (100 - metrics.cpuUsage) +
    (100 - metrics.memoryUsage) +
    metrics.batteryLevel +
    (100 - metrics.storage)
  ) / 400;

  return Math.max(0, Math.min(1, baseScore));
}

export function calculateResourceScore(metrics: SystemMetrics): number {
  const efficiencyScore = (
    (100 - metrics.cpuUsage) * 0.4 +
    (100 - metrics.memoryUsage) * 0.3 +
    (metrics.batteryLevel) * 0.3
  ) / 100;

  return Math.max(0, Math.min(1, efficiencyScore));
}

export function analyzeMalwareAndPerformance(metrics: SystemMetrics, models: any[]): {
  malwareDetection: MLPrediction;
  performanceOptimization: MLPrediction;
  resourceUsage: MLPrediction;
  predictions: MLPrediction[];
} {
  const malwareScore = calculateMalwareScore(metrics);
  const performanceScore = calculatePerformanceScore(metrics);
  const resourceScore = calculateResourceScore(metrics);

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
  ];

  return {
    malwareDetection: predictions[0],
    performanceOptimization: predictions[1],
    resourceUsage: predictions[2],
    predictions
  };
}

export function detectSuspiciousPatterns(metrics: SystemMetrics): string[] {
  const patterns = [];
  
  if (metrics.cpuUsage > 80) patterns.push('Abnormal CPU usage');
  if (metrics.memoryUsage > 90) patterns.push('Excessive memory consumption');
  if (metrics.batteryLevel < 20) patterns.push('Rapid battery drain');
  if (metrics.storage > 95) patterns.push('Suspicious storage activity');
  
  return patterns;
}

export function identifyOptimizationAreas(metrics: SystemMetrics): string[] {
  const areas = [];
  
  if (metrics.cpuUsage > 70) areas.push('CPU optimization needed');
  if (metrics.memoryUsage > 80) areas.push('Memory cleanup recommended');
  if (metrics.storage > 85) areas.push('Storage optimization required');
  if (metrics.batteryLevel < 30) areas.push('Battery optimization suggested');
  
  return areas;
}

export function analyzeResourcePatterns(metrics: SystemMetrics): {
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
  };
}