import React from 'react';
import './Header.css';

const Header = ({ companyName }) => {
  return (
    <header className="header">
      <div className="header-logo">
        <h1>{companyName}</h1>
      </div>
      <nav className="header-nav">
        <a href="#hero">Главная</a>
        <a href="#quests">Квесты</a>
        <a href="#footer">Контакты</a>
      </nav>
    </header>
  );
};

export default Header;