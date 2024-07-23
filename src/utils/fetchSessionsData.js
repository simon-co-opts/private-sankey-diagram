export async function fetchSessionsData() {
    try {
      const response = await fetch('/data/sessionsList.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const sessionFiles = await response.json();
  
      const sessionDataPromises = sessionFiles.map(async (file) => {
        try {
          const res = await fetch(`/data/${file}`);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          const jsonData = await res.json();
          return { fileName: file, data: jsonData };
        } catch (error) {
          console.error(`Error fetching data for ${file}:`, error.message);
          return { fileName: file, data: null };
        }
      });
  
      const allData = await Promise.all(sessionDataPromises);
      return allData;
    } catch (error) {
      console.error('Error fetching data:', error.message);
      throw error;
    }
  }
  