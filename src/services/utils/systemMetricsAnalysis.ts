import { SystemMetrics } from '@/types/system';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export async function analyzeSystemMetrics(metrics: SystemMetrics) {
  const { cpuUsage, memoryUsage, batteryLevel, storage } = metrics;

  // Save metrics to the database
  const { data, error } = await supabase
    .from('system_metrics')
    .insert([{ cpuUsage, memoryUsage, batteryLevel, storage }]);

  if (error) {
    console.error('Error saving system metrics:', error);
    throw new Error('Failed to save system metrics');
  }

  return data;
}

export function calculateHealthScore(metrics: SystemMetrics): number {
  const cpuScore = 100 - metrics.cpuUsage;
  const memoryScore = 100 - metrics.memoryUsage;
  const batteryScore = metrics.batteryLevel;
  const storageScore = 100 - metrics.storage;

  return Math.round((cpuScore + memoryScore + batteryScore + storageScore) / 4);
}
