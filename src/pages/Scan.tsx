import NetworkBackground from "@/components/NetworkBackground";
import ScanSection from "@/components/ScanSection";
import PermissionsManager from "@/components/PermissionsManager";
import { useEffect } from "react";

const Scan = () => {
  useEffect(() => {
    // Load the Share Tech Mono font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="min-h-screen pt-16">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-mono text-rust-dark dark:text-rust-light inline-block">
            Security Scanner_
            <span className="animate-cursor-blink border-r-2 border-rust ml-1">|</span>
          </h2>
          <PermissionsManager />
        </div>
        <ScanSection />
      </div>
    </div>
  );
};

export default Scan;