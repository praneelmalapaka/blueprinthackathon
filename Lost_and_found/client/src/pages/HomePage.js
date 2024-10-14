import React, { useState } from 'react';
import ItemGrid from '../components/ItemGrid';  // Go up one directory and into components
import FilterBar from '../components/FilterBar';

const sampleItems = [
  { title: 'Lost Wallet', image: 'https://via.placeholder.com/150', location: 'UNSW Library', date: '2 days ago' },
  { title: 'Found Phone', image: 'https://via.placeholder.com/150', location: 'UNSW Campus', date: '1 day ago' },
  { title: 'Lost Laptop', image: 'https://via.placeholder.com/150', location: 'Law Building', date: '5 hours ago' }
];

function HomePage() {
  const [filteredItems, setFilteredItems] = useState(sampleItems);

  const handleFilter = (searchTerm) => {
    const filtered = sampleItems.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  };

  console.log(filteredItems);  // Move the console.log outside of the return statement

  return (
    <div className="home-page">
      <FilterBar onFilter={handleFilter} />
      <ItemGrid items={filteredItems} />
    </div>
  );
}

export default HomePage;
