import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import QuestDetailPage from './pages/QuestDetailPage';
import BookingModal from './components/BookingModal/BookingModal'; // Импортируем BookingModal для бронирования

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [selectedQuest, setSelectedQuest] = useState(null);

  // Достаем квесты из Redux для передачи в QuestDetailPage
  const quests = useSelector((state) => {
    if (Array.isArray(state.quests?.items)) return state.quests.items;
    if (Array.isArray(state.quests)) return state.quests;
    return [];
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#121212', color: '#fff' }}>
        <Header />
        
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage onSelectQuest={setSelectedQuest} />} />
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Страница подробной информации о квесте */}
            <Route 
              path="/quest/:id" 
              element={<QuestDetailPage quests={quests} onSelectQuest={setSelectedQuest} />} 
            />

            {/* Страница 404 для несуществующих маршрутов */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
        
        <Footer />

        {/* Модальное окно бронирования времени */}
        {selectedQuest && (
          <BookingModal
            open={Boolean(selectedQuest)}
            onClose={() => setSelectedQuest(null)}
            quest={selectedQuest}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}

export default App;