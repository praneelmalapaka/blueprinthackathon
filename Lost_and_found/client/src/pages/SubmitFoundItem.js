// SubmitFoundItem.js
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext';

function SubmitFoundItem() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    description: '',
    location: '',
    dateFound: '',
    anonymous: false,
    image: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      image: file
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submissionData = new FormData();
    submissionData.append('description', formData.description);
    submissionData.append('location', formData.location);
    submissionData.append('dateFound', formData.dateFound);
    submissionData.append('anonymous', formData.anonymous);
    submissionData.append('image', formData.image);

    try {
      const response = await fetch('http://localhost:5001/api/submit-found-item', {
        method: 'POST',
        body: submissionData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Found item submitted successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error submitting found item:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Submit a Found Item</h2>
      <form onSubmit={handleSubmit}>
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
          <label>Date Found:</label>
          <input
            type="date"
            name="dateFound"
            value={formData.dateFound}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>
            Anonymous:
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
            />
          </label>
        </div>
        <div>
          <label>Upload Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Conditionally render the submit button */}
        {user ? (
          <button type="submit">Submit</button>
        ) : (
          <div>
            <p>You need to be logged in to submit a found item.</p>
            <Link to="/login">Login</Link> or <Link to="/registerUser">Register</Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default SubmitFoundItem;