import React, { useState } from 'react';
import '../css/ReminderPage.css';  // Importing the CSS file for styling

function ReminderPage() {
  const [filters, setFilters] = useState({
    byName: { enabled: false, value: '' },
    byLocation: { enabled: false, value: '' },
    byDescription: { enabled: false, value: '' },
  });
  const [email, setEmail] = useState('');

  // Handle checkbox and text input changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFilters({
        ...filters,
        [name]: { ...filters[name], enabled: checked }
      });
    } else {
      setFilters({
        ...filters,
        [name]: { ...filters[name], value }
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const reminderData = {
      email,
      filters,
    };

    try {
      const response = await fetch('http://localhost:5001/api/create-reminder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminderData),
      });
      if (response.ok) {
        alert('Reminder created successfully!');
      } else {
        alert('Failed to create reminder');
      }
    } catch (error) {
      console.error('Error creating reminder:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="reminder-page">
      <h2>Create a Reminder</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              name="byName"
              checked={filters.byName.enabled}
              onChange={handleFilterChange}
            />
            Name:
          </label>
          <input
            type="text"
            name="byName"
            value={filters.byName.value}
            onChange={handleFilterChange}
            disabled={!filters.byName.enabled}
          />
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              name="byLocation"
              checked={filters.byLocation.enabled}
              onChange={handleFilterChange}
            />
            Location:
          </label>
          <input
            type="text"
            name="byLocation"
            value={filters.byLocation.value}
            onChange={handleFilterChange}
            disabled={!filters.byLocation.enabled}
          />
        </div>

        <div className="filter-group">
          <label>
            <input
              type="checkbox"
              name="byDescription"
              checked={filters.byDescription.enabled}
              onChange={handleFilterChange}
            />
            Description:
          </label>
          <input
            type="text"
            name="byDescription"
            value={filters.byDescription.value}
            onChange={handleFilterChange}
            disabled={!filters.byDescription.enabled}
          />
        </div>

        <button type="submit" className="create-reminder-button">Create Reminder</button>
      </form>
    </div>
  );
}

export default ReminderPage;

