import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ImageCarousel from "./ImageCarousel";
import { ChevronLeft, ChevronRight, Package, Timer, ArrowRight } from "lucide-react";

// Helper function to calculate time left until deadline
const calculateTimeLeft = (deadline) => {
  const total = new Date(deadline) - new Date();
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / (1000 * 60)) % 60);
  return { total, days, hours, minutes };
};

// Countdown component updates every minute based on the deadline prop
const Countdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline));
    }, 60000); // update every minute

    return () => clearInterval(timer);
  }, [deadline]);

  if (timeLeft.total <= 0) {
    return <span className="text-sm font-medium">Ended</span>;
  }

  let display;
  if (timeLeft.days > 0) {
    display = `${timeLeft.days} day${timeLeft.days > 1 ? "s" : ""} left`;
  } else if (timeLeft.hours > 0) {
    display = `${timeLeft.hours} hour${timeLeft.hours > 1 ? "s" : ""} left`;
  } else if (timeLeft.minutes > 0) {
    display = `${timeLeft.minutes} minute${timeLeft.minutes > 1 ? "s" : ""} left`;
  } else {
    display = "Less than a minute left";
  }

  return <span className="text-sm font-medium">{display}</span>;
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/products?page=${page}&limit=6`)
      .then((response) => {
        setProducts(response.data.products);
        setTotalPages(response.data.pages);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
            Available commodity
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover unique items and place your bids on our carefully curated collection
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-e-gray-900"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">No products available for bidding at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {product.images && product.images.length > 0 && (
                  <div className="relative w-full aspect-[4/3]">
                    <ImageCarousel images={product.images} alt={product.name} />
                  </div>
                )}

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                    </div>
                    <div className="flex items-center gap-1 text-black">
                      <Timer className="w-4 h-4" />
                      {/* Use the deadline property from the database */}
                      <Countdown deadline={product.deadline} />
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 line-clamp-3">{product.description}</p>

                  {product.specifications && product.specifications.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Specifications</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {product.specifications.map((spec, index) => (
                          <div key={index} className="bg-gray-50 p-2 rounded-lg">
                            <div className="text-xs text-gray-500">{spec.key}</div>
                            <div className="text-sm font-medium text-gray-900">{spec.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link
                    to={`/user/bid/${product._id}`}
                    className="mt-auto flex items-center justify-center gap-2 bg-gray-900 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-black hover:shadow-md group"
                  >
                    Place Bid
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition duration-200"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    page === pageNum ? "bg-gray-900 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition duration-200"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductList;
