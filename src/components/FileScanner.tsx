import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scanFile } from '@/services/virusTotalService';
import { saveScanResult } from '@/services/scanHistoryService';
import { useNavigate } from 'react-router-dom';

const FileScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileScan(file);
    }
  };

  const handleFileScan = async (file: File) => {
    setIsScanning(true);
    try {
      console.log('Starting file scan...');
      const results = await scanFile(file);
      console.log('Scan results:', results);
      
      if (!results) {
        throw new Error('No scan results received');
      }

      console.log('Saving scan results...');
      const savedResult = await saveScanResult('file', file.name, results);
      console.log('Saved scan result:', savedResult);

      if (!savedResult) {
        throw new Error('Failed to save scan results');
      }

      toast({
        title: "Scan Complete",
        description: "File has been successfully scanned",
      });

      navigate('/results');
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "Failed to scan file",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
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
          {isScanning ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-forest-DEFAULT dark:text-caramel-DEFAULT animate-spin" />
              <span className="text-sm text-smoke-DEFAULT dark:text-mist-DEFAULT mt-2">
                Scanning file...
              </span>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-forest-DEFAULT dark:text-caramel-DEFAULT" />
              <span className="text-sm text-smoke-DEFAULT dark:text-mist-DEFAULT">
                Drag & drop files here or click to upload
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default FileScanner;