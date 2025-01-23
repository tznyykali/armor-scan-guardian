import React from 'react';
import { Activity, AlertTriangle } from 'lucide-react';
import { Accordion } from "@/components/ui/accordion";
import EngineResultItem from './EngineResultItem';

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
          <EngineResultItem key={index} engine={engine} index={index} />
        ))}
      </Accordion>
    </div>
  );
};

export default EngineResults;