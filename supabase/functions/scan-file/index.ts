import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting file scan...');
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      throw new Error('No file provided');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get VirusTotal API key from Supabase secrets
    const apiKey = Deno.env.get('VIRUSTOTAL_API_KEY');
    if (!apiKey) {
      throw new Error('VirusTotal API key not configured');
    }

    console.log('Getting upload URL from VirusTotal...');
    const urlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
      headers: {
        'x-apikey': apiKey,
      },
    });

    if (!urlResponse.ok) {
      throw new Error('Failed to get upload URL from VirusTotal');
    }

    const { data: uploadUrl } = await urlResponse.json();

    // Upload file to VirusTotal
    console.log('Uploading file to VirusTotal...');
    const vtFormData = new FormData();
    vtFormData.append('file', file);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
      },
      body: vtFormData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file to VirusTotal');
    }

    const uploadData = await uploadResponse.json();
    const analysisId = uploadData.data.id;

    console.log('File uploaded, analysis ID:', analysisId);

    // Poll for analysis results
    let results = null;
    let attempts = 0;
    const maxAttempts = 30;
    const delayBetweenAttempts = 5000;

    while (attempts < maxAttempts) {
      console.log(`Polling attempt ${attempts + 1}/${maxAttempts}...`);
      
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

      const data = await analysisResponse.json();
      
      if (data.data.attributes.status === 'completed') {
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
            },
            engines_used: Object.keys(data.data.attributes.results || {}).length,
            analysis_date: new Date().toISOString(),
            categories: data.data.attributes.categories || {},
            threat_names: Object.values(data.data.attributes.results || {})
              .map((result: any) => result.result)
              .filter(Boolean),
          },
          detection_details: Object.entries(data.data.attributes.results || {})
            .filter(([_, result]: [string, any]) => result.result)
            .map(([engine, result]: [string, any]) => 
              `${engine}: ${result.result} (${result.method || 'unknown method'})`
            ),
        };
        break;
      } else if (data.data.attributes.status === 'queued' || data.data.attributes.status === 'in-progress') {
        await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
        attempts++;
      } else {
        throw new Error(`Analysis failed with status: ${data.data.attributes.status}`);
      }
    }

    if (!results) {
      throw new Error('Analysis timed out after maximum attempts');
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
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined 
      }),
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