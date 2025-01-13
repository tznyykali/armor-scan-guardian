import React from 'react';
import { Calendar } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface HistorySectionProps {
  firstSubmission?: string;
  lastSubmission?: string;
  lastAnalysis?: string;
  earliestModification?: string;
  latestModification?: string;
}

const HistorySection = ({
  firstSubmission,
  lastSubmission,
  lastAnalysis,
  earliestModification,
  latestModification
}: HistorySectionProps) => {
  return (
    <AccordionItem value="history" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
      <AccordionTrigger className="px-4">
        <span className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          History
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-2">
        {firstSubmission && (
          <p className="text-sm">
            <span className="font-semibold">First Submission:</span> {firstSubmission}
          </p>
        )}
        {lastSubmission && (
          <p className="text-sm">
            <span className="font-semibold">Last Submission:</span> {lastSubmission}
          </p>
        )}
        {lastAnalysis && (
          <p className="text-sm">
            <span className="font-semibold">Last Analysis:</span> {lastAnalysis}
          </p>
        )}
        {earliestModification && (
          <p className="text-sm">
            <span className="font-semibold">Earliest Modification:</span> {earliestModification}
          </p>
        )}
        {latestModification && (
          <p className="text-sm">
            <span className="font-semibold">Latest Modification:</span> {latestModification}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default HistorySection;