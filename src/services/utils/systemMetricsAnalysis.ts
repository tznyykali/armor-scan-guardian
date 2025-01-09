import { SystemMetrics } from '@/types/system';
import { supabase } from '@/integrations/supabase/client';

export async function analyzeSystemMetrics(metrics: SystemMetrics) {
  const { data, error } = await supabase
    .from('system_metrics')
    .insert({
      cpu_usage: metrics.cpuUsage,
      memory_usage: metrics.memoryUsage,
      battery_level: metrics.batteryLevel,
      storage: metrics.storage,
      network_activity: metrics.networkActivity,
      running_processes: metrics.runningProcesses
    });

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