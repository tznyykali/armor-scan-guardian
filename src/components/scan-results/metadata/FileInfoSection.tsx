import React from 'react';
import { FileType } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FileInfoSectionProps {
  fileType?: string[];
  magic?: string;
  trid?: string[];
  fileSize?: string;
}

const FileInfoSection = ({ fileType, magic, trid, fileSize }: FileInfoSectionProps) => {
  return (
    <AccordionItem value="fileInfo" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
      <AccordionTrigger className="px-4">
        <span className="flex items-center gap-2">
          <FileType className="h-4 w-4" />
          File Information
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-2">
        {fileType && (
          <p className="text-sm">
            <span className="font-semibold">File Type:</span> {fileType.join(', ')}
          </p>
        )}
        {magic && (
          <p className="text-sm">
            <span className="font-semibold">Magic:</span> {magic}
          </p>
        )}
        {trid && (
          <p className="text-sm">
            <span className="font-semibold">TrID:</span> {trid.join(', ')}
          </p>
        )}
        {fileSize && (
          <p className="text-sm">
            <span className="font-semibold">File Size:</span> {fileSize}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default FileInfoSection;