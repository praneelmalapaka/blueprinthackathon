import React from 'react';

function ItemCard({ title, image, location, date }) {
  return (
    <div className="item-card" style={{ border: '1px solid black', padding: '10px', width: '150px' }}>
      <img
        src={image || 'https://via.placeholder.com/150'}  // Placeholder if image not available
        alt={title}
        style={{ width: '100%', height: '100px', objectFit: 'cover' }}  // Properly resize the image
      />
      <h3>{title}</h3>
      <p>{location}</p>
      <p>{date}</p>
    </div>
  );
}

export default ItemCard;
