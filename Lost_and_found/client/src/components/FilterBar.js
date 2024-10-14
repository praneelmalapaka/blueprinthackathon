import React, { useState } from 'react';

function FilterBar({ onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    onFilter(searchTerm);
  };

  return (
    <div className="filter-bar-container">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search for items..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default FilterBar;
