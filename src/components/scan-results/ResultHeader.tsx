import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ResultHeaderProps {
  type: 'url' | 'file';
  target: string;
  timestamp: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const ResultHeader = ({ type, target, timestamp, isExpanded, onToggle }: ResultHeaderProps) => {
  return (
    <div className="cursor-pointer" onClick={onToggle}>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-lg font-semibold text-forest-DEFAULT dark:text-caramel-DEFAULT">
            {type === 'url' ? 'URL Scan' : 'File Scan'}: {target}
          </CardTitle>
          <CardDescription>
            {new Date(timestamp).toLocaleString()}
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
    </div>
  );
};

export default ResultHeader;