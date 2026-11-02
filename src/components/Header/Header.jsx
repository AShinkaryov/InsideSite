import React from 'react';
import { AppBar, Toolbar, Button, Box, Badge, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LanguageIcon from '@mui/icons-material/Language';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/IQav-Photoroom.png'; // Убедись, что путь к картинке верный

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
        {/* Логотип-картинка вместо текста */}
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', py: 1 }}>
          <img 
            src={logo} 
            alt="InsideQuest" 
            style={{ height: '38px', objectFit: 'contain' }} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Кнопка Квесты */}
          <Button color="inherit" component={Link} to="/">
            {t('quests', 'Квесты')}
          </Button>

          {/* Кнопка Понравившиеся с сердечком и бэйджем */}
          <Button color="inherit" component={Link} to="/favorites">
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