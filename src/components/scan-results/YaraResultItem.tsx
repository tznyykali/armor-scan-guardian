import React from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface YaraResultItemProps {
  result: {
    rule_match: string;
    category: string;
    detection_details?: {
      description: string;
    };
  };
  index: number;
}

const YaraResultItem = ({ result, index }: YaraResultItemProps) => {
  return (
    <AccordionItem
      value={`yara-${index}`}
      className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg border-none"
    >
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col items-start gap-2 w-full">
          <div className="flex justify-between items-center w-full">
            <h5 className="font-semibold text-sm">{result.rule_match}</h5>
          </div>
          <Badge variant="outline" className="text-xs">
            Category: {result.category}
          </Badge>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-4">
        {result.detection_details?.description && (
          <p className="text-sm text-muted-foreground">
            {result.detection_details.description}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default YaraResultItem;