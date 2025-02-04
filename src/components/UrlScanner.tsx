import React, { useState } from 'react';
import { Link as LinkIcon, Loader2 } from 'lucide-react';
import { scanUrl } from '@/services/virusTotalService';
import { ScanResult } from '@/types/scan';
import { useScan } from '@/hooks/useScan';

interface UrlScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

const UrlScanner = ({ onScanComplete }: UrlScannerProps) => {
  const [urlInput, setUrlInput] = useState('');
  const { isScanning, setIsScanning, handleScanComplete, handleScanFailure } = useScan({ onScanComplete });

  const handleUrlScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) {
      handleScanFailure(new Error('Please enter a URL to scan'));
      return;
    }

    setIsScanning(true);
    try {
      const results = await scanUrl(urlInput);
      if (!results) {
        throw new Error('No scan results received');
      }

      handleScanComplete('url', urlInput, results);
      setUrlInput('');
    } catch (error) {
      handleScanFailure(error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-sage/50 dark:bg-taupe/50 backdrop-blur-lg rounded-lg p-6 border border-sage-dark/20">
      <div className="flex items-center space-x-2 mb-4">
        <LinkIcon className="w-5 h-5 text-rust dark:text-rust-light" />
        <h3 className="text-lg font-mono text-rust dark:text-rust-light">URL Scanner_</h3>
      </div>
      <form onSubmit={handleUrlScan} className="space-y-4">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter URL to scan..."
          className="w-full px-4 py-2 bg-beige/50 dark:bg-taupe-dark/50 border border-sage-dark/20 rounded-md focus:outline-none focus:ring-2 focus:ring-rust/50 font-mono text-rust-dark dark:text-beige placeholder:text-taupe-dark/50"
        />
        <button
          type="submit"
          disabled={isScanning}
          className="w-full px-4 py-2 bg-rust text-beige font-mono rounded-md hover:bg-rust-dark transition-colors disabled:opacity-50"
        >
          {isScanning ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Scanning...
            </span>
          ) : (
            'Scan URL_'
          )}
        </button>
      </form>
    </div>
  );
};

export default UrlScanner;