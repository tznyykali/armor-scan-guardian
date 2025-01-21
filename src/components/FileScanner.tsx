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
  const { isScanning, setIsScanning, handleScanComplete } = useScan({ onScanComplete });
  const { toast } = useToast();

  const handleFileScan = async (file: File) => {
    if (!isValidFileType(file)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a supported file type (APK, AAB, IPA, EXE, PDF, etc.)",
        variant: "destructive",
      });
      return;
    }

    setIsScanning(true);
    try {
      const scanResults = await scanFile(file);
      handleScanComplete('file', file.name, scanResults);
      toast({
        title: "Scan Complete",
        description: `File ${file.name} has been successfully scanned`,
      });
    } catch (error) {
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