import React from 'react';

export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-6 py-3 bg-blue-600 text-white text-lg rounded-xl shadow-md hover:bg-blue-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
