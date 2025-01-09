import NetworkBackground from "@/components/NetworkBackground";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16 bg-beige dark:bg-taupe-dark">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="relative">
            <Shield className="w-24 h-24 text-rust dark:text-rust-light animate-pulse" />
            <div className="absolute inset-0 bg-rust/20 blur-3xl -z-10 rounded-full" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-mono font-bold text-rust dark:text-rust-light typing-text">
            Secure Scan_
          </h1>
          
          <p className="text-xl md:text-2xl text-taupe dark:text-beige font-mono max-w-2xl">
            Military-grade Android security and optimization system
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="group relative overflow-hidden rounded-xl border border-sage-dark/20 bg-sage/50 dark:bg-taupe/50 backdrop-blur-sm transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-rust/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6">
                <h3 className="text-xl font-mono font-semibold mb-4 text-rust dark:text-rust-light">
                  Optimization_
                </h3>
                <p className="text-taupe dark:text-beige font-mono">
                  Advanced system optimization for Android devices, enhancing performance and security.
                </p>
                <Button 
                  variant="ghost" 
                  className="mt-4 font-mono text-rust hover:text-rust-dark dark:text-rust-light dark:hover:text-rust group-hover:bg-rust/5"
                  onClick={() => navigate('/optimize')}
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl border border-sage-dark/20 bg-sage/50 dark:bg-taupe/50 backdrop-blur-sm transition-all hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-rust/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6">
                <h3 className="text-xl font-mono font-semibold mb-4 text-rust dark:text-rust-light">
                  Scanning_
                </h3>
                <p className="text-taupe dark:text-beige font-mono">
                  Comprehensive malware detection for both URLs and files with real-time analysis.
                </p>
                <Button 
                  variant="ghost" 
                  className="mt-4 font-mono text-rust hover:text-rust-dark dark:text-rust-light dark:hover:text-rust group-hover:bg-rust/5"
                  onClick={() => navigate('/scan')}
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              size="lg"
              onClick={() => navigate('/optimize')}
              className="bg-rust hover:bg-rust-dark text-beige font-mono dark:bg-rust-light dark:hover:bg-rust"
            >
              Start Optimization_
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/scan')}
              className="border-rust/20 hover:bg-rust/5 text-rust dark:text-rust-light font-mono"
            >
              Scan Now_
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;