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
    ml_results?: Array<{
      model_name: string;
      detection_type: string;
      confidence_score: number;
      model_version?: string;
    }>;
    yara_matches?: Array<{
      rule_match: string;
      category: string;
      detection_details?: {
        description: string;
      };
    }>;
    engine_results?: Array<{
      engine_name: string;
      engine_type: string;
      malware_type?: string;
      engine_version?: string;
      engine_update?: string;
      category?: string;
      description?: string;
    }>;
    scan_stats?: {
      harmless: number;
      malicious: number;
      suspicious: number;
      undetected: number;
    };
    detection_details?: string[];
  };
}