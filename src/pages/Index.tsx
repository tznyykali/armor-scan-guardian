import NetworkBackground from "@/components/NetworkBackground";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen pt-16">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <Shield className="w-24 h-24 text-safe-DEFAULT animate-pulse-slow" />
          <h1 className="text-4xl md:text-6xl font-bold text-safe-DEFAULT">
            SecureGuard
          </h1>
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl">
            Military-grade Android security and optimization system
          </p>
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="bg-cyber-muted/50 backdrop-blur-lg rounded-lg p-6 border border-cyber-accent/20">
              <h3 className="text-xl font-semibold mb-4">Optimization</h3>
              <p className="text-foreground/60">
                Advanced system optimization for Android devices, enhancing performance and security.
              </p>
            </div>
            <div className="bg-cyber-muted/50 backdrop-blur-lg rounded-lg p-6 border border-cyber-accent/20">
              <h3 className="text-xl font-semibold mb-4">Scanning</h3>
              <p className="text-foreground/60">
                Comprehensive malware detection for both URLs and files with real-time analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;