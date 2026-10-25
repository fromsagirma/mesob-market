import React from 'react';
import logo from "@/assets/logo.png";
import { getLogoSizeClasses } from "../../lib/brand.js";

const Logo = ({ size = "md" }) => {
  const sizeClasses = getLogoSizeClasses(size);

  return (
    <img
      src={logo}
      alt="Mesob Market Logo"
      className={`object-contain transition-transform duration-200 hover:scale-105 ${sizeClasses}`}
    />
  );
};

export default Logo;