export interface ScanResult {
  id: string;
  type: 'url' | 'file';
  target: string;
  timestamp: string;
  results: {
    status: string;
    metadata?: any;
    malware_classification?: string[];
    data?: {
      attributes?: {
        status?: string;
        metadata?: any;
        categories?: {
          malware?: boolean;
        };
      };
    };
  };
}