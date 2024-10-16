import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../AuthContext'; // Adjust the path if necessary

function NavBar() {
  const { user, logout } = useContext(AuthContext); // Access user and logout from context

  const handleLogout = async () => {
    try {
      await logout();
      alert('Logged out successfully!');
      // Optionally redirect to the home page or login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      alert('An error occurred during logout.');
    }
  };

  return (
    <nav style={{ padding: '10px', backgroundColor: '#333', color: 'white' }}>
      <ul style={{ display: 'flex', listStyleType: 'none', alignItems: 'center' }}>
        <li style={{ marginRight: '20px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        </li>
        <li style={{ marginRight: '20px' }}>
          <Link to="/submit-lost-item" style={{ color: 'white', textDecoration: 'none' }}>Submit Lost Item</Link>
        </li>
        {/* ... other list items ... */}
        {user ? ( // Conditionally render these items if user is logged in
          <>
            <li style={{ marginRight: '20px' }}>Logged in: {user.name}</li>
            <li>
              <button onClick={handleLogout} style={{ color: 'white', backgroundColor: '#555' }}>
                Logout
              </button>
            </li>
          </>
        ) : ( // Conditionally render login/register if not logged in
          <>
            <li style={{ marginRight: '20px' }}>
              <Link to="/registerUser" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>
            </li>
            <li>
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;