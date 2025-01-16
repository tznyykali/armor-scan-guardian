export interface ScanResult {
  id: string;
  type: 'url' | 'file';
  target: string;
  timestamp: string;
  results: {
    status: string;
    metadata?: any;
    file_metadata?: {
      md5?: string;
      sha1?: string;
      sha256?: string;
      [key: string]: any;
    };
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