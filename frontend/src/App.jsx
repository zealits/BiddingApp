//testing new deployment
// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLogin from "./components/Admin/AdminLogin";
import Dashboard from "./components/Admin/Dashboard";
import RegisterProduct from "./components/Admin/RegisterProduct";
import ViewBids from "./components/Admin/ViewBids";
import ProductList from "./components/User/ProductList";
import BidForm from "./components/User/BidForm";
import VerifyEmailOTP from "./components/User/VerifyEmailOTP";
import Navbar from "./components/Shared/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import HomePage from "./components/User/HomePage";
import CheckBidStatus from "./components/User/CheckBid";
import Contact from "./components/User/ContactUs";
import EditProduct from "./components/Admin/EditProduct";

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="register-product" element={<RegisterProduct />} />
          <Route path="view-bids" element={<ViewBids />} />
          <Route path="edit-product" element={<EditProduct/>} />
          
        </Route>

        {/* User Routes */}
        <Route path="/user" element={<HomePage />} />
        <Route path="/user/bid/:productId" element={<BidForm />} />
        <Route path="/user/verify/:bidId" element={<VerifyEmailOTP />} />
        <Route path="/user/bidstatus" element={<CheckBidStatus />} />
        <Route path="/contact" element={<Contact />} />

        {/* Fallback route dfd */}
        <Route path="*" element={<Navigate to="/user" replace />} />
      </Routes>
    </>
  );
}

export default App;

// changed something
