interface RiskAssessment {
  riskScore: number;
  hasHighRiskFactors: boolean;
  hasSuspiciousAlerts: boolean;
  hasSystemFindings: boolean;
}

export function calculateRiskScore(
  urlMetadata: any,
  snortAlerts: any[],
  hidsFindings: any
): RiskAssessment {
  const hasHighRiskFactors = Object.values(urlMetadata.risk_factors).filter(Boolean).length >= 2;
  const hasSuspiciousAlerts = snortAlerts.length >= 2;
  const hasSystemFindings = Object.values(hidsFindings.network_activity).filter(Boolean).length >= 2;
  
  const riskScore = (
    (hasHighRiskFactors ? 40 : 0) +
    (hasSuspiciousAlerts ? 30 : 0) +
    (hasSystemFindings ? 30 : 0)
  );

  return {
    riskScore,
    hasHighRiskFactors,
    hasSuspiciousAlerts,
    hasSystemFindings
  };
}