import React, { useState, useContext } from 'react';
import AuthContext from '../AuthContext'; // Adjust the path if necessary

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      alert('Login successful!');
      // Optionally redirect the user after login, e.g., using useHistory:
      // history.push('/'); 
    } catch (error) {
      console.error('Error logging in user:', error);
      alert(error.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;