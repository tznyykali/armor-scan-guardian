import React from 'react';
import NetworkBackground from "@/components/NetworkBackground";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ScanResult {
  id: string;
  type: 'url' | 'file';
  target: string;
  status: 'clean' | 'infected';
  timestamp: string;
  threatLevel?: 'low' | 'medium' | 'high';
}

// Mock data - replace with actual API call
const fetchResults = async (): Promise<ScanResult[]> => {
  return [
    { id: '1', type: 'url', target: 'example.com', status: 'clean', timestamp: new Date().toISOString() },
    { id: '2', type: 'file', target: 'document.pdf', status: 'infected', timestamp: new Date().toISOString(), threatLevel: 'high' },
  ];
};

const Results = () => {
  const { data: results, isLoading } = useQuery({
    queryKey: ['scanResults'],
    queryFn: fetchResults,
  });

  const chartData = [
    { name: 'Clean', value: results?.filter(r => r.status === 'clean').length || 0 },
    { name: 'Infected', value: results?.filter(r => r.status === 'infected').length || 0 },
  ];

  return (
    <div className="min-h-screen pt-16">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-caramel-DEFAULT dark:text-forest-DEFAULT">
          Scan Results
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-mist-light/50 dark:bg-midnight-DEFAULT/50 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-4">Statistics</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2D6A4F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 bg-mist-light/50 dark:bg-midnight-DEFAULT/50 backdrop-blur-lg">
            <h3 className="text-xl font-semibold mb-4">Recent Scans</h3>
            {isLoading ? (
              <p>Loading results...</p>
            ) : (
              <div className="space-y-4">
                {results?.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 rounded-lg bg-background/50 border border-border"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{result.target}</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        result.status === 'clean' 
                          ? 'bg-forest-light/20 text-forest-DEFAULT' 
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {result.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      <span>{new Date(result.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Results;