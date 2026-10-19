import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Typography, Box, Button, Paper, Grid } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Временные мок-данные для сетки расписания
const scheduleData = [
  { 
    id: 1, date: '06 октября', day: 'Вторник', 
    slots: [
      { time: '16:50', price: 90, available: true }, { time: '18:00', price: 90, available: true },
      { time: '19:10', price: 90, available: true }, { time: '20:20', price: 90, available: true }
    ] 
  },
  { 
    id: 2, date: '07 октября', day: 'Среда', 
    slots: [
      { time: '16:50', price: 90, available: true }, { time: '18:00', price: 90, available: true },
      { time: '19:10', price: 90, available: true }, { time: '20:20', price: 90, available: true }
    ] 
  },
  { 
    id: 3, date: '08 октября', day: 'Четверг', 
    slots: [
      { time: '16:50', price: 0, available: false }, { time: '18:00', price: 90, available: true },
      { time: '19:10', price: 90, available: true }, { time: '20:20', price: 90, available: true }
    ] 
  },
  { 
    id: 4, date: '10 октября', day: 'Суббота', 
    slots: [
      { time: '12:00', price: 0, available: false }, { time: '13:10', price: 0, available: false },
      { time: '14:20', price: 0, available: false }, { time: '20:10', price: 90, available: true },
      { time: '21:20', price: 90, available: true }
    ] 
  },
];

const QuestBookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Получаем квест из Redux по ID из URL
  const quest = useSelector((state) => {
    const items = Array.isArray(state.quests?.items) ? state.quests.items : state.quests;
    return items?.find(q => q.id === Number(id)) || { title: 'Неизвестный квест' };
  });

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3, color: '#aaa' }}
      >
        Назад к квестам
      </Button>

      <Paper sx={{ p: 4, backgroundColor: '#fff', color: '#000', borderRadius: 2 }}>
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2 }}>
          Забронировать квест "{quest.title}"
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
          <Button variant="text" sx={{ color: '#666' }}>← раньше</Button>
          <Button variant="text" sx={{ color: '#666' }}>позже →</Button>
        </Box>

        <Typography variant="body2" sx={{ mb: 4, color: '#666' }}>
          Нажмите на желаемое время, чтобы забронировать игру / узнать окончательную цену.
        </Typography>

        {scheduleData.map((row) => (
          <Grid container key={row.id} sx={{ borderBottom: '1px solid #eee', py: 2, alignItems: 'center' }}>
            <Grid item xs={12} sm={3} sx={{ mb: { xs: 2, sm: 0 } }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1rem' }}>{row.date}</Typography>
              <Typography sx={{ color: row.day === 'Суббота' || row.day === 'Воскресенье' ? '#e74c3c' : '#666' }}>
                {row.day}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {row.slots.map((slot, index) => (
                  <Button
                    key={index}
                    disabled={!slot.available}
                    variant={slot.available ? "contained" : "outlined"}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: '70px',
                      p: 1,
                      textTransform: 'none',
                      backgroundColor: slot.available ? '#ffcc80' : '#f5f5f5',
                      color: slot.available ? '#000' : '#ccc',
                      borderColor: '#eee',
                      '&:hover': {
                        backgroundColor: slot.available ? '#ffb74d' : '#f5f5f5',
                      }
                    }}
                  >
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: 1 }}>
                      {slot.time}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                      {slot.available ? `от ${slot.price} руб.` : 'Занято'}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </Grid>
          </Grid>
        ))}
      </Paper>
    </Container>
  );
};

export default QuestBookingPage;