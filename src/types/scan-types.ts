export interface EngineScanResult {
  category: string;
  engine_name: string;
  engine_version: string;
  result: string;
  method: string;
  engine_update: string;
}

export interface ScanStats {
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
}

export interface ScanMetadata {
  file_info?: {
    name: string;
    size: number;
    type: string;
  };
  engines_used: number;
  analysis_date: string;
  categories: Record<string, string>;
  threat_names: string[];
}

export interface ScanResult {
  status: string;
  stats: ScanStats;
  metadata: ScanMetadata;
  detection_details: string[];
  file_path?: string;
  permalink?: string;
}