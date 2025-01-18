import React, { useState } from 'react';
import { Loader2, Shield, Zap, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import OptimizeHeader from './optimize/OptimizeHeader';
import SystemHealthCard from './optimize/SystemHealthCard';
import PerformanceCard from './optimize/PerformanceCard';
import ResourceUsageCard from './optimize/ResourceUsageCard';
import RecommendationsCard from './optimize/RecommendationsCard';
import InstalledAppsCard from './optimize/InstalledAppsCard';

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
  installedApps?: {
    name: string;
    packageName: string;
    version: string;
    installDate: string;
    size: number;
    permissions: string[];
    riskLevel: string;
  }[];
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  batteryLevel: number;
  storage: number;
  networkActivity?: number;
  runningProcesses?: string[];
  installedApps?: {
    name: string;
    packageName: string;
    version: string;
    installDate: string;
    size: number;
    permissions: string[];
  }[];
}

const OptimizeSection = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [results, setResults] = useState<OptimizationResults | null>(null);
  const { toast } = useToast();

  const getMockInstalledApps = () => {
    // Simulated list of installed apps for testing
    return [
      {
        name: "Social Media App",
        packageName: "com.example.social",
        version: "2.1.0",
        installDate: new Date().toISOString(),
        size: 45000000,
        permissions: ["CAMERA", "LOCATION", "STORAGE"]
      },
      {
        name: "Messaging App",
        packageName: "com.example.message",
        version: "3.0.1",
        installDate: new Date().toISOString(),
        size: 32000000,
        permissions: ["CONTACTS", "CAMERA", "MICROPHONE"]
      },
      // Add more mock apps as needed
    ];
  };

  const getSystemMetrics = (): SystemMetrics => {
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
      ],
      installedApps: getMockInstalledApps()
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

      if (error) throw error;

      console.log('Received optimization results:', data);
      setResults(data.data);
      setOptimizationProgress(100);
      
      toast({
        title: data.data.malwareDetection.threatsFound > 0 ? "Warning" : "Optimization Complete",
        description: data.data.malwareDetection.threatsFound > 0
          ? "Threats detected! Review the analysis results."
          : "Your device has been successfully optimized",
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

  return (
    <div className="w-full max-w-2xl mx-auto bg-cyber-muted/50 backdrop-blur-lg rounded-lg p-8 border border-cyber-accent/20">
      <OptimizeHeader />

      <div className="space-y-6">
        <div className="bg-cyber-DEFAULT/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Smartphone className="w-5 h-5 text-safe-DEFAULT" />
            <span className="font-medium">App Security Scanner</span>
          </div>
          <p className="text-sm text-foreground/60">
            Comprehensive security analysis of all installed applications and system optimization.
          </p>
        </div>

        {results && !isOptimizing && (
          <div className="space-y-6">
            <SystemHealthCard
              systemHealth={results.systemHealth}
              riskLevel={results.malwareDetection.riskLevel}
              threatsFound={results.malwareDetection.threatsFound}
              suspiciousPatterns={results.malwareDetection.suspiciousPatterns}
            />
            
            {results.installedApps && (
              <InstalledAppsCard apps={results.installedApps} />
            )}
            
            <PerformanceCard
              beforeOptimization={results.performance.beforeOptimization}
              afterOptimization={results.performance.afterOptimization}
            />
            
            <ResourceUsageCard patterns={results.resourceUsage.patterns} />
            
            <RecommendationsCard recommendations={results.recommendations} />
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
              <span>Scanning Apps & System... {optimizationProgress}%</span>
            </>
          ) : (
            <span>Start System & Apps Analysis</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default OptimizeSection;