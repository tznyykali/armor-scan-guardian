import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const ANALYSIS_POLLING_INTERVAL = 2000;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { url, fileData } = await req.json()
    const apiKey = Deno.env.get('VIRUSTOTAL_API_KEY')

    if (!apiKey) {
      throw new Error('VirusTotal API key not found')
    }

    if (url) {
      // Handle URL scan
      const scanResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
        method: 'POST',
        headers: {
          'x-apikey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `url=${encodeURIComponent(url)}`,
      })

      if (!scanResponse.ok) {
        throw new Error('Failed to submit URL for scanning')
      }

      const scanData = await scanResponse.json()
      const results = await pollAnalysis(scanData.data.id, apiKey)
      
      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (fileData) {
      // Get upload URL
      const urlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
        headers: {
          'x-apikey': apiKey,
        },
      })

      if (!urlResponse.ok) {
        throw new Error('Failed to get upload URL')
      }

      const { data: uploadUrl } = await urlResponse.json()

      // Upload file
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'x-apikey': apiKey,
        },
        body: fileData,
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      const uploadData = await uploadResponse.json()
      const results = await pollAnalysis(uploadData.data.id, apiKey)

      return new Response(JSON.stringify(results), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    throw new Error('No URL or file provided')
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function pollAnalysis(analysisId: string, apiKey: string) {
  const analysisResponse = await fetch(
    `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
    {
      headers: {
        'x-apikey': apiKey,
      },
    }
  )

  if (!analysisResponse.ok) {
    throw new Error('Failed to fetch analysis results')
  }

  const analysisData = await analysisResponse.json()
  
  if (analysisData.data.attributes.status === 'completed') {
    return processResults(analysisData.data.attributes)
  }

  // Wait before polling again
  await new Promise(resolve => setTimeout(resolve, ANALYSIS_POLLING_INTERVAL))
  return pollAnalysis(analysisId, apiKey)
}

function processResults(attributes: any) {
  const engineResults = attributes.results || {}
  const stats = {
    harmless: 0,
    malicious: 0,
    suspicious: 0,
    undetected: 0,
  }

  Object.values(engineResults).forEach((result: any) => {
    if (result.category === 'harmless') stats.harmless++
    else if (result.category === 'malicious') stats.malicious++
    else if (result.category === 'suspicious') stats.suspicious++
    else stats.undetected++
  })

  return {
    status: attributes.status,
    stats,
    metadata: {
      engines_used: Object.keys(engineResults).length,
      analysis_date: new Date(attributes.date * 1000).toISOString(),
      categories: attributes.categories || {},
      threat_names: Object.values(engineResults)
        .map((result: any) => result.result)
        .filter(Boolean),
    },
    detection_details: Object.entries(engineResults)
      .filter(([_, result]: [string, any]) => result.result)
      .map(([engine, result]: [string, any]) => 
        `${engine}: ${result.result} (${result.method || 'unknown method'})`
      ),
    permalink: attributes.permalink,
  }
}