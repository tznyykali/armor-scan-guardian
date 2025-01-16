import React from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { scanFile } from '@/services/virusTotalService';
import { ScanResult } from '@/types/scan';
import { useScan } from '@/hooks/useScan';

interface FileScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

const FileScanner = ({ onScanComplete }: FileScannerProps) => {
  const { isScanning, setIsScanning, handleScanComplete, handleScanFailure } = useScan({ onScanComplete });

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
      const results = await scanFile(file);
      if (!results) {
        throw new Error('No scan results received');
      }
      handleScanComplete('file', file.name, results);
    } catch (error) {
      handleScanFailure(error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleFileDrop}
      className="bg-sage/50 dark:bg-taupe/50 backdrop-blur-lg rounded-lg p-6 border border-sage-dark/20"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Upload className="w-5 h-5 text-rust dark:text-rust-light" />
        <h3 className="text-lg font-mono text-rust dark:text-rust-light">File Scanner_</h3>
      </div>
      <div className="border-2 border-dashed border-sage-dark/20 rounded-lg p-8 text-center">
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
              <Loader2 className="w-12 h-12 text-rust dark:text-rust-light animate-spin" />
              <span className="text-sm font-mono text-taupe dark:text-beige mt-2">
                Scanning file...
              </span>
            </div>
          ) : (
            <>
              <Upload className="w-12 h-12 text-rust dark:text-rust-light" />
              <span className="text-sm font-mono text-taupe dark:text-beige">
                Drag & drop files here or click to upload_
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default FileScanner;