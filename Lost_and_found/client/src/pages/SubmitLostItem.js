import React, { useState } from 'react';

function SubmitLostItem() {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    dateLost: '',
    description: '',
    contactInfo: '',
    image: null  // Add a new field for the image
  });

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];  // Get the uploaded file
    setFormData({
      ...formData,
      image: file  // Store the file in the state
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data to submit including the image
    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('location', formData.location);
    submissionData.append('dateLost', formData.dateLost);
    submissionData.append('description', formData.description);
    submissionData.append('contactInfo', formData.contactInfo);
    submissionData.append('image', formData.image);  // Append the image file

    try {
      const response = await fetch('http://localhost:5001/api/submit-lost-item', {
        method: 'POST',
        body: submissionData,  // Send the form data
      });

      const data = await response.json();
      if (response.ok) {
        alert('Lost item submitted successfully!');
      } else {
        alert(data.message);  // Show any error message from the backend
      }
    } catch (error) {
      console.error('Error submitting lost item:', error);
      alert('An error occurred. Please try again.');
    }
  };


  return (
    <div>
      <h2>Submit a Lost Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date Lost:</label>
          <input
            type="date"
            name="dateLost"
            value={formData.dateLost}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contact Information:</label>
          <input
            type="text"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}  // Handle image upload
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default SubmitLostItem;
