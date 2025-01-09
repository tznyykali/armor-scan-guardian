import React, { useState } from 'react';
import { Smartphone, CheckCircle, Loader2, Shield, Zap, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface OptimizationResults {
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
    patterns: {
      cpu: string;
      memory: string;
      battery: string;
      storage: string;
    };
    efficiencyScore: number;
  };
  recommendations: string[];
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  batteryLevel: number;
  storage: number;
  networkActivity?: number;
  runningProcesses?: string[];
}

const OptimizeSection = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [results, setResults] = useState<OptimizationResults | null>(null);
  const { toast } = useToast();

  const getSystemMetrics = (): SystemMetrics => {
    // Simulate realistic system metrics
    return {
      cpuUsage: Math.floor(Math.random() * 40) + 30,
      memoryUsage: Math.floor(Math.random() * 30) + 50,
      batteryLevel: Math.floor(Math.random() * 60) + 40,
      storage: Math.floor(Math.random() * 30) + 60,
      networkActivity: Math.floor(Math.random() * 100),
      runningProcesses: [
        'system_server',
        'com.android.systemui',
        'com.google.android.gms',
        'com.android.phone'
      ]
    };
  };

  const startOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      const interval = setInterval(() => {
        setOptimizationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const systemMetrics = getSystemMetrics();
      console.log('Sending system metrics:', systemMetrics);

      const { data, error } = await supabase.functions.invoke('android-optimize', {
        body: { systemMetrics }
      });

      clearInterval(interval);

      if (error) {
        throw error;
      }

      console.log('Received optimization results:', data);
      setResults(data.data);
      setOptimizationProgress(100);
      
      const toastMessage = data.data.malwareDetection.threatsFound > 0
        ? "Threats detected! Review the analysis results."
        : "Your Android device has been successfully optimized";
      
      toast({
        title: data.data.malwareDetection.threatsFound > 0 ? "Warning" : "Optimization Complete",
        description: toastMessage,
        variant: data.data.malwareDetection.threatsFound > 0 ? "destructive" : "default",
      });
    } catch (error) {
      console.error('Optimization error:', error);
      toast({
        title: "Optimization Failed",
        description: "An error occurred during optimization",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-foreground';
    }
  };

  const getResourceStatusColor = (status: string) => {
    switch (status) {
      case 'high':
      case 'critical':
        return 'text-red-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'low':
      case 'good':
        return 'text-green-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-cyber-muted/50 backdrop-blur-lg rounded-lg p-8 border border-cyber-accent/20">
      <div className="flex items-center space-x-4 mb-8">
        <Smartphone className="w-8 h-8 text-safe-DEFAULT" />
        <h2 className="text-2xl font-semibold">Android Optimizer</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-cyber-DEFAULT/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-safe-DEFAULT" />
            <span className="font-medium">ML-Powered System Analysis</span>
          </div>
          <p className="text-sm text-foreground/60">
            Advanced machine learning analysis of your Android system for security threats and performance optimization.
          </p>
        </div>

        {results && !isOptimizing && (
          <div className="space-y-6">
            <div className="bg-cyber-DEFAULT/30 rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-lg">Security Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-foreground/60">System Health</p>
                  <p className="font-medium">{results.systemHealth}%</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Risk Level</p>
                  <p className={`font-medium ${getRiskLevelColor(results.malwareDetection.riskLevel)}`}>
                    {results.malwareDetection.riskLevel.toUpperCase()}
                  </p>
                </div>
              </div>
              
              {results.malwareDetection.threatsFound > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-500 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    {results.malwareDetection.threatsFound} threat(s) detected
                  </p>
                  <ul className="mt-2 space-y-1">
                    {results.malwareDetection.suspiciousPatterns.map((pattern, index) => (
                      <li key={index} className="text-sm text-red-400">
                        • {pattern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="bg-cyber-DEFAULT/30 rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-lg">Performance Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-foreground/60">Before Optimization</p>
                  <p className="font-medium">{results.performance.beforeOptimization}%</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">After Optimization</p>
                  <p className="font-medium">{results.performance.afterOptimization}%</p>
                </div>
              </div>
            </div>

            <div className="bg-cyber-DEFAULT/30 rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-lg">Resource Usage</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-foreground/60">CPU Usage</p>
                  <p className={`font-medium ${getResourceStatusColor(results.resourceUsage.patterns.cpu)}`}>
                    {results.resourceUsage.patterns.cpu.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Memory Usage</p>
                  <p className={`font-medium ${getResourceStatusColor(results.resourceUsage.patterns.memory)}`}>
                    {results.resourceUsage.patterns.memory.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Battery Status</p>
                  <p className={`font-medium ${getResourceStatusColor(results.resourceUsage.patterns.battery)}`}>
                    {results.resourceUsage.patterns.battery.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60">Storage Usage</p>
                  <p className={`font-medium ${getResourceStatusColor(results.resourceUsage.patterns.storage)}`}>
                    {results.resourceUsage.patterns.storage.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cyber-DEFAULT/30 rounded-lg p-4">
              <h3 className="font-medium text-lg mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-safe-DEFAULT flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {isOptimizing && (
          <div className="w-full bg-cyber-DEFAULT/30 rounded-full h-2 mb-4">
            <div
              className="bg-safe-DEFAULT h-2 rounded-full transition-all duration-300"
              style={{ width: `${optimizationProgress}%` }}
            />
          </div>
        )}

        <button
          onClick={startOptimization}
          disabled={isOptimizing}
          className="w-full px-6 py-3 bg-safe-DEFAULT text-cyber-DEFAULT font-semibold rounded-md hover:bg-safe-muted transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {isOptimizing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing System... {optimizationProgress}%</span>
            </>
          ) : (
            <span>Start System Analysis</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default OptimizeSection;