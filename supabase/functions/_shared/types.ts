export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  batteryLevel: number;
  storage: number;
  networkActivity?: number;
  runningProcesses?: string[];
}

export interface MLPrediction {
  modelName: string;
  confidence: number;
  prediction: string;
  metadata: Record<string, any>;
}

export interface ResourcePatterns {
  cpu: string;
  memory: string;
  battery: string;
  storage: string;
}

export interface OptimizationResults {
  systemHealth: number;
  malwareDetection: {
    threatsFound: number;
    cleaned: boolean;
    riskLevel: string;
    suspiciousPatterns: string[];
  };
  performance: {
    beforeOptimization: number;
    afterOptimization: number;
    optimizationAreas: string[];
  };
  resourceUsage: {
    patterns: ResourcePatterns;
    efficiencyScore: number;
  };
  recommendations: string[];
}