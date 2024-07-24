import React, { useState, useEffect } from 'react';
import SankeyDiagram from './SankeyDiagram'; // Ensure correct path
import sessionsList from './data/sessionsList.json';

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [selectedSession, setSelectedSession] = useState('');
  const [filterType, setFilterType] = useState('default');
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
            fetch(`/data/${file}`)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              })
          );

          const dataArrays = await Promise.all(dataPromises);

          const wordFrequencyMap = {};

          dataArrays.forEach((data, index) => {
            if (data["word frequencies"]) {
              Object.entries(data["word frequencies"]).forEach(([word, frequency]) => {
                if (!wordFrequencyMap[word]) {
                  wordFrequencyMap[word] = 0;
                }
                wordFrequencyMap[word] += frequency;
              });
            } else {
              console.warn(`No word frequencies in file: ${sessionFiles[index]}`);
            }
          });

          const nodes = Object.keys(wordFrequencyMap).map(word => ({
            id: word,
            name: word,
          }));

          const links = Object.entries(wordFrequencyMap).map(([word, frequency]) => ({
            source: word,
            target: "Total", // Use a common target node to represent the total frequency
            value: frequency,
          }));

          setData({
            nodes: [...nodes, { id: "Total", name: "Total" }],
            links: links,
          });
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

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value);
  };

  const handleTopWordsChange = (event) => {
    setTopWords(Number(event.target.value));
  };

  return (
    <div className="App">
      <h1>Sankey Diagram</h1>
      <div className="filter-container">
        <select onChange={handleSessionChange} value={selectedSession}>
          <option value="">All Sessions</option>
          {sessionsList.map((session, index) => (
            <option key={index} value={session}>{session}</option>
          ))}
        </select>

        <select onChange={handleFilterTypeChange} value={filterType}>
          <option value="default">Select</option>
          <option value="type1">Words</option>
          <option value="type2">Utterances</option>
        </select>

        <input
          type="range"
          min="5"
          max="25"
          value={topWords}
          onChange={handleTopWordsChange}
        />
        <label>{topWords} Frequently Used Words </label>
      </div>
      <SankeyDiagram data={data} selectedSession={selectedSession} topWords={topWords} />
    </div>
  );
}

export default App;
