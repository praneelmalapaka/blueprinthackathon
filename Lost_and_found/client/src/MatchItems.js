import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; 
import { Link } from 'react-router-dom';   


function MatchItems() {
  const [lostItems, setLostItems] = useState([]);
  const [foundItems, setFoundItems] = useState([]);

  useEffect(() => {
    const fetchLostItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "lost_items"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLostItems(items);
      } catch (error) {
        console.error("Error fetching lost items:", error);
      }
    };

    const fetchFoundItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "found_items"));
        const items = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFoundItems(items);
      } catch (error) {
        console.error("Error fetching found items:", error);
      }
    };

    fetchLostItems();
    fetchFoundItems();
  }, []);

  // ... (Implement your matching logic here to compare lostItems and foundItems)

  return (
    <div>
      <h2>Potential Matches</h2>

      {/* Display lost items */}
      <h3>Lost Items</h3>
      <ul>
        {lostItems.map((item) => (
          <li key={item.id}>
            <Link to={`/item/${item.id}`}>{item.itemName}</Link> 
            {/* Link to ItemView */}
          </li>
        ))}
      </ul>

      {/* Display found items */}
      <h3>Found Items</h3>
      <ul>
        {foundItems.map((item) => (
          <li key={item.id}>
            <Link to={`/item/${item.id}`}>{item.itemName}</Link> 
            {/* Link to ItemView */}
          </li>
        ))}
      </ul>

      {/* ... (Display the results of your matching logic here) */}
    </div>
  );
}

export default MatchItems;