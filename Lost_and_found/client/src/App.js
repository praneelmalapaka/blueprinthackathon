import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SubmitLostItem from './pages/SubmitLostItem';  // Import the form component
import Register from './pages/Register';  // Import the Register component
import Login from './pages/Login';  // Import the Login component
import './css/App.css';  // Ensure the CSS file is imported at the top
import './css/Form.css';  // Ensure the CSS file is imported at the top

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/submit-lost-item" element={<SubmitLostItem />} />  {/* Route for the form */}
        <Route path="/registerUser" element={<Register />} />  {/* Register route */}
        <Route path="/login" element={<Login />} />  {/* Login route */}
      </Routes>
    </Router>
  );
}

export default App;
