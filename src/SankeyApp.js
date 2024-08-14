import React, { useState, useEffect } from 'react';
import SankeyDiagram from './visualisation/SankeyDiagram'; // Ensure the path is correct
import sessionsList from './data/sessionsList.json'; // Ensure the path is correct

function App() {
  const [data, setData] = useState([]);
  const [topWords, setTopWords] = useState(5); // Default top N words

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const fetchData = async () => {
          const dataPromises = sessionsList.map(file =>
            fetch(`testData/${file}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
          );

          const dataArrays = await Promise.all(dataPromises);

          const wordFrequencyMap = dataArrays.map((data, index) => ({
            sessionName: sessionsList[index],
            wordFrequencies: data["word frequencies"] || []
          }));

          console.log('Fetched Data:', wordFrequencyMap);

          setData(wordFrequencyMap);
        };

        fetchData();
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    loadSessionData();
  }, []);

  const handleTopWordsChange = (event) => {
    setTopWords(Number(event.target.value));
  };

  const getRecentSessions = () => {
    const recent = sessionsList.slice(-4); // Get the last 4 sessions
    const previous = sessionsList.slice(-8, -4); // Get the 4 sessions before the recent ones
    return [...previous, ...recent].reverse(); // Reverse to keep the order correct
  };

  const filterData = (data, topWords) => {
    if (!data) return [];

    const recentSessions = getRecentSessions();
    const recentSessionNames = recentSessions.reverse(); // Reverse to show recent sessions at the top

    return data
      .filter(d => recentSessionNames.includes(d.sessionName))
      .map(sessionData => {
        const filteredWords = sessionData.wordFrequencies
          .slice(0, topWords)  // Select top N words (already sorted in the original data)
          .map((item, index) => ({ ...item, index }));

        return {
          ...sessionData,
          wordFrequencies: filteredWords
        };
      });
  };

  const recentSessions = getRecentSessions();
  const filteredData = filterData(data, topWords);

  return (
    <div className="App" style={{ textAlign: 'center', marginTop: '50px'}}> {/* Center align content */}
      <h1>Sankey Diagram</h1>
      <div className="filter-container" style={{ margin: '20px 0' }}>
        <label htmlFor="top-words-range" style={{ display: 'block', marginBottom: '10px' }}>
          {/* Top Words: */}
        </label>
        <input
          id="top-words-range"
          type="range"
          min="5"
          max="25"
          value={topWords}
          onChange={handleTopWordsChange}
          style={{ width: '80%', maxWidth: '400px', margin: '0 auto', display: 'block' }} // Center slider
        />
        <span>{topWords} Frequently Used Words</span>
      </div>
      {filteredData.length > 0 ? (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}> {/* Adjust this value to move SankeyDiagram up or down */}
          <SankeyDiagram sessions={filteredData} topWords={topWords} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
