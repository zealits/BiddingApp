import React, { useEffect } from 'react';

const PopupModal = ({ message, type = "info", onClose }) => {
  // Enhanced color scheme
  const config = {
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-300",
      textColor: "text-red-800",
      iconColor: "text-red-500",
      buttonBg: "bg-red-600 hover:bg-red-700",
      title: "Error"
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-300", 
      textColor: "text-blue-800",
      iconColor: "text-blue-500",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      title: "Information"
    },
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-800", 
      iconColor: "text-green-500",
      buttonBg: "bg-green-600 hover:bg-green-700",
      title: "Success"
    },
    warning: {
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-800",
      iconColor: "text-yellow-500",
      buttonBg: "bg-yellow-600 hover:bg-yellow-700",
      title: "Warning"
    }
  };

  const { bgColor, borderColor, textColor, iconColor, buttonBg, title } = config[type] || config.info;

  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Icon based on type
  const Icon = () => {
    switch(type) {
      case 'error':
        return (
          <svg className={`w-8 h-8 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'success':
        return (
          <svg className={`w-8 h-8 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`w-8 h-8 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className={`w-8 h-8 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop with blur effect */}
      <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div 
        className={`${bgColor} rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden transform transition-all duration-300 ease-in-out animate-fade-in-up border ${borderColor}`}
      >
        {/* Header with colored strip */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="mr-3">
            <Icon />
          </div>
          <h2 className={`text-lg font-bold ${textColor}`}>
            {title}
          </h2>
        </div>
        
        {/* Body */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed">{message}</p>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium text-white ${buttonBg} shadow-sm transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Add CSS for animation
const modalStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate3d(0, 20px, 0);
    }
    to {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
  }
`;

// You can insert this style in your global CSS or add it here
const styleElement = document.createElement('style');
styleElement.textContent = modalStyles;
document.head.appendChild(styleElement);

export default PopupModal;