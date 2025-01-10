import React from 'react';
import { Eye, Info } from 'lucide-react';

interface AdditionalDetailsProps {
  metadata?: any;
  detectionDetails?: string[];
  filePath?: string;
}

const AdditionalDetails = ({ metadata, detectionDetails, filePath }: AdditionalDetailsProps) => {
  return (
    <>
      {metadata && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Additional Details
          </h4>
          <div className="bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {JSON.stringify(metadata, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {detectionDetails && detectionDetails.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Detection Details
          </h4>
          <ul className="space-y-2">
            {detectionDetails.map((detail, index) => (
              <li
                key={index}
                className="bg-white/50 dark:bg-midnight-light/50 p-3 rounded-lg text-sm"
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}

      {filePath && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">File Location</h4>
          <p className="text-sm bg-white/50 dark:bg-midnight-light/50 p-3 rounded-lg">
            {filePath}
          </p>
        </div>
      )}
    </>
  );
};

export default AdditionalDetails;