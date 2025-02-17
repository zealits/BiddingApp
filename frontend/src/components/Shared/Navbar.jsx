// src/components/Shared/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="font-bold">Bidding App</Link>
        <div>
          <Link to="/admin/login" className="mr-4 hover:underline">Admin Login</Link>
          {/* Future link for User module */}
          <Link to="/user" className="hover:underline">User</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
