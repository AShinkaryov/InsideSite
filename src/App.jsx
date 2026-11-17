import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage';
import FavoritesPage from './pages/FavoritesPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import QuestDetailPage from './pages/QuestDetailPage';
import LoginPage from './pages/LoginPage';         // Страница входа
import RegisterPage from './pages/RegisterPage'; // Страница регистрации
import BookingModal from './components/BookingModal/BookingModal';

// Создание темной темы в стиле Material UI для квестов
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  const [selectedQuest, setSelectedQuest] = useState(null);

  // Безопасное извлечение списка квестов из Redux
  const quests = useSelector((state) => {
    if (Array.isArray(state.quests?.items)) return state.quests.items;
    if (Array.isArray(state.quests)) return state.quests;
    return [];
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh', 
          backgroundColor: 'background.default', 
          color: 'text.primary' 
        }}
      >
        {/* Шапка сайта */}
        <Header />
        
        {/* Основной контент с роутингом */}
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage onSelectQuest={setSelectedQuest} />} />
            
            {/* Страница избранных/понравившихся квестов */}
            <Route path="/favorites" element={<FavoritesPage onSelectQuest={setSelectedQuest} />} />

            {/* Админ-панель (управление сущностями, CRUD) */}
            <Route path="/admin" element={<AdminPage />} />

            {/* Маршруты авторизации и регистрации */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Страница подробной информации о квесте */}
            <Route 
              path="/quest/:id" 
              element={<QuestDetailPage quests={quests} onSelectQuest={setSelectedQuest} />} 
            />

            {/* Страница 404 для несуществующих маршрутов */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Box>
        
        {/* Подвал сайта */}
        <Footer />

        {/* Модальное окно бронирования квеста */}
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