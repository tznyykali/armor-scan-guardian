import { supabase } from '@/integrations/supabase/client';
import { ScanResult } from '@/types/scan-types';

export async function scanUrl(url: string): Promise<ScanResult> {
  const { data, error } = await supabase.functions.invoke('virus-total-scan', {
    body: { url },
  });

  if (error) throw error;
  return data;
}

export async function scanFile(file: File): Promise<ScanResult> {
  // Convert file to base64
  const fileData = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });

  const { data, error } = await supabase.functions.invoke('virus-total-scan', {
    body: { fileData },
  });

  if (error) throw error;

  return {
    ...data,
    metadata: {
      ...data.metadata,
      file_info: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    },
    file_path: URL.createObjectURL(file),
  };
}