import React from 'react';
import { Shield, Package } from 'lucide-react';

interface AppInfo {
  name: string;
  packageName: string;
  version: string;
  installDate: string;
  size: number;
  permissions: string[];
  riskLevel: string;
}

interface InstalledAppsCardProps {
  apps: AppInfo[];
}

const InstalledAppsCard = ({ apps }: InstalledAppsCardProps) => {
  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
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

  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <div className="bg-cyber-DEFAULT/30 rounded-lg p-4 space-y-4">
      <h3 className="font-medium text-lg flex items-center gap-2">
        <Package className="w-5 h-5" />
        Installed Applications
      </h3>
      <div className="space-y-4">
        {apps.map((app, index) => (
          <div key={index} className="bg-cyber-DEFAULT/20 rounded-lg p-3 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{app.name}</h4>
                <p className="text-sm text-foreground/60">{app.packageName}</p>
              </div>
              <span className={`text-sm px-2 py-1 rounded-full ${getRiskLevelColor(app.riskLevel)} bg-opacity-10`}>
                {app.riskLevel.toUpperCase()} Risk
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-foreground/60">Version:</span> {app.version}
              </div>
              <div>
                <span className="text-foreground/60">Size:</span> {formatSize(app.size)}
              </div>
            </div>
            {app.permissions.length > 0 && (
              <div className="text-sm">
                <span className="text-foreground/60">Key Permissions:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {app.permissions.map((permission, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-cyber-DEFAULT/30 rounded-full text-xs"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstalledAppsCard;