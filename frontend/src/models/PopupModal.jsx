// PopupModal.jsx
import React from 'react';

const PopupModal = ({ message, type = "info", onClose }) => {
  const bgColor = type === "error" ? "bg-red-100" : "bg-green-100";
  const textColor = type === "error" ? "text-red-800" : "text-green-800";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="bg-white p-6 rounded-lg z-10 shadow-lg max-w-sm w-full">
        <h2 className={`text-lg font-bold mb-4 ${textColor}`}>
          {type === "error" ? "Error" : "Success"}
        </h2>
        <p className="text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-800 text-white px-4 py-2 rounded hover:bg-black transition duration-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PopupModal;
