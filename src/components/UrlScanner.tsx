import React, { useState } from 'react';
import { Link as LinkIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scanUrl } from '@/services/virusTotalService';
import { saveScanResult } from '@/services/scanHistoryService';
import { useNavigate } from 'react-router-dom';

const UrlScanner = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleUrlScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      const results = await scanUrl(urlInput);
      await saveScanResult('url', urlInput, results);
      navigate('/results');
    } catch (error) {
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "Failed to scan URL",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-mist-light/50 dark:bg-midnight-DEFAULT/50 backdrop-blur-lg rounded-lg p-6 border border-forest-DEFAULT/20">
      <div className="flex items-center space-x-2 mb-4">
        <LinkIcon className="w-5 h-5 text-forest-DEFAULT dark:text-caramel-DEFAULT" />
        <h3 className="text-lg font-semibold text-forest-DEFAULT dark:text-caramel-DEFAULT">URL Scanner</h3>
      </div>
      <form onSubmit={handleUrlScan} className="space-y-4">
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="Enter URL to scan..."
          className="w-full px-4 py-2 bg-white/50 dark:bg-midnight-DEFAULT/50 border border-forest-DEFAULT/20 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-DEFAULT/50"
        />
        <button
          type="submit"
          disabled={isScanning}
          className="w-full px-4 py-2 bg-forest-DEFAULT text-white font-semibold rounded-md hover:bg-forest-muted transition-colors disabled:opacity-50"
        >
          {isScanning ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Scanning...
            </span>
          ) : (
            'Scan URL'
          )}
        </button>
      </form>
    </div>
  );
};

export default UrlScanner;