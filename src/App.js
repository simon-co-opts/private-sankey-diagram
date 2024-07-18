import React from 'react';
import SankeyDiagram from './SankeyDiagram';

const sampleData = {
  nodes: [
    { name: "Patient" },
    { name: "Clinician" },
    { name: "Session 1" },
    { name: "Session 2" },
    { name: "Anxiety" },
    { name: "Depression" },
    { name: "Treatment" }
  ],
  links: [
    { source: 0, target: 2, value: 10 },
    { source: 1, target: 2, value: 8 },
    { source: 2, target: 4, value: 5 },
    { source: 2, target: 5, value: 3 },
    { source: 0, target: 3, value: 12 },
    { source: 1, target: 3, value: 10 },
    { source: 3, target: 4, value: 4 },
    { source: 3, target: 5, value: 2 },
    { source: 3, target: 6, value: 6 }
  ]
};

function App() {
  return (
    <div className="App">
      <h1>Sankey Diagram</h1>
      <SankeyDiagram data={sampleData} />
    </div>
  );
}

export default App;