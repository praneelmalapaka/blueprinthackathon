import React, { useState } from 'react';

function FilterBar({ onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    byName: true,
    byLocation: false,
    byDescription: false
  });
  const [dateRange, setDateRange] = useState({
    fromDate: '',
    toDate: ''
  });

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFilters({
      ...filters,
      [name]: checked
    });
  };

  // Handle date range changes
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const handleSearch = () => {
    onFilter(searchTerm, filters, dateRange);
  };

  return (
    <div className="filter-bar-container" style={styles.container}>
      {/* Search Bar */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for items..."
          style={styles.searchInput}
        />
      </div>

      {/* Checkboxes */}
      <div style={styles.checkboxContainer}>
        <label style={styles.label}>
          <input
            type="checkbox"
            name="byName"
            checked={filters.byName}
            onChange={handleCheckboxChange}
            style={styles.checkbox}
          />
          Name
        </label>
        <label style={styles.label}>
          <input
            type="checkbox"
            name="byLocation"
            checked={filters.byLocation}
            onChange={handleCheckboxChange}
            style={styles.checkbox}
          />
          Location
        </label>
        <label style={styles.label}>
          <input
            type="checkbox"
            name="byDescription"
            checked={filters.byDescription}
            onChange={handleCheckboxChange}
            style={styles.checkbox}
          />
          Description
        </label>
      </div>

      {/* Date Range */}
      <div style={styles.dateContainer}>
        <label style={styles.dateLabel}>
          From:
          <input
            type="date"
            name="fromDate"
            value={dateRange.fromDate}
            onChange={handleDateChange}
            style={styles.dateInput}
          />
        </label>
        <label style={styles.dateLabel}>
          To:
          <input
            type="date"
            name="toDate"
            value={dateRange.toDate}
            onChange={handleDateChange}
            style={styles.dateInput}
          />
        </label>
      </div>

      {/* Search Button */}
      <button onClick={handleSearch} style={styles.searchButton}>Search</button>
    </div>
  );
}

// Inline styles for the components
const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gridGap: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    marginBottom: '20px',
    width: '100%'
  },
  searchContainer: {
    gridColumn: '1 / span 2',
    marginBottom: '10px'
  },
  searchInput: {
    width: '98.5%',  // Reduce search bar to 3/4 of its original width
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  checkboxContainer: {
    display: 'inline',
    gap: '15px',  // Add space between checkbox pairs
    marginBottom: '10px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  checkbox: {
    marginRight: '0px',  // Close the gap between checkbox and label
  },
  dateContainer: {
    display: 'flex',
    gap: '10px',  // Reduced gap between "From" and "To"
    alignItems: 'center',
    gridColumn: '1 / span 2',
  },
  dateLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
  },
  dateInput: {
    marginLeft: '5px',
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  searchButton: {
    padding: '10px 15px',  // Adjust the button size
    backgroundColor: '#007BFF',
    color: '#fff',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    justifySelf: 'end',  // Align to the end of the row
    marginRight: '1%',  // Move search button slightly to the left
  }
};

export default FilterBar;
