import React from 'react';
import { Package } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AndroidSectionProps {
  androidInfo?: {
    type?: string;
    packageName?: string;
    mainActivity?: string;
    internalVersion?: string;
    displayedVersion?: string;
    minSdk?: string;
    targetSdk?: string;
  };
}

const AndroidSection = ({ androidInfo }: AndroidSectionProps) => {
  if (!androidInfo) return null;

  return (
    <AccordionItem value="androidInfo" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
      <AccordionTrigger className="px-4">
        <span className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Android Information
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-2">
        {androidInfo.type && (
          <p className="text-sm">
            <span className="font-semibold">Type:</span> {androidInfo.type}
          </p>
        )}
        {androidInfo.packageName && (
          <p className="text-sm">
            <span className="font-semibold">Package Name:</span> {androidInfo.packageName}
          </p>
        )}
        {androidInfo.mainActivity && (
          <p className="text-sm">
            <span className="font-semibold">Main Activity:</span> {androidInfo.mainActivity}
          </p>
        )}
        {androidInfo.internalVersion && (
          <p className="text-sm">
            <span className="font-semibold">Internal Version:</span> {androidInfo.internalVersion}
          </p>
        )}
        {androidInfo.displayedVersion && (
          <p className="text-sm">
            <span className="font-semibold">Displayed Version:</span> {androidInfo.displayedVersion}
          </p>
        )}
        {androidInfo.minSdk && (
          <p className="text-sm">
            <span className="font-semibold">Minimum SDK:</span> {androidInfo.minSdk}
          </p>
        )}
        {androidInfo.targetSdk && (
          <p className="text-sm">
            <span className="font-semibold">Target SDK:</span> {androidInfo.targetSdk}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default AndroidSection;