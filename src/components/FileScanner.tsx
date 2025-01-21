import React from 'react';
import { Upload } from 'lucide-react';
import { scanFile } from '@/services/virusTotalService';
import { ScanResult } from '@/types/scan';
import { useScan } from '@/hooks/useScan';
import { useToast } from '@/hooks/use-toast';
import { isValidFileType } from '@/utils/fileValidation';
import FileDropZone from './scan/FileDropZone';

interface FileScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

const FileScanner = ({ onScanComplete }: FileScannerProps) => {
  const { isScanning, setIsScanning, handleScanComplete, handleScanFailure } = useScan({ onScanComplete });
  const { toast } = useToast();

  const handleFileScan = async (file: File) => {
    console.log('Starting file scan for:', file.name);
    
    if (!isValidFileType(file)) {
      const errorMessage = 'Invalid file type. Please upload a supported file type (APK, AAB, IPA, EXE, PDF, etc.)';
      console.error(errorMessage);
      toast({
        title: "Invalid File Type",
        description: errorMessage,
        variant: "destructive",
      });
      handleScanFailure(new Error(errorMessage));
      return;
    }

    setIsScanning(true);
    try {
      console.log('Initiating scan for file:', file.name);
      const results = await scanFile(file);
      console.log('Scan results received:', results);
      
      if (!results) {
        throw new Error('No scan results received');
      }
      
      toast({
        title: "Scan Complete",
        description: `File ${file.name} has been successfully scanned`,
      });
      
      // Create a properly formatted scan result object
      const formattedResult: ScanResult = {
        id: results.id || crypto.randomUUID(),
        type: 'file',
        target: file.name,
        timestamp: new Date().toISOString(),
        results: {
          status: results.status,
          metadata: results.metadata,
          file_metadata: results.file_metadata,
          malware_classification: results.malware_classification,
          ml_results: results.ml_results || [],
          yara_matches: results.yara_matches || [],
          engine_results: results.engine_results || [],
          scan_stats: results.scan_stats || {
            harmless: 0,
            malicious: 0,
            suspicious: 0,
            undetected: 0
          },
          detection_details: results.detection_details || []
        }
      };
      
      handleScanComplete('file', file.name, formattedResult);
    } catch (error) {
      console.error('File scan error:', error);
      toast({
        title: "Scan Error",
        description: error instanceof Error ? error.message : "Failed to scan file",
        variant: "destructive",
      });
      handleScanFailure(error);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="bg-sage/50 dark:bg-taupe/50 backdrop-blur-lg rounded-lg p-6 border border-sage-dark/20">
      <div className="flex items-center space-x-2 mb-4">
        <Upload className="w-5 h-5 text-rust dark:text-rust-light" />
        <h3 className="text-lg font-mono text-rust dark:text-rust-light">File Scanner_</h3>
      </div>
      <FileDropZone 
        isScanning={isScanning}
        onFileDrop={handleFileScan}
      />
    </div>
  );
};

export default FileScanner;