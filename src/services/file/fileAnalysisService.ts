import { ScanResult } from '@/types/scan-types';
import { supabase } from '@/integrations/supabase/client';

export async function scanFile(file: File): Promise<ScanResult> {
  console.log('Starting file scan with Supabase client...');
  
  try {
    const formData = new FormData();
    formData.append('file', file);

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

    return data as ScanResult;
  } catch (error) {
    console.error('File scan error:', error);
    throw error;
  }
}