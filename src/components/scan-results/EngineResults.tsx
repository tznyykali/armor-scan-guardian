import React from 'react';
import { Activity, AlertTriangle, ChevronDown } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface EngineResultsProps {
  results: Array<{
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
      <Accordion type="single" collapsible className="space-y-3">
        {results.map((engine, index) => (
          <AccordionItem
            key={index}
            value={`engine-${index}`}
            className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg border-none"
          >
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex justify-between items-center w-full">
                  <h5 className="font-semibold text-sm">{engine.engine_name}</h5>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </div>
                <div className="flex gap-2 items-center">
                  <Badge variant="outline" className="text-xs">
                    Type: {engine.engine_type || 'Unknown'}
                  </Badge>
                  {engine.malware_type && (
                    <Badge variant="destructive" className="text-xs">
                      {engine.malware_type}
                    </Badge>
                  )}
                  {engine.category && (
                    <Badge variant="secondary" className="text-xs">
                      {engine.category}
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 space-y-4">
              {/* Engine Details */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Engine Details:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>Version: {engine.engine_version || 'N/A'}</div>
                  <div>Last Update: {engine.engine_update || 'N/A'}</div>
                </div>
                {engine.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {engine.description}
                  </p>
                )}
              </div>

              {/* Network Alerts */}
              {engine.snort_alerts && engine.snort_alerts.length > 0 && (
                <div>
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

              {/* System Analysis */}
              {engine.hids_findings && Object.keys(engine.hids_findings).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">System Analysis:</p>
                  <div className="bg-midnight-DEFAULT/10 p-3 rounded text-xs font-mono">
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(engine.hids_findings, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default EngineResults;