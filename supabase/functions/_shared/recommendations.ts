import { MLPrediction } from './types.ts';

export function generateSecurityRecommendations(malwarePrediction: MLPrediction): string[] {
  const recommendations = [];
  
  if (malwarePrediction.confidence > 0.6) {
    recommendations.push('Run a full system security scan');
    recommendations.push('Review recently installed applications');
    recommendations.push('Update your security software');
  }
  
  return recommendations;
}

export function generateResourceRecommendations(resourcePrediction: MLPrediction): string[] {
  const recommendations = [];
  const patterns = resourcePrediction.metadata.resource_usage_patterns;
  
  if (patterns.cpu === 'high') {
    recommendations.push('Close unnecessary background applications');
  }
  if (patterns.memory === 'high') {
    recommendations.push('Clear application cache');
  }
  if (patterns.storage === 'high') {
    recommendations.push('Remove unused applications and files');
  }
  if (patterns.battery === 'critical') {
    recommendations.push('Enable battery saver mode');
  }
  
  return recommendations;
}