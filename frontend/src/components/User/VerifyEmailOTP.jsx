// src/components/User/VerifyEmailOTP.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const VerifyEmailOTP = () => {
  const { bidId } = useParams();
  const navigate = useNavigate();
  const { bidInfo } = useAppContext();
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/bid/verify', { bidId, otp });
      setMessage('Bid verified successfully!');
      // Redirect back to the product list after a short delay
      setTimeout(() => {
        navigate('/user');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'OTP Verification failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Verify Your Bid</h2>
      {bidInfo && (
        <div className="mb-4">
          <p>
            <strong>Product ID:</strong> {bidInfo.productId}
          </p>
          <p>
            <strong>Your Bid Price:</strong> {bidInfo.price}
          </p>
        </div>
      )}
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleVerify}>
        <div className="mb-4">
          <label className="block mb-1">Enter OTP</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyEmailOTP;
