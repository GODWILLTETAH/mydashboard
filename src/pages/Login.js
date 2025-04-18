import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';
import API_BASE_URL from '../config';

const Login = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // name or email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // for spinner

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    // Check if the identifier is an email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier.trim());
  
    // Build payload based on the input
    const payload = {
      password: password.trim(),
      ...(isEmail ? { email: identifier.trim() } : { username: identifier.trim() }),
    };
  
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/home');
    } catch (err) {
      setError('Invalid username/email or password');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-wrapper">
      <div className="login-heading">
        <h1>Admin Dashboard</h1>
      </div>
      <form onSubmit={handleLogin} className="login-card">
        <h2 className="login-title">Sign in</h2>
        {error && <p className="login-error">{error}</p>}

        <div className="input-group">
          <label>Username or Email</label>
          <div className="input-field">
            <FaEnvelope className="input-icon" />
            <input
              type="text"
              placeholder="example@email.com or johndoe"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="input-field">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? <ImSpinner2 className="spinner-icon" /> : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
