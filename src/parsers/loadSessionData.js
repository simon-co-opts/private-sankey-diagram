// Function to load individual session data
export const loadSessionData = async (sessionFileName) => {
    try {
         // Construct the URL for the session file
        const response = await fetch(`${process.env.PUBLIC_URL}/${sessionFileName}`);
        
         // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Verify that the content type is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError(`Expected JSON but received: ${contentType}`);
        }

        // Parse and return the JSON data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error loading session data:', error.message);
        return null;
    }
};

// Function to load all sessions
export const loadAllSessions = async () => {
    try {

        // Fetch the list of session files
        const response = await fetch(`${process.env.PUBLIC_URL}/sessionsList.json`);
        
        // Check for HTTP errors
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

         // Verify that the content type is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new TypeError(`Expected JSON but received: ${contentType}`);
        }

        // Parse the list of session filenames
        const sessionsList = await response.json();
        
        // Fetch data for all session files concurrently
        const sessionDataPromises = sessionsList.map(sessionFile => loadSessionData(sessionFile));
        const sessionsData = await Promise.all(sessionDataPromises);

        // Filter out null values from failed loads
        const validSessionsData = sessionsData.filter(data => data !== null);

        return validSessionsData;

    } catch (error) {
        console.error("Error loading sessions:", error.message);
        return [];
    }
};
