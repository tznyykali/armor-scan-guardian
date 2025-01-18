import React from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface FileDropZoneProps {
  isScanning: boolean;
  onFileDrop: (file: File) => void;
}

const FileDropZone = ({ isScanning, onFileDrop }: FileDropZoneProps) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileDrop(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileDrop(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="border-2 border-dashed border-sage-dark/20 rounded-lg p-8 text-center"
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".apk,.aab,.ipa,.exe,.dll,.pdf,.zip,.jar"
        onChange={handleFileInput}
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center space-y-2"
      >
        {isScanning ? (
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-rust dark:text-rust-light animate-spin" />
            <span className="text-sm font-mono text-taupe dark:text-beige mt-2">
              Scanning file...
            </span>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-rust dark:text-rust-light" />
            <span className="text-sm font-mono text-taupe dark:text-beige">
              Drag & drop files here or click to upload_
            </span>
            <span className="text-xs text-muted-foreground">
              Supported: APK, AAB, IPA, EXE, DLL, PDF, ZIP, JAR
            </span>
          </>
        )}
      </label>
    </div>
  );
};

export default FileDropZone;