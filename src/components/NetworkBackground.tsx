import React from 'react';

const NetworkBackground = () => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0 network-grid opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-cyber-DEFAULT via-cyber-DEFAULT/95 to-cyber-DEFAULT" />
    </div>
  );
};

export default NetworkBackground;