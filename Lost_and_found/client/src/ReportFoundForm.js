import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "./firebase";  
import { ref, uploadBytes } from "firebase/storage";

function ReportFoundForm() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateFound, setDateFound] = useState("");
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
      case "dateFound":
        setDateFound(event.target.value);
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
      const docRef = await addDoc(collection(db, "found_items"), {
        itemName: itemName,
        description: description,
        location: location,
        dateFound: dateFound, // Note: dateFound instead of dateLost
        email: email,
      });
      console.log("Document written with ID: ", docRef.id);

      // 2. Upload images to Firebase Storage (if any)
      if (images.length > 0) {
        await Promise.all(
          images.map(async (image) => {
            const storageRef = ref(storage, `found_items/${docRef.id}/${image.name}`);
            await uploadBytes(storageRef, image);
            console.log("Uploaded image:", image.name);
          })
        );
      }

      // Show success message and reset form
      alert("Found item reported successfully!");
      setItemName("");
      setDescription("");
      setLocation("");
      setDateFound("");
      setImages([]);
      setEmail("");
    } catch (error) {
      console.error("Error adding document or uploading images: ", error);
      alert("Error reporting found item. Please try again.");
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
        <label htmlFor="location">Location Found:</label>
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
        <label htmlFor="dateFound">Date Found:</label>
        <input
          type="date"
          id="dateFound"
          name="dateFound"
          value={dateFound}
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
      <button type="submit">Report Found Item</button>
    </form>
  );
}

export default ReportFoundForm;