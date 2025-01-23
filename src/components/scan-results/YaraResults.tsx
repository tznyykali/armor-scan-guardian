import React from 'react';
import { Bug, AlertTriangle } from 'lucide-react';
import { Accordion } from "@/components/ui/accordion";
import YaraResultItem from './YaraResultItem';

interface YaraResultsProps {
  results: Array<{
    rule_match: string;
    category: string;
    detection_details?: {
      description: string;
    };
  }>;
}

const YaraResults = ({ results }: YaraResultsProps) => {
  if (!results?.length) {
    return (
      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Bug className="h-4 w-4" />
          YARA Analysis Results
        </h4>
        <div className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg flex items-center gap-2 text-muted-foreground">
          <AlertTriangle className="h-4 w-4" />
          No YARA analysis results available
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Bug className="h-4 w-4" />
        YARA Analysis Results
      </h4>
      <Accordion type="single" collapsible className="space-y-3">
        {results.map((result, index) => (
          <YaraResultItem key={index} result={result} index={index} />
        ))}
      </Accordion>
    </div>
  );
};

export default YaraResults;