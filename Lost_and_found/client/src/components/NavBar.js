import React from 'react';
import { Link } from 'react-router-dom';  // Using react-router for navigation

function NavBar() {
  return (
    <nav style={{ padding: '10px', backgroundColor: '#333', color: 'white' }}>
      <ul style={{ display: 'flex', listStyleType: 'none' }}>
        <li style={{ marginRight: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        </li>
        <li style={{ marginRight: '20px' }}>
          <Link to="/submit-lost-item" style={{ color: 'white', textDecoration: 'none' }}>Submit Lost Item</Link>
        </li>
        <li style={{ marginRight: '20px' }}>
          <Link to="/registerUser" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
        </li>
        <li style={{ marginRight: '20px' }}>
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
