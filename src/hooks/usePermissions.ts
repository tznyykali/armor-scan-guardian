import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useToast } from '@/hooks/use-toast';

export type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unavailable';

export interface SystemPermissions {
  storage: PermissionStatus;
  camera: PermissionStatus;
  notifications: PermissionStatus;
  battery: PermissionStatus;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<SystemPermissions>({
    storage: 'prompt',
    camera: 'prompt',
    notifications: 'prompt',
    battery: 'prompt'
  });
  const { toast } = useToast();

  const checkPermissions = async () => {
    const storagePermission = Platform.select({
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    });

    const cameraPermission = Platform.select({
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    });

    if (storagePermission && cameraPermission) {
      const [storageStatus, cameraStatus] = await Promise.all([
        check(storagePermission),
        check(cameraPermission),
      ]);

      setPermissions(prev => ({
        ...prev,
        storage: storageStatus as PermissionStatus,
        camera: cameraStatus as PermissionStatus,
      }));
    }
  };

  const requestPermission = async (permission: keyof SystemPermissions) => {
    let permissionType;

    switch (permission) {
      case 'storage':
        permissionType = Platform.select({
          android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
        });
        break;
      case 'camera':
        permissionType = Platform.select({
          android: PERMISSIONS.ANDROID.CAMERA,
          ios: PERMISSIONS.IOS.CAMERA,
        });
        break;
      case 'notifications':
        // Use appropriate notification permissions for each platform
        permissionType = Platform.select({
          android: PERMISSIONS.ANDROID.POST_NOTIFICATIONS,
          ios: PERMISSIONS.IOS.NOTIFICATIONS,
        });
        break;
      case 'battery':
        // Battery monitoring is handled differently on each platform
        if (Platform.OS === 'android') {
          // Android doesn't require explicit battery permission in newer versions
          setPermissions(prev => ({
            ...prev,
            battery: 'granted'
          }));
          return 'granted';
        } else {
          // iOS doesn't require battery permission
          setPermissions(prev => ({
            ...prev,
            battery: 'granted'
          }));
          return 'granted';
        }
    }

    if (permissionType) {
      try {
        const result = await request(permissionType);
        setPermissions(prev => ({
          ...prev,
          [permission]: result as PermissionStatus
        }));

        if (result === RESULTS.GRANTED) {
          toast({
            title: 'Permission Granted',
            description: `${permission} access has been granted`,
          });
        } else {
          toast({
            title: 'Permission Denied',
            description: `${permission} access is required for full functionality`,
            variant: "destructive",
          });
        }

        return result;
      } catch (error) {
        console.error('Error requesting permission:', error);
        return 'denied';
      }
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