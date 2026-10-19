import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Badge, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LanguageIcon from '@mui/icons-material/Language';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const favoriteCount = useSelector((state) => state.favorites?.items?.length || 0);

  const toggleLanguage = () => {
    const currentLang = i18n.language || 'ru';
    const nextLang = currentLang.startsWith('ru') ? 'en' : 'ru';
    i18n.changeLanguage(nextLang);
  };

  const currentLang = (i18n.language || 'ru').toUpperCase().slice(0, 2);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#181818', borderBottom: '1px solid #333' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ color: '#e74c3c', textDecoration: 'none', fontWeight: 'bold' }}
        >
          ExtraQuest BY
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Квесты с сердечком */}
          <Button color="inherit" component={Link} to="/">
            {t('quests', 'Квесты')}
            <Badge badgeContent={favoriteCount} color="error" sx={{ ml: 1.5 }}>
              <FavoriteIcon fontSize="small" />
            </Badge>
          </Button>

          {/* Иконка переключения языка */}
          <Tooltip title={`Язык: ${currentLang}`}>
            <IconButton 
              onClick={toggleLanguage} 
              color="inherit" 
              sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>

          {/* Кнопка админки */}
          <Button variant="contained" color="error" component={Link} to="/admin">
            {t('admin_panel', 'Админ-панель')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;