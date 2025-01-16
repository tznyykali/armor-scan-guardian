import React, { useState } from 'react';
import UrlScanner from './UrlScanner';
import FileScanner from './FileScanner';
import ScanResultCard from './ScanResultCard';
import { ScanResult } from '@/types/scan';

const ScanSection = () => {
  const [currentScanResult, setCurrentScanResult] = useState<ScanResult | null>(null);

  const handleNewScan = (result: ScanResult) => {
    setCurrentScanResult(result);
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto font-mono">
      <div className="grid md:grid-cols-2 gap-8">
        <UrlScanner onScanComplete={handleNewScan} />
        <FileScanner onScanComplete={handleNewScan} />
      </div>
      
      {currentScanResult && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h3 className="text-xl font-mono text-rust dark:text-rust-light">
            Scan Results_
          </h3>
          <ScanResultCard result={currentScanResult} />
        </div>
      )}
    </div>
  );
};

export default ScanSection;