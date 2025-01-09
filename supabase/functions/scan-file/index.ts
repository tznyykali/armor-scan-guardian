import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const VIRUSTOTAL_API_KEY = Deno.env.get('VIRUSTOTAL_API_KEY');
    if (!VIRUSTOTAL_API_KEY) {
      throw new Error('VirusTotal API key not found');
    }

    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file || !(file instanceof File)) {
      throw new Error('No file provided');
    }

    console.log('Getting upload URL from VirusTotal...');
    const uploadUrlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
    });

    if (!uploadUrlResponse.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { data: uploadUrl } = await uploadUrlResponse.json();

    console.log('Uploading file to VirusTotal...');
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
      },
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }

    const analysisData = await uploadResponse.json();

    console.log('Polling for analysis results...');
    const analysisId = analysisData.data.id;
    let results;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const analysisResponse = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: {
            'x-apikey': VIRUSTOTAL_API_KEY,
          },
        }
      );

      if (!analysisResponse.ok) {
        throw new Error('Failed to fetch analysis results');
      }

      const data = await analysisResponse.json();
      
      if (data.data.attributes.status === 'completed') {
        // Enhanced file information and analysis results
        results = {
          status: data.data.attributes.status,
          stats: data.data.attributes.stats || {
            harmless: 0,
            malicious: 0,
            suspicious: 0,
            undetected: 0
          },
          metadata: {
            file_info: {
              name: file.name,
              size: file.size,
              type: file.type,
              last_modified: new Date(file.lastModified).toISOString(),
              mime_type: file.type,
              md5: data.data.attributes.md5 || 'Not available',
              sha1: data.data.attributes.sha1 || 'Not available',
              sha256: data.data.attributes.sha256 || 'Not available',
              file_type_extension: data.data.attributes.type_extension || file.name.split('.').pop(),
              file_type_description: data.data.attributes.type_description || 'Not available',
              size_bytes: data.data.attributes.size || file.size,
            },
            engines_used: Object.keys(data.data.attributes.results || {}).length,
            analysis_date: new Date().toISOString(),
            categories: data.data.attributes.categories || {},
            threat_names: Object.values(data.data.attributes.results || {})
              .map((result: any) => result.result)
              .filter(Boolean),
            sandbox_verdicts: data.data.attributes.sandbox_verdicts || {},
            popular_threat_classification: data.data.attributes.popular_threat_classification || {},
            file_type_tags: data.data.attributes.type_tags || [],
          },
          detection_details: Object.entries(data.data.attributes.results || {})
            .filter(([_, result]: [string, any]) => result.result)
            .map(([engine, result]: [string, any]) => ({
              engine_name: engine,
              category: result.category || 'unknown',
              result: result.result,
              method: result.method || 'signature-based',
              engine_version: result.engine_version || 'N/A',
              engine_update: result.engine_update || 'N/A'
            })),
        };
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }

    if (!results) {
      throw new Error('Analysis timed out');
    }

    console.log('Analysis complete, returning results');
    return new Response(
      JSON.stringify(results),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        } 
      }
    );

  } catch (error) {
    console.error('Error in scan-file function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        } 
      }
    );
  }
});