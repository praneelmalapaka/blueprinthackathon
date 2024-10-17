import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ItemPage() {
  const { itemId } = useParams(); // Get the itemId from the URL
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`/api/lost-items/${itemId}`); // Fetch item details by ID
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        } else {
          // Handle error, e.g., show an error message
          console.error('Failed to fetch item details');
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItemDetails();
  }, [itemId]); // Run this effect whenever itemId changes

  if (!item) {
    return <div>Loading item details...</div>; // Or a loading spinner
  }

  return (
    <div className="item-page">
      <h2>{item.title}</h2>
      {/* Display multiple images if available */}
      <div className="item-images">
        {item.images.map((image, index) => (
          <img key={index} src={image} alt={`${item.title} - Image ${index + 1}`} />
        ))}
      </div>
      <p><b>Description:</b> {item.description}</p>
      <p><b>Location:</b> {item.location}</p>
      {/* ... display other item details like contact info, date lost/found ... */}
    </div>
  );
}

export default ItemPage;