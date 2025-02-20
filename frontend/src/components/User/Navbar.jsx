import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 p-5">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="text-xl font-semibold text-gray-800">ScrapBid</div>
        <div className="flex gap-6 items-center">
          <Link to="/" className="text-gray-800 font-medium hover:text-blue-500">
            Home
          </Link>
          <Link to="/categories" className="text-gray-800 font-medium hover:text-blue-500">
            Categories
          </Link>
          <Link to="/how-it-works" className="text-gray-800 font-medium hover:text-blue-500">
            How It Works
          </Link>
          <Link to="/contact" className="text-gray-800 font-medium hover:text-blue-500">
            Contact
          </Link>
          <Link to="/user/bidstatus">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Check Bids
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
