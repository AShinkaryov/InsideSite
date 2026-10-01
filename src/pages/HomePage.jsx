import React, { useState } from 'react';
import {
  Container,
  Grid,
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
    <Box sx={{ pb: 6 }}>
      <Hero 
        title="Забронируй лучший квест в Минске" 
        subtitle="Живые эмоции, сложные загадки и профессиональные актеры" 
      />

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Фильтры и поиск */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            mb: 4, 
            flexDirection: { xs: 'column', sm: 'row' },
            backgroundColor: '#262626',
            p: 2.5,
            borderRadius: 2
          }}
        >
          <TextField
            fullWidth
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

        {/* Сетка квестов */}
        {filteredQuests.length === 0 ? (
          <Typography align="center" variant="h6" color="gray" sx={{ py: 6 }}>
            Ничего не найдено по вашему запросу.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredQuests.map((quest) => (
              <Grid item key={quest.id} xs={12} sm={6} md={4}>
                <QuestCard
                  quest={quest}
                  onSelectQuest={onSelectQuest}
                  isFavorite={favorites.includes(quest.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;