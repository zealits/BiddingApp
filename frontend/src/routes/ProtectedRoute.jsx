// src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if admin token exists
  const token = localStorage.getItem('adminToken');
  if (!token) {
    // Redirect to admin login if not authenticated
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
