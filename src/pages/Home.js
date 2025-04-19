import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaUsers,
  FaBookOpen,
  FaEdit,
  FaLanguage,
  FaChalkboardTeacher,
} from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const Home = () => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : { name: 'User' };

  const [stats, setStats] = useState({
    users: 0,
    lessons: 0,
    exercises: 0,
    words: 0,
    teachers: 0,
  });

  useEffect(() => {
    // Fetch all other stats
    axios
      .get(`${API_BASE_URL}/dashboard-stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setStats(prev => ({ ...prev, ...res.data }));
      })
      .catch((err) => {
        console.error('Failed to fetch stats:', err);
      });
  
    // Fetch total user count separately
    axios
      .get(`${API_BASE_URL}/profile-count`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        console.log("👤 User count response:", res.data);
        const count = res.data?.totalUsers ?? res.data?.users ?? 0;
        setStats(prev => ({ ...prev, users: count }));
      })
      .catch((err) => {
        console.error('Failed to fetch user count:', err);
      });
  }, []);
  

  return (
    <>
      <div className="home-page">
        <h2 className="welcome-text">👋 Halo, {user.username}!</h2>

        <div className="stats-grid">
          <div className="stat-card">
            <FaUsers className="stat-icon" />
            <div>
              <h3>{stats.users}</h3>
              <p>Total Users</p>
            </div>
          </div>

          <div className="stat-card">
            <FaBookOpen className="stat-icon" />
            <div>
              <h3>{stats.lessons}</h3>
              <p>Total Lessons</p>
            </div>
          </div>

          <div className="stat-card">
            <FaEdit className="stat-icon" />
            <div>
              <h3>{stats.exercises}</h3>
              <p>Total Exercises</p>
            </div>
          </div>

          <div className="stat-card">
            <FaLanguage className="stat-icon" />
            <div>
              <h3>{stats.words}</h3>
              <p>Total Words</p>
            </div>
          </div>

          <div className="stat-card">
            <FaChalkboardTeacher className="stat-icon" />
            <div>
              <h3>{stats.teachers}</h3>
              <p>Active Teachers</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .home-page {
          padding: 20px;
        }

        .welcome-text {
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 24px;
          color: #1f2937;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 15px;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
        }

        .stat-icon {
          font-size: 30px;
          color: #3b82f6;
        }

        .stat-card h3 {
          margin: 0;
          font-size: 20px;
          color: #111827;
        }

        .stat-card p {
          margin: 2px 0 0;
          font-size: 14px;
          color: #6b7280;
        }
      `}</style>
    </>
  );
};

export default Home;
