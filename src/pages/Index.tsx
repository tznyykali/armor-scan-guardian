import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import NetworkBackground from "@/components/NetworkBackground";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Load the Share Tech Mono font
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <div className="h-screen overflow-hidden bg-transparent relative">
      <NetworkBackground />
      <div className="relative h-full container mx-auto px-4 pt-28 flex items-center justify-center z-10">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl">
          <div className="relative">
            <Shield className="w-24 h-24 text-rust dark:text-rust-light animate-pulse" />
            <div className="absolute inset-0 bg-rust/20 blur-3xl -z-10 rounded-full" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-mono font-bold text-rust dark:text-rust-light inline-block">
            Secure Scan_
            <span className="animate-cursor-blink border-r-2 border-rust ml-1">|</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-taupe dark:text-beige font-mono max-w-2xl">
            Advanced ML-powered Android security and performance analysis system
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="relative overflow-hidden rounded-xl border border-sage-dark/20 bg-sage/50 dark:bg-taupe/50 backdrop-blur-sm transition-all hover:shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-mono font-semibold mb-4 text-rust dark:text-rust-light">
                  Optimization_
                </h3>
                <p className="text-taupe dark:text-beige font-mono">
                  Advanced system optimization for Android devices, enhancing performance and security.
                </p>
                <Button 
                  onClick={() => navigate('/optimize')}
                  className="w-full mt-4 bg-rust hover:bg-rust-dark text-beige font-mono"
                >
                  Start Optimization_
                </Button>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl border border-sage-dark/20 bg-sage/50 dark:bg-taupe/50 backdrop-blur-sm transition-all hover:shadow-lg">
              <div className="p-6">
                <h3 className="text-xl font-mono font-semibold mb-4 text-rust dark:text-rust-light">
                  Scanning_
                </h3>
                <p className="text-taupe dark:text-beige font-mono">
                  Comprehensive malware detection for both URLs and files with real-time analysis.
                </p>
                <Button 
                  onClick={() => navigate('/scan')}
                  className="w-full mt-4 bg-rust hover:bg-rust-dark text-beige font-mono"
                >
                  Start Scanning_
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;