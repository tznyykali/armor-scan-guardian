export type PermissionStatus = 'granted' | 'denied' | 'unavailable' | 'unknown' | 'error';
export type PermissionType = 'notifications' | 'battery';

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  batteryLevel: number;
  storage: number;
  networkActivity?: number;
  runningProcesses?: string[];
}