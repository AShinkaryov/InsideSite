import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Typography, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import QuestCard from '../components/QuestCard/QuestCard';
import { toggleFavorite } from '../store/favoritesSlice';

const FavoritesPage = ({ onSelectQuest }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Достаем квесты из Redux
  const quests = useSelector((state) => {
    if (Array.isArray(state.quests?.items)) return state.quests.items;
    if (Array.isArray(state.quests)) return state.quests;
    return [];
  });

  // Достаем массив ID избранных квестов
  const favoriteIds = useSelector((state) => state.favorites?.items || []);

  // Фильтруем только те квесты, ID которых есть в favoriteIds
  const favoriteQuests = quests.filter((quest) => favoriteIds.includes(quest.id));

  const handleToggleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
        {t('favorites_title', 'Понравившиеся квесты')}
      </Typography>

      {favoriteQuests.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            },
            gap: 3,
            width: '100%',
          }}
        >
          {favoriteQuests.map((quest) => (
            <QuestCard
              key={quest.id}
              quest={quest}
              onSelectQuest={onSelectQuest}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="gray" sx={{ mb: 2 }}>
            {t('no_favorites', 'У вас пока нет избранных квестов')}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage;