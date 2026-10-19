import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', py: 10 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        {/* Текстовая иконка предупреждения */}
        <Typography sx={{ fontSize: '80px', lineHeight: 1 }}>
          ⚠️
        </Typography>

        <Typography variant="h1" sx={{ fontWeight: 'bold', color: '#fff', fontSize: { xs: '4rem', md: '6rem' } }}>
          404
        </Typography>

        <Typography variant="h5" sx={{ color: '#aaa', mb: 2 }}>
          {t('page_not_found', 'Страница не найдена')}
        </Typography>

        <Typography variant="body1" sx={{ color: '#888', mb: 4, maxWidth: 450 }}>
          {t('page_not_found_desc', 'Запрошенная страница не существует или была перемещена.')}
        </Typography>

        <Button
          component={Link}
          to="/"
          variant="contained"
          color="error"
          size="large"
          sx={{ px: 4, py: 1.5, fontWeight: 'bold' }}
        >
          {t('go_home', 'На главную')}
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;