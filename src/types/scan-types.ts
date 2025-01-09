import { Json } from '@/integrations/supabase/types';

export type DetectionEngineType = 'snort' | 'yaralyze' | 'hids' | 'droidbox' | 'androguard';

export interface DetectionDetail {
  engine_name: string;
  category: string;
  result: string;
  method: DetectionEngineType;
  engine_version: string;
  engine_update: string;
}

export interface ScanStats {
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
  [key: string]: number;
}

export interface MLAnalysis {
  model_name: string;
  confidence_score: number;
  detection_type: string;
  model_version?: string;
  features_analyzed?: string[];
  [key: string]: string | number | string[] | undefined;
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  last_modified: string;
  mime_type: string;
  extension?: string;
  apk_metadata?: {
    package_name: string;
    version_code: string;
    min_sdk_version: number;
    target_sdk_version: number;
    permissions: string[];
    activities: string[];
    services: string[];
    receivers: string[];
    native_libraries: string[];
  } | null;
}

export interface UrlInfo {
  domain: string;
  protocol: string;
  path: string;
  query_parameters: string;
  ssl_certificate: {
    issuer: string;
    valid_from: string;
    valid_to: string;
    version: string;
  };
  headers: {
    server: string;
    content_type: string;
    x_frame_options: string;
    content_security_policy: string;
  };
  whois_data: {
    registrar: string;
    creation_date: string;
    expiration_date: string;
    last_updated: string;
  };
}

export interface ScanMetadata {
  file_info?: FileInfo;
  url_info?: UrlInfo;
  engines_used: number;
  analysis_date: string;
  categories: Record<string, string>;
  threat_names: string[];
  snort_analysis?: Json;
  hids_analysis?: Json;
  droidbox_analysis?: Json;
  ml_analysis?: MLAnalysis;
}

export interface ScanResult {
  status: string;
  stats: ScanStats;
  metadata: ScanMetadata;
  detection_details: DetectionDetail[];
  file_path?: string;
  permalink?: string;
}