import NetworkBackground from "@/components/NetworkBackground";
import OptimizeSection from "@/components/OptimizeSection";

const Optimize = () => {
  return (
    <div className="min-h-screen pt-16">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <OptimizeSection />
      </div>
    </div>
  );
};

export default Optimize;