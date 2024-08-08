import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SankeyDiagram from './visualisation/SankeyDiagram'; // Ensure correct path
import sessionsList from './data/sessionsList.json';

function App() {
  const [data, setData] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [topWords, setTopWords] = useState(5);

  useEffect(() => {
    const loadSessionData = async () => {
      try {
        const sessionFiles = sessionsList;

        if (!Array.isArray(sessionFiles) || sessionFiles.length === 0) {
          console.error('No files found in sessionsList');
          return;
        }

        const fetchData = async () => {
          const dataPromises = sessionFiles.map(file =>
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
            id: uuidv4(),
            sessionName: sessionFiles[index],
            wordFrequencies: data['word frequencies'].reduce((acc, item) => {
              acc[item.name1] = item.value;
              return acc;
            }, {})
          }));

          setData(wordFrequencyMap);
        };

        fetchData();
      } catch (error) {
        console.error('Error loading session data:', error);
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

  const filterData = (data) => {
    if (!data) return [];

    if (selectedSession) {
      const sessionData = data.find(d => d.sessionName === selectedSession);
      if (!sessionData) return [];
      const filteredWords = Object.entries(sessionData.wordFrequencies)
        .sort(([, a], [, b]) => b - a)
        .slice(0, topWords);
      return [{ ...sessionData, wordFrequencies: Object.fromEntries(filteredWords) }];
    }

    return data.map(sessionData => {
      const filteredWords = Object.entries(sessionData.wordFrequencies)
        .sort(([, a], [, b]) => b - a)
        .slice(0, topWords);
      return { ...sessionData, wordFrequencies: Object.fromEntries(filteredWords) };
    });
  };

  const filteredData = filterData(data);

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
      {data ? <SankeyDiagram data={filteredData} /> : <p>Loading...</p>}
    </div>
  );
}

export default App;
