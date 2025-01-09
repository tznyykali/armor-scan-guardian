interface ResourcePatterns {
  cpu: string;
  memory: string;
  battery: string;
  storage: string;
}

interface ResourceUsageProps {
  patterns: ResourcePatterns;
}

const ResourceUsageCard = ({ patterns }: ResourceUsageProps) => {
  const getResourceStatusColor = (status: string) => {
    switch (status) {
      case 'high':
      case 'critical':
        return 'text-red-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'low':
      case 'good':
        return 'text-green-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="bg-cyber-DEFAULT/30 rounded-lg p-4 space-y-4">
      <h3 className="font-medium text-lg">Resource Usage</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-foreground/60">CPU Usage</p>
          <p className={`font-medium ${getResourceStatusColor(patterns.cpu)}`}>
            {patterns.cpu.toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground/60">Memory Usage</p>
          <p className={`font-medium ${getResourceStatusColor(patterns.memory)}`}>
            {patterns.memory.toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground/60">Battery Status</p>
          <p className={`font-medium ${getResourceStatusColor(patterns.battery)}`}>
            {patterns.battery.toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-sm text-foreground/60">Storage Usage</p>
          <p className={`font-medium ${getResourceStatusColor(patterns.storage)}`}>
            {patterns.storage.toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourceUsageCard;