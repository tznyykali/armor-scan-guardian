import React from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { scanFile } from '@/services/virusTotalService';
import { ScanResult } from '@/types/scan';
import { useScan } from '@/hooks/useScan';
import { useToast } from '@/hooks/use-toast';

interface FileScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

const FileScanner = ({ onScanComplete }: FileScannerProps) => {
  const { isScanning, setIsScanning, handleScanComplete, handleScanFailure } = useScan({ onScanComplete });
  const { toast } = useToast();

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('File dropped:', file.name, 'Type:', file.type, 'Size:', file.size);
      await handleFileScan(file);
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      // Android files
      'application/vnd.android.package-archive', // .apk
      'application/octet-stream', // .aab (Android App Bundle)
      // iOS files
      'application/x-ios-app', // .ipa
      // Common file types
      'application/pdf',
      'application/x-msdownload', // .exe
      'application/x-executable', // Linux executables
      'application/x-mach-binary', // macOS executables
      'application/zip',
      'application/x-zip-compressed',
      'application/java-archive', // .jar
    ];

    const isValid = validTypes.includes(file.type) || 
           file.name.endsWith('.apk') || 
           file.name.endsWith('.aab') || 
           file.name.endsWith('.ipa');

    console.log('File type validation:', file.type, isValid ? 'valid' : 'invalid');
    return isValid;
  };

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
      
      handleScanComplete('file', file.name, results);
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
          accept=".apk,.aab,.ipa,.exe,.dll,.pdf,.zip,.jar"
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
              <span className="text-xs text-muted-foreground">
                Supported: APK, AAB, IPA, EXE, DLL, PDF, ZIP, JAR
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};

export default FileScanner;