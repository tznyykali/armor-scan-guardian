import React from 'react';

interface ScanStatsProps {
  stats: {
    harmless: number;
    malicious: number;
    suspicious: number;
    undetected: number;
  };
}

const ScanStats = ({ stats }: ScanStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-3 bg-white/50 dark:bg-midnight-light/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Harmless</p>
        <p className="text-xl font-semibold text-forest-DEFAULT">
          {stats.harmless}
        </p>
      </div>
      <div className="p-3 bg-white/50 dark:bg-midnight-light/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Malicious</p>
        <p className="text-xl font-semibold text-destructive">
          {stats.malicious}
        </p>
      </div>
      <div className="p-3 bg-white/50 dark:bg-midnight-light/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Suspicious</p>
        <p className="text-xl font-semibold text-amber-500">
          {stats.suspicious}
        </p>
      </div>
      <div className="p-3 bg-white/50 dark:bg-midnight-light/50 rounded-lg">
        <p className="text-sm text-muted-foreground">Undetected</p>
        <p className="text-xl font-semibold text-gray-500">
          {stats.undetected}
        </p>
      </div>
    </div>
  );
};

export default ScanStats;