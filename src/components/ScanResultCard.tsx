import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import ThreatClassification from './scan-results/ThreatClassification';
import MLResults from './scan-results/MLResults';
import YaraResults from './scan-results/YaraResults';
import EngineResults from './scan-results/EngineResults';
import ScanStats from './scan-results/ScanStats';
import AdditionalDetails from './scan-results/AdditionalDetails';
import ResultHeader from './scan-results/ResultHeader';

interface ScanResultCardProps {
  result: {
    id: string;
    type: 'url' | 'file';
    target: string;
    timestamp: string;
    results: {
      status: string;
      metadata?: any;
      malware_classification?: string[];
      ml_results?: Array<{
        model_name: string;
        detection_type: string;
        confidence_score: number;
        model_version?: string;
        analysis_metadata?: any;
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
        snort_alerts?: any[];
        hids_findings?: Record<string, any>;
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
      file_path?: string;
    };
  };
}

const ScanResultCard = ({ result }: ScanResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full bg-mist-light/50 dark:bg-midnight-DEFAULT/50 backdrop-blur-lg">
      <CardHeader>
        <ResultHeader
          type={result.type}
          target={result.target}
          timestamp={result.timestamp}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-6">
            {result.results.scan_stats && (
              <ScanStats stats={result.results.scan_stats} />
            )}
            
            {result.results.malware_classification && (
              <ThreatClassification classifications={result.results.malware_classification} />
            )}
            
            {result.results.ml_results && result.results.ml_results.length > 0 && (
              <MLResults results={result.results.ml_results} />
            )}
            
            {result.results.yara_matches && result.results.yara_matches.length > 0 && (
              <YaraResults results={result.results.yara_matches} />
            )}
            
            {result.results.engine_results && result.results.engine_results.length > 0 && (
              <EngineResults results={result.results.engine_results} />
            )}
            
            <AdditionalDetails
              metadata={result.results.metadata}
              detectionDetails={result.results.detection_details}
              filePath={result.results.file_path}
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ScanResultCard;