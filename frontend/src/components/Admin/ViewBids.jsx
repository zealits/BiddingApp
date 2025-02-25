import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsError, setBidsError] = useState("");
  const [modalProductName, setModalProductName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productQuantity, setProductQuantity] = useState(0);
  const [priceSortOrder, setPriceSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch products with pagination and search
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(
          `/api/admin/products?page=${page}&limit=${itemsPerPage}&search=${searchQuery}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        console.log(res.data);
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
  }, [page, itemsPerPage, searchQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const fetchBids = async (productId) => {
    try {
      setBidsLoading(true);
      const token = localStorage.getItem("adminToken");

      // Fetch bids for the product
      const bidsResponse = await axios.get(
        `/api/admin/products/${productId}/bids`,
        {
          headers: { "x-auth-token": token },
        }
      );

      // Fetch product details to get the current quantity
      const productResponse = await axios.get(
        `/api/admin/products/${productId}`,
        {
          headers: { "x-auth-token": token },
        }
      );

      setBids(bidsResponse.data);
      setProductQuantity(productResponse.data.quantity);
      setBidsError("");
      setSelectedProduct(productId);
    } catch (err) {
      console.error("Error fetching bids or product details", err);
      setBidsError("Error fetching bids. Please try again.");
    } finally {
      setBidsLoading(false);
    }
  };

  const handleViewBids = async (productId, name) => {
    setIsModalOpen(true);
    setModalProductName(name);
    await fetchBids(productId);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const handleSendEmail = async (bid) => {
    if (!bid.email) {
      alert("No recipient email found for this bid.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      await axios.post(
        "/api/admin/approve-bid",
        {
          bidId: bid._id,
          productId: selectedProduct,
        },
        { headers: { "x-auth-token": token } }
      );

      const emailBody = `Bid Details:
Email: ${bid.email}
Phone: ${bid.phone}
Price: $${bid.price}

Your bid has been approved.`;

      const emailResponse = await axios.post(
        "/api/email/send-email",
        {
          to: bid.email,
          subject: `Bid Approved for ${modalProductName}`,
          text: emailBody,
        },
        { headers: { "x-auth-token": token } }
      );

      alert(emailResponse.data.message);

      // Refresh the bids list to reflect updated status and quantity
      await fetchBids(selectedProduct);
    } catch (error) {
      console.error("Error sending email", error);
      alert("Failed to send email");
    }
  };

  const verifiedBids = bids.filter((bid) => bid.isVerified);

  const sortedBids = [...verifiedBids].sort((a, b) =>
    priceSortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              View Products
            </h2>
            <p className="text-gray-500">
              Manage your product listings and view bids
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border border-gray-300 rounded-md p-2 pl-10 focus:ring focus:ring-blue-200"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>
            <label className="text-gray-700 font-medium">
              Products per page:
            </label>
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
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={
                      product.images[0]
                        ? `data:${product.images[0].contentType};base64,${product.images[0].data}`
                        : ""
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <button
                    onClick={() => handleViewBids(product._id, product.name)}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-black transition duration-200 flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    View Bids
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

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

      <AnimatePresence>
        {isModalOpen && selectedProduct && (
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
              className="bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Bids for {modalProductName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    View and manage bids for this product
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Quantity Remaining For {modalProductName} is {productQuantity}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition duration-200"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 p-6">
                {bidsLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                  </div>
                )}

                {bidsError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <p>{bidsError}</p>
                  </div>
                )}

                <div className="container mx-auto px-4">
                  {!bidsLoading && verifiedBids.length > 0 ? (
                    <div className="overflow-x-auto w-full">
                      <table className="min-w-full w-full table-auto">
                        <thead className="sticky top-0 bg-white shadow-sm">
                          <tr className="bg-gray-50">
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                              <button
                                onClick={() =>
                                  setPriceSortOrder((prev) =>
                                    prev === "asc" ? "desc" : "asc"
                                  )
                                }
                                className="flex items-center space-x-2 focus:outline-none hover:bg-gray-200 px-2 py-1 rounded"
                              >
                                <span>Price</span>
                                {priceSortOrder === "asc" ? (
                                  <ChevronUp className="inline-block w-4 h-4" />
                                ) : (
                                  <ChevronDown className="inline-block w-4 h-4" />
                                )}
                              </button>
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                              Phone
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                              Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                              Company
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {sortedBids.map((bid) => {
                            const isProductOutOfStock = productQuantity <= 0;
                            const isBidApproved = bid.status === "Approved";
                            return (
                              <tr
                                key={bid._id}
                                className="hover:bg-gray-50 transition duration-200"
                              >
                                <td className="px-6 py-4 text-sm text-gray-800">
                                  ${bid.price}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                  {bid.email}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                  {bid.phone}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                  {bid.quantity}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                  {new Date(bid.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-800">
                                  {bid.company}
                                </td>
                                <td className="px-6 py-4">
                                  {isBidApproved ? (
                                    <span className="text-green-600">
                                      Approved
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => handleSendEmail(bid)}
                                      disabled={isProductOutOfStock}
                                      className={`bg-gray-900 hover:bg-black text-white text-sm px-4 py-2 rounded transition duration-200 ${
                                        isProductOutOfStock
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                      }`}
                                    >
                                      Send Email
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    !bidsLoading && (
                      <div className="text-center py-12 text-gray-500">
                        No verified bids found for this product
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewProducts;
