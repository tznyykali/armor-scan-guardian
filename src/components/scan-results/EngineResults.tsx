import React from 'react';
import { Activity } from 'lucide-react';

interface EngineResultsProps {
  results: Array<{
    engine_name: string;
    engine_type: string;
    snort_alerts?: any[];
    hids_findings?: Record<string, any>;
  }>;
}

const EngineResults = ({ results }: EngineResultsProps) => {
  if (!results.length) return null;

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
                <p className="text-xs text-muted-foreground mt-1">
                  Type: {engine.engine_type}
                </p>
              </div>
            </div>
            {engine.snort_alerts && engine.snort_alerts.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium">Snort Alerts:</p>
                <ul className="text-sm text-muted-foreground">
                  {engine.snort_alerts.map((alert, i) => (
                    <li key={i} className="mt-1">
                      {alert.rule_id}: {alert.message}
                    </li>
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
  );
};

export default EngineResults;