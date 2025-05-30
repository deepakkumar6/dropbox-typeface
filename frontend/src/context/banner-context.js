import React, { createContext, useContext, useState, useCallback } from "react";

export const BannerContext = createContext();

export const useBanner = () => useContext(BannerContext);

export const BannerProvider = ({ children }) => {
  const [banner, setBanner] = useState({ text: "", type: "" });

  const showBanner = useCallback((text, type = "info") => {
    setBanner({ text, type });
    setTimeout(() => {
      setBanner({ text: "", type: "" });
    }, 10000);
  }, []);

  return (
    <BannerContext.Provider value={{ banner, showBanner }}>
      {children}
    </BannerContext.Provider>
  );
};
