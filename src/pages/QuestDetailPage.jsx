import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  Rating,
  Paper,
  Breadcrumbs,
  Divider,
  Stack
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import SpeedIcon from '@mui/icons-material/Speed';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const QuestDetailPage = ({ quests, onSelectQuest }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const quest = quests.find((q) => q.id === Number(id));

  if (!quest) {
    return (
      <Container sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Квест не найден!</Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
          На главную
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Хлебные крошки */}
      <Breadcrumbs sx={{ mb: 3, color: '#aaa' }}>
        <Link to="/" style={{ color: '#aaa', textDecoration: 'none' }}>Главная</Link>
        <Typography color="#fff">{quest.title}</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, backgroundColor: '#262626', color: '#fff', borderRadius: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={quest.image}
              alt={quest.title}
              sx={{ width: '100%', borderRadius: 2, maxHeight: 400, objectFit: 'cover' }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={quest.genre} color="error" />
                <Chip label={quest.difficulty || "Средний"} variant="outlined" color="warning" />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {quest.title}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                <Rating value={quest.rating} precision={0.1} readOnly />
                <Typography color="gray">({quest.rating} из 5)</Typography>
              </Stack>

              <Divider sx={{ borderColor: '#444' }} />

              <Stack direction="row" spacing={3}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <AccessTimeIcon color="error" />
                  <Typography>{quest.duration}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <GroupIcon color="error" />
                  <Typography>{quest.players}</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <SpeedIcon color="error" />
                  <Typography>{quest.difficulty || "Средний"}</Typography>
                </Stack>
              </Stack>

              <Typography variant="body1" color="#ccc" sx={{ mt: 2 }}>
                {quest.longDescription || quest.description}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
                <Typography variant="h4" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
                  {quest.price} BYN
                </Typography>
                
                <Button 
                  variant="contained" 
                  color="error" 
                  size="large"
                  onClick={() => onSelectQuest(quest)}
                >
                  Забронировать
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      <Button 
        startIcon={<ArrowBackIcon />} 
        sx={{ mt: 3, color: '#aaa' }} 
        onClick={() => navigate('/')}
      >
        Назад к списку квестов
      </Button>
    </Container>
  );
};

export default QuestDetailPage;