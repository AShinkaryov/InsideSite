import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Snackbar, Alert } from '@mui/material';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import BookingModal from './components/BookingModal/BookingModal';
import HomePage from './pages/HomePage';
import QuestDetailPage from './pages/QuestDetailPage';
import AdminPage from './pages/AdminPage';
import initialQuests from './props/quests.json';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    primary: {
      main: '#e74c3c',
    },
    error: {
      main: '#e74c3c',
    },
  },
});

const App = () => {
  const [quests, setQuests] = useState(initialQuests);
  const [favorites, setFavorites] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  
  // Уведомления (Snackbar)
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  const showToast = (message, severity = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleToggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
      showToast('Удалено из избранного', 'info');
    } else {
      setFavorites([...favorites, id]);
      showToast('Добавлено в избранное', 'success');
    }
  };

  const handleDeleteQuest = (id) => {
    setQuests(quests.filter(q => q.id !== id));
    showToast('Квест удалён из базы', 'warning');
  };

  const handleAddQuest = (newQuest) => {
    setQuests([newQuest, ...quests]);
    showToast('Новый квест успешно добавлен!', 'success');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header favoritesCount={favorites.length} />

        <main style={{ flexGrow: 1 }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <HomePage 
                  quests={quests} 
                  onSelectQuest={setSelectedQuest} 
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                />
              } 
            />
            <Route 
              path="/quest/:id" 
              element={
                <QuestDetailPage 
                  quests={quests} 
                  onSelectQuest={setSelectedQuest} 
                />
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminPage 
                  quests={quests} 
                  onDeleteQuest={handleDeleteQuest} 
                  onAddQuest={handleAddQuest} 
                />
              } 
            />
          </Routes>
        </main>

        <BookingModal 
          quest={selectedQuest} 
          onClose={() => setSelectedQuest(null)} 
          onConfirm={(msg) => showToast(msg, 'success')}
        />

        <Footer companyName="ExtraQuest BY" />

        {/* Компонент всплывающего уведомления */}
        <Snackbar 
          open={toast.open} 
          autoHideDuration={3000} 
          onClose={() => setToast({ ...toast, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert severity={toast.severity} variant="filled">
            {toast.message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
};

export default App;