import React from 'react';
import { Accordion } from "@/components/ui/accordion";
import HashSection from './metadata/HashSection';
import FileInfoSection from './metadata/FileInfoSection';
import HistorySection from './metadata/HistorySection';
import AndroidSection from './metadata/AndroidSection';

interface FileMetadataProps {
  metadata: {
    md5?: string;
    sha1?: string;
    sha256?: string;
    vhash?: string;
    ssdeep?: string;
    tlsh?: string;
    permhash?: string;
    file_type?: string[];
    magic?: string;
    trid?: string[];
    file_size?: string;
    first_submission?: string;
    last_submission?: string;
    last_analysis?: string;
    earliest_modification?: string;
    latest_modification?: string;
    android_info?: {
      type?: string;
      package_name?: string;
      main_activity?: string;
      internal_version?: string;
      displayed_version?: string;
      min_sdk?: string;
      target_sdk?: string;
    };
  };
}

const FileMetadata = ({ metadata }: FileMetadataProps) => {
  if (!metadata) return null;

  return (
    <div className="mt-4 space-y-4">
      <Accordion type="single" collapsible className="space-y-4">
        <HashSection
          md5={metadata.md5}
          sha1={metadata.sha1}
          sha256={metadata.sha256}
          vhash={metadata.vhash}
          ssdeep={metadata.ssdeep}
          tlsh={metadata.tlsh}
          permhash={metadata.permhash}
        />
        <FileInfoSection
          fileType={metadata.file_type}
          magic={metadata.magic}
          trid={metadata.trid}
          fileSize={metadata.file_size}
        />
        <HistorySection
          firstSubmission={metadata.first_submission}
          lastSubmission={metadata.last_submission}
          lastAnalysis={metadata.last_analysis}
          earliestModification={metadata.earliest_modification}
          latestModification={metadata.latest_modification}
        />
        <AndroidSection
          androidInfo={metadata.android_info && {
            type: metadata.android_info.type,
            packageName: metadata.android_info.package_name,
            mainActivity: metadata.android_info.main_activity,
            internalVersion: metadata.android_info.internal_version,
            displayedVersion: metadata.android_info.displayed_version,
            minSdk: metadata.android_info.min_sdk,
            targetSdk: metadata.android_info.target_sdk,
          }}
        />
      </Accordion>
    </div>
  );
};

export default FileMetadata;