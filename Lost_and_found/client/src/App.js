// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import SubmitLostItem from './pages/SubmitLostItem';
import Register from './pages/Register';
import Login from './pages/Login';
import ItemPage from './pages/ItemPage'; 
import Messages from './pages/Messages';   
import Reminders from './pages/ReminderPage'; 
import SubmitFoundItem from './pages/SubmitFoundItem';
import './css/App.css';
import './css/Form.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit-lost-item" element={<SubmitLostItem />} />
          <Route path="/registerUser" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/item/:itemId" element={<ItemPage />} /> 
          <Route path="/messages" element={<Messages />} />    
          <Route path="/reminders" element={<Reminders />} /> 
          <Route path="/submit-found-item" element={<SubmitFoundItem />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;