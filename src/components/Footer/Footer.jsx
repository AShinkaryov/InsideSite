import React from 'react';
import { Box, Container, Typography, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import logo from '../../assets/IQav-Photoroom.png'; // Убедись, что путь к картинке верный

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: '#181818', 
        color: '#fff', 
        borderTop: '1px solid #333', 
        py: 4, 
        mt: 'auto' 
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1.2fr' }, 
            gap: 4, 
            alignItems: 'center' 
          }}
        >
          
          {/* 1. Левая колонка: Логотип-картинка и копирайт */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box component={Link} to="/" sx={{ display: 'inline-block', textDecoration: 'none' }}>
              <img 
                src={logo} 
                alt="InsideQuest" 
                style={{ height: '42px', objectFit: 'contain' }} 
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#aaa' }}>
              Погрузись в мир незабываемых эмоций и реальных приключений.
            </Typography>
            <Typography variant="caption" sx={{ color: '#666', mt: 1 }}>
              © 2026 InsideQuest. Все права защищены.
            </Typography>
          </Box>

          {/* 2. Центральная колонка: Номера телефонов и соцсети */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Контакты
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" sx={{ color: '#e74c3c' }} />
              <Typography variant="body2" sx={{ color: '#ccc' }}>+375 (29) 213-0-999</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon fontSize="small" sx={{ color: '#e74c3c' }} />
              <Typography variant="body2" sx={{ color: '#ccc' }}>+375 (33) 928-2-216</Typography>
            </Box>

            {/* Ссылки на соцсети */}
            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <MuiLink 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  color: '#fff', 
                  textDecoration: 'none', 
                  backgroundColor: '#222',
                  px: 1.5,
                  py: 0.8,
                  borderRadius: '20px',
                  border: '1px solid #333',
                  transition: '0.3s',
                  '&:hover': { color: '#e74c3c', borderColor: '#e74c3c', backgroundColor: '#2a1a1a' } 
                }}
              >
                <InstagramIcon fontSize="small" /> Instagram
              </MuiLink>

              <MuiLink 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  color: '#fff', 
                  textDecoration: 'none', 
                  backgroundColor: '#222',
                  px: 1.5,
                  py: 0.8,
                  borderRadius: '20px',
                  border: '1px solid #333',
                  transition: '0.3s',
                  '&:hover': { color: '#e74c3c', borderColor: '#e74c3c', backgroundColor: '#2a1a1a' } 
                }}
              >
                <MusicNoteIcon fontSize="small" /> TikTok
              </MuiLink>
            </Box>
          </Box>

          {/* 3. Правая колонка: Яндекс Карта */}
          <Box 
  sx={{ 
    width: '100%', 
    height: '160px', 
    borderRadius: '12px', 
    overflow: 'hidden', 
    border: '1px solid #333',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
    backgroundColor: '#181818'
  }}
>
  <iframe 
    title="InsideQuest Location"
    src="https://yandex.ru/map-widget/v1/?um=constructor%3A466a713b3ab82f5db2ace23b60f151302950ece26bc07544003c3db89d1168db&amp;source=constructor" 
    width="100%" 
    height="100%" 
    frameBorder="0"
    style={{ 
      border: 0,
      borderRadius: '12px',
      // Фильтры для приведения Яндекс Карты к тёмной теме сайта:
      filter: 'invert(90%) hue-rotate(180deg) brightness(85%) contrast(110%)'
    }}
    allowFullScreen={true}
  ></iframe>
</Box>

        </Box>
      </Container>
    </Box>
  );
};

export default Footer;