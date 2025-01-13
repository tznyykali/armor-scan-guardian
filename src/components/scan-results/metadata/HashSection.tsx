import React from 'react';
import { Hash } from 'lucide-react';
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface HashSectionProps {
  md5?: string;
  sha1?: string;
  sha256?: string;
  vhash?: string;
  ssdeep?: string;
  tlsh?: string;
  permhash?: string;
}

const HashSection = ({ md5, sha1, sha256, vhash, ssdeep, tlsh, permhash }: HashSectionProps) => {
  return (
    <AccordionItem value="hashes" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
      <AccordionTrigger className="px-4">
        <span className="flex items-center gap-2">
          <Hash className="h-4 w-4" />
          File Hashes
        </span>
      </AccordionTrigger>
      <AccordionContent className="px-4 pb-4 space-y-2">
        {md5 && (
          <p className="text-sm">
            <span className="font-semibold">MD5:</span> {md5}
          </p>
        )}
        {sha1 && (
          <p className="text-sm">
            <span className="font-semibold">SHA1:</span> {sha1}
          </p>
        )}
        {sha256 && (
          <p className="text-sm">
            <span className="font-semibold">SHA256:</span> {sha256}
          </p>
        )}
        {vhash && (
          <p className="text-sm">
            <span className="font-semibold">VHash:</span> {vhash}
          </p>
        )}
        {ssdeep && (
          <p className="text-sm">
            <span className="font-semibold">SSDEEP:</span> {ssdeep}
          </p>
        )}
        {tlsh && (
          <p className="text-sm">
            <span className="font-semibold">TLSH:</span> {tlsh}
          </p>
        )}
        {permhash && (
          <p className="text-sm">
            <span className="font-semibold">PermHash:</span> {permhash}
          </p>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};

export default HashSection;