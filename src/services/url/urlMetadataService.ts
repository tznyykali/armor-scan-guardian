export async function extractUrlMetadata(url: string) {
  const urlObj = new URL(url);
  const isHttps = urlObj.protocol === 'https:';
  const hasKnownBadPath = /\.(exe|php|cgi|asp|jsp)$/i.test(urlObj.pathname);
  const hasSuspiciousParams = urlObj.search.includes('redirect') || 
                             urlObj.search.includes('url=') || 
                             urlObj.search.includes('goto=');
  
  return {
    domain: urlObj.hostname,
    protocol: urlObj.protocol,
    path: urlObj.pathname,
    query_parameters: urlObj.search,
    risk_factors: {
      not_https: !isHttps,
      suspicious_path: hasKnownBadPath,
      suspicious_params: hasSuspiciousParams,
      known_bad_patterns: true
    },
    ssl_certificate: {
      issuer: 'Example CA',
      valid_from: new Date().toISOString(),
      valid_to: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      version: 'TLSv1.3'
    },
    headers: {
      server: 'nginx',
      content_type: 'text/html',
      x_frame_options: 'DENY',
      content_security_policy: "default-src 'self'"
    },
    whois_data: {
      registrar: 'Example Registrar',
      creation_date: '2020-01-01',
      expiration_date: '2025-01-01',
      last_updated: '2023-01-01'
    }
  };
}