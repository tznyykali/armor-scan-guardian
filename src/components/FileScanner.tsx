import React from 'react';
import { useScan } from '@/hooks/useScan';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isValidFileType } from '@/utils/fileValidation';
import { scanFile } from '@/services/file/fileAnalysisService';
import { ScanResult } from '@/types/scan';

interface FileScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

const FileScanner = ({ onScanComplete }: FileScannerProps) => {
  const { isScanning, setIsScanning, handleScanComplete } = useScan({ onScanComplete });
  const { toast } = useToast();

  const handleFilePick = async () => {
    try {
      // Use HTML5 file input for web
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.apk,.aab,.ipa,.exe,.dll,.pdf,.zip,.jar';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        if (!isValidFileType(file)) {
          toast({
            title: "Invalid File Type",
            description: "Please select a supported file type",
            variant: "destructive",
          });
          return;
        }

        setIsScanning(true);
        try {
          console.log('Starting file scan...');
          const scanResults = await scanFile(file);
          
          if (!scanResults || !scanResults.results) {
            throw new Error('Invalid scan results received');
          }

          console.log('Scan results received:', scanResults);
          handleScanComplete('file', file.name, scanResults);
          
          toast({
            title: "Scan Complete",
            description: `File ${file.name} has been successfully scanned`,
          });
        } catch (error) {
          console.error('File scan error:', error);
          toast({
            title: "Scan Failed",
            description: error instanceof Error ? error.message : "An error occurred during the scan",
            variant: "destructive",
          });
        } finally {
          setIsScanning(false);
        }
      };

      input.click();
    } catch (err) {
      console.error('File picker error:', err);
      toast({
        title: "Error",
        description: "Failed to pick file",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleFilePick}
        disabled={isScanning}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md disabled:opacity-50"
      >
        <Upload className="w-5 h-5" />
        <span>{isScanning ? 'Scanning...' : 'Select File to Scan'}</span>
      </button>
    </div>
  );
};

export default FileScanner;