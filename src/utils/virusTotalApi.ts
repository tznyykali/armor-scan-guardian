export const scanUrl = async (url: string) => {
  const apiKey = localStorage.getItem('VIRUSTOTAL_API_KEY');
  if (!apiKey) {
    throw new Error('VirusTotal API key not found');
  }

  try {
    // Submit URL for scanning
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

    const scanData = await scanResponse.json();
    const analysisId = scanData.data.id;

    // Poll for analysis results
    const getResults = async (): Promise<any> => {
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

      const analysisData = await analysisResponse.json();
      
      if (analysisData.data.attributes.status === 'completed') {
        // Extract detailed metadata and detection information
        const results = {
          ...analysisData.data.attributes,
          metadata: {
            engines_used: Object.keys(analysisData.data.attributes.results).length,
            analysis_date: new Date(analysisData.data.attributes.date * 1000).toISOString(),
            categories: analysisData.data.attributes.categories || {},
            threat_names: Object.values(analysisData.data.attributes.results)
              .map((result: any) => result.result)
              .filter(Boolean),
          },
          detection_details: Object.entries(analysisData.data.attributes.results)
            .filter(([_, result]: [string, any]) => result.result)
            .map(([engine, result]: [string, any]) => 
              `${engine}: ${result.result} (${result.method || 'unknown method'})`
            ),
        };
        return { data: { attributes: results } };
      }

      // If not completed, wait and try again
      await new Promise(resolve => setTimeout(resolve, 2000));
      return getResults();
    };

    return await getResults();
  } catch (error) {
    console.error('URL scan error:', error);
    throw error;
  }
};

export const scanFile = async (file: File) => {
  const apiKey = localStorage.getItem('VIRUSTOTAL_API_KEY');
  if (!apiKey) {
    throw new Error('VirusTotal API key not found');
  }

  try {
    // Get upload URL
    const urlResponse = await fetch('https://www.virustotal.com/api/v3/files/upload_url', {
      headers: {
        'x-apikey': apiKey,
      },
    });

    if (!urlResponse.ok) {
      throw new Error('Failed to get upload URL');
    }

    const { data: uploadUrl } = await urlResponse.json();

    // Upload file
    const formData = new FormData();
    formData.append('file', file);

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

    const uploadData = await uploadResponse.json();
    const analysisId = uploadData.data.id;

    // Poll for analysis results
    const getResults = async (): Promise<any> => {
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

      const analysisData = await analysisResponse.json();
      
      if (analysisData.data.attributes.status === 'completed') {
        // Extract detailed metadata and detection information
        const results = {
          ...analysisData.data.attributes,
          metadata: {
            file_info: {
              name: file.name,
              size: file.size,
              type: file.type,
            },
            engines_used: Object.keys(analysisData.data.attributes.results).length,
            analysis_date: new Date(analysisData.data.attributes.date * 1000).toISOString(),
            categories: analysisData.data.attributes.categories || {},
            threat_names: Object.values(analysisData.data.attributes.results)
              .map((result: any) => result.result)
              .filter(Boolean),
          },
          file_path: URL.createObjectURL(file),
          detection_details: Object.entries(analysisData.data.attributes.results)
            .filter(([_, result]: [string, any]) => result.result)
            .map(([engine, result]: [string, any]) => 
              `${engine}: ${result.result} (${result.method || 'unknown method'})`
            ),
        };
        return { data: { attributes: results } };
      }

      // If not completed, wait and try again
      await new Promise(resolve => setTimeout(resolve, 2000));
      return getResults();
    };

    return await getResults();
  } catch (error) {
    console.error('File scan error:', error);
    throw error;
  }
};
