import React from 'react';
import { useScan } from '@/hooks/useScan';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { isValidFileType } from '@/utils/fileValidation';
import { scanFile } from '@/services/file/fileAnalysisService';
import { ScanResult } from '@/types/scan';

interface FileScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

// Helper function to convert DocumentPickerResponse to File-like object
const createFileFromPickerResponse = (response: DocumentPickerResponse) => {
  return {
    name: response.name || 'unknown',
    type: response.type || 'application/octet-stream',
    size: response.size || 0,
    uri: response.uri,
    lastModified: Date.now(),
    // Add minimal File interface implementation
    arrayBuffer: async () => new ArrayBuffer(0),
    slice: () => new Blob(),
    stream: () => new ReadableStream(),
    text: async () => '',
  } as unknown as File;
};

const FileScanner = ({ onScanComplete }: FileScannerProps) => {
  const { isScanning, setIsScanning, handleScanComplete } = useScan({ onScanComplete });
  const { toast } = useToast();

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.images,
          DocumentPicker.types.video,
          DocumentPicker.types.audio,
          DocumentPicker.types.zip,
        ],
      });

      const pickerResponse = result[0];
      const fileObject = createFileFromPickerResponse(pickerResponse);
      
      if (!isValidFileType(fileObject)) {
        toast({
          title: "Invalid File Type",
          description: "Please select a supported file type",
          variant: "destructive",
        });
        return;
      }

      setIsScanning(true);
      try {
        const scanResults = await scanFile(fileObject);
        handleScanComplete('file', fileObject.name, scanResults);
        toast({
          title: "Scan Complete",
          description: `File ${fileObject.name} has been successfully scanned`,
        });
      } catch (error) {
        toast({
          title: "Scan Failed",
          description: "An error occurred during the scan",
          variant: "destructive",
        });
      } finally {
        setIsScanning(false);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        toast({
          title: "Error",
          description: "Failed to pick file",
          variant: "destructive",
        });
      }
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