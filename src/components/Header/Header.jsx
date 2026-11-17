import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Badge, 
  IconButton, 
  Tooltip, 
  Menu, 
  MenuItem, 
  Typography 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LanguageIcon from '@mui/icons-material/Language';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import logo from '../../assets/IQav-Photoroom.png';

const Header = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const favoriteCount = useSelector((state) => state.favorites?.items?.length || 0);

  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const toggleLanguage = () => {
    const currentLang = i18n.language || 'ru';
    const nextLang = currentLang.startsWith('ru') ? 'en' : 'ru';
    i18n.changeLanguage(nextLang);
  };

  const currentLang = (i18n.language || 'ru').toUpperCase().slice(0, 2);

  const handleAccountClick = (event) => {
    if (!user) {
      navigate('/login');
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    handleCloseMenu();
    navigate('/');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#181818', borderBottom: '1px solid #333' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Логотип */}
        <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', py: 1 }}>
          <img 
            src={logo} 
            alt="InsideQuest" 
            style={{ height: '38px', objectFit: 'contain' }} 
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Иконка Аккаунта / Входа */}
          <Tooltip title={user ? user.name : t('login', 'Войти в аккаунт')}>
            <IconButton 
              onClick={handleAccountClick} 
              color="inherit" 
              sx={{ color: user ? '#e74c3c' : '#aaa', '&:hover': { color: '#fff' } }}
            >
              <AccountCircleIcon fontSize="medium" />
            </IconButton>
          </Tooltip>

          {/* Меню профиля */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: { backgroundColor: '#222', color: '#fff', border: '1px solid #444', mt: 1 }
            }}
          >
            <MenuItem disabled sx={{ color: '#aaa !important', fontWeight: 'bold' }}>
              👤 {user?.name} {user?.isAdmin && '(Админ)'}
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ gap: 1, color: '#e74c3c' }}>
              <LogoutIcon fontSize="small" /> Выйти
            </MenuItem>
          </Menu>

          {/* Кнопка Понравившиеся */}
          <Button color="inherit" component={Link} to="/favorites">
            <Badge badgeContent={favoriteCount} color="error" sx={{ ml: 1.5 }}>
              <FavoriteIcon fontSize="small" />
            </Badge>
          </Button>

          {/* Переключение языка */}
          <Tooltip title={`Язык: ${currentLang}`}>
            <IconButton 
              onClick={toggleLanguage} 
              color="inherit" 
              sx={{ color: '#aaa', '&:hover': { color: '#fff' } }}
            >
              <LanguageIcon />
            </IconButton>
          </Tooltip>

          {/* Кнопка админки отображается ТОЛЬКО если пользователь авторизован и он админ */}
          {user && user.isAdmin && (
            <Button variant="contained" color="error" component={Link} to="/admin">
              {t('admin_panel', 'Админ-панель')}
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;