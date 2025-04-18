import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Users from './pages/Users';
import Languages from './pages/Languages';
import Phrases from './pages/Phrases';

import Lessons from './pages/Lessons';

// import Settings from './pages/Settings';
import Login from './pages/Login';
import './styles/App.css';

import Header from './components/Header';


const Loader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);


const DashboardLayout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="content-area">
          {isLoading ? <Loader /> : children}
        </div>
      </div>
    </div>
  );
};



function App() {
  return (
    <Router>
      <Routes>
        {/* Login is public and full-screen */}
        <Route path="/login" element={<Login />} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Protected Dashboard routes with layout */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Home />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Users />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/languages"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Languages />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Lessons />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/phrases"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Phrases />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
        {/* 
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            </PrivateRoute>
          }
        />
 */}

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                }}>
                  <h1 style={{ fontSize: '28px', color: '#1e293b' }}>404 - Page Not Found</h1>
                  <p style={{ fontSize: '16px', color: '#6b7280' }}>Oops! The page you’re looking for doesn’t exist.</p>
                </div>
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
