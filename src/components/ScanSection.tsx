import React, { useEffect, useState } from 'react';
import UrlScanner from './UrlScanner';
import FileScanner from './FileScanner';
import { supabase } from '@/integrations/supabase/client';
import ScanResultCard from './ScanResultCard';
import { ScanResult } from '@/types/scan';

const ScanSection = () => {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  useEffect(() => {
    fetchLatestScans();
  }, []);

  const fetchLatestScans = async () => {
    const { data, error } = await supabase
      .from('scan_history')
      .select(`
        id,
        scan_type,
        file_name,
        scan_timestamp,
        scan_status,
        file_metadata,
        malware_classification
      `)
      .order('scan_timestamp', { ascending: false })
      .limit(5);

    if (error) {
      console.error('Error fetching scan results:', error);
      return;
    }

    if (data) {
      const formattedResults = data.map(item => ({
        id: item.id,
        type: item.scan_type as 'url' | 'file',
        target: item.file_name,
        timestamp: item.scan_timestamp,
        results: {
          status: item.scan_status,
          metadata: item.file_metadata,
          malware_classification: item.malware_classification
        }
      }));
      setScanResults(formattedResults);
    }
  };

  const handleNewScan = () => {
    fetchLatestScans();
  };

  return (
    <div className="space-y-8 w-full max-w-4xl mx-auto font-mono">
      <div className="grid md:grid-cols-2 gap-8">
        <UrlScanner onScanComplete={handleNewScan} />
        <FileScanner onScanComplete={handleNewScan} />
      </div>
      
      {scanResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-mono text-rust dark:text-rust-light">
            Recent Scan Results_
          </h3>
          <div className="space-y-4">
            {scanResults.map((result) => (
              <ScanResultCard key={result.id} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanSection;