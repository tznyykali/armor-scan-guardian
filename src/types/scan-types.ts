import { Json } from '@/integrations/supabase/types';

export type DetectionEngineType = 'snort' | 'yaralyze' | 'hids' | 'droidbox' | 'androguard';

export interface ScanStats {
  harmless: number;
  malicious: number;
  suspicious: number;
  undetected: number;
  [key: string]: number; // Add index signature for Json compatibility
}

export interface MLAnalysis {
  model_name: string;
  confidence_score: number;
  detection_type: string;
  model_version?: string;
  features_analyzed?: string[];
  [key: string]: string | number | string[] | undefined; // Add index signature for Json compatibility
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
  snort_analysis?: Json;
  hids_analysis?: Json;
  droidbox_analysis?: Json;
  ml_analysis?: MLAnalysis;
}

export interface ScanResult {
  status: string;
  stats: ScanStats;
  metadata: ScanMetadata;
  detection_details: string[];
  file_path?: string;
  permalink?: string;
}