import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface EngineResultsProps {
  results: Array<{
    engine_name: string;
    engine_type: string;
    malware_type?: string;
    snort_alerts?: any[];
    hids_findings?: Record<string, any>;
  }>;
}

const EngineResults = ({ results }: EngineResultsProps) => {
  if (!results.length) {
    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Engine Analysis Results
        </h4>
        <div className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg flex items-center gap-2 text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          No engine analysis results available
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Activity className="h-4 w-4" />
        Engine Analysis Results
      </h4>
      <div className="space-y-3">
        {results.map((engine, index) => (
          <div
            key={index}
            className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg"
          >
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold text-sm">{engine.engine_name}</h5>
                <div className="flex gap-2 items-center mt-1">
                  <p className="text-xs text-muted-foreground">
                    Type: {engine.engine_type}
                  </p>
                  {engine.malware_type && (
                    <Badge variant="destructive" className="text-xs">
                      {engine.malware_type}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {engine.snort_alerts && engine.snort_alerts.length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Network Alerts:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {engine.snort_alerts.map((alert, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>{alert.rule_id}: {alert.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {engine.hids_findings && Object.keys(engine.hids_findings).length > 0 && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">System Analysis:</p>
                <pre className="text-xs bg-midnight-DEFAULT/10 p-2 rounded mt-1 overflow-x-auto">
                  {JSON.stringify(engine.hids_findings, null, 2)}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngineResults;