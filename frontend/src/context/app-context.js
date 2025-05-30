import React, { createContext, useContext } from "react";

const SUPPORTED_VIEW_FORMATS = [".txt", ".json", ".jpg", ".jpeg", ".png"];
const SUPPORTED_UPLOAD_FORMATS = [".txt",  ".pdf", ".docx", ".xlsx", ".png", ".jpg", ".jpeg", ".gif", ".pptx", ".zip", ".rar"];

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  const value = {
    backendUrl,
    supportedViewFormats: SUPPORTED_VIEW_FORMATS,
    supportedUploadFormats: SUPPORTED_UPLOAD_FORMATS,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
