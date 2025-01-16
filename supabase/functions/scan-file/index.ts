import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

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
    console.log('Starting file scan in Edge Function...');
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      throw new Error('No file provided');
    }

    console.log('File received:', file.name, 'Size:', file.size);

    // Calculate file hashes
    const fileArrayBuffer = await file.arrayBuffer();
    const md5Hash = await crypto.subtle.digest('MD5', fileArrayBuffer);
    const sha1Hash = await crypto.subtle.digest('SHA-1', fileArrayBuffer);
    const sha256Hash = await crypto.subtle.digest('SHA-256', fileArrayBuffer);

    const hashToHex = (hash: ArrayBuffer) => 
      Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    const fileMetadata = {
      md5: hashToHex(md5Hash),
      sha1: hashToHex(sha1Hash),
      sha256: hashToHex(sha256Hash),
    };

    // Simulate scan results for demonstration
    const scanResults = {
      status: 'completed',
      metadata: {
        file_info: {
          name: file.name,
          size: file.size,
          type: file.type,
          last_modified: new Date().toISOString(),
        },
        magic: file.type,
      },
      file_metadata: fileMetadata,
      malware_classification: [],
      ml_results: [],
      yara_matches: [],
      engine_results: [],
      scan_stats: {
        harmless: 1,
        malicious: 0,
        suspicious: 0,
        undetected: 0,
      },
      detection_details: []
    };

    console.log('Scan completed, returning results');

    return new Response(
      JSON.stringify(scanResults),
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