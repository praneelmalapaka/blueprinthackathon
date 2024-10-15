import React, { useEffect, useState } from 'react';
import ItemGrid from '../components/ItemGrid';  // Go up one directory and into components
import FilterBar from '../components/FilterBar';

function HomePage() {
  const [items, setItems] = useState([]);  // Set initial state to empty array
  const [filteredItems, setFilteredItems] = useState([]);

  // Fetch the lost items from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5001/api/lost-items')  // Adjust the URL to your Flask API
      .then(response => response.json())
      .then(data => {
        setItems(data);  // Set the fetched items in the state
        setFilteredItems(data);  // By default, display all items
      })
      .catch(error => console.error('Error fetching lost items:', error));
  }, []);  // The empty array ensures this runs only once when the component mounts

  // Function to filter items based on the search term
  const handleFilter = (searchTerm) => {
    const filtered = items.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  return (
    <div className="home-page">
      <FilterBar onFilter={handleFilter} />
      <ItemGrid items={filteredItems} />
    </div>
  );
}

export default HomePage;
