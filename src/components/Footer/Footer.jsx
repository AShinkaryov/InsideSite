import React from 'react';
import './Footer.css';

const Footer = ({ companyName }) => {
  return (
    <footer id="footer" className="footer">
      <div className="footer-content">
        <p>&copy; 2026 {companyName}. Все права защищены.</p>
        <p>Адрес: г. Минск, ул. Квестов, д. 10</p>
      </div>
    </footer>
  );
};

export default Footer;