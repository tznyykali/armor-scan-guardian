import React from 'react';
import { Shield } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ThreatClassificationProps {
  classifications: string[];
}

const ThreatClassification = ({ classifications }: ThreatClassificationProps) => {
  if (!classifications || classifications.length === 0) return null;
  
  const colorMap: Record<string, string> = {
    'Trojan': 'bg-red-500',
    'Spyware': 'bg-yellow-500',
    'Ransomware': 'bg-purple-500',
    'RAT': 'bg-orange-500',
    'Phishing': 'bg-blue-500',
    'Adware': 'bg-green-500',
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Shield className="h-4 w-4" />
        Threat Classification
      </h4>
      <div className="flex flex-wrap gap-2">
        {classifications.map((type, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={`${colorMap[type] || 'bg-gray-500'} text-white`}
          >
            {type}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ThreatClassification;