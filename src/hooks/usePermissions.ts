import { useState, useEffect } from 'react';
import { PermissionStatus, PermissionType } from '@/types/system';
import { useNotificationPermission } from './useNotificationPermission';
import { useBatteryPermission } from './useBatteryPermission';
import { useToast } from './use-toast';

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<Record<string, PermissionStatus>>({});
  const { notificationPermission, checkNotificationPermission } = useNotificationPermission();
  const { batteryPermission, checkBatteryPermission } = useBatteryPermission();
  const { toast } = useToast();

  useEffect(() => {
    setPermissions(prev => ({
      ...prev,
      notifications: notificationPermission,
      battery: batteryPermission,
    }));
  }, [notificationPermission, batteryPermission]);

  const checkPermission = async (type: PermissionType): Promise<PermissionStatus> => {
    try {
      let status: PermissionStatus;

      switch (type) {
        case 'notifications':
          status = await checkNotificationPermission();
          break;
        case 'battery':
          status = await checkBatteryPermission();
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
        title: "Permission Error",
        description: `Unable to check ${type} permission`,
        variant: "destructive",
      });
      return 'error';
    }
  };

  const requestPermission = async (type: PermissionType): Promise<PermissionStatus> => {
    try {
      const status = await checkPermission(type);
      
      if (status === 'denied') {
        toast({
          title: "Permission Required",
          description: `Please enable ${type} permissions to use this feature`,
          variant: "destructive",
        });
      }

      return status;
    } catch (error) {
      console.error(`Error requesting ${type} permission:`, error);
      toast({
        title: "Permission Error",
        description: `Unable to request ${type} permission`,
        variant: "destructive",
      });
      return 'error';
    }
  };

  return {
    permissions,
    checkPermission,
    requestPermission,
  };
};