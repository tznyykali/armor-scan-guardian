import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ThreatClassification from './scan-results/ThreatClassification';
import MLResults from './scan-results/MLResults';
import YaraResults from './scan-results/YaraResults';
import EngineResults from './scan-results/EngineResults';
import ScanStats from './scan-results/ScanStats';
import AdditionalDetails from './scan-results/AdditionalDetails';

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
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold text-forest-DEFAULT dark:text-caramel-DEFAULT">
              {result.type === 'url' ? 'URL Scan' : 'File Scan'}: {result.target}
            </CardTitle>
            <CardDescription>
              {new Date(result.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <button
            className="p-2 hover:bg-forest-DEFAULT/10 rounded-full transition-colors"
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-forest-DEFAULT dark:text-caramel-DEFAULT" />
            ) : (
              <ChevronDown className="h-5 w-5 text-forest-DEFAULT dark:text-caramel-DEFAULT" />
            )}
          </button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-6">
            {/* Scan Statistics */}
            {result.results.scan_stats && (
              <ScanStats stats={result.results.scan_stats} />
            )}
            
            {/* Threat Classification */}
            {result.results.malware_classification && (
              <ThreatClassification classifications={result.results.malware_classification} />
            )}
            
            {/* ML Analysis Results */}
            {result.results.ml_results && result.results.ml_results.length > 0 && (
              <MLResults results={result.results.ml_results} />
            )}
            
            {/* YARA Analysis Results */}
            {result.results.yara_matches && result.results.yara_matches.length > 0 && (
              <YaraResults results={result.results.yara_matches} />
            )}
            
            {/* Engine Analysis Results */}
            {result.results.engine_results && result.results.engine_results.length > 0 && (
              <EngineResults results={result.results.engine_results} />
            )}
            
            {/* Additional Details */}
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