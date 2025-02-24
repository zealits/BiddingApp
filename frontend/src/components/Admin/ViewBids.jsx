import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Package, Check, AlertCircle } from "lucide-react";

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`/api/admin/products?page=${page}&limit=${itemsPerPage}`, {
          headers: { "x-auth-token": token },
        });
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

  const fetchBids = async (productId) => {
    try {
      setBidsLoading(true);
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`/api/admin/products/${productId}/bids`, {
        headers: { "x-auth-token": token },
      });
      setBids(res.data);
      setBidsError("");
      setSelectedProduct(productId);
    } catch (err) {
      console.error("Error fetching bids", err);
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
    setPage(1); // Reset to page 1 when items per page changes
  };
  const handleSendEmail = async (bid) => {
    // Validate that there is a recipient email address
    if (!bid.email) {
      alert("No recipient email found for this bid.");
      return;
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      // Construct the email body with bid details and approval message
      const emailBody = `Bid Details:
  Email: ${bid.email}
  Phone: ${bid.phone}
  Price: $${bid.price}
  Status: ${bid.isVerified ? "Verified" : "Pending"}
  
  Your bid has been approved.`;
      
      const response = await axios.post(
        "/api/email/send-email",
        {
          to: bid.email,
          subject: `Bid Approved for ${modalProductName}`,
          text: emailBody,
        },
        { headers: { "x-auth-token": token } }
      );
      alert(response.data.message);
    } catch (error) {
      console.error("Error sending email", error);
      alert("Failed to send email");
    }
  };
  
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl  p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">View Products</h2>
            <p className="text-gray-500">Manage your product listings and view bids</p>
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

        {/* add here option for taking number of product page per page  */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
                      product.images[0] ? `data:${product.images[0].contentType};base64,${product.images[0].data}` : ""
                    }
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                  <button
                    onClick={() => handleViewBids(product._id, product.name)}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" />
                    View Bids
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
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

      {/* Bids Modal */}
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
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col"
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">Bids for {modalProductName}</h3>
                  <p className="text-sm text-gray-500 mt-1">View and manage bids for this product</p>
                </div>
                <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition duration-200">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 p-6">
                {bidsLoading && (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}

                {bidsError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <p>{bidsError}</p>
                  </div>
                )}

{!bidsLoading && bids.length > 0 && (
  <div className="overflow-x-auto">
    <table className="w-full">
    <thead className="sticky top-0 bg-white shadow-sm">
  <tr className="bg-gray-50">
    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Phone</th>
    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Price</th>
    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
    <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Action</th>
  </tr>
</thead>
<tbody className="divide-y divide-gray-200">
  {bids.map((bid) => (
    <tr key={bid._id} className="hover:bg-gray-50 transition duration-200">
      <td className="px-6 py-4 text-sm text-gray-800">{bid.email}</td>
      <td className="px-6 py-4 text-sm text-gray-800">{bid.phone}</td>
      <td className="px-6 py-4 text-sm text-gray-800">${bid.price}</td>
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            bid.isVerified ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
          }`}
        >
          {bid.isVerified ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {bid.isVerified ? "Verified" : "Pending"}
        </span>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={() => handleSendEmail(bid)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition duration-200"
        >
          Send Email
        </button>
      </td>
    </tr>
  ))}
</tbody>


    </table>
  </div>
)}


                {!bidsLoading && bids.length === 0 && (
                  <div className="text-center py-12 text-gray-500">No bids found for this product</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewProducts;
