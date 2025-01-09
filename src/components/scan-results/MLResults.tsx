import React from 'react';
import { Cpu } from 'lucide-react';

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
  if (!results.length) return null;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
        <Cpu className="h-4 w-4" />
        Machine Learning Analysis
      </h4>
      <div className="space-y-3">
        {results.map((ml, index) => (
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
            {ml.model_version && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">
                  Model Version: {ml.model_version}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MLResults;