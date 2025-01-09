import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Info, Shield, Activity, Bug, Cpu } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

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
        // Fetch YARA results
        const { data: yaraData } = await supabase
          .from('advanced_scan_results')
          .select('*')
          .eq('scan_id', result.id);
        
        // Fetch ML model results
        const { data: mlData } = await supabase
          .from('ml_scan_results')
          .select('*')
          .eq('scan_id', result.id);
        
        // Fetch engine-specific results
        const { data: engineData } = await supabase
          .from('scan_results')
          .select('*')
          .eq('scan_id', result.id);
        
        if (yaraData) setYaraResults(yaraData);
        if (mlData) setMlResults(mlData);
        if (engineData) setEngineResults(engineData);
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white/50 dark:bg-midnight-light/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Harmless</p>
                  <p className="text-xl font-semibold text-forest-DEFAULT">
                    {result.results.stats.harmless}
                  </p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-midnight-light/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Malicious</p>
                  <p className="text-xl font-semibold text-destructive">
                    {result.results.stats.malicious}
                  </p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-midnight-light/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Suspicious</p>
                  <p className="text-xl font-semibold text-amber-500">
                    {result.results.stats.suspicious}
                  </p>
                </div>
                <div className="p-3 bg-white/50 dark:bg-midnight-light/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Undetected</p>
                  <p className="text-xl font-semibold text-gray-500">
                    {result.results.stats.undetected}
                  </p>
                </div>
              </div>
            )}
            
            {engineResults.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Engine Analysis Results
                </h4>
                <div className="space-y-3">
                  {engineResults.map((engine, index) => (
                    <div
                      key={index}
                      className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-sm">{engine.engine_name}</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Type: {engine.engine_type}
                          </p>
                        </div>
                      </div>
                      {engine.snort_alerts && engine.snort_alerts.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Snort Alerts:</p>
                          <ul className="text-sm text-muted-foreground">
                            {engine.snort_alerts.map((alert: string, i: number) => (
                              <li key={i}>{alert}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {engine.hids_findings && Object.keys(engine.hids_findings).length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">HIDS Findings:</p>
                          <pre className="text-xs bg-midnight-DEFAULT/10 p-2 rounded mt-1 overflow-x-auto">
                            {JSON.stringify(engine.hids_findings, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mlResults.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Cpu className="h-4 w-4" />
                  Machine Learning Analysis
                </h4>
                <div className="space-y-3">
                  {mlResults.map((ml, index) => (
                    <div
                      key={index}
                      className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-sm">{ml.model_name}</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Detection Type: {ml.detection_type}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-forest-DEFAULT/10 text-forest-DEFAULT">
                          {(ml.confidence_score * 100).toFixed(1)}% confidence
                        </span>
                      </div>
                      {ml.analysis_metadata && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground">
                            Model Version: {ml.model_version || 'N/A'}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {yaraResults.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <Bug className="h-4 w-4" />
                  YARA Analysis Results
                </h4>
                <div className="space-y-3">
                  {yaraResults.map((yara, index) => (
                    <div
                      key={index}
                      className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="font-semibold text-sm">{yara.rule_match}</h5>
                          <p className="text-xs text-muted-foreground mt-1">
                            Category: {yara.category}
                          </p>
                        </div>
                      </div>
                      {yara.detection_details && (
                        <p className="text-sm mt-2 text-muted-foreground">
                          {yara.detection_details.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

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