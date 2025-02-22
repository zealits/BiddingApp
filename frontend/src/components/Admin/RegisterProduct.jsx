import React, { useState, useRef } from "react";
import axios from "axios";
import { Plus, Minus, Upload, X } from "lucide-react";

const RegisterProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  const fileInputRef = useRef(null);

  const handleAddSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const handleRemoveSpecification = (index) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecifications = [...specifications];
    newSpecifications[index][field] = value;
    setSpecifications(newSpecifications);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("specifications", JSON.stringify(specifications));
      images.forEach((file) => {
        formData.append("images", file);
      });

      console.log(formData);
      await axios.post("/api/admin/product", formData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Product registered successfully");
      setName("");
      setDescription("");
      setImages([]);
      setSpecifications([{ key: "", value: "" }]);
    } catch (err) {
      setMessage("Error registering product");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div>
        <div className="p-6 border-b border-gray-900">
          <h2 className="text-2xl font-semibold text-gray-800">Register New Product</h2>
          <p className="text-gray-500 mt-1">Add a new product to your inventory</p>
        </div>

        {message && <div className="mx-6 mt-6 p-4 rounded-lg bg-blue-50 text-blue-700">{message}</div>}

        <form onSubmit={handleRegister} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter product name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Specifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Specifications</label>
                <button
                  type="button"
                  onClick={handleAddSpecification}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition duration-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Specification
                </button>
              </div>
              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, "key", e.target.value)}
                      placeholder="Key (e.g. Weight)"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) => handleSpecificationChange(index, "value", e.target.value)}
                      placeholder="Value (e.g. 20kg)"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                    {specifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecification(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition duration-200"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product Images *</label>
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition duration-200 cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Drag and drop images here, or click to select</p>
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

              {/* Image Preview */}
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  {images.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview ${index}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition duration-200"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition duration-200"
            >
              Register Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterProduct;
