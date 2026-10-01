import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Tooltip,
  Container,
  Box
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ExploreIcon from '@mui/icons-material/Explore';

const Header = ({ favoritesCount = 0 }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#1a1a1a', boxShadow: 3 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          
          {/* Логотип */}
          <Box 
            onClick={() => navigate('/')} 
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: 1 }}
          >
            <ExploreIcon sx={{ color: '#e74c3c', fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff', letterSpacing: 1 }}>
              ExtraQuest <span style={{ color: '#e74c3c' }}>BY</span>
            </Typography>
          </Box>

          {/* Навигация */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button color="inherit" component={Link} to="/">
              Квесты
            </Button>
            
            <Tooltip title="Избранные квесты">
              <IconButton color="inherit" component={Link} to="/">
                <Badge badgeContent={favoritesCount} color="error">
                  <FavoriteIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Button 
              variant="outlined" 
              color="error" 
              startIcon={<AdminPanelSettingsIcon />}
              component={Link} 
              to="/admin"
            >
              Админ-панель
            </Button>
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;