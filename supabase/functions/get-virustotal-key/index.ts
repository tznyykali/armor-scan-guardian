import { serve } from 'https://deno.fresh.dev/server/mod.ts';

serve(async (req) => {
  const apiKey = Deno.env.get('VIRUSTOTAL_API_KEY');
  
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'VirusTotal API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return new Response(
    JSON.stringify({ VIRUSTOTAL_API_KEY: apiKey }),
    { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
});