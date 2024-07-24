import React from "react";

function FilterComponent({ sessions, selectedSession, onSessionChange, filterType, onFilterTypeChange, topWords, onTopWordsChange }) {
  return (
    <div className="filter-component">
      <select onChange={(e) => onSessionChange(e.target.value)} value={selectedSession || ""}>
        <option value="">All Sessions</option>
        {sessions.map((session, index) => (
          <option key={index} value={session}>{session}</option>
        ))}
      </select>

      <select onChange={(e) => onFilterTypeChange(e.target.value)} value={filterType}>
        <option value="default">Default</option>
        <option value="type1">Type 1</option>
        <option value="type2">Type 2</option>
      </select>

      <input
        type="range"
        min="5"
        max="25"
        value={topWords}
        onChange={(e) => onTopWordsChange(Number(e.target.value))}
      />
      <label>{topWords} Words</label>
    </div>
  );
}

export default FilterComponent;
