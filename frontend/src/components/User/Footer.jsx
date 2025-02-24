import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Container for vertical centering */}
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Divider with reduced width for better visual appeal */}
          <hr className="w-1/2 border-gray-700" />
          
          {/* Footer content */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-base text-gray-300">
              &copy; 2025 Scrap Bidding Application. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-2 text-base">
              <span>Powered by</span>
              <a
                href="https://aiiventure.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
              >
                aiiventure.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;