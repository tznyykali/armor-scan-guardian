import { useState } from 'react';
import { PermissionStatus } from '@/types/system';

export const useBatteryPermission = () => {
  const [batteryPermission, setBatteryPermission] = useState<PermissionStatus>('unknown');

  const checkBatteryPermission = async (): Promise<PermissionStatus> => {
    if ('getBattery' in navigator) {
      try {
        await (navigator as any).getBattery();
        setBatteryPermission('granted');
        return 'granted';
      } catch {
        setBatteryPermission('denied');
        return 'denied';
      }
    }
    setBatteryPermission('unavailable');
    return 'unavailable';
  };

  return {
    batteryPermission,
    checkBatteryPermission,
  };
};