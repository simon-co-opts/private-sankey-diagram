import React, { useState, useEffect } from 'react';
import SankeyDiagram from './visualisation/SankeyDiagram'; // Ensure correct path
import sessionsList from './data/sessionsList.json'; // Ensure correct path

function App() {
  const [data, setData] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [topWords, setTopWords] = useState(5);

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        // Fetch data for each session
        const fetchData = async () => {
          // Map session files to their fetch requests
          const dataPromises = sessionsList.map(file =>
            fetch(`testData/${file}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
          );

          // Await all the fetch requests
          const dataArrays = await Promise.all(dataPromises);

          // Transform data into the desired format
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

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  const handleTopWordsChange = (event) => {
    setTopWords(Number(event.target.value));
  };

  const filterData = (data, selectedSession, topWords) => {
    if (!data) return [];

    if (!selectedSession) {
      return data.map(sessionData => {
        const filteredWords = sessionData.wordFrequencies
          .sort((a, b) => b.value - a.value)
          .slice(0, topWords);

        return {
          ...sessionData,
          wordFrequencies: filteredWords
        };
      });
    }

    const sessionData = data.find(d => d.sessionName === selectedSession);
    if (!sessionData) return [];

    const filteredWords = sessionData.wordFrequencies
      .sort((a, b) => b.value - a.value)
      .slice(0, topWords);

    return [{
      ...sessionData,
      wordFrequencies: filteredWords
    }];
  };

  const filteredData = filterData(data, selectedSession, topWords);

  return (
    <div className="App">
      <h1>Sankey Diagram</h1>
      <div className="filter-container">
        <select onChange={handleSessionChange}>
          <option value="">All Sessions</option>
          {sessionsList.map((session, index) => (
            <option key={index} value={session}>{session}</option>
          ))}
        </select>

        <input
          type="range"
          min="5"
          max="25"
          value={topWords}
          onChange={handleTopWordsChange}
        />
        <label>{topWords} Frequently Used Words</label>
      </div>
      {data.length > 0 ? <SankeyDiagram sessions={filteredData} /> : <p>Loading...</p>}
    </div>
  );
}

export default App;
