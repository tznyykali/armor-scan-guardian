import { useState } from 'react';
import { PermissionStatus } from '@/types/system';

export const useNotificationPermission = () => {
  const [notificationPermission, setNotificationPermission] = useState<PermissionStatus>('unknown');

  const checkNotificationPermission = async (): Promise<PermissionStatus> => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      const status: PermissionStatus = permission === 'granted' ? 'granted' : 'denied';
      setNotificationPermission(status);
      return status;
    }
    setNotificationPermission('unavailable');
    return 'unavailable';
  };

  return {
    notificationPermission,
    checkNotificationPermission,
  };
};