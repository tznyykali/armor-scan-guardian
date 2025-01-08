import NetworkBackground from "@/components/NetworkBackground";
import ScanSection from "@/components/ScanSection";

const Scan = () => {
  return (
    <div className="min-h-screen pt-16">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-safe-DEFAULT">
          Security Scanner
        </h2>
        <ScanSection />
      </div>
    </div>
  );
};

export default Scan;