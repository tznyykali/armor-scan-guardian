import { SystemMetrics } from '@/integrations/supabase/types';

// Industry standard thresholds based on Android performance guidelines
const THRESHOLDS = {
  cpu: {
    critical: 85,
    high: 70,
    moderate: 50,
    low: 30
  },
  memory: {
    critical: 90,
    high: 75,
    moderate: 60,
    low: 40
  },
  battery: {
    critical: 15,
    high: 30,
    moderate: 50,
    optimal: 80
  },
  storage: {
    critical: 95,
    high: 85,
    moderate: 70,
    low: 50
  }
};

export function generateRealisticSystemMetrics(): SystemMetrics {
  // Time-based variation for more realistic metrics
  const timeOfDay = new Date().getHours();
  const isBusinessHours = timeOfDay >= 9 && timeOfDay <= 18;
  
  // Base values with realistic variations
  const baseLoad = isBusinessHours ? 0.6 : 0.4;
  const randomVariation = () => Math.random() * 0.2 - 0.1; // ±10% variation

  return {
    cpuUsage: Math.floor((baseLoad + randomVariation()) * 100),
    memoryUsage: Math.floor((baseLoad + randomVariation()) * 100),
    batteryLevel: Math.floor((1 - (baseLoad * 0.5) + randomVariation()) * 100),
    storage: Math.floor((0.7 + randomVariation()) * 100),
    networkActivity: Math.floor(Math.random() * 100),
    runningProcesses: [
      'system_server',
      'com.android.systemui',
      'com.google.android.gms',
      'com.android.phone',
      ...(isBusinessHours ? [
        'com.android.chrome',
        'com.google.android.apps.docs',
        'com.microsoft.teams'
      ] : [])
    ]
  };
}

export function analyzeSystemHealth(metrics: SystemMetrics): {
  overallHealth: number;
  issues: string[];
  recommendations: string[];
} {
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

  // Process Analysis
  if (metrics.runningProcesses && metrics.runningProcesses.length > 10) {
    healthScore -= 10;
    issues.push('High number of running processes');
    recommendations.push('Review and optimize background processes');
  }

  return {
    overallHealth: Math.max(0, Math.min(100, healthScore)),
    issues,
    recommendations
  };
}

export function getResourceUsagePatterns(metrics: SystemMetrics): {
  patterns: Record<string, string>;
  score: number;
} {
  const patterns: Record<string, string> = {};
  let totalScore = 0;

  // CPU Pattern Analysis
  if (metrics.cpuUsage >= THRESHOLDS.cpu.critical) {
    patterns.cpu = 'critical';
    totalScore += 0;
  } else if (metrics.cpuUsage >= THRESHOLDS.cpu.high) {
    patterns.cpu = 'high';
    totalScore += 25;
  } else if (metrics.cpuUsage >= THRESHOLDS.cpu.moderate) {
    patterns.cpu = 'moderate';
    totalScore += 75;
  } else {
    patterns.cpu = 'low';
    totalScore += 100;
  }

  // Memory Pattern Analysis
  if (metrics.memoryUsage >= THRESHOLDS.memory.critical) {
    patterns.memory = 'critical';
    totalScore += 0;
  } else if (metrics.memoryUsage >= THRESHOLDS.memory.high) {
    patterns.memory = 'high';
    totalScore += 25;
  } else if (metrics.memoryUsage >= THRESHOLDS.memory.moderate) {
    patterns.memory = 'moderate';
    totalScore += 75;
  } else {
    patterns.memory = 'low';
    totalScore += 100;
  }

  // Battery Pattern Analysis
  if (metrics.batteryLevel <= THRESHOLDS.battery.critical) {
    patterns.battery = 'critical';
    totalScore += 0;
  } else if (metrics.batteryLevel <= THRESHOLDS.battery.high) {
    patterns.battery = 'low';
    totalScore += 25;
  } else if (metrics.batteryLevel <= THRESHOLDS.battery.moderate) {
    patterns.battery = 'moderate';
    totalScore += 75;
  } else {
    patterns.battery = 'good';
    totalScore += 100;
  }

  // Storage Pattern Analysis
  if (metrics.storage >= THRESHOLDS.storage.critical) {
    patterns.storage = 'critical';
    totalScore += 0;
  } else if (metrics.storage >= THRESHOLDS.storage.high) {
    patterns.storage = 'high';
    totalScore += 25;
  } else if (metrics.storage >= THRESHOLDS.storage.moderate) {
    patterns.storage = 'moderate';
    totalScore += 75;
  } else {
    patterns.storage = 'low';
    totalScore += 100;
  }

  return {
    patterns,
    score: Math.floor(totalScore / 4) // Average score across all metrics
  };
}