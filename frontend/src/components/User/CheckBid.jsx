// src/components/User/CheckBidStatus.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../Shared/Navbar';
import Footer from './Footer';

const CheckBidStatus = () => {
  const [email, setEmail] = useState('');
  const [bidStatus, setBidStatus] = useState(null);
  const [error, setError] = useState('');

  const handleCheckStatus = () => {
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setBidStatus(null);

    axios
      .post('/api/bid-status', { email })
      .then((response) => {
        setBidStatus(response.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Something went wrong.');
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 mb-12">
        <Navbar/>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Check Your Bid Status
        </h1>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email used for bidding
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {error && (
          <p className="text-red-500 text-sm mb-4">
            {error}
          </p>
        )}
        <button
          onClick={handleCheckStatus}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
        >
          Check Status
        </button>
        {bidStatus && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-gray-800">Bid Details:</h2>
            {bidStatus.bids.length > 0 ? (
              <ul className="list-disc list-inside">
                {bidStatus.bids.map((bid, index) => (
                  <li key={index} className="text-gray-700">
                    <strong>Product:</strong> {bid.productName}
                    <br />
                    <strong>Bid Amount:</strong> {bid.bidAmount}
                    <br />
                    <strong>Status:</strong> {bid.status}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No bids found for this email.</p>
            )}
          </div>
        )}
      </div>
      {/* <Footer/>? */}
    </div>
  );
};

export default CheckBidStatus;
