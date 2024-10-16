import React, { useEffect, useState } from 'react';
import ItemGrid from '../components/ItemGrid';  // Go up one directory and into components
import FilterBar from '../components/FilterBar';

function HomePage() {
  const [items, setItems] = useState([]);  // Set initial state to empty array
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);      // Track error state

  // Fetch the lost items from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:5001/api/lost-items')  // Adjust the URL to your Flask API
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setItems(data);  // Set the fetched items in the state
        setFilteredItems(data);  // By default, display all items
        setLoading(false);  // Data has been loaded
      })
      .catch(error => {
        console.error('Error fetching lost items:', error);
        setError(error);  // Set the error state
        setLoading(false);  // Loading is complete, even in case of error
      });
  }, []);  // The empty array ensures this runs only once when the component mounts

  // Function to filter items based on search terms, selected fields, and date range
  const handleFilter = (searchTerm, filters, dateRange) => {
    const { byName, byLocation, byDescription } = filters;
    const { fromDate, toDate } = dateRange;

    const filtered = items.filter(item => {
      // Check if the item matches the search term in the selected fields
      const matchesField = (
        (byName && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (byLocation && item.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (byDescription && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );

      // Check if the item's date is within the selected range
      const itemDate = new Date(item.date);
      const withinDateRange = (!fromDate || itemDate >= new Date(fromDate)) && (!toDate || itemDate <= new Date(toDate));

      return matchesField && withinDateRange;
    });

    setFilteredItems(filtered);
  };

  // Render different content based on loading or error states
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="home-page">
      <FilterBar onFilter={handleFilter} />
      <ItemGrid items={filteredItems} />
    </div>
  );
}

export default HomePage;
