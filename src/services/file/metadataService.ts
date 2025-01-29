export function extractFileMetadata(file: File, platform: string) {
  let appInfo = {};
  let appPermissions = [];
  let appComponents = {};

  if (file.name.endsWith('.apk') || file.name.endsWith('.aab')) {
    appInfo = {
      package_name: 'com.example.app',
      version_code: '1.0.0',
      min_sdk: '21',
      target_sdk: '33'
    };
    appPermissions = [
      'android.permission.INTERNET',
      'android.permission.ACCESS_NETWORK_STATE'
    ];
    appComponents = {
      activities: ['MainActivity', 'SettingsActivity'],
      services: ['BackgroundService'],
      receivers: ['BootReceiver']
    };
  } else if (file.name.endsWith('.ipa')) {
    appInfo = {
      bundle_id: 'com.example.app',
      version: '1.0.0',
      minimum_os_version: '13.0'
    };
    appPermissions = [
      'NSCameraUsageDescription',
      'NSPhotoLibraryUsageDescription'
    ];
    appComponents = {
      frameworks: ['UIKit', 'CoreData'],
      capabilities: ['Push Notifications', 'Background Modes']
    };
  }

  return {
    appInfo,
    appPermissions,
    appComponents,
    platform
  };
}