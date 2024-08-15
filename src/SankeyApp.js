import React, { useState, useEffect } from 'react';
import SankeyDiagram from './visualisation/SankeyDiagram'; // Import the SankeyDiagram component (Ensure the correct path)
import sessionsList from './data/sessionsList.json'; // Import the list of session files (Ensure the correct path)

function App() {
  // State to hold the session data and the number of top words to display
  const [data, setData] = useState([]);
  const [topWords, setTopWords] = useState(5); // Default number of top words is 5

  // Effect hook to load session data when the component mounts
  useEffect(() => {
    const loadSessionData = async () => {
      try {
        // Function to fetch data for each session file
        const fetchData = async () => {
          // Create an array of promises to fetch each session file
          const dataPromises = sessionsList.map(file =>
            fetch(`testData/${file}`) // Fetch each file from the testData directory
              .then(response => {
                // Check if the response is okay (status code 200-299)
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Parse the JSON data
              })
          );

          // Wait for all fetch promises to resolve
          const dataArrays = await Promise.all(dataPromises);

          // Map the fetched data to a format suitable for the Sankey diagram
          const wordFrequencyMap = dataArrays.map((data, index) => ({
            sessionName: sessionsList[index], // Associate each data array with its session name
            wordFrequencies: data["word frequencies"] || [] // Extract word frequencies or provide an empty array if not present
          }));

          console.log('Fetched Data:', wordFrequencyMap); // Log the fetched data for debugging

          setData(wordFrequencyMap); // Update the state with the fetched data
        };

        fetchData(); // Invoke the fetchData function to start the data fetching process
      } catch (error) {
        // Log any errors encountered during the data fetching process
        console.error('Error fetching JSON data:', error);
      }
    };

    loadSessionData(); // Call the loadSessionData function to initiate data loading when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once

  // Handler to update the number of top words when the slider changes
  const handleTopWordsChange = (event) => {
    setTopWords(Number(event.target.value)); // Update the topWords state with the new value
  };

  // Function to retrieve the most recent and previous sessions
  const getRecentSessions = () => {
    const recent = sessionsList.slice(-4); // Get the last 4 sessions from the list
    const previous = sessionsList.slice(-8, -4); // Get the 4 sessions before the recent ones
    return [...previous, ...recent].reverse(); // Combine and reverse the order to maintain chronological order
  };

  // Function to filter the session data based on the number of top words
  const filterData = (data, topWords) => {
    if (!data) return [];

    const recentSessions = getRecentSessions(); // Get the most recent sessions
    const recentSessionNames = recentSessions.reverse(); // Reverse the session order

    return data
      .filter(d => recentSessionNames.includes(d.sessionName)) // Filter data to include only the recent sessions
      .map(sessionData => {
        const filteredWords = sessionData.wordFrequencies
          .slice(0, topWords)  // Select the top N words (assumed to be pre-sorted)
          .map((item, index) => ({ ...item, index })); // Add an index property to each word

        return {
          ...sessionData, // Spread the original session data
          wordFrequencies: filteredWords // Replace word frequencies with the filtered top N words
        };
      });
  };

  const recentSessions = getRecentSessions(); // Get the recent sessions (called outside to avoid repeated calculations)
  const filteredData = filterData(data, topWords); // Filter the data based on the selected number of top words

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px'}}> {/* Center-align content with margin */}
      <h1>Sankey Diagram</h1>
      <div className="filter-container" style={{ margin: '20px 0' }}> {/* Container for the top words slider */}
        <label htmlFor="top-words-range" style={{ display: 'block', marginBottom: '10px' }}>
          {/* Label for the top words range input (currently commented out) */}
        </label>
        <input
          id="top-words-range"
          type="range"
          min="5"
          max="25"
          value={topWords}
          onChange={handleTopWordsChange}
          style={{ width: '80%', maxWidth: '400px', margin: '0 auto', display: 'block' }} // Style the range input for centring
        />
        <span>{topWords} Frequently Used Words</span> {/* Display the current number of top words */}
      </div>
      {filteredData.length > 0 ? (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}> {/* Adjust vertical spacing around the Sankey diagram */}
          <SankeyDiagram sessions={filteredData} topWords={topWords} /> {/* Render the Sankey diagram with filtered data */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App; // Export the App component as the default export
