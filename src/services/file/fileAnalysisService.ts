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

    return formatResults(data, file);
  } catch (error) {
    console.error('File scan error:', error);
    throw error;
  }
}

function formatResults(analysisData: any, file: File) {
  const results = {
    ...analysisData.data.attributes,
    metadata: {
      file_info: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      engines_used: Object.keys(analysisData.data.attributes.results).length,
      analysis_date: new Date(analysisData.data.attributes.date * 1000).toISOString(),
      categories: analysisData.data.attributes.categories || {},
      threat_names: Object.values(analysisData.data.attributes.results)
        .map((result: any) => result.result)
        .filter(Boolean),
    },
    file_path: URL.createObjectURL(file),
    detection_details: Object.entries(analysisData.data.attributes.results)
      .filter(([_, result]: [string, any]) => result.result)
      .map(([engine, result]: [string, any]) => 
        `${engine}: ${result.result} (${result.method || 'unknown method'})`
      ),
  };
  return { data: { attributes: results } };
}