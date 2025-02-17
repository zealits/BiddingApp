// src/components/User/VerifyEmail.jsx
import React from 'react';

const VerifyEmail = ({ handleEmailVerify, verificationMessage }) => {
  return (
    <div className="mt-3 flex items-center">
      <button
        type="button"
        onClick={handleEmailVerify}
        className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        Verify Email
      </button>
      {verificationMessage && (
        <span className="ml-3 text-sm text-gray-600">{verificationMessage}</span>
      )}
    </div>
  );
};

export default VerifyEmail;
