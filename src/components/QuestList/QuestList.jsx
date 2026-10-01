import React from 'react';
import QuestCard from '../QuestCard/QuestCard';
import './QuestList.css';

const QuestList = ({ quests, onSelectQuest }) => {
  return (
    <section id="quests" className="quest-list-section">
      <h2>Доступные квесты</h2>
      <div className="quest-grid">
        {quests.map((quest) => (
          <QuestCard 
            key={quest.id} 
            quest={quest} 
            onSelect={onSelectQuest}
          />
        ))}
      </div>
    </section>
  );
};

export default QuestList;