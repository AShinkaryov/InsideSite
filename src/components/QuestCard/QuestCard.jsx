import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Rating,
  Stack
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import { useTranslation } from 'react-i18next';

const QuestCard = ({ quest, onSelectQuest, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card 
      sx={{ 
        width: '100%',
        height: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        backgroundColor: '#1f1f1f',
        color: '#fff',
        borderRadius: 2.5,
        boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 20px rgba(231, 76, 60, 0.3)',
        }
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={quest.image}
          alt={quest.title}
          sx={{ objectFit: 'cover' }}
        />
        <Chip 
          label={quest.genre} 
          color="error" 
          size="small" 
          sx={{ position: 'absolute', top: 10, left: 10, fontWeight: 'bold' }} 
        />
        <IconButton 
          onClick={() => onToggleFavorite && onToggleFavorite(quest.id)}
          size="small"
          sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', color: isFavorite ? '#e74c3c' : '#fff' }}
        >
          {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </IconButton>
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold', 
            fontSize: '1rem',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {quest.title}
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Rating value={quest.rating} precision={0.1} size="small" readOnly />
          <Typography variant="caption" color="gray">({quest.rating})</Typography>
        </Stack>

        <Typography 
          variant="body2" 
          color="#aaa" 
          sx={{ 
            fontSize: '0.85rem',
            lineHeight: 1.35,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 1
          }}
        >
          {quest.description}
        </Typography>

        <Stack direction="row" spacing={2} color="#888" sx={{ mt: 'auto' }}>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <AccessTimeIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{quest.duration}</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap={0.5}>
            <GroupIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">{quest.players}</Typography>
          </Stack>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2, pt: 0 }}>
        <Typography variant="subtitle1" sx={{ color: '#e74c3c', fontWeight: 'bold' }}>
          {quest.price} {t('price', 'BYN')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Кнопка ИНФО -> Переход на страницу подробного описания (/quest/:id) */}
          <Button 
            size="small" 
            variant="outlined" 
            color="inherit" 
            onClick={() => navigate(`/quest/${quest.id}`)}
          >
            {t('btn_info', 'Инфо')}
          </Button>

          {/* Кнопка БРОНЬ -> Открывает модальное окно бронирования времени */}
          <Button 
            size="small" 
            variant="contained" 
            color="error" 
            onClick={() => onSelectQuest(quest)}
          >
            {t('btn_book', 'Забронировать')}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default QuestCard;