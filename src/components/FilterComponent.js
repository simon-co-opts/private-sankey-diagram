import React, { useState } from 'react';

const FilterComponent = ({ 
  data, 
  selectedSessions, 
  setSelectedSessions, 
  speakerFilter, 
  setSpeakerFilter,
  topWords,
  setTopWords
}) => {
  const [speaker1, setSpeaker1] = useState('Patient');
  const [speaker2, setSpeaker2] = useState('Clinician');

  const handleSessionSelect = (sessionIndex) => {
    setSelectedSessions(prevSelected => {
      if (prevSelected.includes(sessionIndex)) {
        return prevSelected.filter(index => index !== sessionIndex);
      } else if (prevSelected.length < 4) {
        return [...prevSelected, sessionIndex];
      }
      return prevSelected;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
      <div>
        <label>Speaker 1: </label>
        <input 
          type="text" 
          value={speaker1} 
          onChange={e => setSpeaker1(e.target.value)} 
        />
      </div>
      <div>
        <label>Speaker 2: </label>
        <input 
          type="text" 
          value={speaker2} 
          onChange={e => setSpeaker2(e.target.value)} 
        />
      </div>
      <div>
        <label>Speaker Filter: </label>
        <select value={speakerFilter} onChange={e => setSpeakerFilter(e.target.value)}>
          <option value="all">All</option>
          <option value={speaker1}>{speaker1}</option>
          <option value={speaker2}>{speaker2}</option>
        </select>
      </div>
      <div>
        <label>Select Sessions (up to 4): </label>
        {data && data.nodes && data.nodes.filter(node => node.session !== undefined).map((_, index) => (
          <label key={index}>
            <input
              type="checkbox"
              checked={selectedSessions.includes(index)}
              onChange={() => handleSessionSelect(index)}
              disabled={selectedSessions.length >= 4 && !selectedSessions.includes(index)}
            />
            Session {index + 1}
          </label>
        ))}
      </div>
      <div>
        <label>Top Words: {topWords}</label>
        <input 
          type="range" 
          min="5" 
          max="25" 
          value={topWords} 
          onChange={e => setTopWords(Number(e.target.value))} 
        />
      </div>
    </div>
  );
};

export default FilterComponent;
