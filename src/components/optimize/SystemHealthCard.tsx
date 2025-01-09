import { Shield } from 'lucide-react';

interface SystemHealthProps {
  systemHealth: number;
  riskLevel: string;
  threatsFound: number;
  suspiciousPatterns: string[];
}

const SystemHealthCard = ({ systemHealth, riskLevel, threatsFound, suspiciousPatterns }: SystemHealthProps) => {
  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="bg-cyber-DEFAULT/30 rounded-lg p-4 space-y-4">
      <h3 className="font-medium text-lg">Security Analysis</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-foreground/60">System Health</p>
          <p className="font-medium">{systemHealth}%</p>
        </div>
        <div>
          <p className="text-sm text-foreground/60">Risk Level</p>
          <p className={`font-medium ${getRiskLevelColor(riskLevel)}`}>
            {riskLevel.toUpperCase()}
          </p>
        </div>
      </div>
      
      {threatsFound > 0 && (
        <div className="mt-2">
          <p className="text-sm font-medium text-red-500 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {threatsFound} threat(s) detected
          </p>
          <ul className="mt-2 space-y-1">
            {suspiciousPatterns.map((pattern, index) => (
              <li key={index} className="text-sm text-red-400">
                • {pattern}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SystemHealthCard;