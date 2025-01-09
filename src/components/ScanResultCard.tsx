import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Info } from 'lucide-react';
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

  const toggleExpand = async () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      try {
        const [yaraData, mlData, engineData] = await Promise.all([
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
            .then(({ data }) => data || [])
        ]);
        
        setYaraResults(yaraData);
        setMlResults(mlData);
        setEngineResults(engineData);
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
            
            <EngineResults results={engineResults} />
            <MLResults results={mlResults} />
            <YaraResults results={yaraResults} />

            {result.results.metadata && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Additional Details
                </h4>
                <div className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg">
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(result.results.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {result.results.detection_details && result.results.detection_details.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Detection Details
                </h4>
                <ul className="space-y-2">
                  {result.results.detection_details.map((detail, index) => (
                    <li
                      key={index}
                      className="bg-white/50 dark:bg-midnight-light/50 p-3 rounded-lg text-sm"
                    >
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.results.file_path && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">File Location</h4>
                <p className="text-sm bg-white/50 dark:bg-midnight-light/50 p-3 rounded-lg">
                  {result.results.file_path}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ScanResultCard;