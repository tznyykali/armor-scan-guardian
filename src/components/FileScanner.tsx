import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import { Upload } from 'lucide-react-native';
import { scanFile } from '@/services/virusTotalService';
import { ScanResult } from '@/types/scan';
import { useScan } from '@/hooks/useScan';
import { isValidFileType } from '@/utils/fileValidation';
import Toast from 'react-native-toast-message';

interface FileScannerProps {
  onScanComplete?: (result: ScanResult) => void;
}

// Helper function to convert DocumentPickerResponse to File-like object
const createFileFromPickerResponse = (response: DocumentPickerResponse) => {
  return {
    name: response.name || 'unknown',
    type: response.type || 'application/octet-stream',
    size: response.size || 0,
    uri: response.uri,
    lastModified: Date.now(),
    // Add minimal File interface implementation
    arrayBuffer: async () => new ArrayBuffer(0),
    slice: () => new Blob(),
    stream: () => new ReadableStream(),
    text: async () => '',
  } as unknown as File;
};

const FileScanner = ({ onScanComplete }: FileScannerProps) => {
  const { isScanning, setIsScanning, handleScanComplete } = useScan({ onScanComplete });

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.zip,
          'application/vnd.android.package-archive', // APK
          'application/x-ios-app', // IPA
          'application/x-msdownload', // EXE
        ],
      });

      const pickerResponse = result[0];
      const fileObject = createFileFromPickerResponse(pickerResponse);
      
      if (!isValidFileType(fileObject)) {
        Toast.show({
          type: 'error',
          text1: 'Invalid File Type',
          text2: 'Please upload a supported file type (APK, AAB, IPA, EXE, PDF, etc.)',
        });
        return;
      }

      setIsScanning(true);
      try {
        const scanResults = await scanFile(fileObject);
        handleScanComplete('file', fileObject.name, scanResults);
        Toast.show({
          type: 'success',
          text1: 'Scan Complete',
          text2: `File ${fileObject.name} has been successfully scanned`,
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Scan Error',
          text2: error instanceof Error ? error.message : 'Failed to scan file',
        });
      } finally {
        setIsScanning(false);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to pick file',
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Upload width={20} height={20} color="#FF6B6B" />
        <Text style={styles.title}>File Scanner_</Text>
      </View>
      <TouchableOpacity 
        style={styles.dropZone} 
        onPress={handleFilePick}
        disabled={isScanning}
      >
        <Upload width={48} height={48} color="#FF6B6B" />
        <Text style={styles.dropZoneText}>
          {isScanning ? 'Scanning file...' : 'Tap to select a file_'}
        </Text>
        <Text style={styles.supportedText}>
          Supported: APK, AAB, IPA, EXE, DLL, PDF, ZIP, JAR
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(245, 245, 245, 0.5)',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    color: '#FF6B6B',
  },
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropZoneText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  supportedText: {
    marginTop: 8,
    fontSize: 12,
    color: '#999',
  },
});

export default FileScanner;