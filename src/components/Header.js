import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="top-nav">
      <div className="nav-left">
        <h3> Admin Tools</h3>
      </div>
      <div className="nav-right">
        <button className="nav-btn">Profile</button>
        <button className="nav-btn">Settings</button>
        <button className="nav-btn logout" onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
