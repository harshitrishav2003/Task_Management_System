import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-md ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="mt-2">{children}</div>;
};
