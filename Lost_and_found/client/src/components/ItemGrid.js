import React from 'react';
import { Link } from 'react-router-dom';

function ItemGrid({ items }) {
  if (items.length === 0) {
    return <p>No items found. Try searching again.</p>;
  }

  return (
    <div
      className="item-grid"
      style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '20px',
        padding: '10px'
      }}
    >
      {items.map(item => (
        <div key={item.id}>
          {console.log(item)} 
          <Link to={`/item/${item.id}`}>  
            <div className="item-card">
              <img 
                src={item.image || 'https://via.placeholder.com/150'} 
                alt={item.title} 
                style={{ width: '100%', height: '150px', objectFit: 'cover' }} 
              />
              <h3>{item.title}</h3>
              <p>{item.location}</p>
              <p>{item.date}</p>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ItemGrid;