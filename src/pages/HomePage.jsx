import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Button,
  Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import QuestCard from '../components/QuestCard/QuestCard';
import { toggleFavorite } from '../store/favoritesSlice';

const HomePage = ({ onSelectQuest }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const quests = useSelector((state) => {
    if (Array.isArray(state.quests?.items)) return state.quests.items;
    if (Array.isArray(state.quests)) return state.quests;
    return [];
  });

  const favoriteIds = useSelector((state) => state.favorites?.items || []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('none');

  const handleToggleFavorite = (id) => {
    dispatch(toggleFavorite(id));
  };

  const filteredQuests = quests
    .filter((quest) =>
      quest.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((quest) =>
      selectedGenre === 'all' ? true : quest.genre === selectedGenre
    )
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'ratingDesc') return b.rating - a.rating;
      return 0;
    });

  return (
    <Box sx={{ width: '100%' }}>
      {/* Баннер с фоновым изображением */}
      <Box
        sx={{
          py: 10,
          px: 2,
          textAlign: 'center',
          position: 'relative',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1600&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderBottom: '1px solid #333',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: '#fff' }}>
            {t('hero_title', 'Забронируй лучший квест в Минске')}
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, color: '#ddd' }}>
            {t('hero_subtitle', 'Живые эмоции, сложные загадки и профессиональные актеры')}
          </Typography>
          <Button
            variant="contained"
            color="error"
            size="large"
            href="#catalog"
            sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
          >
            {t('btn_choose', 'Выбрать квест')}
          </Button>
        </Container>
      </Box>

      {/* Каталог и фильтры */}
      <Container maxWidth="lg" id="catalog" sx={{ py: 6 }}>
        {/* Панель фильтров */}
        <Paper sx={{ p: 3, mb: 4, backgroundColor: '#1f1f1f', color: '#fff', width: '100%', boxSizing: 'border-box' }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, width: '100%' }}>
            {/* Поиск */}
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('search_placeholder', 'Поиск квеста по названию...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'gray', mr: 1 }} />,
              }}
              size="small"
              sx={{ flex: { md: 2 } }}
            />

            {/* Выбор жанра */}
            <FormControl fullWidth size="small" sx={{ flex: { md: 1 } }}>
              <InputLabel id="genre-label" sx={{ color: '#aaa' }}>
                {t('genre', 'Жанр')}
              </InputLabel>
              <Select
                labelId="genre-label"
                value={selectedGenre}
                label={t('genre', 'Жанр')}
                onChange={(e) => setSelectedGenre(e.target.value)}
                sx={{ color: '#fff' }}
              >
                <MenuItem value="all">{t('all_genres', 'Все жанры')}</MenuItem>
                <MenuItem value="Хоррор">Хоррор</MenuItem>
                <MenuItem value="Детектив">Детектив</MenuItem>
                <MenuItem value="Приключения">Приключения</MenuItem>
                <MenuItem value="Мистика">Мистика</MenuItem>
              </Select>
            </FormControl>

            {/* Сортировка */}
            <FormControl fullWidth size="small" sx={{ flex: { md: 1 } }}>
              <InputLabel id="sort-label" sx={{ color: '#aaa' }}>
                {t('sort', 'Сортировка')}
              </InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                label={t('sort', 'Сортировка')}
                onChange={(e) => setSortBy(e.target.value)}
                sx={{ color: '#fff' }}
              >
                <MenuItem value="none">{t('sort_default', 'По умолчанию')}</MenuItem>
                <MenuItem value="priceAsc">{t('sort_price_asc', 'Сначала дешевле')}</MenuItem>
                <MenuItem value="priceDesc">{t('sort_price_desc', 'Сначала дороже')}</MenuItem>
                <MenuItem value="ratingDesc">{t('sort_rating', 'По рейтингу')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Стабильная CSS Grid сетка карточек */}
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
          {filteredQuests.length > 0 ? (
            filteredQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onSelectQuest={onSelectQuest}
                isFavorite={favoriteIds.includes(quest.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))
          ) : (
            <Typography variant="h6" align="center" color="gray" sx={{ py: 6, gridColumn: '1 / -1' }}>
              {t('no_quests_found', 'Квесты не найдены')}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;