import React, { useState } from 'react';
import { Smartphone, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const OptimizeSection = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const { toast } = useToast();

  const startOptimization = () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsOptimizing(false);
          toast({
            title: "Optimization Complete",
            description: "Your Android device has been successfully optimized",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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
            <CheckCircle className="w-5 h-5 text-safe-DEFAULT" />
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
            <CheckCircle className="w-5 h-5 text-safe-DEFAULT" />
            <span className="font-medium">Performance Optimization</span>
          </div>
          <p className="text-sm text-foreground/60">
            Advanced optimization techniques to enhance your device's performance.
          </p>
        </div>

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