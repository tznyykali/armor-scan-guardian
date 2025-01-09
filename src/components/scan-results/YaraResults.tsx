import React from 'react';
import { Bug } from 'lucide-react';

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
  if (!results.length) return null;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Bug className="h-4 w-4" />
        YARA Analysis Results
      </h4>
      <div className="space-y-3">
        {results.map((yara, index) => (
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
  );
};

export default YaraResults;