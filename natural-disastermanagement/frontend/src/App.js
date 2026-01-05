import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ContributionForm from './components/ContributionForm';
import DisasterList from './components/DisasterList';
import DisasterForm from './components/DisasterForm';
import DisasterReport from './components/DisasterReport';
import AdminContributions from './components/AdminContributions';
import RescueTeamAssignment from './components/RescueTeamAssignment';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Configure axios defaults
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="App">
      {isAuthenticated && <Header />}
      <div className={isAuthenticated ? "container" : ""}>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} 
          />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/contribute" 
            element={isAuthenticated ? <ContributionForm /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/disasters" 
            element={isAuthenticated ? <DisasterList /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/disaster/report" 
            element={isAuthenticated ? <DisasterReport /> : <Navigate to="/login" />} 
          />
          {/* Admin only: create/edit disasters */}
          <Route 
            path="/disaster/create" 
            element={isAuthenticated && isAdmin ? <DisasterForm /> : <Navigate to="/login" />} 
          />
          {/* Admin only: view all contributions */}
          <Route 
            path="/admin/contributions" 
            element={isAuthenticated && isAdmin ? <AdminContributions /> : <Navigate to="/login" />} 
          />
          {/* Admin only: assign rescue teams */}
          <Route 
            path="/admin/rescue-teams" 
            element={isAuthenticated && isAdmin ? <RescueTeamAssignment /> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
