import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus, 
  Upload 
} from "lucide-react";
import PopupModal from "../../models/PopupModal"; // Updated: Import the PopupModal component

const ViewProducts = () => {
  // Product list & pagination states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // State for currently selected product (for editing)
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Edit form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [deadline, setDeadline] = useState("");
  const [specifications, setSpecifications] = useState([{ key: "", value: "" }]);
  const [images, setImages] = useState([]);
  const [popup, setPopup] = useState({ visible: false, message: "", type: "info" });
 
  const fileInputRef = useRef(null);

  // Fetch products with pagination
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `/api/admin/products?page=${page}&limit=${itemsPerPage}`,
          { headers: { "x-auth-token": token } }
        );
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setError("");
      } catch (err) {
        console.error("Error fetching products", err);
        setError("Error fetching products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page, itemsPerPage]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPage(1); // Reset to page 1 when items per page changes
  };

  // Open edit commodity modal & prefill form fields
  const handleEditCommodity = (product) => {
    setSelectedProduct(product);
    setName(product.name);
    setDescription(product.description);
    setQuantity(product.quantity);
    setDeadline(product.deadline.split("T")[0]); // Format date as YYYY-MM-DD
    setSpecifications(
      product.specifications && product.specifications.length > 0
        ? product.specifications
        : [{ key: "", value: "" }]
    );
    setImages([]); // Reset images so new ones can be added if needed
  };

  // Handlers for dynamic specification fields
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

  // File input handlers for image upload
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

  // Update commodity handler (Updated: using PopupModal instead of alert)
  const handleUpdateCommodity = async (e) => {
    e.preventDefault();
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

      await axios.put(
        `/api/admin/product/${selectedProduct._id}`,
        formData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setPopup({ visible: true, message: "Commodity updated successfully", type: "success" });
      setSelectedProduct(null);
      
      // Optionally refetch products after update
      const res = await axios.get(
        `/api/admin/products?page=${page}&limit=${itemsPerPage}`,
        { headers: { "x-auth-token": token } }
      );
      setProducts(res.data.products);
    } catch (err) {
      console.error("Error updating commodity", err);
      setPopup({ visible: true, message: "Error updating commodity", type: "error" });
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Edit Commodity</h2>
            <p className="text-gray-500">Manage your product listings and edit commodities</p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-gray-700 font-medium">Products per page:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="border border-gray-300 rounded-md p-2 focus:ring focus:ring-blue-200"
            >
              <option value={3}>3</option>
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={18}>18</option>
              <option value={24}>24</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg mb-6">
            <X className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 py-6">
            {products.map((product) => {
              // Format the deadline into a more human-friendly format
              const formattedDeadline = new Date(product.deadline).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
              });
              
              // Calculate days remaining until deadline
              const daysRemaining = Math.ceil((new Date(product.deadline) - new Date()) / (1000 * 60 * 60 * 24));
              const isUrgent = daysRemaining <= 7;
              
              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="relative h-40">
                    <img
                      src={
                        product.images && product.images[0]
                          ? `data:${product.images[0].contentType};base64,${product.images[0].data}`
                          : ""
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Status badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                      isUrgent ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                    }`}>
                      {isUrgent ? "Urgent" : "Active"}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                      {product.description}
                    </p>
              
                    {/* Enhanced deadline display */}
                    <div className={`flex items-center mb-3 p-2 rounded-md ${isUrgent ? "bg-red-50" : "bg-blue-50"}`}>
                      <svg
                        className={`w-4 h-4 mr-2 ${isUrgent ? "text-red-500" : "text-blue-500"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Deadline</p>
                        <p className={`text-xs ${isUrgent ? "text-red-600 font-semibold" : "text-blue-600"}`}>
                          {formattedDeadline} {isUrgent && `(${daysRemaining} days left)`}
                        </p>
                      </div>
                    </div>
              
                    <button
                      onClick={() => handleEditCommodity(product)}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-900 text-white px-3 py-2 rounded-lg hover:from-gray-900 hover:to-gray-600 transition duration-300 flex items-center justify-center gap-1 font-medium shadow-sm"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                      Edit Commodity
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-8 px-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition duration-200"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Edit Commodity Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-semibold text-gray-800">Edit Commodity</h3>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition duration-200">
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleUpdateCommodity} className="space-y-6">
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
                      required
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
                        Specifications
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
                          />
                          <input
                            type="text"
                            value={spec.value}
                            onChange={(e) =>
                              handleSpecificationChange(index, "value", e.target.value)
                            }
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
                <div className="pt-4 flex gap-4">
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-black focus:ring-4 focus:ring-blue-200 transition duration-200"
                  >
                    Update Commodity
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Popup Modal */}
      {popup.visible && (
        <PopupModal
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, visible: false })}
        />
      )}
    </div>
  );
};

export default ViewProducts;
