import { ScanResult } from '@/types/scan-types';
import { supabase } from '@/integrations/supabase/client';

export async function scanFile(file: File): Promise<ScanResult> {
  console.log('Starting file scan with Supabase client...');
  
  // Get the API key from Supabase Edge Function
  const { data: { VIRUSTOTAL_API_KEY }, error: secretError } = await supabase.functions.invoke('get-virustotal-key');
  
  if (secretError || !VIRUSTOTAL_API_KEY) {
    console.error('Error fetching VirusTotal API key:', secretError);
    throw new Error('Failed to retrieve VirusTotal API key');
  }

  try {
    const uploadUrl = await getUploadUrl(VIRUSTOTAL_API_KEY);
    const uploadData = await uploadFile(file, uploadUrl, VIRUSTOTAL_API_KEY);
    const analysisId = uploadData.data.id;
    return await pollForResults(analysisId, VIRUSTOTAL_API_KEY, file);
  } catch (error) {
    console.error('File scan error:', error);
    throw error;
  }
}

async function getUploadUrl(apiKey: string): Promise<string> {
  const response = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
    headers: {
      'x-apikey': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get upload URL');
  }

  const { data } = await response.json();
  return data;
}

async function uploadFile(file: File, uploadUrl: string, apiKey: string) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'x-apikey': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }

  return await response.json();
}

async function pollForResults(analysisId: string, apiKey: string, file: File): Promise<any> {
  const getResults = async (): Promise<any> => {
    const response = await fetch(
      `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
      {
        headers: {
          'x-apikey': apiKey,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch analysis results');
    }

    const analysisData = await response.json();
    
    if (analysisData.data.attributes.status === 'completed') {
      return formatResults(analysisData, file);
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    return getResults();
  };

  return await getResults();
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