import React from 'react';
import { Cpu, AlertTriangle } from 'lucide-react';
import { Accordion } from "@/components/ui/accordion";
import MLResultItem from './MLResultItem';

interface MLResultsProps {
  results: Array<{
    model_name: string;
    detection_type: string;
    confidence_score: number;
    model_version?: string;
    analysis_metadata?: any;
  }>;
}

const MLResults = ({ results }: MLResultsProps) => {
  if (!results?.length) {
    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Cpu className="h-4 w-4" />
          Machine Learning Analysis
        </h4>
        <div className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg flex items-center gap-2 text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          No ML analysis results available
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Cpu className="h-4 w-4" />
        Machine Learning Analysis
      </h4>
      <Accordion type="single" collapsible className="space-y-3">
        {results.map((result, index) => (
          <MLResultItem key={index} result={result} index={index} />
        ))}
      </Accordion>
    </div>
  );
};

export default MLResults;