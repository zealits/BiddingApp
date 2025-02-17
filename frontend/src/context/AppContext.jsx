// src/context/AppContext.jsx
import React, { createContext, useState, useContext } from 'react';

// Create a context object
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  // Shared state: you can add more properties as needed.
  const [userData, setUserData] = useState(null); // e.g., logged-in user data
  const [bidInfo, setBidInfo] = useState(null); // e.g., current bid details

  // Functions to update the shared state
  const updateUserData = (data) => {
    setUserData(data);
  };

  const updateBidInfo = (data) => {
    setBidInfo(data);
  };

  const contextValue = {
    userData,
    bidInfo,
    updateUserData,
    updateBidInfo,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for using the context in components
export const useAppContext = () => useContext(AppContext);
