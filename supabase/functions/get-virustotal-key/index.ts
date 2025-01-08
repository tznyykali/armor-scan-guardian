import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('VIRUSTOTAL_API_KEY');
    
    if (!apiKey) {
      console.error('VIRUSTOTAL_API_KEY not found in environment variables');
      return new Response(
        JSON.stringify({ error: 'VirusTotal API key not configured' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Successfully retrieved VirusTotal API key');
    return new Response(
      JSON.stringify({ VIRUSTOTAL_API_KEY: apiKey }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error retrieving VirusTotal API key:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to retrieve VirusTotal API key' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});