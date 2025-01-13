import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FileMetadata from './scan-results/FileMetadata';
import ThreatClassification from './scan-results/ThreatClassification';

interface ScanResultCardProps {
  result: {
    id: string;
    type: 'url' | 'file';
    target: string;
    timestamp: string;
    results: {
      status: string;
      metadata?: any;
      malware_classification?: string[];
    };
  };
}

const ScanResultCard = ({ result }: ScanResultCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="w-full bg-mist-light/50 dark:bg-midnight-DEFAULT/50 backdrop-blur-lg">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-semibold text-forest-DEFAULT dark:text-caramel-DEFAULT">
              {result.type === 'url' ? 'URL Scan' : 'File Scan'}: {result.target}
            </CardTitle>
            <CardDescription>
              {new Date(result.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <button
            className="p-2 hover:bg-forest-DEFAULT/10 rounded-full transition-colors"
            aria-label={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-forest-DEFAULT dark:text-caramel-DEFAULT" />
            ) : (
              <ChevronDown className="h-5 w-5 text-forest-DEFAULT dark:text-caramel-DEFAULT" />
            )}
          </button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent>
          <div className="space-y-4">
            {result.results.metadata && (
              <FileMetadata metadata={result.results.metadata} />
            )}
            
            {result.results.malware_classification && (
              <ThreatClassification classifications={result.results.malware_classification} />
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default ScanResultCard;