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

    // Get YARA rules from the database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: yaraRules, error: yaraError } = await supabase
      .from('yara_rules')
      .select('*');

    if (yaraError) {
      throw new Error('Failed to fetch YARA rules');
    }

    // Simulate YARA scanning with the rules
    const yaraMatches = yaraRules
      .filter(() => Math.random() > 0.7)
      .map(rule => ({
        rule_match: rule.name,
        category: rule.category,
        detection_details: {
          description: rule.description
        }
      }));

    // Extract mobile app info if applicable
    let appInfo = {};
    let appPermissions = [];
    let appComponents = {};

    if (file.name.endsWith('.apk') || file.name.endsWith('.aab')) {
      appInfo = {
        package_name: 'com.example.app',
        version_code: '1.0.0',
        min_sdk: '21',
        target_sdk: '33'
      };
      appPermissions = [
        'android.permission.INTERNET',
        'android.permission.ACCESS_NETWORK_STATE'
      ];
      appComponents = {
        activities: ['MainActivity', 'SettingsActivity'],
        services: ['BackgroundService'],
        receivers: ['BootReceiver']
      };
    } else if (file.name.endsWith('.ipa')) {
      appInfo = {
        bundle_id: 'com.example.app',
        version: '1.0.0',
        minimum_os_version: '13.0'
      };
      appPermissions = [
        'NSCameraUsageDescription',
        'NSPhotoLibraryUsageDescription'
      ];
      appComponents = {
        frameworks: ['UIKit', 'CoreData'],
        capabilities: ['Push Notifications', 'Background Modes']
      };
    }

    // Prepare scan results
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
      app_bundle_info: appInfo,
      app_permissions: appPermissions,
      app_components: appComponents,
      malware_classification: yaraMatches.length > 0 ? ['potential_threat'] : ['clean'],
      yara_matches: yaraMatches,
      scan_stats: {
        harmless: yaraMatches.length === 0 ? 1 : 0,
        malicious: yaraMatches.length > 2 ? 1 : 0,
        suspicious: yaraMatches.length > 0 && yaraMatches.length <= 2 ? 1 : 0,
        undetected: 0,
      }
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