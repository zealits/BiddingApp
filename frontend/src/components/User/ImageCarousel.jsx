import React, { useState, useEffect } from 'react';

const ImageCarousel = ({ images, alt }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // When the currentIndex changes, reset the loaded state.
  useEffect(() => {
    setLoaded(false);
  }, [currentIndex]);

  // Guard for empty images array
  if (!images || images.length === 0) return null;

  return (
    <div className="relative mb-4">
      <div className="w-full h-40 overflow-hidden rounded">
        {console.log("Current image object:", images[currentIndex])}
        <img
          key={`carousel-image-${currentIndex}`}  // Force remount on index change
          src={`data:${images[currentIndex].contentType};base64,${images[currentIndex].data}`}
          alt={`${alt} - ${currentIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => {
            console.log("Image loaded");
            setLoaded(true);
          }}
        />
      </div>
      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === 0 ? images.length - 1 : prevIndex - 1
              )
            }
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-75 hover:opacity-100"
          >
            &#8249;
          </button>
          <button
            onClick={() =>
              setCurrentIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
              )
            }
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-700 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-75 hover:opacity-100"
          >
            &#8250;
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
