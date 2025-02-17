// src/components/Admin/RegisterProduct.jsx
import React, { useState } from 'react';
import axios from 'axios';

const RegisterProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      await axios.post('/api/admin/product', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Product registered successfully');
      setName('');
      setDescription('');
      setImageFile(null);
    } catch (err) {
      setMessage('Error registering product');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Register Product
      </h2>
      {message && <p className="mb-4 text-center">{message}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter product description"
            rows="4"
            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          ></textarea>
        </div>
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-colors duration-200"
        >
          Register Product
        </button>
      </form>
    </div>
  );
};

export default RegisterProduct;
