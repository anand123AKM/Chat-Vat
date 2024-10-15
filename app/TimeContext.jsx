import React, { createContext, useState } from "react";

// Create a context
export const DateContext = createContext();

// Create a provider component
export const DateProvider = ({ children }) => {
  const [date, setDate] = useState(null);

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};
