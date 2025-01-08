import React from 'react';

const NetworkBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 network-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
    </div>
  );
};

export default NetworkBackground;