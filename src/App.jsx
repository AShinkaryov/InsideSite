import React, { useState } from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import QuestList from './components/QuestList/QuestList';
import BookingModal from './components/BookingModal/BookingModal';
import Footer from './components/Footer/Footer';
import initialQuests from "./props/quests.json";

const App = () => {
  const companyName = "ExtraQuest BY";
  const pageTitle = "Забронируй лучший квест в Минске";
  const pageSubtitle = "Живые эмоции, сложные загадки и профессиональные актеры";

  const [quests] = useState(initialQuests);
  const [selectedQuest, setSelectedQuest] = useState(null);

  return (
    <div className="app">
      <Header companyName={companyName} />
      <Hero title={pageTitle} subtitle={pageSubtitle} />
      <main>
        <QuestList 
          quests={quests} 
          onSelectQuest={setSelectedQuest}
        />
      </main>
      <BookingModal 
        quest={selectedQuest} 
        onClose={() => setSelectedQuest(null)} 
      />
      <Footer companyName={companyName} />
    </div>
  );
};

export default App;