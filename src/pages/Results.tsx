import React from 'react';
import NetworkBackground from "@/components/NetworkBackground";
import ScanResultCard from "@/components/ScanResultCard";
import { useToast } from "@/hooks/use-toast";

const Results = () => {
  const { toast } = useToast();
  const scanHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');

  return (
    <div className="min-h-screen pt-16">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-caramel-DEFAULT dark:text-forest-DEFAULT">
          Scan Results
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {scanHistory.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No scan results available
            </div>
          ) : (
            scanHistory.map((result: any) => (
              <ScanResultCard key={result.id} result={result} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;