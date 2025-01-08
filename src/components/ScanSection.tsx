import React from 'react';
import UrlScanner from './UrlScanner';
import FileScanner from './FileScanner';

const ScanSection = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto">
      <UrlScanner />
      <FileScanner />
    </div>
  );
};

export default ScanSection;