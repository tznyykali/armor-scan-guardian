import React from 'react';
import { Hash } from 'lucide-react';

interface FileMetadataProps {
  metadata: {
    md5?: string;
    sha1?: string;
    sha256?: string;
  };
}

const FileMetadata = ({ metadata }: FileMetadataProps) => {
  if (!metadata) return null;

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
        <Hash className="h-4 w-4" />
        File Hashes
      </h4>
      <div className="space-y-2 bg-white/50 dark:bg-midnight-light/50 p-4 rounded-lg">
        {metadata.md5 && (
          <p className="text-sm">
            <span className="font-semibold">MD5:</span> {metadata.md5}
          </p>
        )}
        {metadata.sha1 && (
          <p className="text-sm">
            <span className="font-semibold">SHA1:</span> {metadata.sha1}
          </p>
        )}
        {metadata.sha256 && (
          <p className="text-sm">
            <span className="font-semibold">SHA256:</span> {metadata.sha256}
          </p>
        )}
      </div>
    </div>
  );
};

export default FileMetadata;