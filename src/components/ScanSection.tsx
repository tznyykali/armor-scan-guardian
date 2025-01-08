import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scanUrl, scanFile } from '@/utils/virusTotalApi';
import { useNavigate } from 'react-router-dom';

const ScanSection = () => {
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
    const results = await scanUrl(urlInput);
    setIsScanning(false);

    if (results) {
      // Store results in localStorage for the results page
      const scanHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      scanHistory.unshift({
        id: Date.now().toString(),
        type: 'url',
        target: urlInput,
        timestamp: new Date().toISOString(),
        results: results.data.attributes,
      });
      localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
      
      navigate('/results');
    }
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileScan(file);
    }
  };

  const handleFileScan = async (file: File) => {
    setIsScanning(true);
    const results = await scanFile(file);
    setIsScanning(false);

    if (results) {
      // Store results in localStorage for the results page
      const scanHistory = JSON.parse(localStorage.getItem('scanHistory') || '[]');
      scanHistory.unshift({
        id: Date.now().toString(),
        type: 'file',
        target: file.name,
        timestamp: new Date().toISOString(),
        results: results.data.attributes,
      });
      localStorage.setItem('scanHistory', JSON.stringify(scanHistory));
      
      navigate('/results');
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
      {/* URL Scanner */}
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

      {/* File Scanner */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="bg-mist-light/50 dark:bg-midnight-DEFAULT/50 backdrop-blur-lg rounded-lg p-6 border border-forest-DEFAULT/20"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="w-5 h-5 text-forest-DEFAULT dark:text-caramel-DEFAULT" />
          <h3 className="text-lg font-semibold text-forest-DEFAULT dark:text-caramel-DEFAULT">File Scanner</h3>
        </div>
        <div className="border-2 border-dashed border-forest-DEFAULT/20 rounded-lg p-8 text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileScan(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="w-12 h-12 text-forest-DEFAULT dark:text-caramel-DEFAULT" />
            <span className="text-sm text-smoke-DEFAULT dark:text-mist-DEFAULT">
              Drag & drop files here or click to upload
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ScanSection;