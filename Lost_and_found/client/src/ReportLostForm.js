import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "./firebase"; 
import { ref, uploadBytes   
 } from "firebase/storage";

function ReportLostForm() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [images, setImages] = useState([]);
  const [email, setEmail] = useState("");

  const handleChange = (event) => {
    switch (event.target.name) {
      case "itemName":
        setItemName(event.target.value);
        break;
      case "description":
        setDescription(event.target.value);
        break;
      case "location":
        setLocation(event.target.value);
        break;
      case "dateLost":
        setDateLost(event.target.value);
        break;
      case "email":
        setEmail(event.target.value);
        break;
      default:
        break;
    }
  };

  const handleImageChange = (event) => {
    setImages(Array.from(event.target.files));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // 1. Add item data to Firestore
      const docRef = await addDoc(collection(db, "lost_items"), {
        itemName: itemName,
        description: description,
        location: location,
        dateLost: dateLost,
        email: email,
        // You might want to add a 'matched' field (boolean) to track matches later
      });
      console.log("Document written with ID: ", docRef.id);

      // 2. Upload images to Firebase Storage (if any)
      if (images.length > 0) {
        await Promise.all(
          images.map(async (image) => {
            const storageRef = ref(storage, `lost_items/${docRef.id}/${image.name}`);
            await uploadBytes(storageRef, image);
            console.log("Uploaded image:", image.name);
          })
        );
      }

      // Show success message and reset form
      alert("Lost item reported successfully!");
      setItemName("");
      setDescription("");
      setLocation("");
      setDateLost("");
      setImages([]);
      setEmail("");
    } catch (error) {
      console.error("Error adding document or uploading images: ", error);
      alert("Error reporting lost item. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="itemName">Item Name:</label>
        <input
          type="text"
          id="itemName"
          name="itemName"
          value={itemName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          name="description"
          value={description}   

          onChange={handleChange}
          required   

        />
      </div>
      <div>
        <label htmlFor="location">Location Lost:</label>
        <input
          type="text"
          id="location"
          name="location"
          value={location}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="dateLost">Date Lost:</label>
        <input
          type="date"
          id="dateLost"
          name="dateLost"
          value={dateLost}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="images">Photos:</label>
        <input
          type="file"
          id="images"
          name="images"
          multiple
          onChange={handleImageChange}
        />
      </div>
      <div>
        <label htmlFor="email">Your Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Report Lost Item</button>
    </form>
  );
}

export default ReportLostForm;