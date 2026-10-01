import React, { useState } from 'react';
import {
  Container,
  TextField,
  MenuItem,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QuestCard from '../components/QuestCard/QuestCard';
import Hero from '../components/Hero/Hero';

const HomePage = ({ quests, onSelectQuest, favorites, onToggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Все');

  const genres = ['Все', 'Хоррор', 'Детектив', 'Приключения', 'Фантастика'];

  const filteredQuests = quests.filter((quest) => {
    const matchesSearch = quest.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = selectedGenre === 'Все' || quest.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <Box sx={{ pb: 6, width: '100%' }}>
      <Hero 
        title="Забронируй лучший квест в Минске" 
        subtitle="Живые эмоции, сложные загадки и профессиональные актеры" 
      />

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Панель поиска и фильтров */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 4, 
            flexDirection: { xs: 'column', sm: 'row' },
            backgroundColor: '#262626',
            p: 2,
            borderRadius: 2
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Поиск квеста по названию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#aaa' }} />
                </InputAdornment>
              ),
              style: { color: '#fff' }
            }}
          />

          <TextField
            select
            size="small"
            label="Жанр"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            sx={{ minWidth: { sm: 200 }, '.MuiSelect-select': { color: '#fff' } }}
            InputLabelProps={{ style: { color: '#aaa' } }}
          >
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>
                {genre}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Нативная CSS Grid сетка */}
        {filteredQuests.length === 0 ? (
          <Typography align="center" variant="h6" color="gray" sx={{ py: 6 }}>
            Ничего не найдено по вашему запросу.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
            }}
          >
            {filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onSelectQuest={onSelectQuest}
                isFavorite={favorites.includes(quest.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;