import { ScanResult } from '@/types/scan';
import { supabase } from '@/integrations/supabase/client';

export async function scanFile(file: File): Promise<ScanResult> {
  console.log('Starting file scan with Supabase client...');
  
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Call the scan-file edge function
    const { data, error } = await supabase.functions.invoke('scan-file', {
      body: formData,
    });

    if (error) {
      console.error('Error scanning file:', error);
      throw new Error(error.message);
    }

    if (!data) {
      throw new Error('No scan results received');
    }

    // Save scan result to the current_scan_results table
    const { error: saveError } = await supabase
      .from('current_scan_results')
      .insert({
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        md5_hash: data.file_metadata?.md5,
        sha1_hash: data.file_metadata?.sha1,
        sha256_hash: data.file_metadata?.sha256,
        threat_category: data.malware_classification?.[0] || 'unknown',
        yara_matches: data.yara_matches || [],
        file_metadata: {
          magic: data.metadata?.magic,
          mime_type: file.type,
          last_modified: new Date(file.lastModified).toISOString(),
          analysis_date: new Date().toISOString()
        }
      });

    if (saveError) {
      console.error('Error saving scan result:', saveError);
      throw saveError;
    }

    return {
      id: crypto.randomUUID(),
      type: 'file',
      target: file.name,
      timestamp: new Date().toISOString(),
      results: {
        status: data.status,
        metadata: data.metadata,
        file_metadata: data.file_metadata,
        malware_classification: data.malware_classification || []
      }
    };
  } catch (error) {
    console.error('File scan error:', error);
    throw error;
  }
}