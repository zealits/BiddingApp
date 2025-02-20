import React from "react";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-gray-800 to-blue-500 min-h-screen flex items-center justify-center text-white px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Turn Scrap into <span className="text-yellow-400">Opportunity</span>
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-8">
          Your trusted platform for buying and selling scrap materials
        </p>

        {/* Search Bar */}
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-3 rounded-lg flex items-center gap-2 max-w-xl mx-auto shadow-xl">
          <input
            type="text"
            placeholder="Search for scrap materials..."
            className="flex-1 p-3 text-gray-900 outline-none border-none rounded-md bg-transparent placeholder-gray-300"
          />
          <button className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-500 transition-all">
            Search
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-3 md:gap-4 flex-wrap mt-8 text-black">
          {[
            "Metal Scrap",
            "Electronic Waste",
            "Industrial Surplus",
            "Vehicle Parts",
          ].map((category, index) => (
            <span
              key={index}
              className="bg-white text-black bg-opacity-25 px-4 py-2 rounded-full cursor-pointer text-sm md:text-base transition-all hover:bg-opacity-40 transform hover:-translate-y-1 backdrop-blur-lg shadow-md"
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
