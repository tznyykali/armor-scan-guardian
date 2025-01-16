import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ScanResult } from '@/types/scan';
import { createScanResult, handleScanError } from '@/utils/scanUtils';

interface UseScanProps {
  onScanComplete?: (result: ScanResult) => void;
}

export const useScan = ({ onScanComplete }: UseScanProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const handleScanComplete = (
    type: 'url' | 'file',
    target: string,
    results: any
  ) => {
    const scanResult = createScanResult(type, target, results);
    onScanComplete?.(scanResult);
    toast({
      title: "Scan Complete",
      description: `${type === 'url' ? 'URL' : 'File'} has been successfully scanned`,
    });
    return scanResult;
  };

  const handleScanFailure = (error: unknown) => {
    const errorMessage = handleScanError(error);
    toast({
      title: "Scan Error",
      description: errorMessage,
      variant: "destructive",
    });
    throw error;
  };

  return {
    isScanning,
    setIsScanning,
    handleScanComplete,
    handleScanFailure
  };
};