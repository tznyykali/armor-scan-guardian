import { supabase } from '@/integrations/supabase/client';

export async function getScanHistory() {
  const { data, error } = await supabase
    .from('current_scan_results')
    .select('*')
    .order('scan_timestamp', { ascending: false });

  if (error) {
    console.error('Error fetching scan history:', error);
    throw error;
  }

  return data;
}

export async function saveScanResult(scanResult: any) {
  const { error } = await supabase
    .from('current_scan_results')
    .insert([scanResult]);

  if (error) {
    console.error('Error saving scan result:', error);
    throw error;
  }
}