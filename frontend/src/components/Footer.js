import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <p>&copy; 2025 MEAtec. All Rights Reserved.</p>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#000',
  color: '#fff',
  textAlign: 'center',
  padding: '20px',
  position: 'relative', // or simply remove this line
};


export default Footer;
