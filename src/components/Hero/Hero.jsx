import React from 'react';
import './Hero.css';

const Hero = ({ title, subtitle }) => {
  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <a href="#quests" className="hero-btn">Выбрать квест</a>
      </div>
    </section>
  );
};

export default Hero;