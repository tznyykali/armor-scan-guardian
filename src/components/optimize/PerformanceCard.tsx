interface PerformanceProps {
  beforeOptimization: number;
  afterOptimization: number;
}

const PerformanceCard = ({ beforeOptimization, afterOptimization }: PerformanceProps) => {
  return (
    <div className="bg-cyber-DEFAULT/30 rounded-lg p-4 space-y-4">
      <h3 className="font-medium text-lg">Performance Analysis</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-foreground/60">Before Optimization</p>
          <p className="font-medium">{beforeOptimization}%</p>
        </div>
        <div>
          <p className="text-sm text-foreground/60">After Optimization</p>
          <p className="font-medium">{afterOptimization}%</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceCard;