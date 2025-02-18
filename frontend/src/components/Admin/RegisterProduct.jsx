// src/components/Admin/RegisterProduct.jsx
import React, { useState, useRef } from 'react';
import axios from 'axios';

const RegisterProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  // Handle files selected via the file dialog
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Handle drag over event (prevent default to allow drop)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle drop event for drag and drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages((prev) => [...prev, ...files]);
  };

  // Remove a selected image from the preview list
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle the product registration submission
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      images.forEach((file) => {
        formData.append('images', file);
      });

      await axios.post('/api/admin/product', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('Product registered successfully');
      setName('');
      setDescription('');
      setImages([]);
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
        {/* Product Name */}
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

        {/* Description */}
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

        {/* Image Upload Area */}
        <div className="mb-5">
          <label className="block text-gray-700 font-medium mb-2">
            Product Images
          </label>
          <div
            className="border-dashed border-2 border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
          >
            <p className="text-gray-600 mb-2">
              Drag and drop images here, or click to select images
            </p>
            <p className="text-sm text-gray-400">You can upload multiple images</p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Preview Selected Images */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview ${index}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
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
