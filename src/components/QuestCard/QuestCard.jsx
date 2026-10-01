import React from 'react';
import './QuestCard.css';

const QuestCard = ({ quest, onSelect }) => {
  return (
    <div className="quest-card">
      <img src={quest.image} alt={quest.title} className="quest-image" />
      <div className="quest-info">
        <span className="quest-genre">{quest.genre}</span>
        <h3>{quest.title}</h3>
        <p className="quest-desc">{quest.description}</p>
        <div className="quest-details">
          <span>⏱ {quest.duration}</span>
          <span>👥 {quest.players}</span>
          <span>⭐ {quest.rating}</span>
        </div>
        <div className="quest-footer">
          <span className="quest-price">{quest.price} BYN</span>
          <button className="book-btn" onClick={() => onSelect(quest)}>
            Подробнее
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestCard;