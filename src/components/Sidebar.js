import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGripfire, FaRegFlag, FaCog, FaSortAlphaDown, FaBookOpen, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const menuItems = [
  { id: 'home', label: 'Home', icon: <FaGripfire />, path: '/home' },
  { id: 'users', label: 'Users', icon: <FaUser />, path: '/users' },
  { id: 'languages', label: 'Languages', icon: <FaRegFlag />, path: '/languages' },
  { id: 'lessons', label: 'Lessons', icon: <FaBookOpen />, path: '/lessons' },
  { id: 'phrases', label: 'Phrases', icon: <FaSortAlphaDown />, path: '/phrases' },
  { id: 'settings', label: 'Settings', icon: <FaCog />, path: '/settings' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const [submenuOpen, setSubmenuOpen] = useState(true);

  const handleClick = () => {
    if (window.innerWidth < 768 && typeof setIsOpen === 'function') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`sidebar ${isOpen || window.innerWidth >= 768 ? 'open' : ''}`}>
      <h2 className="sidebar-title">Dashboard</h2>

      {/* Main Parent Menu */}
      <div className="menu-item" onClick={() => setSubmenuOpen(!submenuOpen)} style={{ cursor: 'pointer' }}>
        <span style={{ marginRight: '10px' }}>🗂️</span> Dialect App
        <span style={{ marginLeft: 'auto' }}>{submenuOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>

      {/* Submenu */}
      {submenuOpen && (
        <div style={{ paddingLeft: '15px' }}>
          {menuItems.map(item => (
            <Link
              to={item.path}
              key={item.id}
              onClick={handleClick}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}>
                <span style={{ marginRight: '10px' }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
