import { supabase } from '@/integrations/supabase/client';
import { ScanResult, EngineScanResult } from '@/types/scan-types';

const ANALYSIS_POLLING_INTERVAL = 2000; // 2 seconds

async function getVirusTotalApiKey(): Promise<string> {
  const { data: { VIRUSTOTAL_API_KEY }, error } = await supabase.functions.invoke('get-virustotal-key');
  if (error) throw new Error('Failed to get VirusTotal API key');
  return VIRUSTOTAL_API_KEY;
}

async function pollAnalysis(analysisId: string, apiKey: string): Promise<any> {
  const analysisResponse = await fetch(
    `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
    {
      headers: {
        'x-apikey': apiKey,
      },
    }
  );

  if (!analysisResponse.ok) {
    throw new Error('Failed to fetch analysis results');
  }

  const analysisData = await analysisResponse.json();
  
  if (analysisData.data.attributes.status === 'completed') {
    return processResults(analysisData.data.attributes);
  }

  await new Promise(resolve => setTimeout(resolve, ANALYSIS_POLLING_INTERVAL));
  return pollAnalysis(analysisId, apiKey);
}

function processResults(attributes: any): ScanResult {
  const engineResults = attributes.results || {};
  const stats = {
    harmless: 0,
    malicious: 0,
    suspicious: 0,
    undetected: 0,
  };

  // Process engine results and count statistics
  Object.values<EngineScanResult>(engineResults).forEach((result: any) => {
    if (result.category === 'harmless') stats.harmless++;
    else if (result.category === 'malicious') stats.malicious++;
    else if (result.category === 'suspicious') stats.suspicious++;
    else stats.undetected++;
  });

  return {
    status: attributes.status,
    stats,
    metadata: {
      engines_used: Object.keys(engineResults).length,
      analysis_date: new Date(attributes.date * 1000).toISOString(),
      categories: attributes.categories || {},
      threat_names: Object.values<EngineScanResult>(engineResults)
        .map(result => result.result)
        .filter(Boolean),
    },
    detection_details: Object.entries(engineResults)
      .filter(([_, result]: [string, any]) => result.result)
      .map(([engine, result]: [string, any]) => 
        `${engine}: ${result.result} (${result.method || 'unknown method'})`
      ),
    permalink: attributes.permalink,
  };
}

export async function scanUrl(url: string): Promise<ScanResult> {
  const apiKey = await getVirusTotalApiKey();

  const scanResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
    method: 'POST',
    headers: {
      'x-apikey': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `url=${encodeURIComponent(url)}`,
  });

  if (!scanResponse.ok) {
    throw new Error('Failed to submit URL for scanning');
  }

  const scanData = await scanResponse.json();
  return pollAnalysis(scanData.data.id, apiKey);
}

export async function scanFile(file: File): Promise<ScanResult> {
  const apiKey = await getVirusTotalApiKey();

  // Get upload URL
  const urlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
    headers: {
      'x-apikey': apiKey,
    },
  });

  if (!urlResponse.ok) {
    throw new Error('Failed to get upload URL');
  }

  const { data: uploadUrl } = await urlResponse.json();

  // Upload file
  const formData = new FormData();
  formData.append('file', file);

  const uploadResponse = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'x-apikey': apiKey,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file');
  }

  const uploadData = await uploadResponse.json();
  const results = await pollAnalysis(uploadData.data.id, apiKey);

  // Add file-specific metadata
  return {
    ...results,
    metadata: {
      ...results.metadata,
      file_info: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
    },
    file_path: URL.createObjectURL(file),
  };
}