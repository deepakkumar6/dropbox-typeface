import React, { useEffect } from "react";
import "./banner.css";

const Banner = ({ text, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 1000);
    return () => clearTimeout(timer);
  }, [text, onClose]);

  if (!text) return null;

  return (
    <div className={`banner banner-${type}`}>
      <span>{text}</span>
    </div>
  );
};

export default Banner;
