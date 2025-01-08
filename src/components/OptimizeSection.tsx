import React, { useState } from 'react';
import { Smartphone, CheckCircle, Loader2, Shield, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface OptimizationResults {
  systemHealth: number;
  malwareDetection: {
    threatsFound: number;
    cleaned: boolean;
  };
  performance: {
    beforeOptimization: number;
    afterOptimization: number;
  };
  recommendations: string[];
}

const OptimizeSection = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [results, setResults] = useState<OptimizationResults | null>(null);
  const { toast } = useToast();

  const startOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    try {
      // Start progress animation
      const interval = setInterval(() => {
        setOptimizationProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Call the optimization function
      const { data, error } = await supabase.functions.invoke('android-optimize');

      clearInterval(interval);

      if (error) {
        throw error;
      }

      setResults(data.data);
      setOptimizationProgress(100);
      
      toast({
        title: "Optimization Complete",
        description: "Your Android device has been successfully optimized",
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
      <div className="flex items-center space-x-4 mb-8">
        <Smartphone className="w-8 h-8 text-safe-DEFAULT" />
        <h2 className="text-2xl font-semibold">Android Optimizer</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-cyber-DEFAULT/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-5 h-5 text-safe-DEFAULT" />
            <span className="font-medium">System Analysis</span>
          </div>
          <p className="text-sm text-foreground/60">
            Comprehensive scan of your Android system for potential security threats and performance issues.
          </p>
        </div>

        <div className="bg-cyber-DEFAULT/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-safe-DEFAULT" />
            <span className="font-medium">Malware Detection</span>
          </div>
          <p className="text-sm text-foreground/60">
            Military-grade scanning algorithm to detect and eliminate malicious software.
          </p>
        </div>

        <div className="bg-cyber-DEFAULT/30 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-5 h-5 text-safe-DEFAULT" />
            <span className="font-medium">Performance Optimization</span>
          </div>
          <p className="text-sm text-foreground/60">
            Advanced optimization techniques to enhance your device's performance.
          </p>
        </div>

        {results && !isOptimizing && (
          <div className="bg-cyber-DEFAULT/30 rounded-lg p-4 space-y-4">
            <h3 className="font-medium text-lg">Optimization Results</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground/60">System Health</p>
                <p className="font-medium">{results.systemHealth.toFixed(1)}%</p>
              </div>
              
              <div>
                <p className="text-sm text-foreground/60">Threats Detected</p>
                <p className="font-medium">{results.malwareDetection.threatsFound}</p>
              </div>
              
              <div>
                <p className="text-sm text-foreground/60">Performance Before</p>
                <p className="font-medium">{results.performance.beforeOptimization}%</p>
              </div>
              
              <div>
                <p className="text-sm text-foreground/60">Performance After</p>
                <p className="font-medium">{results.performance.afterOptimization}%</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Recommendations:</p>
              <ul className="text-sm text-foreground/60 space-y-1">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-safe-DEFAULT" />
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
              <span>Optimizing... {optimizationProgress}%</span>
            </>
          ) : (
            <span>Start Optimization</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default OptimizeSection;