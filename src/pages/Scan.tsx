import NetworkBackground from "@/components/NetworkBackground";
import ScanSection from "@/components/ScanSection";
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
    <div className="min-h-screen pt-16 bg-beige dark:bg-taupe-dark">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <h2 className="text-3xl font-mono text-rust-dark dark:text-rust-light mb-12 inline-block">
          Security Scanner_
          <span className="animate-cursor-blink border-r-2 border-rust ml-1">|</span>
        </h2>
        <ScanSection />
      </div>
    </div>
  );
};

export default Scan;