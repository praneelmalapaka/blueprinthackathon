import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/ItemPage.css';  // Import the CSS styles

function ItemPage() {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/lost-items/${itemId}`);
        if (response.ok) {
          const data = await response.json();
          setItem(data);
        } else {
          setError(new Error('Failed to fetch item details'));
        }
      } catch (error) {
        console.error('Error fetching item details:', error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItemDetails();
  }, [itemId]);

  if (isLoading) {
    return <div>Loading item details...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="item-page">
      <h2>{item.title}</h2>
      <div className="item-images">
        {item.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${item.title} - Image ${index + 1}`}
          />
        ))}
      </div>
      <p><b>Description:</b> {item.description}</p>
      <p><b>Location:</b> {item.location}</p>
      <p><b>Date Lost:</b> {item.date}</p>
    </div>
  );
}

export default ItemPage;
