// src/components/User/ProductList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // Fetch products from the backend
    axios
      .get('/api/products')
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => console.error(err));
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Available Products for Bidding
        </h1>
        {products.length === 0 ? (
          <p className="text-center text-gray-600">
            No products available for bidding at this time.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li
                key={product._id}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
              >
                {product.image && (
                  <img
                    src={`data:${product.imageContentType};base64,${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-4 rounded"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                </div>
                <Link
                  to={`/user/bid/${product._id}`}
                  className="mt-auto inline-block text-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
                >
                  Place Bid
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ProductList;
