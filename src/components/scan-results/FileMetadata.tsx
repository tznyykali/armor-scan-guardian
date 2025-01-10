import React from 'react';
import { Hash, FileType, Calendar, Package, Shield, List } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
    names?: string[];
    android_info?: {
      type?: string;
      package_name?: string;
      main_activity?: string;
      internal_version?: string;
      displayed_version?: string;
      min_sdk?: string;
      target_sdk?: string;
    };
    certificate?: {
      valid_from?: string;
      valid_to?: string;
      serial_number?: string;
      thumbprint?: string;
      subject?: {
        name?: string;
        common_name?: string;
        organization?: string;
        org_unit?: string;
        country?: string;
        state?: string;
        locality?: string;
      };
    };
    permissions?: string[];
    activities?: string[];
    services?: string[];
    receivers?: string[];
    intent_filters?: {
      actions?: string[];
      categories?: string[];
    };
  };
}

const FileMetadata = ({ metadata }: FileMetadataProps) => {
  if (!metadata) return null;

  return (
    <div className="mt-4 space-y-4">
      <Accordion type="single" collapsible className="space-y-4">
        {/* File Hashes Section */}
        <AccordionItem value="hashes" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
          <AccordionTrigger className="px-4">
            <span className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              File Hashes
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-2">
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
            {metadata.vhash && (
              <p className="text-sm">
                <span className="font-semibold">VHash:</span> {metadata.vhash}
              </p>
            )}
            {metadata.ssdeep && (
              <p className="text-sm">
                <span className="font-semibold">SSDEEP:</span> {metadata.ssdeep}
              </p>
            )}
            {metadata.tlsh && (
              <p className="text-sm">
                <span className="font-semibold">TLSH:</span> {metadata.tlsh}
              </p>
            )}
            {metadata.permhash && (
              <p className="text-sm">
                <span className="font-semibold">PermHash:</span> {metadata.permhash}
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* File Information Section */}
        <AccordionItem value="fileInfo" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
          <AccordionTrigger className="px-4">
            <span className="flex items-center gap-2">
              <FileType className="h-4 w-4" />
              File Information
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-2">
            {metadata.file_type && (
              <p className="text-sm">
                <span className="font-semibold">File Type:</span> {metadata.file_type.join(', ')}
              </p>
            )}
            {metadata.magic && (
              <p className="text-sm">
                <span className="font-semibold">Magic:</span> {metadata.magic}
              </p>
            )}
            {metadata.trid && (
              <p className="text-sm">
                <span className="font-semibold">TrID:</span> {metadata.trid.join(', ')}
              </p>
            )}
            {metadata.file_size && (
              <p className="text-sm">
                <span className="font-semibold">File Size:</span> {metadata.file_size}
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* History Section */}
        <AccordionItem value="history" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
          <AccordionTrigger className="px-4">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              History
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 space-y-2">
            {metadata.first_submission && (
              <p className="text-sm">
                <span className="font-semibold">First Submission:</span> {metadata.first_submission}
              </p>
            )}
            {metadata.last_submission && (
              <p className="text-sm">
                <span className="font-semibold">Last Submission:</span> {metadata.last_submission}
              </p>
            )}
            {metadata.last_analysis && (
              <p className="text-sm">
                <span className="font-semibold">Last Analysis:</span> {metadata.last_analysis}
              </p>
            )}
            {metadata.earliest_modification && (
              <p className="text-sm">
                <span className="font-semibold">Earliest Modification:</span> {metadata.earliest_modification}
              </p>
            )}
            {metadata.latest_modification && (
              <p className="text-sm">
                <span className="font-semibold">Latest Modification:</span> {metadata.latest_modification}
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Android Information Section */}
        {metadata.android_info && (
          <AccordionItem value="androidInfo" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
            <AccordionTrigger className="px-4">
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Android Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-2">
              {metadata.android_info.type && (
                <p className="text-sm">
                  <span className="font-semibold">Type:</span> {metadata.android_info.type}
                </p>
              )}
              {metadata.android_info.package_name && (
                <p className="text-sm">
                  <span className="font-semibold">Package Name:</span> {metadata.android_info.package_name}
                </p>
              )}
              {metadata.android_info.main_activity && (
                <p className="text-sm">
                  <span className="font-semibold">Main Activity:</span> {metadata.android_info.main_activity}
                </p>
              )}
              {metadata.android_info.internal_version && (
                <p className="text-sm">
                  <span className="font-semibold">Internal Version:</span> {metadata.android_info.internal_version}
                </p>
              )}
              {metadata.android_info.displayed_version && (
                <p className="text-sm">
                  <span className="font-semibold">Displayed Version:</span> {metadata.android_info.displayed_version}
                </p>
              )}
              {metadata.android_info.min_sdk && (
                <p className="text-sm">
                  <span className="font-semibold">Minimum SDK:</span> {metadata.android_info.min_sdk}
                </p>
              )}
              {metadata.android_info.target_sdk && (
                <p className="text-sm">
                  <span className="font-semibold">Target SDK:</span> {metadata.android_info.target_sdk}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Certificate Information Section */}
        {metadata.certificate && (
          <AccordionItem value="certificate" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
            <AccordionTrigger className="px-4">
              <span className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Certificate Information
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-2">
              {metadata.certificate.valid_from && (
                <p className="text-sm">
                  <span className="font-semibold">Valid From:</span> {metadata.certificate.valid_from}
                </p>
              )}
              {metadata.certificate.valid_to && (
                <p className="text-sm">
                  <span className="font-semibold">Valid To:</span> {metadata.certificate.valid_to}
                </p>
              )}
              {metadata.certificate.serial_number && (
                <p className="text-sm">
                  <span className="font-semibold">Serial Number:</span> {metadata.certificate.serial_number}
                </p>
              )}
              {metadata.certificate.thumbprint && (
                <p className="text-sm">
                  <span className="font-semibold">Thumbprint:</span> {metadata.certificate.thumbprint}
                </p>
              )}
              {metadata.certificate.subject && (
                <div className="mt-2">
                  <p className="text-sm font-semibold">Subject Information:</p>
                  <div className="ml-4 mt-1 space-y-1">
                    {metadata.certificate.subject.name && (
                      <p className="text-sm">
                        <span className="font-semibold">Name:</span> {metadata.certificate.subject.name}
                      </p>
                    )}
                    {metadata.certificate.subject.common_name && (
                      <p className="text-sm">
                        <span className="font-semibold">Common Name:</span> {metadata.certificate.subject.common_name}
                      </p>
                    )}
                    {metadata.certificate.subject.organization && (
                      <p className="text-sm">
                        <span className="font-semibold">Organization:</span> {metadata.certificate.subject.organization}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Permissions and Components Section */}
        {(metadata.permissions || metadata.activities || metadata.services || metadata.receivers) && (
          <AccordionItem value="components" className="border rounded-lg bg-white/50 dark:bg-midnight-light/50">
            <AccordionTrigger className="px-4">
              <span className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Permissions & Components
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              {metadata.permissions && metadata.permissions.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Permissions:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {metadata.permissions.map((permission, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {permission}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {metadata.activities && metadata.activities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Activities:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {metadata.activities.map((activity, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {metadata.services && metadata.services.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Services:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {metadata.services.map((service, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {metadata.receivers && metadata.receivers.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">Receivers:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {metadata.receivers.map((receiver, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {receiver}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
};

export default FileMetadata;