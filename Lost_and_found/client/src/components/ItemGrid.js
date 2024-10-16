import React from 'react';
import ItemCard from './ItemCard';

function ItemGrid({ items }) {
  if (items.length === 0) {
    return <p>No items found. Try searching again.</p>;  // Handle empty results
  }

  return (
    <div
      className="item-grid"
      style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',  // Adjusted for bigger cards
        gap: '20px',
        padding: '10px'
      }}
    >
      {items.map((item, index) => (
        <ItemCard
          key={index}
          title={item.title}  // Ensure 'title' is passed
          image={item.image ? item.image : 'https://via.placeholder.com/150'}  // Use placeholder if no image
          location={item.location}
          date={item.date}
        />
      ))}
    </div>
  );
}

export default ItemGrid;
