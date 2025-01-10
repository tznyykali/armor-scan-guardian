import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import ScanStats from './scan-results/ScanStats';
import EngineResults from './scan-results/EngineResults';
import MLResults from './scan-results/MLResults';
import YaraResults from './scan-results/YaraResults';
import FileMetadata from './scan-results/FileMetadata';
import ThreatClassification from './scan-results/ThreatClassification';
import AdditionalDetails from './scan-results/AdditionalDetails';

interface ScanResultCardProps {
  result: {
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
      metadata?: any;
      file_path?: string;
      detection_details?: string[];
    };
  };
}

const ScanResultCard = ({ result }: ScanResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [yaraResults, setYaraResults] = useState<any[]>([]);
  const [mlResults, setMlResults] = useState<any[]>([]);
  const [engineResults, setEngineResults] = useState<any[]>([]);
  const [scanDetails, setScanDetails] = useState<any>(null);

  const toggleExpand = async () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      try {
        const [yaraData, mlData, engineData, scanHistoryData] = await Promise.all([
          supabase
            .from('advanced_scan_results')
            .select('*')
            .eq('scan_id', result.id)
            .then(({ data }) => data || []),
          supabase
            .from('ml_scan_results')
            .select('*')
            .eq('scan_id', result.id)
            .then(({ data }) => data || []),
          supabase
            .from('scan_results')
            .select('*')
            .eq('scan_id', result.id)
            .then(({ data }) => data || []),
          supabase
            .from('scan_history')
            .select('file_metadata, malware_classification')
            .eq('id', result.id)
            .single()
            .then(({ data }) => data)
        ]);
        
        setYaraResults(yaraData);
        setMlResults(mlData);
        setEngineResults(engineData);
        setScanDetails(scanHistoryData);
      } catch (error) {
        console.error('Error fetching detailed results:', error);
      }
    }
  };

  return (
    <Card className="w-full mb-4 bg-mist-light/50 dark:bg-midnight-DEFAULT/50 backdrop-blur-lg">
      <CardHeader className="cursor-pointer" onClick={toggleExpand}>
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
          <div className="space-y-4">
            {result.results.stats && (
              <ScanStats stats={result.results.stats} />
            )}
            
            {scanDetails?.malware_classification && (
              <ThreatClassification classifications={scanDetails.malware_classification} />
            )}
            
            {scanDetails?.file_metadata && (
              <FileMetadata metadata={scanDetails.file_metadata} />
            )}
            
            <EngineResults results={engineResults} />
            <MLResults results={mlResults} />
            <YaraResults results={yaraResults} />

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