import React, { useEffect, useState } from 'react';
import NetworkBackground from "@/components/NetworkBackground";
import ScanResultCard from "@/components/ScanResultCard";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Results = () => {
  const { toast } = useToast();
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScanHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('scan_history')
          .select('*')
          .order('scan_timestamp', { ascending: false });

        if (error) throw error;
        setScanHistory(data || []);
      } catch (error) {
        console.error('Error fetching scan history:', error);
        toast({
          title: "Error",
          description: "Failed to load scan results",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScanHistory();
  }, [toast]);

  return (
    <div className="min-h-screen pt-16">
      <NetworkBackground />
      <div className="relative container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-caramel-DEFAULT dark:text-forest-DEFAULT">
          Scan Results
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {loading ? (
            <div className="text-center text-muted-foreground">
              Loading scan results...
            </div>
          ) : scanHistory.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No scan results available
            </div>
          ) : (
            scanHistory.map((result: any) => (
              <ScanResultCard key={result.id} result={{
                id: result.id,
                type: result.scan_type,
                target: result.file_name,
                timestamp: result.scan_timestamp,
                results: {
                  status: result.scan_status,
                  metadata: {
                    engines_used: result.total_engines,
                    analysis_date: result.analysis_date,
                    file_info: {
                      type: result.file_type,
                      size: result.file_size,
                    }
                  }
                }
              }} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;