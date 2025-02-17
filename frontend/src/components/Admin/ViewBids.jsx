// src/components/Admin/ViewBids.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ViewBids = () => {
  const [productId, setProductId] = useState('');
  const [bids, setBids] = useState([]);
  const [error, setError] = useState('');

  const fetchBids = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(
        `/api/admin/product/${productId}/bids`,
        { headers: { 'x-auth-token': token } }
      );
      setBids(res.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bids', err);
      setError('Error fetching bids. Please check the Product ID and try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">View Bids</h2>
      <form onSubmit={fetchBids} className="mb-6">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Product ID
          </label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter Product ID"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Fetch Bids
        </button>
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
      </form>
      {bids.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Email
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Phone
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700">
                  Verified
                </th>
              </tr>
            </thead>
            <tbody>
              {bids.map((bid) => (
                <tr key={bid._id} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-sm text-gray-600">{bid.email}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{bid.phone}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{bid.price}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {bid.isVerified ? 'Yes' : 'No'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewBids;
