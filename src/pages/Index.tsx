import NetworkBackground from "@/components/NetworkBackground";
import { Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen pt-16">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8">
          <Shield className="w-24 h-24 text-forest-DEFAULT dark:text-caramel-DEFAULT animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-bold text-forest-DEFAULT dark:text-caramel-DEFAULT">
            Secure Scan
          </h1>
          <p className="text-xl md:text-2xl text-smoke-DEFAULT dark:text-mist-DEFAULT max-w-2xl">
            Military-grade Android security and optimization system
          </p>
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="bg-mist-light/50 dark:bg-midnight-DEFAULT/50 backdrop-blur-lg rounded-lg p-6 border border-forest-DEFAULT/20">
              <h3 className="text-xl font-semibold mb-4 text-forest-DEFAULT dark:text-caramel-DEFAULT">Optimization</h3>
              <p className="text-smoke-DEFAULT dark:text-mist-DEFAULT">
                Advanced system optimization for Android devices, enhancing performance and security.
              </p>
            </div>
            <div className="bg-mist-light/50 dark:bg-midnight-DEFAULT/50 backdrop-blur-lg rounded-lg p-6 border border-forest-DEFAULT/20">
              <h3 className="text-xl font-semibold mb-4 text-forest-DEFAULT dark:text-caramel-DEFAULT">Scanning</h3>
              <p className="text-smoke-DEFAULT dark:text-mist-DEFAULT">
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