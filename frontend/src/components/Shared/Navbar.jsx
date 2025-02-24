import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 p-5">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-gray-800">ScrapBid</Link>
        <div className="flex gap-6 items-center">
          {/* <Link to="/" className="text-gray-800 font-medium hover:text-gray-700">
            Home
          </Link> */}
          {/* <Link to="/categories" className="text-gray-800 font-medium hover:text-gray-700">
            Categories
          </Link> */}
          <Link to="/how-it-works" className="text-gray-800 font-medium hover:text-gray-600">
            How It Works
          </Link>
          <Link to="/contact" className="text-gray-800 font-medium hover:text-gray-600">
            Contact
          </Link>
          <Link to="/user/bidstatus">
            <button className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-600">
              Check Bids
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
