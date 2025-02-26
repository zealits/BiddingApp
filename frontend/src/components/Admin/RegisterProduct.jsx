import React, { useState, useRef } from "react";
import axios from "axios";
import { Plus, Minus, Upload, X } from "lucide-react";
import PopupModal from '../../models/PopupModal'; // Adjust the path as necessary

const RegisterProduct = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deadline, setDeadline] = useState("");
  const [images, setImages] = useState([]);
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
  const [isRegistering, setIsRegistering] = useState(false);

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
    setIsRegistering(true);

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("quantity", quantity);
      formData.append("deadline", deadline);
      formData.append("specifications", JSON.stringify(specifications));
      images.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("/api/admin/product", formData, {
        headers: {
          "x-auth-token": token,
          "Content-Type": "multipart/form-data",
        },
      });

      setPopup({ visible: true, message: "Commodity registered successfully", type: "success" });

      // Reset the form fields after successful registration
      setName("");
      setDescription("");
      setQuantity(1);
      setDeadline("");
      setImages([]);
      setSpecifications([{ key: "", value: "" }]);
    } catch (err) {
      console.error("Error registering commodity", err);
      setPopup({ visible: true, message: "Error registering commodity", type: "error" });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div>
        <div className="p-6 border-b border-gray-900">
          <h2 className="text-2xl font-semibold text-gray-800">Register New Listing</h2>
        </div>

        <form onSubmit={handleRegister} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Commodity Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commodity Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Commodity Name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter Commodity description"
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter Quantity"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
                min="1"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline *
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                required
              />
            </div>

            {/* Specifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Specifications *
                </label>
                <button
                  type="button"
                  onClick={handleAddSpecification}
                  className="flex items-center gap-2 px-3 py-1 text-sm text-black hover:bg-blue-50 rounded-lg transition duration-200"
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
                      onChange={(e) =>
                        handleSpecificationChange(index, "key", e.target.value)
                      }
                      placeholder="Key (e.g. Weight)"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecificationChange(index, "value", e.target.value)
                      }
                      placeholder="Value (e.g. 20kg)"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                      required
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commodity Images *
              </label>
              <div
                className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:bg-gray-50 transition duration-200 cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current.click()}
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">
                  Drag and drop images here, or click to select
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
              className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-black focus:ring-4 focus:ring-blue-200 transition duration-200"
              disabled={isRegistering}
            >
              {isRegistering ? "Registering..." : "Register Commodity"}
            </button>
          </div>
        </form>
      </div>

      {/* Popup Modal */}
      {popup.visible && (
        <PopupModal
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ visible: false, message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default RegisterProduct;