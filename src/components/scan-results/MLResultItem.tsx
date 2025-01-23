import React from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface MLResultItemProps {
  result: {
    model_name: string;
    detection_type: string;
    confidence_score: number;
    model_version?: string;
    analysis_metadata?: any;
  };
  index: number;
}

const MLResultItem = ({ result, index }: MLResultItemProps) => {
  return (
    <AccordionItem
      value={`ml-${index}`}
      className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg border-none"
    >
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex justify-between items-center w-full">
            <h5 className="font-semibold text-sm">{result.model_name}</h5>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className="text-xs">
              Type: {result.detection_type}
            </Badge>
            <Badge 
              variant="secondary" 
              className="text-xs bg-forest-DEFAULT/10 text-forest-DEFAULT"
            >
              {(result.confidence_score * 100).toFixed(1)}% confidence
            </Badge>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4 space-y-4">
        {result.model_version && (
          <div className="text-sm text-muted-foreground">
            Model Version: {result.model_version}
          </div>
        )}
        {result.analysis_metadata && Object.keys(result.analysis_metadata).length > 0 && (
          <div className="bg-midnight-DEFAULT/10 p-3 rounded text-xs font-mono">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(result.analysis_metadata, null, 2)}
            </pre>
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default MLResultItem;