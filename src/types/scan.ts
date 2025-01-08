export interface ScanResult {
  id: string;
  type: 'url' | 'file';
  target: string;
  timestamp: string;
  results: {
    status: string;
    stats?: {
      harmless: number;
      malicious: number;
      suspicious: number;
      undetected: number;
    };
    [key: string]: any;
  };
}

export interface ScanHistoryItem extends ScanResult {}