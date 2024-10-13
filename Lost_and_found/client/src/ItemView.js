import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db, storage } from "./firebase"; 
import { useParams } from 'react-router-dom';
import { ref, getDownloadURL } from "firebase/storage";

function ItemView() {
  const { itemId } = useParams();
  const [itemData, setItemData] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const docRef = doc(db, "lost_items", itemId); // Assuming it's a lost item, adjust if needed
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setItemData(data);

          // Fetch image URLs from Firebase Storage
          const imageRefs = await Promise.all(
            data.images.map((imageName) => ref(storage, `lost_items/${itemId}/${imageName}`))
          );
          const imageUrls = await Promise.all(
            imageRefs.map((imageRef) => getDownloadURL(imageRef))
          );
          setImages(imageUrls);
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching item:", error);
      }
    };

    fetchItem();
  }, [itemId]);

  if (!itemData) {
    return <div>Loading item details...</div>;
  }

  return (
    <div>
      <h2>{itemData.itemName}</h2>
      <p>{itemData.description}</p>
      <p>Location: {itemData.location}</p>
      <p>Date Lost: {itemData.dateLost}</p> {/* Adjust if it's a found item */}
      <p>Contact Email: {itemData.email}</p>

      {images.length > 0 && (
        <div>
          <h3>Images:</h3>
          {images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Item ${index + 1}`} style={{ width: '200px', margin: '10px' }} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ItemView;