export const VALID_FILE_TYPES = {
  ANDROID: ['application/vnd.android.package-archive', '.apk', '.aab'],
  IOS: ['application/x-ios-app', '.ipa'],
  COMMON: [
    'application/pdf',
    'application/x-msdownload', // .exe
    'application/x-executable', // Linux executables
    'application/x-mach-binary', // macOS executables
    'application/zip',
    'application/x-zip-compressed',
    'application/java-archive', // .jar
  ]
};

export const isValidFileType = (file: File): boolean => {
  const validTypes = [
    ...VALID_FILE_TYPES.ANDROID,
    ...VALID_FILE_TYPES.IOS,
    ...VALID_FILE_TYPES.COMMON
  ];

  const isValid = validTypes.includes(file.type) || 
    VALID_FILE_TYPES.ANDROID.some(ext => file.name.endsWith(ext)) || 
    VALID_FILE_TYPES.IOS.some(ext => file.name.endsWith(ext));

  console.log('File type validation:', file.type, isValid ? 'valid' : 'invalid');
  return isValid;
}