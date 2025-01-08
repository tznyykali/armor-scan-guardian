import NetworkBackground from "@/components/NetworkBackground";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-16">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="relative">
            <Shield className="w-24 h-24 text-primary animate-pulse" />
            <div className="absolute inset-0 bg-primary/20 blur-3xl -z-10 rounded-full" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            Secure Scan
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Military-grade Android security and optimization system
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
            <div className="group relative overflow-hidden rounded-xl border bg-background/50 p-6 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-semibold mb-4 text-foreground">Optimization</h3>
              <p className="text-muted-foreground">
                Advanced system optimization for Android devices, enhancing performance and security.
              </p>
              <Button 
                variant="ghost" 
                className="mt-4 group-hover:text-primary"
                onClick={() => navigate('/optimize')}
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="group relative overflow-hidden rounded-xl border bg-background/50 p-6 backdrop-blur-sm transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h3 className="text-xl font-semibold mb-4 text-foreground">Scanning</h3>
              <p className="text-muted-foreground">
                Comprehensive malware detection for both URLs and files with real-time analysis.
              </p>
              <Button 
                variant="ghost" 
                className="mt-4 group-hover:text-primary"
                onClick={() => navigate('/scan')}
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              size="lg"
              onClick={() => navigate('/optimize')}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start Optimization
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/scan')}
              className="border-primary/20 hover:bg-primary/5"
            >
              Scan Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;