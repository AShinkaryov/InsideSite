import React from 'react';
import './Footer.css';

const Footer = ({ companyName }) => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-content">
        <p>&copy; 2026 {companyName}. Все права защищены.</p>
        <p>Адрес: г. Могилёв, пер. Тани Карпинской 4б</p>
      </div>
    </footer>
  );
};

export default Footer;