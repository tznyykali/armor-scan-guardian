import { toast } from "@/hooks/use-toast";

interface ScanResponse {
  data: {
    id: string;
    type: string;
    links: {
      self: string;
    };
  };
}

interface AnalysisResult {
  data: {
    attributes: {
      status: string;
      stats: {
        harmless: number;
        malicious: number;
        suspicious: number;
        undetected: number;
        timeout: number;
      };
      results: {
        [key: string]: {
          category: string;
          engine_name: string;
          result: string | null;
        };
      };
    };
  };
}

export const scanUrl = async (url: string) => {
  try {
    const apiKey = localStorage.getItem('VIRUSTOTAL_API_KEY');
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please enter your VirusTotal API key in settings",
        variant: "destructive",
      });
      return null;
    }

    // First, submit the URL for scanning
    const scanResponse = await fetch('https://www.virustotal.com/api/v3/urls', {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `url=${encodeURIComponent(url)}`,
    });

    if (!scanResponse.ok) {
      throw new Error('Failed to submit URL for scanning');
    }

    const scanData: ScanResponse = await scanResponse.json();
    const analysisId = scanData.data.id;

    // Poll for analysis results
    const getResults = async (): Promise<AnalysisResult> => {
      const analysisResponse = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: {
            'x-apikey': apiKey,
          },
        }
      );

      if (!analysisResponse.ok) {
        throw new Error('Failed to fetch analysis results');
      }

      const analysisData: AnalysisResult = await analysisResponse.json();
      
      if (analysisData.data.attributes.status === 'completed') {
        return analysisData;
      }

      // If not completed, wait and try again
      await new Promise(resolve => setTimeout(resolve, 2000));
      return getResults();
    };

    return await getResults();
  } catch (error) {
    console.error('Scan error:', error);
    toast({
      title: "Scan Error",
      description: error instanceof Error ? error.message : "Failed to scan URL",
      variant: "destructive",
    });
    return null;
  }
};

export const scanFile = async (file: File) => {
  try {
    const apiKey = localStorage.getItem('VIRUSTOTAL_API_KEY');
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please enter your VirusTotal API key in settings",
        variant: "destructive",
      });
      return null;
    }

    // First, get upload URL
    const urlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
      headers: {
        'x-apikey': apiKey,
      },
    });

    if (!urlResponse.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { data: uploadUrl } = await urlResponse.json();

    // Prepare file upload
    const formData = new FormData();
    formData.append('file', file);

    // Upload file
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'x-apikey': apiKey,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }

    const uploadData: ScanResponse = await uploadResponse.json();
    const analysisId = uploadData.data.id;

    // Poll for analysis results
    const getResults = async (): Promise<AnalysisResult> => {
      const analysisResponse = await fetch(
        `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
        {
          headers: {
            'x-apikey': apiKey,
          },
        }
      );

      if (!analysisResponse.ok) {
        throw new Error('Failed to fetch analysis results');
      }

      const analysisData: AnalysisResult = await analysisResponse.json();
      
      if (analysisData.data.attributes.status === 'completed') {
        return analysisData;
      }

      // If not completed, wait and try again
      await new Promise(resolve => setTimeout(resolve, 2000));
      return getResults();
    };

    return await getResults();
  } catch (error) {
    console.error('Scan error:', error);
    toast({
      title: "Scan Error",
      description: error instanceof Error ? error.message : "Failed to scan file",
      variant: "destructive",
    });
    return null;
  }
};