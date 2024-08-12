import React, { useState, useEffect } from 'react';
import SankeyDiagram from './visualisation/SankeyDiagram'; // Ensure correct path
import sessionsList from './data/sessionsList.json'; // Ensure correct path

function App() {
  const [data, setData] = useState([]);
  const [selectedSession, setSelectedSession] = useState(''); // Default to empty string
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

  const handleSessionChange = (event) => {
    setSelectedSession(event.target.value);
  };

  const handleTopWordsChange = (event) => {
    setTopWords(Number(event.target.value));
  };

  const getRecentSessions = () => {
    const recent = sessionsList.slice(-4); // Get the last 4 sessions
    const previous = sessionsList.slice(-8, -4); // Get the 4 sessions before the recent ones
    return [...previous, ...recent].reverse(); // Reverse to keep the order correct
  };

  const filterData = (data, selectedSession, topWords) => {
    if (!data) return [];

    const recentSessions = getRecentSessions();
    const recentSessionNames = recentSessions.reverse(); // Reverse to show recent sessions at the top

    if (!selectedSession) {
      return data.filter(d => recentSessionNames.includes(d.sessionName)).map(sessionData => {
        const filteredWords = sessionData.wordFrequencies
          .sort((a, b) => b.value - a.value)
          .slice(0, topWords)
          .map((item, index) => ({ ...item, index }));

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
      .slice(0, topWords)
      .map((item, index) => ({ ...item, index }));

    return [{
      ...sessionData,
      wordFrequencies: filteredWords
    }];
  };

  // Get the most recent 4 sessions
  const recentSessions = getRecentSessions();

  const filteredData = filterData(data, selectedSession, topWords);

  return (
    <div className="App">
      <h1>Sankey Diagram</h1>
      <div className="filter-container">
        <label htmlFor="session-select">Recent and Previous Sessions </label>
        <select
          id="session-select"
          value={selectedSession}
          onChange={handleSessionChange}
        >
          <option value="">All Sessions</option>
          {recentSessions.map((session, index) => (
            <option key={index} value={session}>
              {`Session ${sessionsList.length - 7 + index}`}
            </option>
          ))}
        </select>

        <label htmlFor="top-words-range">Top Words: </label>
        <input
          id="top-words-range"
          type="range"
          min="5"
          max="25"
          value={topWords}
          onChange={handleTopWordsChange}
        />
        <span>{topWords} Frequently Used Words</span>
      </div>
      {data.length > 0 ? <SankeyDiagram sessions={filteredData} /> : <p>Loading...</p>}
    </div>
  );
}

export default App;
