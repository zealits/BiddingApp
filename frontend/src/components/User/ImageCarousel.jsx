import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ImageCarousel = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Reset loaded state whenever the current index changes.
  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  // Guard clause for empty images array.
  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative mb-4">
      <div className="w-full h-70 overflow-hidden rounded">
        <img
          key={`carousel-image-${currentIndex}`} // Force remount on index change
          src={`data:${currentImage.contentType};base64,${currentImage.data}`}
          alt={`${alt} - ${currentIndex + 1}`}
          
          className={`w-full h-full object-cover transition-opacity duration-300
          }`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous image"
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-75 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            &#8249;
          </button>
          <button
            onClick={handleNext}
            aria-label="Next image"
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-75 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  );
};

ImageCarousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      contentType: PropTypes.string.isRequired,
      data: PropTypes.string.isRequired,
    })
  ).isRequired,
  alt: PropTypes.string.isRequired,
};

export default ImageCarousel;
