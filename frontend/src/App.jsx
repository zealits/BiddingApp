// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/Admin/AdminLogin';
import Dashboard from './components/Admin/Dashboard';
import RegisterProduct from './components/Admin/RegisterProduct';
import ViewBids from './components/Admin/ViewBids';
import ProductList from './components/User/ProductList';
import BidForm from './components/User/BidForm';
import VerifyEmailOTP from './components/User/VerifyEmailOTP';
import Navbar from './components/Shared/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Dashboard />}>
          <Route path="register-product" element={<RegisterProduct />} />
          <Route path="view-bids" element={<ViewBids />} />
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<ProductList />} />
        <Route path="/user/bid/:productId" element={<BidForm />} />
        <Route path="/user/verify/:bidId" element={<VerifyEmailOTP />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/user" />} />
      </Routes>
    </>
  );
}

export default App;
