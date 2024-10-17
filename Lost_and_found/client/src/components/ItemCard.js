import React from 'react';

function ItemCard({ title, image, location, date }) {
  return (
    <div className="item-card" style={{ border: '1px solid black', padding: '20px', width: '250px' }}>
      <img
        src={image || 'https://via.placeholder.com/150'}  // Placeholder if image not available
        alt={title}
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}  // Larger image
      />
      <h3>{title}</h3>  {/* Make sure 'title' is displayed */}
      <p>{location}</p>
      <p>{date}</p>
    </div>
  );
}

export default ItemCard;
