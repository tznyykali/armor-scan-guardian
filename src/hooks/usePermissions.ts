import { useState, useEffect } from 'react';
import { useToast } from './use-toast';
import { PermissionType } from '@/types/system';

// Export the PermissionStatus type
export type PermissionStatus = 'granted' | 'denied' | 'unavailable' | 'unknown' | 'error';

export type PermissionState = {
  [key in PermissionType]: PermissionStatus;
};

const useNotificationPermission = (): PermissionStatus => {
  const [status, setStatus] = useState<PermissionStatus>('unknown');

  useEffect(() => {
    const checkPermission = async () => {
      if (!('Notification' in window)) {
        setStatus('unavailable');
        return;
      }

      try {
        const result = await Notification.requestPermission();
        setStatus(result as PermissionStatus);
      } catch (error) {
        setStatus('error');
      }
    };

    checkPermission();
  }, []);

  return status;
};

const useBatteryPermission = (): PermissionStatus => {
  const [status, setStatus] = useState<PermissionStatus>('unknown');

  useEffect(() => {
    const checkPermission = async () => {
      if (!('getBattery' in navigator)) {
        setStatus('unavailable');
        return;
      }

      try {
        // @ts-ignore - getBattery is not in the TypeScript navigator type
        await navigator.getBattery();
        setStatus('granted');
      } catch (error) {
        setStatus('denied');
      }
    };

    checkPermission();
  }, []);

  return status;
};

const usePermissions = () => {
  const { toast } = useToast();
  const [permissions, setPermissions] = useState<PermissionState>({
    notifications: 'unknown',
    battery: 'unknown',
    storage: 'unknown',
  });

  const notificationPermission = useNotificationPermission();
  const batteryPermission = useBatteryPermission();

  useEffect(() => {
    setPermissions(prev => ({
      ...prev,
      notifications: notificationPermission,
      battery: batteryPermission,
      storage: 'granted', // Storage is always granted in web context
    }));
  }, [notificationPermission, batteryPermission]);

  const checkPermission = async (type: PermissionType): Promise<PermissionStatus> => {
    let status: PermissionStatus;

    try {
      switch (type) {
        case 'notifications':
          status = notificationPermission;
          break;
        case 'battery':
          status = batteryPermission;
          break;
        case 'storage':
          status = 'granted'; // Storage is always granted in web context
          break;
        default:
          status = 'unavailable';
      }

      setPermissions(prev => ({
        ...prev,
        [type]: status,
      }));

      return status;
    } catch (error) {
      console.error(`Error checking ${type} permission:`, error);
      toast({
        title: 'Permission Error',
        description: `Failed to check ${type} permission`,
        variant: 'destructive',
      });
      return 'error';
    }
  };

  const requestPermission = async (type: PermissionType): Promise<PermissionStatus> => {
    const status = await checkPermission(type);
    
    if (status === 'denied') {
      toast({
        title: 'Permission Denied',
        description: `${type} permission was denied. Please enable it in your browser settings.`,
        variant: 'destructive',
      });
    }

    return status;
  };

  return {
    permissions,
    checkPermission,
    requestPermission,
  };
};

export default usePermissions;