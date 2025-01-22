import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unavailable';

export interface SystemPermissions {
  battery: PermissionStatus;
  storage: PermissionStatus;
  notifications: PermissionStatus;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<SystemPermissions>({
    battery: 'prompt',
    storage: 'prompt',
    notifications: 'prompt'
  });
  const { toast } = useToast();

  const checkPermissions = async () => {
    const updatedPermissions: SystemPermissions = {
      battery: 'unavailable',
      storage: 'unavailable',
      notifications: 'unavailable'
    };

    // Check battery permission
    if ('getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        updatedPermissions.battery = 'granted';
      } catch {
        updatedPermissions.battery = 'denied';
      }
    }

    // Check storage permission
    if ('storage' in navigator && 'estimate' in (navigator as any).storage) {
      try {
        await (navigator as any).storage.estimate();
        updatedPermissions.storage = 'granted';
      } catch {
        updatedPermissions.storage = 'denied';
      }
    }

    // Check notification permission
    if ('Notification' in window) {
      updatedPermissions.notifications = Notification.permission as PermissionStatus;
    }

    setPermissions(updatedPermissions);
    return updatedPermissions;
  };

  const requestPermission = async (permission: keyof SystemPermissions) => {
    switch (permission) {
      case 'notifications':
        if ('Notification' in window) {
          try {
            const result = await Notification.requestPermission();
            setPermissions(prev => ({ ...prev, notifications: result as PermissionStatus }));
            return result;
          } catch (error) {
            console.error('Error requesting notification permission:', error);
            return 'denied';
          }
        }
        break;
      
      case 'battery':
      case 'storage':
        // These permissions are handled through browser APIs
        // and don't require explicit permission requests
        await checkPermissions();
        break;
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  return {
    permissions,
    requestPermission,
    checkPermissions
  };
};