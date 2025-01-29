interface RiskFactors {
  malicious: boolean;
  suspicious: boolean;
  hasEncryption: boolean;
  hasObfuscation: boolean;
  highRiskPermissions: boolean;
}

interface HidsFindings {
  file_integrity?: string;
  system_calls?: string[];
  permissions?: string;
  network_activity?: {
    suspicious_connections: boolean;
    unusual_ports: boolean;
    known_bad_ips: boolean;
  };
}

interface RiskScoreResult {
  riskScore: number;
  hasHighRiskFactors: boolean;
  hasSuspiciousAlerts: boolean;
  hasSystemFindings: boolean;
}

export const calculateRiskScore = (
  metadata: Record<string, any> = {},
  snortAlerts: any[] = [],
  hidsFindings: HidsFindings = {}
): RiskScoreResult => {
  console.log('Calculating risk score with:', { metadata, snortAlerts, hidsFindings });

  const riskFactors: RiskFactors = {
    malicious: false,
    suspicious: false,
    hasEncryption: false,
    hasObfuscation: false,
    highRiskPermissions: false
  };

  // Check metadata categories if they exist
  if (metadata?.categories) {
    riskFactors.malicious = metadata.categories.malware === 'yes';
    riskFactors.hasEncryption = metadata.categories.encryption === 'yes';
    riskFactors.hasObfuscation = metadata.categories.obfuscation === 'yes';
  }

  // Check for suspicious or malicious indicators in alerts
  const hasSuspiciousAlerts = snortAlerts?.length > 0;
  if (hasSuspiciousAlerts) {
    riskFactors.suspicious = true;
  }

  // Check HIDS findings
  const hasSystemFindings = hidsFindings.network_activity && (
    hidsFindings.network_activity.suspicious_connections ||
    hidsFindings.network_activity.unusual_ports ||
    hidsFindings.network_activity.known_bad_ips
  );
  
  if (hasSystemFindings) {
    riskFactors.suspicious = true;
  }

  // Calculate risk score based on risk factors
  let riskScore = 0;
  if (riskFactors.malicious) riskScore += 40;
  if (riskFactors.suspicious) riskScore += 20;
  if (riskFactors.hasEncryption) riskScore += 15;
  if (riskFactors.hasObfuscation) riskScore += 15;
  if (riskFactors.highRiskPermissions) riskScore += 10;

  // Cap the risk score at 100
  riskScore = Math.min(riskScore, 100);

  // Determine if there are high risk factors
  const hasHighRiskFactors = riskScore >= 70;

  console.log('Risk calculation complete:', { riskScore, hasHighRiskFactors, riskFactors });

  return { riskScore, hasHighRiskFactors, hasSuspiciousAlerts, hasSystemFindings };
};