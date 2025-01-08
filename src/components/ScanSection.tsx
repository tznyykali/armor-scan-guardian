import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ScanSection = () => {
  const [urlInput, setUrlInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  const handleUrlScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) {
      toast({
        title: "Error",
        description: "Please enter a URL to scan",
        variant: "destructive",
      });
      return;
    }
    setIsScanning(true);
    // Simulate scanning
    setTimeout(() => {
      setIsScanning(false);
      toast({
        title: "Scan Complete",
        description: "URL has been successfully scanned",
      });
    }, 2000);
  };

  const handleFileDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setIsScanning(true);
      // Simulate scanning
      setTimeout(() => {
        setIsScanning(false);
        toast({
          title: "Scan Complete",
          description: `File "${file.name}" has been successfully scanned`,
        });
      }, 2000);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
      {/* URL Scanner */}
      <div className="bg-cyber-muted/50 backdrop-blur-lg rounded-lg p-6 border border-cyber-accent/20">
        <div className="flex items-center space-x-2 mb-4">
          <LinkIcon className="w-5 h-5 text-safe-DEFAULT" />
          <h3 className="text-lg font-semibold">URL Scanner</h3>
        </div>
        <form onSubmit={handleUrlScan} className="space-y-4">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Enter URL to scan..."
            className="w-full px-4 py-2 bg-cyber-DEFAULT/50 border border-cyber-accent/20 rounded-md focus:outline-none focus:ring-2 focus:ring-safe-DEFAULT/50"
          />
          <button
            type="submit"
            disabled={isScanning}
            className="w-full px-4 py-2 bg-safe-DEFAULT text-cyber-DEFAULT font-semibold rounded-md hover:bg-safe-muted transition-colors disabled:opacity-50"
          >
            {isScanning ? (
              <span className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Scanning...
              </span>
            ) : (
              'Scan URL'
            )}
          </button>
        </form>
      </div>

      {/* File Scanner */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleFileDrop}
        className="bg-cyber-muted/50 backdrop-blur-lg rounded-lg p-6 border border-cyber-accent/20"
      >
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="w-5 h-5 text-safe-DEFAULT" />
          <h3 className="text-lg font-semibold">File Scanner</h3>
        </div>
        <div className="border-2 border-dashed border-cyber-accent/20 rounded-lg p-8 text-center">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setIsScanning(true);
                setTimeout(() => {
                  setIsScanning(false);
                  toast({
                    title: "Scan Complete",
                    description: `File "${e.target.files[0].name}" has been successfully scanned`,
                  });
                }, 2000);
              }
            }}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer flex flex-col items-center space-y-2"
          >
            <Upload className="w-12 h-12 text-cyber-accent" />
            <span className="text-sm text-foreground/60">
              Drag & drop files here or click to upload
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ScanSection;