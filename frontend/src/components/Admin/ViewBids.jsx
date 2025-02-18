import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsError, setBidsError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`/api/admin/products?page=${page}&limit=10`, {
          headers: { 'x-auth-token': token }
        });
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setError('');
      } catch (err) {
        console.error('Error fetching products', err);
        setError('Error fetching products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  const fetchBids = async (productId) => {
    try {
      setBidsLoading(true);
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`/api/admin/products/${productId}/bids`, {
        headers: { 'x-auth-token': token }
      });
      setBids(res.data);
      setBidsError('');
      setSelectedProduct(productId);
    } catch (err) {
      console.error('Error fetching bids', err);
      setBidsError('Error fetching bids. Please try again.');
    } finally {
      setBidsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md my-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">View Products</h2>
      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-red-600 text-center">{error}</p>}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <img src={product.images[0]?.data} alt={product.name} loading="lazy" className="h-40 w-full object-cover rounded" />
              <h3 className="text-lg font-bold mt-2">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.description}</p>
              <button
                onClick={() => fetchBids(product._id)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:bg-blue-600 transition"
              >
                View Bids
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="bg-gray-300 px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
      {selectedProduct && (
        <div className="mt-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Bids for Selected Product</h3>
          {bidsLoading && <p className="text-center text-gray-500">Loading bids...</p>}
          {bidsError && <p className="text-red-600 text-center">{bidsError}</p>}
          {!bidsLoading && bids.length > 0 && (
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Verified</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr key={bid._id} className="border-t border-gray-200">
                    <td className="py-3 px-4">{bid.email}</td>
                    <td className="py-3 px-4">{bid.phone}</td>
                    <td className="py-3 px-4">{bid.price}</td>
                    <td className="py-3 px-4">{bid.isVerified ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
