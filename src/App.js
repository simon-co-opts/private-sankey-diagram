import React, { useState, useEffect } from 'react';
import SankeyDiagram from './SankeyDiagram';
import sessionsList from './data/sessionsList.json';

console.log('sessionsList:', sessionsList);

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadSessionData = async () => {
      console.log('sessionsList:', sessionsList); // Verify the structure

      const sessionFiles = sessionsList; // This should be an array of filenames
      if (!Array.isArray(sessionFiles) || sessionFiles.length === 0) {
        console.error('No files found in sessionsList');
        return;
      }

      try {
        const fetchData = async () => {
          // Use sessionFiles array to fetch each file
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
          
          console.log('Fetched data:', dataArrays); // Debugging line

          // Initialize the mergedData object
          const mergedData = {
            nodes: [],
            links: []
          };

          dataArrays.forEach((data, index) => {
            console.log(`Processing file: ${sessionFiles[index]}`, data);
            
            if (data.utterances) {
              const nodes = data.utterances.map(utterance => ({
                id: utterance.index,
                name: utterance.text,
                start: utterance.start,
                end: utterance.end,
                speaker: utterance.speaker
              }));

              const links = data.utterances.flatMap(utterance => 
                utterance.words.map(word => ({
                  source: word.start,
                  target: word.end,
                  value: 1,
                  speaker: word.speaker
                }))
              );

              mergedData.nodes.push(...nodes);
              mergedData.links.push(...links);
            }else {
              console.warn(`No utterances in file: ${sessionFiles[index]}`);
            }
            if (data.words) {
              const wordsNodes = data.words.map(word => ({
                id: word.start,
                name: word.text,
                start: word.start,
                end: word.end,
                speaker: word.speaker
              }));

              const wordsLinks = data.words.map(word => ({
                source: word.start,
                target: word.end,
                value: 1,
                speaker: word.speaker
              }));

              mergedData.nodes.push(...wordsNodes);
              mergedData.links.push(...wordsLinks);
            }else {
              console.warn(`No words in file: ${sessionFiles[index]}`);
          };

          // Remove duplicate nodes based on id
          const uniqueNodes = Array.from(new Map(mergedData.nodes.map(node => [node.id, node])).values());
          const uniqueLinks = mergedData.links;

          setData({
            nodes: uniqueNodes,
            links: uniqueLinks
          });
        });
        fetchData();
      }} catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    };

    loadSessionData();
  }, []);

  return (
    <div className="App">
      <h1>Sankey Diagram</h1>
      {data ? <SankeyDiagram data={data} /> : <p>Loading...</p>}
    </div>
  );
}

export default App;
