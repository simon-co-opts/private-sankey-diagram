import React, { useState } from 'react';

const FilterComponent = ({ data, setFilteredData }) => {
  const [speaker1, setSpeaker1] = useState('Patient');
  const [speaker2, setSpeaker2] = useState('Clinician');
  const [topWords, setTopWords] = useState(25);

  const applyFilters = () => {
    // Filter data logic here
    const filtered = { ...data }; // Replace with actual filtering logic
    setFilteredData(filtered);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <div>
        <label>Speaker A (Patient): </label>
        <input 
          type="text" 
          value={speaker1} 
          onChange={e => setSpeaker1(e.target.value)} 
        />
      </div>
      <div>
        <label>Speaker B (Clinician): </label>
        <input 
          type="text" 
          value={speaker2} 
          onChange={e => setSpeaker2(e.target.value)} 
        />
      </div>
      <div>
        <label>Top Words: {topWords}</label>
        <input 
          type="range" 
          min="5" 
          max="25" 
          value={topWords} 
          onChange={e => setTopWords(e.target.value)} 
        />
      </div>
      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

export default FilterComponent;
